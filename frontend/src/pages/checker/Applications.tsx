import { useQuery } from 'react-query';
import { applicationsAPI } from '@/api/client';
import { Link } from 'react-router-dom';

export default function CheckerApplications() {
  const { data: applications } = useQuery('checker-applications', () =>
    applicationsAPI.list().then((res) => res.data)
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assigned Applications</h1>
      <div className="space-y-4">
        {applications?.results?.map((app: any) => (
          <div key={app.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{app.student_name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{app.program_name}</p>
              </div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                {app.status_display}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                to={`/checker/applications/${app.id}`}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg"
              >
                Review
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
