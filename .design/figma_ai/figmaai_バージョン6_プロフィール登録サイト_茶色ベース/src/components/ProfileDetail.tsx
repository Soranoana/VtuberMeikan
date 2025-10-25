import { VTuberProfile } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { 
  User, 
  Cake, 
  Calendar, 
  Droplet, 
  Ruler, 
  Heart, 
  X as XIcon, 
  Star,
  Target,
  MessageCircle,
  Trash2,
  Sparkles,
  Users
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface ProfileDetailProps {
  profile: VTuberProfile | null;
  onDelete: (id: string) => void;
}

export function ProfileDetail({ profile, onDelete }: ProfileDetailProps) {
  if (!profile) {
    return (
      <Card className="p-8 text-center bg-[#fdfaf5] border-2 border-dashed border-[#c9b89a] h-[600px] flex items-center justify-center">
        <div>
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-[#c9b89a]" />
          <p className="text-[#7a6751]">プロフィールを選択してください</p>
          <p className="text-[#a08968] text-sm mt-2">左のリストから見たいプロフィールをクリック</p>
        </div>
      </Card>
    );
  }

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3 py-3 border-b border-[#e8dcc8] last:border-0">
        <Icon className="w-5 h-5 text-[#5d4a34] mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="text-sm text-[#7a6751]">{label}</div>
          <div className="text-[#3d2f1f] mt-1">{value}</div>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-[#fdfaf5] shadow-lg border-2 border-[#c9b89a] relative overflow-hidden">
      {/* ノート風の背景装飾 */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="border-b border-[#a67c52]"
            style={{ marginTop: '2rem' }}
          />
        ))}
      </div>

      {/* ヘッダー */}
      <div className="relative p-6 border-b-2 border-[#c9b89a] bg-gradient-to-r from-[#e8dcc8] to-[#d4c3a8]">
        <div className="flex items-start gap-4">
          {profile.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-[#fdfaf5] shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#a67c52] to-[#8b7355] flex items-center justify-center text-white text-2xl shadow-lg border-4 border-[#fdfaf5]">
              {profile.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-[#3d2f1f] mb-1">{profile.name}</h2>
            {profile.nickname && (
              <p className="text-[#7a6751]">愛称: {profile.nickname}</p>
            )}
            {profile.affiliation && (
              <p className="text-sm text-[#7a6751] mt-1">所属: {profile.affiliation}</p>
            )}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#8b4543] hover:text-[#6b3533] hover:bg-[#f8f3e9]"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>プロフィールを削除しますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  {profile.name}のプロフィールを削除します。この操作は取り消せません。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(profile.id)}
                  className="bg-[#8b4543] hover:bg-[#6b3533]"
                >
                  削除する
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {profile.catchphrase && (
          <div className="mt-4 p-3 bg-[#fdfaf5] rounded-lg border-l-4 border-[#a67c52] shadow-sm">
            <p className="text-[#5d4a34] italic">「{profile.catchphrase}」</p>
          </div>
        )}
      </div>

      {/* コンテンツ */}
      <ScrollArea className="h-[480px]">
        <div className="relative p-6 space-y-2">
          <InfoRow icon={Users} label="所属" value={profile.affiliation || '個人勢'} />
          <InfoRow icon={Cake} label="誕生日" value={profile.birthday} />
          <InfoRow icon={Calendar} label="デビュー日" value={profile.debut} />
          <InfoRow icon={Droplet} label="血液型" value={profile.bloodType} />
          <InfoRow icon={Ruler} label="身長" value={profile.height} />
          <InfoRow icon={Heart} label="好きなもの" value={profile.favoriteThings} />
          <InfoRow icon={XIcon} label="苦手なもの" value={profile.dislikedThings} />
          <InfoRow icon={Star} label="趣味・特技" value={profile.hobby} />
          <InfoRow icon={Target} label="将来の夢" value={profile.dream} />
          
          {profile.message && (
            <div className="pt-4">
              <div className="flex items-start gap-3 p-4 bg-[#f8f3e9] rounded-lg border-2 border-[#c9b89a]">
                <MessageCircle className="w-5 h-5 text-[#5d4a34] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm text-[#7a6751] mb-2">メッセージ</div>
                  <div className="text-[#3d2f1f] whitespace-pre-wrap">{profile.message}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
