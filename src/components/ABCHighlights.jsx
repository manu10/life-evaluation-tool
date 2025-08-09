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
    <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800">ABC Highlights (today)</h3>
        {typeof onAddABC === 'function' && (
          <button
            onClick={onAddABC}
            className="text-xs px-2 py-1 rounded-md border border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            + Add ABC
          </button>
        )}
      </div>
      {recent.length === 0 ? (
        <p className="text-sm text-gray-600">No ABC entries yet today.</p>
      ) : (
        <ul className="space-y-2">
          {recent.map((log) => {
            const when = new Date(log.ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            return (
              <li key={log.id} className="p-3 rounded-md bg-gray-50 border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">{when} • {log.setting || '—'}</div>
                <div className="text-sm text-gray-800">
                  <span className="font-medium">A:</span> {truncate(log.antecedent)}
                </div>
                <div className="text-sm text-gray-800">
                  <span className="font-medium">B:</span> {truncate(log.behavior)}
                </div>
                {(log.consequence || log.effect) && (
                  <div className="text-xs text-gray-700 mt-1">
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


