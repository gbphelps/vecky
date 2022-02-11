import {
  Routes, Route, Navigate, useLocation,
} from 'react-router-dom';
import Login from './auth/login';
import { useSessionContext } from '../common/contexts/sessionContext';

function Pages() {
  const { user } = useSessionContext();
  const { pathname } = useLocation();

  if (!user && pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  if (user && pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default Pages;
