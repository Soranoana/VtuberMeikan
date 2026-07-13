import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { TopPage } from './pages/TopPage';
import { DetailPage } from './pages/DetailPage';
import { NewProfilePage } from './pages/NewProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { SearchPageWrapper } from './pages/SearchPageWrapper';
import { UserPageWrapper } from './pages/UserPageWrapper';
import { LoginPageWrapper } from './pages/LoginPageWrapper';
import { ContactPageWrapper } from './pages/ContactPageWrapper';
import { AboutPage } from './pages/AboutPage';
import { TermsPage } from './pages/TermsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: TopPage },
      { path: 'login', Component: LoginPageWrapper },
      { path: 'search', Component: SearchPageWrapper },
      { path: 'contact', Component: ContactPageWrapper },
      { path: 'user', Component: UserPageWrapper },
      { path: 'vtuber/:id', Component: DetailPage },
      { path: 'new', Component: NewProfilePage },
      { path: 'edit/:id', Component: EditProfilePage },
      { path: 'about', Component: AboutPage },
      { path: 'terms', Component: TermsPage },
    ],
  },
]);
