import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { VTuberProfile } from '../App';
import { AdBanner } from './AdBanner';
import { adConfig } from '../config/adConfig';
import {
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Globe,
  CheckCircle,
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
  History,
  ArrowLeft,
  Plus,
  Video,
  Link,
  AlertTriangle,
  Info,
  Trash2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SnsLinksEditor, SnsIconDisplay, newSnsLink, type SnsLink } from './SnsLinksEditor';
import { DeleteRequestModal } from './DeleteRequestModal';

interface ProfileFormPageProps {
  onSubmit: (profile: Omit<VTuberProfile, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: VTuberProfile;
}

export function ProfileFormPage({ onSubmit, onCancel, initialData }: ProfileFormPageProps) {
  const navigate = useNavigate();
  const [isConfirmMode, setIsConfirmMode] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    nickname: initialData?.nickname || '',
    affiliation: initialData?.affiliation || '',
    birthday: initialData?.birthday || '',
    debut: initialData?.debut || '',
    bloodType: initialData?.bloodType || '',
    height: initialData?.height || '',
    favoriteThings: initialData?.favoriteThings || '',
    dislikedThings: initialData?.dislikedThings || '',
    hobby: initialData?.hobby || '',
    catchphrase: initialData?.catchphrase || '',
    dream: initialData?.dream || '',
    message: initialData?.message || '',
    oneWord: initialData?.oneWord || '',
    activityHistory: initialData?.activityHistory || '',
    activityGenre: initialData?.activityGenre || '',
    tags: initialData?.tags?.join(', ') || '',
    youtubeUrl: initialData?.youtubeUrl || '',
    xUrl: initialData?.xUrl || '',
    tiktokUrl: initialData?.tiktokUrl || '',
    websiteUrl: initialData?.websiteUrl || '',
    freeDescription: initialData?.freeDescription || '',
    weight: initialData?.weight || '',
    location: initialData?.location || '',
    streamingTags: initialData?.streamingTags || '',
    fanartTag: initialData?.fanartTag || '',
    r18FanartTag: initialData?.r18FanartTag || '',
  });

  const [imageUrls, setImageUrls] = useState<string[]>(() => {
    if (initialData?.imageUrls?.length) return initialData.imageUrls;
    if (initialData?.imageUrl) return [initialData.imageUrl];
    return [];
  });
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [videoUrls, setVideoUrls] = useState<string[]>(initialData?.videoUrls || ['']);

  // SNSリンク: 既存データから初期化
  const [snsLinks, setSnsLinks] = useState<SnsLink[]>(() => {
    if (initialData?.snsLinks?.length) {
      return initialData.snsLinks.map((l, i) => ({ ...l, id: `sns-init-${i}` }));
    }
    const initial: SnsLink[] = [];
    let c = 0;
    if (initialData?.youtubeUrl) initial.push({ id: `sns-init-${c++}`, icon: 'youtube', label: 'YouTube', url: initialData.youtubeUrl });
    if (initialData?.xUrl)       initial.push({ id: `sns-init-${c++}`, icon: 'x',       label: 'X（旧Twitter）', url: initialData.xUrl });
    if (initialData?.tiktokUrl)  initial.push({ id: `sns-init-${c++}`, icon: 'tiktok',  label: 'TikTok', url: initialData.tiktokUrl });
    if (initialData?.websiteUrl) initial.push({ id: `sns-init-${c++}`, icon: 'globe',   label: 'Webサイト', url: initialData.websiteUrl });
    return initial;
  });

  // 動画URLの追加
  const handleAddVideoUrl = () => {
    if (videoUrls.length < 12) {
      setVideoUrls([...videoUrls, '']);
    }
  };

  // 動画URLの削除
  const handleRemoveVideoUrl = (index: number) => {
    if (videoUrls.length > 1) {
      setVideoUrls(videoUrls.filter((_, i) => i !== index));
    } else {
      setVideoUrls(['']);
    }
  };

  // 動画URLの変更
  const handleVideoUrlChange = (index: number, value: string) => {
    const newVideoUrls = [...videoUrls];
    newVideoUrls[index] = value;
    setVideoUrls(newVideoUrls);
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setTermsAgreed(false);
    setIsConfirmMode(true);
  };

  const handleSave = () => {
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    const filteredVideoUrls = videoUrls.filter(url => url.trim() !== '');
    const filteredSnsLinks = snsLinks.filter(l => l.url.trim() !== '').map(({ id: _id, ...rest }) => rest);

    onSubmit({
      ...formData,
      tags: tagsArray,
      imageUrl: imageUrls[0] || undefined,
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      videoUrls: filteredVideoUrls.length > 0 ? filteredVideoUrls : undefined,
      snsLinks: filteredSnsLinks.length > 0 ? filteredSnsLinks : undefined,
      youtubeUrl: undefined,
      xUrl: undefined,
      tiktokUrl: undefined,
      websiteUrl: undefined,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  // 確認画面用のプロフィールデータ
  const previewProfile: Omit<VTuberProfile, 'id' | 'createdAt'> = {
    ...formData,
    tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    imageUrl: imageUrls[0] || undefined,
    imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
    videoUrls: videoUrls.filter(url => url.trim() !== ''),
    snsLinks: snsLinks.filter(l => l.url.trim() !== '').map(({ id: _id, ...rest }) => rest),
  };

  // 確認画面の表示
  if (isConfirmMode) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-blue-50 to-white p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* 上部広告 */}
          {adConfig.newProfileTop && (
            <AdBanner position="new-profile-top" variant="horizontal" />
          )}

          {/* 確認画面であることを示すヘッダー */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-yellow-400 rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-yellow-700" />
              <h2 className="text-2xl text-yellow-900">入力内容の確認</h2>
            </div>
            <p className="text-sm text-yellow-800">
              以下の内容で登録します。内容を確認して「保存する」ボタンを押してください。
            </p>
          </div>

          {/* プレビューカード */}
          <Card className="bg-white border-4 border-yellow-400 shadow-2xl overflow-hidden mb-6">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* 左カラム：画像 */}
                <div className="lg:w-1/3 space-y-3">
                  {imageUrls.length > 0 && (
                    <>
                      <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                        <img src={imageUrls[0]} alt={previewProfile.name} className="w-full h-full object-cover" />
                      </div>
                      {imageUrls.length > 1 && (
                        <div className="grid grid-cols-3 gap-2">
                          {imageUrls.slice(1).map((url, i) => (
                            <div key={i} className="aspect-square rounded-lg overflow-hidden shadow-md">
                              <img src={url} alt={`${previewProfile.name} ${i + 2}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* 右カラム：詳細情報 */}
                <div className="lg:w-2/3 space-y-6">
                  {/* 名前とニックネーム */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-blue-900">{previewProfile.name || '（未入力）'}</h1>
                      {previewProfile.nickname && (
                        <span className="text-xl text-gray-500">({previewProfile.nickname})</span>
                      )}
                    </div>
                    {previewProfile.catchphrase && (
                      <p className="text-blue-700 italic">「{previewProfile.catchphrase}」</p>
                    )}
                  </div>

                  {/* タグ */}
                  {previewProfile.tags && previewProfile.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {previewProfile.tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          className="bg-blue-100 text-blue-700 border-blue-300 px-3 py-1"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* ひとこと */}
                  {previewProfile.oneWord && (
                    <Card className="bg-blue-50 border-blue-200 p-4">
                      <p className="text-blue-900">{previewProfile.oneWord}</p>
                    </Card>
                  )}

                  {/* SNSリンク */}
                  {previewProfile.snsLinks && previewProfile.snsLinks.length > 0 && (
                    <div>
                      <h3 className="text-blue-900 mb-3 flex items-center gap-2">
                        <Link className="w-5 h-5" />
                        SNS・リンク
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {previewProfile.snsLinks.map((link, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-200 rounded-lg">
                            {link.icon !== 'none' && <SnsIconDisplay icon={link.icon} className="w-5 h-5" />}
                            <span className="text-blue-700">{link.label || link.url}</span>
                          </div>
                        ))}
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
                      {previewProfile.affiliation && (
                        <div className="flex items-start gap-3">
                          <Building2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">所属</p>
                            <p className="text-gray-800">{previewProfile.affiliation}</p>
                          </div>
                        </div>
                      )}
                      {previewProfile.birthday && (
                        <div className="flex items-start gap-3">
                          <Cake className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">誕生日</p>
                            <p className="text-gray-800">{previewProfile.birthday}</p>
                          </div>
                        </div>
                      )}
                      {previewProfile.debut && (
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">デビュー日</p>
                            <p className="text-gray-800">{previewProfile.debut}</p>
                          </div>
                        </div>
                      )}
                      {previewProfile.activityHistory && (
                        <div className="flex items-start gap-3">
                          <History className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">活動歴</p>
                            <p className="text-gray-800">{previewProfile.activityHistory}</p>
                          </div>
                        </div>
                      )}
                      {previewProfile.activityGenre && (
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">活動ジャンル</p>
                            <p className="text-gray-800">{previewProfile.activityGenre}</p>
                          </div>
                        </div>
                      )}
                      {previewProfile.bloodType && (
                        <div className="flex items-start gap-3">
                          <Droplet className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">血液型</p>
                            <p className="text-gray-800">{previewProfile.bloodType}</p>
                          </div>
                        </div>
                      )}
                      {previewProfile.height && (
                        <div className="flex items-start gap-3">
                          <Ruler className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">身長</p>
                            <p className="text-gray-800">{previewProfile.height}</p>
                          </div>
                        </div>
                      )}
                      {previewProfile.weight && (
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">体重</p>
                            <p className="text-gray-800">{previewProfile.weight}</p>
                          </div>
                        </div>
                      )}
                      {previewProfile.location && (
                        <div className="flex items-start gap-3">
                          <Globe className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">住んでいるところ</p>
                            <p className="text-gray-800">{previewProfile.location}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 詳細情報 */}
                  <div>
                    <h3 className="text-blue-900 mb-3">詳細情報</h3>
                    <div className="space-y-3">
                      {previewProfile.favoriteThings && (
                        <div className="flex items-start gap-3">
                          <ThumbsUp className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">好きなもの</p>
                            <p className="text-gray-800">{previewProfile.favoriteThings}</p>
                          </div>
                        </div>
                      )}
                      {previewProfile.dislikedThings && (
                        <div className="flex items-start gap-3">
                          <ThumbsDown className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">苦手なもの</p>
                            <p className="text-gray-800">{previewProfile.dislikedThings}</p>
                          </div>
                        </div>
                      )}
                      {previewProfile.hobby && (
                        <div className="flex items-start gap-3">
                          <Heart className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">趣味・特技</p>
                            <p className="text-gray-800">{previewProfile.hobby}</p>
                          </div>
                        </div>
                      )}
                      {previewProfile.dream && (
                        <div className="flex items-start gap-3">
                          <Target className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">将来の夢</p>
                            <p className="text-gray-800">{previewProfile.dream}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* メッセージ */}
                  {previewProfile.message && (
                    <div>
                      <h3 className="text-blue-900 mb-3 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        メッセージ
                      </h3>
                      <Card className="bg-blue-50/50 border-blue-200 p-4">
                        <p className="text-gray-800 whitespace-pre-wrap">{previewProfile.message}</p>
                      </Card>
                    </div>
                  )}

                  {/* タグ情報 */}
                  {(previewProfile.streamingTags || previewProfile.fanartTag || previewProfile.r18FanartTag) && (
                    <div>
                      <h3 className="text-blue-900 mb-3">タグ情報</h3>
                      <div className="space-y-2">
                        {previewProfile.streamingTags && (
                          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
                            <span className="text-sm text-gray-500 w-28 flex-shrink-0">配信タグ</span>
                            <span className="text-blue-700 font-medium">{previewProfile.streamingTags}</span>
                          </div>
                        )}
                        {previewProfile.fanartTag && (
                          <div className="flex items-center gap-3 bg-pink-50 border border-pink-200 rounded-lg px-4 py-2.5">
                            <span className="text-sm text-gray-500 w-28 flex-shrink-0">ファンアートタグ</span>
                            <span className="text-pink-700 font-medium">{previewProfile.fanartTag}</span>
                          </div>
                        )}
                        {previewProfile.r18FanartTag && (
                          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                            <span className="text-sm text-gray-500 w-28 flex-shrink-0">R18ファンアートタグ</span>
                            <span className="text-red-700 font-medium">{previewProfile.r18FanartTag}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 自由記入欄（マークダウン） */}
              {previewProfile.freeDescription && (
                <div className="mt-8 pt-8 border-t-2 border-blue-200">
                  <h3 className="text-blue-900 mb-4">プロフィール詳細</h3>
                  <Card className="bg-white border-blue-200 p-6">
                    <div className="prose prose-sm max-w-none prose-headings:text-blue-900 prose-a:text-blue-600">
                      <ReactMarkdown>{previewProfile.freeDescription}</ReactMarkdown>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </Card>

          {/* 利用規約同意チェックボックス */}
          <div className="bg-[#FFFBF0] border border-[#D4C5A9] rounded-xl px-5 py-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={e => setTermsAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-[#3a3a3a] leading-relaxed">
                <button
                  type="button"
                  onClick={() => navigate('/terms')}
                  className="font-semibold text-blue-700 underline hover:text-blue-900 transition-colors"
                >
                  利用規約
                </button>
                を確認し、同意したうえで投稿します
              </span>
            </label>
          </div>

          {/* ボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConfirmMode(false)}
              className="border-2 border-gray-300 hover:bg-gray-50 px-8 py-3 text-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              入力画面に戻る
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!termsAgreed}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2" />
              保存する
            </Button>
          </div>

          {/* 下部広告 */}
          {adConfig.newProfileBottom && (
            <AdBanner position="new-profile-bottom" variant="horizontal" />
          )}
        </div>
      </div>
    );
  }

  // 入力フォーム画面
  return (
    // <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 上部広告 */}
        {adConfig.newProfileTop && (
          <AdBanner position="new-profile-form-top" variant="horizontal" />
        )}

        <form onSubmit={handleConfirm} className="space-y-6">
          {/* 画像アップロード */}
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-md">
            <h3 className="text-blue-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              プロフィール画像
            </h3>

            {/* 注意書き */}
            <div className="space-y-2 mb-5">
              <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-300 rounded-lg px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-800">権利者の許諾を得た画像のみ使用してください。無断転載・著作権侵害となる画像のアップロードは禁止されています。</p>
              </div>
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">画像のアップロードを行う前に、必ず<button type="button" onClick={() => navigate('/terms')} className="font-semibold underline text-blue-700 hover:text-blue-900 transition-colors">利用規約</button>をご確認ください。</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* アップロードボタン */}
              <div>
                <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="imageFile"
                  className="flex items-center justify-center gap-2 w-full px-4 py-4 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors text-blue-700"
                >
                  <Upload className="w-5 h-5" />
                  <span>画像を選択（複数枚可）</span>
                </label>
                <p className="text-xs text-gray-500 mt-1.5 text-center">最初にアップロードした画像がメイン画像として表示されます</p>
              </div>

              {/* アップロード済み画像一覧 */}
              {imageUrls.length > 0 && (
                <div>
                  <p className="text-sm text-blue-900 mb-2 font-medium">アップロード済み画像（{imageUrls.length}枚）</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={url}
                          alt={`画像 ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border-2 border-blue-200"
                        />
                        {index === 0 && (
                          <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">メイン</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 中部広告1 */}
          {adConfig.newProfileMiddle1 && (
            <AdBanner position="new-profile-form-middle-1" variant="horizontal" />
          )}

          {/* 基本情報 */}
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-md">
            <h3 className="text-blue-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              基本情報
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name" className="text-blue-900">
                  名前 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: 星空みらい"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-blue-900">
                  ニックネーム
                </Label>
                <Input
                  id="nickname"
                  value={formData.nickname}
                  onChange={(e) => handleChange('nickname', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: みらいちゃん"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliation" className="text-blue-900">
                  所属
                </Label>
                <Input
                  id="affiliation"
                  value={formData.affiliation}
                  onChange={(e) => handleChange('affiliation', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: スターライトプロダクション"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday" className="text-blue-900">
                  誕生日
                </Label>
                <Input
                  id="birthday"
                  value={formData.birthday}
                  onChange={(e) => handleChange('birthday', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: 7月15日"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="debut" className="text-blue-900">
                  デビュー日
                </Label>
                <Input
                  id="debut"
                  value={formData.debut}
                  onChange={(e) => handleChange('debut', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: 2023年4月"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activityHistory" className="text-blue-900">
                  活動歴
                </Label>
                <Input
                  id="activityHistory"
                  value={formData.activityHistory}
                  onChange={(e) => handleChange('activityHistory', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: 2年"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activityGenre" className="text-blue-900">
                  活動ジャンル
                </Label>
                <Input
                  id="activityGenre"
                  value={formData.activityGenre}
                  onChange={(e) => handleChange('activityGenre', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: ゲーム実況"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType" className="text-blue-900">
                  血液型
                </Label>
                <Input
                  id="bloodType"
                  value={formData.bloodType}
                  onChange={(e) => handleChange('bloodType', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: A型"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height" className="text-blue-900">
                  身長
                </Label>
                <Input
                  id="height"
                  value={formData.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: 158cm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="text-blue-900">
                  体重
                </Label>
                <Input
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: 52kg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-blue-900">
                  住んでいるところ
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: 東京"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tags" className="text-blue-900">
                  タグ（カンマ区切り）
                </Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: ゲーム実況, 歌ってみた, お絵かき"
                />
              </div>
            </div>
          </div>

          {/* SNSリンク */}
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-md">
            <h3 className="text-blue-900 mb-4 flex items-center gap-2">
              <Link className="w-5 h-5" />
              SNS・リンク
            </h3>
            <SnsLinksEditor links={snsLinks} onChange={setSnsLinks} />
          </div>

          {/* 動画リンク */}
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-md">
            <h3 className="text-blue-900 mb-4 flex items-center gap-2">
              <Video className="w-5 h-5" />
              動画リンク
              <span className="text-sm text-gray-500">（最大12個）</span>
            </h3>
            
            <div className="space-y-4">
              {videoUrls.map((url, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`videoUrl-${index}`} className="text-blue-900 flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-600" />
                    動画リンク {index + 1}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`videoUrl-${index}`}
                      value={url}
                      onChange={(e) => handleVideoUrlChange(index, e.target.value)}
                      className="border-blue-200 focus:border-blue-400 bg-blue-50/30 flex-1"
                      placeholder="https://www.youtube.com/watch?v=... または https://www.youtube.com/embed/..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveVideoUrl(index)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {videoUrls.length < 12 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddVideoUrl}
                  className="border-blue-300 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  動画リンクを追加 ({videoUrls.length}/12)
                </Button>
              )}
              {videoUrls.length >= 12 && (
                <p className="text-sm text-gray-500">最大数（12個）に達しました</p>
              )}
            </div>
          </div>

          {/* 中部広告2 */}
          {adConfig.newProfileMiddle2 && (
            <AdBanner position="new-profile-form-middle-2" variant="horizontal" />
          )}

          {/* 詳細情報 */}
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-md">
            <h3 className="text-blue-900 mb-4">詳細情報</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oneWord" className="text-blue-900">
                  ひとこと
                </Label>
                <Input
                  id="oneWord"
                  value={formData.oneWord}
                  onChange={(e) => handleChange('oneWord', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: みんなと一緒に楽しい時間を過ごしたいな～！"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="catchphrase" className="text-blue-900">
                  キャッチフレーズ
                </Label>
                <Input
                  id="catchphrase"
                  value={formData.catchphrase}
                  onChange={(e) => handleChange('catchphrase', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: みんなに元気を届けるVTuber！"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="favoriteThings" className="text-blue-900">
                  好きなもの
                </Label>
                <Input
                  id="favoriteThings"
                  value={formData.favoriteThings}
                  onChange={(e) => handleChange('favoriteThings', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: ゲーム、歌うこと、甘いもの"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dislikedThings" className="text-blue-900">
                  苦手なもの
                </Label>
                <Input
                  id="dislikedThings"
                  value={formData.dislikedThings}
                  onChange={(e) => handleChange('dislikedThings', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: 虫、ホラー"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hobby" className="text-blue-900">
                  趣味・特技
                </Label>
                <Input
                  id="hobby"
                  value={formData.hobby}
                  onChange={(e) => handleChange('hobby', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: イラスト、ピアノ"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dream" className="text-blue-900">
                  将来の夢
                </Label>
                <Input
                  id="dream"
                  value={formData.dream}
                  onChange={(e) => handleChange('dream', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: たくさんの人を笑顔にしたい"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-blue-900">
                  メッセージ
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30 min-h-[100px]"
                  placeholder="例: いつも応援ありがとうございます！一緒に楽しい時間を過ごしましょう！"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="streamingTags" className="text-blue-900">
                  配信タグ
                </Label>
                <Input
                  id="streamingTags"
                  value={formData.streamingTags}
                  onChange={(e) => handleChange('streamingTags', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: #星空みらい配信"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fanartTag" className="text-blue-900">
                  ファンアートタグ
                </Label>
                <Input
                  id="fanartTag"
                  value={formData.fanartTag}
                  onChange={(e) => handleChange('fanartTag', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: #星空みらいファンアート"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="r18FanartTag" className="text-blue-900">
                  R18ファンアートタグ
                </Label>
                <Input
                  id="r18FanartTag"
                  value={formData.r18FanartTag}
                  onChange={(e) => handleChange('r18FanartTag', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: #星空みらいR18"
                />
              </div>
            </div>
          </div>

          {/* 自由記入欄 */}
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-blue-900">プロフィール詳細（マークダウン対応）</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                className="border-blue-300"
              >
                {showMarkdownPreview ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    編集
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    プレビュー
                  </>
                )}
              </Button>
            </div>

            {showMarkdownPreview ? (
              <div className="prose prose-sm max-w-none p-4 border-2 border-blue-200 rounded-lg bg-blue-50/30 min-h-[300px]">
                <ReactMarkdown>{formData.freeDescription || '*プレビューがここに表示されます*'}</ReactMarkdown>
              </div>
            ) : (
              <Textarea
                value={formData.freeDescription}
                onChange={(e) => handleChange('freeDescription', e.target.value)}
                className="border-blue-200 focus:border-blue-400 bg-blue-50/30 min-h-[300px] font-mono text-sm"
                placeholder="マークダウン形式で自由に記入できます&#10;&#10;例:&#10;## 自己紹介&#10;はじめまして！〇〇です。&#10;&#10;### 好きなゲーム&#10;- ゲーム1&#10;- ゲーム2&#10;&#10;**太字** *斜体* など使えます"
              />
            )}
          </div>

          {/* ボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            {/* 削除申請（編集モードのみ） */}
            {initialData ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteModal(true)}
                className="border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                削除申請
              </Button>
            ) : (
              <span />
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-2 border-gray-300 hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                キャンセル
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                確認画面へ
              </Button>
            </div>
          </div>
        </form>

        {/* 削除申請モーダル */}
        {showDeleteModal && (
          <DeleteRequestModal
            profileName={formData.name}
            onClose={() => setShowDeleteModal(false)}
          />
        )}

        {/* 下部広告 */}
        {adConfig.newProfileBottom && (
          <AdBanner position="new-profile-form-bottom" variant="horizontal" />
        )}
      </div>
    // </div>
  );
}