import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { authAPI } from '@/api/client';

export default function AdminPermissions() {
  const queryClient = useQueryClient();
  const [roleId, setRoleId] = useState('');
  const [permissionId, setPermissionId] = useState('');

  const { data: roles } = useQuery('roles', () => authAPI.listRoles().then((res) => res.data));
  const { data: permissions } = useQuery('permissions', () =>
    authAPI.listPermissions().then((res) => res.data)
  );
  const { data: mappings } = useQuery('role-permissions', () =>
    authAPI.listRolePermissions().then((res) => res.data)
  );

  const createMutation = useMutation((data: any) => authAPI.createRolePermission(data), {
    onSuccess: () => {
      toast.success('Permission assigned');
      queryClient.invalidateQueries('role-permissions');
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Roles & Permissions</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex gap-3">
          <select
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
          >
            <option value="">Select Role</option>
            {roles?.results?.map((role: any) => (
              <option key={role.id} value={role.id}>
                {role.code}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            value={permissionId}
            onChange={(e) => setPermissionId(e.target.value)}
          >
            <option value="">Select Permission</option>
            {permissions?.results?.map((perm: any) => (
              <option key={perm.id} value={perm.id}>
                {perm.code}
              </option>
            ))}
          </select>
          <button
            onClick={() => createMutation.mutate({ role: Number(roleId), permission: Number(permissionId) })}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Assign
          </button>
        </div>
        <div className="space-y-2">
          {mappings?.results?.map((map: any) => (
            <div key={map.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
              {map.role_code} → {map.permission_code}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
