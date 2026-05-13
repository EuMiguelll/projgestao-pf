import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import Login from './pages/Login.jsx';
import Courses from './pages/Courses.jsx';

function FullPageLoader() {
  return (
    <div className="min-h-screen grid place-items-center bg-paper">
      <div className="flex flex-col items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
        <p className="text-muted text-sm tracking-wide">Carregando…</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();
  if (isLoading) return <FullPageLoader />;
  if (!isAuthenticated) return <Navigate to="/" replace state={{ from: location }} />;
  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  if (isLoading) return <FullPageLoader />;
  if (isAuthenticated) return <Navigate to="/cursos" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/cursos"
        element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
