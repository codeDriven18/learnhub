import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { authAPI } from '@/api/client';

export default function StudentSettings() {
  const queryClient = useQueryClient();
  const { data: preferences } = useQuery('preferences', () =>
    authAPI.getPreferences().then((res) => res.data)
  );

  const [form, setForm] = useState<any>({});

  const updatePreferencesMutation = useMutation((data: any) => authAPI.updatePreferences(data), {
    onSuccess: () => {
      toast.success('Settings updated');
      queryClient.invalidateQueries('preferences');
    },
  });

  const handleSave = () => {
    updatePreferencesMutation.mutate({
      language: form.language ?? preferences?.language,
      timezone: form.timezone ?? preferences?.timezone,
      email_notifications: form.email_notifications ?? preferences?.email_notifications,
      sms_notifications: form.sms_notifications ?? preferences?.sms_notifications,
      push_notifications: form.push_notifications ?? preferences?.push_notifications,
      marketing_notifications: form.marketing_notifications ?? preferences?.marketing_notifications,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Locale</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Language"
            defaultValue={preferences?.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
          />
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Timezone"
            defaultValue={preferences?.timezone}
            onChange={(e) => setForm({ ...form, timezone: e.target.value })}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ['email_notifications', 'Email Notifications'],
            ['sms_notifications', 'SMS Notifications'],
            ['push_notifications', 'Push Notifications'],
            ['marketing_notifications', 'Marketing Notifications'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                defaultChecked={preferences?.[key as keyof typeof preferences] as boolean}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
              />
              {label}
            </label>
          ))}
        </div>
        <button
          onClick={handleSave}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
