import { useState } from 'react';
import { useQuery } from 'react-query';
import { countriesAPI, qsAPI } from '@/api/client';

export default function Rankings() {
  const [year, setYear] = useState(2026);
  const [countryId, setCountryId] = useState<number | undefined>(undefined);

  const { data: countries } = useQuery('countries', () =>
    countriesAPI.list().then((res) => res.data)
  );
  const { data: rankings } = useQuery(['qs', year, countryId], () =>
    qsAPI.list(year, countryId).then((res) => res.data)
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">QS Rankings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <select
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[2026, 2025, 2024].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
            value={countryId ?? ''}
            onChange={(e) => setCountryId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">All Countries</option>
            {countries?.results?.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {rankings?.results?.map((uni: any) => (
            <div key={uni.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  #{uni.rank_global} {uni.university_name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{uni.country_name}</p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Score {uni.score_overall ?? 'N/A'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
