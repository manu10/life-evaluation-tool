import React, { useEffect, useState } from 'react';
import EnvironmentConfirmModal from './modals/EnvironmentConfirmModal';
import BreathingGuideModal from './modals/BreathingGuideModal';
import ReplacementPickerModal from './modals/ReplacementPickerModal';
import { Brain, Plus, Trash2, AlertCircle, TrendingUp } from 'lucide-react';

const COMMON_TRIGGERS = [
  { value: 'bored', label: 'Bored 😴', color: 'bg-gray-500' },
  { value: 'anxious', label: 'Anxious 😰', color: 'bg-red-500' },
  { value: 'stressed', label: 'Stressed 😤', color: 'bg-orange-500' },
  { value: 'procrastinating', label: 'Procrastinating 🙄', color: 'bg-yellow-500' },
  { value: 'lonely', label: 'Lonely 😔', color: 'bg-blue-500' },
  { value: 'excited', label: 'Excited 🤩', color: 'bg-green-500' },
  { value: 'frustrated', label: 'Frustrated 😠', color: 'bg-red-600' },
  { value: 'curious', label: 'Curious 🤔', color: 'bg-purple-500' },
  { value: 'tired', label: 'Tired 😴', color: 'bg-indigo-500' },
  { value: 'overwhelmed', label: 'Overwhelmed 😵', color: 'bg-pink-500' }
];

const COMMON_DISTRACTIONS = [
  'AI tools', 'Social Media', 'YouTube', 'Crypto Prices', 'WhatsApp', 'Marketplace Pages', 
  'News Websites', 'Email', 'Gaming', 'Online Shopping', 'Reddit'
];

