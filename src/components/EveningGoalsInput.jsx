import React from 'react';
import { AlarmClock } from 'lucide-react';

export default function EveningGoalsInput({ eveningResponses, onGoalChange, onFirstHourChange, editable = true }) {
  return (
    <div className="bg-purple-50 rounded-lg p-6 mb-8">
      <div className="mb-6 p-4 border-2 border-blue-500 bg-blue-50 rounded flex items-center gap-4">
        <AlarmClock className="w-6 h-6 text-blue-600" />
        <div className="flex-1">
          <label className="block text-base font-semibold text-blue-800 mb-1">First Hour Activity/Task</label>
          <input
            type="text"
            value={eveningResponses.firstHour || ''}
            onChange={e => editable && onFirstHourChange(e.target.value)}
            disabled={!editable}
            placeholder="What will you do in your first hour tomorrow?"
            className={`w-full p-3 border border-blue-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!editable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>
      </div>
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