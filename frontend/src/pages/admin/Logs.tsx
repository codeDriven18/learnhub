import { useQuery } from 'react-query';
import { auditAPI } from '@/api/client';

export default function AdminLogs() {
  const { data: logs } = useQuery('audit-logs', () => auditAPI.logs().then((res) => res.data));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Logs</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-3">
        {logs?.results?.map((log: any) => (
          <div key={log.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-900 dark:text-white">{log.action}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{log.entity_type} #{log.entity_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
