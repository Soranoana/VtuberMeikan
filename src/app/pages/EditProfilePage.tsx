import { useRouter } from 'next/router';
import { ProfileFormPage } from '../components/ProfileFormPage';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export function EditProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const { profiles, handleEditProfile } = useApp();

  const profileId = Array.isArray(id) ? id[0] : id;
  const profile = profileId ? profiles.find(p => p.id === profileId) : undefined;
  if (!profileId) return <div className="p-8 text-center text-muted-foreground">読み込み中...</div>;
  if (!profile) return <div className="p-8 text-center text-muted-foreground">VTuberが見つかりません</div>;

  return (
    <ProfileFormPage
      initialData={profile}
      onSubmit={(data) => {
        const updated = handleEditProfile(profileId, data);
        toast.success('編集完了しました！', { description: 'VTuberの情報が更新されました' });
        router.push(`/vtuber/${updated.id}`);
      }}
      onCancel={() => router.back()}
    />
  );
}
