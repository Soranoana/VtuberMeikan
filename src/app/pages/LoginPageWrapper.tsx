import { useNavigate } from 'react-router';
import { LoginPage } from '../components/LoginPage';
import { useApp } from '../context/AppContext';

export function LoginPageWrapper() {
  const navigate = useNavigate();
  const { handleLogin } = useApp();

  return (
    <LoginPage
      onLogin={(service) => {
        handleLogin(service);
        navigate('/');
      }}
    />
  );
}
