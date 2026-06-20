import { useRouter } from 'next/router';
import { LoginPage } from '../components/LoginPage';
import { useApp } from '../context/AppContext';

export function LoginPageWrapper() {
  const router = useRouter();
  const { handleLogin } = useApp();

  return (
    <LoginPage
      onLogin={(service) => {
        handleLogin(service);
        router.push('/');
      }}
    />
  );
}
