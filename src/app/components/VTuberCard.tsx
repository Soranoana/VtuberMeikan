import { VTuberProfile } from '../App';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Building2, Calendar, MessageCircle, Heart } from 'lucide-react';

interface VTuberCardProps {
  profile: VTuberProfile;
  onClick: () => void;
  isLiked?: boolean;
  onToggleLike?: (e: React.MouseEvent) => void;
}

export function VTuberCard({ profile, onClick, isLiked, onToggleLike }: VTuberCardProps) {
  return (
    <Card
      onClick={onClick}
      className="bg-card border border-border hover:border-primary hover:shadow-xl transition-all cursor-pointer overflow-hidden group flex-shrink-0 w-64"
    >
      {/* プロフィール画像 */}
      <div className="relative">
        <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-accent to-secondary">
          {profile.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt={profile.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground shadow-lg text-sm">
                {profile.name.charAt(0)}
              </div>
            </div>
          )}
        </div>

        {/* デビュー情報のバッジ */}
        {profile.debut && (
          <div className="absolute top-1.5 right-1.5">
            <Badge className="bg-primary text-primary-foreground shadow-lg border-0 text-[10px] py-0 px-1.5 h-4">
              <Calendar className="w-2.5 h-2.5 mr-0.5" />
              {profile.debut}
            </Badge>
          </div>
        )}

        {/* いいねボタン */}
        {onToggleLike && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(e);
            }}
            className={`absolute top-1.5 left-1.5 p-1.5 rounded-full shadow-lg transition-all ${
              isLiked
                ? 'bg-pink-500 hover:bg-pink-600'
                : 'bg-white/90 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-white text-white' : 'text-gray-600'}`} />
          </button>
        )}

        {/* 名前を画像下部に重ねて配置 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3 pt-8">
          <h3 className="text-white group-hover:text-primary transition-colors truncate text-sm leading-tight drop-shadow-lg">
            {profile.name}
          </h3>
          {profile.nickname && (
            <p className="text-[11px] text-white/90 truncate leading-tight drop-shadow-md">
              {profile.nickname}
            </p>
          )}
        </div>
      </div>

      {/* プロフィール情報 */}
      <div className="p-2.5 space-y-1.5 h-32">
        {/* ひとこと */}
        {profile.oneWord && (
          <div className="p-1.5 bg-accent rounded border-l-2 border-primary">
            <div className="flex items-start gap-1">
              <MessageCircle className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-foreground leading-tight line-clamp-2">
                {profile.oneWord}
              </p>
            </div>
          </div>
        )}

        {/* 活動歴と所属を横並びに */}
        <div className="flex items-center gap-2 text-[11px]">
          {profile.activityHistory && (
            <div className="flex items-center gap-1 text-muted-foreground bg-secondary px-1.5 py-0.5 rounded flex-shrink-0">
              <span className="text-secondary-foreground">活動:</span>
              <span>{profile.activityHistory}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-muted-foreground min-w-0">
            <Building2 className="w-3 h-3 text-primary flex-shrink-0" />
            <span className="truncate">{profile.affiliation || '個人勢'}</span>
          </div>
        </div>

        {/* タグ */}
        {profile.tags && profile.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {profile.tags.slice(0, 2).map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="text-[10px] border-primary/30 text-primary bg-card hover:bg-accent transition-colors py-0 px-1.5 h-4 leading-none"
              >
                #{tag}
              </Badge>
            ))}
            {profile.tags.length > 2 && (
              <Badge
                variant="outline"
                className="text-[10px] border-border text-muted-foreground bg-card py-0 px-1.5 h-4 leading-none"
              >
                +{profile.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}