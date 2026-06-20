import { useState } from 'react';
import { VTuberProfile } from '../App';
import { VTuberCard } from './VTuberCard';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { AdBanner } from './AdBanner';
import { adConfig } from '../config/adConfig';
import { Search, ChevronDown, ChevronUp, Grid3x3, List, Calendar, Building2, Tag, Cake, TrendingUp, Star, Clock, Heart } from 'lucide-react';

interface SearchPageProps {
  profiles: VTuberProfile[];
  onSelectProfile: (profile: VTuberProfile) => void;
  likedProfileIds?: string[];
  onToggleLike?: (profileId: string) => void;
  initialTag?: string;
  initialBadge?: string;
}

export function SearchPage({ profiles, onSelectProfile, likedProfileIds = [], onToggleLike, initialTag = '', initialBadge = '' }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [freeWordSearch, setFreeWordSearch] = useState('');
  const [selectedAffiliations, setSelectedAffiliations] = useState<string[]>([]);
  const [tagFreeWord, setTagFreeWord] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTag ? [initialTag] : []);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedBirthdays, setSelectedBirthdays] = useState<string[]>([]);
  const [genreFreeWord, setGenreFreeWord] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedActivityStatuses, setSelectedActivityStatuses] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>(initialBadge ? [initialBadge] : []);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 所属事務所一覧を取得
  const affiliations = Array.from(new Set(profiles.map(p => p.affiliation))).sort();

  // タグ一覧を取得
  const allTags = Array.from(
    new Set(profiles.flatMap(p => p.tags || []))
  ).sort();

  // 活動ジャンル一覧を取得
  const genres = Array.from(
    new Set(profiles.map(p => p.activityGenre).filter(Boolean) as string[])
  ).sort();

  // よく見られているVTuberのIDリストを取得（閲覧数上位30%）
  const mostViewedIds = [...profiles]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, Math.ceil(profiles.length * 0.3))
    .map(p => p.id);

  // 新人VTuberのIDリストを取得（デビューが最近1年以内）
  const newcomerIds = profiles
    .filter(p => {
      const debutYear = parseInt(p.debut.match(/(\d{4})/)?.[1] || '0');
      const currentYear = new Date().getFullYear();
      return currentYear - debutYear <= 1;
    })
    .map(p => p.id);

  // 最近更新されたVTuberのIDリストを取得（更新日が最近30日以内）
  const recentlyUpdatedIds = profiles
    .filter(p => {
      if (!p.updatedAt) return false;
      const daysSinceUpdate = Math.floor(
        (new Date().getTime() - p.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceUpdate <= 30;
    })
    .map(p => p.id);

  // 今日誕生日のVTuberのIDリストを取得
  const todayBirthdayIds = profiles
    .filter(p => {
      if (!p.birthday) return false;
      const today = new Date();
      const todayMonth = today.getMonth() + 1;
      const todayDay = today.getDate();
      const birthdayMatch = p.birthday.match(/(\d+)月(\d+)日/);
      if (!birthdayMatch) return false;
      const birthMonth = parseInt(birthdayMatch[1]);
      const birthDay = parseInt(birthdayMatch[2]);
      return birthMonth === todayMonth && birthDay === todayDay;
    })
    .map(p => p.id);

  // 活動状態の選択肢を切り替える関数
  const toggleActivityStatus = (status: string) => {
    setSelectedActivityStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  // タグの選択肢を切り替える関数
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // 活動ジャンルの選択肢を切り替える関数
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  // バッジの選択肢を切り替える関数
  const toggleBadge = (badge: string) => {
    setSelectedBadges(prev =>
      prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
    );
  };

  // 検索フィルタリング
  const filteredProfiles = profiles.filter(profile => {
    // フリーワード検索（全項目横断）
    if (freeWordSearch) {
      const query = freeWordSearch.toLowerCase();
      const matchesAny = 
        profile.name.toLowerCase().includes(query) ||
        profile.nickname?.toLowerCase().includes(query) ||
        profile.affiliation.toLowerCase().includes(query) ||
        profile.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        profile.activityGenre?.toLowerCase().includes(query) ||
        profile.birthday?.toLowerCase().includes(query) ||
        profile.oneWord?.toLowerCase().includes(query) ||
        profile.catchphrase?.toLowerCase().includes(query);
      if (!matchesAny) return false;
    }

    // 名前検索
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = profile.name.toLowerCase().includes(query) ||
                          profile.nickname?.toLowerCase().includes(query);
      if (!matchesName) return false;
    }

    // 所属フィルター
    if (selectedAffiliations.length > 0 && !selectedAffiliations.includes(profile.affiliation)) {
      return false;
    }

    // タグフィルター（複数選択）
    if (selectedTags.length > 0 && !profile.tags?.some(tag => selectedTags.includes(tag))) {
      return false;
    }

    // タグフリーワード検索
    if (tagFreeWord && !profile.tags?.some(tag => tag.toLowerCase().includes(tagFreeWord.toLowerCase()))) {
      return false;
    }

    // 誕生日フィルター（月で検索）
    if (selectedBirthdays.length > 0 && !selectedBirthdays.some(month => profile.birthday.includes(month))) {
      return false;
    }

    // 活動ジャンルフィルター（複数選択）
    if (selectedGenres.length > 0 && !selectedGenres.includes(profile.activityGenre)) {
      return false;
    }

    // 活動ジャンルフリーワード検索
    if (genreFreeWord && !profile.activityGenre?.toLowerCase().includes(genreFreeWord.toLowerCase())) {
      return false;
    }

    // 活動状態フィルター（複数選択）
    if (selectedActivityStatuses.length > 0) {
      const status = profile.activityStatus || '活動中';
      if (!selectedActivityStatuses.includes(status)) {
        return false;
      }
    }

    // バッジフィルター（複数選択）
    if (selectedBadges.length > 0) {
      const badges: string[] = [];
      
      if (mostViewedIds.includes(profile.id)) {
        badges.push('よく見られているVTuber');
      }
      
      if (newcomerIds.includes(profile.id)) {
        badges.push('新人VTuber');
      }
      
      if (recentlyUpdatedIds.includes(profile.id)) {
        badges.push('最近更新されたVTuber');
      }
      
      if (todayBirthdayIds.includes(profile.id)) {
        badges.push('今日誕生日のVTuber');
      }

      // 選択されたバッジのいずれかに一致するかチェック
      const hasBadge = selectedBadges.some(badge => badges.includes(badge));
      if (!hasBadge) return false;
    }

    return true;
  });

  // フィルターをクリア
  const clearFilters = () => {
    setSearchQuery('');
    setFreeWordSearch('');
    setSelectedAffiliations([]);
    setTagFreeWord('');
    setSelectedTags([]);
    setSelectedBirthdays([]);
    setGenreFreeWord('');
    setSelectedGenres([]);
    setSelectedActivityStatuses([]);
    setSelectedBadges([]);
  };

  const hasActiveFilters = searchQuery || freeWordSearch || selectedAffiliations.length > 0 || tagFreeWord || selectedTags.length > 0 || selectedBirthdays.length > 0 || genreFreeWord || selectedGenres.length > 0 || selectedActivityStatuses.length > 0 || selectedBadges.length > 0;

  return (
    <div className="space-y-6">
      {/* 上部広告 */}
      {adConfig.searchTop && (
        <AdBanner position="search-top" variant="horizontal" />
      )}

      {/* ノート風検索エリア */}
      <Card className="bg-card border-2 border-primary/20 shadow-lg relative overflow-hidden">
        {/* ノート風の横線装飾 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary/10 via-primary/5 to-primary/10"></div>
          <div className="absolute left-12 top-0 w-px h-full bg-primary/10"></div>
        </div>

        <div className="relative p-6 space-y-4">
          {/* ヘッダー */}
          <div className="flex items-center gap-3 pb-4 border-b-2 border-primary/20">
            <Search className="w-6 h-6 text-primary" />
            <h2 className="text-primary">VTuber検索</h2>
          </div>

          {/* 基本検索 */}
          <div className="space-y-4 pl-14">
            {/* フリーワード検索 */}
            <div>
              <label className="block mb-2 text-foreground flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" />
                フリーワード検索
              </label>
              <Input
                type="text"
                placeholder="名前、所属、タグ、活動ジャンルなどで横断検索..."
                value={freeWordSearch}
                onChange={(e) => setFreeWordSearch(e.target.value)}
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground mt-1">
                すべての項目を横断して検索します
              </p>
            </div>

            {/* 名前検索 */}
            <div>
              <label className="block mb-2 text-foreground">名前で検索</label>
              <Input
                type="text"
                placeholder="VTuberの名前やニックネームを入力..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background border-border"
              />
            </div>

            {/* 所属検索 */}
            <div>
              <label className="block mb-2 text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                所属で検索（複数選択可）
              </label>
              <div className="space-y-3">
                {/* よく検索される所属 */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">よく検索される所属</p>
                  <div className="flex flex-wrap gap-2">
                    {affiliations.map(affiliation => (
                      <Button
                        key={affiliation}
                        variant={selectedAffiliations.includes(affiliation) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedAffiliations(prev => prev.includes(affiliation) ? prev.filter(a => a !== affiliation) : [...prev, affiliation])}
                      >
                        {affiliation}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* タグ検索 */}
            <div>
              <label className="block mb-2 text-foreground flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                タグで検索（複数選択可）
              </label>
              <div className="space-y-3">
                {/* 自由入力 */}
                <Input
                  type="text"
                  placeholder="タグをフリーワードで検索..."
                  value={tagFreeWord}
                  onChange={(e) => setTagFreeWord(e.target.value)}
                  className="bg-background border-border"
                />
                {/* よく検索されるタグ */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">よく検索されるタグ</p>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1"
                        onClick={() => toggleTag(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 詳細検索トグル */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-primary hover:text-primary/80 hover:bg-primary/10"
            >
              {showAdvanced ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  詳細検索を閉じる
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  詳細検索を開く
                </>
              )}
            </Button>

            {/* 詳細検索 */}
            {showAdvanced && (
              <div className="space-y-4 p-4 bg-accent/30 rounded-lg border-l-4 border-primary">
                {/* 誕生日検索 */}
                <div>
                  <label className="block mb-2 text-foreground flex items-center gap-2">
                    <Cake className="w-4 h-4 text-primary" />
                    誕生月で検索（複数選択可）
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'].map(month => (
                      <Button
                        key={month}
                        variant={selectedBirthdays.includes(month) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedBirthdays(prev => prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month])}
                      >
                        {month}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 活動ジャンル検索 */}
                <div>
                  <label className="block mb-2 text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    活動ジャンルで検索（複数選択可）
                  </label>
                  <div className="space-y-3">
                    {/* 自由入力 */}
                    <Input
                      type="text"
                      placeholder="活動ジャンルをフリーワードで検索..."
                      value={genreFreeWord}
                      onChange={(e) => setGenreFreeWord(e.target.value)}
                      className="bg-background border-border"
                    />
                    {/* よく検索される活動ジャンル */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">よく検索される活動ジャンル</p>
                      <div className="flex flex-wrap gap-2">
                        {genres.map(genre => (
                          <Button
                            key={genre}
                            variant={selectedGenres.includes(genre) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => toggleGenre(genre)}
                          >
                            {genre}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 活動状態検索 */}
                <div>
                  <label className="block mb-2 text-foreground flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    活動状態で検索（複数選択可）
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['活動開始前(VTuber準備中)', '活動中', '卒業済み'].map(status => (
                      <Button
                        key={status}
                        variant={selectedActivityStatuses.includes(status) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleActivityStatus(status)}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* バッジ検索 */}
                <div>
                  <label className="block mb-2 text-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    バッジで検索（複数選択可）
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedBadges.includes('よく見られているVTuber') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleBadge('よく見られているVTuber')}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      よく見られているVTuber
                    </Button>
                    <Button
                      variant={selectedBadges.includes('新人VTuber') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleBadge('新人VTuber')}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      新人VTuber
                    </Button>
                    <Button
                      variant={selectedBadges.includes('最近更新されたVTuber') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleBadge('最近更新されたVTuber')}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      最近更新されたVTuber
                    </Button>
                    <Button
                      variant={selectedBadges.includes('今日誕生日のVTuber') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleBadge('今日誕生日のVTuber')}
                    >
                      <Cake className="w-4 h-4 mr-2" />
                      今日誕生日のVTuber
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* フィルタークリアボタン */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                すべてのフィルターをクリア
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* 検索欄下広告 */}
      {adConfig.searchMiddle && (
        <AdBanner position="search-ｍ" variant="horizontal" />
      )}

      {/* 検索結果 */}
      <div className="space-y-4">
        {/* 結果ヘッダー */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredProfiles.length}件のVTuberが見つかりました
          </p>
          {/* 表示切り替えボタン */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              カード表示
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-2" />
              一覧表示
            </Button>
          </div>
        </div>

        {/* 検索結果表示 */}
        {filteredProfiles.length > 0 ? (
          viewMode === 'grid' ? (
            // カード表示
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProfiles.map(profile => (
                <VTuberCard
                  key={profile.id}
                  profile={profile}
                  onClick={() => onSelectProfile(profile)}
                  isLiked={likedProfileIds.includes(profile.id)}
                  onToggleLike={onToggleLike ? (e) => {
                    e.stopPropagation();
                    onToggleLike(profile.id);
                  } : undefined}
                />
              ))}
            </div>
          ) : (
            // 一覧表示
            <div className="space-y-3">
              {filteredProfiles.map(profile => (
                <Card
                  key={profile.id}
                  className="p-4 hover:border-primary hover:shadow-lg transition-all relative"
                >
                  <div className="flex items-center gap-4">
                    {/* プロフィール画像 */}
                    <div 
                      onClick={() => onSelectProfile(profile)}
                      className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-accent to-secondary flex-shrink-0 cursor-pointer"
                    >
                      {profile.imageUrl ? (
                        <img
                          src={profile.imageUrl}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-primary">{profile.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>

                    {/* 情報 */}
                    <div 
                      onClick={() => onSelectProfile(profile)}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="truncate">{profile.name}</h3>
                        {profile.nickname && (
                          <span className="text-sm text-muted-foreground">({profile.nickname})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          <span>{profile.affiliation}</span>
                        </div>
                        {profile.activityGenre && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{profile.activityGenre}</span>
                          </div>
                        )}
                        {profile.birthday && (
                          <div className="flex items-center gap-1">
                            <Cake className="w-3 h-3" />
                            <span>{profile.birthday}</span>
                          </div>
                        )}
                      </div>
                      {profile.tags && profile.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {profile.tags.map(tag => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-[10px] border-primary/30 text-primary"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* いいねボタン */}
                    {onToggleLike && (
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLike(profile.id);
                          }}
                          className={`p-2 rounded-full transition-all ${
                            likedProfileIds.includes(profile.id)
                              ? 'bg-pink-500 hover:bg-pink-600'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${
                            likedProfileIds.includes(profile.id) 
                              ? 'fill-white text-white' 
                              : 'text-gray-600'
                          }`} />
                        </button>
                        <span className="text-xs text-gray-500">{profile.likeCount || 0}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )
        ) : (
          // 検索結果なし
          <Card className="p-12 text-center border-dashed">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-2">
              条件に一致するVTuberが見つかりませんでした
            </p>
            <p className="text-sm text-muted-foreground">
              検索条件を変更してお試しください
            </p>
          </Card>
        )}
      </div>

      {/* 下部広告 */}
      {adConfig.searchBottom && (
        <AdBanner position="search-bottom" variant="horizontal" />
      )}
    </div>
  );
}