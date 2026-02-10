import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { auditAPI } from '@/api/client';

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { data } = useQuery('system-settings', () => auditAPI.settings().then((res) => res.data));
  const [newSetting, setNewSetting] = useState({ key: '', value: '' });

  const updateMutation = useMutation(
    ({ id, value }: { id: number; value: string }) => auditAPI.updateSetting(id, { value }),
    {
      onSuccess: () => {
        toast.success('Setting updated');
        queryClient.invalidateQueries('system-settings');
      },
    }
  );

  const createMutation = useMutation((payload: any) => auditAPI.createSetting(payload), {
    onSuccess: () => {
      toast.success('Setting created');
      queryClient.invalidateQueries('system-settings');
      setNewSetting({ key: '', value: '' });
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex gap-3">
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Key"
            value={newSetting.key}
            onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
          />
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Value"
            value={newSetting.value}
            onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
          />
          <button
            onClick={() => createMutation.mutate(newSetting)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Add
          </button>
        </div>
        <div className="space-y-3">
          {data?.results?.map((setting: any) => (
            <div key={setting.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-900 dark:text-white">{setting.key}</span>
              <div className="flex gap-2">
                <input
                  className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
                  defaultValue={setting.value}
                  onBlur={(e) => updateMutation.mutate({ id: setting.id, value: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
