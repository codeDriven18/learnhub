import { useMutation, useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { applicationsAPI, authAPI } from '@/api/client';

export default function AdminApplications() {
  const queryClient = useQueryClient();
  const { data: applications } = useQuery('admin-applications', () =>
    applicationsAPI.list().then((res) => res.data)
  );
  const { data: checkers } = useQuery('checkers', () =>
    authAPI.listUsers('CHECKER').then((res) => res.data)
  );

  const assignMutation = useMutation(
    ({ id, checkerId }: { id: number; checkerId: number }) => applicationsAPI.assign(id, checkerId),
    {
      onSuccess: () => {
        toast.success('Application assigned');
        queryClient.invalidateQueries('admin-applications');
      },
    }
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Applications</h1>
      <div className="space-y-4">
        {applications?.results?.map((app: any) => (
          <div key={app.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{app.program_name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{app.student_name}</p>
              </div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                {app.status_display}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <select
                className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
                onChange={(e) => {
                  const checkerId = Number(e.target.value);
                  if (checkerId) assignMutation.mutate({ id: app.id, checkerId });
                }}
                defaultValue=""
              >
                <option value="">Assign to checker</option>
                {checkers?.results?.map((checker: any) => (
                  <option key={checker.id} value={checker.id}>
                    {checker.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
