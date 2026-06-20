import { useNavigate } from 'react-router';
import { UserPage } from '../components/UserPage';
import { useApp } from '../context/AppContext';

export function UserPageWrapper() {
  const navigate = useNavigate();
  const { profiles, isLoggedIn, loginService, likedProfileIds, recentlyEditedProfileIds, editsLikedByVTuberIds, handleLogout } = useApp();

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

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
      onSelectProfile={(p) => navigate(`/vtuber/${p.id}`)}
      onLogout={() => { handleLogout(); navigate('/'); }}
    />
  );
}
