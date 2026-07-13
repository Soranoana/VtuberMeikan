import { createContext, useContext, useState, ReactNode } from 'react';
import { VTuberProfile } from '../types';
import { sampleProfiles } from '../data/sampleData';
import { toast } from 'sonner@2.0.3';

interface AppContextType {
  profiles: VTuberProfile[];
  isLoggedIn: boolean;
  loginService: string;
  likedProfileIds: string[];
  recentlyEditedProfileIds: string[];
  editsLikedByVTuberIds: string[];
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  modalCount: number;
  pushModal: () => void;
  popModal: () => void;
  handleLogin: (service: string) => void;
  handleLogout: () => void;
  handleAddProfile: (profile: Omit<VTuberProfile, 'id' | 'createdAt'>) => VTuberProfile;
  handleEditProfile: (id: string, profile: Omit<VTuberProfile, 'id' | 'createdAt'>) => VTuberProfile;
  handleDeleteProfile: (id: string) => void;
  handleToggleLike: (profileId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<VTuberProfile[]>(sampleProfiles);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginService, setLoginService] = useState('');
  const [likedProfileIds, setLikedProfileIds] = useState<string[]>(['1', '2', '3']);
  const [recentlyEditedProfileIds, setRecentlyEditedProfileIds] = useState<string[]>(['6']);
  const [editsLikedByVTuberIds] = useState<string[]>(['1', '4']);
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [language, setLanguage] = useState('ja');
  const [isMuted, setIsMuted] = useState(true);
  const [modalCount, setModalCount] = useState(0);
  const pushModal = () => setModalCount(c => c + 1);
  const popModal = () => setModalCount(c => Math.max(0, c - 1));

  const handleLogin = (service: string) => {
    setIsLoggedIn(true);
    setLoginService(service);
    toast.success('ゲストユーザーにログインしました', { description: 'VTuber名鑑へようこそ！' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast.info('ログアウトしました', { description: 'またのご利用をお待ちしております' });
  };

  const handleAddProfile = (profile: Omit<VTuberProfile, 'id' | 'createdAt'>): VTuberProfile => {
    const newProfile: VTuberProfile = { ...profile, id: Date.now().toString(), createdAt: new Date() };
    setProfiles(prev => [newProfile, ...prev]);
    setRecentlyEditedProfileIds(prev => [newProfile.id, ...prev.slice(0, 9)]);
    return newProfile;
  };

  const handleEditProfile = (id: string, profile: Omit<VTuberProfile, 'id' | 'createdAt'>): VTuberProfile => {
    const original = profiles.find(p => p.id === id)!;
    const updated: VTuberProfile = { ...profile, id, createdAt: original.createdAt, updatedAt: new Date() };
    setProfiles(prev => prev.map(p => p.id === id ? updated : p));
    setRecentlyEditedProfileIds(prev => [id, ...prev.filter(i => i !== id).slice(0, 9)]);
    return updated;
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
  };

  const handleToggleLike = (profileId: string) => {
    setLikedProfileIds(prev => {
      const isLiked = prev.includes(profileId);
      setProfiles(p => p.map(pr => pr.id === profileId
        ? { ...pr, likeCount: (pr.likeCount || 0) + (isLiked ? -1 : 1) }
        : pr
      ));
      return isLiked ? prev.filter(id => id !== profileId) : [...prev, profileId];
    });
  };

  return (
    <AppContext.Provider value={{
      profiles, isLoggedIn, loginService, likedProfileIds,
      recentlyEditedProfileIds, editsLikedByVTuberIds,
      selectedTheme, setSelectedTheme,
      language, setLanguage,
      isMuted, setIsMuted,
      modalCount, pushModal, popModal,
      handleLogin, handleLogout, handleAddProfile, handleEditProfile,
      handleDeleteProfile, handleToggleLike,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
