import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { VTuberProfile } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { VTuberCard } from './VTuberCard';
import { ScrollableCardList } from './ScrollableCardList';
import {
  User,
  Heart,
  Edit,
  MessageCircle,
  Palette,
  LogOut,
  ChevronRight,
  ThumbsUp,
  Pencil,
  X
} from 'lucide-react';

interface UserPageProps {
  userName: string;
  likedProfiles: VTuberProfile[];
  recentlyEditedProfiles: VTuberProfile[];
  editsLikedByVTubers: VTuberProfile[]; // あなたの編集をいいねしたVtuber
  loginService?: string;
  onSelectProfile: (profile: VTuberProfile) => void;
  onLogout: () => void;
  onChangeUserName?: (newName: string, hidden: boolean) => void;
}

interface CommentHistory {
  id: string;
  vtuberName: string;
  comment: string;
  timestamp: Date;
}

function LoginServiceIcon({ service }: { service: string }) {
  const icons: Record<string, JSX.Element> = {
    'Google': (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.8 10.2273C19.8 9.51819 19.7364 8.83637 19.6182 8.18182H10.2V12.05H15.6509C15.4 13.3 14.6727 14.3591 13.5864 15.0682V17.5773H16.8182C18.7091 15.8364 19.8 13.2727 19.8 10.2273Z" fill="#4285F4"/>
        <path d="M10.2 20C12.9 20 15.1727 19.1045 16.8182 17.5773L13.5864 15.0682C12.6636 15.6682 11.5182 16.0227 10.2 16.0227C7.59545 16.0227 5.38182 14.2636 4.56364 11.9H1.22727V14.4909C2.86364 17.7591 6.28182 20 10.2 20Z" fill="#34A853"/>
        <path d="M4.56364 11.9C4.35455 11.3 4.23636 10.6591 4.23636 10C4.23636 9.34091 4.35455 8.7 4.56364 8.1V5.50909H1.22727C0.445455 7.05909 0 8.47727 0 10C0 11.5227 0.445455 12.9409 1.22727 14.4909L4.56364 11.9Z" fill="#FBBC04"/>
        <path d="M10.2 3.97727C11.6364 3.97727 12.9182 4.48182 13.9182 5.42727L16.7818 2.56364C15.1682 1.04091 12.8955 0 10.2 0C6.28182 0 2.86364 2.24091 1.22727 5.50909L4.56364 8.1C5.38182 5.73636 7.59545 3.97727 10.2 3.97727Z" fill="#EA4335"/>
      </svg>
    ),
    'TikTok': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.84 1.56V6.82a4.85 4.85 0 0 1-1.07-.13z" fill="black"/>
      </svg>
    ),
    'Twitch': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" fill="#9147FF"/>
      </svg>
    ),
    'X（旧Twitter）': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="black"/>
      </svg>
    ),
    'Facebook': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
      </svg>
    ),
    'LINE': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" fill="#06C755"/>
      </svg>
    ),
    'Discord': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" fill="#5865F2"/>
      </svg>
    ),
    'Steam': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.718L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0z" fill="#1b2838"/>
      </svg>
    ),
    'Instagram': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ig-login-grad" x1="0" y1="24" x2="24" y2="0">
            <stop offset="0%" stopColor="#f09433"/>
            <stop offset="50%" stopColor="#dc2743"/>
            <stop offset="100%" stopColor="#bc1888"/>
          </linearGradient>
        </defs>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" fill="url(#ig-login-grad)"/>
      </svg>
    ),
    'ツイキャス': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#2DABE0"/>
        <path d="M12 5C8.134 5 5 8.134 5 12s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 2a5 5 0 1 1 0 10A5 5 0 0 1 12 7zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="white"/>
        <circle cx="18.5" cy="5.5" r="2" fill="#FF4B4B"/>
      </svg>
    ),
    'ニコニコ': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.5 14.5c0 1.381-1.119 2.5-2.5 2.5h-6C7.619 17 6.5 15.881 6.5 14.5v-5C6.5 8.119 7.619 7 9 7h6c1.381 0 2.5 1.119 2.5 2.5v5z" fill="#231815"/>
        <path d="M10.5 10h-1v4h1v-4zm4 0h-1v4h1v-4z" fill="white"/>
      </svg>
    ),
  };
  return icons[service] ?? null;
}

