import React from 'react';
import SurfStretchOverlay from './SurfStretchOverlay';
import SurfStretchHistory from './SurfStretchHistory';

function getTodayKey() { const d = new Date(); d.setHours(0,0,0,0); return d.toISOString().slice(0,10); }
function loadHistory() { try { return JSON.parse(localStorage.getItem('surfStretchHistory.v1') || '[]'); } catch { return []; } }
function saveHistory(list) { try { localStorage.setItem('surfStretchHistory.v1', JSON.stringify(list)); } catch {} }

export default function SurfStretchStarter() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [completed, setCompleted] = React.useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('surfStretchDone.v1') || '{}');
      return saved?.date === getTodayKey() && !!saved?.completed;
    } catch { return false; }
  });
  const [history, setHistory] = React.useState(() => loadHistory());

  React.useEffect(() => {
    try {
      localStorage.setItem('surfStretchDone.v1', JSON.stringify({ date: getTodayKey(), completed }));
    } catch {}
    // update history toggle for today
    const key = getTodayKey();
    setHistory(prev => {
      const set = new Set(Array.isArray(prev) ? prev : []);
      if (completed) set.add(key); else set.delete(key);
      const arr = Array.from(set).sort();
      saveHistory(arr);
      return arr;
    });
  }, [completed]);

  return (
    <div className="mb-5 rounded-xl border border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0 flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <span className="text-sm font-semibold shrink-0">🏄‍♂️ Surf Stretch</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white shrink-0">5m</span>
          <span className="text-xs text-blue-900/80 dark:text-blue-200/80 truncate whitespace-nowrap">
            — Decompress spine, open hips and shoulders.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <label className="flex items-center gap-1 text-xs text-blue-900 dark:text-blue-200">
            <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} className="w-4 h-4" />
            Completed
          </label>
          <button onClick={() => setIsOpen(true)} className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow">Start</button>
        </div>
      </div>
      <div className="px-4 pb-3">
        <SurfStretchHistory />
      </div>
      <SurfStretchOverlay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onFinish={() => {
          setCompleted(true);
          // push today to history explicitly (in case checkbox effect races)
          const key = getTodayKey();
          setHistory(prev => {
            const set = new Set(Array.isArray(prev) ? prev : []);
            set.add(key);
            const arr = Array.from(set).sort();
            saveHistory(arr);
            return arr;
          });
          setIsOpen(false);
        }}
      />
    </div>
  );
}


