import React, { useState } from 'react';
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
  'Social Media', 'YouTube', 'Crypto Prices', 'WhatsApp', 'Marketplace Pages', 
  'News Websites', 'Email', 'Gaming', 'Online Shopping', 'Reddit'
];

export default function DistractionTracker({ 
  distractions, 
  onAddDistraction, 
  onRemoveDistraction, 
  onClearAll 
}) {
  const [isAddingDistraction, setIsAddingDistraction] = useState(false);
  const [newDistraction, setNewDistraction] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [customTrigger, setCustomTrigger] = useState('');

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

    onAddDistraction({
      id: Date.now(),
      distraction: newDistraction.trim(),
      trigger: triggerInfo,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    });

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