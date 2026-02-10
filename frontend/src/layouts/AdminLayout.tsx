import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import ThemeToggle from '@/components/ThemeToggle';
import {
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  ChartBarIcon,
  ListBulletIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  BoltIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Applications', href: '/admin/applications', icon: DocumentTextIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Logs', href: '/admin/logs', icon: ListBulletIcon },
    { name: 'System Events', href: '/admin/system-events', icon: BoltIcon },
    { name: 'Permissions', href: '/admin/permissions', icon: ShieldCheckIcon },
    { name: 'Feature Control', href: '/admin/features', icon: Squares2X2Icon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-gray-900 dark:bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold">LearnHub</h1>
                <span className="ml-2 text-sm text-gray-300">Admin Portal</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white"
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button className="p-2 text-gray-300 hover:text-white">
                <BellIcon className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <span className="text-sm text-gray-300 mr-3">{user?.full_name}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-300 hover:text-white"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
