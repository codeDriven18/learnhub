import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { messagingAPI } from '@/api/client';

export default function StudentMessages() {
  const queryClient = useQueryClient();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const { data: messages } = useQuery('messages', () => messagingAPI.list().then((res) => res.data));

  const sendMutation = useMutation((data: any) => messagingAPI.create(data), {
    onSuccess: () => {
      toast.success('Message sent');
      queryClient.invalidateQueries('messages');
      setRecipientEmail('');
      setSubject('');
      setBody('');
    },
    onError: (error: any) => toast.error(error.response?.data?.detail || 'Send failed'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Inbox</h2>
          <div className="space-y-3">
            {messages?.results?.map((msg: any) => (
              <div key={msg.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{msg.subject}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">From {msg.sender_email}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Compose</h2>
          <input
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white"
            placeholder="Recipient Email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <textarea
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white"
            rows={3}
            placeholder="Type your message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              onClick={() => sendMutation.mutate({ recipient_lookup: recipientEmail, subject, body })}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
