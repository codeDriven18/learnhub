import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { authAPI } from '@/api/client';

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'STUDENT',
  });

  const { data: users } = useQuery('admin-users', () => authAPI.listUsers().then((res) => res.data));

  const createMutation = useMutation((data: any) => authAPI.createUser(data), {
    onSuccess: () => {
      toast.success('User created');
      queryClient.invalidateQueries('admin-users');
      setFormData({ email: '', password: '', first_name: '', last_name: '', role: 'STUDENT' });
    },
    onError: (error: any) => toast.error(error.response?.data?.detail || 'Create failed'),
  });

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create User</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="First Name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
          <select
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="STUDENT">Applicant</option>
            <option value="CHECKER">Reviewer</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <button
          onClick={handleCreate}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Create User
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">All Users</h2>
        <div className="space-y-3">
          {users?.results?.map((user: any) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.full_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                {user.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
