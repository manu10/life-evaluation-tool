import React from 'react';

const COMMON_TRIGGERS = [
  'bored','anxious','stressed','procrastinating','lonely','excited','frustrated','curious','tired','overwhelmed'
];

export default function QuickDistractionLog({ onAddDistraction }) {
  const [newDistraction, setNewDistraction] = React.useState('');
  const [trigger, setTrigger] = React.useState('');
  const [savedFlash, setSavedFlash] = React.useState(false);

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

  return (
    <form onSubmit={handleQuickLog}>
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Quick distraction log</h3>
      <div className="flex flex-col md:flex-row gap-2">
        <input
          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          placeholder="What distracted you?"
          value={newDistraction}
          onChange={(e) => setNewDistraction(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {COMMON_TRIGGERS.map((t) => (
            <button
              key={t}
              type="button"
              className={`px-2 py-1 text-xs rounded-md border ${trigger===t ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'}`}
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
            <span className="text-xs text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded px-2 py-1">Saved ✓</span>
          )}
        </div>
      </div>
    </form>
  );
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}


