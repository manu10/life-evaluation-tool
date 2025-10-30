import React, { useState } from 'react';

export default function SessionEnderModal({ isOpen, onClose, onEnd, initialHighlight = '' }) {
  if (!isOpen) return null;
  const [enjoyment, setEnjoyment] = useState(4);
  const [highlight, setHighlight] = useState(initialHighlight || '');
  React.useEffect(() => { setHighlight(initialHighlight || ''); }, [initialHighlight]);
  const [rewardTaken, setRewardTaken] = useState(false);

  function handleEnd() {
    if (typeof onEnd === 'function') onEnd({ enjoyment, highlight: highlight.trim(), rewardTaken });
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="End Session">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Finish Session</h3>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100" aria-label="Close">✕</button>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-700 dark:text-gray-300">Enjoyment (1–5)</span>
            <input type="number" min={1} max={5} value={enjoyment} onChange={(e)=>setEnjoyment(parseInt(e.target.value || '0', 10))} className="mt-1 w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700 dark:text-gray-300">One highlight (optional)</span>
            <input value={highlight} onChange={(e)=>setHighlight(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" placeholder="What was interesting or useful?" />
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input type="checkbox" checked={rewardTaken} onChange={(e)=>setRewardTaken(e.target.checked)} />
            I took a small reward (stretch, espresso, music)
          </label>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md">Cancel</button>
          <button onClick={handleEnd} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">End Session</button>
        </div>
      </div>
    </div>
  );
}


