import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { applicationsAPI, universitiesAPI } from '@/api/client';

export default function StudentApplications() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    program: '',
    program_name: '',
    academic_year: '2026-2027',
    intake_period: 'Fall 2026',
    personal_statement: '',
    additional_info: '',
  });

  const { data: applications } = useQuery('student-applications', () =>
    applicationsAPI.list().then((res) => res.data)
  );

  const { data: programs } = useQuery('programs', () =>
    universitiesAPI.programs().then((res) => res.data)
  );

  const createMutation = useMutation(applicationsAPI.create, {
    onSuccess: () => {
      toast.success('Application created');
      queryClient.invalidateQueries('student-applications');
      setShowForm(false);
      setFormData({
        program: '',
        program_name: '',
        academic_year: '2026-2027',
        intake_period: 'Fall 2026',
        personal_statement: '',
        additional_info: '',
      });
    },
    onError: (error: any) => toast.error(error.response?.data?.error || 'Failed to create'),
  });

  const submitMutation = useMutation((id: number) => applicationsAPI.submit(id), {
    onSuccess: () => {
      toast.success('Application submitted');
      queryClient.invalidateQueries('student-applications');
    },
    onError: (error: any) => toast.error(error.response?.data?.error || 'Submit failed'),
  });

  const deleteMutation = useMutation((id: number) => applicationsAPI.delete(id), {
    onSuccess: () => {
      toast.success('Application deleted');
      queryClient.invalidateQueries('student-applications');
    },
  });

  const handleCreate = () => {
    const payload: any = { ...formData };
    if (payload.program) {
      payload.program = Number(payload.program);
    } else {
      delete payload.program;
    }
    if (!payload.program_name) {
      payload.program_name = 'General Program';
    }
    createMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Applications</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          {showForm ? 'Close' : 'New Application'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Program</label>
              <select
                className="w-full mt-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
              >
                <option value="">Select program</option>
                {programs?.results?.map((program: any) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Program Name</label>
              <input
                className="w-full mt-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
                value={formData.program_name}
                onChange={(e) => setFormData({ ...formData, program_name: e.target.value })}
                placeholder="If program not listed"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Academic Year</label>
              <input
                className="w-full mt-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Intake Period</label>
              <input
                className="w-full mt-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
                value={formData.intake_period}
                onChange={(e) => setFormData({ ...formData, intake_period: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">Personal Statement</label>
            <textarea
              className="w-full mt-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
              rows={4}
              value={formData.personal_statement}
              onChange={(e) => setFormData({ ...formData, personal_statement: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">Additional Info</label>
            <textarea
              className="w-full mt-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
              rows={3}
              value={formData.additional_info}
              onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
            />
          </div>
          <button
            onClick={handleCreate}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Create Application
          </button>
        </div>
      )}

      <div className="space-y-4">
        {applications?.results?.map((app: any) => (
          <div key={app.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{app.program_name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {app.academic_year} • {app.intake_period}
                </p>
              </div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                {app.status_display}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => submitMutation.mutate(app.id)}
                disabled={app.status !== 'DRAFT'}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg disabled:opacity-50"
              >
                Submit
              </button>
              <button
                onClick={() => deleteMutation.mutate(app.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg"
              >
                Delete
              </button>
              <a
                href={`/student/applications/${app.id}`}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg"
              >
                View Details
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
