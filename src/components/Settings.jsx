import React from 'react';
import { Settings as SettingsIcon, Calendar, Info } from 'lucide-react';
import ReplacementActions from './ReplacementActions';
import EnvironmentDesigner from './EnvironmentDesigner';
import DailyRoutineInput from './DailyRoutineInput';

export default function Settings({ dailyRoutines, onDailyRoutineChange, mindfulnessSettings, onMindfulnessSettingsChange, replacementActions, onAddReplacementAction, onRemoveReplacementAction, onToggleReplacementEasy, environmentProfile, onEnvironmentProfileChange, featureFlags, onFeatureFlagsChange, theme, onThemeChange }) {
  const [showShortcutHelp, setShowShortcutHelp] = React.useState(false);
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center justify-center gap-2">
          <SettingsIcon className="w-6 h-6" />
          Settings & Configuration
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Configure your daily routines and app preferences</p>
      </div>

      {/* Daily Routines Configuration */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Daily Routines Configuration
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Set up to 5 daily routines that you want to track each day. These will appear in your morning tab for tracking.
          </p>
        </div>
        
        <div className="p-4">
          <DailyRoutineInput
            routines={dailyRoutines}
            onRoutineChange={onDailyRoutineChange}
            editable={true}
            title=""
            colorClass="bg-transparent"
          />
        </div>
      </div>

      {/* Mindfulness & Protocol Settings */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Mindfulness & Protocol</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure prompts and durations for micro‑interrupts.</p>
        </div>
        <div className="p-4 space-y-4">
          <div className="pt-2 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-2">Gratitude/Input Mode</h4>
            <SelectField
              label="Morning reflection mode"
              value={mindfulnessSettings?.morningMode ?? 'classic'}
              onChange={(v) => onMindfulnessSettingsChange({ ...mindfulnessSettings, morningMode: v })}
              options={[
                { value: 'classic', label: 'Classic: Gratitude + Life Areas grid' },
                { value: 'areasReflection', label: 'Areas Reflection: gratitude + improvement per area' }
              ]}
            />
            {mindfulnessSettings?.morningMode === 'areasReflection' && (
              <NumberField
                label="Minimum areas required"
                value={mindfulnessSettings?.areasMinRequired ?? 2}
                onChange={(v) => onMindfulnessSettingsChange({ ...mindfulnessSettings, areasMinRequired: Math.max(0, Math.min(7, v)) })}
              />
            )}
            {mindfulnessSettings?.morningMode === 'areasReflection' && (
              <SelectField
                label="Areas interaction style"
                value={mindfulnessSettings?.areasStyle ?? 'unfold'}
                onChange={(v) => onMindfulnessSettingsChange({ ...mindfulnessSettings, areasStyle: v })}
                options={[
                  { value: 'unfold', label: 'Tap‑to‑unfold cards' },
                  { value: 'inline', label: 'Inline chip cascade' },
                  { value: 'focus', label: 'Focus mode carousel' }
                ]}
              />
            )}
          </div>
          <Toggle
            label="Enable prompts after tracking a distraction"
            checked={!!mindfulnessSettings?.enablePrompts}
            onChange={(v) => onMindfulnessSettingsChange({ ...mindfulnessSettings, enablePrompts: v })}
          />
          <NumberField
            label="Anchor duration (seconds)"
            value={mindfulnessSettings?.anchorSec ?? 30}
            onChange={(v) => onMindfulnessSettingsChange({ ...mindfulnessSettings, anchorSec: v })}
          />
          <NumberField
            label="Pause duration (seconds)"
            value={mindfulnessSettings?.pauseSec ?? 90}
            onChange={(v) => onMindfulnessSettingsChange({ ...mindfulnessSettings, pauseSec: v })}
          />
          <NumberField
            label="Morning check-in threshold (# items)"
            value={mindfulnessSettings?.morningCheckinThreshold ?? 5}
            onChange={(v) => onMindfulnessSettingsChange({ ...mindfulnessSettings, morningCheckinThreshold: Math.max(1, Math.min(10, v)) })}
          />
          <SelectField
            label="Anchor nudge frequency"
            value={mindfulnessSettings?.anchorFrequency ?? 'off'}
            onChange={(v) => onMindfulnessSettingsChange({ ...mindfulnessSettings, anchorFrequency: v })}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'low', label: 'Low (every 60 min)' },
              { value: 'medium', label: 'Medium (every 30 min)' }
            ]}
          />
          <div className="pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Default tab</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  localStorage.setItem('activeTab', JSON.stringify('today'));
                  window.location.reload();
                }}
                className="px-3 py-2 text-xs rounded-md bg-amber-600 text-white hover:bg-amber-700"
              >
                Open on "During" by default
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('activeTab', JSON.stringify('morning'));
                  window.location.reload();
                }}
                className="px-3 py-2 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Open on "Morning" by default
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">This sets your landing tab immediately and on next app load.</p>
          </div>
        </div>
      </div>

      {/* Sessions (Beta) */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Sessions (Beta)</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Enable lightweight focus sessions with hooks and quests.</p>
        </div>
        <div className="p-4 space-y-4">
          <Toggle
            label="Enable Sessions (beta)"
            checked={!!mindfulnessSettings?.enableSessions}
            onChange={(v) => onMindfulnessSettingsChange({ ...mindfulnessSettings, enableSessions: v })}
          />
          <Toggle
            label="Immersive sessions mode (locks UI during session)"
            checked={!!mindfulnessSettings?.immersiveSessions}
            onChange={(v) => onMindfulnessSettingsChange({ ...mindfulnessSettings, immersiveSessions: v })}
          />
          <Toggle
            label="Keep screen awake during sessions"
            checked={!!mindfulnessSettings?.keepScreenAwake}
            onChange={(v) => onMindfulnessSettingsChange({ ...mindfulnessSettings, keepScreenAwake: v })}
          />
          <Toggle
            label="Notification alarm (experimental)"
            checked={!!mindfulnessSettings?.enableAlarmNotification}
            onChange={async (v) => {
              if (v && 'Notification' in window) {
                try { await Notification.requestPermission(); } catch {}
              }
              onMindfulnessSettingsChange({ ...mindfulnessSettings, enableAlarmNotification: v });
            }}
          />
          {/* Native timer helper */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-2">Native timer helper</h4>
            <SelectField
              label="Helper type"
              value={mindfulnessSettings?.nativeTimerHelper ?? 'off'}
              onChange={(v) => onMindfulnessSettingsChange({ ...mindfulnessSettings, nativeTimerHelper: v })}
              options={[
                { value: 'off', label: 'Off' },
                { value: 'iosShortcut', label: 'iOS Shortcut' },
                { value: 'androidClock', label: 'Android Clock' },
                { value: 'thirdParty', label: 'Third‑party app (custom URL)' }
              ]}
            />
            <Toggle
              label="Auto-open native timer at session start"
              checked={!!mindfulnessSettings?.nativeTimerAutoOpen}
              onChange={(v) => onMindfulnessSettingsChange({ ...mindfulnessSettings, nativeTimerAutoOpen: v })}
            />
            {mindfulnessSettings?.nativeTimerHelper === 'iosShortcut' && (
              <label className="block mt-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">iOS Shortcut name</span>
                <input
                  type="text"
                  value={mindfulnessSettings?.iosShortcutName ?? 'Start Focus Timer'}
                  onChange={(e) => onMindfulnessSettingsChange({ ...mindfulnessSettings, iosShortcutName: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Start Focus Timer"
                />
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowShortcutHelp(true)}
                    className="px-3 py-1.5 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    How to set up Shortcut
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const name = encodeURIComponent(mindfulnessSettings?.iosShortcutName || 'Start Focus Timer');
                        window.location.href = `shortcuts://run-shortcut?name=${name}&input=10`;
                      } catch {}
                    }}
                    className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Test Shortcut (10 min)
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">We open shortcuts:// to run this Shortcut, passing the planned minutes as input.</p>
              </label>
            )}
            {mindfulnessSettings?.nativeTimerHelper === 'thirdParty' && (
              <label className="block mt-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Third‑party URL template</span>
                <input
                  type="text"
                  value={mindfulnessSettings?.thirdPartyUrlTemplate ?? ''}
                  onChange={(e) => onMindfulnessSettingsChange({ ...mindfulnessSettings, thirdPartyUrlTemplate: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="due://x-callback-url/add?title=Focus&minutes={minutes}"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Use placeholders {"{minutes}"} and/or {"{seconds}"}. We’ll substitute based on your session length.</p>
              </label>
            )}
          </div>
          <Toggle
            label="Session testing mode (15s timer)"
            checked={!!mindfulnessSettings?.sessionTestMode}
            onChange={(v) => onMindfulnessSettingsChange({ ...mindfulnessSettings, sessionTestMode: v })}
          />
          <SelectField
            label="Alarm sound"
            value={mindfulnessSettings?.alarmSound ?? 'beep'}
            onChange={(v) => onMindfulnessSettingsChange({ ...mindfulnessSettings, alarmSound: v })}
            options={[
              { value: 'beep', label: 'Beep (sine, 880Hz)' },
              { value: 'bell', label: 'Bell (triangle, 660Hz)' },
              { value: 'chime', label: 'Chime (square, 1200Hz)' }
            ]}
          />
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Alarm sound test (Safari fix)</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => testAlarmSound(mindfulnessSettings?.alarmSound ?? 'beep')}
                className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                ▶︎ Test alarm sound
              </button>
              <span className="text-xs text-gray-600 dark:text-gray-400">Click to enable audio context on Safari and verify sound.</span>
            </div>
          </div>
        </div>
      </div>
      {/* iOS Shortcut Help Modal */}
      {showShortcutHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowShortcutHelp(false)} />
          <div className="relative w-full max-w-lg mx-4 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold">Set up the iOS Shortcut</h4>
              <button onClick={() => setShowShortcutHelp(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <p>Follow these steps once. Then our app can start a native timer automatically:</p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Open <span className="font-medium">Shortcuts</span> → tap <span className="font-medium">+</span> to create a new Shortcut and name it <span className="font-medium">{mindfulnessSettings?.iosShortcutName || 'Start Focus Timer'}</span>.</li>
                <li>Add action <span className="font-medium">Get Numbers from Input</span> → Source: <span className="font-medium">Shortcut Input</span>.</li>
                <li>Add action <span className="font-medium">Get Item from List</span> → <span className="font-medium">First Item</span>.</li>
                <li>Add action <span className="font-medium">If</span> (<span className="font-medium">First Item</span> &gt; 0)
                  <ul className="list-disc ml-5">
                    <li>If True: <span className="font-medium">Set Variable</span> → <span className="font-medium">Minutes</span> = <span className="font-medium">First Item</span></li>
                    <li>Otherwise: <span className="font-medium">Ask for Input</span> (Number) → set <span className="font-medium">Minutes</span></li>
                  </ul>
                </li>
                <li>Add action <span className="font-medium">Start Timer</span> for <span className="font-medium">Minutes</span> <span className="font-medium">minutes</span>.</li>
                <li>Optional: <span className="font-medium">Show Notification</span> “✅ Timer started for Minutes min”.</li>
              </ol>
              <div className="mt-2 p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="text-xs text-gray-600 dark:text-gray-300">Quick test link (iOS only):</div>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const name = encodeURIComponent(mindfulnessSettings?.iosShortcutName || 'Start Focus Timer');
                      window.location.href = `shortcuts://run-shortcut?name=${name}&input=10`;
                    } catch {}
                  }}
                  className="mt-2 px-3 py-2 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Run “{mindfulnessSettings?.iosShortcutName || 'Start Focus Timer'}” with 10 minutes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 dark:text-gray-100">Appearance</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-400 mt-1">Customize the look and feel of the app.</p>
        </div>
        <div className="p-4 space-y-4">
          <Toggle
            label="Dark Mode"
            checked={theme === 'dark'}
            onChange={(v) => onThemeChange(v ? 'dark' : 'light')}
          />
        </div>
      </div>

      {/* Tab Visibility */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 dark:text-gray-100">Tab Visibility</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-400 mt-1">Show or hide tabs to customize your workflow.</p>
        </div>
        <div className="p-4 space-y-4">
          <Toggle
            label="Show Projects tab"
            checked={!!featureFlags?.projectsTab}
            onChange={(v) => onFeatureFlagsChange({ ...(featureFlags||{}), projectsTab: v })}
          />
          <Toggle
            label="Show Invest tab"
            checked={featureFlags?.investTab !== false}
            onChange={(v) => onFeatureFlagsChange({ ...(featureFlags||{}), investTab: v })}
          />
          <Toggle
            label="Show Distractions tab"
            checked={featureFlags?.distractionsTab !== false}
            onChange={(v) => onFeatureFlagsChange({ ...(featureFlags||{}), distractionsTab: v })}
          />
          <Toggle
            label="Show Sessions tab"
            checked={featureFlags?.sessionsTab !== false}
            onChange={(v) => onFeatureFlagsChange({ ...(featureFlags||{}), sessionsTab: v })}
          />
        </div>
      </div>

      {/* Projects Settings */}
      {featureFlags?.projectsTab && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Projects Settings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure how you manage your projects.</p>
          </div>
          <div className="p-4 space-y-4">
            <NumberField
              label="Maximum active projects (warning threshold)"
              value={mindfulnessSettings?.maxActiveProjects ?? 3}
              onChange={(v) => onMindfulnessSettingsChange({ ...mindfulnessSettings, maxActiveProjects: Math.max(1, Math.min(20, v)) })}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You'll see a warning when you have more than this many active projects. Recommended: 3-5 to maintain focus.
            </p>
          </div>
        </div>
      )}

      {/* Invest Settings */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Invest Settings</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Caps reading time to avoid endless research; keep docs as source of truth.</p>
        </div>
        <div className="p-4 space-y-4">
          <NumberField
            label="Reading cap (minutes/day)"
            value={mindfulnessSettings?.investReadingCapMin ?? 0}
            onChange={(v) => onMindfulnessSettingsChange({ ...mindfulnessSettings, investReadingCapMin: Math.max(0, v) })}
          />
        </div>
      </div>

      {/* Replacement Actions Editor */}
      <ReplacementActions
        actions={replacementActions || []}
        onAdd={onAddReplacementAction}
        onRemove={onRemoveReplacementAction}
        onToggleEasy={onToggleReplacementEasy}
      />

      {/* Environment Designer */}
      <EnvironmentDesigner
        profile={environmentProfile}
        onProfileChange={onEnvironmentProfileChange}
      />

      {/* Future Settings Placeholder */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Future Settings</h3>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          This settings area can be expanded to include:
        </p>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Custom life areas configuration</li>
          <li>• Notification preferences</li>
          <li>• Theme settings (dark mode)</li>
          <li>• Export format preferences</li>
          <li>• Timer duration settings</li>
          <li>• Data backup and restore</li>
        </ul>
      </div>
    </div>
  );
} 

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5"
      />
    </label>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <input
        type="number"
        value={value}
        min={5}
        max={600}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
        className="mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md w-32 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options = [] }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}

// Local helper to play a short beep. Helps Safari initialize/resume AudioContext via user gesture.
function testAlarmSound(sound = 'beep') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) { alert('Web Audio not supported in this browser'); return; }
    const ctx = new AudioCtx();
    // Some Safari builds require an explicit resume() after user gesture.
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    if (sound === 'bell') {
      osc.type = 'triangle'; osc.frequency.value = 660; gain.gain.value = 0.1;
    } else if (sound === 'chime') {
      osc.type = 'square'; osc.frequency.value = 1200; gain.gain.value = 0.06;
    } else { osc.type = 'sine'; osc.frequency.value = 880; gain.gain.value = 0.08; }
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      try { osc.stop(); osc.disconnect(); gain.disconnect(); ctx.close && ctx.close(); } catch {}
    }, 600);
  } catch (e) {
    console.error(e);
    alert('Could not play test sound. Check browser permissions.');
  }
}