import React from 'react';
import { Sun, Moon, CheckCircle } from 'lucide-react';

export default function Tabs({ activeTab, setActiveTab, eveningDone }) {
  return (
    <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setActiveTab('morning')}
        className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
          activeTab === 'morning' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <Sun className="w-5 h-5" />
        Morning Check-In
      </button>
      <button
        onClick={() => setActiveTab('evening')}
        className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
          activeTab === 'evening' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <Moon className="w-5 h-5" />
        Evening Reflection
        {eveningDone && <CheckCircle className="w-4 h-4 text-green-600" />}
      </button>
    </div>
  );
} 