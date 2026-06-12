import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/common/Layout';

// User pages
import UserTasksPage from './pages/user/UserTasksPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminTasksPage from './pages/admin/AdminTasksPage';
import AdminActivityPage from './pages/admin/AdminActivityPage';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="full-loader"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'Admin') return <Navigate to="/tasks" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="full-loader"><div className="spinner" /></div>;
  if (user) return <Navigate to={user.role === 'Admin' ? '/admin' : '/tasks'} replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tasks" replace />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/tasks" element={<UserTasksPage />} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/admin/tasks" element={<ProtectedRoute adminOnly><AdminTasksPage /></ProtectedRoute>} />
        <Route path="/admin/activity" element={<ProtectedRoute adminOnly><AdminActivityPage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ style: { background: '#1a1d2e', color: '#e8eaf6', border: '1px solid #2e3150' } }} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
