import { useQuery } from 'react-query';
import { applicationsAPI, notificationsAPI } from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  AcademicCapIcon,
  CalendarIcon,
  BellAlertIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
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
      change: '+2 this month',
      trend: 'up',
    },
    {
      name: 'Under Review',
      value: applications?.results?.filter((a: any) => a.status === 'UNDER_REVIEW').length || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      change: '3 pending',
      trend: 'neutral',
    },
    {
      name: 'Passed',
      value: applications?.results?.filter((a: any) => a.status === 'PASSED').length || 0,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      change: '+1 this week',
      trend: 'up',
    },
    {
      name: 'Rejected',
      value: applications?.results?.filter((a: any) => a.status === 'REJECTED').length || 0,
      icon: XCircleIcon,
      color: 'bg-red-500',
      change: 'No change',
      trend: 'neutral',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'application',
      title: 'Application submitted',
      description: 'Computer Science Program - Fall 2026',
      time: '2 hours ago',
      icon: DocumentTextIcon,
      color: 'text-blue-500',
    },
    {
      id: 2,
      type: 'document',
      title: 'Document verified',
      description: 'Transcript uploaded and verified',
      time: '5 hours ago',
      icon: CheckCircleIcon,
      color: 'text-green-500',
    },
    {
      id: 3,
      type: 'notification',
      title: 'Review in progress',
      description: 'Your application is being reviewed',
      time: '1 day ago',
      icon: ClockIcon,
      color: 'text-yellow-500',
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'Submit recommendation letters',
      program: 'Computer Science - Fall 2026',
      date: 'Feb 15, 2026',
      daysLeft: 7,
    },
    {
      id: 2,
      title: 'Complete profile information',
      program: 'General',
      date: 'Feb 20, 2026',
      daysLeft: 12,
    },
  ];

  const applicationProgress = [
    { stage: 'Profile', completed: true },
    { stage: 'Documents', completed: true },
    { stage: 'Essay', completed: false },
    { stage: 'Recommendation', completed: false },
    { stage: 'Review', completed: false },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-900 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome Back, {user?.first_name}!</h1>
            <p className="mt-2 text-primary-100">Track your applications and manage your academic journey</p>
          </div>
          <AcademicCapIcon className="h-20 w-20 text-primary-200 opacity-50" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <div className="mt-2 flex items-center text-sm">
                  <ArrowTrendingUpIcon
                    className={`h-4 w-4 mr-1 ${
                      stat.trend === 'up'
                        ? 'text-green-500'
                        : stat.trend === 'down'
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }`}
                  />
                  <span
                    className={`${
                      stat.trend === 'up'
                        ? 'text-green-600 dark:text-green-400'
                        : stat.trend === 'down'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left & Center */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <ChartBarIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Application Progress</h2>
            </div>
            <div className="space-y-4">
              {applicationProgress.map((step, idx) => (
                <div key={idx} className="flex items-center">
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                      step.completed
                        ? 'bg-green-500 dark:bg-green-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircleIcon className="h-6 w-6 text-white" />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 font-semibold">{idx + 1}</span>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        step.completed
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {step.stage}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {step.completed ? 'Completed' : 'In Progress'}
                    </p>
                  </div>
                  {idx < applicationProgress.length - 1 && (
                    <div className="ml-4 w-full max-w-[100px] h-1 bg-gray-200 dark:bg-gray-700 rounded">
                      <div
                        className={`h-1 rounded ${
                          step.completed ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        style={{ width: step.completed ? '100%' : '0%' }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <activity.icon className={`h-6 w-6 ${activity.color} mt-0.5`} />
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.description}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Applications</h2>
              <Link
                to="/student/applications"
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                View all →
              </Link>
            </div>
            {applications?.results && applications.results.length > 0 ? (
              <div className="space-y-4">
                {applications.results.slice(0, 3).map((app: any) => (
                  <Link
                    key={app.id}
                    to={`/student/applications/${app.id}`}
                    className="block border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{app.program_name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {app.academic_year} - {app.intake_period}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          app.status === 'PASSED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : app.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : app.status === 'UNDER_REVIEW'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {app.status_display}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No applications yet</p>
                <Link
                  to="/student/applications"
                  className="mt-4 inline-block text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  Create your first application →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <CalendarIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Deadlines</h2>
            </div>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="border-l-4 border-primary-500 dark:border-primary-400 pl-4 py-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{deadline.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{deadline.program}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-600 dark:text-gray-300">{deadline.date}</span>
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                      {deadline.daysLeft} days left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/student/applications"
                className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-3 rounded-lg transition-colors font-medium"
              >
                New Application
              </Link>
              <button
                onClick={() => navigate('/student/applications')}
                className="block w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Upload Document
              </button>
              <Link
                to="/student/profile"
                className="block w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-center py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Update Profile
              </Link>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <BellAlertIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
            </div>
            <div className="space-y-3">
              <div className="text-sm p-3 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400 rounded">
                <p className="font-medium text-blue-900 dark:text-blue-200">New message</p>
                <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                  Your application review is complete
                </p>
              </div>
              <div className="text-sm p-3 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 dark:border-green-400 rounded">
                <p className="font-medium text-green-900 dark:text-green-200">Document approved</p>
                <p className="text-green-700 dark:text-green-300 text-xs mt-1">
                  Transcript has been verified
                </p>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-800 rounded-lg shadow-lg p-6 text-white">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-primary-100 mb-4">
              Our support team is here to assist you with your application process
            </p>
            <button
              onClick={() => navigate('/student/messages')}
              className="bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
