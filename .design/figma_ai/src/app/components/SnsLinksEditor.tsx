import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, X, Link } from 'lucide-react';

export interface SnsLink {
  id: string;
  icon: string;
  label: string;
  url: string;
}

export const SNS_ICON_OPTIONS = [
  { value: 'none',        label: '（アイコンなし）' },
  { value: 'youtube',     label: 'YouTube' },
  { value: 'x',           label: 'X（旧Twitter）' },
  { value: 'tiktok',      label: 'TikTok' },
  { value: 'instagram',   label: 'Instagram' },
  { value: 'twitch',      label: 'Twitch' },
  { value: 'twitcasting', label: 'ツイキャス' },
  { value: 'facebook',    label: 'Facebook' },
  { value: 'discord',     label: 'Discord' },
  { value: 'steam',       label: 'Steam' },
  { value: 'iriam',       label: 'イリアム' },
  { value: 'streaming',   label: '配信プラットフォーム' },
  { value: 'sns',         label: 'SNS' },
  { value: 'line',      label: 'LINE' },
  { value: 'niconico',  label: 'ニコニコ' },
  { value: 'globe',     label: 'Webサイト' },
  { value: 'link',      label: 'その他リンク' },
];

export function SnsIconDisplay({ icon, className = 'w-5 h-5' }: { icon: string; className?: string }) {
  switch (icon) {
    case 'youtube':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000"/>
        </svg>
      );
    case 'x':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="black"/>
        </svg>
      );
    case 'tiktok':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.84 1.56V6.82a4.85 4.85 0 0 1-1.07-.13z" fill="black"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" fill="url(#ig-gradient)"/>
          <defs>
            <linearGradient id="ig-gradient" x1="0" y1="24" x2="24" y2="0">
              <stop offset="0%" stopColor="#f09433"/>
              <stop offset="25%" stopColor="#e6683c"/>
              <stop offset="50%" stopColor="#dc2743"/>
              <stop offset="75%" stopColor="#cc2366"/>
              <stop offset="100%" stopColor="#bc1888"/>
            </linearGradient>
          </defs>
        </svg>
      );
    case 'twitch':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" fill="#9147FF"/>
        </svg>
      );
    case 'facebook':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
        </svg>
      );
    case 'discord':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" fill="#5865F2"/>
        </svg>
      );
    case 'line':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" fill="#06C755"/>
        </svg>
      );
    case 'steam':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.718L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" fill="#1b2838"/>
        </svg>
      );
    case 'twitcasting':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#2DABE0"/>
          <path d="M12 5C8.134 5 5 8.134 5 12s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 2a5 5 0 1 1 0 10A5 5 0 0 1 12 7zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="white"/>
          <circle cx="18.5" cy="5.5" r="2" fill="#FF4B4B"/>
        </svg>
      );
    case 'iriam':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#FF6B9D"/>
          <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm-1 13V8l6 3.5-6 4.5z" fill="white"/>
        </svg>
      );
    case 'sns':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" fill="#EC4899" stroke="none"/>
          <circle cx="6" cy="12" r="3" fill="#EC4899" stroke="none"/>
          <circle cx="18" cy="19" r="3" fill="#EC4899" stroke="none"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      );
    case 'streaming':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="13" rx="2"/>
          <path d="M8 21h8M12 17v4"/>
          <circle cx="12" cy="10.5" r="2.5" fill="#6366F1" stroke="none"/>
          <path d="M7.5 6.5C9 5.2 10.4 4.5 12 4.5s3 .7 4.5 2" stroke="#6366F1" strokeWidth="1.5" fill="none"/>
        </svg>
      );
    case 'niconico':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.5 14.5c0 1.381-1.119 2.5-2.5 2.5h-6C7.619 17 6.5 15.881 6.5 14.5v-5C6.5 8.119 7.619 7 9 7h6c1.381 0 2.5 1.119 2.5 2.5v5z" fill="#231815"/>
          <path d="M10.5 10h-1v4h1v-4zm4 0h-1v4h1v-4z" fill="white"/>
        </svg>
      );
    case 'globe':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#4A90D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      );
    default:
      return <Link className={`${className} text-gray-400`} />;
  }
}

interface SnsLinksEditorProps {
  links: SnsLink[];
  onChange: (links: SnsLink[]) => void;
}

let idCounter = 0;
export function newSnsLink(): SnsLink {
  return { id: `sns-${++idCounter}-${Date.now()}`, icon: 'none', label: '', url: '' };
}

export function SnsLinksEditor({ links, onChange }: SnsLinksEditorProps) {
  const add = () => onChange([...links, newSnsLink()]);

  const remove = (id: string) => onChange(links.filter(l => l.id !== id));

  const update = (id: string, fields: Partial<SnsLink>) =>
    onChange(links.map(l => l.id === id ? { ...l, ...fields } : l));

  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <div key={link.id} className="border-2 border-blue-100 rounded-lg p-3 space-y-2 bg-blue-50/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 font-medium">リンク {index + 1}</span>
            <button
              type="button"
              onClick={() => remove(link.id)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* アイコン選択 + ラベル */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 sm:w-48 sm:flex-shrink-0">
              <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                {link.icon !== 'none' && <SnsIconDisplay icon={link.icon} className="w-5 h-5" />}
              </div>
              <select
                value={link.icon}
                onChange={e => {
                  const newIcon = e.target.value;
                  const opt = SNS_ICON_OPTIONS.find(o => o.value === newIcon);
                  const autoLabel = link.label === '' && opt && newIcon !== 'none' ? opt.label : link.label;
                  update(link.id, { icon: newIcon, label: autoLabel });
                }}
                className="flex-1 px-2 py-1.5 border border-blue-200 rounded-md text-sm bg-white focus:border-blue-400 focus:outline-none"
              >
                {SNS_ICON_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <Input
              value={link.label}
              onChange={e => update(link.id, { label: e.target.value })}
              placeholder="ラベル（自由入力）"
              className="border-blue-200 focus:border-blue-400 bg-white text-sm"
            />
          </div>

          {/* URL */}
          <Input
            value={link.url}
            onChange={e => update(link.id, { url: e.target.value })}
            placeholder="https://..."
            className="border-blue-200 focus:border-blue-400 bg-white text-sm"
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={add}
        className="border-blue-300 text-blue-700 hover:bg-blue-50"
      >
        <Plus className="w-4 h-4 mr-2" />
        リンクを追加
      </Button>
    </div>
  );
}
