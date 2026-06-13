import { useParams, useNavigate } from 'react-router';
import { VTuberDetailPage } from '../components/VTuberDetailPage';
import { useApp } from '../context/AppContext';

export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profiles, likedProfileIds, handleToggleLike, handleDeleteProfile } = useApp();

  const profile = profiles.find(p => p.id === id);
  if (!profile) return <div className="p-8 text-center text-gray-500">VTuberが見つかりません</div>;

  return (
    <VTuberDetailPage
      profile={profile}
      allProfiles={profiles}
      onSelectProfile={(p) => navigate(`/vtuber/${p.id}`)}
      onBack={() => navigate(-1)}
      isLiked={likedProfileIds.includes(profile.id)}
      onToggleLike={() => handleToggleLike(profile.id)}
      onSearchByTag={(tag) => navigate(`/search?tag=${encodeURIComponent(tag)}`)}
      onSearchByBadge={(badge) => navigate(`/search?badge=${encodeURIComponent(badge)}`)}
      onEdit={(p) => navigate(`/edit/${p.id}`)}
      onReport={(p) => console.log('Report:', p)}
      onContact={() => navigate('/contact')}
      onViewHistory={(p) => console.log('History:', p)}
    />
  );
}
