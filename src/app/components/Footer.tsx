import { Home, Search, Plus, Mail, Twitter, Github, Youtube } from 'lucide-react';
import { useRouter } from 'next/router';

export function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-[#FFFEF8] border-t-2 border-[#D4C5A9] mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左側：サイトマップ */}
          <div>
            <h3 className="text-lg font-semibold text-[#8B7355] mb-4">サイトマップ</h3>
            <nav className="space-y-2">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#8B7355] hover:bg-[#F4E9D6] transition-all duration-200 px-3 py-2 rounded-lg w-full text-left group"
              >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">トップ</span>
              </button>
              <button
                onClick={() => router.push('/search')}
                className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#8B7355] hover:bg-[#F4E9D6] transition-all duration-200 px-3 py-2 rounded-lg w-full text-left group"
              >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">検索</span>
              </button>
              <button
                onClick={() => router.push('/new')}
                className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#8B7355] hover:bg-[#F4E9D6] transition-all duration-200 px-3 py-2 rounded-lg w-full text-left group"
              >
                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">新規Vtuber登録</span>
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#8B7355] hover:bg-[#F4E9D6] transition-all duration-200 px-3 py-2 rounded-lg w-full text-left group"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">問い合わせ</span>
              </button>
            </nav>
          </div>

          {/* 右側：管理人情報 */}
          <div>
            <h3 className="text-lg font-semibold text-[#8B7355] mb-4">管理人情報</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B7355] to-[#A69885] flex items-center justify-center text-white shadow-md">
                  管
                </div>
                <div>
                  <div className="text-[#3a3a3a] font-medium">プロフィール帳管理人</div>
                  <div className="text-sm text-[#A69885]">VTuber応援隊</div>
                </div>
              </div>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">
                VTuberさんの魅力を記録・共有するプロフィール帳です。みんなで素敵なVTuberさんを見つけましょう！
              </p>
              {/* ソーシャルリンク */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://twitter.com/vtuber_profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-[#E8DFC4] hover:bg-[#D4C5A9] transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-[#8B7355]" />
                </a>
                <a
                  href="https://github.com/vtuber-profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-[#E8DFC4] hover:bg-[#D4C5A9] transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5 text-[#8B7355]" />
                </a>
                <a
                  href="https://www.youtube.com/@vtuber-profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-[#E8DFC4] hover:bg-[#D4C5A9] transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5 text-[#8B7355]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-8 pt-6 border-t border-[#D4C5A9] text-center text-sm text-[#A69885]">
          <p>&copy; 2024 VTuberプロフィール帳. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
