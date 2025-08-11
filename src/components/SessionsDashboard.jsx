import React, { useMemo } from 'react';

export default function SessionsDashboard({ sessions = [] }) {
  const grouped = useMemo(() => groupByHook(sessions), [sessions]);
  const totalMin = sessions.reduce((acc, s) => acc + (s.minutes || 0), 0);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Time by hook (today + historical)</h3>
        <HookBars grouped={grouped} />
        <div className="text-sm text-gray-700 mt-2">Total: {totalMin}m</div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Sessions by hook</h3>
        {grouped.order.length === 0 ? (
          <div className="text-sm text-gray-600">No sessions yet.</div>
        ) : (
          grouped.order.map((hookKey) => (
            <div key={hookKey} className="mb-4">
              <div className="font-medium text-gray-900 mb-1">{grouped.labels[hookKey]}</div>
              <div className="space-y-1">
                {grouped.byHook[hookKey].map(s => (
                  <div key={s.id} className="text-sm text-gray-800 flex items-center justify-between">
                    <span>{formatDateTime(s.startedAt)} • {s.questTitle || '—'}</span>
                    <span className="text-gray-600">{s.minutes || 0}m{s.enjoyment!=null?` • Enjoy ${s.enjoyment}/5`:''}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function HookBars({ grouped }) {
  const max = Math.max(1, ...grouped.order.map(k => grouped.totals[k] || 0));
  return (
    <div className="space-y-2">
      {grouped.order.map(k => (
        <div key={k} className="flex items-center gap-2">
          <div className="w-40 text-sm text-gray-700 truncate">{grouped.labels[k]}</div>
          <div className="flex-1 bg-emerald-100 h-3 rounded">
            <div className="h-3 bg-emerald-600 rounded" style={{ width: `${Math.round(((grouped.totals[k]||0)/max)*100)}%` }} />
          </div>
          <div className="w-16 text-right text-sm text-gray-700">{grouped.totals[k]||0}m</div>
        </div>
      ))}
    </div>
  );
}

function groupByHook(sessions) {
  const byHook = {};
  const labels = {};
  const totals = {};
  sessions.forEach(s => {
    const k = s.hookId || s.hookLabel || '—';
    byHook[k] = byHook[k] || [];
    byHook[k].push(s);
    labels[k] = s.hookLabel || '—';
    totals[k] = (totals[k] || 0) + (s.minutes || 0);
  });
  const order = Object.keys(byHook).sort((a, b) => (totals[b]||0) - (totals[a]||0));
  return { byHook, labels, totals, order };
}

function formatDateTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch {
    return String(ts);
  }
}


