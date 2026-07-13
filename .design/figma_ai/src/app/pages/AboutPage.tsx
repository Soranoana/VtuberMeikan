import { BookOpen, Youtube, ExternalLink } from 'lucide-react';
import { Card } from '../components/ui/card';

// ---- X (Twitter) icon ----
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ---- YouTube icon ----
function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// ---- 静的データ ----
// ユーザー情報を編集する場合はここを変更してください

interface ThanksUser {
  name: string;
  platform: 'x' | 'youtube';
  url: string;
  thumbnailUrl: string;
  description?: string;
}

const SPECIAL_THANKS: ThanksUser[] = [
  {
    name: 'Machio_Kinniku',
    platform: 'x',
    url: 'https://x.com/Machio_Kinniku',
    thumbnailUrl: '',
  },
  {
    name: 'JoeTitor',
    platform: 'youtube',
    url: 'https://www.youtube.com/@JoeTitor',
    thumbnailUrl: '',
  },
];

const THANKS: ThanksUser[] = [
  {
    name: 'MrBeast',
    platform: 'x',
    url: 'https://x.com/MrBeast',
    thumbnailUrl: '',
  },
  {
    name: 'AI Channel',
    platform: 'youtube',
    url: 'https://www.youtube.com/@AIChannel',
    thumbnailUrl: '',
  },
];

// ---- サブコンポーネント ----
function ThanksCard({ user }: { user: ThanksUser }) {
  return (
    <a
      href={user.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 bg-white border-2 border-[#E8DFC4] rounded-xl hover:border-[#D4C5A9] hover:bg-[#FFFEF8] transition-all group"
    >
      <div className="relative flex-shrink-0">
        <img
          src={user.thumbnailUrl}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-[#D4C5A9]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=D4C5A9&color=8B7355`;
          }}
        />
        <span
          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${
            user.platform === 'youtube' ? 'bg-red-500' : 'bg-black'
          }`}
        >
          {user.platform === 'youtube'
            ? <YoutubeIcon className="w-2.5 h-2.5 text-white" />
            : <XIcon className="w-2.5 h-2.5 text-white" />}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#3a3a3a] truncate group-hover:text-[#8B7355] transition-colors">{user.name}</p>
        {user.description && (
          <p className="text-xs text-[#6b6b6b] truncate">{user.description}</p>
        )}
      </div>
      <ExternalLink className="w-4 h-4 text-[#A69885] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

function EmptyThanks() {
  return (
    <p className="text-sm text-[#A69885] italic py-2">（準備中）</p>
  );
}

// ---- メインコンポーネント ----
export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* ページタイトル */}
      <div className="flex items-center gap-3">
        <BookOpen className="w-7 h-7 text-[#8B7355]" />
        <h1 className="text-2xl sm:text-3xl text-[#3a3a3a]">このサイトについて</h1>
      </div>

      {/* サイト説明 */}
      <Card className="bg-white border-2 border-[#E8DFC4] shadow-md">
        <div className="p-6 sm:p-8 space-y-4">
          <h2 className="text-xl text-[#8B7355]">VTuber名鑑とは</h2>
          <div className="space-y-3 text-[#3a3a3a] leading-relaxed">
            <p>
              VTuber名鑑は、バーチャルYouTuber（VTuber）の情報をみんなで作り上げる、ウィキ形式のファンサイトです。
            </p>
            <p>
              好きなVTuberのプロフィールを登録・編集して、より多くの人に届けましょう。
              ログインしなくても閲覧でき、ログインすることで編集・いいねなどの機能が使えます。
            </p>
            <p>
              本サイトはファンによる非公式サイトです。掲載情報の正確性については保証できかねます。
              公式情報については各VTuberの公式チャンネル・SNSをご確認ください。
            </p>
          </div>

          <div className="pt-4 border-t border-[#E8DFC4] grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#A69885] font-medium mb-1">開設</p>
              <p className="text-[#3a3a3a]">2024年11月</p>
            </div>
            <div>
              <p className="text-[#A69885] font-medium mb-1">運営</p>
              <p className="text-[#3a3a3a]">名鑑管理人</p>
            </div>
            <div>
              <p className="text-[#A69885] font-medium mb-1">お問い合わせ</p>
              <a href="/contact" className="text-[#8B7355] hover:underline">お問い合わせフォーム</a>
            </div>
            <div>
              <p className="text-[#A69885] font-medium mb-1">ステータス</p>
              <span className="inline-flex items-center gap-1.5 text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                開発中（WIP）
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* スペシャルサンクス */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">✨</span>
          <h2 className="text-xl text-[#3a3a3a]">スペシャルサンクス</h2>
        </div>
        <Card className="bg-[#FFFEF8] border-2 border-[#E8DFC4] shadow-md">
          <div className="p-5">
            {SPECIAL_THANKS.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SPECIAL_THANKS.map((user, i) => (
                  <ThanksCard key={i} user={user} />
                ))}
              </div>
            ) : (
              <EmptyThanks />
            )}
          </div>
        </Card>
      </section>

      {/* サンクス */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🙏</span>
          <h2 className="text-xl text-[#3a3a3a]">サンクス</h2>
        </div>
        <Card className="bg-[#FFFEF8] border-2 border-[#E8DFC4] shadow-md">
          <div className="p-5">
            {THANKS.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THANKS.map((user, i) => (
                  <ThanksCard key={i} user={user} />
                ))}
              </div>
            ) : (
              <EmptyThanks />
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
