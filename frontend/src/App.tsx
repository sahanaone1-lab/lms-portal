import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './store/AuthContext';
import { ToastProvider } from './components/Toast';
import { LoadingScreen } from './components/LoadingScreen';
import { DashboardLayout } from './layouts/DashboardLayout';
import { HomePage } from './pages/HomePage';
import { Login } from './pages/Login';
import { ChangePassword } from './pages/ChangePassword';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProjectCoordinatorDashboard } from './pages/ProjectCoordinatorDashboard';
import { InternDashboard } from './pages/InternDashboard';
import { Settings } from './pages/Settings';
import { Role } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// ─── Guard: Protected Routes ──────────────────────────────────────────────
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  // Unauthenticated → go to home page (not login)
  if (!isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  if (user?.mustChangePassword && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  if (!user?.mustChangePassword && location.pathname === '/change-password') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// ─── Guard: Role-Based Routes ─────────────────────────────────────────────
const RoleRoute: React.FC<{ children: React.ReactNode; allowedRoles: Role[] }> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user || !allowedRoles.includes(user.role)) {
    if (user?.role === 'ADMIN')      return <Navigate to="/admin" replace />;
    if (user?.role === 'PROJECT_COORDINATOR') return <Navigate to="/project-coordinator" replace />;
    if (user?.role === 'INTERN')     return <Navigate to="/intern" replace />;
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

// ─── Home Redirect (after login) ─────────────────────────────────────────
const HomeRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/home" replace />;
  if (user?.role === 'ADMIN')      return <Navigate to="/admin" replace />;
  if (user?.role === 'PROJECT_COORDINATOR') return <Navigate to="/project-coordinator" replace />;
  return <Navigate to="/intern" replace />;
};

// ─── Public route: redirect authenticated users away from login/register ──
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (isAuthenticated) {
    if (user?.role === 'ADMIN')      return <Navigate to="/admin" replace />;
    if (user?.role === 'PROJECT_COORDINATOR') return <Navigate to="/project-coordinator" replace />;
    return <Navigate to="/intern" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* ── Public Landing Page ── */}
              <Route path="/home" element={<HomePage />} />

              {/* ── Public Auth Routes (redirect if already logged in) ── */}
              <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />

              {/* ── Force Password Change ── */}
              <Route
                path="/change-password"
                element={<ProtectedRoute><ChangePassword /></ProtectedRoute>}
              />

              {/* ── Protected Dashboard Layout ── */}
              <Route
                path="/"
                element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
              >
                <Route index element={<HomeRedirect />} />

                {/* Admin */}
                <Route path="admin"         element={<RoleRoute allowedRoles={['ADMIN']}><AdminDashboard /></RoleRoute>} />
                <Route path="admin/users"   element={<RoleRoute allowedRoles={['ADMIN']}><AdminDashboard /></RoleRoute>} />
                <Route path="admin/courses" element={<RoleRoute allowedRoles={['ADMIN']}><AdminDashboard /></RoleRoute>} />
                <Route path="admin/domains" element={<RoleRoute allowedRoles={['ADMIN']}><AdminDashboard /></RoleRoute>} />
                <Route path="admin/projects" element={<RoleRoute allowedRoles={['ADMIN']}><AdminDashboard /></RoleRoute>} />

                {/* Project Coordinator */}
                <Route path="project-coordinator"              element={<RoleRoute allowedRoles={['PROJECT_COORDINATOR']}><ProjectCoordinatorDashboard /></RoleRoute>} />
                <Route path="project-coordinator/courses"      element={<RoleRoute allowedRoles={['PROJECT_COORDINATOR']}><ProjectCoordinatorDashboard /></RoleRoute>} />
                <Route path="project-coordinator/grading"      element={<RoleRoute allowedRoles={['PROJECT_COORDINATOR']}><ProjectCoordinatorDashboard /></RoleRoute>} />
                <Route path="project-coordinator/projects"     element={<RoleRoute allowedRoles={['PROJECT_COORDINATOR']}><ProjectCoordinatorDashboard /></RoleRoute>} />
                <Route path="project-coordinator/domains"      element={<RoleRoute allowedRoles={['PROJECT_COORDINATOR']}><ProjectCoordinatorDashboard /></RoleRoute>} />
                <Route path="project-coordinator/certificates" element={<RoleRoute allowedRoles={['PROJECT_COORDINATOR']}><ProjectCoordinatorDashboard /></RoleRoute>} />

                {/* Intern */}
                <Route path="intern"              element={<RoleRoute allowedRoles={['INTERN']}><InternDashboard /></RoleRoute>} />
                <Route path="intern/courses"      element={<RoleRoute allowedRoles={['INTERN']}><InternDashboard /></RoleRoute>} />
                <Route path="intern/enrolled"     element={<RoleRoute allowedRoles={['INTERN']}><InternDashboard /></RoleRoute>} />
                <Route path="intern/projects"     element={<RoleRoute allowedRoles={['INTERN']}><InternDashboard /></RoleRoute>} />
                <Route path="intern/certificates" element={<RoleRoute allowedRoles={['INTERN']}><InternDashboard /></RoleRoute>} />

                {/* Common */}
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Root redirect */}
              <Route path="/" element={<HomeRedirect />} />

              {/* Wildcard → home */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
