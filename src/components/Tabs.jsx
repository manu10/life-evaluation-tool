import React from 'react';
import { Sun, Moon, CheckCircle, Brain, Settings, Zap, Target, LineChart } from 'lucide-react';

export default function Tabs({ activeTab, setActiveTab, eveningDone, distractionCount, showSessions = false }) {
  return (
    <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setActiveTab('today')}
        className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
          activeTab === 'today' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <Zap className="w-5 h-5" />
        During
      </button>
      <button
        onClick={() => setActiveTab('morning')}
        className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
          activeTab === 'morning' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <Sun className="w-5 h-5" />
        Morning
      </button>
      <button
        onClick={() => setActiveTab('evening')}
        className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
          activeTab === 'evening' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <Moon className="w-5 h-5" />
        Evening
        {eveningDone && <CheckCircle className="w-4 h-4 text-green-600" />}
      </button>
      <button
        onClick={() => setActiveTab('distractions')}
        className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
          activeTab === 'distractions' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <Brain className="w-5 h-5" />
        Distractions
        {distractionCount > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
            {distractionCount}
          </span>
        )}
      </button>
      {showSessions && (
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
            activeTab === 'sessions' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Target className="w-5 h-5" />
          Sessions
        </button>
      )}
      <button
        onClick={() => setActiveTab('invest')}
        className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
          activeTab === 'invest' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <LineChart className="w-5 h-5" />
        Invest
      </button>
      <button
        onClick={() => setActiveTab('settings')}
        className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
          activeTab === 'settings' ? 'bg-white text-gray-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <Settings className="w-5 h-5" />
        Settings
      </button>
    </div>
  );
} 