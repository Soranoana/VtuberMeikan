import { Outlet, useLocation } from 'react-router';
import { Navigation } from './Navigation';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { FloatingButtons } from './FloatingButtons';
import { Toaster } from 'sonner@2.0.3';
import { useApp } from '../context/AppContext';

const NO_SIDEBAR_PATHS = ['/user', '/new', '/edit'];

export function Layout() {
  const { profiles, isLoggedIn, handleLogout } = useApp();
  const location = useLocation();
  const showSidebar = !NO_SIDEBAR_PATHS.some(p => location.pathname.startsWith(p));

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6 pt-16 sm:pt-20 md:pt-20">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
          {showSidebar && (
            <div className="lg:w-80 flex-shrink-0">
              <Sidebar profiles={profiles} />
            </div>
          )}
        </div>
      </div>
      <Footer />
      <FloatingButtons />
      <Toaster position="top-right" richColors />
    </div>
  );
}
