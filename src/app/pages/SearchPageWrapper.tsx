import { useNavigate, useSearchParams } from 'react-router';
import { SearchPage } from '../components/SearchPage';
import { useApp } from '../context/AppContext';

export function SearchPageWrapper() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profiles, likedProfileIds, handleToggleLike } = useApp();

  return (
    <SearchPage
      profiles={profiles}
      onSelectProfile={(p) => navigate(`/vtuber/${p.id}`)}
      likedProfileIds={likedProfileIds}
      onToggleLike={handleToggleLike}
      initialTag={searchParams.get('tag') || ''}
      initialBadge={searchParams.get('badge') || ''}
    />
  );
}
