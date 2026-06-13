import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { VTuberCard } from '../components/VTuberCard';
import { ScrollableCardList } from '../components/ScrollableCardList';
import { AdBanner } from '../components/AdBanner';
import { adConfig } from '../config/adConfig';
import { Search, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';

const popularTags = [
  { name: 'ゲーム実況', count: 45 },
  { name: '歌ってみた', count: 38 },
  { name: 'ASMR', count: 25 },
  { name: 'お絵かき', count: 22 },
  { name: '雑談', count: 56 },
  { name: 'ホラーゲーム', count: 18 },
];

export function TopPage() {
  const navigate = useNavigate();
  const { profiles, isLoggedIn, likedProfileIds, recentlyEditedProfileIds, handleToggleLike } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProfiles = profiles.filter(profile => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return profile.name.toLowerCase().includes(q) ||
      profile.nickname?.toLowerCase().includes(q) ||
      profile.affiliation.toLowerCase().includes(q) ||
      profile.tags?.some(t => t.toLowerCase().includes(q));
  });

  const recentlyUpdated = [...profiles]
    .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0))
    .slice(0, 6);

  const newbies = [...profiles]
    .sort((a, b) => {
      const parseYear = (s: string) => parseInt(s.match(/(\d{4})/)?.[1] || '0');
      return parseYear(b.debut) - parseYear(a.debut);
    })
    .slice(0, 6);

  const mostViewed = [...profiles]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 6);

  const likedProfiles = profiles.filter(p => likedProfileIds.includes(p.id));
  const recentlyEditedProfiles = profiles.filter(p => recentlyEditedProfileIds.includes(p.id));

  const cardList = (list: typeof profiles) => (
    <ScrollableCardList>
      {list.map(profile => (
        <div key={profile.id} className="w-80">
          <VTuberCard
            profile={profile}
            onClick={() => navigate(`/vtuber/${profile.id}`)}
            isLiked={likedProfileIds.includes(profile.id)}
            onToggleLike={(e) => { e.stopPropagation(); handleToggleLike(profile.id); }}
          />
        </div>
      ))}
    </ScrollableCardList>
  );

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="mb-4">VTuberを検索</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="名前、ニックネーム、所属、タグで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input-background border-border"
          />
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-muted-foreground">{filteredProfiles.length}件のVTuberが見つかりました</p>
        )}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">人気のタグ</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <Badge
                key={tag.name}
                variant="outline"
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground border-border transition-colors"
                onClick={() => navigate(`/search?tag=${encodeURIComponent(tag.name)}`)}
              >
                {tag.name}<span className="ml-1 text-xs text-muted-foreground">({tag.count})</span>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {adConfig.topSearchBelow && <AdBanner position="top-search-below" variant="horizontal" />}

      {isLoggedIn && likedProfiles.length > 0 && (
        <div>
          <h3 className="mb-4">いいねしたVTuber</h3>
          {cardList(likedProfiles)}
        </div>
      )}

      {isLoggedIn && recentlyEditedProfiles.length > 0 && (
        <div>
          <h3 className="mb-4">最近あなたが編集したVTuber</h3>
          {cardList(recentlyEditedProfiles)}
        </div>
      )}

      <div>
        <h3 className="mb-4">最近更新されたVTuber</h3>
        {recentlyUpdated.length > 0 ? cardList(recentlyUpdated) : (
          <div className="bg-card border border-dashed border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">データがありません</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-4">新人VTuber</h3>
        {newbies.length > 0 ? cardList(newbies) : (
          <div className="bg-card border border-dashed border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">データがありません</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-4">よく見られているVTuber</h3>
        {mostViewed.length > 0 ? cardList(mostViewed) : (
          <div className="bg-card border border-dashed border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">データがありません</p>
          </div>
        )}
      </div>

      {adConfig.topPageBottom && <AdBanner position="top-page-bottom" variant="horizontal" />}
    </div>
  );
}
