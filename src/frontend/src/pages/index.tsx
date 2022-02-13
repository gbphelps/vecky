import {
  Routes, Route, Navigate, useLocation,
} from 'react-router-dom';
import Login from './auth/login';
import Signup from './auth/signup';
import Home from './home';
import { useSessionContext } from '../common/contexts/sessionContext';

const ROUTES = {
  login: '/login',
  signup: '/signup',
};

const AUTH_ROUTES = new Set([ROUTES.login, ROUTES.signup]);

function Pages() {
  const { user } = useSessionContext();
  const { pathname } = useLocation();

  if (!user && !AUTH_ROUTES.has(pathname)) {
    return <Navigate to="/login" replace />;
  }

  if (user && AUTH_ROUTES.has(pathname)) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default Pages;
