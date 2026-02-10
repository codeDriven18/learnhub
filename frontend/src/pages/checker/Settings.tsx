export default function CheckerSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviewer Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">Availability</span>
          <button className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">Available</button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
          <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-medium">Enabled</button>
        </div>
      </div>
    </div>
  );
}
