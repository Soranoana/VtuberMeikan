import { useRouter } from 'next/router';
import { SearchPage } from '../components/SearchPage';
import { useApp } from '../context/AppContext';

export function SearchPageWrapper() {
  const router = useRouter();
  const { profiles, likedProfileIds, handleToggleLike } = useApp();
  const tag = (router.query.tag as string) || '';
  const badge = (router.query.badge as string) || '';

  return (
    <SearchPage
      profiles={profiles}
      onSelectProfile={(p) => router.push(`/vtuber/${p.id}`)}
      likedProfileIds={likedProfileIds}
      onToggleLike={handleToggleLike}
      initialTag={tag}
      initialBadge={badge}
    />
  );
}
