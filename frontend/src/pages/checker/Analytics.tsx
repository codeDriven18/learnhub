import { useQuery } from 'react-query';
import { reviewsAPI } from '@/api/client';

export default function CheckerAnalytics() {
  const { data: reviews } = useQuery('checker-reviews', () =>
    reviewsAPI.list().then((res) => res.data)
  );

  const total = reviews?.results?.length || 0;
  const completed = reviews?.results?.filter((r: any) => r.is_complete).length || 0;
  const avgScore =
    total > 0
      ? (
          reviews.results.reduce((sum: number, r: any) => sum + (r.overall_score || 0), 0) /
          total
        ).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[['Reviews Completed', completed], ['Total Reviews', total], ['Avg Score', avgScore]].map(
          ([metric, value]) => (
            <div key={metric as string} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">{metric}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
            </div>
          )
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Reviews</h2>
        <div className="mt-3 space-y-2">
          {reviews?.results?.slice(0, 5).map((review: any) => (
            <div key={review.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-900 dark:text-white">{review.student_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Decision: {review.decision_display}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
