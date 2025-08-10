import React, { useEffect, useState } from 'react';

export default function BreathingGuideModal({ onClose, onComplete, totalBreaths = 3, inhaleSeconds = 4, exhaleSeconds = 4 }) {
  const [phase, setPhase] = useState('Ready');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (phase === 'Done') return;
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    if (phase === 'Ready') { setPhase('Inhale'); setSecondsLeft(inhaleSeconds); return; }
    if (phase === 'Inhale' && secondsLeft === 0) { setPhase('Exhale'); setSecondsLeft(exhaleSeconds); return; }
    if (phase === 'Exhale' && secondsLeft === 0) {
      const next = breathCount + 1; setBreathCount(next);
      if (next >= totalBreaths) { setPhase('Done'); setRunning(false); }
      else { setPhase('Inhale'); setSecondsLeft(inhaleSeconds); }
    }
  }, [running, secondsLeft, phase, breathCount, exhaleSeconds, inhaleSeconds, totalBreaths]);

  const canConfirm = phase === 'Done';
  const phaseText = phase === 'Ready' ? 'Tap start to begin' : phase;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="breath-title" onKeyDown={(e) => { if (e.key === 'Escape') onClose && onClose(); }}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg p-6 border border-gray-200 w-full max-w-sm">
        <h4 id="breath-title" className="text-base font-semibold text-gray-900 mb-2">Guided breaths</h4>
        <div className="text-sm text-gray-700 mb-2">Follow the prompts. Inhale and exhale slowly.</div>
        <div className="flex items-center justify-between text-blue-900 mb-2">
          <div className="font-medium">{phaseText}{running && phase !== 'Ready' ? ` — ${secondsLeft}s` : ''}</div>
          <div className="text-sm">{breathCount}/{totalBreaths}</div>
        </div>
        <div className="flex items-center justify-between">
          <button onClick={() => { setRunning(true); setPhase('Ready'); setSecondsLeft(0); setBreathCount(0); }} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{running ? 'Restart' : 'Start'}</button>
          <button disabled={!canConfirm} onClick={() => { onComplete && onComplete(); onClose(); }} className={`px-3 py-2 rounded-md ${canConfirm ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>Confirm done</button>
          <button onClick={onClose} className="px-3 py-2 text-gray-600 hover:text-gray-800">Close</button>
        </div>
      </div>
    </div>
  );
}


