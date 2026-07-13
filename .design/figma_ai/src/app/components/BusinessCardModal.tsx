import { useEffect } from 'react';
import { VTuberProfile } from '../App';
import { useApp } from '../context/AppContext';

function extractHandle(url: string): string {
  try {
    const u = new URL(url);
    const atMatch = u.pathname.match(/\/@?([^/]+)/);
    if (atMatch) return `@${atMatch[1]}`;
    return u.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function PlatformIcon({ icon, className }: { icon: string; className?: string }) {
  if (icon === 'youtube') return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
  if (icon === 'x' || icon === 'twitter') return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
  if (icon === 'tiktok') return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  );
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

interface Props {
  profile: VTuberProfile;
  onClose: () => void;
}

export function BusinessCardModal({ profile, onClose }: Props) {
  const { pushModal, popModal } = useApp();
  useEffect(() => { pushModal(); return popModal; }, []);

  const image = profile.imageUrls?.[0] ?? profile.imageUrl;

  const snsLinks = profile.snsLinks?.filter(l => l.url.trim()) ?? (() => {
    const links: { icon: string; label: string; url: string }[] = [];
    if (profile.youtubeUrl) links.push({ icon: 'youtube', label: 'YouTube', url: profile.youtubeUrl });
    if (profile.xUrl)       links.push({ icon: 'x',       label: 'X',       url: profile.xUrl });
    if (profile.tiktokUrl)  links.push({ icon: 'tiktok',  label: 'TikTok',  url: profile.tiktokUrl });
    if (profile.websiteUrl) links.push({ icon: 'globe',   label: 'Web',     url: profile.websiteUrl });
    return links;
  })();

  /*
    aspect-ratio を保ちながら画面いっぱいに拡大する。
    CSS の min() を使って「縦横どちらかが 100vw/100vh に接する」サイズを計算。
      横向き (91:55): w = min(100vw, 100vh * 91/55),  h = min(100vh, 100vw * 55/91)
      縦向き (55:91): w = min(100vw, 100vh * 55/91),  h = min(100vh, 100vw * 91/55)
  */
  const landscapeStyle = {
    width:  'min(100vw, calc(100vh * 91 / 55))',
    height: 'min(100vh, calc(100vw * 55 / 91))',
  } as React.CSSProperties;

  const portraitStyle = {
    width:  'min(100vw, calc(100vh * 55 / 91))',
    height: 'min(100vh, calc(100vw * 91 / 55))',
  } as React.CSSProperties;

  return (
    /* オーバーレイ全体＋カード自体どこクリックでも閉じる */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
      onClick={onClose}
    >
      {/* ── モバイル縦向き（sm 未満） ── */}
      <div
        className="sm:hidden flex flex-col bg-white shadow-2xl overflow-hidden"
        style={portraitStyle}
      >
        <CardContent profile={profile} image={image} snsLinks={snsLinks} portrait />
      </div>

      {/* ── PC横向き（sm 以上） ── */}
      <div
        className="hidden sm:flex flex-row bg-white shadow-2xl overflow-hidden"
        style={landscapeStyle}
      >
        <CardContent profile={profile} image={image} snsLinks={snsLinks} portrait={false} />
      </div>
    </div>
  );
}

interface ContentProps {
  profile: VTuberProfile;
  image: string | undefined;
  snsLinks: { icon: string; label: string; url: string }[];
  portrait: boolean;
}

function CardContent({ profile, image, snsLinks, portrait }: ContentProps) {
  return (
    <>
      {/* 画像パネル */}
      <div
        className={`
          relative flex-shrink-0 overflow-hidden
          bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]
          flex items-center justify-center
          ${portrait ? 'w-full h-[38%]' : 'h-full w-[38%]'}
        `}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute top-4 left-4 w-0.5 h-14 bg-white/20 rounded-full" />

        {image ? (
          <div className={`
            rounded-full overflow-hidden border-4 border-white/30 shadow-xl
            ${portrait ? 'w-[22%] aspect-square' : 'w-[38%] aspect-square'}
          `}>
            <img src={image} alt={profile.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className={`
            rounded-full bg-white/10 border-4 border-white/30 shadow-xl
            flex items-center justify-center text-white font-bold
            ${portrait ? 'w-[22%] aspect-square text-2xl' : 'w-[38%] aspect-square text-3xl'}
          `}>
            {profile.name.charAt(0)}
          </div>
        )}

        {portrait
          ? <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
          : <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400" />
        }
      </div>

      {/* 情報パネル */}
      <div className={`
        flex-1 flex flex-col justify-between bg-white
        ${portrait ? 'px-[6%] py-[5%]' : 'px-[6%] py-[6%]'}
      `}>
        <div>
          {profile.nickname && (
            <p className="text-[min(1.8vw,10px)] text-gray-400 tracking-widest font-light leading-none mb-1">
              {profile.nickname}
            </p>
          )}
          <h2 className="font-bold leading-snug break-words text-gray-900 text-[min(5vw,28px)]">
            {profile.name}
          </h2>

          <div className="mt-[3%] space-y-[1.5%]">
            {profile.affiliation && (
              <div className="flex items-center gap-[1.5%]">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                <p className="text-[min(2.5vw,14px)] text-gray-500 leading-tight">{profile.affiliation}</p>
              </div>
            )}
            {profile.activityGenre && (
              <div className="flex items-center gap-[1.5%]">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                <p className="text-[min(2vw,12px)] text-gray-400 leading-tight">{profile.activityGenre}</p>
              </div>
            )}
          </div>
        </div>

        {snsLinks.length > 0 && (
          <div className="mt-[4%]">
            <div className="w-[10%] h-px bg-gray-200 mb-[3%]" />
            <div className="space-y-[2%]">
              {snsLinks.slice(0, 4).map((link, i) => (
                <div key={i} className="flex items-center gap-[2%]">
                  <PlatformIcon icon={link.icon} className="flex-shrink-0 text-gray-400 w-[min(3vw,16px)] h-[min(3vw,16px)]" />
                  <span className="text-[min(2.2vw,13px)] text-gray-500 truncate">
                    {extractHandle(link.url) || link.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-[4%] flex items-center justify-between">
          <div className="flex items-center gap-[1.5%]">
            <div className="w-[min(3vw,16px)] h-[min(3vw,16px)] rounded-sm bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black" style={{ fontSize: 'min(1.5vw, 8px)' }}>V</span>
            </div>
            <span className="text-[min(1.8vw,10px)] text-gray-300 tracking-wider">VTuber名鑑</span>
          </div>
          {profile.debut && (
            <span className="text-[min(1.8vw,10px)] text-gray-300">since {profile.debut}</span>
          )}
        </div>
      </div>
    </>
  );
}
