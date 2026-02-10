import { useQuery } from 'react-query';
import { applicationsAPI } from '@/api/client';

export default function CheckerCRM() {
  const { data: applications } = useQuery('checker-crm', () =>
    applicationsAPI.list().then((res) => res.data)
  );

  const grouped = {
    New: applications?.results?.filter((a: any) => a.status === 'SUBMITTED') || [],
    'In Review': applications?.results?.filter((a: any) => a.status === 'UNDER_REVIEW') || [],
    Completed: applications?.results?.filter((a: any) => ['PASSED', 'REJECTED'].includes(a.status)) || [],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CRM - Applicant Pipeline</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(grouped).map(([stage, list]) => (
          <div key={stage} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">{stage}</h2>
            <div className="space-y-3">
              {list.map((app: any) => (
                <div key={app.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{app.student_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{app.program_name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
