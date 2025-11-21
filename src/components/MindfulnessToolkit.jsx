import React, { useEffect, useState } from 'react';
import BreathingGuideModal from './modals/BreathingGuideModal';
import AnchorModal from './modals/AnchorModal';
import PostureConfirmModal from './modals/PostureConfirmModal';

export default function MindfulnessToolkit({ isOpen, onClose, settings, onLogMicro }) {
  if (!isOpen) return null;

  const anchorDuration = settings?.anchorSec ?? 30;
  const pauseDuration = settings?.pauseSec ?? 90;

  function handleLog(type) {
    if (typeof onLogMicro === 'function') {
      onLogMicro(type);
    }
  }

  const [showBreath, setShowBreath] = useState(false);
  const [showAnchor, setShowAnchor] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showPosture, setShowPosture] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Mindfulness Toolkit</h3>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">✕</button>
        </div>

        <div className="space-y-3">
          <ToolkitButton
            label={`Take 3 deep breaths`}
            description="Slow inhale, slow exhale"
            onClick={() => setShowBreath(true)}
          />

          <ToolkitButton
            label="Change posture"
            description="Stand up, roll shoulders, loosen jaw"
            onClick={() => setShowPosture(true)}
          />

          <ToolkitButton
            label={`Start ${anchorDuration}s sensory anchor`}
            description="Focus on hand sensations or breath"
            onClick={() => setShowAnchor(true)}
          />

          <ToolkitButton
            label={`Start ${pauseDuration}s pause`}
            description="Urge-surf: notice the urge rise and fall without acting"
            onClick={() => setShowPause(true)}
          />
        </div>
      </div>
      {showBreath && (
        <BreathingGuideModal onClose={() => setShowBreath(false)} onComplete={() => handleLog('breaths')} />
      )}
      {showAnchor && (
        <AnchorModal seconds={anchorDuration} onClose={() => setShowAnchor(false)} onConfirm={() => handleLog('anchor')} />
      )}
      {showPosture && (
        <PostureConfirmModal onClose={() => setShowPosture(false)} onConfirm={() => handleLog('posture')} />
      )}
      {showPause && (
        <AnchorModal
          seconds={pauseDuration}
          onClose={() => setShowPause(false)}
          onConfirm={() => handleLog('pause')}
          title={`${pauseDuration}‑second pause`}
          description="Observe the urge without reacting. Let it crest and pass."
        />
      )}
    </div>
  );
}

function ToolkitButton({ label, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="font-medium text-gray-800 dark:text-gray-100">{label}</div>
      {description && <div className="text-sm text-gray-600 dark:text-gray-300">{description}</div>}
    </button>
  );
}

// removed inline countdown in favor of shared modals


