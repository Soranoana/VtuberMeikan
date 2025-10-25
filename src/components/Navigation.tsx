'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-red-500 shadow-lg border-b border-gray-200" style={{ minHeight: '64px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* ロゴ・サイト名 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-white">
                  プロフィール投稿サイト
                </h1>
              </div>
            </Link>
          </div>

          {/* ナビゲーションリンク */}
          <div className="flex items-center space-x-12">
            <Link
              href="/"
              className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all duration-200 border-b-2 ${isActive('/')
                  ? 'bg-white text-red-700 border-red-700 shadow-lg'
                  : 'text-white hover:text-red-200 hover:bg-red-600 border-transparent hover:border-red-300'
                }`}
            >
              トップ
            </Link>

            <Link
              href="/search"
              className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all duration-200 border-b-2 ${isActive('/search')
                  ? 'bg-white text-red-700 border-red-700 shadow-lg'
                  : 'text-white hover:text-red-200 hover:bg-red-600 border-transparent hover:border-red-300'
                }`}
            >
              Vtuber検索
            </Link>

            <Link
              href="/create"
              className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all duration-200 border-b-2 ${isActive('/create')
                  ? 'bg-white text-red-700 border-red-700 shadow-lg'
                  : 'text-white hover:text-red-200 hover:bg-red-600 border-transparent hover:border-red-300'
                }`}
            >
              プロフィール作成
            </Link>

            <Link
              href="/contact"
              className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all duration-200 border-b-2 ${isActive('/contact')
                  ? 'bg-white text-red-700 border-red-700 shadow-lg'
                  : 'text-white hover:text-red-200 hover:bg-red-600 border-transparent hover:border-red-300'
                }`}
            >
              問い合わせ
            </Link>

            <Link
              href="/login"
              className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all duration-200 border-b-2 ${isActive('/login')
                  ? 'bg-white text-red-700 border-red-700 shadow-lg'
                  : 'text-white hover:text-red-200 hover:bg-red-600 border-transparent hover:border-red-300'
                }`}
            >
              ログイン
            </Link>
          </div>

          {/* モバイルメニューボタン（非表示） */}
          {/* <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-white hover:text-red-200 focus:outline-none focus:text-red-200"
              aria-label="メニューを開く"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div> */}
        </div>
      </div>

      {/* モバイルメニュー（将来的に実装） */}
      {/* <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
            トップ
          </Link>
          <Link href="/search" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
            Vtuber検索
          </Link>
          <Link href="/create" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
            プロフィール作成
          </Link>
          <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
            問い合わせ
          </Link>
          <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
            ログイン
          </Link>
        </div>
      </div> */}
    </nav>
  );
}
