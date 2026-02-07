import { useQuery } from 'react-query';
import { applicationsAPI, notificationsAPI } from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  
  const { data: applications } = useQuery('applications', () =>
    applicationsAPI.list().then((res) => res.data)
  );

  // Fetch unread notifications count for future use
  useQuery('unread-notifications', () =>
    notificationsAPI.unreadCount().then((res) => res.data)
  );

  const stats = [
    {
      name: 'Total Applications',
      value: applications?.results?.length || 0,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Under Review',
      value: applications?.results?.filter((a: any) => a.status === 'UNDER_REVIEW').length || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Passed',
      value: applications?.results?.filter((a: any) => a.status === 'PASSED').length || 0,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Rejected',
      value: applications?.results?.filter((a: any) => a.status === 'REJECTED').length || 0,
      icon: XCircleIcon,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.first_name}!</h1>
        <p className="mt-2 text-gray-600">Track your application progress and manage your documents.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-lg p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            to="/student/applications"
            className="btn-primary text-center"
          >
            Create New Application
          </Link>
          <Link
            to="/student/profile"
            className="btn-secondary text-center"
          >
            Update Profile
          </Link>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h2>
        {applications?.results && applications.results.length > 0 ? (
          <div className="space-y-4">
            {applications.results.slice(0, 5).map((app: any) => (
              <Link
                key={app.id}
                to={`/student/applications/${app.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{app.program_name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {app.academic_year} - {app.intake_period}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      app.status === 'PASSED'
                        ? 'bg-green-100 text-green-800'
                        : app.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : app.status === 'UNDER_REVIEW'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {app.status_display}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No applications yet. Create your first application to get started!
          </p>
        )}
      </div>
    </div>
  );
}
