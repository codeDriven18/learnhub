import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { authAPI } from '@/api/client';

export default function CheckerSettings() {
  const queryClient = useQueryClient();
  const { data: checkerProfile } = useQuery('checker-profile', () =>
    authAPI.getCheckerProfile().then((res) => res.data)
  );
  const { data: preferences } = useQuery('preferences', () =>
    authAPI.getPreferences().then((res) => res.data)
  );

  const [availability, setAvailability] = useState<boolean | null>(null);
  const [notificationForm, setNotificationForm] = useState<any>({});

  const currentAvailability = useMemo(() => {
    if (availability !== null) {
      return availability;
    }
    return checkerProfile?.is_available ?? false;
  }, [availability, checkerProfile]);

  const updateCheckerMutation = useMutation((data: any) => authAPI.updateCheckerProfile(data), {
    onSuccess: () => {
      toast.success('Availability updated');
      queryClient.invalidateQueries('checker-profile');
    },
  });

  const updatePreferencesMutation = useMutation((data: any) => authAPI.updatePreferences(data), {
    onSuccess: () => {
      toast.success('Notification preferences updated');
      queryClient.invalidateQueries('preferences');
    },
  });

  const handleAvailabilityToggle = () => {
    const nextValue = !currentAvailability;
    setAvailability(nextValue);
    updateCheckerMutation.mutate({ is_available: nextValue });
  };

  const handleNotificationsSave = () => {
    updatePreferencesMutation.mutate({
      email_notifications: notificationForm.email_notifications ?? preferences?.email_notifications,
      sms_notifications: notificationForm.sms_notifications ?? preferences?.sms_notifications,
      push_notifications: notificationForm.push_notifications ?? preferences?.push_notifications,
      marketing_notifications: notificationForm.marketing_notifications ?? preferences?.marketing_notifications,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviewer Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">Availability</span>
          <button
            onClick={handleAvailabilityToggle}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              currentAvailability
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            {currentAvailability ? 'Available' : 'Unavailable'}
          </button>
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
                onChange={(e) =>
                  setNotificationForm({ ...notificationForm, [key]: e.target.checked })
                }
              />
              {label}
            </label>
          ))}
        </div>
        <button
          onClick={handleNotificationsSave}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Save Notification Preferences
        </button>
      </div>
    </div>
  );
}
