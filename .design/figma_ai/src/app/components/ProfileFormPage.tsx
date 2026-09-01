import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { VTuberLocalization } from '../types';
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
  Languages,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SnsLinksEditor, SnsIconDisplay, newSnsLink, type SnsLink } from './SnsLinksEditor';
import { DeleteRequestModal } from './DeleteRequestModal';
import { RelationshipsEditor } from './RelationshipsEditor';
import { VideoPreview } from './VideoPreview';
import { useApp } from '../context/AppContext';
import { VTuberRelationship } from '../types';
import { LockToggleBtn, LockedFieldWrapper } from './LockField';

interface ProfileFormPageProps {
  onSubmit: (profile: Omit<VTuberProfile, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: VTuberProfile;
}

// 言語ごとに内容が異なるフィールド
const LOCALIZED_FIELDS = [
  'name', 'nickname', 'catchphrase', 'oneWord',
  'dream', 'message', 'favoriteThings', 'dislikedThings',
  'hobby', 'freeDescription',
] as const;
type LocalizedFieldKey = typeof LOCALIZED_FIELDS[number];

const EDIT_LANGS = [
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
] as const;

function emptyLocalization(): Required<VTuberLocalization> {
  return { name: '', nickname: '', catchphrase: '', oneWord: '', dream: '', message: '', favoriteThings: '', dislikedThings: '', hobby: '', freeDescription: '' };
}

// ---- Birthday helpers -------------------------------------------------------

// "7月15日" → "2000-07-15" (date input value)
function birthdayToDateInput(birthday: string): string {
  const m = birthday.match(/^(\d{1,2})月(\d{1,2})日$/);
  if (!m) return '';
  return `2000-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`;
}

// "2000-07-15" → "7月15日"
function dateInputToBirthday(dateVal: string): string {
  if (!dateVal) return '';
  const parts = dateVal.split('-');
  if (parts.length < 3) return dateVal;
  return `${parseInt(parts[1])}月${parseInt(parts[2])}日`;
}

// ----------------------------------------------------------------------------

export function ProfileFormPage({ onSubmit, onCancel, initialData }: ProfileFormPageProps) {
  const navigate = useNavigate();
  const { profiles: allProfiles, isLoggedIn } = useApp();
  const [relationships, setRelationships] = useState<VTuberRelationship[]>(initialData?.relationships ?? []);
  const [isConfirmMode, setIsConfirmMode] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  // 誕生日入力モード: date = 日付形式（タグ連携あり）, free = 自由記入
  const [birthdayMode, setBirthdayMode] = useState<'date' | 'free'>(() =>
    /^\d{1,2}月\d{1,2}日$/.test(initialData?.birthday ?? '') ? 'date' : 'free'
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeEditLang, setActiveEditLang] = useState<'ja' | 'en' | 'zh'>('ja');
  // 自動翻訳：選択中の翻訳先言語セット
  const [autoTranslateTo, setAutoTranslateTo] = useState<Set<string>>(new Set());

  // ロック機能: 星空みらい（id=1）の編集ページのみ有効
  const isOwnerPage = !!initialData && initialData.id === '1';
  const [lockedFields, setLockedFields] = useState<Set<string>>(
    new Set(initialData?.lockedFields ?? [])
  );
  const toggleLockField = (key: string) => {
    if (!isLoggedIn || !isOwnerPage) return;
    setLockedFields(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };
  const fieldDisabled = (key: string) => isOwnerPage && !isLoggedIn && lockedFields.has(key);

  // 言語ごとのローカライズフィールド（ja は formData と同期、en/zh は langForms で管理）
  const [langForms, setLangForms] = useState<{ en: Required<VTuberLocalization>; zh: Required<VTuberLocalization> }>({
    en: { ...emptyLocalization(), ...initialData?.localizations?.en },
    zh: { ...emptyLocalization(), ...initialData?.localizations?.zh },
  });

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

  // 現在の言語のローカライズフィールド値を取得
  const getLocalizedValue = useCallback((field: LocalizedFieldKey): string => {
    if (activeEditLang === 'ja') return formData[field];
    return langForms[activeEditLang][field];
  }, [activeEditLang, formData, langForms]);

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

  // ---- 自動翻訳（選択管理のみ・実行は未実装） ---------------------------------

  function toggleAutoTranslate(code: string) {
    setAutoTranslateTo(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  }

  // -------------------------------------------------------------------------

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

    // 英語・中国語のローカライズデータ（空でないフィールドのみ保存）
    const buildLocale = (lang: 'en' | 'zh'): VTuberLocalization | undefined => {
      const src = langForms[lang];
      const filtered: VTuberLocalization = {};
      (LOCALIZED_FIELDS as readonly LocalizedFieldKey[]).forEach(k => {
        if (src[k].trim()) filtered[k] = src[k];
      });
      return Object.keys(filtered).length > 0 ? filtered : undefined;
    };

    const locEn = buildLocale('en');
    const locZh = buildLocale('zh');
    const localizations = (locEn || locZh)
      ? { ...(locEn ? { en: locEn } : {}), ...(locZh ? { zh: locZh } : {}) }
      : undefined;

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
      localizations,
      relationships: relationships.length > 0 ? relationships : undefined,
      lockedFields: lockedFields.size > 0 ? [...lockedFields] : undefined,
    });
  };

