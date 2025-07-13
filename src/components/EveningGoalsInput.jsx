import React from 'react';

export default function EveningGoalsInput({ eveningResponses, onGoalChange, editable = true }) {
  return (
    <div className="bg-purple-50 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Tomorrow's 3 Main Goals</h3>
      <div className="space-y-4">
        {[1, 2, 3].map((num) => (
          <div key={num}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Goal {num}</label>
            <input
              type="text"
              value={eveningResponses[`goal${num}`]}
              onChange={e => editable && onGoalChange(num, e.target.value)}
              disabled={!editable}
              placeholder="What's one important thing you want to accomplish tomorrow?"
              className={`w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${!editable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 