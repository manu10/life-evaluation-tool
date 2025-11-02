import React from 'react';

function getDateKey(d) { const x = new Date(d); x.setHours(0,0,0,0); return x.toISOString().slice(0,10); }
function loadHistory() { try { return JSON.parse(localStorage.getItem('surfStretchHistory.v1') || '[]'); } catch { return []; } }

export default function SurfStretchHistory() {
  const [history, setHistory] = React.useState(() => loadHistory());

  React.useEffect(() => {
    const onStorage = (e) => { if (e.key === 'surfStretchHistory.v1') setHistory(loadHistory()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const doneSet = React.useMemo(() => new Set(Array.isArray(history) ? history : []), [history]);
  const days = React.useMemo(() => {
    const arr = [];
    const today = new Date(); today.setHours(0,0,0,0);
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      const key = getDateKey(d);
      arr.push({ key, label: d.getDate(), done: doneSet.has(key) });
    }
    return arr;
  }, [doneSet]);

  const palette = ['bg-emerald-500','bg-blue-500','bg-amber-500','bg-fuchsia-500','bg-purple-500'];

  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <span className="text-xs text-blue-900/80 dark:text-blue-200/80 shrink-0">Last 30 days</span>
      <div className="flex flex-nowrap gap-1 overflow-hidden">
        {days.map((d, idx) => (
          <div
            key={d.key}
            title={`${d.key}${d.done ? ' — done' : ''}`}
            className={`h-2.5 w-2.5 rounded-[3px] ${d.done ? palette[idx % palette.length] : 'bg-gray-300 dark:bg-gray-600'} border border-white/20 flex-none`}
          />
        ))}
      </div>
    </div>
  );
}


