import React from 'react';
import { AlarmClock } from 'lucide-react';

export default function EveningGoalsInput({ eveningResponses, onGoalChange, onFirstHourChange, onOnePercentPlanChange, onOnePercentLinkChange, editable = true }) {
  return (
    <div className="bg-purple-50 dark:bg-purple-900/20 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8">
      <div className="mb-6 p-4 border-2 border-blue-500 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 rounded flex items-center gap-4">
        <AlarmClock className="w-6 h-6 text-blue-600" />
        <div className="flex-1">
          <label className="block text-base font-semibold text-blue-800 dark:text-blue-300 mb-1">First Hour Activity/Task</label>
          <input
            type="text"
            value={eveningResponses.firstHour || ''}
            onChange={e => editable && onFirstHourChange(e.target.value)}
            disabled={!editable}
            placeholder="What will you do in your first hour tomorrow?"
            className={`w-full p-3 border border-blue-300 dark:border-blue-700 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${!editable ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}`}
          />
        </div>
      </div>
      <div className="mb-6 p-4 border-2 border-emerald-500 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 rounded">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <label className="block text-base font-semibold text-emerald-800 dark:text-emerald-300 mb-1">📈 1% Better Learning (15–30 min)</label>
            <input
              type="text"
              value={eveningResponses.onePercentPlan || ''}
              onChange={e => editable && onOnePercentPlanChange && onOnePercentPlanChange(e.target.value)}
              disabled={!editable}
              placeholder="E.g., Read Chapter 2 of Atomic Habits, or Watch: https://…"
              className={`w-full p-3 border border-emerald-300 dark:border-emerald-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${!editable ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}`}
            />
            <input
              type="url"
              value={eveningResponses.onePercentLink || ''}
              onChange={e => editable && onOnePercentLinkChange && onOnePercentLinkChange(e.target.value)}
              disabled={!editable}
              placeholder="Optional link (YouTube, podcast, article)"
              className={`mt-2 w-full p-3 border border-emerald-300 dark:border-emerald-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${!editable ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}`}
            />
            <p className="mt-2 text-xs text-emerald-900">Keep it specific and short. Something you can finish over breakfast or on the bus.</p>
          </div>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">🎯 Tomorrow's 3 Main Goals</h3>
      <div className="space-y-4">
        {[1, 2, 3].map((num) => (
          <div key={num}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Goal {num}</label>
            <input
              type="text"
              value={eveningResponses[`goal${num}`]}
              onChange={e => editable && onGoalChange(num, e.target.value)}
              disabled={!editable}
              placeholder="What's one important thing you want to accomplish tomorrow?"
              className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${!editable ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 