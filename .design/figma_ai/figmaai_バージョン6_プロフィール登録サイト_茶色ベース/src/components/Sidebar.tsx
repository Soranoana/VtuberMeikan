import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Search, User, Clock, Star, TrendingUp, Tag } from 'lucide-react';
import { VTuberProfile } from '../App';

interface SidebarProps {
  profiles: VTuberProfile[];
  onSelectProfile: (profile: VTuberProfile) => void;
}

export function Sidebar({ profiles, onSelectProfile }: SidebarProps) {
  // 最近追加されたプロフィール（最新3件）
  const recentProfiles = [...profiles]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  // 新人VTuber（デビュー日が新しい順、最新3件）
  const newcomers = [...profiles]
    .filter(p => p.debut)
    .sort((a, b) => {
      // 簡易的な日付比較
      return b.debut.localeCompare(a.debut);
    })
    .slice(0, 3);

  // ダミーの人気タグ
  const popularTags = [
    { name: 'ゲーム実況', count: 45 },
    { name: '歌ってみた', count: 38 },
    { name: 'ASMR', count: 25 },
    { name: 'お絵かき', count: 22 },
    { name: '雑談', count: 56 },
    { name: 'ホラーゲーム', count: 18 },
  ];

  return (
    <aside className="space-y-4">
      {/* 管理人情報 */}
      <Card className="bg-[#fdfaf5] border-2 border-[#c9b89a] overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-[#e8dcc8] to-[#d4c3a8] border-b-2 border-[#c9b89a]">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#5d4a34]" />
            <h3 className="text-[#3d2f1f]">管理人</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a67c52] to-[#8b7355] flex items-center justify-center text-white">
              管
            </div>
            <div>
              <div className="text-[#3d2f1f]">プロフィール帳管理人</div>
              <div className="text-sm text-[#7a6751]">VTuber応援隊</div>
            </div>
          </div>
          <p className="text-sm text-[#7a6751] leading-relaxed">
            VTuberさんの魅力を記録・共有するプロフィール帳です。みんなで素敵なVTuberさんを見つけましょう！
          </p>
        </div>
      </Card>

      {/* VTuberの検索 */}
      <Card className="bg-[#fdfaf5] border-2 border-[#c9b89a] overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-[#e8dcc8] to-[#d4c3a8] border-b-2 border-[#c9b89a]">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-[#5d4a34]" />
            <h3 className="text-[#3d2f1f]">VTuberの検索</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            <Input
              placeholder="名前で検索..."
              className="border-[#c9b89a] focus:border-[#a67c52]"
            />
            <Button className="w-full bg-[#5d4a34] hover:bg-[#3d2f1f]">
              <Search className="w-4 h-4 mr-2" />
              検索する
            </Button>
          </div>
        </div>
      </Card>

      {/* 最近の更新 */}
      <Card className="bg-[#fdfaf5] border-2 border-[#c9b89a] overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-[#e8dcc8] to-[#d4c3a8] border-b-2 border-[#c9b89a]">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#5d4a34]" />
            <h3 className="text-[#3d2f1f]">最近の更新</h3>
          </div>
        </div>
        <div className="p-4">
          {recentProfiles.length === 0 ? (
            <p className="text-sm text-[#7a6751]">まだ登録がありません</p>
          ) : (
            <div className="space-y-3">
              {recentProfiles.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => onSelectProfile(profile)}
                  className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-[#f8f3e9] transition-colors group"
                >
                  {profile.imageUrl ? (
                    <img
                      src={profile.imageUrl}
                      alt={profile.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#c9b89a]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a67c52] to-[#8b7355] flex items-center justify-center text-white text-sm">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#3d2f1f] truncate group-hover:text-[#5d4a34]">
                      {profile.name}
                    </div>
                    <div className="text-xs text-[#7a6751] truncate">
                      {profile.affiliation || '個人勢'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* 新人VTuber */}
      <Card className="bg-[#fdfaf5] border-2 border-[#c9b89a] overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-[#d4c3a8] to-[#c9b89a] border-b-2 border-[#c9b89a]">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#5d4a34]" />
            <h3 className="text-[#3d2f1f]">新人VTuber</h3>
          </div>
        </div>
        <div className="p-4">
          {newcomers.length === 0 ? (
            <p className="text-sm text-[#7a6751]">まだ登録がありません</p>
          ) : (
            <div className="space-y-3">
              {newcomers.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => onSelectProfile(profile)}
                  className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-[#f8f3e9] transition-colors group"
                >
                  {profile.imageUrl ? (
                    <img
                      src={profile.imageUrl}
                      alt={profile.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#c9b89a]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a67c52] to-[#8b7355] flex items-center justify-center text-white text-sm">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#3d2f1f] truncate group-hover:text-[#5d4a34]">
                      {profile.name}
                    </div>
                    <div className="text-xs text-[#7a6751]">
                      {profile.debut}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* よく見られているVTuber */}
      <Card className="bg-[#fdfaf5] border-2 border-[#c9b89a] overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-[#e8dcc8] to-[#d4c3a8] border-b-2 border-[#c9b89a]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#5d4a34]" />
            <h3 className="text-[#3d2f1f]">よく見られているVTuber</h3>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-[#7a6751]">近日公開予定</p>
        </div>
      </Card>

      {/* 人気のタグ */}
      <Card className="bg-[#fdfaf5] border-2 border-[#c9b89a] overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-[#e8dcc8] to-[#d4c3a8] border-b-2 border-[#c9b89a]">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#5d4a34]" />
            <h3 className="text-[#3d2f1f]">人気のタグ</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <Badge
                key={tag.name}
                variant="outline"
                className="cursor-pointer hover:bg-[#f8f3e9] border-[#a67c52] text-[#5d4a34]"
              >
                {tag.name}
                <span className="ml-1 text-xs text-[#7a6751]">({tag.count})</span>
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </aside>
  );
}