export default function DistractionTracker({ 
  distractions, 
  onAddDistraction, 
  onRemoveDistraction, 
  onClearAll,
  onSuggestABC, // new: suggest opening ABC logger
  onQuickInterrupt, // new: quick micro-practice
  replacementActions = [], // M2: show actions here
  onStartReplacement, // start attempt modal upstream
  environmentProfile = {},
  onApplyEnvironment, // mark an environment item applied
  onOpenSettings // navigate to settings to configure replacements/env
}) {
  const [isAddingDistraction, setIsAddingDistraction] = useState(false);
  const [newDistraction, setNewDistraction] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [customTrigger, setCustomTrigger] = useState('');
  const [breathPrompt, setBreathPrompt] = useState({ isVisible: false, triggerValue: '', triggerLabel: '', topAction: null });
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newDistraction.trim() || (!selectedTrigger && !customTrigger.trim())) {
      return;
    }

    const trigger = customTrigger.trim() || selectedTrigger;
    const triggerInfo = COMMON_TRIGGERS.find(t => t.value === trigger) || {
      value: trigger,
      label: trigger,
      color: 'bg-gray-500'
    };

    const created = {
      id: Date.now(),
      distraction: newDistraction.trim(),
      trigger: triggerInfo,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    onAddDistraction(created);

    // Suggest ABC and show breathing prompt (do not auto-log)
    if (typeof onSuggestABC === 'function') {
      onSuggestABC({
        setting: '',
        antecedent: `${triggerInfo.label} just before`,
        behavior: `Got distracted by ${created.distraction}`,
        consequence: '',
        effect: ''
      });
    }
    if (typeof onQuickInterrupt === 'function') {
      setBreathPrompt({ isVisible: true, triggerValue: triggerInfo.value, triggerLabel: triggerInfo.label, topAction: null });
    }

    // Reset form
    setNewDistraction('');
    setSelectedTrigger('');
    setCustomTrigger('');
    setIsAddingDistraction(false);
  };

  const getTriggerStats = () => {
    const stats = {};
    distractions.forEach(d => {
      const triggerValue = d.trigger.value;
      stats[triggerValue] = (stats[triggerValue] || 0) + 1;
    });
    return Object.entries(stats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  };

  const topTriggers = getTriggerStats();
  // (quick sections removed; pickers opened from the breathing box)

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm text-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          Distraction Tracker
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {distractions.length} distractions today
          </span>
          {distractions.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-red-600 hover:text-red-800 text-sm"
              title="Clear all distractions"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick sections removed; use buttons in breathing box below */}

      {breathPrompt.isVisible && (
        <BreathingPrompt
          triggerLabel={breathPrompt.triggerLabel}
          onStart={() => {/* no-op, handled inside component */}}
          onComplete={() => {
            if (typeof onQuickInterrupt === 'function') {
              onQuickInterrupt('breaths', 'distraction', breathPrompt.triggerValue);
            }
            setBreathPrompt({ isVisible: false, triggerValue: '', triggerLabel: '', topAction: null });
          }}
          onDismiss={() => setBreathPrompt({ isVisible: false, triggerValue: '', triggerLabel: '', topAction: null })}
          topAction={breathPrompt.topAction}
          onStartReplacement={onStartReplacement}
          environmentProfile={environmentProfile}
          onApplyEnvironment={onApplyEnvironment}
          onOpenSettings={onOpenSettings}
          onOpenEnvModal={() => setIsEnvModalOpen(true)}
          onOpenReplaceModal={() => setIsReplaceModalOpen(true)}
        />
      )}

      {/* Stats Section */}
      {topTriggers.length > 0 && (
        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
          <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Top Triggers Today
          </h3>
          <div className="flex flex-wrap gap-2">
            {topTriggers.map(([trigger, count]) => {
              const triggerInfo = COMMON_TRIGGERS.find(t => t.value === trigger) || {
                label: trigger,
                color: 'bg-gray-500'
              };
              return (
                <span
                  key={trigger}
                  className={`px-2 py-1 rounded-full text-white text-xs ${triggerInfo.color}`}
                >
                  {triggerInfo.label} ({count})
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Distraction Button */}
      {!isAddingDistraction && (
        <button
          onClick={() => setIsAddingDistraction(true)}
          className="w-full mb-4 p-3 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg text-purple-600 dark:text-purple-300 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Track a Distraction
        </button>
      )}

      {/* Add Distraction Form */}
      {isAddingDistraction && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-purple-200 dark:border-purple-700 rounded-lg bg-purple-50 dark:bg-purple-900/20">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What distracted you?
            </label>
            <div className="relative">
            <input
              type="text"
              value={newDistraction}
              onChange={(e) => { setNewDistraction(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(()=> setShowSuggestions(false), 120)}
              placeholder="e.g., Social Media, YouTube, Crypto prices..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            {showSuggestions && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-40 overflow-auto">
                {COMMON_DISTRACTIONS.filter(d => !newDistraction || d.toLowerCase().includes(newDistraction.toLowerCase())).map((d) => (
                  <button
                    type="button"
                    key={d}
                    className="w-full text-left px-3 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onMouseDown={(e) => { e.preventDefault(); setNewDistraction(d); setShowSuggestions(false); }}
                  >
                    {d}
                  </button>
                ))}
                {COMMON_DISTRACTIONS.filter(d => !newDistraction || d.toLowerCase().includes(newDistraction.toLowerCase())).length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No matches</div>
                )}
              </div>
            )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What was your emotional trigger?
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {COMMON_TRIGGERS.map(trigger => (
                <button
                  key={trigger.value}
                  type="button"
                  onClick={() => {
                    setSelectedTrigger(trigger.value);
                    setCustomTrigger('');
                  }}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTrigger === trigger.value
                      ? `${trigger.color} text-white shadow-md`
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {trigger.label}
                </button>
              ))}
            </div>
            
            <input
              type="text"
              value={customTrigger}
              onChange={(e) => {
                setCustomTrigger(e.target.value);
                if (e.target.value) setSelectedTrigger('');
              }}
              placeholder="Or describe your own trigger..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Track Distraction
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingDistraction(false);
                setNewDistraction('');
                setSelectedTrigger('');
                setCustomTrigger('');
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Distractions List */}
      <div className="space-y-3">
        {distractions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium mb-1">No distractions tracked yet</p>
            <p className="text-sm">Great focus! Keep it up! 🎯</p>
          </div>
        ) : (
          distractions.map((distraction) => (
            <div
              key={distraction.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {distraction.distraction}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {distraction.timestamp}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Trigger:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-white text-xs ${distraction.trigger.color}`}
                  >
                    {distraction.trigger.label}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRemoveDistraction(distraction.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remove distraction"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {distractions.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>💡 Tip:</strong> Notice patterns in your triggers. Understanding your emotional 
            state when distractions occur helps you build better awareness and coping strategies.
          </p>
        </div>
      )}

      <EnvironmentConfirmModal
        isOpen={isEnvModalOpen}
        onClose={() => setIsEnvModalOpen(false)}
        environmentProfile={environmentProfile}
        onApplyEnvironment={(it) => onApplyEnvironment && onApplyEnvironment(it)}
      />
      <ReplacementPickerModal
        isOpen={isReplaceModalOpen}
        onClose={() => setIsReplaceModalOpen(false)}
        actions={replacementActions}
        onStartReplacement={(a) => { onStartReplacement && onStartReplacement(a); setIsReplaceModalOpen(false); }}
        onOpenSettings={onOpenSettings}
      />
    </div>
  );
} 

function BreathingPrompt({ triggerLabel, onComplete, onDismiss, topAction, onStartReplacement, environmentProfile, onApplyEnvironment, onOpenSettings, onOpenEnvModal, onOpenReplaceModal }) {
  const [showBreath, setShowBreath] = useState(false);

  const envItems = [
    ...(environmentProfile?.removals || []).map((t) => ({ type: 'removal', text: t })),
    ...(environmentProfile?.additions || []).map((t) => ({ type: 'addition', text: t })),
  ];
  const envTop = envItems[0];

  return (
    <div className="mb-6 p-4 rounded-lg border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-blue-900 dark:text-blue-200">Try 3 deep breaths</div>
          <div className="text-sm text-blue-800 dark:text-blue-300">Trigger noticed: {triggerLabel}</div>
        </div>
        <button
          onClick={onDismiss}
          className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 px-2 py-1 text-sm"
        >
          Dismiss
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <button onClick={() => setShowBreath(true)} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Start 3 breaths</button>
        <button onClick={() => onOpenReplaceModal && onOpenReplaceModal()} className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">Choose replacement…</button>
        <button onClick={() => onOpenEnvModal && onOpenEnvModal()} className="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm">Choose environment tweak…</button>
        <span className="text-xs text-gray-600 dark:text-gray-400">Manage lists in Settings</span>
      </div>
      {showBreath && (
        <BreathingGuideModal
          onClose={() => setShowBreath(false)}
          onComplete={() => { if (typeof onComplete === 'function') onComplete(); }}
        />
      )}
    </div>
  );
}