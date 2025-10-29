import React from 'react';

export default function GoalsList({ goals, onToggle, editable = true, title = "Goals", colorClass = "bg-blue-50" }) {
  if (!goals || Object.values(goals).every(goal => !goal.text.trim())) return null;
  return (
    <div className={`${colorClass} dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8`}>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>
      <div className="space-y-3">
        {Object.entries(goals).map(([key, goal]) => {
          if (!goal.text.trim()) return null;
          return (
            <div key={key} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => onToggle && onToggle(key.replace('goal', ''))}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                disabled={!editable}
              />
              <span className={`text-gray-800 dark:text-gray-100 ${goal.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>{goal.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 