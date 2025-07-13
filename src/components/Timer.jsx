import React from 'react';
import { Clock, Play, Pause, RotateCcw, CheckCircle, Check } from 'lucide-react';
import { formatTime } from '../utils/formatTime';

export default function Timer({
  timeLeft,
  isRunning,
  isComplete,
  eveningDone,
  activeTab,
  onStart,
  onPause,
  onReset,
  onMarkEveningDone,
  canResume,
  canMarkDone
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-semibold text-gray-800">{formatTime(timeLeft)}</span>
          {(isComplete || eveningDone) && <CheckCircle className="w-6 h-6 text-green-600" />}
        </div>
        <div className="flex gap-2">
          {!isRunning && timeLeft === 120 && (
            <button onClick={onStart} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Play className="w-4 h-4" />Start
            </button>
          )}
          {isRunning && (
            <button onClick={onPause} className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              <Pause className="w-4 h-4" />Pause
            </button>
          )}
          {canResume && (
            <button onClick={onStart} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Play className="w-4 h-4" />Resume
            </button>
          )}
          {activeTab === 'evening' && canMarkDone && (
            <button onClick={onMarkEveningDone} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Check className="w-4 h-4" />Done
            </button>
          )}
          <button onClick={onReset} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <RotateCcw className="w-4 h-4" />Reset
          </button>
        </div>
      </div>
    </div>
  );
} 