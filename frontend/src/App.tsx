import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import CheckerLayout from './layouts/CheckerLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentApplications from './pages/student/Applications';
import StudentApplicationDetail from './pages/student/ApplicationDetail';
import StudentProfile from '@/pages/student/Profile';
import StudentMessages from './pages/student/Messages';
import StudentStudyHub from './pages/student/StudyHub';
import StudentRankings from './pages/student/Rankings';
import StudentSettings from './pages/student/Settings';

// Checker Pages
import CheckerDashboard from './pages/checker/Dashboard';
import CheckerApplications from './pages/checker/Applications';
import CheckerApplicationReview from './pages/checker/ApplicationReview';
import CheckerProfile from '@/pages/checker/Profile';
import CheckerCRM from './pages/checker/CRM';
import CheckerAnalytics from './pages/checker/Analytics';
import CheckerMessages from './pages/checker/Messages';
import CheckerSettings from './pages/checker/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminApplications from './pages/admin/Applications';
import AdminUsers from './pages/admin/Users';
import AdminAnalytics from './pages/admin/Analytics';
import AdminLogs from './pages/admin/Logs';
import AdminPermissions from './pages/admin/Permissions';
import AdminFeatures from './pages/admin/Features';
import AdminSystemEvents from './pages/admin/SystemEvents';
import AdminSettings from './pages/admin/Settings';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="applications" element={<StudentApplications />} />
        <Route path="applications/:id" element={<StudentApplicationDetail />} />
        <Route path="messages" element={<StudentMessages />} />
        <Route path="study-hub" element={<StudentStudyHub />} />
        <Route path="rankings" element={<StudentRankings />} />
        <Route path="settings" element={<StudentSettings />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Checker Routes */}
      <Route
        path="/checker"
        element={
          <ProtectedRoute allowedRoles={['CHECKER']}>
            <CheckerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CheckerDashboard />} />
        <Route path="applications" element={<CheckerApplications />} />
        <Route path="applications/:id" element={<CheckerApplicationReview />} />
        <Route path="crm" element={<CheckerCRM />} />
        <Route path="analytics" element={<CheckerAnalytics />} />
        <Route path="messages" element={<CheckerMessages />} />
        <Route path="settings" element={<CheckerSettings />} />
        <Route path="profile" element={<CheckerProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="logs" element={<AdminLogs />} />
        <Route path="system-events" element={<AdminSystemEvents />} />
        <Route path="permissions" element={<AdminPermissions />} />
        <Route path="features" element={<AdminFeatures />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Redirect based on role */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            user?.role === 'STUDENT' ? (
              <Navigate to="/student" replace />
            ) : user?.role === 'CHECKER' ? (
              <Navigate to="/checker" replace />
            ) : user?.role === 'ADMIN' ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
