import React from 'react';
import { Sun, Moon, CheckCircle, Brain, Settings, Zap, Target, LineChart } from 'lucide-react';

export default function Tabs({ activeTab, setActiveTab, eveningDone, distractionCount, showSessions = false, showInvest = true, showProjects = false, showDistractions = true }) {
  return (
    <div className="flex mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setActiveTab('today')}
        className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
          activeTab === 'today' ? 'bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
      >
        <Zap className="w-5 h-5" />
        During
      </button>
      <button
        onClick={() => setActiveTab('morning')}
        className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
          activeTab === 'morning' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
      >
        <Sun className="w-5 h-5" />
        Morning
      </button>
      <button
        onClick={() => setActiveTab('evening')}
        className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
          activeTab === 'evening' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
      >
        <Moon className="w-5 h-5" />
        Evening
        {eveningDone && <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />}
      </button>
      {showDistractions && (
        <button
          onClick={() => setActiveTab('distractions')}
          className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
            activeTab === 'distractions' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Brain className="w-5 h-5" />
          Distractions
          {distractionCount > 0 && (
            <span className="bg-red-500 dark:bg-red-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
              {distractionCount}
            </span>
          )}
        </button>
      )}
      {showSessions && (
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
            activeTab === 'sessions' ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Target className="w-5 h-5" />
          Sessions
        </button>
      )}
      {showProjects && (
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
            activeTab === 'projects' ? 'bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Target className="w-5 h-5" />
          Projects
        </button>
      )}
      {showInvest && (
        <button
          onClick={() => setActiveTab('invest')}
          className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
            activeTab === 'invest' ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <LineChart className="w-5 h-5" />
          Invest
        </button>
      )}
      <button
        onClick={() => setActiveTab('settings')}
        className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
          activeTab === 'settings' ? 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
      >
        <Settings className="w-5 h-5" />
        Settings
      </button>
    </div>
  );
}
