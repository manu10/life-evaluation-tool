import React, { useEffect, useMemo, useRef, useState } from 'react';
import BreathingGuideModal from './modals/BreathingGuideModal';

export default function ImmersiveSessionOverlay({
  session,
  onEnd,
  onCancel,
  enableExtend = true,
  soundType = 'beep',
}) {
  const { startedAt, plannedMin, hookLabel, questTitle } = session || {};
  const [now, setNow] = useState(Date.now());
  const [extendedSec, setExtendedSec] = useState(0);
  const [hasExtended, setHasExtended] = useState(false);
  const [showBreaths, setShowBreaths] = useState(false);
  const [outcome, setOutcome] = useState('');
  const [alarmOn, setAlarmOn] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const totalPlannedSec = useMemo(() => Math.max(0, (plannedMin || 0) * 60 + extendedSec), [plannedMin, extendedSec]);
  const elapsedSec = useMemo(() => Math.max(0, Math.floor((now - startedAt) / 1000)), [now, startedAt]);
  const remainingSec = Math.max(0, totalPlannedSec - elapsedSec);

  useEffect(() => {
    if (remainingSec === 0 && outcome.trim().length < 10) {
      setAlarmOn(true);
    } else {
      setAlarmOn(false);
    }
  }, [remainingSec, outcome]);

  useEffect(() => {
    if (!alarmOn) {
      stopBeep();
      return;
    }
    startBeep();
    return () => stopBeep();
  }, [alarmOn]);

  function startBeep() {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      stopBeep();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      if (soundType === 'bell') { osc.type = 'triangle'; osc.frequency.value = 660; gain.gain.value = 0.06; }
      else if (soundType === 'chime') { osc.type = 'square'; osc.frequency.value = 1200; gain.gain.value = 0.04; }
      else { osc.type = 'sine'; osc.frequency.value = 880; gain.gain.value = 0.05; }
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      oscRef.current = osc;
    } catch {}
  }
  function stopBeep() {
    try { if (oscRef.current) { oscRef.current.stop(); oscRef.current.disconnect(); oscRef.current = null; } } catch {}
  }

  function handleExtend() {
    if (hasExtended || !enableExtend || remainingSec === 0) return;
    setExtendedSec((s) => s + 300);
    setHasExtended(true);
  }

  function handleFinish() {
    if (typeof onEnd === 'function') onEnd({ outcome: outcome.trim() });
  }

  function fmt(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  return (
    <div className="fixed inset-0 z-70 bg-gray-900/90 text-gray-100 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4 p-6 rounded-xl border border-gray-700 bg-gray-900/80 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-300">
            {hookLabel && <div className="font-medium">Hook: {hookLabel}</div>}
            {questTitle && <div className="">Quest: {questTitle}</div>}
          </div>
          <div className={`text-4xl font-bold ${remainingSec <= 10 ? 'text-red-400' : 'text-gray-100'}`}>{fmt(remainingSec)}</div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          {!hasExtended && remainingSec > 0 && (
            <button onClick={handleExtend} className="px-3 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700">+5 minutes</button>
          )}
          <button onClick={() => setShowBreaths(true)} className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">Start 3 breaths</button>
          <a
            href="https://open.spotify.com/playlist/37i9dQZF1DX7EF8wVxBVhG?si=435bdf11a2924809"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            🎧 Focus playlist
          </a>
          <button onClick={() => setConfirmExit(true)} className="ml-auto px-3 py-2 text-sm rounded-md border border-gray-600 hover:bg-gray-800">Exit</button>
        </div>

        <div className="mt-6">
          <label className="block text-sm text-gray-300 mb-2">Outcome (unlocks when time ends)</label>
          <textarea
            disabled={remainingSec > 0}
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder={remainingSec > 0 ? 'Locked until timer completes' : 'Describe what you accomplished...'}
            className={`w-full p-3 rounded-md border ${remainingSec>0?'border-gray-700 bg-gray-800 text-gray-400':'border-gray-600 bg-gray-900 text-gray-100'} focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[120px]`}
          />
          {alarmOn && (
            <div className="mt-2 text-xs text-red-300">⏰ Time is up — start writing to stop the alarm.</div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button onClick={handleFinish} disabled={outcome.trim().length < 10} className={`px-4 py-2 rounded-md ${outcome.trim().length<10?'bg-purple-900/40 text-purple-300 cursor-not-allowed':'bg-purple-600 text-white hover:bg-purple-700'}`}>Finish</button>
        </div>
      </div>

      {showBreaths && (
        <BreathingGuideModal onClose={() => setShowBreaths(false)} onComplete={() => setShowBreaths(false)} />
      )}

      {confirmExit && (
        <div className="fixed inset-0 z-80 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmExit(false)} />
          <div className="relative max-w-md w-full mx-4 p-5 rounded-xl border border-gray-700 bg-gray-900 text-gray-100 shadow-xl">
            <h4 className="text-lg font-semibold mb-2">Cancel session?</h4>
            <p className="text-sm text-gray-300 mb-4">
              You’re already focused. Try one small step: add 1 more minute, take 3 breaths, or start typing your outcome.
              Cancelling now will remove this session.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setConfirmExit(false)} className="px-3 py-2 text-sm rounded-md border border-gray-600 hover:bg-gray-800">Continue focus</button>
              <button
                onClick={() => { setConfirmExit(false); if (typeof onCancel === 'function') onCancel({ confirmed: true }); }}
                className="px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Cancel session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


