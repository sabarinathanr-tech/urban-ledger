import { Providers } from '@/app/providers';
import { AppRoutes } from '@/app/routes';

export function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}
