import { useState } from 'react';
import { VTuberProfile } from '../App';
import { VTuberCard } from './VTuberCard';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { VTuberCard as VTuberCardComponent } from './VTuberCard';
import { ScrollableCardList } from './ScrollableCardList';
import { AdBanner } from './AdBanner';
import { adConfig } from '../config/adConfig';
import { 
  ArrowLeft, 
  Edit, 
  Flag, 
  Mail, 
  History, 
  Youtube, 
  Twitter, 
  Music2, 
  Globe,
  Calendar,
  Cake,
  Building2,
  Heart,
  User,
  Droplet,
  Ruler,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Target,
  MessageCircle,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Star,
  Clock
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { SnsIconDisplay } from './SnsLinksEditor';
import { VideoSection } from './VideoSection';

interface VTuberDetailPageProps {
  profile: VTuberProfile;
  allProfiles: VTuberProfile[];
  onSelectProfile: (profile: VTuberProfile) => void;
  onBack: () => void;
  onEdit?: (profile: VTuberProfile) => void;
  onReport?: (profile: VTuberProfile) => void;
  onContact?: () => void;
  onViewHistory?: (profile: VTuberProfile) => void;
  isLiked?: boolean;
  onToggleLike?: () => void;
  onSearchByTag?: (tag: string) => void;
  onSearchByBadge?: (badge: string) => void;
}

interface Comment {
  id: string;
  userName: string;
  message: string;
  timestamp: Date;
}

interface EditHistory {
  id: string;
  editor: string;
  timestamp: Date;
  changes: {
    field: string;
    fieldLabel: string;
    oldValue: string;
    newValue: string;
  }[];
}


export function VTuberDetailPage({
  profile,
  allProfiles,
  onSelectProfile,
  onBack, 
  onEdit, 
  onReport, 
  onContact,
  onViewHistory,
  isLiked,
  onToggleLike,
  onSearchByTag,
  onSearchByBadge
}: VTuberDetailPageProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userName: 'ゲスト1',
      message: '応援しています！',
      timestamp: new Date(2024, 11, 20, 14, 30)
    },
    {
      id: '2',
      userName: 'ゲスト2',
      message: '配信楽しみにしてます♪',
      timestamp: new Date(2024, 11, 21, 10, 15)
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportDoneModalOpen, setIsReportDoneModalOpen] = useState(false);
  const [showRestoreToast, setShowRestoreToast] = useState(false);
  const [restoredVersion, setRestoredVersion] = useState<string>('');
  const [selectedReportReason, setSelectedReportReason] = useState<string>('');
  const [reportReasonTouched, setReportReasonTouched] = useState(false);
  const [reportDetail, setReportDetail] = useState<string>('');
  const [reportDetailTouched, setReportDetailTouched] = useState(false);
  const [reportingHistoryId, setReportingHistoryId] = useState<string>('');

  const resetReportState = () => {
    setSelectedReportReason('');
    setReportReasonTouched(false);
    setReportDetail('');
    setReportDetailTouched(false);
    setReportingHistoryId('');
  };
  const [editorLikes, setEditorLikes] = useState<{ [key: string]: { count: number; isLiked: boolean } }>({});

  // サンプル編集履歴データ（10人の編集者）
  const [editHistory] = useState<EditHistory[]>([
    {
      id: '10',
      editor: '星空ファン',
      timestamp: new Date(2026, 1, 6, 18, 30),
      changes: [
        {
          field: 'message',
          fieldLabel: 'メッセージ',
          oldValue: 'いつも見てくれてありがとう！',
          newValue: 'いつも見てくれてありがとう！これからもよろしくね♪'
        }
      ]
    },
    {
      id: '9',
      editor: 'VTuber大好き',
      timestamp: new Date(2026, 1, 5, 14, 15),
      changes: [
        {
          field: 'tags',
          fieldLabel: 'タグ',
          oldValue: 'ゲーム実況, 歌ってみた, 雑談',
          newValue: 'ゲーム実況, 歌ってみた, 雑談, ASMR'
        }
      ]
    },
    {
      id: '8',
      editor: 'みらいP',
      timestamp: new Date(2026, 1, 4, 10, 45),
      changes: [
        {
          field: 'favoriteThings',
          fieldLabel: '好きなもの',
          oldValue: '星空、甘いもの、ゲーム',
          newValue: '星空、甘いもの、ゲーム、お絵描き'
        }
      ]
    },
    {
      id: '7',
      editor: '編集マスター',
      timestamp: new Date(2026, 1, 3, 16, 20),
      changes: [
        {
          field: 'hobby',
          fieldLabel: '趣味・特技',
          oldValue: 'イラスト、ピアノ、料理',
          newValue: 'イラスト、ピアノ、料理、天体観測'
        }
      ]
    },
    {
      id: '6',
      editor: '管理者A',
      timestamp: new Date(2026, 1, 2, 12, 0),
      changes: [
        {
          field: 'oneWord',
          fieldLabel: 'ひとこと',
          oldValue: '星のように輝く配信を目指してます！',
          newValue: '星のように輝く配信を目指してます！一緒に楽しもう♪'
        }
      ]
    },
    {
      id: '5',
      editor: 'ユーザーB',
      timestamp: new Date(2026, 1, 1, 9, 30),
      changes: [
        {
          field: 'dream',
          fieldLabel: '将来の夢',
          oldValue: '大きなライブをすること、みんなを笑顔にすること',
          newValue: '大きなライブをすること、みんなを笑顔にすること、オリジナル曲をリリース'
        }
      ]
    },
    {
      id: '4',
      editor: 'コントリビューター',
      timestamp: new Date(2025, 11, 28, 15, 45),
      changes: [
        {
          field: 'activityGenre',
          fieldLabel: '活動ジャンル',
          oldValue: 'ゲーム実況, 歌枠',
          newValue: 'ゲーム実況, 歌枠, 雑談配信'
        }
      ]
    },
    {
      id: '3',
      editor: 'エディター',
      timestamp: new Date(2025, 11, 20, 11, 15),
      changes: [
        {
          field: 'tags',
          fieldLabel: 'タグ',
          oldValue: 'ゲーム実況, 歌ってみた',
          newValue: 'ゲーム実況, 歌ってみた, 雑談'
        }
      ]
    },
    {
      id: '2',
      editor: 'ユーザーA',
      timestamp: new Date(2025, 11, 10, 14, 20),
      changes: [
        {
          field: 'oneWord',
          fieldLabel: 'ひとこと',
          oldValue: 'よろしくお願いします！',
          newValue: '星のように輝く配信を目指してます！'
        },
        {
          field: 'activityGenre',
          fieldLabel: '活動ジャンル',
          oldValue: 'その他',
          newValue: 'ゲーム実況, 歌枠'
        }
      ]
    },
    {
      id: '1',
      editor: 'システム',
      timestamp: new Date(2025, 10, 1, 10, 0),
      changes: [
        {
          field: 'all',
          fieldLabel: '新規登録',
          oldValue: '',
          newValue: '初期登録'
        }
      ]
    }
  ]);

  // 画像の配列を取得（imageUrlsがあればそれを、なければimageUrlを使用）
  const images = profile.imageUrls && profile.imageUrls.length > 0 
    ? profile.imageUrls 
    : profile.imageUrl 
    ? [profile.imageUrl] 
    : [];

  const handleSubmitComment = () => {
    if (newComment.trim() && userName.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        userName: userName.trim(),
        message: newComment.trim(),
        timestamp: new Date()
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // おすすめのVTuber（タグが一致するもの、自分以外）
  const recommendedVtubers = allProfiles
    .filter(p => {
      if (p.id === profile.id) return false;
      if (!profile.tags || !p.tags) return false;
      return profile.tags.some(tag => p.tags?.includes(tag));
    })
    .slice(0, 6);

  // よく見られているVtuber（閲覧数でソート、自分以外、上位6件）
  const mostViewedVtubers = [...allProfiles]
    .filter(p => p.id !== profile.id)
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 6);

  // 閲覧履歴（サンプル：ランダムに選択、実際にはローカルストレージなどで管理）
  const viewingHistory = [...allProfiles]
    .filter(p => p.id !== profile.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  // バッジの計算
  const badges: string[] = [];
  
  // よく見られているVTuberのIDリストを取得（閲覧数上位30%）
  const mostViewedIds = [...allProfiles]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, Math.ceil(allProfiles.length * 0.3))
    .map(p => p.id);
  
  if (mostViewedIds.includes(profile.id)) {
    badges.push('よく見られているVTuber');
  }
  
  // 新人VTuberのチェック（デビューが最近1年以内）
  const debutYear = parseInt(profile.debut.match(/(\d{4})/)?.[1] || '0');
  const currentYear = new Date().getFullYear();
  if (currentYear - debutYear <= 1) {
    badges.push('新人VTuber');
  }
  
  // 最近更新されたVTuberのチェック（更新日が最近30日以内）
  if (profile.updatedAt) {
    const daysSinceUpdate = Math.floor(
      (new Date().getTime() - profile.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceUpdate <= 30) {
      badges.push('最近更新されたVTuber');
    }
  }
  
  // 今日誕生日のVTuberのチェック
  if (profile.birthday) {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();
    const birthdayMatch = profile.birthday.match(/(\d+)月(\d+)日/);
    if (birthdayMatch) {
      const birthMonth = parseInt(birthdayMatch[1]);
      const birthDay = parseInt(birthdayMatch[2]);
      if (birthMonth === todayMonth && birthDay === todayDay) {
        badges.push('今日誕生日のVTuber');
      }
    }
  }

  // 編集者リスト（編集履歴から取得）
  const editors = Array.from(new Set(editHistory.map(h => h.editor)));

  // 編集者のいいねボタンハンドラ
  const handleEditorLike = (editor: string) => {
    setEditorLikes(prev => {
      const current = prev[editor] || { count: Math.floor(Math.random() * 100) + 10, isLiked: false };
      return {
        ...prev,
        [editor]: {
          count: current.isLiked ? current.count - 1 : current.count + 1,
          isLiked: !current.isLiked
        }
      };
    });
  };

  // 編集者のいいね数を取得
  const getEditorLikeCount = (editor: string) => {
    return editorLikes[editor]?.count || Math.floor(Math.random() * 100) + 10;
  };

  // 編集者のいいね状態を取得
  const isEditorLiked = (editor: string) => {
    return editorLikes[editor]?.isLiked || false;
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleRestoreVersion = (historyId: string, timestamp: Date) => {
    setRestoredVersion(formatDate(timestamp));
    setShowRestoreToast(true);
    setIsHistoryPanelOpen(false);
    setTimeout(() => setShowRestoreToast(false), 5000);
  };

  return (
    <div className="relative">
      {/* メインコンテンツエリア - 編集履歴が開いている時は左にスペースを確保（大画面のみ） */}
      <motion.div 
        className="space-y-6 pb-8"
        animate={isHistoryPanelOpen ? { marginRight: window.innerWidth >= 1280 ? '400px' : '0' } : { marginRight: '0' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* 上部広告 */}
        {adConfig.detailTop && (
          <AdBanner position="detail-top" variant="horizontal" />
        )}

        {/* 戻るボタン */}
        <Button
          variant="outline"
          onClick={onBack}
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          検索結果に戻る
        </Button>

        {/* メインカード */}
        <Card className="bg-white border-2 border-blue-200 shadow-lg overflow-hidden">
          {/* プロフィール情報 */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* 左カラム：画像 */}
              <div className="lg:w-1/3">
                {/* メイン画像 */}
                <div className="space-y-4">
                  {images.length > 0 ? (
                    <>
                      <div 
                        className="relative aspect-square rounded-lg overflow-hidden shadow-lg cursor-pointer group"
                        onClick={() => {
                          setSelectedImageIndex(0);
                          setIsImageModalOpen(true);
                        }}
                      >
                        <img
                          src={images[0]}
                          alt={profile.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 text-white bg-black/50 px-4 py-2 rounded-lg transition-opacity">
                            クリックして拡大
                          </span>
                        </div>
                      </div>

                      {/* サムネイル画像（複数ある場合） */}
                      {images.length > 1 && (
                        <div className="grid grid-cols-3 gap-2">
                          {images.slice(1).map((img, index) => (
                            <div 
                              key={index}
                              className="relative aspect-square rounded-lg overflow-hidden shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => {
                                setSelectedImageIndex(index + 1);
                                setIsImageModalOpen(true);
                              }}
                            >
                              <img
                                src={img}
                                alt={`${profile.name} ${index + 2}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    /* プレースホルダー画像 */
                    <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <div className="text-center p-8">
                        <User className="w-24 h-24 mx-auto text-blue-400 mb-4" />
                        <p className="text-blue-600">画像なし</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* アクションボタン（デスクトップ） */}
                <div className="hidden lg:block mt-6 space-y-3">
                  {onEdit && (
                    <Button
                      onClick={() => onEdit(profile)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      編集する
                    </Button>
                  )}
                  {onReport && (
                    <Button
                      onClick={() => setIsReportModalOpen(true)}
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      通報する
                    </Button>
                  )}
                  {onContact && (
                    <Button
                      onClick={onContact}
                      variant="outline"
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      問い合わせ
                    </Button>
                  )}
                  {onViewHistory && (
                    <Button
                      onClick={() => setIsHistoryPanelOpen(true)}
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <History className="w-4 h-4 mr-2" />
                      編集履歴
                    </Button>
                  )}

                  {/* ページ編集者（デスクトップ） */}
                  {editors.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-xs text-gray-600 mb-2">ページ編集者 ({editors.length}人)</h4>
                      <div 
                        className="space-y-2"
                        style={{ 
                          maxHeight: editors.length > 4 ? '300px' : 'none',
                          overflowY: editors.length > 4 ? 'auto' : 'visible'
                        }}
                      >
                        {editors.map((editor, index) => {
                          const likeCount = getEditorLikeCount(editor);
                          const liked = isEditorLiked(editor);
                          return (
                            <div 
                              key={`${editor}-${index}`}
                              className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition-colors"
                            >
                              <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-semibold">{editor.charAt(0)}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-800 truncate">
                                  {editor.length > 8 ? editor.substring(0, 8) + '...' : editor}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {likeCount} いいね
                                </p>
                              </div>
                              <button 
                                onClick={() => handleEditorLike(editor)}
                                className={`transition-colors flex-shrink-0 ${
                                  liked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
                                }`}
                              >
                                <Heart className={`w-3 h-3 ${liked ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 右カラム：詳細情報 */}
              <div className="lg:w-2/3 space-y-6">
                {/* 名前とニックネームといいね */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl text-blue-900">{profile.name}</h1>
                      {profile.nickname && (
                        <span className="text-lg sm:text-xl text-gray-500">({profile.nickname})</span>
                      )}
                    </div>
                    {/* いいねボタンといいね数 */}
                    {onToggleLike && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={onToggleLike}
                          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg border-2 transition-all text-sm sm:text-base ${
                            isLiked
                              ? 'bg-pink-500 border-pink-500 text-white hover:bg-pink-600 hover:border-pink-600'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-pink-50 hover:border-pink-300'
                          }`}
                        >
                          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
                          <span className="font-semibold hidden sm:inline">
                            {isLiked ? 'いいね済み' : 'いいね'}
                          </span>
                        </button>
                        <div className="text-center">
                          <p className="text-xl sm:text-2xl font-bold text-pink-600">{profile.likeCount || 0}</p>
                          <p className="text-xs text-gray-500">いいね</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {profile.catchphrase && (
                    <p className="text-sm sm:text-base text-blue-700 italic">「{profile.catchphrase}」</p>
                  )}
                </div>

                {/* バッジ */}
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {badges.map(badge => {
                      let icon = null;
                      let bgColor = '';
                      let textColor = '';
                      let borderColor = '';
                      
                      if (badge === 'よく見られているVTuber') {
                        icon = <TrendingUp className="w-4 h-4 text-purple-600" />;
                        bgColor = 'bg-purple-100';
                        textColor = 'text-purple-700';
                        borderColor = 'border-purple-300';
                      } else if (badge === '新人VTuber') {
                        icon = <Star className="w-4 h-4 text-yellow-600" />;
                        bgColor = 'bg-yellow-100';
                        textColor = 'text-yellow-700';
                        borderColor = 'border-yellow-300';
                      } else if (badge === '最近更新されたVTuber') {
                        icon = <Clock className="w-4 h-4 text-blue-600" />;
                        bgColor = 'bg-blue-100';
                        textColor = 'text-blue-700';
                        borderColor = 'border-blue-300';
                      } else if (badge === '今日誕生日のVTuber') {
                        icon = <Cake className="w-4 h-4 text-pink-600" />;
                        bgColor = 'bg-pink-100';
                        textColor = 'text-pink-700';
                        borderColor = 'border-pink-300';
                      }
                      
                      return (
                        <Badge
                          key={badge}
                          className={`${bgColor} ${textColor} ${borderColor} px-3 py-1.5 border-2 flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity`}
                          onClick={() => onSearchByBadge && onSearchByBadge(badge)}
                        >
                          {icon}
                          {badge}
                        </Badge>
                      );
                    })}
                  </div>
                )}

                {/* タグ */}
                {profile.tags && profile.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profile.tags.map(tag => (
                      <Badge
                        key={tag}
                        className="bg-blue-100 text-blue-700 border-blue-300 px-3 py-1 cursor-pointer hover:bg-blue-200 transition-colors"
                        onClick={() => onSearchByTag && onSearchByTag(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* ひとこと */}
                {profile.oneWord && (
                  <Card className="bg-blue-50 border-blue-200 p-4">
                    <p className="text-blue-900">{profile.oneWord}</p>
                  </Card>
                )}

                {/* アクションボタン（モバイル） */}
                <div className="flex flex-wrap gap-2 lg:hidden">
                  {onEdit && (
                    <Button
                      onClick={() => onEdit(profile)}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      編集する
                    </Button>
                  )}
                  {onReport && (
                    <Button
                      onClick={() => setIsReportModalOpen(true)}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      size="sm"
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      通報する
                    </Button>
                  )}
                  {onContact && (
                    <Button
                      onClick={onContact}
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      size="sm"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      問い合わせ
                    </Button>
                  )}
                  {onViewHistory && (
                    <Button
                      onClick={() => setIsHistoryPanelOpen(true)}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      size="sm"
                    >
                      <History className="w-4 h-4 mr-2" />
                      編集履歴
                    </Button>
                  )}
                </div>

                {/* SNSリンク */}
                {((profile.snsLinks && profile.snsLinks.length > 0) || profile.youtubeUrl || profile.xUrl || profile.tiktokUrl || profile.websiteUrl) && (
                  <div>
                    <h3 className="text-blue-900 mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      SNS・リンク
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {/* 新形式 */}
                      {profile.snsLinks?.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <SnsIconDisplay icon={link.icon} className="w-5 h-5 flex-shrink-0" />
                          <span className="text-blue-700">{link.label || link.url}</span>
                        </a>
                      ))}
                      {/* 旧形式（snsLinksがない場合のフォールバック） */}
                      {!profile.snsLinks && profile.youtubeUrl && (
                        <a href={profile.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                          <SnsIconDisplay icon="youtube" className="w-5 h-5" />
                          <span className="text-red-700">YouTube</span>
                        </a>
                      )}
                      {!profile.snsLinks && profile.xUrl && (
                        <a href={profile.xUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                          <SnsIconDisplay icon="x" className="w-5 h-5" />
                          <span className="text-blue-700">X (Twitter)</span>
                        </a>
                      )}
                      {!profile.snsLinks && profile.tiktokUrl && (
                        <a href={profile.tiktokUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                          <SnsIconDisplay icon="tiktok" className="w-5 h-5" />
                          <span className="text-gray-700">TikTok</span>
                        </a>
                      )}
                      {!profile.snsLinks && profile.websiteUrl && (
                        <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                          <SnsIconDisplay icon="globe" className="w-5 h-5" />
                          <span className="text-green-700">Website</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* 基本情報 */}
                <div>
                  <h3 className="text-blue-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    基本情報
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.affiliation && (
                      <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">所属</p>
                          <p className="text-gray-800">{profile.affiliation}</p>
                        </div>
                      </div>
                    )}
                    {profile.birthday && (
                      <div className="flex items-start gap-3">
                        <Cake className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">誕生日</p>
                          <p className="text-gray-800">{profile.birthday}</p>
                        </div>
                      </div>
                    )}
                    {profile.debut && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">デビュー日</p>
                          <p className="text-gray-800">{profile.debut}</p>
                        </div>
                      </div>
                    )}
                    {profile.activityHistory && (
                      <div className="flex items-start gap-3">
                        <History className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">活動歴</p>
                          <p className="text-gray-800">{profile.activityHistory}</p>
                        </div>
                      </div>
                    )}
                    {profile.activityGenre && (
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">活動ジャンル</p>
                          <p className="text-gray-800">{profile.activityGenre}</p>
                        </div>
                      </div>
                    )}
                    {profile.bloodType && (
                      <div className="flex items-start gap-3">
                        <Droplet className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">血液型</p>
                          <p className="text-gray-800">{profile.bloodType}</p>
                        </div>
                      </div>
                    )}
                    {profile.height && (
                      <div className="flex items-start gap-3">
                        <Ruler className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">身長</p>
                          <p className="text-gray-800">{profile.height}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 詳細情報 */}
                <div>
                  <h3 className="text-blue-900 mb-3">詳細情報</h3>
                  <div className="space-y-3">
                    {profile.favoriteThings && (
                      <div className="flex items-start gap-3">
                        <ThumbsUp className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">好きなもの</p>
                          <p className="text-gray-800">{profile.favoriteThings}</p>
                        </div>
                      </div>
                    )}
                    {profile.dislikedThings && (
                      <div className="flex items-start gap-3">
                        <ThumbsDown className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">苦手なもの</p>
                          <p className="text-gray-800">{profile.dislikedThings}</p>
                        </div>
                      </div>
                    )}
                    {profile.hobby && (
                      <div className="flex items-start gap-3">
                        <Heart className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">趣味・特技</p>
                          <p className="text-gray-800">{profile.hobby}</p>
                        </div>
                      </div>
                    )}
                    {profile.dream && (
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">将来の夢</p>
                          <p className="text-gray-800">{profile.dream}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* メッセージ */}
                {profile.message && (
                  <div>
                    <h3 className="text-blue-900 mb-3 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      メッセージ
                    </h3>
                    <Card className="bg-blue-50/50 border-blue-200 p-4">
                      <p className="text-gray-800 whitespace-pre-wrap">{profile.message}</p>
                    </Card>
                  </div>
                )}
              </div>
            </div>

            {/* 自由記入欄（マークダウン） */}
            {profile.freeDescription && (
              <div className="mt-8 pt-8 border-t-2 border-blue-200">
                <h3 className="text-blue-900 mb-4">プロフィール詳細</h3>
                <Card className="bg-white border-blue-200 p-6">
                  <div className="prose prose-sm max-w-none prose-headings:text-blue-900 prose-a:text-blue-600">
                    <ReactMarkdown>{profile.freeDescription}</ReactMarkdown>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </Card>

        {/* 動画セクション */}
        {(profile.videoUrls?.length ?? 0) > 0 && (
          <div className="bg-white border-2 border-blue-200 rounded-lg shadow-lg p-6">
            <h3 className="text-blue-900 mb-4 flex items-center gap-2">
              <Youtube className="w-5 h-5" />
              動画
            </h3>
            <VideoSection videoUrls={profile.videoUrls!} profileId={profile.id} />
          </div>
        )}

        {/* おすすめのVtuber */}
        {recommendedVtubers.length > 0 && (
          <div>
            <h3 className="text-blue-900 mb-4">{profile.name}さんが好きな方におすすめのVTuber</h3>
            <ScrollableCardList>
              {recommendedVtubers.map(vtuber => (
                <div key={vtuber.id} className="w-80">
                  <VTuberCard
                    profile={vtuber}
                    onClick={() => onSelectProfile(vtuber)}
                  />
                </div>
              ))}
            </ScrollableCardList>
          </div>
        )}

        {/* コメント欄上部広告 */}
        {adConfig.detailCommentsTop && (
          <AdBanner position="detail-comments-top" variant="horizontal" />
        )}

        {/* BBS（チャット欄） */}
        <Card className="bg-white border-2 border-blue-200 shadow-lg">
          <div className="p-6">
            <h3 className="text-blue-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              ファンの声・コメント欄
            </h3>

            {/* コメント一覧 */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {comments.map(comment => (
                <div key={comment.id} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center">
                        <span className="text-white text-sm">{comment.userName.charAt(0)}</span>
                      </div>
                      <span className="text-blue-900">{comment.userName}</span>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                  </div>
                  <p className="text-gray-800 ml-10">{comment.message}</p>
                </div>
              ))}
            </div>

            {/* コメント投稿フォーム */}
            <div className="border-t-2 border-blue-200 pt-4">
              <h4 className="text-blue-800 mb-3">コメントを投稿</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="名前（必須）"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none bg-white"
                />
                <Textarea
                  placeholder="コメントを入力してください..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-white min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || !userName.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    投稿する
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* コメント欄下部広告 */}
        {adConfig.detailCommentsBottom && (
          <AdBanner position="detail-comments-bottom" variant="horizontal" />
        )}

        {/* おすすめのVtuber */}
        {mostViewedVtubers.length > 0 && (
          <div>
            <h3 className="text-blue-900 mb-4">おすすめのVTuber</h3>
            <ScrollableCardList>
              {mostViewedVtubers.map(vtuber => (
                <div key={vtuber.id} className="w-80">
                  <VTuberCard
                    profile={vtuber}
                    onClick={() => onSelectProfile(vtuber)}
                  />
                </div>
              ))}
            </ScrollableCardList>
          </div>
        )}

        {/* 閲覧履歴 */}
        {viewingHistory.length > 0 && (
          <div>
            <h3 className="text-blue-900 mb-4">閲覧履歴</h3>
            <ScrollableCardList>
              {viewingHistory.map(vtuber => (
                <div key={vtuber.id} className="w-80">
                  <VTuberCard
                    profile={vtuber}
                    onClick={() => onSelectProfile(vtuber)}
                  />
                </div>
              ))}
            </ScrollableCardList>
          </div>
        )}

        {/* 画像拡大モーダル */}
        {isImageModalOpen && images.length > 0 && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setIsImageModalOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>

            <div className="relative max-w-5xl w-full">
              <img
                src={images[selectedImageIndex]}
                alt={profile.name}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />

              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 編集履歴パネル */}
        <AnimatePresence>
          {isHistoryPanelOpen && (
            <>
              {/* オーバーレイ（編集履歴以外をクリックすると閉じる） */}
              <motion.div 
                className="fixed inset-0 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsHistoryPanelOpen(false)}
              />
              
              {/* 編集履歴パネル（右からスライドイン） */}
              <motion.div
                className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto border-l-4 border-blue-400"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="sticky top-0 bg-white border-b-2 border-blue-200 p-4 flex items-center justify-between z-10">
                  <h3 className="text-blue-900 flex items-center gap-2">
                    <History className="w-5 h-5" />
                    編集履歴
                  </h3>
                  <button
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setIsHistoryPanelOpen(false)}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="p-4">
                  {/* ツリー状の表示 */}
                  <div className="space-y-4">
                    {editHistory.map((history, index) => (
                      <div key={history.id} className="relative">
                        {/* ツリーの線 */}
                        {index !== editHistory.length - 1 && (
                          <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-blue-300" />
                        )}
                        
                        {/* ノード */}
                        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 hover:border-blue-400 transition-colors">
                          {/* ツリーのノードアイコン */}
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 relative z-10">
                              <span className="text-white text-sm font-semibold">{history.editor.charAt(0)}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-blue-900 font-semibold">{history.editor}</span>
                              </div>
                              <span className="text-xs text-gray-500">{formatDate(history.timestamp)}</span>
                            </div>
                          </div>

                          {/* 変更内容 */}
                          <div className="ml-11 space-y-3">
                            {history.changes.map((change, changeIndex) => (
                              <div key={`${change.field}-${changeIndex}`} className="bg-white rounded p-3 border border-blue-200">
                                <p className="text-sm font-semibold text-blue-700 mb-2">{change.fieldLabel}</p>
                                {change.oldValue && (
                                  <div className="mb-2">
                                    <p className="text-xs text-gray-500">変更前:</p>
                                    <p className="text-sm text-gray-700 line-through">{change.oldValue}</p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-xs text-gray-500">変更後:</p>
                                  <p className="text-sm text-blue-900 font-medium">{change.newValue}</p>
                                </div>
                              </div>
                            ))}
                            
                            {/* アクションボタン */}
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleRestoreVersion(history.id, history.timestamp)}
                                size="sm"
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                              >
                                <History className="w-4 h-4 mr-2" />
                                復元
                              </Button>
                              <Button
                                onClick={() => {
                                  setReportingHistoryId(history.id);
                                  setIsReportModalOpen(true);
                                }}
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <Flag className="w-4 h-4 mr-2" />
                                通報
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 通報モーダル */}
        {isReportModalOpen && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => { setIsReportModalOpen(false); resetReportState(); }}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => { setIsReportModalOpen(false); resetReportState(); }}
            >
              <X className="w-8 h-8" />
            </button>

            <div
              className="relative max-w-lg w-full bg-white p-6 rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-blue-900 mb-4">通報する</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 font-semibold">
                    通報理由 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedReportReason}
                    onChange={(e) => {
                      setSelectedReportReason(e.target.value);
                      setReportReasonTouched(true);
                    }}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none bg-white ${
                      reportReasonTouched && !selectedReportReason
                        ? 'border-red-400 focus:border-red-400'
                        : 'border-gray-300 focus:border-blue-400'
                    }`}
                  >
                    <option value="">選択してください</option>
                    <option value="不適切な内容">不適切な内容</option>
                    <option value="スパム">スパム</option>
                    <option value="誤った情報">誤った情報</option>
                    <option value="著作権・権利侵害">著作権・権利侵害</option>
                    <option value="なりすまし">なりすまし</option>
                    <option value="その他">その他</option>
                  </select>
                  {reportReasonTouched && !selectedReportReason && (
                    <p className="text-xs text-red-500">通報理由を選択してください</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 font-semibold">
                    詳細 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reportDetail}
                    onChange={(e) => setReportDetail(e.target.value)}
                    onBlur={() => setReportDetailTouched(true)}
                    placeholder="具体的な内容をご記入ください"
                    rows={4}
                    maxLength={500}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none resize-none text-sm ${
                      reportDetailTouched && !reportDetail.trim()
                        ? 'border-red-400 focus:border-red-400'
                        : 'border-gray-300 focus:border-blue-400'
                    }`}
                  />
                  {reportDetailTouched && !reportDetail.trim() && (
                    <p className="text-xs text-red-500">詳細を入力してください</p>
                  )}
                  <p className="text-xs text-gray-400 text-right">{reportDetail.length}/500</p>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => { setIsReportModalOpen(false); resetReportState(); }}
                    className="border-gray-300 text-gray-600"
                  >
                    キャンセル
                  </Button>
                  <Button
                    disabled={!selectedReportReason || !reportDetail.trim()}
                    onClick={() => {
                      if (reportingHistoryId) {
                        console.log(`編集履歴 ${reportingHistoryId} を通報: ${selectedReportReason}`, reportDetail);
                      } else {
                        onReport && onReport(profile);
                      }
                      setIsReportModalOpen(false);
                      setIsReportDoneModalOpen(true);
                      resetReportState();
                    }}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    通報する
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 通報完了モーダル */}
        {isReportDoneModalOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setIsReportDoneModalOpen(false)}
          >
            <div
              className="relative max-w-sm w-full bg-white p-8 rounded-lg shadow-lg text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-gray-900 mb-2">通報しました</h3>
              <p className="text-sm text-gray-500 mb-6">ご報告ありがとうございます。内容を確認いたします。</p>
              <Button
                onClick={() => setIsReportDoneModalOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                閉じる
              </Button>
            </div>
          </div>
        )}

        {/* 復元トースト */}
        {showRestoreToast && (
          <div 
            className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            <p>バージョン {restoredVersion} に復元しました。</p>
          </div>
        )}

        {/* 下部広告 */}
        {adConfig.detailBottom && (
          <AdBanner position="detail-bottom" variant="horizontal" />
        )}
      </motion.div>
    </div>
  );
}