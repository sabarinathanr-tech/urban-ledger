import { BrowserRouter } from 'react-router-dom';
import { Providers } from '@/app/providers';
import { AppRoutes } from '@/app/routes';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';

export function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Providers>
          <AppRoutes />
        </Providers>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
