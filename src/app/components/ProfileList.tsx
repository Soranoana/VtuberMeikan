import { VTuberProfile } from '../App';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Users, Calendar } from 'lucide-react';

interface ProfileListProps {
  profiles: VTuberProfile[];
  selectedProfile: VTuberProfile | null;
  onSelectProfile: (profile: VTuberProfile) => void;
}

export function ProfileList({ profiles, selectedProfile, onSelectProfile }: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <Card className="p-8 text-center bg-white border-2 border-dashed border-blue-200">
        <Users className="w-16 h-16 mx-auto mb-4 text-blue-300" />
        <p className="text-gray-500">まだプロフィールがありません</p>
        <p className="text-gray-400 text-sm mt-2">「新しいプロフィールを追加」ボタンから登録してください</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg border-2 border-blue-100">
      <div className="p-4 border-b-2 border-blue-100 bg-blue-50">
        <h2 className="text-blue-900 flex items-center gap-2">
          <Users className="w-5 h-5" />
          プロフィール一覧
          <span className="ml-auto text-sm text-blue-600">全 {profiles.length} 件</span>
        </h2>
      </div>
      <ScrollArea className="h-[600px]">
        <div className="p-4 space-y-3">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => onSelectProfile(profile)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                selectedProfile?.id === profile.id
                  ? 'border-blue-400 bg-blue-50 shadow-md'
                  : 'border-blue-100 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex items-start gap-3">
                {profile.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white">
                    {profile.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-blue-900 truncate">{profile.name}</div>
                  {profile.nickname && (
                    <div className="text-sm text-gray-500 truncate">
                      {profile.nickname}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {profile.debut || '未設定'}
                  </div>
                </div>
              </div>
              {profile.catchphrase && (
                <div className="mt-2 text-xs text-blue-600 italic truncate">
                  「{profile.catchphrase}」
                </div>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
