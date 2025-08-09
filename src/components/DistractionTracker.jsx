import React, { useEffect, useState } from 'react';
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
  onStartReplacement // start attempt modal upstream
}) {
  const [isAddingDistraction, setIsAddingDistraction] = useState(false);
  const [newDistraction, setNewDistraction] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [customTrigger, setCustomTrigger] = useState('');
  const [breathPrompt, setBreathPrompt] = useState({ isVisible: false, triggerValue: '', triggerLabel: '', topAction: null });

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
      const topAction = getTopAction();
      setBreathPrompt({ isVisible: true, triggerValue: triggerInfo.value, triggerLabel: triggerInfo.label, topAction });
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
  const topActionList = getTopActions();

  function getTopActions() {
    const easyFirst = [...replacementActions].sort((a, b) => Number(!!b.isEasy) - Number(!!a.isEasy));
    return easyFirst.slice(0, 3);
  }
  function getTopAction() {
    return getTopActions()[0] || null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          Distraction Tracker
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
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

      {/* Quick Replacement Actions (top 3) */}
      {topActionList.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-green-800 mb-2">Quick Replacement Actions</h3>
          <div className="flex flex-wrap gap-2">
            {topActionList.map((a) => (
              <button
                key={a.id}
                onClick={() => onStartReplacement && onStartReplacement(a)}
                className="px-3 py-2 text-xs rounded-lg border border-green-300 text-green-700 hover:bg-green-50"
                title={a.rewardText ? `Reward: ${a.rewardText}` : ''}
              >
                Do now: {a.title}
              </button>
            ))}
          </div>
        </div>
      )}

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
        />
      )}

      {/* Stats Section */}
      {topTriggers.length > 0 && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <h3 className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-1">
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
          className="w-full mb-4 p-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Track a Distraction
        </button>
      )}

      {/* Add Distraction Form */}
      {isAddingDistraction && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-purple-200 rounded-lg bg-purple-50">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What distracted you?
            </label>
            <input
              type="text"
              value={newDistraction}
              onChange={(e) => setNewDistraction(e.target.value)}
              placeholder="e.g., Social Media, YouTube, Crypto prices..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              list="common-distractions"
            />
            <datalist id="common-distractions">
              {COMMON_DISTRACTIONS.map(distraction => (
                <option key={distraction} value={distraction} />
              ))}
            </datalist>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
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
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-800">
                    {distraction.distraction}
                  </span>
                  <span className="text-xs text-gray-500">
                    {distraction.timestamp}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Trigger:</span>
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
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Notice patterns in your triggers. Understanding your emotional 
            state when distractions occur helps you build better awareness and coping strategies.
          </p>
        </div>
      )}
    </div>
  );
} 

function BreathingPrompt({ triggerLabel, onComplete, onDismiss, topAction, onStartReplacement }) {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('Ready'); // Ready | Inhale | Exhale | Done
  const [secondsLeft, setSecondsLeft] = useState(0);
  const totalBreaths = 3;
  const inhaleSeconds = 4;
  const exhaleSeconds = 4;
  const [breathCount, setBreathCount] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    if (phase === 'Done') return;

    let timerId;
    if (phase === 'Ready') {
      setPhase('Inhale');
      setSecondsLeft(inhaleSeconds);
    } else if (phase === 'Inhale') {
      if (secondsLeft <= 0) {
        setPhase('Exhale');
        setSecondsLeft(exhaleSeconds);
      }
    } else if (phase === 'Exhale') {
      if (secondsLeft <= 0) {
        const nextCount = breathCount + 1;
        setBreathCount(nextCount);
        if (nextCount >= totalBreaths) {
          setPhase('Done');
          setIsRunning(false);
          if (typeof onComplete === 'function') onComplete();
        } else {
          setPhase('Inhale');
          setSecondsLeft(inhaleSeconds);
        }
      }
    }

    timerId = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, [isRunning, phase, secondsLeft, breathCount, onComplete]);

  const phaseText = phase === 'Ready' ? 'Tap start to begin' : phase === 'Inhale' ? 'Inhale' : phase === 'Exhale' ? 'Exhale' : 'Done';

  return (
    <div className="mb-6 p-4 rounded-lg border-2 border-blue-300 bg-blue-50">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-blue-900">Try 3 deep breaths</div>
          <div className="text-sm text-blue-800">Trigger noticed: {triggerLabel}</div>
        </div>
        <button
          onClick={onDismiss}
          className="text-blue-700 hover:text-blue-900 px-2 py-1 text-sm"
        >
          Dismiss
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-blue-900 font-medium">{phaseText}{phase !== 'Done' && isRunning ? ` — ${secondsLeft}s` : ''}</div>
        <div className="text-sm text-blue-800">Breaths: {breathCount}/{totalBreaths}</div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => { setIsRunning(true); setPhase('Ready'); setSecondsLeft(0); setBreathCount(0); }}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isRunning ? 'Restart' : 'Start 3 breaths'}
        </button>
        {topAction && (
          <button
            onClick={() => onStartReplacement && onStartReplacement(topAction)}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            title={topAction.rewardText ? `Reward: ${topAction.rewardText}` : ''}
          >
            Do replacement: {topAction.title}
          </button>
        )}
      </div>
    </div>
  );
}