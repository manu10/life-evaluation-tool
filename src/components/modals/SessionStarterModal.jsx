import React, { useMemo, useState } from 'react';

export default function SessionStarterModal({ isOpen, onClose, hooks = [], onAddHook, onStart }) {
  if (!isOpen) return null;

  const [hookMode, setHookMode] = useState('pick'); // 'pick' | 'new'
  const [hookId, setHookId] = useState(hooks[0]?.id || null);
  const [newHookLabel, setNewHookLabel] = useState('');
  const [questTitle, setQuestTitle] = useState('');
  const [minutes, setMinutes] = useState(25);

  const pickedHookLabel = useMemo(() => hooks.find(h => h.id === hookId)?.label || '', [hooks, hookId]);

  function handleCreateAndUseHook() {
    const label = newHookLabel.trim();
    if (!label) return;
    if (typeof onAddHook === 'function') {
      const created = onAddHook({ label, type: 'identity' });
      setHookId(created?.id);
      setHookMode('pick');
      setNewHookLabel('');
    }
  }

  function handleStart() {
    const selectedLabel = hookMode === 'new' ? newHookLabel.trim() : pickedHookLabel;
    if (!selectedLabel) return;
    const selectedId = hookMode === 'new' ? hookId : hookId;
    const plannedMin = Math.max(5, Math.min(180, parseInt(minutes || 0, 10)));
    if (typeof onStart === 'function') {
      onStart({ hookId: selectedId, hookLabel: selectedLabel, questTitle: questTitle.trim(), plannedMin });
    }
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Start Session">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Start Focus Session</h3>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100" aria-label="Close">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Hook</label>
            <div className="flex items-center gap-2 mb-2">
              <button className={`px-2 py-1 text-xs rounded border transition-colors ${hookMode==='pick'?'bg-blue-600 text-white border-blue-700 hover:bg-blue-700':'bg-white dark:bg-gray-800 text-blue-700 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-gray-700'}`} onClick={() => setHookMode('pick')}>Pick</button>
              <button className={`px-2 py-1 text-xs rounded border transition-colors ${hookMode==='new'?'bg-blue-600 text-white border-blue-700 hover:bg-blue-700':'bg-white dark:bg-gray-800 text-blue-700 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-gray-700'}`} onClick={() => setHookMode('new')}>New</button>
            </div>
            {hookMode === 'pick' ? (
              <select value={hookId || ''} onChange={(e) => setHookId(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                {hooks.length === 0 ? (
                  <option value="">No hooks yet</option>
                ) : hooks.map(h => (
                  <option key={h.id} value={h.id}>{h.label}</option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-2">
                <input value={newHookLabel} onChange={(e)=>setNewHookLabel(e.target.value)} placeholder="e.g., I am the kind of person who..." className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400" />
                <button onClick={handleCreateAndUseHook} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Add</button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Quest title (optional)</label>
            <input value={questTitle} onChange={(e)=>setQuestTitle(e.target.value)} placeholder="Name this focus" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
            <input type="number" min={5} max={180} value={minutes} onChange={(e)=>setMinutes(parseInt(e.target.value || '0', 10))} className="w-32 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <a
            href="https://open.spotify.com/playlist/37i9dQZF1DX7EF8wVxBVhG?si=435bdf11a2924809"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 text-xs rounded-md bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
            title="Open Focus Playlist on Spotify"
          >
            🎧 Focus playlist
          </a>
          <button onClick={onClose} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md">Cancel</button>
          <button onClick={handleStart} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Start</button>
        </div>
      </div>
    </div>
  );
}


