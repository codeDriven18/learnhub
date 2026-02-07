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
import StudentProfile from './pages/student/Profile';

// Checker Pages
import CheckerDashboard from './pages/checker/Dashboard';
import CheckerApplications from './pages/checker/Applications';
import CheckerApplicationReview from './pages/checker/ApplicationReview';
import CheckerProfile from './pages/checker/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminApplications from './pages/admin/Applications';
import AdminUsers from './pages/admin/Users';

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
