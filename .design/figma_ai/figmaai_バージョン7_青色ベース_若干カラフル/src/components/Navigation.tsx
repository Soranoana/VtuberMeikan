import { Home, Search, Plus, Mail, LogIn, BookOpen } from 'lucide-react';
import { Button } from './ui/button';

interface NavigationProps {
  onNewProfile: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ onNewProfile, currentPage, onNavigate }: NavigationProps) {
  return (
    <header className="bg-white border-b-2 border-blue-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* ロゴ */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" />
            <h1 className="text-blue-900 hidden sm:block">VTuber プロフィール帳</h1>
          </div>

          {/* ナビゲーションメニュー */}
          <nav className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => onNavigate('top')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'top'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">トップ</span>
            </button>

            <button
              onClick={() => onNavigate('search')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'search'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">検索</span>
            </button>
            
            <button
              onClick={onNewProfile}
              className="flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">新規Vtuber登録</span>
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'contact'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">問い合わせ</span>
            </button>

            <button
              onClick={() => onNavigate('login')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'login'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">ログイン</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
