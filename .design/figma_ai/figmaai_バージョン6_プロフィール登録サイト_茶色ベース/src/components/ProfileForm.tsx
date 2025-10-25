import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#e8dcc8] to-[#fdfaf5]">
        <DialogHeader>
          <DialogTitle className="text-[#3d2f1f] flex items-center gap-2">
            <span className="text-2xl">📝</span>
            プロフィール登録
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ノート風の背景エリア */}
          <div className="space-y-6 bg-[#fdfaf5] rounded-lg p-6 shadow-inner border-2 border-[#c9b89a] relative">
            {/* 横線デザイン */}
            <div className="absolute inset-0 pointer-events-none opacity-15">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="border-b border-[#a67c52]"
                  style={{ marginTop: '2rem' }}
                />
              ))}
            </div>

            <div className="relative z-10 space-y-6">
              {/* 基本情報 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#3d2f1f]">
                    名前 <span className="text-[#8b4543]">*</span>
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="border-[#c9b89a] focus:border-[#a67c52] bg-[#f8f3e9]"
                    placeholder="例: 星空あかり"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-[#3d2f1f]">
                    ニックネーム
                  </Label>
                  <Input
                    id="nickname"
                    value={formData.nickname}
                    onChange={(e) => handleChange('nickname', e.target.value)}
                    className="border-[#c9b89a] focus:border-[#a67c52] bg-[#f8f3e9]"
                    placeholder="例: あかりん"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliation" className="text-[#3d2f1f]">
                  所属
                </Label>
                <Input
                  id="affiliation"
                  value={formData.affiliation}
                  onChange={(e) => handleChange('affiliation', e.target.value)}
                  className="border-[#c9b89a] focus:border-[#a67c52] bg-[#f8f3e9]"
                  placeholder="例: ○○プロダクション / 個人勢"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthday" className="text-[#3d2f1f]">
                    誕生日
                  </Label>
                  <Input
                    id="birthday"
                    value={formData.birthday}
                    onChange={(e) => handleChange('birthday', e.target.value)}
                    className="border-[#c9b89a] focus:border-[#a67c52] bg-[#f8f3e9]"
                    placeholder="例: 3月15日"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="debut" className="text-[#3d2f1f]">
                    デビュー日
                  </Label>
                  <Input
                    id="debut"
                    value={formData.debut}
                    onChange={(e) => handleChange('debut', e.target.value)}
                    className="border-[#c9b89a] focus:border-[#a67c52] bg-[#f8f3e9]"
                    placeholder="例: 2023年4月1日"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodType" className="text-[#3d2f1f]">
                    血液型
                  </Label>
                  <Input
                    id="bloodType"
                    value={formData.bloodType}
                    onChange={(e) => handleChange('bloodType', e.target.value)}
                    className="border-[#c9b89a] focus:border-[#a67c52] bg-[#f8f3e9]"
                    placeholder="例: O型"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height" className="text-[#3d2f1f]">
                    身長
                  </Label>
                  <Input
                    id="height"
                    value={formData.height}
                    onChange={(e) => handleChange('height', e.target.value)}
                    className="border-[#c9b89a] focus:border-[#a67c52] bg-[#f8f3e9]"
                    placeholder="例: 158cm"
                  />
                </div>
              </div>

              {/* 詳細情報 */}
              <div className="space-y-2">
                <Label htmlFor="favoriteThings" className="text-[#3d2f1f]">
                  好きなもの
                </Label>
                <Input
                  id="favoriteThings"
                  value={formData.favoriteThings}
                  onChange={(e) => handleChange('favoriteThings', e.target.value)}
                  className="border-[#c9b89a] focus:border-[#a67c52] bg-[#f8f3e9]"
                  placeholder="例: ゲーム、歌うこと、甘いもの"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dislikedThings" className="text-[#3d2f1f]">
                  苦手なもの
                </Label>
                <Input
                  id="dislikedThings"
                  value={formData.dislikedThings}
                  onChange={(e) => handleChange('dislikedThings', e.target.value)}
                  className="border-[#c9b89a] focus:border-[#a67c52] bg-[#f8f3e9]"
                  placeholder="例: 虫、ホラー"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hobby" className="text-[#3d2f1f]">
                  趣味・特技
                </Label>
                <Input
                  id="hobby"
                  value={formData.hobby}
                  onChange={(e) => handleChange('hobby', e.target.value)}
                  className="border-[#c9b89a] focus:border-[#a67c52] bg-[#f8f3e9]"
                  placeholder="例: イラスト、ピアノ"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="catchphrase" className="text-[#3d2f1f]">
                  キャッチフレーズ
                </Label>
                <Input
                  id="catchphrase"
                  value={formData.catchphrase}
                  onChange={(e) => handleChange('catchphrase', e.target.value)}
                  className="border-[#c9b89a] focus:border-[#a67c52] bg-[#f8f3e9]"
                  placeholder="例: みんなに元気を届けるVTuber！"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dream" className="text-[#3d2f1f]">
                  将来の夢
                </Label>
                <Input
                  id="dream"
                  value={formData.dream}
                  onChange={(e) => handleChange('dream', e.target.value)}
                  className="border-[#c9b89a] focus:border-[#a67c52] bg-[#f8f3e9]"
                  placeholder="例: 武道館ライブ"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-[#3d2f1f]">
                  メッセージ
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="border-[#c9b89a] focus:border-[#a67c52] bg-[#f8f3e9] min-h-[100px]"
                  placeholder="自己紹介やメッセージを書いてね！"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-[#3d2f1f]">
                  画像URL（オプション）
                </Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  className="border-[#c9b89a] focus:border-[#a67c52] bg-[#f8f3e9]"
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
              className="border-[#c9b89a]"
            >
              <X className="w-4 h-4 mr-2" />
              キャンセル
            </Button>
            <Button
              type="submit"
              className="bg-[#5d4a34] hover:bg-[#3d2f1f]"
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
