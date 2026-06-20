import { useRouter } from 'next/router';
import { Navigation } from './Navigation';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Toaster } from 'sonner';
import { useApp } from '../context/AppContext';

const NO_SIDEBAR_PATHS = ['/user', '/new', '/edit'];

export function Layout({ children }: { children?: React.ReactNode }) {
  const { profiles, isLoggedIn, handleLogout } = useApp();
  const router = useRouter();
  const showSidebar = !NO_SIDEBAR_PATHS.some(p => router.asPath.startsWith(p));

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">{children}</div>
          {showSidebar && (
            <div className="lg:w-80 flex-shrink-0">
              <Sidebar profiles={profiles} />
            </div>
          )}
        </div>
      </div>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
}
