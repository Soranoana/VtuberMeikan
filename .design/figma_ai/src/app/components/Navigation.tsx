import { Home, Search, Plus, Mail, LogIn, LogOut, BookOpen, User, ChevronDown, Menu, X, Palette, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';

interface NavigationProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  userName?: string;
}

const THEME_OPTIONS = [
  { value: 'light', label: 'ライトモード' },
  { value: 'dark',  label: 'ダークモード（実装中）' },
  { value: 'unknown1', label: '？？？？（実装中）' },
  { value: 'unknown2', label: '？？？？（実装中）' },
];

export function Navigation({ isLoggedIn, onLogout, userName = 'ゲストユーザー' }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedTheme, setSelectedTheme } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isMobileThemeOpen, setIsMobileThemeOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  // ドロップダウン外をクリックしたら閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-[#FFFEF8] border-b-2 border-[#D4C5A9] shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* ロゴとサイト名 */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 sm:gap-2 hover:opacity-80 transition-opacity"
          >
            <BookOpen className="w-5 h-5 sm:w-7 sm:h-7 text-[#8B7355]" />
            <h1 className="text-sm sm:text-lg font-semibold text-[#8B7355]">VTuber名鑑</h1>
          </button>

          {/* デスクトップナビゲーション（md以上） */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 md:gap-3">
            <button
              onClick={() => handleNavigation('/')}
              className={`flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                location.pathname === '/'
                  ? 'bg-[#E8DFC4] text-[#8B7355]'
                  : 'text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355]'
              }`}
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">トップ</span>
            </button>

            <button
              onClick={() => handleNavigation('/search')}
              className={`flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                location.pathname === '/search' || location.pathname.startsWith('/vtuber')
                  ? 'bg-[#E8DFC4] text-[#8B7355]'
                  : 'text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355]'
              }`}
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">検索</span>
            </button>

            <button
              onClick={() => handleNavigation('/new')}
              className={`flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                location.pathname === '/new'
                  ? 'bg-[#E8DFC4] text-[#8B7355]'
                  : 'text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355]'
              }`}
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden lg:inline">新規Vtuber登録</span>
              <span className="hidden sm:inline lg:hidden">登録</span>
            </button>

            <button
              onClick={() => handleNavigation('/contact')}
              className={`hidden sm:flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                location.pathname === '/contact'
                  ? 'bg-[#E8DFC4] text-[#8B7355]'
                  : 'text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355]'
              }`}
            >
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden md:inline">問い合わせ</span>
            </button>

            {/* テーマ切替 */}
            <div className="relative" ref={themeRef}>
              <button
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355] whitespace-nowrap flex-shrink-0"
              >
                <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>テーマ選択</span>
              </button>
              {isThemeOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border-2 border-[#D4C5A9] overflow-hidden z-50">
                  <div className="px-4 py-2 border-b border-[#D4C5A9] bg-[#FFFEF8]">
                    <p className="text-xs text-[#8B7355] font-semibold">テーマ選択</p>
                  </div>
                  {THEME_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSelectedTheme(opt.value); setIsThemeOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355] transition-colors"
                    >
                      <span>{opt.label}</span>
                      {selectedTheme === opt.value && <Check className="w-4 h-4 text-[#8B7355]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355]"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="hidden md:inline text-xs sm:text-sm">{userName}</span>
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* ドロップダウンメニュー */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-lg border-2 border-[#D4C5A9] overflow-hidden z-50">
                    <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-[#D4C5A9] bg-[#FFFEF8]">
                      <p className="text-xs sm:text-sm text-[#8B7355] font-semibold truncate">{userName}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/user');
                      }}
                      className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355] transition-colors flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ユーザー画面
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355] transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ログアウト
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavigation('/login')}
                className={`flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                  location.pathname === '/login'
                    ? 'bg-[#E8DFC4] text-[#8B7355]'
                    : 'text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">ログイン</span>
              </button>
            )}
          </nav>

          {/* モバイルメニュー */}
          <div className="md:hidden" ref={mobileMenuRef}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355]"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>

            {/* モバイルメニュー内容 */}
            {isMobileMenuOpen && (
              <div className="absolute right-2 top-14 w-56 bg-white rounded-lg shadow-lg border-2 border-[#D4C5A9] z-50">
                <button
                  onClick={() => handleNavigation('/')}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm border-b border-[#D4C5A9] rounded-t-lg ${
                    location.pathname === '/'
                      ? 'bg-[#E8DFC4] text-[#8B7355]'
                      : 'text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355]'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>トップ画面</span>
                </button>

                <button
                  onClick={() => handleNavigation('/search')}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm border-b border-[#D4C5A9] ${
                    location.pathname === '/search' || location.pathname.startsWith('/vtuber')
                      ? 'bg-[#E8DFC4] text-[#8B7355]'
                      : 'text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355]'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>VTuber検索画面</span>
                </button>

                <button
                  onClick={() => handleNavigation('/new')}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm border-b border-[#D4C5A9] ${
                    location.pathname === '/new'
                      ? 'bg-[#E8DFC4] text-[#8B7355]'
                      : 'text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355]'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>新規VTuber登録画面</span>
                </button>

                <button
                  onClick={() => handleNavigation('/contact')}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm border-b border-[#D4C5A9] ${
                    location.pathname === '/contact'
                      ? 'bg-[#E8DFC4] text-[#8B7355]'
                      : 'text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355]'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>問い合わせ</span>
                </button>

                {/* テーマ切替（モバイル） */}
                <div className="border-b border-[#D4C5A9]">
                  <button
                    onClick={() => setIsMobileThemeOpen(!isMobileThemeOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      テーマ選択
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileThemeOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isMobileThemeOpen && (
                    <div className="border-t border-[#D4C5A9] bg-[#FFFEF8]">
                      {THEME_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setSelectedTheme(opt.value); setIsMobileMenuOpen(false); setIsMobileThemeOpen(false); }}
                          className="w-full flex items-center justify-between pl-10 pr-4 py-2.5 text-sm text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355] transition-colors"
                        >
                          <span>{opt.label}</span>
                          {selectedTheme === opt.value && <Check className="w-4 h-4 text-[#8B7355]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => handleNavigation('/user')}
                      className={`w-full flex items-center gap-2 px-4 py-3 text-sm border-b border-[#D4C5A9] ${
                        location.pathname === '/user'
                          ? 'bg-[#E8DFC4] text-[#8B7355]'
                          : 'text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355]'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>ユーザー画面</span>
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355] rounded-b-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>ログアウト</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavigation('/login')}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-sm rounded-b-lg ${
                      location.pathname === '/login'
                        ? 'bg-[#E8DFC4] text-[#8B7355]'
                        : 'text-[#6b6b6b] hover:bg-[#F4E9D6] hover:text-[#8B7355]'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>ログイン画面</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
