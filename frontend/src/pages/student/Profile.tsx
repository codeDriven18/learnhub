import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { authAPI } from '@/api/client';

export default function StudentProfile() {
  const queryClient = useQueryClient();
  const { data: user } = useQuery('profile', () => authAPI.getProfile().then((res) => res.data));
  const { data: studentProfile } = useQuery('student-profile', () =>
    authAPI.getStudentProfile().then((res) => res.data)
  );

  const [profileForm, setProfileForm] = useState<any>({});

  const updateUserMutation = useMutation((data: any) => authAPI.updateProfile(data), {
    onSuccess: () => {
      toast.success('Profile updated');
      queryClient.invalidateQueries('profile');
    },
  });

  const updateStudentMutation = useMutation((data: any) => authAPI.updateStudentProfile(data), {
    onSuccess: () => {
      toast.success('Student details updated');
      queryClient.invalidateQueries('student-profile');
    },
  });

  const handleSave = () => {
    updateUserMutation.mutate({
      first_name: profileForm.first_name ?? user?.first_name,
      last_name: profileForm.last_name ?? user?.last_name,
    });
    updateStudentMutation.mutate({
      phone_number: profileForm.phone_number ?? studentProfile?.phone_number,
      nationality: profileForm.nationality ?? studentProfile?.nationality,
      institution: profileForm.institution ?? studentProfile?.institution,
      field_of_study: profileForm.field_of_study ?? studentProfile?.field_of_study,
      gpa: profileForm.gpa ?? studentProfile?.gpa,
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
            placeholder="Phone"
            defaultValue={studentProfile?.phone_number}
            onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
          />
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Nationality"
            defaultValue={studentProfile?.nationality}
            onChange={(e) => setProfileForm({ ...profileForm, nationality: e.target.value })}
          />
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Institution"
            defaultValue={studentProfile?.institution}
            onChange={(e) => setProfileForm({ ...profileForm, institution: e.target.value })}
          />
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Field of Study"
            defaultValue={studentProfile?.field_of_study}
            onChange={(e) => setProfileForm({ ...profileForm, field_of_study: e.target.value })}
          />
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="GPA"
            defaultValue={studentProfile?.gpa}
            onChange={(e) => setProfileForm({ ...profileForm, gpa: e.target.value })}
          />
        </div>
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
