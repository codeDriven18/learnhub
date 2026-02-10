import { useQuery } from 'react-query';
import { auditAPI } from '@/api/client';

export default function AdminSystemEvents() {
  const { data } = useQuery('system-events', () => auditAPI.events().then((res) => res.data));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Events</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-3">
        {data?.results?.map((event: any) => (
          <div key={event.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-900 dark:text-white">{event.event_type}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{event.created_at}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
