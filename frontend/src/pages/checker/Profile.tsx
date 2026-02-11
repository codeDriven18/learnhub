import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { authAPI } from '@/api/client';
import { useAuthStore } from '@/store/authStore';

export default function CheckerProfile() {
  const queryClient = useQueryClient();
  const { sessionId } = useAuthStore();

  const { data: user } = useQuery('profile', () => authAPI.getProfile().then((res) => res.data));
  const { data: checkerProfile } = useQuery('checker-profile', () =>
    authAPI.getCheckerProfile().then((res) => res.data)
  );
  const { data: preferences } = useQuery('preferences', () =>
    authAPI.getPreferences().then((res) => res.data)
  );
  const { data: sessions } = useQuery('sessions', () => authAPI.listSessions().then((res) => res.data));

  const [profileForm, setProfileForm] = useState<any>({});
  const [preferenceForm, setPreferenceForm] = useState<any>({});
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const updateUserMutation = useMutation((data: any) => authAPI.updateProfile(data), {
    onSuccess: () => {
      toast.success('Profile updated');
      queryClient.invalidateQueries('profile');
    },
  });

  const updateCheckerMutation = useMutation((data: any) => authAPI.updateCheckerProfile(data), {
    onSuccess: () => {
      toast.success('Reviewer details updated');
      queryClient.invalidateQueries('checker-profile');
    },
  });

  const updatePreferencesMutation = useMutation((data: any) => authAPI.updatePreferences(data), {
    onSuccess: () => {
      toast.success('Preferences updated');
      queryClient.invalidateQueries('preferences');
    },
  });

  const changePasswordMutation = useMutation(
    ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      authAPI.changePassword(oldPassword, newPassword),
    {
      onSuccess: () => {
        toast.success('Password updated');
        setPasswordForm({ oldPassword: '', newPassword: '' });
      },
    }
  );

  const changeEmailMutation = useMutation(
    ({ newEmail, password }: { newEmail: string; password: string }) => authAPI.changeEmail(newEmail, password),
    {
      onSuccess: () => {
        toast.success('Email updated');
        setEmailForm({ newEmail: '', password: '' });
        queryClient.invalidateQueries('profile');
      },
    }
  );

  const uploadPhotoMutation = useMutation((data: FormData) => authAPI.uploadProfilePhoto(data), {
    onSuccess: () => {
      toast.success('Photo updated');
      setPhotoFile(null);
      queryClient.invalidateQueries('profile');
    },
  });

  const revokeSessionMutation = useMutation((id: string) => authAPI.revokeSession(id), {
    onSuccess: () => {
      toast.success('Session revoked');
      queryClient.invalidateQueries('sessions');
    },
  });

  const revokeOtherSessionsMutation = useMutation(
    () => authAPI.revokeOtherSessions(sessionId || undefined),
    {
      onSuccess: () => {
        toast.success('Other sessions revoked');
        queryClient.invalidateQueries('sessions');
      },
    }
  );

  const handleSave = () => {
    updateUserMutation.mutate({
      first_name: profileForm.first_name ?? user?.first_name,
      last_name: profileForm.last_name ?? user?.last_name,
    });
    updateCheckerMutation.mutate({
      department: profileForm.department ?? checkerProfile?.department,
      specialization: profileForm.specialization ?? checkerProfile?.specialization,
      bio: profileForm.bio ?? checkerProfile?.bio,
      is_available: profileForm.is_available ?? checkerProfile?.is_available,
    });
  };

  const handlePreferencesSave = () => {
    updatePreferencesMutation.mutate({
      language: preferenceForm.language ?? preferences?.language,
      timezone: preferenceForm.timezone ?? preferences?.timezone,
      email_notifications: preferenceForm.email_notifications ?? preferences?.email_notifications,
      sms_notifications: preferenceForm.sms_notifications ?? preferences?.sms_notifications,
      push_notifications: preferenceForm.push_notifications ?? preferences?.push_notifications,
      marketing_notifications: preferenceForm.marketing_notifications ?? preferences?.marketing_notifications,
    });
  };

  const handlePhotoUpload = () => {
    if (!photoFile) {
      toast.error('Select a photo first');
      return;
    }
    const formData = new FormData();
    formData.append('profile_photo', photoFile);
    uploadPhotoMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Photo</h2>
        <div className="flex items-center gap-4">
          {user?.profile_photo_url ? (
            <img
              src={user.profile_photo_url}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
          )}
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            className="text-sm text-gray-600 dark:text-gray-300"
          />
          <button
            onClick={handlePhotoUpload}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Upload Photo
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Reviewer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="First Name"
            defaultValue={user?.first_name}
            onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
          />
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Last Name"
            defaultValue={user?.last_name}
            onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
          />
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Department"
            defaultValue={checkerProfile?.department}
            onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
          />
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Specialization"
            defaultValue={checkerProfile?.specialization}
            onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
          />
        </div>
        <textarea
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
          rows={3}
          placeholder="Bio"
          defaultValue={checkerProfile?.bio}
          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            defaultChecked={checkerProfile?.is_available}
            onChange={(e) => setProfileForm({ ...profileForm, is_available: e.target.checked })}
          />
          Available for new reviews
        </label>
        <button
          onClick={handleSave}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Save Changes
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Language"
            defaultValue={preferences?.language}
            onChange={(e) => setPreferenceForm({ ...preferenceForm, language: e.target.value })}
          />
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Timezone"
            defaultValue={preferences?.timezone}
            onChange={(e) => setPreferenceForm({ ...preferenceForm, timezone: e.target.value })}
          />
        </div>
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
                  setPreferenceForm({ ...preferenceForm, [key]: e.target.checked })
                }
              />
              {label}
            </label>
          ))}
        </div>
        <button
          onClick={handlePreferencesSave}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Update Preferences
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="New Email"
            value={emailForm.newEmail}
            onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
          />
          <input
            type="password"
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Current Password"
            value={emailForm.password}
            onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
          />
        </div>
        <button
          onClick={() => changeEmailMutation.mutate(emailForm)}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Change Email
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <input
            type="password"
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Current Password"
            value={passwordForm.oldPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
          />
          <input
            type="password"
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="New Password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          />
        </div>
        <button
          onClick={() => changePasswordMutation.mutate(passwordForm)}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Change Password
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Sessions</h2>
          <button
            onClick={() => revokeOtherSessionsMutation.mutate()}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
          >
            Logout Other Sessions
          </button>
        </div>
        <div className="space-y-3">
          {sessions?.results?.map((session: any) => (
            <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">{session.ip_address || 'Unknown IP'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{session.user_agent || 'Unknown device'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last seen {new Date(session.last_seen_at).toLocaleString()}
                </p>
              </div>
              <button
                disabled={sessionId === session.id}
                onClick={() => revokeSessionMutation.mutate(session.id)}
                className="text-xs text-red-600 hover:underline disabled:opacity-50"
              >
                {sessionId === session.id ? 'Current' : 'Revoke'}
              </button>
            </div>
          ))}
          {!sessions?.results?.length && (
            <p className="text-sm text-gray-500 dark:text-gray-400">No active sessions.</p>
          )}
        </div>
      </div>
    </div>
  );
}
