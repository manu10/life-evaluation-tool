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
    <div className="mb-4 p-3 rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-between">
      <div className="mr-3">
        <div className="text-sm font-semibold text-blue-900 dark:text-blue-200">🏄‍♂️ Surf Stretch (5m)</div>
        <div className="text-xs text-blue-900/80 dark:text-blue-200/80">Decompress spine, open hips and shoulders.</div>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1 text-xs text-blue-900 dark:text-blue-200">
          <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} className="w-4 h-4" />
          Completed today
        </label>
        <button onClick={() => setIsOpen(true)} className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700">Start</button>
      </div>
      <div className="w-full mt-2">
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


