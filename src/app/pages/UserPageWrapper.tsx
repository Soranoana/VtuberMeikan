import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { UserPage } from '../components/UserPage';
import { useApp } from '../context/AppContext';

export function UserPageWrapper() {
  const router = useRouter();
  const { profiles, isLoggedIn, loginService, likedProfileIds, recentlyEditedProfileIds, editsLikedByVTuberIds, handleLogout } = useApp();

  useEffect(() => {
    if (!isLoggedIn) router.replace('/login');
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const likedProfiles = profiles.filter(p => likedProfileIds.includes(p.id));
  const recentlyEditedProfiles = profiles.filter(p => recentlyEditedProfileIds.includes(p.id));
  const editsLikedByVTubers = profiles.filter(p => editsLikedByVTuberIds.includes(p.id));

  return (
    <UserPage
      userName="ゲストユーザー"
      loginService={loginService}
      likedProfiles={likedProfiles}
      recentlyEditedProfiles={recentlyEditedProfiles}
      editsLikedByVTubers={editsLikedByVTubers}
      onSelectProfile={(p) => router.push(`/vtuber/${p.id}`)}
      onLogout={() => { handleLogout(); router.push('/'); }}
    />
  );
}
