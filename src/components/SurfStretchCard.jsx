import React from 'react';

const STEPS = [
  { key: 'childs', label: "Child's Pose with Side Reach", seconds: 60, img: '/src/assets/stretch/childs-pose.svg' },
  { key: 'catcow', label: 'Cat–Cow', seconds: 60, img: '/src/assets/stretch/cat-cow.svg' },
  { key: 'twist', label: 'Supine Spinal Twist (each side ~45s)', seconds: 90, img: '/src/assets/stretch/supine-twist.svg' },
  { key: 'bridge', label: 'Glute Bridge', seconds: 60, img: '/src/assets/stretch/glute-bridge.svg' },
  { key: 'squat', label: 'Deep Squat (Malasana)', seconds: 90, img: '/src/assets/stretch/deep-squat.svg' },
];

function fmt(sec) { const m = Math.floor(sec/60); const s = sec%60; return `${m}:${String(s).padStart(2,'0')}`; }

export default function SurfStretchCard() {
  const [isRunning, setIsRunning] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(300);
  const [expanded, setExpanded] = React.useState(null);
  const [doneMap, setDoneMap] = React.useState(() => {
    try {
      const today = new Date(); today.setHours(0,0,0,0);
      const key = today.toISOString().slice(0,10);
      const saved = JSON.parse(localStorage.getItem('surfStretch.v1') || '{}');
      if (saved.date === key && Array.isArray(saved.done)) return saved.done;
      return Array(STEPS.length).fill(false);
    } catch { return Array(STEPS.length).fill(false); }
  });

  React.useEffect(() => {
    try {
      const today = new Date(); today.setHours(0,0,0,0);
      const key = today.toISOString().slice(0,10);
      localStorage.setItem('surfStretch.v1', JSON.stringify({ date: key, done: doneMap }));
    } catch {}
  }, [doneMap]);

  React.useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t-1)), 1000);
    return () => clearInterval(id);
  }, [isRunning, timeLeft]);

  function start() { setIsRunning(true); if (timeLeft === 0) setTimeLeft(300); }
  function reset() { setIsRunning(false); setTimeLeft(300); }

  return (
    <div className="mb-6 p-4 rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold text-blue-900 dark:text-blue-200">🏄‍♂️ Surf Stretch (5 min)</div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-900 dark:text-blue-200 font-mono">{fmt(timeLeft)}</span>
          {!isRunning ? (
            <button onClick={start} className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700">Start</button>
          ) : (
            <button onClick={() => setIsRunning(false)} className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700">Pause</button>
          )}
          <button onClick={reset} className="px-3 py-1.5 text-xs rounded-md border border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/30">Reset</button>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {STEPS.map((step, idx) => (
          <div key={step.key} className="flex items-center gap-3 p-2 rounded-md bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-800">
            <input
              type="checkbox"
              checked={!!doneMap[idx]}
              onChange={() => setDoneMap(prev => { const n = prev.slice(); n[idx] = !n[idx]; return n; })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <img
              src={step.img}
              alt={step.label}
              className="w-12 h-9 rounded-md border border-gray-200 dark:border-gray-700 object-contain cursor-pointer"
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-900 dark:text-gray-100 truncate">{step.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{Math.round(step.seconds/60)}:{String(step.seconds%60).padStart(2,'0')} min</div>
            </div>
            {expanded === idx && (
              <div className="w-full mt-2">
                <img src={step.img} alt={step.label} className="w-full max-w-xs rounded-md border border-gray-200 dark:border-gray-700" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


