import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { authAPI } from '@/api/client';

export default function CheckerProfile() {
  const queryClient = useQueryClient();
  const { data: user } = useQuery('profile', () => authAPI.getProfile().then((res) => res.data));
  const { data: checkerProfile } = useQuery('checker-profile', () =>
    authAPI.getCheckerProfile().then((res) => res.data)
  );

  const [profileForm, setProfileForm] = useState<any>({});

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

  const handleSave = () => {
    updateUserMutation.mutate({
      first_name: profileForm.first_name ?? user?.first_name,
      last_name: profileForm.last_name ?? user?.last_name,
    });
    updateCheckerMutation.mutate({
      department: profileForm.department ?? checkerProfile?.department,
      specialization: profileForm.specialization ?? checkerProfile?.specialization,
      bio: profileForm.bio ?? checkerProfile?.bio,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
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
        <button
          onClick={handleSave}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
