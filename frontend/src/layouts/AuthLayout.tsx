import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600">LearnHub</h1>
          <p className="mt-2 text-gray-600">Admissions Platform</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
