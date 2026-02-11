import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { applicationsAPI, documentsAPI } from '@/api/client';

const documentTypes = [
  'TRANSCRIPT',
  'TEST_SCORE',
  'ESSAY',
  'RECOMMENDATION_LETTER',
  'PORTFOLIO',
  'CERTIFICATE',
  'ID_DOCUMENT',
  'OTHER',
];

const requiredDocuments = ['TRANSCRIPT', 'TEST_SCORE', 'ESSAY'];

export default function StudentApplicationDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [docType, setDocType] = useState('TRANSCRIPT');
  const [docTitle, setDocTitle] = useState('');
  const [docFile, setDocFile] = useState<File | null>(null);

  const { data: application } = useQuery(['application', id], () =>
    applicationsAPI.get(Number(id)).then((res) => res.data)
  );

  const { data: documents } = useQuery(['documents', id], () =>
    documentsAPI.list(Number(id)).then((res) => res.data)
  );

  const uploadedDocTypes = new Set(
    documents?.results?.map((doc: any) => doc.document_type) || []
  );
  const missingRequiredDocs = requiredDocuments.filter((type) => !uploadedDocTypes.has(type));

  const uploadMutation = useMutation((formData: FormData) => documentsAPI.upload(formData), {
    onSuccess: () => {
      toast.success('Document uploaded');
      queryClient.invalidateQueries(['documents', id]);
      setDocTitle('');
      setDocFile(null);
    },
    onError: (error: any) => {
      const data = error.response?.data;
      const message =
        data?.error ||
        data?.detail ||
        data?.file?.[0] ||
        data?.non_field_errors?.[0] ||
        'Upload failed';
      toast.error(message);
    },
  });

  const deleteMutation = useMutation((docId: number) => documentsAPI.delete(docId), {
    onSuccess: () => {
      toast.success('Document deleted');
      queryClient.invalidateQueries(['documents', id]);
    },
  });

  const submitMutation = useMutation((appId: number) => applicationsAPI.submit(appId), {
    onSuccess: () => {
      toast.success('Application submitted');
      queryClient.invalidateQueries(['application', id]);
    },
    onError: (error: any) => toast.error(error.response?.data?.error || 'Submit failed'),
  });

  const handleUpload = () => {
    if (!docFile) {
      toast.error('Select a file');
      return;
    }
    const formData = new FormData();
    formData.append('application', String(id));
    formData.append('document_type', docType);
    formData.append('title', docTitle || docType);
    formData.append('description', '');
    formData.append('file', docFile);
    uploadMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Application Details</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{application?.program_name}</p>
        </div>
        <button
          onClick={() => submitMutation.mutate(Number(id))}
          disabled={missingRequiredDocs.length > 0}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Submit Application
        </button>
      </div>

      {missingRequiredDocs.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-200">
          Upload required documents before submitting: {missingRequiredDocs.join(', ')}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <select
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
          >
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace('_', ' ')}
              </option>
            ))}
          </select>
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            placeholder="Title"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
          />
          <input
            type="file"
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setDocFile(e.target.files?.[0] || null)}
          />
        </div>
        <button
          onClick={handleUpload}
          className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Upload
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Documents</h2>
        <div className="space-y-3 mt-4">
          {documents?.results?.map((doc: any) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{doc.document_type_display}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                  {doc.status_display}
                </span>
                {doc.file_url && (
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Download
                  </a>
                )}
                <button
                  onClick={() => deleteMutation.mutate(doc.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
