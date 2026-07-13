import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, AlertTriangle, Trash2, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';

// 削除申請理由の選択肢
const DELETE_REASONS = [
  '本人からの申請',
  '活動終了・引退',
  '掲載情報の重大な誤り',
  'プライバシー・個人情報に関する問題',
  '著作権・肖像権の問題',
  '重複ページの存在',
  'その他',
] as const;

const CONFIRM_WORD = '削除申請';

interface Props {
  profileName: string;
  onClose: () => void;
}

export function DeleteRequestModal({ profileName, onClose }: Props) {
  const { pushModal, popModal } = useApp();
  useEffect(() => { pushModal(); return popModal; }, []);

  const [reason, setReason] = useState('');
  const [detail, setDetail] = useState('');
  const [confirmInput, setConfirmInput] = useState('');
  const [checkDelay, setCheckDelay] = useState(false);
  const [checkNotGuaranteed, setCheckNotGuaranteed] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);

  const isSubmittable =
    reason !== '' &&
    detail.trim() !== '' &&
    confirmInput === CONFIRM_WORD &&
    checkDelay &&
    checkNotGuaranteed;

  const handleSubmitClick = () => {
    if (isSubmittable) setShowFinalConfirm(true);
  };

  const handleFinalSubmit = () => {
    toast.success('削除申請を受け付けました', {
      description: '申請内容を確認の上、順次対応いたします。',
    });
    setShowFinalConfirm(false);
    onClose();
  };

  return (
    <>
      {/* ---- 削除申請モーダル ---- */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
          {/* ヘッダー */}
          <div className="flex items-center justify-between px-6 py-4 bg-red-50 border-b-2 border-red-200 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <Trash2 className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-red-800">ページ削除申請</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 text-red-500 transition-colors"
              aria-label="閉じる"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 本体（スクロール可） */}
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
            {/* 対象ページ */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm">
              <span className="text-gray-500">申請対象：</span>
              <span className="font-semibold text-gray-800 ml-1">{profileName}</span>
            </div>

            {/* 削除申請理由（セレクト） */}
            <div className="space-y-1.5">
              <Label className="text-gray-800 font-medium">
                削除申請理由 <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={`w-full appearance-none border-2 rounded-lg px-3 py-2 pr-9 text-sm bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 ${
                    reason ? 'border-gray-300 text-gray-800' : 'border-gray-300 text-gray-400'
                  }`}
                >
                  <option value="" disabled>申請理由を選択してください</option>
                  {DELETE_REASONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* 削除申請理由詳細 */}
            <div className="space-y-1.5">
              <Label className="text-gray-800 font-medium">
                削除申請理由の詳細 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="削除が必要な理由を具体的にご記入ください。"
                className="border-2 border-gray-300 focus:border-red-400 min-h-[110px] text-sm resize-y"
              />
            </div>

            {/* 注意事項 + チェックボックス */}
            <div className="space-y-3 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-2 text-amber-800">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
                <p className="text-xs font-semibold leading-snug">申請前にご確認ください</p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checkDelay}
                  onChange={(e) => setCheckDelay(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-red-600 flex-shrink-0"
                />
                <span className="text-xs text-amber-900 leading-relaxed">
                  申請後、実際にページが削除されるまでには一定の時間がかかる場合があります。
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checkNotGuaranteed}
                  onChange={(e) => setCheckNotGuaranteed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-red-600 flex-shrink-0"
                />
                <span className="text-xs text-amber-900 leading-relaxed">
                  削除申請を行った場合でも、申請内容の審査の結果、必ずしも削除されるとは限りません。
                </span>
              </label>
            </div>

            {/* 確認ワード入力 */}
            <div className="space-y-1.5">
              <Label className="text-gray-800 font-medium text-sm">
                削除申請する際は「<span className="font-bold text-red-600">{CONFIRM_WORD}</span>」と入力してください
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder={CONFIRM_WORD}
                className={`border-2 text-sm transition-colors ${
                  confirmInput === CONFIRM_WORD
                    ? 'border-green-400 focus:border-green-500'
                    : 'border-gray-300 focus:border-red-400'
                }`}
              />
              {confirmInput.length > 0 && confirmInput !== CONFIRM_WORD && (
                <p className="text-xs text-red-500">「{CONFIRM_WORD}」と正確に入力してください</p>
              )}
            </div>
          </div>

          {/* フッター */}
          <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 hover:bg-gray-100 text-gray-700"
            >
              キャンセル
            </Button>
            <Button
              type="button"
              disabled={!isSubmittable}
              onClick={handleSubmitClick}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              削除を申請する
            </Button>
          </div>
        </div>
      </div>

      {/* ---- 最終確認ダイアログ ---- */}
      {showFinalConfirm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 pt-6 pb-4 space-y-4">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">本当に削除申請しますか？</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  「<span className="font-semibold text-gray-700">{profileName}</span>」の削除申請を送信します。
                  送信後は申請を取り消せません。
                </p>
                <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-left text-xs text-gray-600">
                  <span className="text-gray-400">申請理由：</span> {reason}
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFinalConfirm(false)}
                className="flex-1 border-2 border-gray-300 text-gray-700"
              >
                戻る
              </Button>
              <Button
                type="button"
                onClick={handleFinalSubmit}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                申請する
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
