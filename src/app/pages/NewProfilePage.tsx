import { useRouter } from 'next/router';
import { ProfileFormPage } from '../components/ProfileFormPage';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export function NewProfilePage() {
  const router = useRouter();
  const { handleAddProfile } = useApp();

  return (
    <ProfileFormPage
      onSubmit={(profile) => {
        const newProfile = handleAddProfile(profile);
        toast.success('登録完了しました！', { description: 'VTuberが正常に登録されました' });
        router.push(`/vtuber/${newProfile.id}`);
      }}
      onCancel={() => router.back()}
    />
  );
}
