import { useQuery } from 'react-query';
import { universitiesAPI } from '@/api/client';

export default function StudyHub() {
  const { data: universities } = useQuery('universities', () =>
    universitiesAPI.list().then((res) => res.data)
  );
  const { data: programs } = useQuery('programs', () =>
    universitiesAPI.programs().then((res) => res.data)
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Study Information Hub</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Universities</h2>
          <div className="mt-3 space-y-2">
            {universities?.results?.slice(0, 5).map((uni: any) => (
              <div key={uni.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-900 dark:text-white">{uni.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{uni.country_name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Programs</h2>
          <div className="mt-3 space-y-2">
            {programs?.results?.slice(0, 5).map((program: any) => (
              <div key={program.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-900 dark:text-white">{program.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{program.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resources</h2>
        <div className="mt-4 space-y-3">
          {['Admissions Q&A', 'Scholarship Workshop', 'Essay Writing Clinic'].map((event) => (
            <div key={event} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-900 dark:text-white">{event}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Next week</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
