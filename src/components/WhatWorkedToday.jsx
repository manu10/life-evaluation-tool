import React from 'react';

function isToday(ts) {
  const d = new Date(ts);
  const t = new Date();
  return d.toDateString() === t.toDateString();
}

export default function WhatWorkedToday({ microLogs = [] }) {
  const todayLogs = (microLogs || []).filter(l => l && isToday(l.ts));
  if (todayLogs.length === 0) return null;

  const counts = countBy(todayLogs, 'type');
  const replacementLogs = todayLogs.filter(l => l.type === 'replacement');
  const helpedCount = replacementLogs.filter(l => l.helped === true).length;
  const replacedCount = replacementLogs.length;
  const helpedRate = replacedCount > 0 ? Math.round((helpedCount / replacedCount) * 100) : 0;

  // Top helpful action
  const actionHelpCounts = {};
  replacementLogs.forEach(l => {
    if (!l.actionTitle) return;
    const key = l.actionTitle;
    actionHelpCounts[key] = actionHelpCounts[key] || { helped: 0, total: 0 };
    actionHelpCounts[key].total += 1;
    if (l.helped) actionHelpCounts[key].helped += 1;
  });
  const topAction = Object.entries(actionHelpCounts)
    .map(([title, stats]) => ({ title, ...stats, rate: stats.total > 0 ? stats.helped / stats.total : 0 }))
    .sort((a, b) => b.rate - a.rate || b.helped - a.helped)[0];

  return (
    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-green-900">What worked today</h3>
      </div>
      <div className="text-sm text-green-900 grid grid-cols-1 md:grid-cols-3 gap-3">
        <Metric label="Breaths" value={counts.breaths || 0} />
        <Metric label="Posture" value={counts.posture || 0} />
        <Metric label="Anchors" value={counts.anchor || 0} />
        <Metric label="Pauses" value={counts.pause || 0} />
        <Metric label="Replacements (helped)" value={`${helpedCount}/${replacedCount}`} />
        <Metric label="Helped rate" value={`${helpedRate}%`} />
      </div>
      {topAction && (
        <div className="mt-3 text-sm text-green-900">
          Top action: <span className="font-semibold">{topAction.title}</span> ({topAction.helped}/{topAction.total} helped)
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="p-2 bg-white rounded-md border border-green-200">
      <div className="text-xs text-green-700 mb-1">{label}</div>
      <div className="text-base font-semibold text-green-900">{value}</div>
    </div>
  );
}

function countBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key];
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}


