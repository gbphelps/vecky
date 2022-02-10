import {
  Routes, Route, Navigate, useLocation,
} from 'react-router-dom';
import Login from './login';
import { useSessionContext } from '../common/contexts/sessionContext';

function Pages() {
  const { user } = useSessionContext();
  const { pathname } = useLocation();

  if (!user && pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default Pages;
