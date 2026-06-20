import { AppProvider } from './context/AppContext';

export type { VTuberProfile } from './types';

export default function App({ children }: { children?: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
