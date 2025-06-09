import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Lazy loaded components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Students = lazy(() => import('../pages/Students'));
const StudentDetail = lazy(() => import('../pages/StudentDetail'));
const StudentForm = lazy(() => import('../pages/StudentForm'));
const PredictionForm = lazy(() => import('../pages/PredictionForm'));
const PredictionDetail = lazy(() => import('../pages/PredictionDetail'));
const Profile = lazy(() => import('../pages/Profile'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const About = lazy(() => import('../pages/About'));
const LandingPage = lazy(() => import('../pages/LandingPage'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public route (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Landing route (show landing page for non-authenticated users)
const LandingRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Create router
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LandingRoute>
        <Suspense fallback={<Loading />}>
          <LandingPage />
        </Suspense>
      </LandingRoute>
    ),
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'students',
        element: (
          <Suspense fallback={<Loading />}>
            <Students />
          </Suspense>
        ),
      },
      {
        path: 'students/add',
        element: (
          <Suspense fallback={<Loading />}>
            <StudentForm />
          </Suspense>
        ),
      },
      {
        path: 'students/:id',
        element: (
          <Suspense fallback={<Loading />}>
            <StudentDetail />
          </Suspense>
        ),
      },
      {
        path: 'students/:id/edit',
        element: (
          <Suspense fallback={<Loading />}>
            <StudentForm />
          </Suspense>
        ),
      },
      {
        path: 'students/:id/predict',
        element: (
          <Suspense fallback={<Loading />}>
            <PredictionForm />
          </Suspense>
        ),
      },
      {
        path: 'predictions/:id',
        element: (
          <Suspense fallback={<Loading />}>
            <PredictionDetail />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<Loading />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<Loading />}>
            <About />
          </Suspense>
        ),
      },
    ],
  },
  // Protected routes with MainLayout
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/students',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Students />
          </Suspense>
        ),
      },
      {
        path: 'add',
        element: (
          <Suspense fallback={<Loading />}>
            <StudentForm />
          </Suspense>
        ),
      },
      {
        path: ':id',
        element: (
          <Suspense fallback={<Loading />}>
            <StudentDetail />
          </Suspense>
        ),
      },
      {
        path: ':id/edit',
        element: (
          <Suspense fallback={<Loading />}>
            <StudentForm />
          </Suspense>
        ),
      },
      {
        path: ':id/predict',
        element: (
          <Suspense fallback={<Loading />}>
            <PredictionForm />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/predictions/:id',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <PredictionDetail />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Profile />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/about',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <About />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <AuthLayout>
        <PublicRoute>
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        </PublicRoute>
      </AuthLayout>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthLayout>
        <PublicRoute>
          <Suspense fallback={<Loading />}>
            <Register />
          </Suspense>
        </PublicRoute>
      </AuthLayout>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<Loading />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default router;