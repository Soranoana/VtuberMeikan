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
      <Card className="p-8 text-center bg-white border-2 border-dashed border-blue-200 h-[600px] flex items-center justify-center">
        <div>
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-blue-300" />
          <p className="text-gray-500">プロフィールを選択してください</p>
          <p className="text-gray-400 text-sm mt-2">左のリストから見たいプロフィールをクリック</p>
        </div>
      </Card>
    );
  }

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3 py-3 border-b border-blue-100 last:border-0">
        <Icon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="text-sm text-gray-500">{label}</div>
          <div className="text-gray-800 mt-1">{value}</div>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-white shadow-lg border-2 border-blue-100 relative overflow-hidden">
      {/* ノート風の背景装飾 */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="border-b border-blue-300"
            style={{ marginTop: '2rem' }}
          />
        ))}
      </div>

      {/* ヘッダー */}
      <div className="relative p-6 border-b-2 border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-start gap-4">
          {profile.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-2xl shadow-lg border-4 border-white">
              {profile.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-blue-900 mb-1">{profile.name}</h2>
            {profile.nickname && (
              <p className="text-gray-600">愛称: {profile.nickname}</p>
            )}
            {profile.affiliation && (
              <p className="text-sm text-gray-500 mt-1">所属: {profile.affiliation}</p>
            )}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
                  className="bg-red-600 hover:bg-red-700"
                >
                  削除する
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {profile.catchphrase && (
          <div className="mt-4 p-3 bg-white rounded-lg border-l-4 border-blue-400 shadow-sm">
            <p className="text-blue-700 italic">「{profile.catchphrase}」</p>
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
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-100">
                <MessageCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-2">メッセージ</div>
                  <div className="text-gray-800 whitespace-pre-wrap">{profile.message}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
