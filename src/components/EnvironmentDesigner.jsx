import React, { useState } from 'react';

const REMOVAL_PRESETS = [
  'Remove phone from desk',
  'Log out of social media',
  'Close distracting tabs',
  'Silence notifications',
  'Put snacks/drinks away'
];

const ADDITION_PRESETS = [
  'Add a plant to workspace',
  'Ambient focus playlist',
  'Place a calming photo',
  'Set a desk lamp (warm light)',
  'Keep water bottle visible'
];

export default function EnvironmentDesigner({ profile, onProfileChange }) {
  const [removalInput, setRemovalInput] = useState('');
  const [additionInput, setAdditionInput] = useState('');

  const removals = profile?.removals || [];
  const additions = profile?.additions || [];

  function addRemoval() {
    const text = removalInput.trim();
    if (!text) return;
    if (!removals.includes(text)) update({ removals: [text, ...removals] });
    setRemovalInput('');
  }
  function addAddition() {
    const text = additionInput.trim();
    if (!text) return;
    if (!additions.includes(text)) update({ additions: [text, ...additions] });
    setAdditionInput('');
  }
  function removeRemoval(text) {
    update({ removals: removals.filter((r) => r !== text) });
  }
  function removeAddition(text) {
    update({ additions: additions.filter((a) => a !== text) });
  }
  function togglePreset(type, text) {
    if (type === 'removal') {
      if (removals.includes(text)) removeRemoval(text);
      else update({ removals: [text, ...removals] });
    } else {
      if (additions.includes(text)) removeAddition(text);
      else update({ additions: [text, ...additions] });
    }
  }
  function update(patch) {
    const next = { ...(profile || { removals: [], additions: [] }), ...patch };
    if (typeof onProfileChange === 'function') onProfileChange(next);
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Environment Designer</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Engineer your space: remove anxiety cues and add calming anchors.</p>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Remove cues</h4>
          <div className="flex gap-2 mb-3">
            <input
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="e.g., Remove phone from desk"
              value={removalInput}
              onChange={(e) => setRemovalInput(e.target.value)}
            />
            <button onClick={addRemoval} className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Add</button>
          </div>
          <PresetList
            type="removal"
            items={REMOVAL_PRESETS}
            selected={removals}
            onToggle={togglePreset}
          />
          <TagList tags={removals} onRemove={removeRemoval} color="red" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Add anchors</h4>
          <div className="flex gap-2 mb-3">
            <input
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="e.g., Add a plant to workspace"
              value={additionInput}
              onChange={(e) => setAdditionInput(e.target.value)}
            />
            <button onClick={addAddition} className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Add</button>
          </div>
          <PresetList
            type="addition"
            items={ADDITION_PRESETS}
            selected={additions}
            onToggle={togglePreset}
          />
          <TagList tags={additions} onRemove={removeAddition} color="green" />
        </div>
      </div>
    </div>
  );
}

function PresetList({ type, items, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {items.map((text) => {
        const isOn = selected.includes(text);
        const cls = isOn ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600';
        return (
          <button
            key={text}
            type="button"
            onClick={() => onToggle(type, text)}
            className={`px-2 py-1 rounded-md text-xs ${cls}`}
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}

function TagList({ tags, onRemove, color }) {
  if (!tags || tags.length === 0) return <p className="text-sm text-gray-600 dark:text-gray-400">None yet.</p>;
  const colorCls = color === 'red'
    ? 'border-red-300 dark:border-red-700 text-red-800 dark:text-red-200'
    : 'border-green-300 dark:border-green-700 text-green-800 dark:text-green-200';
  return (
    <ul className="space-y-2">
      {tags.map((t) => (
        <li key={t} className={`flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 border ${colorCls} rounded-md`}>
          <span className="text-sm text-gray-800 dark:text-gray-100">{t}</span>
          <button onClick={() => onRemove(t)} className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">Remove</button>
        </li>
      ))}
    </ul>
  );
}


