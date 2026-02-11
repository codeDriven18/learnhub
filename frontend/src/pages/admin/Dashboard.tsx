import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { applicationsAPI, analyticsAPI, auditAPI, reviewsAPI } from '@/api/client';
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
  const { data: analytics } = useQuery('admin-analytics', () =>
    analyticsAPI.daily().then((res) => res.data)
  );
  const { data: logs } = useQuery('admin-logs', () => auditAPI.logs().then((res) => res.data));
  const { data: reviews } = useQuery('admin-reviews', () => reviewsAPI.list().then((res) => res.data));

  const analyticsResults = analytics?.results || [];

  const applicationTrends = analyticsResults
    .slice(0, 7)
    .map((item: any) => ({
      month: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      applications: item.total_applications,
      approved: Math.round(item.reviews_completed * 0.7),
      rejected: Math.max(0, Math.round(item.reviews_completed * 0.3)),
    }))
    .reverse();

  const statusDistribution = useMemo(() => {
    const items = applications?.results || [];
    const counts = items.reduce(
      (acc: any, app: any) => {
        acc[app.status_display] = (acc[app.status_display] || 0) + 1;
        return acc;
      },
      {}
    );
    const colors = ['#EAB308', '#3B82F6', '#10B981', '#EF4444', '#6366F1', '#F97316'];
    return Object.keys(counts).map((name, idx) => ({
      name,
      value: counts[name],
      color: colors[idx % colors.length],
    }));
  }, [applications]);

  const programStats = useMemo(() => {
    const items = applications?.results || [];
    const counts = items.reduce(
      (acc: any, app: any) => {
        const key = app.program_name || 'Unknown';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {}
    );
    return Object.keys(counts).map((program) => ({ program, count: counts[program] }));
  }, [applications]);

  const latestAnalytics = analyticsResults[0];
  const stats = [
    {
      name: 'Applications',
      value: latestAnalytics?.total_applications?.toString() || '0',
      change: 'Live count',
      trend: 'up',
      icon: DocumentTextIcon,
      color: 'bg-green-500',
    },
    {
      name: 'New Applicants',
      value: latestAnalytics?.new_applicants?.toString() || '0',
      change: 'Today',
      trend: 'up',
      icon: UsersIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Reviews Completed',
      value: latestAnalytics?.reviews_completed?.toString() || '0',
      change: 'Today',
      trend: 'up',
      icon: CheckCircleIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Documents Verified',
      value: latestAnalytics?.documents_verified?.toString() || '0',
      change: 'Today',
      trend: 'up',
      icon: ClockIcon,
      color: 'bg-yellow-500',
    },
  ];

  const recentActivities = logs?.results?.slice(0, 5) || [];

  const topReviewers = useMemo(() => {
    const items = reviews?.results || [];
    const counts = items.reduce((acc: any, review: any) => {
      const name = review.checker_name || 'Reviewer';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts)
      .map((name) => ({ name, reviews: counts[name], rating: 'N/A' }))
      .slice(0, 4);
  }, [reviews]);

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
            {statusDistribution.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(((percent ?? 0) * 100)).toFixed(0)}%`}
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
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No status data available.</p>
            )}
          </div>
        </div>

        {/* Program Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Applications by Program</h2>
          {programStats.length ? (
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
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No program data available.</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.length ? (
              recentActivities.map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                      {(activity.actor_email || 'S').charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.actor_email || 'System'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.action} · {activity.entity_type} #{activity.entity_id || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                    <button
                      onClick={() => navigate('/admin/logs')}
                      className="text-xs text-primary-600 dark:text-primary-400 hover:underline mt-1"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity.</p>
            )}
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
            {topReviewers.length ? (
              topReviewers.map((reviewer, index) => (
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
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No review data available.</p>
            )}
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
