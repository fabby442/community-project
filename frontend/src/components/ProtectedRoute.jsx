import { Navigate, Outlet } from 'react-router-dom';

// Reads auth token from localStorage — swap with your real auth context/store
export default function ProtectedRoute() {
  const token = localStorage.getItem('auth_token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}