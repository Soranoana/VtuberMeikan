import { useState } from 'react';
import { ProfileForm } from './components/ProfileForm';
import { VTuberCard } from './components/VTuberCard';
import { ProfileDetail } from './components/ProfileDetail';
import { Navigation } from './components/Navigation';
import { Sidebar } from './components/Sidebar';

export interface VTuberProfile {
  id: string;
  name: string;
  nickname: string;
  affiliation: string;
  birthday: string;
  debut: string;
  bloodType: string;
  height: string;
  favoriteThings: string;
  dislikedThings: string;
  hobby: string;
  catchphrase: string;
  dream: string;
  message: string;
  imageUrl?: string;
  tags?: string[];
  createdAt: Date;
}

export default function App() {
  const [profiles, setProfiles] = useState<VTuberProfile[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<VTuberProfile | null>(null);
  const [currentPage, setCurrentPage] = useState('top');
  const [isDetailView, setIsDetailView] = useState(false);

  const handleAddProfile = (profile: Omit<VTuberProfile, 'id' | 'createdAt'>) => {
    const newProfile: VTuberProfile = {
      ...profile,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setProfiles([newProfile, ...profiles]);
    setIsFormOpen(false);
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
    setSelectedProfile(null);
    setIsDetailView(false);
  };

  const handleSelectProfile = (profile: VTuberProfile) => {
    setSelectedProfile(profile);
    setIsDetailView(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      {/* ナビゲーション */}
      <Navigation
        onNewProfile={() => setIsFormOpen(true)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* サイドバー */}
          <div className="lg:w-80 flex-shrink-0">
            <Sidebar
              profiles={profiles}
              onSelectProfile={handleSelectProfile}
            />
          </div>

          {/* メインエリア */}
          <div className="flex-1">
            {isDetailView && selectedProfile ? (
              <div className="space-y-4">
                <button
                  onClick={() => setIsDetailView(false)}
                  className="text-[#5d4a34] hover:text-[#3d2f1f] flex items-center gap-2"
                >
                  ← 一覧に戻る
                </button>
                <ProfileDetail
                  profile={selectedProfile}
                  onDelete={handleDeleteProfile}
                />
              </div>
            ) : (
              <div>
                {/* ヘッダー */}
                <div className="mb-6">
                  <h2 className="text-[#3d2f1f] mb-2">VTuber一覧</h2>
                  <p className="text-[#7a6751]">
                    登録されているVTuber: {profiles.length}人
                  </p>
                </div>

                {/* VTuberカードグリッド */}
                {profiles.length === 0 ? (
                  <div className="bg-[#fdfaf5] rounded-lg border-2 border-dashed border-[#c9b89a] p-12 text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-[#7a6751] mb-2">
                      まだVTuberが登録されていません
                    </p>
                    <p className="text-[#a08968] text-sm">
                      「新規Vtuber登録」ボタンから登録してください
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profiles.map(profile => (
                      <VTuberCard
                        key={profile.id}
                        profile={profile}
                        onClick={() => handleSelectProfile(profile)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* プロフィール登録フォーム */}
      <ProfileForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddProfile}
      />
    </div>
  );
}
