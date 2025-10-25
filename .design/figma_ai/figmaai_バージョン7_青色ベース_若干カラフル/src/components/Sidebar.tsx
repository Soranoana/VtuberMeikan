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
      <Card className="bg-white border-2 border-blue-100 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 border-b-2 border-blue-200">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-blue-900">管理人</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
              管
            </div>
            <div>
              <div className="text-gray-800">プロフィール帳管理人</div>
              <div className="text-sm text-gray-500">VTuber応援隊</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            VTuberさんの魅力を記録・共有するプロフィール帳です。みんなで素敵なVTuberさんを見つけましょう！
          </p>
        </div>
      </Card>

      {/* VTuberの検索 */}
      <Card className="bg-white border-2 border-blue-100 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 border-b-2 border-blue-200">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            <h3 className="text-blue-900">VTuberの検索</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            <Input
              placeholder="名前で検索..."
              className="border-blue-200 focus:border-blue-400"
            />
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4 mr-2" />
              検索する
            </Button>
          </div>
        </div>
      </Card>

      {/* 最近の更新 */}
      <Card className="bg-white border-2 border-blue-100 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 border-b-2 border-blue-200">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-blue-900">最近の更新</h3>
          </div>
        </div>
        <div className="p-4">
          {recentProfiles.length === 0 ? (
            <p className="text-sm text-gray-500">まだ登録がありません</p>
          ) : (
            <div className="space-y-3">
              {recentProfiles.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => onSelectProfile(profile)}
                  className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  {profile.imageUrl ? (
                    <img
                      src={profile.imageUrl}
                      alt={profile.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-sm">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-800 truncate group-hover:text-blue-700">
                      {profile.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
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
      <Card className="bg-white border-2 border-blue-100 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 border-b-2 border-blue-200">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-green-600" />
            <h3 className="text-blue-900">新人VTuber</h3>
          </div>
        </div>
        <div className="p-4">
          {newcomers.length === 0 ? (
            <p className="text-sm text-gray-500">まだ登録がありません</p>
          ) : (
            <div className="space-y-3">
              {newcomers.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => onSelectProfile(profile)}
                  className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  {profile.imageUrl ? (
                    <img
                      src={profile.imageUrl}
                      alt={profile.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-green-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center text-white text-sm">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-800 truncate group-hover:text-blue-700">
                      {profile.name}
                    </div>
                    <div className="text-xs text-gray-500">
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
      <Card className="bg-white border-2 border-blue-100 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-orange-100 to-red-100 border-b-2 border-blue-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <h3 className="text-blue-900">よく見られているVTuber</h3>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500">近日公開予定</p>
        </div>
      </Card>

      {/* 人気のタグ */}
      <Card className="bg-white border-2 border-blue-100 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-pink-100 to-purple-100 border-b-2 border-blue-200">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-pink-600" />
            <h3 className="text-blue-900">人気のタグ</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <Badge
                key={tag.name}
                variant="outline"
                className="cursor-pointer hover:bg-blue-50 border-blue-300 text-blue-700"
              >
                {tag.name}
                <span className="ml-1 text-xs text-gray-500">({tag.count})</span>
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </aside>
  );
}
