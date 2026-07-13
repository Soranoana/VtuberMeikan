import { Home, Search, Plus, Mail, Twitter, Github, Youtube, BookOpen, Globe, Check, ChevronDown, ScrollText } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/languages';

export function Footer() {
  const navigate = useNavigate();
  const { language, setLanguage } = useApp();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langOpen]);

  const currentLang = LANGUAGES.find(l => l.code === language) ?? LANGUAGES[0];

  return (
    <footer className="bg-[#FFFEF8] border-t-2 border-[#D4C5A9] mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左側：サイトマップ */}
          <div>
            <h3 className="text-lg font-semibold text-[#8B7355] mb-4">サイトマップ</h3>
            <nav className="space-y-2">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#8B7355] hover:bg-[#F4E9D6] transition-all duration-200 px-3 py-2 rounded-lg w-full text-left group"
              >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">トップ</span>
              </button>
              <button
                onClick={() => navigate('/search')}
                className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#8B7355] hover:bg-[#F4E9D6] transition-all duration-200 px-3 py-2 rounded-lg w-full text-left group"
              >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">検索</span>
              </button>
              <button
                onClick={() => navigate('/new')}
                className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#8B7355] hover:bg-[#F4E9D6] transition-all duration-200 px-3 py-2 rounded-lg w-full text-left group"
              >
                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">新規Vtuber登録</span>
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#8B7355] hover:bg-[#F4E9D6] transition-all duration-200 px-3 py-2 rounded-lg w-full text-left group"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">問い合わせ</span>
              </button>
              <button
                onClick={() => navigate('/about')}
                className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#8B7355] hover:bg-[#F4E9D6] transition-all duration-200 px-3 py-2 rounded-lg w-full text-left group"
              >
                <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">このサイトについて</span>
              </button>
              <button
                onClick={() => navigate('/terms')}
                className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#8B7355] hover:bg-[#F4E9D6] transition-all duration-200 px-3 py-2 rounded-lg w-full text-left group"
              >
                <ScrollText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">利用規約</span>
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
                  <div className="text-[#3a3a3a] font-medium">名鑑管理人</div>
                  <div className="text-sm text-[#A69885]">VTuber応援隊</div>
                </div>
              </div>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">
                VTuberさんの魅力を記録・共有する名鑑です。みんなで素敵なVTuberさんを見つけましょう！
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

        {/* コピーライト + 言語切り替え */}
        <div className="mt-8 pt-6 border-t border-[#D4C5A9] flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[#A69885]">
          <p>&copy; 2026 VTuber名鑑. All rights reserved. WIP</p>
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(o => !o)}
              aria-label="表示言語を選択"
              aria-expanded={langOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D4C5A9] hover:border-[#8B7355] hover:text-[#8B7355] hover:bg-[#F4E9D6] transition-all duration-200"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="font-medium tracking-wide">{currentLang.nativeLabel}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* 上方向に展開 */}
            {langOpen && (
              <div className="absolute bottom-full mb-2 right-0 bg-white border-2 border-[#D4C5A9] rounded-xl shadow-xl overflow-hidden min-w-[140px]">
                <div className="px-3 py-2 border-b border-[#E8DFC4] text-[10px] text-[#A69885] font-medium tracking-widest uppercase">
                  言語 / Language
                </div>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm hover:bg-[#F4E9D6] transition-colors text-left"
                  >
                    <span className={language === lang.code ? 'text-[#8B7355] font-semibold' : 'text-[#3a3a3a]'}>
                      {lang.nativeLabel}
                    </span>
                    {language === lang.code && (
                      <Check className="w-3.5 h-3.5 text-[#8B7355] flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
