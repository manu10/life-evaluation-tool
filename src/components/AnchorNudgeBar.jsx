import React, { useEffect, useMemo, useState } from 'react';

export default function AnchorNudgeBar({ frequency = 'off', microLogs = [], onStartAnchor, seconds = 30 }) {
  if (!frequency || frequency === 'off') return null;

  const targetMinutes = frequency === 'medium' ? 30 : 60; // low=60, medium=30
  const lastAnchorTs = useMemo(() => {
    const anchors = (microLogs || []).filter(m => m.type === 'anchor').sort((a, b) => b.ts - a.ts);
    return anchors.length > 0 ? anchors[0].ts : null;
  }, [microLogs]);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  const elapsedMin = lastAnchorTs ? Math.floor((now - lastAnchorTs) / 60000) : null;
  const progress = Math.min(100, Math.max(0, lastAnchorTs ? Math.floor((elapsedMin / targetMinutes) * 100) : 100));
  const due = (elapsedMin == null) || (elapsedMin >= targetMinutes);

  return (
    <div className="mt-2" aria-live="polite" role="status">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-amber-900">
            Anchor nudge — every {targetMinutes} min
          </div>
          <button
            onClick={() => onStartAnchor && onStartAnchor(seconds)}
            className={`px-3 py-1 text-xs rounded-md border ${due ? 'bg-amber-600 text-white border-amber-700 hover:bg-amber-700' : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-100'}`}
            title="Start anchor"
          >
            {due ? 'Anchor now' : 'Start anchor'}
          </button>
        </div>
        <div className="w-full bg-amber-100 rounded h-2 overflow-hidden">
          <div className={`h-2 ${due ? 'bg-amber-600' : 'bg-amber-400'}`} style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-1 text-xs text-amber-900">
          {lastAnchorTs ? `${elapsedMin} min since last anchor` : 'No anchors yet today'}
        </div>
      </div>
    </div>
  );
}


