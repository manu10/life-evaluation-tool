import React, { useState } from 'react';

export default function ReplacementActions({ actions = [], onAdd, onRemove, onToggleEasy, onChangeRewardText }) {
  const [newTitle, setNewTitle] = useState('');
  const [isEasy, setIsEasy] = useState(true);
  const [rewardText, setRewardText] = useState('Small reward');

  function addAction() {
    const title = newTitle.trim();
    if (!title) return;
    if (typeof onAdd === 'function') {
      onAdd({ title, isEasy, rewardText });
    }
    setNewTitle('');
    setIsEasy(true);
    setRewardText('Small reward');
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Replacement Actions</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Define easy, healthier actions ready to replace anxious responses.</p>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
          <label className="block">
            <span className="text-sm text-gray-700 dark:text-gray-300">Action title</span>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., Call a friend, 5-min journal, 3-min walk"
              className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700 dark:text-gray-300">Reward text</span>
            <input
              type="text"
              value={rewardText}
              onChange={(e) => setRewardText(e.target.value)}
              placeholder="e.g., Tea break, 5-min music"
              className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isEasy} onChange={(e) => setIsEasy(e.target.checked)} />
            <span className="text-sm text-gray-700 dark:text-gray-300">Mark as easy</span>
          </label>
          <button
            onClick={addAction}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add Action
          </button>
        </div>

        <ul className="space-y-2">
          {actions.length === 0 && (
            <li className="text-sm text-gray-600 dark:text-gray-400">No actions yet. Add your first replacement action.</li>
          )}
          {actions.map((a) => (
            <li key={a.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-100">{a.title}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Reward: {a.rewardText || '—'}</div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={!!a.isEasy} onChange={() => onToggleEasy && onToggleEasy(a.id)} /> easy
                </label>
                <button
                  onClick={() => onRemove && onRemove(a.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


