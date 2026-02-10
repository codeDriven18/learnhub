import { useQuery } from 'react-query';
import { analyticsAPI } from '@/api/client';

export default function AdminAnalytics() {
  const { data } = useQuery('analytics-daily', () => analyticsAPI.daily().then((res) => res.data));
  const latest = data?.results?.[0];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          ['Daily Applications', latest?.total_applications || 0],
          ['New Applicants', latest?.new_applicants || 0],
          ['Reviews Completed', latest?.reviews_completed || 0],
        ].map(([metric, value]) => (
          <div key={metric as string} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">{metric}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
