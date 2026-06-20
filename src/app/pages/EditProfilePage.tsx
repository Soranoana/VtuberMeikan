import { useParams, useNavigate } from 'react-router';
import { ProfileFormPage } from '../components/ProfileFormPage';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export function EditProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profiles, handleEditProfile } = useApp();

  const profile = profiles.find(p => p.id === id);
  if (!profile) return <div className="p-8 text-center text-gray-500">VTuberが見つかりません</div>;

  return (
    <ProfileFormPage
      initialData={profile}
      onSubmit={(data) => {
        const updated = handleEditProfile(id!, data);
        toast.success('編集完了しました！', { description: 'VTuberの情報が更新されました' });
        navigate(`/vtuber/${updated.id}`);
      }}
      onCancel={() => navigate(-1)}
    />
  );
}
