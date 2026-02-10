import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { applicationsAPI } from '@/api/client';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  UsersIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: applications } = useQuery('admin-applications', () =>
    applicationsAPI.list().then((res) => res.data)
  );

  // Mock data for charts
  const applicationTrends = [
    { month: 'Jan', applications: 45, approved: 30, rejected: 10 },
    { month: 'Feb', applications: 52, approved: 35, rejected: 12 },
    { month: 'Mar', applications: 48, approved: 32, rejected: 11 },
    { month: 'Apr', applications: 61, approved: 40, rejected: 15 },
    { month: 'May', applications: 55, approved: 38, rejected: 12 },
    { month: 'Jun', applications: 67, approved: 45, rejected: 18 },
  ];

  const statusDistribution = [
    { name: 'Pending', value: 25, color: '#EAB308' },
    { name: 'Under Review', value: 35, color: '#3B82F6' },
    { name: 'Approved', value: 30, color: '#10B981' },
    { name: 'Rejected', value: 10, color: '#EF4444' },
  ];

  const programStats = [
    { program: 'Computer Science', count: 45 },
    { program: 'Engineering', count: 38 },
    { program: 'Business', count: 32 },
    { program: 'Medicine', count: 28 },
    { program: 'Arts', count: 22 },
  ];

  const stats = [
    {
      name: 'Total Users',
      value: '1,245',
      change: '+12.5%',
      trend: 'up',
      icon: UsersIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Applications',
      value: '892',
      change: '+8.2%',
      trend: 'up',
      icon: DocumentTextIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Approved',
      value: '534',
      change: '+15.3%',
      trend: 'up',
      icon: CheckCircleIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Pending Review',
      value: '156',
      change: '-3.1%',
      trend: 'down',
      icon: ClockIcon,
      color: 'bg-yellow-500',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'Submitted application',
      program: 'Computer Science',
      time: '5 minutes ago',
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'Application approved',
      program: 'Engineering',
      time: '15 minutes ago',
    },
    {
      id: 3,
      user: 'Mike Johnson',
      action: 'Document uploaded',
      program: 'Business Administration',
      time: '1 hour ago',
    },
    {
      id: 4,
      user: 'Sarah Williams',
      action: 'Application under review',
      program: 'Medicine',
      time: '2 hours ago',
    },
  ];

  const topReviewers = [
    { name: 'Dr. Sarah Chen', reviews: 145, rating: 4.9 },
    { name: 'Prof. John Smith', reviews: 132, rating: 4.8 },
    { name: 'Dr. Emily Brown', reviews: 128, rating: 4.7 },
    { name: 'Prof. Michael Lee', reviews: 115, rating: 4.6 },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Main Content - Left & Center */}
      <div className="col-span-12 xl:col-span-9 space-y-6">
        {/* Header Stats */}
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
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        stat.trend === 'up'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="ml-2 text-gray-500 dark:text-gray-400">vs last month</span>
                  </div>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Trends */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Application Trends</h2>
              <ChartBarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={applicationTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="approved" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="rejected" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Program Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Applications by Program</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={programStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="program" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                    {activity.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.user}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.action} - {activity.program}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    <button
                      onClick={() => navigate('/admin/applications')}
                      className="text-xs text-primary-600 dark:text-primary-400 hover:underline mt-1"
                    >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="col-span-12 xl:col-span-3 space-y-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/admin/users')}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg transition-colors"
            >
              Add New User
            </button>
            <button
              onClick={() => navigate('/admin/analytics')}
              className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-lg transition-colors"
            >
              Generate Report
            </button>
            <button
              onClick={() => navigate('/admin/settings')}
              className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-lg transition-colors"
            >
              System Settings
            </button>
          </div>
        </div>

        {/* Top Reviewers */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Reviewers</h2>
          <div className="space-y-4">
            {topReviewers.map((reviewer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{reviewer.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{reviewer.reviews} reviews</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{reviewer.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-800 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-lg font-semibold mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary-100">Server</span>
              <span className="px-2 py-1 bg-green-500 rounded-full text-xs font-medium">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary-100">Database</span>
              <span className="px-2 py-1 bg-green-500 rounded-full text-xs font-medium">Healthy</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary-100">Email Service</span>
              <span className="px-2 py-1 bg-green-500 rounded-full text-xs font-medium">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary-100">Storage</span>
              <span className="text-sm font-medium">68% Used</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alerts</h2>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 dark:border-yellow-400 rounded">
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">Pending Reviews</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">25 applications awaiting review</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 rounded">
              <p className="text-sm font-medium text-red-900 dark:text-red-200">Deadline Alert</p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">5 documents expiring soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
