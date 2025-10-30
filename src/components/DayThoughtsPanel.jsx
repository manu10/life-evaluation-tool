import React from 'react';

export default function DayThoughtsPanel({ value, onChange, editable = true, label = "Day Thoughts", placeholder = "Reflect on your day...", colorClass = "bg-white", onAddABC }) {
  if (!editable && !value.trim()) return null;
  return (
    <div className={`${colorClass} dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">💭 {label}</h3>
        {editable && typeof onAddABC === 'function' && (
          <button
            type="button"
            onClick={() => onAddABC()}
            className="text-xs px-2 py-1 rounded-md border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            title="Open ABC logger"
          >
            + Add ABC
          </button>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">How did today go? What are you thinking about?</label>
        <textarea
          value={value}
          onChange={e => editable && onChange(e.target.value)}
          disabled={!editable}
          placeholder={placeholder}
          className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none h-32 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 ${!editable ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}`}
        />
        {editable && (
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Tip: Jot down one insight from your 1% learning today.
          </div>
        )}
      </div>
    </div>
  );
} 