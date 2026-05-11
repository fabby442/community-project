import { Navigate } from 'react-router-dom';
// Dashboard is the shell — redirect to feed
export default function Dashboard() {
  return <Navigate to="/" replace />;
}