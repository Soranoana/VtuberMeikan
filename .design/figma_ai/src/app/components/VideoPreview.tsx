import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Youtube } from 'lucide-react';

interface VideoMeta {
  title: string;
  thumbnailUrl: string;
}

// YouTube の動画IDを各形式のURLから抽出
function extractYouTubeId(url: string): string | null {
  if (!url.trim()) return null;
  try {
    const u = new URL(url);
    // youtu.be/ID
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0] || null;
    // youtube.com/shorts/ID
    const shortsMatch = u.pathname.match(/^\/shorts\/([^/?]+)/);
    if (shortsMatch) return shortsMatch[1];
    // youtube.com/embed/ID
    const embedMatch = u.pathname.match(/^\/embed\/([^/?]+)/);
    if (embedMatch) return embedMatch[1];
    // youtube.com/watch?v=ID
    const v = u.searchParams.get('v');
    if (v) return v;
  } catch {
    // 不正なURL
  }
  return null;
}

function thumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

const cache = new Map<string, VideoMeta | 'error'>();

async function fetchMeta(videoId: string): Promise<VideoMeta | null> {
  const hit = cache.get(videoId);
  if (hit) return hit === 'error' ? null : hit;

  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    const meta: VideoMeta = {
      title: data.title ?? '',
      thumbnailUrl: data.thumbnail_url ?? thumbnailUrl(videoId),
    };
    cache.set(videoId, meta);
    return meta;
  } catch {
    cache.set(videoId, 'error');
    return null;
  }
}

interface VideoPreviewProps {
  url: string;
}

export function VideoPreview({ url }: VideoPreviewProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [meta, setMeta] = useState<VideoMeta | null>(null);

  useEffect(() => {
    const id = extractYouTubeId(url);
    if (!id) {
      setState('idle');
      setMeta(null);
      return;
    }

    // キャッシュ済みなら即反映
    const hit = cache.get(id);
    if (hit && hit !== 'error') {
      setMeta(hit);
      setState('ok');
      return;
    }
    if (hit === 'error') {
      // サムネイルだけは表示できる
      setMeta({ title: '', thumbnailUrl: thumbnailUrl(id) });
      setState('error');
      return;
    }

    setState('loading');
    setMeta({ title: '', thumbnailUrl: thumbnailUrl(id) });

    let cancelled = false;
    fetchMeta(id).then(result => {
      if (cancelled) return;
      if (result) {
        setMeta(result);
        setState('ok');
      } else {
        setMeta({ title: '', thumbnailUrl: thumbnailUrl(id) });
        setState('error');
      }
    });
    return () => { cancelled = true; };
  }, [url]);

  if (state === 'idle') return null;

  return (
    <div className="flex items-start gap-3 mt-2 bg-gray-50 border border-gray-200 rounded-lg p-2.5">
      {/* サムネイル */}
      <div className="relative flex-shrink-0 w-28 rounded overflow-hidden bg-gray-200 aspect-video">
        {meta?.thumbnailUrl ? (
          <img
            src={meta.thumbnailUrl}
            alt="thumbnail"
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Youtube className="w-6 h-6 text-gray-400" />
          </div>
        )}
        {/* YouTube アイコンバッジ */}
        <div className="absolute bottom-1 right-1 bg-red-600 rounded px-1 py-0.5">
          <Youtube className="w-2.5 h-2.5 text-white" />
        </div>
      </div>

      {/* タイトル / ステータス */}
      <div className="flex-1 min-w-0">
        {state === 'loading' && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            タイトルを取得中...
          </div>
        )}
        {state === 'ok' && meta?.title && (
          <p className="text-xs font-medium text-gray-700 leading-snug line-clamp-2">{meta.title}</p>
        )}
        {state === 'error' && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            タイトルを取得できませんでした
          </div>
        )}
      </div>
    </div>
  );
}
