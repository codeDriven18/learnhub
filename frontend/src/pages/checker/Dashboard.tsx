import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { applicationsAPI, notificationsAPI, reviewsAPI } from '@/api/client';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  FolderIcon,
  ChartBarIcon,
  BellAlertIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

export default function CheckerDashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'urgent' | 'in_progress' | 'completed' | 'drafts'>('all');
  const { data: applications } = useQuery('checker-applications', () =>
    applicationsAPI.list().then((res) => res.data)
  );

  const { data: reviews } = useQuery('checker-reviews', () =>
    reviewsAPI.list().then((res) => res.data)
  );

  const { data: notifications } = useQuery('checker-notifications', () =>
    notificationsAPI.list().then((res) => res.data)
  );

  const assignedCount = applications?.results?.length || 0;
  const completedReviews = reviews?.results?.filter((r: any) => r.is_complete).length || 0;
  const pendingReviews = reviews?.results?.filter((r: any) => !r.is_complete).length || 0;
  const averageScore = reviews?.results?.length
    ? (
        reviews.results.reduce((sum: number, r: any) => sum + (r.overall_score || 0), 0) /
        reviews.results.length
      ).toFixed(1)
    : '0.0';

  const stats = [
    {
      name: 'Assigned to Me',
      value: assignedCount.toString(),
      icon: ClipboardDocumentListIcon,
      color: 'bg-blue-500',
      change: `${assignedCount} active`,
    },
    {
      name: 'Completed Reviews',
      value: completedReviews.toString(),
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      change: `${completedReviews} total`,
    },
    {
      name: 'Pending Reviews',
      value: pendingReviews.toString(),
      icon: ClockIcon,
      color: 'bg-yellow-500',
      change: `${pendingReviews} pending`,
    },
    {
      name: 'Average Score',
      value: averageScore,
      icon: StarIcon,
      color: 'bg-purple-500',
      change: 'Live average',
    },
  ];

  const statusStageMap: Record<string, string> = {
    DRAFT: 'Draft',
    SUBMITTED: 'Initial Review',
    UNDER_REVIEW: 'Document Review',
    NEEDS_REVISION: 'Needs Revision',
    FORWARDED_TO_QS: 'Final Review',
    PASSED: 'Completed',
    REJECTED: 'Completed',
  };

  const statusProgressMap: Record<string, number> = {
    DRAFT: 10,
    SUBMITTED: 30,
    UNDER_REVIEW: 60,
    NEEDS_REVISION: 45,
    FORWARDED_TO_QS: 80,
    PASSED: 100,
    REJECTED: 100,
  };

  const mapApplication = (app: any) => {
    const status = app.status || 'UNDER_REVIEW';
    const priority = app.requires_attention
      ? 'urgent'
      : status === 'NEEDS_REVISION' || status === 'SUBMITTED'
      ? 'high'
      : 'medium';
    return {
      id: app.id,
      student: app.student_name || app.student,
      program: app.program_name || app.program,
      submitted: app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : 'Recently',
      priority,
      stage: statusStageMap[status] || 'In Review',
      progress: statusProgressMap[status] ?? 40,
      status,
    };
  };

  const rawApplications = applications?.results?.length
    ? applications.results.map(mapApplication)
    : [];

  const filteredApplications = useMemo(() => {
    switch (filter) {
      case 'urgent':
        return rawApplications.filter((app: any) => app.priority === 'urgent');
      case 'in_progress':
        return rawApplications.filter((app: any) => ['UNDER_REVIEW', 'SUBMITTED', 'NEEDS_REVISION'].includes(app.status));
      case 'completed':
        return rawApplications.filter((app: any) => ['PASSED', 'REJECTED'].includes(app.status));
      case 'drafts':
        return rawApplications.filter((app: any) => app.status === 'DRAFT');
      default:
        return rawApplications;
    }
  }, [filter, rawApplications]);

  const displayApplications = filteredApplications.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Info Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track your assigned applications</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{assignedCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
            </div>
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedReviews}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
            </div>
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingReviews}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
            </div>
          </div>
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
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">{stat.change}</p>
              </div>
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Quick Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FolderIcon className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
              Quick Filters
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => setFilter('all')}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                  filter === 'all'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                All Applications
              </button>
              <button
                onClick={() => setFilter('urgent')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  filter === 'urgent'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Urgent Reviews
              </button>
              <button
                onClick={() => setFilter('in_progress')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  filter === 'in_progress'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  filter === 'completed'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('drafts')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  filter === 'drafts'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Drafts
              </button>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
              Deadlines
            </h2>
            <div className="space-y-3">
              {displayApplications.length ? (
                displayApplications.slice(0, 3).map((item: any) => (
                  <div key={item.id} className="border-l-4 border-red-500 dark:border-red-400 pl-3 py-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.student}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.program}</p>
                    <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1">
                      {item.stage}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No assigned applications.</p>
              )}
            </div>
          </div>

          {/* Review Statistics */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-800 rounded-lg shadow-lg p-6 text-white">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Your Stats
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-primary-100">Assigned</span>
                <span className="font-bold">{assignedCount} reviews</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-primary-100">Completed</span>
                <span className="font-bold">{completedReviews} reviews</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-primary-100">Pending</span>
                <span className="font-bold">{pendingReviews} reviews</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-primary-100">Avg. Score</span>
                <span className="font-bold flex items-center">
                  {averageScore} <StarIcon className="h-4 w-4 ml-1" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Assigned Applications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Assigned Applications</h2>
              <Link
                to="/checker/applications"
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {displayApplications.length ? (
                displayApplications.map((app) => (
                <div
                  key={app.id}
                  className="border dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{app.student}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            app.priority === 'urgent'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : app.priority === 'high'
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}
                        >
                          {app.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{app.program}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Submitted {app.submitted}</p>
                    </div>
                    <button
                      onClick={() =>
                        navigate(app.id ? `/checker/applications/${app.id}` : '/checker/applications')
                      }
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Review Now
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{app.stage}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{app.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all"
                      style={{ width: `${app.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No applications to review.</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {notifications?.results?.slice(0, 5).map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.message}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
              {!notifications?.results?.length && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity.</p>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <BellAlertIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
            </div>
            <div className="space-y-3">
              {notifications?.results?.slice(0, 2).map((note: any) => (
                <div
                  key={note.id}
                  className="p-3 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400 rounded"
                >
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200">{note.title}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">{note.message}</p>
                </div>
              ))}
              {!notifications?.results?.length && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