  // ローカライズフィールドかどうかを判定
  const isLocalizedField = (field: string): field is LocalizedFieldKey =>
    (LOCALIZED_FIELDS as readonly string[]).includes(field);

  const handleChange = (field: string, value: string) => {
    if (activeEditLang !== 'ja' && isLocalizedField(field)) {
      // 英語・中国語タブではローカライズストアへ
      setLangForms(prev => ({
        ...prev,
        [activeEditLang]: { ...prev[activeEditLang], [field]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
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
    localizations: {
      en: langForms.en,
      zh: langForms.zh,
    },
    relationships: relationships.length > 0 ? relationships : undefined,
  };

  // 入力済み言語一覧（タブに ● バッジを表示するため）
  const hasLangContent = (lang: 'en' | 'zh') =>
    LOCALIZED_FIELDS.some(f => langForms[lang][f].trim() !== '');

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

          {/* 多言語データの確認 */}
          {(['en', 'zh'] as const).map(lang => {
            const loc = langForms[lang];
            const hasData = LOCALIZED_FIELDS.some(f => loc[f].trim() !== '');
            if (!hasData) return null;
            const langLabel = lang === 'en' ? '🇬🇧 English' : '🇨🇳 中文';
            return (
              <div key={lang} className="bg-white border-2 border-indigo-200 rounded-lg p-5">
                <h4 className="text-indigo-800 font-semibold mb-3 text-sm">{langLabel} — 入力済み言語データ</h4>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {LOCALIZED_FIELDS.map(f => loc[f].trim() ? (
                    <div key={f}>
                      <dt className="text-gray-500 text-xs">{f}</dt>
                      <dd className="text-gray-800 truncate">{loc[f]}</dd>
                    </div>
                  ) : null)}
                </dl>
              </div>
            );
          })}

          {/* 相関図データの確認 */}
          {relationships.length > 0 && (
            <div className="bg-white border-2 border-violet-200 rounded-lg p-5">
              <h4 className="text-violet-800 font-semibold mb-3 text-sm flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
                  <path d="M12 7v4M8.5 17.5l-1.5-3M15.5 17.5l1.5-3"/>
                </svg>
                相関図 — {relationships.length}件の関係値
              </h4>
              <div className="space-y-1.5">
                {relationships.map((rel, i) => {
                  const target = allProfiles.find(p => p.id === rel.targetId);
                  const dir = rel.direction ?? 'both';
                  const arrow = dir === 'to' ? '→' : dir === 'from' ? '←' : '↔';
                  return (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 text-xs w-4">{i + 1}.</span>
                      <span className="font-medium text-gray-800">{target?.name ?? rel.targetId}</span>
                      <span className="text-violet-500 font-bold">{arrow}</span>
                      <span className="text-gray-600">{rel.label}</span>
                      {rel.reverseLabel && (
                        <span className="text-gray-400 text-xs">/ {rel.reverseLabel}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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

          {/* 言語タブ */}
          <div className="bg-white border-2 border-indigo-200 rounded-lg p-4 shadow-md">
            <div className="grid grid-cols-[7rem_1fr] gap-y-2.5 items-center">

              {/* 行1: 入力言語 */}
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-indigo-800">入力言語</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {EDIT_LANGS.map(({ code, label, flag }) => {
                  const hasData = code !== 'ja' && hasLangContent(code as 'en' | 'zh');
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setActiveEditLang(code as typeof activeEditLang)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                        activeEditLang === code
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow'
                          : 'bg-white border-indigo-200 text-indigo-700 hover:border-indigo-400 hover:bg-indigo-50'
                      }`}
                    >
                      <span>{flag}</span>
                      <span>{label}</span>
                      {hasData && (
                        <span className={`w-1.5 h-1.5 rounded-full ${activeEditLang === code ? 'bg-indigo-200' : 'bg-indigo-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 行2: 自動翻訳 — ラベル（ツールチップ付き） */}
              <div className="flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-indigo-800">自動翻訳</span>
                {/* 注意事項ツールチップ */}
                <div className="relative group">
                  <button
                    type="button"
                    className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold flex items-center justify-center hover:bg-indigo-200 transition-colors leading-none select-none"
                    aria-label="自動翻訳の注意事項"
                  >
                    !
                  </button>
                  <div className="absolute left-0 bottom-full mb-2 min-w-[260px] w-72 bg-gray-900 text-white text-xs rounded-lg px-3.5 py-3 shadow-xl z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150">
                    <p className="font-semibold mb-2 text-white/90">自動翻訳について</p>
                    <ul className="space-y-1.5 text-white/80 leading-relaxed">
                      <li>・ 翻訳先に選択した言語へ、入力済み項目を自動翻訳します</li>
                      <li>・ 機械翻訳のため、翻訳後は内容の確認・修正をおすすめします</li>
                      <li>・ 1フィールドが 480 文字を超える場合は先頭のみ翻訳されます</li>
                      <li>・ EN / ZH タブでは名前・説明文等のテキスト項目のみが保存されます。所属・URL・タグ等は日本語タブのみで編集できます</li>
                    </ul>
                    <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
              </div>
              {/* 全言語ボタン：入力言語と同じスタイル、選択中はアクティブ色、入力言語はdisabled */}
              <div className="flex gap-2 flex-wrap">
                {EDIT_LANGS.map(({ code, label, flag }) => {
                  const isActive = code === activeEditLang;
                  const isSelected = autoTranslateTo.has(code);
                  return (
                    <button
                      key={code}
                      type="button"
                      disabled={isActive}
                      onClick={() => toggleAutoTranslate(code)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                        isActive
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          : isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow'
                            : 'bg-white border-indigo-200 text-indigo-700 hover:border-indigo-400 hover:bg-indigo-50'
                      }`}
                    >
                      <span>{flag}</span>
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

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
                  disabled={fieldDisabled('images_add')}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="imageFile"
                    className={`flex items-center justify-center gap-2 flex-1 px-4 py-4 border-2 border-dashed border-blue-300 rounded-lg transition-colors text-blue-700 ${fieldDisabled('images_add') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-50'}`}
                  >
                    <Upload className="w-5 h-5" />
                    <span>画像を選択（複数枚可）</span>
                  </label>
                  <LockToggleBtn fieldKey="images_add" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('images_add')} onToggle={toggleLockField} />
                </div>
                <p className="text-xs text-gray-500 mt-1.5 text-center">最初にアップロードした画像がメイン画像として表示されます</p>
              </div>

              {/* アップロード済み画像一覧 */}
              {imageUrls.length > 0 && (
                <div>
                  <p className="text-sm text-blue-900 mb-2 font-medium">アップロード済み画像（{imageUrls.length}枚）</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {imageUrls.map((url, index) => {
                      const imgKey = `image_${index}`;
                      const imgDisabled = fieldDisabled(imgKey);
                      return (
                        <div key={index} className={`relative group aspect-square ${imgDisabled ? 'opacity-60' : ''}`}>
                          <img
                            src={url}
                            alt={`画像 ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border-2 border-blue-200"
                          />
                          {index === 0 && (
                            <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">メイン</span>
                          )}
                          <div className="absolute bottom-1 right-1 flex items-center gap-0.5">
                            <LockToggleBtn fieldKey={imgKey} isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has(imgKey)} onToggle={toggleLockField} />
                          </div>
                          {!imgDisabled && (
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
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
                <Label htmlFor="name" className="text-blue-900 flex items-center gap-1.5">
                  名前 <span className="text-red-500">*</span>
                  {activeEditLang !== 'ja' && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-medium">多言語</span>}
                  <LockToggleBtn fieldKey="name" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('name')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('name')}>
                  <Input
                    id="name"
                    required={activeEditLang === 'ja'}
                    value={getLocalizedValue('name')}
                    onChange={(e) => handleChange('name', e.target.value)}
                    disabled={fieldDisabled('name')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: 星空みらい"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-blue-900 flex items-center gap-1.5">
                  ニックネーム
                  {activeEditLang !== 'ja' && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-medium">多言語</span>}
                  <LockToggleBtn fieldKey="nickname" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('nickname')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('nickname')}>
                  <Input
                    id="nickname"
                    value={getLocalizedValue('nickname')}
                    onChange={(e) => handleChange('nickname', e.target.value)}
                    disabled={fieldDisabled('nickname')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: みらいちゃん"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliation" className="text-blue-900 flex items-center gap-1.5">
                  所属 {activeEditLang !== 'ja' && <span className="text-[10px] text-gray-400 ml-1">（日本語タブで編集）</span>}
                  <LockToggleBtn fieldKey="affiliation" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('affiliation')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('affiliation')}>
                  <Input
                    id="affiliation"
                    value={formData.affiliation}
                    onChange={(e) => handleChange('affiliation', e.target.value)}
                    disabled={activeEditLang !== 'ja' || fieldDisabled('affiliation')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: スターライトプロダクション"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label className="text-blue-900 flex items-center gap-1.5">
                  誕生日 {activeEditLang !== 'ja' && <span className="text-[10px] text-gray-400 ml-1">（日本語タブで編集）</span>}
                  <LockToggleBtn fieldKey="birthday" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('birthday')} onToggle={toggleLockField} />
                </Label>
                {/* 入力形式の切り替え */}
                <div className="flex gap-4">
                  {(['date', 'free'] as const).map((mode) => (
                    <label key={mode} className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="birthdayMode"
                        value={mode}
                        checked={birthdayMode === mode}
                        onChange={() => setBirthdayMode(mode)}
                        disabled={activeEditLang !== 'ja' || fieldDisabled('birthday')}
                        className="accent-blue-600"
                      />
                      <span className="text-sm text-gray-700">
                        {mode === 'date' ? '日付形式' : '自由記入'}
                      </span>
                    </label>
                  ))}
                </div>
                {birthdayMode === 'date' ? (
                  <LockedFieldWrapper disabled={fieldDisabled('birthday')}>
                    <Input
                      id="birthday"
                      type="date"
                      value={birthdayToDateInput(formData.birthday)}
                      onChange={(e) => handleChange('birthday', dateInputToBirthday(e.target.value))}
                      disabled={activeEditLang !== 'ja' || fieldDisabled('birthday')}
                      className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed w-44"
                    />
                  </LockedFieldWrapper>
                ) : (
                  <>
                    <LockedFieldWrapper disabled={fieldDisabled('birthday')}>
                      <Input
                        id="birthday"
                        value={formData.birthday}
                        onChange={(e) => handleChange('birthday', e.target.value)}
                        disabled={activeEditLang !== 'ja' || fieldDisabled('birthday')}
                        className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="例:平成20年、魔界歴5067年、雨の月 など"
                      />
                    </LockedFieldWrapper>
                    <p className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      自由記入形式の場合、誕生日当日でも「誕生日」のタグが表示されません。
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="debut" className="text-blue-900 flex items-center gap-1.5">
                  デビュー日 {activeEditLang !== 'ja' && <span className="text-[10px] text-gray-400 ml-1">（日本語タブで編集）</span>}
                  <LockToggleBtn fieldKey="debut" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('debut')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('debut')}>
                  <Input
                    id="debut"
                    type="date"
                    value={formData.debut}
                    onChange={(e) => handleChange('debut', e.target.value)}
                    disabled={activeEditLang !== 'ja' || fieldDisabled('debut')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: 2023年4月"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activityHistory" className="text-blue-900 flex items-center gap-1.5">
                  活動歴 {activeEditLang !== 'ja' && <span className="text-[10px] text-gray-400 ml-1">（日本語タブで編集）</span>}
                  <LockToggleBtn fieldKey="activityHistory" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('activityHistory')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('activityHistory')}>
                  <Input
                    id="activityHistory"
                    value={formData.activityHistory}
                    onChange={(e) => handleChange('activityHistory', e.target.value)}
                    disabled={activeEditLang !== 'ja' || fieldDisabled('activityHistory')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: 2年"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activityGenre" className="text-blue-900 flex items-center gap-1.5">
                  活動ジャンル {activeEditLang !== 'ja' && <span className="text-[10px] text-gray-400 ml-1">（日本語タブで編集）</span>}
                  <LockToggleBtn fieldKey="activityGenre" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('activityGenre')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('activityGenre')}>
                  <Input
                    id="activityGenre"
                    value={formData.activityGenre}
                    onChange={(e) => handleChange('activityGenre', e.target.value)}
                    disabled={activeEditLang !== 'ja' || fieldDisabled('activityGenre')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: ゲーム実況"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType" className="text-blue-900 flex items-center gap-1.5">
                  血液型 {activeEditLang !== 'ja' && <span className="text-[10px] text-gray-400 ml-1">（日本語タブで編集）</span>}
                  <LockToggleBtn fieldKey="bloodType" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('bloodType')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('bloodType')}>
                  <Input
                    id="bloodType"
                    value={formData.bloodType}
                    onChange={(e) => handleChange('bloodType', e.target.value)}
                    disabled={activeEditLang !== 'ja' || fieldDisabled('bloodType')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: A型"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height" className="text-blue-900 flex items-center gap-1.5">
                  身長 {activeEditLang !== 'ja' && <span className="text-[10px] text-gray-400 ml-1">（日本語タブで編集）</span>}
                  <LockToggleBtn fieldKey="height" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('height')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('height')}>
                  <Input
                    id="height"
                    value={formData.height}
                    onChange={(e) => handleChange('height', e.target.value)}
                    disabled={activeEditLang !== 'ja' || fieldDisabled('height')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: 158cm"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="text-blue-900 flex items-center gap-1.5">
                  体重 {activeEditLang !== 'ja' && <span className="text-[10px] text-gray-400 ml-1">（日本語タブで編集）</span>}
                  <LockToggleBtn fieldKey="weight" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('weight')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('weight')}>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    disabled={activeEditLang !== 'ja' || fieldDisabled('weight')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: 52kg"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-blue-900 flex items-center gap-1.5">
                  住んでいるところ {activeEditLang !== 'ja' && <span className="text-[10px] text-gray-400 ml-1">（日本語タブで編集）</span>}
                  <LockToggleBtn fieldKey="location" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('location')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('location')}>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    disabled={activeEditLang !== 'ja' || fieldDisabled('location')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: 東京"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tags" className="text-blue-900 flex items-center gap-1.5">
                  タグ（カンマ区切り） {activeEditLang !== 'ja' && <span className="text-[10px] text-gray-400 ml-1">（日本語タブで編集）</span>}
                  <LockToggleBtn fieldKey="tags" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('tags')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('tags')}>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                    disabled={activeEditLang !== 'ja' || fieldDisabled('tags')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: ゲーム実況, 歌ってみた, お絵かき"
                  />
                </LockedFieldWrapper>
              </div>
            </div>
          </div>

          {/* SNSリンク */}
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-md">
            <h3 className="text-blue-900 mb-4 flex items-center gap-2">
              <Link className="w-5 h-5" />
              SNS・リンク
              {activeEditLang !== 'ja' && <span className="text-[10px] text-gray-400 ml-1">（日本語タブで編集）</span>}
            </h3>
            <div className={activeEditLang !== 'ja' ? 'opacity-50 pointer-events-none' : ''}>
              <SnsLinksEditor
                links={snsLinks}
                onChange={setSnsLinks}
                isOwnerPage={isOwnerPage}
                isLoggedIn={isLoggedIn}
                lockedFields={lockedFields}
                onToggleLock={toggleLockField}
              />
            </div>
          </div>

          {/* 動画リンク */}
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-md">
            <h3 className="text-blue-900 mb-4 flex items-center gap-2">
              <Video className="w-5 h-5" />
              動画リンク
              <span className="text-sm text-gray-500">（最大12個）</span>
              {activeEditLang !== 'ja' && <span className="text-[10px] text-gray-400 ml-1">（日本語タブで編集）</span>}
            </h3>
            <div className={activeEditLang !== 'ja' ? 'opacity-50 pointer-events-none' : ''}>
            <div className="space-y-4">
              {videoUrls.map((url, index) => {
                const vidKey = `videoUrl_${index}`;
                const vidDisabled = fieldDisabled(vidKey);
                return (
                  <div key={index} className={`space-y-2 ${vidDisabled ? 'opacity-60' : ''}`}>
                    <Label htmlFor={`videoUrl-${index}`} className="text-blue-900 flex items-center gap-2">
                      <Video className="w-4 h-4 text-blue-600" />
                      動画リンク {index + 1}
                      <LockToggleBtn fieldKey={vidKey} isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has(vidKey)} onToggle={toggleLockField} />
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`videoUrl-${index}`}
                        value={url}
                        onChange={(e) => handleVideoUrlChange(index, e.target.value)}
                        disabled={vidDisabled}
                        className="border-blue-200 focus:border-blue-400 bg-blue-50/30 flex-1 disabled:cursor-not-allowed"
                        placeholder="https://www.youtube.com/watch?v=... または https://www.youtube.com/embed/..."
                      />
                      {!vidDisabled && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveVideoUrl(index)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <VideoPreview url={url} />
                  </div>
                );
              })}
              {videoUrls.length < 12 && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddVideoUrl}
                    disabled={fieldDisabled('videoUrls_add')}
                    className="border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    動画リンクを追加 ({videoUrls.length}/12)
                  </Button>
                  <LockToggleBtn fieldKey="videoUrls_add" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('videoUrls_add')} onToggle={toggleLockField} />
                </div>
              )}
              {videoUrls.length >= 12 && (
                <p className="text-sm text-gray-500">最大数（12個）に達しました</p>
              )}
            </div>
            </div>
          </div>

          {/* 相関図 */}
          <div className="bg-white border-2 border-violet-200 rounded-lg p-6 shadow-md">
            <h3 className="text-violet-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
                <path d="M12 7v4M8.5 17.5l-1.5-3M15.5 17.5l1.5-3"/>
              </svg>
              相関図
              <span className="text-sm text-gray-500">（他のVTuberとの関係値）</span>
              {activeEditLang !== 'ja' && <span className="text-[10px] text-gray-400 ml-1">（日本語タブで編集）</span>}
            </h3>
            <div className={activeEditLang !== 'ja' ? 'opacity-50 pointer-events-none' : ''}>
              <RelationshipsEditor
                relationships={relationships}
                onChange={setRelationships}
                allProfiles={allProfiles}
                currentProfileId={initialData?.id}
                isOwnerPage={isOwnerPage}
                isLoggedIn={isLoggedIn}
                lockedFields={lockedFields}
                onToggleLock={toggleLockField}
              />
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
                <Label htmlFor="oneWord" className="text-blue-900 flex items-center gap-1.5">
                  ひとこと
                  {activeEditLang !== 'ja' && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-medium">多言語</span>}
                  <LockToggleBtn fieldKey="oneWord" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('oneWord')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('oneWord')}>
                  <Input
                    id="oneWord"
                    value={getLocalizedValue('oneWord')}
                    onChange={(e) => handleChange('oneWord', e.target.value)}
                    disabled={fieldDisabled('oneWord')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: みんなと一緒に楽しい時間を過ごしたいな～！"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label htmlFor="catchphrase" className="text-blue-900 flex items-center gap-1.5">
                  キャッチフレーズ
                  {activeEditLang !== 'ja' && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-medium">多言語</span>}
                  <LockToggleBtn fieldKey="catchphrase" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('catchphrase')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('catchphrase')}>
                  <Input
                    id="catchphrase"
                    value={getLocalizedValue('catchphrase')}
                    onChange={(e) => handleChange('catchphrase', e.target.value)}
                    disabled={fieldDisabled('catchphrase')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: みんなに元気を届けるVTuber！"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label htmlFor="favoriteThings" className="text-blue-900 flex items-center gap-1.5">
                  好きなもの
                  {activeEditLang !== 'ja' && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-medium">多言語</span>}
                  <LockToggleBtn fieldKey="favoriteThings" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('favoriteThings')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('favoriteThings')}>
                  <Input
                    id="favoriteThings"
                    value={getLocalizedValue('favoriteThings')}
                    onChange={(e) => handleChange('favoriteThings', e.target.value)}
                    disabled={fieldDisabled('favoriteThings')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: ゲーム、歌うこと、甘いもの"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dislikedThings" className="text-blue-900 flex items-center gap-1.5">
                  苦手なもの
                  {activeEditLang !== 'ja' && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-medium">多言語</span>}
                  <LockToggleBtn fieldKey="dislikedThings" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('dislikedThings')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('dislikedThings')}>
                  <Input
                    id="dislikedThings"
                    value={getLocalizedValue('dislikedThings')}
                    onChange={(e) => handleChange('dislikedThings', e.target.value)}
                    disabled={fieldDisabled('dislikedThings')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: 虫、ホラー"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hobby" className="text-blue-900 flex items-center gap-1.5">
                  趣味・特技
                  {activeEditLang !== 'ja' && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-medium">多言語</span>}
                  <LockToggleBtn fieldKey="hobby" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('hobby')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('hobby')}>
                  <Input
                    id="hobby"
                    value={getLocalizedValue('hobby')}
                    onChange={(e) => handleChange('hobby', e.target.value)}
                    disabled={fieldDisabled('hobby')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: イラスト、ピアノ"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dream" className="text-blue-900 flex items-center gap-1.5">
                  将来の夢
                  {activeEditLang !== 'ja' && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-medium">多言語</span>}
                  <LockToggleBtn fieldKey="dream" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('dream')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('dream')}>
                  <Input
                    id="dream"
                    value={getLocalizedValue('dream')}
                    onChange={(e) => handleChange('dream', e.target.value)}
                    disabled={fieldDisabled('dream')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: たくさんの人を笑顔にしたい"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-blue-900 flex items-center gap-1.5">
                  メッセージ
                  {activeEditLang !== 'ja' && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-medium">多言語</span>}
                  <LockToggleBtn fieldKey="message" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('message')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('message')}>
                  <Textarea
                    id="message"
                    value={getLocalizedValue('message')}
                    onChange={(e) => handleChange('message', e.target.value)}
                    disabled={fieldDisabled('message')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 min-h-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: いつも応援ありがとうございます！一緒に楽しい時間を過ごしましょう！"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label htmlFor="streamingTags" className="text-blue-900 flex items-center gap-1.5">
                  配信タグ {activeEditLang !== 'ja' && <span className="text-[10px] text-gray-400 ml-1">（日本語タブで編集）</span>}
                  <LockToggleBtn fieldKey="streamingTags" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('streamingTags')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('streamingTags')}>
                  <Input
                    id="streamingTags"
                    value={formData.streamingTags}
                    onChange={(e) => handleChange('streamingTags', e.target.value)}
                    disabled={activeEditLang !== 'ja' || fieldDisabled('streamingTags')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: #星空みらい配信"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fanartTag" className="text-blue-900 flex items-center gap-1.5">
                  ファンアートタグ {activeEditLang !== 'ja' && <span className="text-[10px] text-gray-400 ml-1">（日本語タブで編集）</span>}
                  <LockToggleBtn fieldKey="fanartTag" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('fanartTag')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('fanartTag')}>
                  <Input
                    id="fanartTag"
                    value={formData.fanartTag}
                    onChange={(e) => handleChange('fanartTag', e.target.value)}
                    disabled={activeEditLang !== 'ja' || fieldDisabled('fanartTag')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: #星空みらいファンアート"
                  />
                </LockedFieldWrapper>
              </div>

              <div className="space-y-2">
                <Label htmlFor="r18FanartTag" className="text-blue-900 flex items-center gap-1.5">
                  R18ファンアートタグ {activeEditLang !== 'ja' && <span className="text-[10px] text-gray-400 ml-1">（日本語タブで編集）</span>}
                  <LockToggleBtn fieldKey="r18FanartTag" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('r18FanartTag')} onToggle={toggleLockField} />
                </Label>
                <LockedFieldWrapper disabled={fieldDisabled('r18FanartTag')}>
                  <Input
                    id="r18FanartTag"
                    value={formData.r18FanartTag}
                    onChange={(e) => handleChange('r18FanartTag', e.target.value)}
                    disabled={activeEditLang !== 'ja' || fieldDisabled('r18FanartTag')}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="例: #星空みらいR18"
                  />
                </LockedFieldWrapper>
              </div>
            </div>
          </div>

          {/* 自由記入欄 */}
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-blue-900 flex items-center gap-1.5">
                プロフィール詳細（マークダウン対応）
                {activeEditLang !== 'ja' && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-medium">多言語</span>}
                <LockToggleBtn fieldKey="freeDescription" isOwnerPage={isOwnerPage} isLoggedIn={isLoggedIn} locked={lockedFields.has('freeDescription')} onToggle={toggleLockField} />
              </h3>
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
                <ReactMarkdown>{getLocalizedValue('freeDescription') || '*プレビューがここに表示されます*'}</ReactMarkdown>
              </div>
            ) : (
              <LockedFieldWrapper disabled={fieldDisabled('freeDescription')}>
                <Textarea
                  value={getLocalizedValue('freeDescription')}
                  onChange={(e) => handleChange('freeDescription', e.target.value)}
                  disabled={fieldDisabled('freeDescription')}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30 min-h-[300px] font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="マークダウン形式で自由に記入できます&#10;&#10;例:&#10;## 自己紹介&#10;はじめまして！〇〇です。&#10;&#10;### 好きなゲーム&#10;- ゲーム1&#10;- ゲーム2&#10;&#10;**太字** *斜体* など使えます"
                />
              </LockedFieldWrapper>
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