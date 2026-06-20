import { useRouter } from 'next/router';
import { VTuberDetailPage } from '../components/VTuberDetailPage';
import { useApp } from '../context/AppContext';

export function DetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { profiles, likedProfileIds, handleToggleLike, handleDeleteProfile } = useApp();

  const profileId = Array.isArray(id) ? id[0] : id;
  const profile = profileId ? profiles.find(p => p.id === profileId) : undefined;
  if (!profileId) return <div className="p-8 text-center text-muted-foreground">読み込み中...</div>;
  if (!profile) return <div className="p-8 text-center text-muted-foreground">VTuberが見つかりません</div>;

  return (
    <VTuberDetailPage
      profile={profile}
      allProfiles={profiles}
      onSelectProfile={(p) => router.push(`/vtuber/${p.id}`)}
      onBack={() => router.back()}
      isLiked={likedProfileIds.includes(profile.id)}
      onToggleLike={() => handleToggleLike(profile.id)}
      onSearchByTag={(tag) => router.push(`/search?tag=${encodeURIComponent(tag)}`)}
      onSearchByBadge={(badge) => router.push(`/search?badge=${encodeURIComponent(badge)}`)}
      onEdit={(p) => router.push(`/edit/${p.id}`)}
      onReport={(p) => console.log('Report:', p)}
      onContact={() => router.push('/contact')}
      onViewHistory={(p) => console.log('History:', p)}
    />
  );
}