export function UserPage({
  userName,
  likedProfiles,
  recentlyEditedProfiles,
  editsLikedByVTubers,
  loginService,
  onSelectProfile,
  onLogout,
  onChangeUserName,
}: UserPageProps) {
  const { selectedTheme, setSelectedTheme } = useApp();
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [editingName, setEditingName] = useState(userName);
  const [hideUserName, setHideUserName] = useState(false);
  const [displayName, setDisplayName] = useState(userName);
  const [isNameHidden, setIsNameHidden] = useState(false);

  const openNameDialog = () => {
    setEditingName(displayName);
    setHideUserName(isNameHidden);
    setShowNameDialog(true);
  };

  const confirmNameChange = () => {
    const trimmed = editingName.trim() || displayName;
    setDisplayName(trimmed);
    setIsNameHidden(hideUserName);
    onChangeUserName?.(trimmed, hideUserName);
    setShowNameDialog(false);
  };
  
  // サンプルコメント履歴
  const commentHistory: CommentHistory[] = [
    {
      id: '1',
      vtuberName: '星空みらい',
      comment: '応援しています！',
      timestamp: new Date(2024, 11, 20, 14, 30)
    },
    {
      id: '2',
      vtuberName: '月夜ルナ',
      comment: '配信楽しみにしてます♪',
      timestamp: new Date(2024, 11, 21, 10, 15)
    },
    {
      id: '3',
      vtuberName: '桜花さくら',
      comment: 'いつも癒されています！',
      timestamp: new Date(2024, 11, 22, 16, 45)
    },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // セクションへのスクロール
  const accountRef = useRef<HTMLDivElement>(null);
  const likedRef = useRef<HTMLDivElement>(null);
  const editsLikedRef = useRef<HTMLDivElement>(null); // あなたの編集をいいねしたVtuber
  const editedRef = useRef<HTMLDivElement>(null);
  const commentsRef = useRef<HTMLDivElement>(null);
  const designRef = useRef<HTMLDivElement>(null);
  const logoutRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 min-h-screen">
      {/* ユーザー名変更ダイアログ */}
      {showNameDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg text-blue-900 flex items-center gap-2">
                <Pencil className="w-5 h-5" />
                ユーザー名の変更
              </h3>
              <button
                onClick={() => setShowNameDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">新しいユーザー名</label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  disabled={hideUserName}
                  maxLength={30}
                  placeholder="ユーザー名を入力"
                  className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none text-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{editingName.length}/30</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hideUserName}
                  onChange={(e) => setHideUserName(e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-700">ユーザー名を表示しない</span>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowNameDialog(false)}
                className="text-sm border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                キャンセル
              </Button>
              <Button
                onClick={confirmNameChange}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white"
              >
                変更を確定
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* 左サイドバー - インデックス */}
      <div className="lg:w-64 flex-shrink-0">
        <Card className="bg-white border-2 border-blue-200 shadow-lg lg:sticky lg:top-20">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl text-blue-900 mb-3 sm:mb-4 flex items-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              ユーザーメニュー
            </h2>
            <nav className="space-y-1 sm:space-y-2">
              <button
                onClick={() => scrollToSection(accountRef)}
                className="w-full text-left px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-700 transition-colors flex items-center justify-between group text-sm sm:text-base"
              >
                <span>アカウント情報</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => scrollToSection(likedRef)}
                className="w-full text-left px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-700 transition-colors flex items-center justify-between group text-sm sm:text-base"
              >
                <span>いいねしたVtuber</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => scrollToSection(editsLikedRef)}
                className="w-full text-left px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-700 transition-colors flex items-center justify-between group text-sm sm:text-base"
              >
                <span className="text-sm sm:text-base">あなたの編集をいいねしたVtuber</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => scrollToSection(editedRef)}
                className="w-full text-left px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-700 transition-colors flex items-center justify-between group text-sm sm:text-base"
              >
                <span className="text-sm sm:text-base">最近あなたが編集したVtuber</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => scrollToSection(commentsRef)}
                className="w-full text-left px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-700 transition-colors flex items-center justify-between group text-sm sm:text-base"
              >
                <span>コメント履歴</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => scrollToSection(designRef)}
                className="w-full text-left px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-700 transition-colors flex items-center justify-between group text-sm sm:text-base"
              >
                <span>デザイン選択</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => scrollToSection(logoutRef)}
                className="w-full text-left px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-700 transition-colors flex items-center justify-between group text-sm sm:text-base"
              >
                <span>ログアウト</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </nav>
          </div>
        </Card>
      </div>

      {/* 右側 - メインコンテンツ */}
      <div className="flex-1 space-y-6 sm:space-y-8">
        {/* アカウント情報 */}
        <div ref={accountRef} className="scroll-mt-20 sm:scroll-mt-24">
          <h2 className="text-xl sm:text-2xl text-blue-900 mb-3 sm:mb-4 flex items-center gap-2">
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
            アカウント情報
          </h2>
          <Card className="bg-white border-2 border-blue-200 shadow-lg">
            <div className="p-4 sm:p-6">
              <table className="w-full text-sm sm:text-base">
                <tbody>
                  <tr className="border-b border-blue-100">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 font-semibold">ユーザー名</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-gray-800">{displayName}</span>
                        <button
                          onClick={openNameDialog}
                          className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                          変更
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 font-semibold">表示名</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-800">
                      {isNameHidden
                        ? <span className="text-gray-400 italic">（匿名ユーザー）</span>
                        : displayName}
                    </td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 font-semibold">ログインサービス</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-800">
                      {loginService ? (
                        <span className="flex items-center gap-2">
                          <LoginServiceIcon service={loginService} />
                          {loginService}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 font-semibold">登録日</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-800">2024年11月1日</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 font-semibold">ほかのユーザーからの獲得いいね数</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-800">128</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 font-semibold">VTuber本人からのいいね数</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-800">15</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 font-semibold">あなたがいいねしたVtuber数</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-800">{likedProfiles.length}</td>
                  </tr>
                  <tr>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 font-semibold">あなたがページ編集者にいいねした数</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-800">42</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* いいねしたVtuber */}
        <div ref={likedRef} className="scroll-mt-20 sm:scroll-mt-24">
          <h2 className="text-xl sm:text-2xl text-blue-900 mb-3 sm:mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            いいねしたVtuber
          </h2>
          {likedProfiles.length > 0 ? (
            <ScrollableCardList>
              {likedProfiles.map(profile => (
                <div key={profile.id} className="w-64 sm:w-80">
                  <VTuberCard
                    profile={profile}
                    onClick={() => onSelectProfile(profile)}
                  />
                </div>
              ))}
            </ScrollableCardList>
          ) : (
            <Card className="bg-white border-2 border-blue-200 shadow-lg">
              <div className="p-6 sm:p-8 text-center">
                <Heart className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                <p className="text-sm sm:text-base text-gray-500">まだいいねしたVtuberはありません</p>
              </div>
            </Card>
          )}
        </div>

        {/* あなたの編集をいいねしたVtuber */}
        <div ref={editsLikedRef} className="scroll-mt-20 sm:scroll-mt-24">
          <h2 className="text-xl sm:text-2xl text-blue-900 mb-3 sm:mb-4 flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6" />
            あなたの編集をいいねしたVtuber
          </h2>
          {editsLikedByVTubers.length > 0 ? (
            <ScrollableCardList>
              {editsLikedByVTubers.map(profile => (
                <div key={profile.id} className="w-64 sm:w-80">
                  <VTuberCard
                    profile={profile}
                    onClick={() => onSelectProfile(profile)}
                  />
                </div>
              ))}
            </ScrollableCardList>
          ) : (
            <Card className="bg-white border-2 border-blue-200 shadow-lg">
              <div className="p-6 sm:p-8 text-center">
                <ThumbsUp className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                <p className="text-sm sm:text-base text-gray-500">まだあなたの編集をいいねしたVtuberはありません</p>
              </div>
            </Card>
          )}
        </div>

        {/* 最近あなたが編集したVtuber */}
        <div ref={editedRef} className="scroll-mt-20 sm:scroll-mt-24">
          <h2 className="text-xl sm:text-2xl text-blue-900 mb-3 sm:mb-4 flex items-center gap-2">
            <Edit className="w-5 h-5 sm:w-6 sm:h-6" />
            最近あなたが編集したVtuber
          </h2>
          {recentlyEditedProfiles.length > 0 ? (
            <ScrollableCardList>
              {recentlyEditedProfiles.map(profile => (
                <div key={profile.id} className="w-64 sm:w-80">
                  <VTuberCard
                    profile={profile}
                    onClick={() => onSelectProfile(profile)}
                  />
                </div>
              ))}
            </ScrollableCardList>
          ) : (
            <Card className="bg-white border-2 border-blue-200 shadow-lg">
              <div className="p-6 sm:p-8 text-center">
                <Edit className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                <p className="text-sm sm:text-base text-gray-500">まだ編集したVtuberはありません</p>
              </div>
            </Card>
          )}
        </div>

        {/* コメント履歴 */}
        <div ref={commentsRef} className="scroll-mt-20 sm:scroll-mt-24">
          <h2 className="text-xl sm:text-2xl text-blue-900 mb-3 sm:mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            コメント履歴
          </h2>
          <Card className="bg-white border-2 border-blue-200 shadow-lg">
            <div className="p-4 sm:p-6">
              {commentHistory.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {commentHistory.map(comment => (
                    <div 
                      key={comment.id} 
                      className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200 hover:border-blue-400 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm sm:text-base text-blue-900 font-semibold">{comment.vtuberName}</p>
                          <p className="text-xs text-gray-500">{formatDate(comment.timestamp)}</p>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-gray-800">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 sm:p-8 text-center">
                  <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                  <p className="text-sm sm:text-base text-gray-500">まだコメントはありません</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* デザイン選択 */}
        <div ref={designRef} className="scroll-mt-20 sm:scroll-mt-24">
          <h2 className="text-xl sm:text-2xl text-blue-900 mb-3 sm:mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
            デザイン選択
          </h2>
          <Card className="bg-white border-2 border-blue-200 shadow-lg">
            <div className="p-4 sm:p-6">
              <table className="w-full text-sm sm:text-base">
                <tbody>
                  <tr className="border-b border-blue-100">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 font-semibold">テーマ</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <select 
                        value={selectedTheme}
                        onChange={(e) => setSelectedTheme(e.target.value)}
                        className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none bg-white text-sm sm:text-base"
                      >
                        <option value="light">ライトモード</option>
                        <option value="dark">ダークモード（実装中）</option>
                        <option value="unknown1">？？？？（実装中。乞うご期待）</option>
                        <option value="unknown1">？？？？（実装中。乞うご期待）</option>
                      </select>
                    </td>
                  </tr>
                  {/* <tr>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 font-semibold">表示モード</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <select className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none bg-white text-sm sm:text-base">
                        <option value="light">ライトモード</option>
                        <option value="dark">ダークモード</option>
                        <option value="auto">自動</option>
                      </select>
                    </td>
                  </tr> */}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* ログアウト */}
        <div ref={logoutRef} className="scroll-mt-20 sm:scroll-mt-24">
          <h2 className="text-xl sm:text-2xl text-blue-900 mb-3 sm:mb-4 flex items-center gap-2">
            <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
            ログアウト
          </h2>
          <Card className="bg-white border-2 border-blue-200 shadow-lg">
            <div className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">アカウントからログアウトします。よろしいですか？</p>
              <Button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-sm sm:text-base"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                ログアウト
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}