import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './app/Home';
import Messages from './app/Messages';
import Notifications from './app/Notifications';
import Posts from './app/Posts';
import Profile from './app/Profile';
import Stories from './app/Stories';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected app */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/"             element={<Home />} />
            <Route path="/stories"      element={<Stories />} />
            <Route path="/explore"      element={<Posts />} />
            <Route path="/messages"     element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/profile"      element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}