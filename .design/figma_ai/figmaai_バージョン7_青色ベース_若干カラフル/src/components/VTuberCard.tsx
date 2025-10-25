import { VTuberProfile } from '../App';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Users } from 'lucide-react';

interface VTuberCardProps {
  profile: VTuberProfile;
  onClick: () => void;
}

export function VTuberCard({ profile, onClick }: VTuberCardProps) {
  return (
    <Card
      onClick={onClick}
      className="bg-white border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
    >
      {/* プロフィール画像 */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
        {profile.imageUrl ? (
          <img
            src={profile.imageUrl}
            alt={profile.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl shadow-lg">
              {profile.name.charAt(0)}
            </div>
          </div>
        )}
        {/* デビュー情報のオーバーレイ */}
        {profile.debut && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-blue-600 text-white shadow-lg">
              <Calendar className="w-3 h-3 mr-1" />
              {profile.debut}
            </Badge>
          </div>
        )}
      </div>

      {/* プロフィール情報 */}
      <div className="p-4 space-y-3">
        {/* 名前 */}
        <div>
          <h3 className="text-blue-900 group-hover:text-blue-700 transition-colors truncate">
            {profile.name}
          </h3>
          {profile.nickname && (
            <p className="text-sm text-gray-500 truncate">
              {profile.nickname}
            </p>
          )}
        </div>

        {/* 所属 */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span className="truncate">{profile.affiliation || '個人勢'}</span>
        </div>

        {/* キャッチフレーズ */}
        {profile.catchphrase && (
          <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-400">
            <p className="text-xs text-blue-700 italic line-clamp-2">
              「{profile.catchphrase}」
            </p>
          </div>
        )}

        {/* タグ（もしあれば） */}
        {profile.tags && profile.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {profile.tags.slice(0, 3).map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs border-blue-200 text-blue-600"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
