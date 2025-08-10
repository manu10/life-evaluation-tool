import React, { useEffect, useState } from 'react';

export default function ReplacementAttempt({ action, durationSec = 120, onComplete, onCancel }) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const [rewardGiven, setRewardGiven] = useState(false);
  const [helped, setHelped] = useState(null); // null | true | false

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      if (typeof onComplete === 'function') onComplete({ rewardGiven, helped });
    }
  }, [isRunning, timeLeft, rewardGiven, onComplete]);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="font-semibold text-gray-800 mb-2">Do now: {action?.title}</div>
        <div className="text-sm text-gray-700 mb-4">{action?.isEasy ? 'Easy' : 'Not marked easy'} • Reward: {action?.rewardText || '—'}</div>
        <div className="text-2xl font-bold text-blue-700 mb-4 text-center">{format(timeLeft)}</div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => { setIsRunning(true); setTimeLeft(durationSec); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isRunning ? 'Restart' : 'Start'}
          </button>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={rewardGiven} onChange={(e) => setRewardGiven(e.target.checked)} />
            I took the reward
          </label>
          <button onClick={onCancel} className="px-3 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
        </div>
        <div className="mt-3 flex items-center gap-3 text-sm text-gray-700">
          <span>Did it help?</span>
          <label className="flex items-center gap-1">
            <input type="radio" name="helped" checked={helped === true} onChange={() => setHelped(true)} /> Yes
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="helped" checked={helped === false} onChange={() => setHelped(false)} /> No
          </label>
        </div>
      </div>
    </div>
  );
}

function format(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}


