import React from 'react';
import { Settings as SettingsIcon, Calendar, Info } from 'lucide-react';
import ReplacementActions from './ReplacementActions';
import EnvironmentDesigner from './EnvironmentDesigner';
import DailyRoutineInput from './DailyRoutineInput';

export default function Settings({ dailyRoutines, onDailyRoutineChange, mindfulnessSettings, onMindfulnessSettingsChange, replacementActions, onAddReplacementAction, onRemoveReplacementAction, onToggleReplacementEasy, environmentProfile, onEnvironmentProfileChange }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <SettingsIcon className="w-6 h-6" />
          Settings & Configuration
        </h2>
        <p className="text-gray-600">Configure your daily routines and app preferences</p>
      </div>

      {/* Daily Routines Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Daily Routines Configuration
          </h3>
          <p className="text-sm text-gray-600 mt-1">
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
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800">Mindfulness & Protocol</h3>
          <p className="text-sm text-gray-600 mt-1">Configure prompts and durations for micro‑interrupts.</p>
        </div>
        <div className="p-4 space-y-4">
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
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Future Settings</h3>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          This settings area can be expanded to include:
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
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
      <span className="text-sm text-gray-700">{label}</span>
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
      <span className="text-sm text-gray-700">{label}</span>
      <input
        type="number"
        value={value}
        min={5}
        max={600}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
        className="mt-1 p-2 border border-gray-300 rounded-md w-32"
      />
    </label>
  );
}