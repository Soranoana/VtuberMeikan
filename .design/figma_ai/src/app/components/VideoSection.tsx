import { useEffect, useRef, useState, useCallback } from 'react';
import { AlertCircle, Play } from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
    _ytReadyCallbacks?: Array<() => void>;
  }
}

interface VideoInfo {
  videoId: string;
  isVertical: boolean;
}

type VideoState = 'waiting' | 'playing' | 'done' | 'error';

function parseVideoInfo(url: string): VideoInfo | null {
  const isVertical = url.includes('/shorts/') || url.includes('vertical=1');

  const shortsMatch = url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/);
  if (shortsMatch) return { videoId: shortsMatch[1], isVertical: true };

  const embedMatch = url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{11})/);
  if (embedMatch) return { videoId: embedMatch[1], isVertical };

  const ytMatch = url.match(/(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return { videoId: ytMatch[1], isVertical };

  return null;
}

interface Props {
  videoUrls: string[];
  profileId: string;
}

export function VideoSection({ videoUrls, profileId }: Props) {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const playersRef  = useRef<Map<number, any>>(new Map());
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestInfos = useRef<VideoInfo[]>([]);

  const [videoStates, setVideoStates] = useState<VideoState[]>([]);
  const [apiReady,    setApiReady]    = useState(!!window.YT?.Player);

  const videoInfos    = videoUrls.map(parseVideoInfo).filter(Boolean) as VideoInfo[];
  latestInfos.current = videoInfos;
  const videoInfosKey = videoUrls.join(',');

  // ---- 中央動画インデックスを求める ----
  const findCenterIdx = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return -1;
    const cr = container.getBoundingClientRect();
    const cx = cr.left + cr.width / 2;
    let best = -1, bestDist = Infinity;
    Array.from(container.children).forEach((child, i) => {
      const r = child.getBoundingClientRect();
      if (r.right < cr.left || r.left > cr.right) return; // 見えていない
      const dist = Math.abs(r.left + r.width / 2 - cx);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    return best;
  }, []);

  // ---- 特定インデックスを再生 ----
  const playIdx = useCallback((idx: number) => {
    // エラー・範囲外はスキップ
    const infos = latestInfos.current;
    let target = idx;
    while (target < infos.length) {
      const p = playersRef.current.get(target);
      if (p?.playVideo) break;
      target++;
    }
    if (target >= infos.length) return;

    // 他を停止
    playersRef.current.forEach((p, i) => {
      if (i !== target) p?.pauseVideo?.();
    });

    playersRef.current.get(target)?.playVideo?.();
    setVideoStates(prev => {
      const next = [...prev];
      next.forEach((_, i) => { if (next[i] === 'playing') next[i] = 'waiting'; });
      next[target] = 'playing';
      return next;
    });
  }, []);

  // ---- スクロール停止後に再生対象を決定 ----
  const onScroll = useCallback(() => {
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      const container = scrollRef.current;
      if (!container) return;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const atLeft  = scrollLeft <= 1;
      const atRight = scrollLeft + clientWidth >= scrollWidth - 1;

      let target: number;
      if (atLeft)  target = 0;
      else if (atRight) target = latestInfos.current.length - 1;
      else { const c = findCenterIdx(); target = c !== -1 ? c : 0; }

      playIdx(target);
    }, 250);
  }, [findCenterIdx, playIdx]);

  // ---- セクションが画面外→停止、再表示→中央動画を再開 ----
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          playersRef.current.forEach(p => p?.pauseVideo?.());
          setVideoStates(prev => prev.map(s => s === 'playing' ? 'waiting' : s));
        } else {
          // 再表示時：スクロール位置から再生対象を決定して再開
          const container = scrollRef.current;
          if (!container) return;
          const { scrollLeft, scrollWidth, clientWidth } = container;
          const atLeft  = scrollLeft <= 1;
          const atRight = scrollLeft + clientWidth >= scrollWidth - 1;
          let target: number;
          if (atLeft)       target = 0;
          else if (atRight) target = latestInfos.current.length - 1;
          else { const c = findCenterIdx(); target = c !== -1 ? c : 0; }
          playIdx(target);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [findCenterIdx, playIdx]);

  // ---- YouTube IFrame API ロード ----
  useEffect(() => {
    const markReady = () => setApiReady(true);
    if (window.YT?.Player) { markReady(); return; }
    if (!window._ytReadyCallbacks) window._ytReadyCallbacks = [];
    window._ytReadyCallbacks.push(markReady);
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        window._ytReadyCallbacks?.forEach(cb => cb());
        window._ytReadyCallbacks = [];
      };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    }
    return () => {
      window._ytReadyCallbacks = window._ytReadyCallbacks?.filter(cb => cb !== markReady) ?? [];
    };
  }, []);

  // ---- プレイヤー初期化 ----
  useEffect(() => {
    if (!apiReady || videoInfos.length === 0) return;
    playersRef.current.forEach(p => p?.destroy?.());
    playersRef.current.clear();
    setVideoStates(videoInfos.map(() => 'waiting' as VideoState));

    const timer = setTimeout(() => {
      let readyCount = 0;
      const total = latestInfos.current.length;

      latestInfos.current.forEach((info, idx) => {
        const player = new window.YT.Player(`yt-${profileId}-${idx}`, {
          videoId: info.videoId,
          playerVars: { mute: 1, controls: 1, rel: 0, modestbranding: 1, playsinline: 1 },
          events: {
            onReady: () => {
              readyCount++;
              // 全プレイヤー準備完了後、スクロール位置に応じた動画を再生
              if (readyCount === total) {
                setTimeout(() => {
                  const container = scrollRef.current;
                  if (!container) { playIdx(0); return; }
                  const { scrollLeft, scrollWidth, clientWidth } = container;
                  const atLeft  = scrollLeft <= 1;
                  const atRight = scrollLeft + clientWidth >= scrollWidth - 1;
                  if (atLeft)       playIdx(0);
                  else if (atRight) playIdx(latestInfos.current.length - 1);
                  else { const c = findCenterIdx(); playIdx(c !== -1 ? c : 0); }
                }, 200);
              }
            },
            onStateChange: (e: any) => {
              if (e.data === window.YT?.PlayerState?.PLAYING) {
                setVideoStates(prev => { const n=[...prev]; n[idx]='playing'; return n; });
              }
              if (e.data === window.YT?.PlayerState?.ENDED) {
                setVideoStates(prev => { const n=[...prev]; n[idx]='done'; return n; });
                const total = latestInfos.current.length;
                // 最後の動画なら先頭に戻る、それ以外は次へ
                let next = idx + 1 >= total ? 0 : idx + 1;
                const retry = setInterval(() => {
                  const p = playersRef.current.get(next);
                  if (p?.playVideo) {
                    clearInterval(retry);
                    playIdx(next);
                    const el = scrollRef.current?.children[next] as HTMLElement | undefined;
                    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  } else {
                    next = (next + 1) % total;
                  }
                }, 200);
              }
            },
            onError: () => {
              setVideoStates(prev => { const n=[...prev]; n[idx]='error'; return n; });
              // エラーなら次へ
              let next = idx + 1;
              const retry = setInterval(() => {
                if (next >= latestInfos.current.length) { clearInterval(retry); return; }
                const p = playersRef.current.get(next);
                if (p?.playVideo) { clearInterval(retry); playIdx(next); }
                else next++;
              }, 200);
            },
          },
        });
        playersRef.current.set(idx, player);
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      playersRef.current.forEach(p => p?.destroy?.());
      playersRef.current.clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiReady, videoInfosKey, profileId]);

  if (videoInfos.length === 0) return null;

  return (
    <div ref={sectionRef} className="space-y-3">
      {/* 進捗インジケーター */}
      <div className="flex gap-1.5 flex-wrap items-center justify-center">
        {videoInfos.map((_, idx) => {
          const s = videoStates[idx] ?? 'waiting';
          return (
            <button
              key={idx}
              title={`動画 ${idx + 1}${s === 'error' ? '（再生不可）' : ''}`}
              onClick={() => {
                playIdx(idx);
                const el = scrollRef.current?.children[idx] as HTMLElement | undefined;
                el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
              }}
              className={`rounded-full transition-all duration-300 ${
                s === 'playing' ? 'w-8 h-2.5 bg-blue-500' :
                                  'w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300'
              }`}
            />
          );
        })}
      </div>

      {/* 横スクロール動画一覧 — py-8 でスケール＋影が上下に収まるスペースを確保 */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex gap-4 overflow-x-auto py-8 pb-10 px-12"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {videoInfos.map((info, idx) => {
          const s = videoStates[idx] ?? 'waiting';
          return (
            <div
              key={`${profileId}-${idx}`}
              className={`flex-shrink-0 rounded-lg overflow-hidden relative transition-all duration-300 ${
                s === 'error' ? 'shadow-sm opacity-50' : 'shadow-md'
              }`}
              style={{
                scrollSnapAlign: 'center',
                width:  info.isVertical ? '180px' : '320px',
                height: info.isVertical ? '320px' : '180px',
                ...(s === 'playing' ? {
                  transform: 'scale(1.02)',
                  boxShadow: '0 0 0 2px rgba(96,165,250,0.85), 0 0 20px 4px rgba(96,165,250,0.45)',
                } : {}),
              }}
            >
              <div id={`yt-${profileId}-${idx}`} style={{ width: '100%', height: '100%' }} />


              {/* 待機中オーバーレイ */}
              {(s === 'waiting' || s === 'done') && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/25 cursor-pointer gap-1"
                  onClick={() => {
                    playIdx(idx);
                    const el = scrollRef.current?.children[idx] as HTMLElement | undefined;
                    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }}
                >
                  <Play className="w-9 h-9 text-white drop-shadow" />
                  {s === 'done' && <span className="text-white text-xs">再度再生</span>}
                </div>
              )}

              {/* エラー */}
              {s === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 gap-1 pointer-events-none">
                  <AlertCircle className="w-7 h-7 text-red-400" />
                  <span className="text-xs text-gray-500 text-center px-2">再生できません</span>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
