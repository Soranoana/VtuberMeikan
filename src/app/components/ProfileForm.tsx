import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { VTuberProfile } from '../App';
import { Save, X } from 'lucide-react';

interface ProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (profile: Omit<VTuberProfile, 'id' | 'createdAt'>) => void;
}

export function ProfileForm({ isOpen, onClose, onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    affiliation: '',
    birthday: '',
    debut: '',
    bloodType: '',
    height: '',
    favoriteThings: '',
    dislikedThings: '',
    hobby: '',
    catchphrase: '',
    dream: '',
    message: '',
    imageUrl: '',
    tags: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      nickname: '',
      affiliation: '',
      birthday: '',
      debut: '',
      bloodType: '',
      height: '',
      favoriteThings: '',
      dislikedThings: '',
      hobby: '',
      catchphrase: '',
      dream: '',
      message: '',
      imageUrl: '',
      tags: [],
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-blue-50 to-white">
        <DialogHeader>
          <DialogTitle className="text-blue-900 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            プロフィール登録
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            VTuberのプロフィールを登録します。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ノート風の背景エリア */}
          <div className="space-y-6 bg-white rounded-lg p-6 shadow-inner border-2 border-blue-100 relative">
            {/* 横線デザイン */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="border-b border-blue-300"
                  style={{ marginTop: '2rem' }}
                />
              ))}
            </div>

            <div className="relative z-10 space-y-6">
              {/* 基本情報 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-blue-900">
                    名前 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                    placeholder="例: 星空あかり"
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
                    placeholder="例: あかりん"
                  />
                </div>
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
                  placeholder="例: ○○プロダクション / 個人勢"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthday" className="text-blue-900">
                    誕生日
                  </Label>
                  <Input
                    id="birthday"
                    value={formData.birthday}
                    onChange={(e) => handleChange('birthday', e.target.value)}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                    placeholder="例: 3月15日"
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
                    placeholder="例: 2023年4月1日"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodType" className="text-blue-900">
                    血液型
                  </Label>
                  <Input
                    id="bloodType"
                    value={formData.bloodType}
                    onChange={(e) => handleChange('bloodType', e.target.value)}
                    className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                    placeholder="例: O型"
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
              </div>

              {/* 詳細情報 */}
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
                <Label htmlFor="dream" className="text-blue-900">
                  将来の夢
                </Label>
                <Input
                  id="dream"
                  value={formData.dream}
                  onChange={(e) => handleChange('dream', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="例: 武道館ライブ"
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
                  placeholder="自己紹介やメッセージを書いてね！"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-blue-900">
                  画像URL（オプション）
                </Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300"
            >
              <X className="w-4 h-4 mr-2" />
              キャンセル
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              保存する
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}