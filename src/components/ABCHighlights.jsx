import React from 'react';

export default function ABCHighlights({ logs = [], onAddABC }) {
  const today = new Date();
  const isSameDay = (ts) => {
    const d = new Date(ts);
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  };
  const todays = (logs || []).filter((l) => l && l.ts && isSameDay(l.ts));
  const recent = todays.slice(0, 5);

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">ABC Highlights (today)</h3>
        {typeof onAddABC === 'function' && (
          <button
            onClick={onAddABC}
            className="text-xs px-2 py-1 rounded-md border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            + Add ABC
          </button>
        )}
      </div>
      {recent.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">No ABC entries yet today.</p>
      ) : (
        <ul className="space-y-2">
          {recent.map((log) => {
            const when = new Date(log.ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            return (
              <li key={log.id} className="p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{when} • {log.setting || '—'}</div>
                <div className="text-sm text-gray-800 dark:text-gray-100">
                  <span className="font-medium">A:</span> {truncate(log.antecedent)}
                </div>
                <div className="text-sm text-gray-800 dark:text-gray-100">
                  <span className="font-medium">B:</span> {truncate(log.behavior)}
                </div>
                {(log.consequence || log.effect) && (
                  <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                    <span className="font-medium">C/E:</span> {truncate([log.consequence, log.effect].filter(Boolean).join(' • '))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function truncate(str, max = 120) {
  if (!str) return '—';
  return str.length > max ? str.slice(0, max) + '…' : str;
}


