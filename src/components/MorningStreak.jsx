import React from 'react';

export default function MorningStreak({ checkins = [] }) {
  const todayKey = getDateKey(new Date());
  const sorted = [...checkins].sort();
  const stats = computeStats(sorted);

  const todayDone = checkins.includes(todayKey);

  // Build last 30-day view, oldest -> newest (left to right)
  const last30 = buildLastNDays(30).map((key, idx, arr) => {
    const checked = sorted.includes(key);
    const isToday = idx === arr.length - 1;
    return {
      key,
      checked,
      inCurrentStreak: false,
      isToday,
      title: `${key} • ${checked ? 'checked' : 'missed'}${isToday ? ' • today' : ''}`
    };
  });
  // Mark current streak segment on right edge
  for (let i = last30.length - 1, run = 0; i >= 0; i--) {
    if (last30[i].checked) { last30[i].inCurrentStreak = true; run += 1; }
    else break;
  }

  return (
    <div className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <div className="text-sm text-emerald-800 dark:text-emerald-200 font-semibold">Morning streak</div>
            <div className="text-xs text-emerald-700 dark:text-emerald-300">
              {todayDone ? 'Today checked in' : 'Make a quick check-in to keep it going'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Stat label="Current" value={`${stats.current}d`} />
          <Stat label="Best" value={`${stats.best}d`} />
          <Stat label="7d" value={`${stats.last7}✔︎`} />
        </div>
      </div>
      {/* Last 30 days mini-grid */}
      <div className="mt-3">
        <div className="text-[10px] text-emerald-700 dark:text-emerald-300 mb-1">Last 30 days</div>
        <div className="flex flex-wrap gap-1">
          {last30.map((d) => {
            const base = d.checked
              ? 'bg-emerald-600'
              : 'bg-gray-300 dark:bg-gray-700';
            const ring = d.inCurrentStreak ? 'ring-2 ring-amber-400' : '';
            const todayMark = d.isToday ? 'outline outline-1 outline-offset-1 outline-emerald-800 dark:outline-emerald-300' : '';
            return (
              <div key={d.key} className={`w-3 h-3 rounded-sm ${base} ${ring} ${todayMark}`} title={d.title} aria-label={d.title} />
            );
          })}
        </div>
        <div className="mt-2 flex items-center gap-3 text-[10px] text-emerald-700 dark:text-emerald-300">
          <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-emerald-600" /> Checked</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-gray-300 dark:bg-gray-700" /> Missed</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-emerald-600 ring-2 ring-amber-400" /> Current streak</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-emerald-600 outline outline-1 outline-offset-1 outline-emerald-800 dark:outline-emerald-300" /> Today</span>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-right">
      <div className="text-xs text-emerald-700 dark:text-emerald-300">{label}</div>
      <div className="text-base font-semibold text-emerald-900 dark:text-emerald-100">{value}</div>
    </div>
  );
}

function getDateKey(d) {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt.toISOString().slice(0, 10);
}

function computeStats(sortedKeys) {
  // sorted yyyy-mm-dd ascending
  const today = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

  // Current streak: back from today
  let current = 0;
  let cursor = new Date(today);
  while (sortedKeys.includes(getDateKey(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // Best streak
  let best = 0;
  let run = 0;
  for (let i = 0; i < sortedKeys.length; i++) {
    run = 1;
    let d = new Date(sortedKeys[i]);
    while (i + 1 < sortedKeys.length) {
      const next = new Date(sortedKeys[i + 1]);
      const diffDays = Math.round((next - d) / 86400000);
      if (diffDays === 1) {
        run += 1; i += 1; d = next;
      } else if (diffDays === 0) {
        // duplicate safeguard
        i += 1; d = next;
      } else {
        break;
      }
    }
    if (run > best) best = run;
  }

  // Last 7 days checked count
  let last7 = 0;
  for (let i = 0; i < 7; i++) {
    const key = getDateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - i));
    if (sortedKeys.includes(key)) last7 += 1;
  }
  return { current, best, last7 };
}

function buildLastNDays(n) {
  const out = [];
  const today = new Date(); today.setHours(0,0,0,0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    out.push(getDateKey(d));
  }
  return out;
}


