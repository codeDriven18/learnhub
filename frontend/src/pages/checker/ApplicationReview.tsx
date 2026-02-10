import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { applicationsAPI, documentsAPI, reviewsAPI } from '@/api/client';

const decisions = ['PASS', 'REJECT', 'REQUEST_CLARIFICATION', 'FORWARD_TO_QS'];

export default function CheckerApplicationReview() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [reviewData, setReviewData] = useState<any>({ decision: 'PASS' });

  const { data: application } = useQuery(['checker-application', id], () =>
    applicationsAPI.get(Number(id)).then((res) => res.data)
  );

  const { data: documents } = useQuery(['checker-documents', id], () =>
    documentsAPI.list(Number(id)).then((res) => res.data)
  );

  const { data: reviews } = useQuery(['reviews', id], () =>
    reviewsAPI.list(Number(id)).then((res) => res.data)
  );

  const review = reviews?.results?.[0];

  const saveReviewMutation = useMutation(
    (payload: any) => (review ? reviewsAPI.update(review.id, payload) : reviewsAPI.create(payload)),
    {
      onSuccess: () => {
        toast.success('Review saved');
        queryClient.invalidateQueries(['reviews', id]);
      },
    }
  );

  const submitMutation = useMutation(
    () => reviewsAPI.submit(review.id),
    {
      onSuccess: () => {
        toast.success('Review submitted');
        queryClient.invalidateQueries(['reviews', id]);
        queryClient.invalidateQueries(['checker-application', id]);
      },
    }
  );

  const verifyDocMutation = useMutation(
    ({ docId, status }: { docId: number; status: string }) => documentsAPI.verify(docId, status),
    {
      onSuccess: () => {
        toast.success('Document updated');
        queryClient.invalidateQueries(['checker-documents', id]);
      },
    }
  );

  const handleSave = () => {
    saveReviewMutation.mutate({ application: Number(id), ...reviewData });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review Application</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{application?.program_name}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents</h2>
        <div className="space-y-3">
          {documents?.results?.map((doc: any) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{doc.document_type_display}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => verifyDocMutation.mutate({ docId: doc.id, status: 'VERIFIED' })}
                  className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg"
                >
                  Verify
                </button>
                <button
                  onClick={() => verifyDocMutation.mutate({ docId: doc.id, status: 'REJECTED' })}
                  className="text-xs bg-red-600 text-white px-3 py-1 rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Review Form</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['overall_score', 'academic_score', 'essay_score', 'recommendation_score', 'extracurricular_score'].map(
            (field) => (
              <input
                key={field}
                className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
                placeholder={field.replace('_', ' ')}
                defaultValue={review?.[field]}
                onChange={(e) => setReviewData({ ...reviewData, [field]: Number(e.target.value) })}
              />
            )
          )}
        </div>
        <textarea
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
          rows={3}
          placeholder="Internal notes"
          defaultValue={review?.internal_notes}
          onChange={(e) => setReviewData({ ...reviewData, internal_notes: e.target.value })}
        />
        <textarea
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
          rows={3}
          placeholder="Feedback to student"
          defaultValue={review?.feedback_to_student}
          onChange={(e) => setReviewData({ ...reviewData, feedback_to_student: e.target.value })}
        />
        <select
          className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
          defaultValue={review?.decision || 'PASS'}
          onChange={(e) => setReviewData({ ...reviewData, decision: e.target.value })}
        >
          {decisions.map((decision) => (
            <option key={decision} value={decision}>
              {decision.replace('_', ' ')}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Save Review
          </button>
          {review && (
            <button
              onClick={() => submitMutation.mutate()}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Submit Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
