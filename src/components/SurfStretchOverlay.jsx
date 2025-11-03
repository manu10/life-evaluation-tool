import React from 'react';
import Modal from './ui/Modal';
import SurfExerciseLibraryModal from './SurfExerciseLibraryModal';
import SurfRoutinePickerModal from './SurfRoutinePickerModal';
import { LIBRARY, DEFAULT_ROUTINE_KEYS } from './surfLibrary';
import { primeAlarmAudio, playChime } from '../utils/alarmAudio';

// Routine persistence helpers
function getDateKey() { const d = new Date(); d.setHours(0,0,0,0); return d.toISOString().slice(0,10); }
function loadRoutine(dateKey) { try { return JSON.parse(localStorage.getItem(`surfRoutine.v1:${dateKey}`) || 'null'); } catch { return null; } }
function saveRoutine(dateKey, keys) { try { localStorage.setItem(`surfRoutine.v1:${dateKey}`, JSON.stringify(keys)); } catch {} }
function mapKeys(keys) { return keys.map(k => LIBRARY.find(e => e.key === k)).filter(Boolean); }

export default function SurfStretchOverlay({ isOpen, onClose, onFinish }) {
  const [running, setRunning] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const [routineKeys, setRoutineKeys] = React.useState(() => loadRoutine(getDateKey()) || DEFAULT_ROUTINE_KEYS);
  const STEPS = React.useMemo(() => mapKeys(routineKeys), [routineKeys]);
  const [remaining, setRemaining] = React.useState(() => (STEPS[0]?.seconds || 60));
  const [usePhotos, setUsePhotos] = React.useState(() => {
    try {
      if (localStorage.getItem('surfStretch.usePhotos') != null) return JSON.parse(localStorage.getItem('surfStretch.usePhotos'));
    } catch {}
    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    return isIOS;
  });
  const [keepAwake, setKeepAwake] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('surfStretch.keepAwake') || 'true'); } catch { return true; }
  });
  const wakeRef = React.useRef(null);
  const midFiredRef = React.useRef(false);
  const [showLibrary, setShowLibrary] = React.useState(false);
  const [showPicker, setShowPicker] = React.useState(false);

  const totalSec = React.useMemo(() => STEPS.reduce((a, s) => a + s.seconds, 0), [STEPS]);
  const doneSec = React.useMemo(() => STEPS.slice(0, idx).reduce((a, s) => a + s.seconds, 0) + (STEPS[idx] ? (STEPS[idx].seconds - remaining) : 0), [idx, remaining, STEPS]);
  const progressPct = Math.min(100, Math.round((doneSec / totalSec) * 100));
  const step = STEPS[idx] || STEPS[STEPS.length - 1];

  React.useEffect(() => {
    if (!isOpen) return;
    try { primeAlarmAudio(); } catch {}
  }, [isOpen]);

  React.useEffect(() => {
    try { localStorage.setItem('surfStretch.usePhotos', JSON.stringify(!!usePhotos)); } catch {}
  }, [usePhotos]);

  // Persist keepAwake toggle
  React.useEffect(() => {
    try { localStorage.setItem('surfStretch.keepAwake', JSON.stringify(!!keepAwake)); } catch {}
  }, [keepAwake]);

  // Keep screen awake where supported; re-acquire on visibility
  React.useEffect(() => {
    async function acquire() {
      try {
        if (!isOpen || !keepAwake) return;
        if ('wakeLock' in navigator && !wakeRef.current) {
          wakeRef.current = await navigator.wakeLock.request('screen');
          wakeRef.current.addEventListener('release', () => {});
        }
      } catch {}
    }
    acquire();
    function onVis() { if (document.visibilityState === 'visible') acquire(); }
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      try { if (wakeRef.current) { wakeRef.current.release(); wakeRef.current = null; } } catch {}
    };
  }, [isOpen, keepAwake]);

  React.useEffect(() => {
    if (!running || !isOpen) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        const current = STEPS[idx];
        // Mid-step side change chime for split steps
        if (current?.splitMid && !midFiredRef.current && r === Math.ceil(current.seconds / 2)) {
          try { playChime('beep', 200); } catch {}
          midFiredRef.current = true;
        }
        if (r > 1) return r - 1;
        // Double chime on step transition or triple on finish
        setIdx((i) => {
          const next = i + 1;
          if (next >= STEPS.length) {
            setRunning(false);
            try {
              playChime('chime', 200);
              setTimeout(() => playChime('chime', 200), 250);
              setTimeout(() => playChime('chime', 200), 500);
            } catch {}
            if (typeof onFinish === 'function') onFinish();
            return i;
          }
          try {
            playChime('bell', 200);
            setTimeout(() => playChime('bell', 200), 180);
          } catch {}
          setRemaining(STEPS[next].seconds);
          midFiredRef.current = false;
          return next;
        });
        return 0;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, isOpen, STEPS, idx]);

  function handleStart() { setRunning(true); }
  function handlePause() { setRunning(false); }
  function handleEnd() {
    setRunning(false);
    if (typeof onClose === 'function') onClose();
  }
  function handleBack() {
    setRunning(false);
    setIdx((i) => {
      const prev = Math.max(0, i - 1);
      setRemaining(STEPS[prev]?.seconds || 60);
      return prev;
    });
  }
  function handleNext() {
    setRunning(false);
    setIdx((i) => {
      const next = Math.min(STEPS.length - 1, i + 1);
      setRemaining(STEPS[next]?.seconds || 60);
      return next;
    });
  }

  function saveToday(keys) {
    const dateKey = getDateKey();
    saveRoutine(dateKey, keys);
    setRoutineKeys(keys);
    setRunning(false);
    setIdx(0);
    const steps = mapKeys(keys);
    setRemaining(steps[0]?.seconds || 60);
  }
  function shuffleAll() {
    const pool = [...LIBRARY];
    const picks = [];
    while (picks.length < 5 && pool.length) {
      const i = Math.floor(Math.random() * pool.length);
      const [ex] = pool.splice(i, 1);
      picks.push(ex.key);
    }
    saveToday(picks);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} containerClassName="w-full max-w-2xl p-5">
      <div className="text-gray-900 dark:text-gray-100">
        <div className="h-1.5 w-full bg-blue-100 dark:bg-blue-900/40 rounded overflow-hidden">
          <div className="h-full bg-blue-500 dark:bg-blue-400" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-base font-semibold flex items-center gap-2">
            <span>🏄‍♂️ Surf Stretch</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white">5m</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowLibrary(true)} className="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-700">Library</button>
            <button onClick={shuffleAll} className="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-700">Shuffle all</button>
            <button onClick={() => setShowPicker(true)} className="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-700">Customize</button>
            {!running ? (
              <button onClick={handleStart} className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700">Start</button>
            ) : (
              <button onClick={handlePause} className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700">Pause</button>
            )}
            <button onClick={handleEnd} className="px-3 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-700">End</button>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-sm font-medium mb-2">Now: {step.label}</div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
            <img
              src={usePhotos && step.photo ? step.photo : step.img}
              alt={step.label}
              className="w-full max-w-md md:max-w-lg rounded-md border border-gray-200 dark:border-gray-700"
              onError={(e) => { try { e.currentTarget.src = step.img; } catch {} }}
            />
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-3 space-y-1">
            <div><span className="font-semibold text-gray-700 dark:text-gray-300">Duration:</span> {step.seconds}s{step.splitMid ? ' (split evenly left/right)' : ''}</div>
            {step.why && <div><span className="font-semibold text-gray-700 dark:text-gray-300">Why:</span> {step.why}</div>}
            <div><span className="font-semibold text-gray-700 dark:text-gray-300">How:</span> {step.how}</div>
            {step.url && (
              <>
                {' '}
                <a
                  href={step.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-blue-700 dark:text-blue-300 hover:opacity-90"
                >
                  Learn more
                </a>
              </>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <span key={s.key} className={`h-2.5 w-2.5 rounded-full ${i < idx ? 'bg-blue-500' : i === idx ? 'bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleBack} className="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-700">Back</button>
            <button onClick={handleNext} className="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-700">Next</button>
          </div>
        </div>
      </div>
      <SurfExerciseLibraryModal isOpen={showLibrary} onClose={() => setShowLibrary(false)} />
      <SurfRoutinePickerModal
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        initialKeys={routineKeys}
        onSave={(keys) => saveToday(keys)}
      />
    </Modal>
  );
}


