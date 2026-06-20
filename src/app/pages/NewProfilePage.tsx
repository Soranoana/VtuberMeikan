import { useNavigate } from 'react-router';
import { ProfileFormPage } from '../components/ProfileFormPage';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export function NewProfilePage() {
  const navigate = useNavigate();
  const { handleAddProfile } = useApp();

  return (
    <ProfileFormPage
      onSubmit={(profile) => {
        const newProfile = handleAddProfile(profile);
        toast.success('登録完了しました！', { description: 'VTuberが正常に登録されました' });
        navigate(`/vtuber/${newProfile.id}`);
      }}
      onCancel={() => navigate(-1)}
    />
  );
}
