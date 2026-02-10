import { useMutation, useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { auditAPI } from '@/api/client';

export default function AdminFeatures() {
  const queryClient = useQueryClient();
  const { data } = useQuery('feature-flags', () => auditAPI.features().then((res) => res.data));

  const toggleMutation = useMutation(
    ({ id, is_enabled }: { id: number; is_enabled: boolean }) => auditAPI.updateFeature(id, { is_enabled }),
    {
      onSuccess: () => {
        toast.success('Feature updated');
        queryClient.invalidateQueries('feature-flags');
      },
    }
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Feature Control</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-3">
        {data?.results?.map((flag: any) => (
          <div key={flag.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{flag.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{flag.key}</p>
            </div>
            <button
              onClick={() => toggleMutation.mutate({ id: flag.id, is_enabled: !flag.is_enabled })}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                flag.is_enabled
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
              }`}
            >
              {flag.is_enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
