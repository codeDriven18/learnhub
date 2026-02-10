import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import ThemeToggle from '@/components/ThemeToggle';
import {
  HomeIcon,
  DocumentTextIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  ChartBarIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function StudentLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/student', icon: HomeIcon },
    { name: 'Applications', href: '/student/applications', icon: DocumentTextIcon },
    { name: 'Messages', href: '/student/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Study Hub', href: '/student/study-hub', icon: AcademicCapIcon },
    { name: 'QS Rankings', href: '/student/rankings', icon: ChartBarIcon },
    { name: 'Profile', href: '/student/profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">LearnHub</h1>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Student Portal</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200">
                <BellIcon className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300 mr-3">{user?.full_name}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
