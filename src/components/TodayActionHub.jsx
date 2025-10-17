import React, { useState } from 'react';
import BreathingGuideModal from './modals/BreathingGuideModal';
import AnchorModal from './modals/AnchorModal';
import PostureConfirmModal from './modals/PostureConfirmModal';
import ReplacementPickerModal from './modals/ReplacementPickerModal';
import EnvironmentConfirmModal from './modals/EnvironmentConfirmModal';
import ABCHighlights from './ABCHighlights';
import EnvironmentChecklist from './EnvironmentChecklist';
import WhatWorkedToday from './WhatWorkedToday';
import GoalsList from './GoalsList';
import TodosList from './TodosList';

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
  firstHour,
  onePercentPlan,
  onePercentLink,
  onePercentDone,
  onToggleOnePercentDone,
  goals,
  onToggleGoal,
  todaysTodos = [],
  onAddTodo,
  onToggleTodo,
  onRemoveTodo,
  liveSession,
  onEndSession,
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
  const [sessionNow, setSessionNow] = useState(Date.now());

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
  // Sessions tiles will be passed later; keep metrics area minimal for now

  // Live session ticking timer (local)
  React.useEffect(() => {
    if (!liveSession) return;
    const id = setInterval(() => setSessionNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [liveSession]);

  const liveElapsedSec = liveSession ? Math.max(0, Math.floor((sessionNow - liveSession.startedAt) / 1000)) : 0;
  const livePlannedSec = (liveSession?.plannedMin || 0) * 60;
  const liveLeftSec = Math.max(0, livePlannedSec - liveElapsedSec);
  const liveProgress = livePlannedSec > 0 ? Math.min(100, Math.floor((liveElapsedSec / livePlannedSec) * 100)) : 0;

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

      {/* Live Session (if any) */}
      {liveSession && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-purple-800">Current session</h3>
            <button onClick={onEndSession} className="px-2 py-1 text-xs rounded-md bg-purple-600 text-white hover:bg-purple-700">End Session</button>
          </div>
          <div className="text-sm text-purple-900 mb-1">
            {liveSession.hookLabel ? `Hook: ${liveSession.hookLabel}` : 'No hook'}{liveSession.questTitle ? ` • ${liveSession.questTitle}` : ''}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-purple-900">{formatMmSs(liveLeftSec)} left</div>
            <div className="text-xs text-purple-800">{Math.floor(liveElapsedSec/60)}m elapsed</div>
          </div>
          <div className="w-full bg-purple-100 rounded h-2 mt-2 overflow-hidden">
            <div className="h-2 bg-purple-600" style={{ width: `${liveProgress}%` }} />
          </div>
        </div>
      )}

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

      {/* First Hour Activity/Task */}
      {firstHour && firstHour.trim() && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">First Hour Activity/Task</h3>
          <div className="p-3 bg-white border border-blue-300 rounded">{firstHour}</div>
        </div>
      )}

      {/* 1% Better Learning Prompt */}
      {onePercentPlan && onePercentPlan.trim() && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-emerald-800 mb-1">📈 1% Better Today (15–30 min)</h3>
              <div className="p-3 bg-white border border-emerald-300 rounded text-sm">
                {onePercentPlan}
                {onePercentLink && (
                  <div className="mt-2">
                    <a href={onePercentLink} target="_blank" rel="noreferrer" className="text-emerald-700 underline">Open link</a>
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs text-emerald-900">Aim to be 1% better than yesterday. Quick, specific, and doable.</div>
            </div>
            <label className="flex items-center gap-2 text-sm text-emerald-900">
              <input type="checkbox" checked={!!onePercentDone} onChange={onToggleOnePercentDone} />
              Done
            </label>
          </div>
        </div>
      )}

      {/* Today's Goals */}
      {goals && (
        <GoalsList goals={goals} onToggle={onToggleGoal} editable={true} title="Today's Goals" colorClass="bg-green-50" />
      )}

      {/* Today's Todos (optional) */}
      <TodosList
        todos={todaysTodos}
        onAdd={onAddTodo}
        onToggle={onToggleTodo}
        onRemove={onRemoveTodo}
        editable={true}
        title="Today's Todos (optional)"
        colorClass="bg-yellow-50"
      />

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

function formatMmSs(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}


