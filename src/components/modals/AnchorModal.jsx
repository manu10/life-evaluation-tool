import React, { useEffect, useState } from 'react';

export default function AnchorModal({ seconds = 30, onClose, onConfirm, title = '30‑second anchor', description = 'Focus on sensations in your hands or breath. If your mind wanders, gently return.' }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [running, timeLeft]);
  const canConfirm = !running && timeLeft === 0;
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="anchor-title" onKeyDown={(e) => { if (e.key === 'Escape') onClose && onClose(); }}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg p-6 border border-gray-200 w-full max-w-sm">
        <h4 id="anchor-title" className="text-base font-semibold text-gray-900 mb-2">{title}</h4>
        <p className="text-sm text-gray-700 mb-3">{description}</p>
        <div className="text-2xl font-bold text-blue-700 text-center mb-3">{timeLeft}s</div>
        <div className="flex items-center justify-between">
          <button onClick={() => { setRunning(true); setTimeLeft(seconds); }} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{running ? 'Restart' : 'Start'}</button>
          <button disabled={!canConfirm} onClick={() => { onConfirm && onConfirm(); onClose(); }} className={`px-3 py-2 rounded-md ${canConfirm ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>Confirm done</button>
          <button onClick={onClose} className="px-3 py-2 text-gray-600 hover:text-gray-800">Close</button>
        </div>
      </div>
    </div>
  );
}


