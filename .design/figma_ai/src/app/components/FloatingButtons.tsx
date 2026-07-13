import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Globe, ArrowUp, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/languages';

export function FloatingButtons() {
  const { language, setLanguage, isMuted, setIsMuted, modalCount } = useApp();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langOpen]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const toggleMute = () => setIsMuted(!isMuted);

  const currentLang = LANGUAGES.find(l => l.code === language) ?? LANGUAGES[0];

  const btnBase =
    'w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-offset-2';

  if (modalCount > 0) return null;

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 items-center">
      {/* スクロールトップ */}
      <button
        onClick={scrollToTop}
        aria-label="ページ最上部へ戻る"
        className={`${btnBase} bg-white border-[#D4C5A9] text-[#8B7355] hover:bg-[#F4E9D6] focus:ring-[#D4C5A9] ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        } transition-all duration-300`}
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* 言語切り替え（ドロップダウン） */}
      <div ref={langRef} className="relative">
        <button
          onClick={() => setLangOpen(o => !o)}
          aria-label="表示言語を選択"
          aria-expanded={langOpen}
          className={`${btnBase} bg-white border-[#D4C5A9] text-[#8B7355] hover:bg-[#F4E9D6] focus:ring-[#D4C5A9] ${
            langOpen ? 'bg-[#F4E9D6] border-[#8B7355]' : ''
          }`}
        >
          <div className="flex flex-col items-center leading-none">
            <Globe className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] font-bold tracking-wide">{currentLang.code.toUpperCase()}</span>
          </div>
        </button>

        {/* ドロップダウンパネル（左方向に展開） */}
        {langOpen && (
          <div className="absolute bottom-0 right-14 bg-white border-2 border-[#D4C5A9] rounded-xl shadow-xl overflow-hidden min-w-[140px]">
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

      {/* 音声オンオフ */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? '音声をオンにする' : '音声をオフにする'}
        title={isMuted ? '音声オン' : 'ミュート'}
        className={`${btnBase} focus:ring-[#D4C5A9] ${
          isMuted
            ? 'bg-white border-[#D4C5A9] text-[#A69885] hover:bg-[#F4E9D6]'
            : 'bg-[#8B7355] border-[#8B7355] text-white hover:bg-[#6B5945]'
        }`}
      >
        {isMuted
          ? <VolumeX className="w-5 h-5" />
          : <Volume2 className="w-5 h-5" />}
      </button>
    </div>
  );
}
