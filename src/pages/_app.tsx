import '../styles/index.css';
import type { AppProps } from 'next/app';
import { AppProvider } from '../app/context/AppContext';
import { Layout } from '../app/components/Layout';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  );
}
