import '../src/styles/index.css';
import type { AppProps } from 'next/app';
import { AppProvider } from '../src/app/context/AppContext';
import { Layout } from '../src/app/components/Layout';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  );
}
