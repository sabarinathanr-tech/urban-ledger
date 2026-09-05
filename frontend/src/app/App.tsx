import { BrowserRouter } from 'react-router-dom';
import { Providers } from '@/app/providers';
import { AppRoutes } from '@/app/routes';

export function App() {
  return (
    <BrowserRouter>
      <Providers>
        <AppRoutes />
      </Providers>
    </BrowserRouter>
  );
}

export default App;
