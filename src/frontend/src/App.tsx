import { BrowserRouter } from 'react-router-dom';
import Pages from './pages';
import { SessionProvider } from './common/contexts/sessionContext';

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Pages />
      </SessionProvider>
    </BrowserRouter>
  );
}

export default App;
