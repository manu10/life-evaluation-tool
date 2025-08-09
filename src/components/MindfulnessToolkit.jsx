import React, { useEffect, useState } from 'react';

export default function MindfulnessToolkit({ isOpen, onClose, settings, onLogMicro }) {
  if (!isOpen) return null;

  const anchorDuration = settings?.anchorSec ?? 30;
  const pauseDuration = settings?.pauseSec ?? 90;

  function handleLog(type) {
    if (typeof onLogMicro === 'function') {
      onLogMicro(type);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Mindfulness Toolkit</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="space-y-3">
          <ToolkitButton
            label={`Take 3 deep breaths`}
            description="Slow inhale, slow exhale"
            onClick={() => handleLog('breaths')}
          />

          <ToolkitButton
            label="Change posture"
            description="Stand up, roll shoulders, loosen jaw"
            onClick={() => handleLog('posture')}
          />

          <CountdownAction
            label={`Start ${anchorDuration}s sensory anchor`}
            seconds={anchorDuration}
            onComplete={() => handleLog('anchor')}
          />

          <CountdownAction
            label={`Start ${pauseDuration}s pause`}
            seconds={pauseDuration}
            onComplete={() => handleLog('pause')}
          />
        </div>
      </div>
    </div>
  );
}

function ToolkitButton({ label, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="font-medium text-gray-800">{label}</div>
      {description && <div className="text-sm text-gray-600">{description}</div>}
    </button>
  );
}

function CountdownAction({ label, seconds, onComplete }) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      if (typeof onComplete === 'function') onComplete();
    }
  }, [isRunning, timeLeft, onComplete]);

  function start() {
    setTimeLeft(seconds);
    setIsRunning(true);
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium text-gray-800">{label}</div>
          {isRunning && (
            <div className="text-sm text-gray-600">Time left: {timeLeft}s</div>
          )}
        </div>
        <button
          onClick={start}
          className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {isRunning ? 'Restart' : 'Start'}
        </button>
      </div>
    </div>
  );
}


