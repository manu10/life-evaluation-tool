import React, { useState } from 'react';
import BreathingGuideModal from './modals/BreathingGuideModal';
import AnchorModal from './modals/AnchorModal';
import PostureConfirmModal from './modals/PostureConfirmModal';
import ReplacementPickerModal from './modals/ReplacementPickerModal';
import EnvironmentConfirmModal from './modals/EnvironmentConfirmModal';
import ABCHighlights from './ABCHighlights';
import EnvironmentChecklist from './EnvironmentChecklist';
import WhatWorkedToday from './WhatWorkedToday';

const COMMON_TRIGGERS = [
  'bored','anxious','stressed','procrastinating','lonely','excited','frustrated','curious','tired','overwhelmed'
];

export default function TodayActionHub({
  onAddDistraction,
  onOpenSettings,
  onStartProtocol,
  onOpenABC,
  onLogMicro,
  replacementActions = [],
  onStartReplacement,
  environmentProfile = {},
  onApplyEnvironment,
  microLogs = [],
  abcLogs = [],
  environmentApplications = [],
  anchorSeconds = 30,
  pauseSeconds = 90,
  distractions = [],
}) {
  const [newDistraction, setNewDistraction] = useState('');
  const [trigger, setTrigger] = useState('');
  const [showBreath, setShowBreath] = useState(false);
  const [showAnchor, setShowAnchor] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showPosture, setShowPosture] = useState(false);
  const [showReplace, setShowReplace] = useState(false);
  const [showEnv, setShowEnv] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  function handleQuickLog(e) {
    e.preventDefault();
    if (!newDistraction.trim() || !trigger.trim()) return;
    const created = {
      id: Date.now(),
      distraction: newDistraction.trim(),
      trigger: { value: trigger, label: capitalize(trigger), color: 'bg-gray-500' },
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    onAddDistraction && onAddDistraction(created);
    setNewDistraction('');
    setTrigger('');
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1500);
  }

  const envHasItems = (environmentProfile?.removals?.length || 0) + (environmentProfile?.additions?.length || 0) > 0;
  const todayStr = new Date().toDateString();
  const todayMicro = (microLogs || []).filter(m => new Date(m.ts).toDateString() === todayStr);
  const interruptionCount = todayMicro.filter(m => ['breaths','posture','anchor','pause'].includes(m.type)).length;
  const replacementLogs = todayMicro.filter(m => m.type === 'replacement');
  const helpedCount = replacementLogs.filter(m => m.helped).length;
  const envApplyCount = (environmentApplications || []).filter(a => new Date(a.ts).toDateString() === todayStr).length;
  const distractionCount = (distractions || []).length;

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Quick actions</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowBreath(true)} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Start 3 breaths</button>
          <button onClick={() => setShowPosture(true)} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Change posture</button>
          <button onClick={() => setShowAnchor(true)} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Start {anchorSeconds}s anchor</button>
          <button onClick={() => setShowPause(true)} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Start {pauseSeconds}s pause</button>
          <button onClick={onStartProtocol} className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">Start 5‑Step</button>
          <button onClick={() => setShowReplace(true)} className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">Choose replacement…</button>
          <button onClick={() => setShowEnv(true)} className="px-3 py-2 bg-amber-600 text-white rounded-md text-sm hover:bg-amber-700">Choose environment tweak…</button>
        </div>
        <div className="mt-2 text-xs text-gray-600">Manage lists in Settings.</div>
      </div>

      {/* Distraction Quick Log */}
      <form onSubmit={handleQuickLog} className="p-4 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Quick distraction log</h3>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            className="flex-1 p-2 border border-gray-300 rounded-md"
            placeholder="What distracted you?"
            value={newDistraction}
            onChange={(e) => setNewDistraction(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {COMMON_TRIGGERS.map((t) => (
              <button
                key={t}
                type="button"
                className={`px-2 py-1 text-xs rounded-md border ${trigger===t ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
                onClick={() => setTrigger(t)}
              >
                {capitalize(t)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700" title="Save distraction">
              Save
            </button>
            {savedFlash && (
              <span className="text-xs text-green-700 bg-green-100 border border-green-200 rounded px-2 py-1">Saved ✓</span>
            )}
          </div>
        </div>
      </form>

      {/* Compact metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Metric label="Distractions" value={distractionCount} />
        <Metric label="Interruptions" value={interruptionCount} />
        <Metric label="Replacement helped" value={`${helpedCount}/${replacementLogs.length}`} />
        <Metric label="Env applied" value={envApplyCount} />
      </div>

      {/* Daily helpers */}
      <EnvironmentChecklist
        profile={environmentProfile}
        appliedToday={environmentApplications.filter(a => new Date(a.ts).toDateString() === new Date().toDateString())}
        onApply={onApplyEnvironment}
      />
      <ABCHighlights logs={abcLogs} onAddABC={onOpenABC || onOpenSettings} />
      <WhatWorkedToday microLogs={microLogs} />

      {/* Modals */}
      {showBreath && (
        <BreathingGuideModal
          onClose={() => setShowBreath(false)}
          onComplete={() => onLogMicro && onLogMicro('breaths')}
        />
      )}
      {showPosture && (
        <PostureConfirmModal
          onClose={() => setShowPosture(false)}
          onConfirm={() => onLogMicro && onLogMicro('posture')}
        />
      )}
      {showAnchor && (
        <AnchorModal
          seconds={anchorSeconds}
          onClose={() => setShowAnchor(false)}
          onConfirm={() => onLogMicro && onLogMicro('anchor')}
        />
      )}
      {showPause && (
        <AnchorModal
          seconds={pauseSeconds}
          onClose={() => setShowPause(false)}
          onConfirm={() => onLogMicro && onLogMicro('pause')}
          title={`${pauseSeconds}‑second pause`}
          description="Observe the urge without reacting. Let it crest and pass."
        />
      )}
      {showReplace && (
        <ReplacementPickerModal
          isOpen={showReplace}
          onClose={() => setShowReplace(false)}
          actions={replacementActions}
          onStartReplacement={(a) => { onStartReplacement && onStartReplacement(a); setShowReplace(false); }}
          onOpenSettings={onOpenSettings}
        />
      )}
      {showEnv && (
        <EnvironmentConfirmModal
          isOpen={showEnv}
          onClose={() => setShowEnv(false)}
          environmentProfile={environmentProfile}
          onApplyEnvironment={(it) => { onApplyEnvironment && onApplyEnvironment(it); }}
        />
      )}
    </div>
  );
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Metric({ label, value }) {
  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg">
      <div className="text-xs text-gray-600">{label}</div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
    </div>
  );
}


