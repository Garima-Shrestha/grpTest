import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './rct/App';
import { UserProvider } from './context/UserContext'; // Import UserProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>,
);
