import React from 'react';
import { primeAlarmAudio, playChime } from '../utils/alarmAudio';

const STEPS = [
  { key: 'childs', label: "Child's Pose with Side Reach", seconds: 60, img: '/src/assets/stretch/childs-pose.svg' },
  { key: 'catcow', label: 'Cat–Cow', seconds: 60, img: '/src/assets/stretch/cat-cow.svg' },
  { key: 'twist', label: 'Supine Spinal Twist', seconds: 90, img: '/src/assets/stretch/supine-twist.svg' },
  { key: 'bridge', label: 'Glute Bridge', seconds: 60, img: '/src/assets/stretch/glute-bridge.svg' },
  { key: 'squat', label: 'Deep Squat (Malasana)', seconds: 90, img: '/src/assets/stretch/deep-squat.svg' },
];

export default function SurfStretchPlayer() {
  const [running, setRunning] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const [remaining, setRemaining] = React.useState(STEPS[0].seconds);
  const [expanded, setExpanded] = React.useState(null);
  const totalSec = React.useMemo(() => STEPS.reduce((a, s) => a + s.seconds, 0), []);
  const doneSec = React.useMemo(() => STEPS.slice(0, idx).reduce((a, s) => a + s.seconds, 0) + (STEPS[idx] ? (STEPS[idx].seconds - remaining) : 0), [idx, remaining]);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r > 1) return r - 1;
        // step complete: chime, advance or finish
        try { playChime('bell', 220); } catch {}
        setIdx((i) => {
          const next = i + 1;
          if (next >= STEPS.length) {
            setRunning(false);
            return i; // stay at last
          }
          setRemaining(STEPS[next].seconds);
          return next;
        });
        return 0;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  function start() {
    try { primeAlarmAudio(); } catch {}
    // if finished, restart
    if (idx >= STEPS.length - 1 && remaining === 0) {
      setIdx(0);
      setRemaining(STEPS[0].seconds);
    }
    setRunning(true);
  }
  function pause() { setRunning(false); }
  function end() { setRunning(false); setIdx(0); setRemaining(STEPS[0].seconds); }

  const step = STEPS[idx] || STEPS[STEPS.length - 1];
  const progressPct = Math.min(100, Math.round((doneSec / totalSec) * 100));

  return (
    <div className="mb-6 p-3 rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-blue-900 dark:text-blue-200">🏄‍♂️ Surf Stretch (5m)</div>
        <div className="flex items-center gap-2">
          {!running ? (
            <button onClick={start} className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700">Start</button>
          ) : (
            <button onClick={pause} className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700">Pause</button>
          )}
          <button onClick={end} className="px-3 py-1.5 text-xs rounded-md border border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/30">End</button>
        </div>
      </div>
      <div className="mt-2 h-1.5 w-full bg-blue-100 dark:bg-blue-900/40 rounded">
        <div className="h-1.5 bg-blue-500 dark:bg-blue-400 rounded" style={{ width: `${progressPct}%` }} />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <img
          src={step.img}
          alt={step.label}
          className="w-12 h-9 rounded-md border border-gray-200 dark:border-gray-700 object-contain cursor-pointer"
          onClick={() => setExpanded(expanded === idx ? null : idx)}
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-900 dark:text-gray-100 truncate">Now: {step.label}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Auto‑advance with a soft chime — no need to watch the screen</div>
        </div>
      </div>
      {expanded === idx && (
        <div className="mt-2">
          <img src={step.img} alt={step.label} className="w-full max-w-xs rounded-md border border-gray-200 dark:border-gray-700" />
        </div>
      )}
    </div>
  );
}


