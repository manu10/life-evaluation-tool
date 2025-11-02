import React from 'react';
import Modal from './ui/Modal';
import { primeAlarmAudio, playChime } from '../utils/alarmAudio';

const STEPS = [
  {
    key: 'childs',
    label: "Child's Pose with Side Reach",
    seconds: 60,
    img: '/src/assets/stretch/childs-pose.svg',
    photo: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTp6hlyki5bJdnOs95Wo1zcw4wm1NhBTejJaVfAPHY_OjM5ZHpvLpDc6cLhLhvi',
    how: 'Walk hands to each side, breathe into the ribs.',
    url: 'https://www.yogajournal.com/poses/childs-pose/',
  },
  {
    key: 'catcow',
    label: 'Cat–Cow',
    seconds: 60,
    img: '/src/assets/stretch/cat-cow.svg',
    photo: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcSBg7YpSDeb9ERDKQXJ7nPXr7KX9GWKbSWGhDgKZ805yxSxQe6hdPXWSWIdYj7WlOgxYEHA6w2rPygoIQg1Kr6t8uT1nrzJoqu9w7SK73eDOl2GF3c',
    how: 'Inhale open chest, exhale round spine.',
    url: 'https://www.yogajournal.com/poses/cat-cow-pose/',
  },
  {
    key: 'twist',
    label: 'Supine Spinal Twist',
    seconds: 90,
    img: '/src/assets/stretch/supine-twist.svg',
    photo: 'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcSPb-oBpDPHky5GmPl2B8-mKsV_SQiUESO3ZGGy5st3C1A2VHiMkX4nlQgvMHM7_JTUpsEfV33NId7SENsGHcTfgJDr3XgauLGIyosKbEd0GDyJVW0',
    how: 'Knee across body, shoulders heavy, breathe deep.',
    url: 'https://www.yogajournal.com/poses/supine-spinal-twist/',
  },
  {
    key: 'bridge',
    label: 'Glute Bridge',
    seconds: 60,
    img: '/src/assets/stretch/glute-bridge.svg',
    photo: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcT2PWFUReg1pu7TvzFVZfBms71lgBTiOBURNi7nRzzQXJvE54i52_QzKt2IEKiSKr6oDFYTcwrUXVCVqWriPGULf6X2k4pbqplYFWDZxowhV_Sywq4',
    how: 'Squeeze glutes, lift, lower slow and controlled.',
    url: 'https://www.healthline.com/health/fitness-exercise/bridge-exercise',
  },
  {
    key: 'squat',
    label: 'Deep Squat (Malasana)',
    seconds: 90,
    img: '/src/assets/stretch/deep-squat.svg',
    photo: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRVD1LQsMFtTXwmDNWHMbQxW8z239oIzRA1MBt3_J92soAfygOcRdwaG3zcfzW4',
    how: 'Elbows press knees out, chest tall, breathe.',
    url: 'https://www.yogajournal.com/poses/garland-pose/',
  },
];

export default function SurfStretchOverlay({ isOpen, onClose, onFinish }) {
  const [running, setRunning] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const [remaining, setRemaining] = React.useState(STEPS[0].seconds);
  const [usePhotos, setUsePhotos] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('surfStretch.usePhotos') || 'false'); } catch { return false; }
  });

  const totalSec = React.useMemo(() => STEPS.reduce((a, s) => a + s.seconds, 0), []);
  const doneSec = React.useMemo(() => STEPS.slice(0, idx).reduce((a, s) => a + s.seconds, 0) + (STEPS[idx] ? (STEPS[idx].seconds - remaining) : 0), [idx, remaining]);
  const progressPct = Math.min(100, Math.round((doneSec / totalSec) * 100));
  const step = STEPS[idx] || STEPS[STEPS.length - 1];

  React.useEffect(() => {
    if (!isOpen) return;
    try { primeAlarmAudio(); } catch {}
  }, [isOpen]);

  React.useEffect(() => {
    try { localStorage.setItem('surfStretch.usePhotos', JSON.stringify(!!usePhotos)); } catch {}
  }, [usePhotos]);

  React.useEffect(() => {
    if (!running || !isOpen) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r > 1) return r - 1;
        try { playChime('bell', 220); } catch {}
        setIdx((i) => {
          const next = i + 1;
          if (next >= STEPS.length) {
            setRunning(false);
            try { playChime('chime', 260); } catch {}
            if (typeof onFinish === 'function') onFinish();
            return i;
          }
          setRemaining(STEPS[next].seconds);
          return next;
        });
        return 0;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, isOpen]);

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
      setRemaining(STEPS[prev].seconds);
      return prev;
    });
  }
  function handleNext() {
    setRunning(false);
    setIdx((i) => {
      const next = Math.min(STEPS.length - 1, i + 1);
      setRemaining(STEPS[next].seconds);
      return next;
    });
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
          <div className="flex items-center gap-2">
            <label className="mr-2 text-xs flex items-center gap-1">
              <input type="checkbox" checked={usePhotos} onChange={(e) => setUsePhotos(e.target.checked)} />
              Photos
            </label>
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
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-3">
            {step.how}
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
    </Modal>
  );
}


