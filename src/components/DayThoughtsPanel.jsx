import React from 'react';

export default function DayThoughtsPanel({ value, onChange, editable = true, label = "Day Thoughts", placeholder = "Reflect on your day...", colorClass = "bg-white" }) {
  if (!editable && !value.trim()) return null;
  return (
    <div className={`${colorClass} border border-gray-200 rounded-lg p-6 shadow-sm`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">💭 {label}</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">How did today go? What are you thinking about?</label>
        <textarea
          value={value}
          onChange={e => editable && onChange(e.target.value)}
          disabled={!editable}
          placeholder={placeholder}
          className={`w-full p-3 border border-gray-300 rounded-lg resize-none h-32 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${!editable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
      </div>
    </div>
  );
} 