import React from 'react';
import { formatTime } from '../utils/formatTime';

/**
 * FloatingToolbar displays a fixed floating toolbar in the top-right corner
 * with context-sensitive actions based on the current tab.
 * 
 * Features:
 * - Timer/Session countdown display
 * - Mindfulness toolkit access
 * - 5-Step protocol access
 * - Help access
 * - Context-specific actions (copy, session start/end)
 */
export default function FloatingToolbar({
  // Timer props (for morning/evening)
  timeLeft = 0,
  showTimer = false,
  
  // Session props (for during/sessions)
  sessionTimeElapsed = 0,
  showSessionTime = false,
  liveSession = null,
  onStartSession,
  onEndSession,
  
  // Action buttons
  onOpenToolkit,
  onOpenProtocol,
  onOpenHelp,
  
  // Copy button (morning tab)
  showCopyButton = false,
  onCopy,
  copyStatus = false, // false = not copied, true = copied
  
  // Sessions feature flag
  enableSessions = false
}) {
  // Determine what time to display
  const displayTime = showSessionTime ? sessionTimeElapsed : timeLeft;
  const showTimeDisplay = showTimer || showSessionTime;
  const isWarning = showTimer && timeLeft <= 30; // Red warning for low timer

  return (
    <div className="fixed top-4 right-4 bg-white border-2 border-gray-300 rounded-full p-3 shadow-lg z-50">
      <div className="flex items-center gap-2">
        {/* Time display - either timer countdown or session elapsed */}
        {showTimeDisplay && (
          <span className={`text-lg font-bold ${isWarning ? 'text-red-600' : 'text-gray-800'}`}>
            {formatTime(displayTime)}
          </span>
        )}
        
        {/* Session Start/End button */}
        {enableSessions && (onStartSession || onEndSession) && (
          <button
            onClick={() => {
              if (liveSession && onEndSession) {
                onEndSession();
              } else if (!liveSession && onStartSession) {
                onStartSession();
              }
            }}
            className={`px-2 py-1 text-xs rounded-lg border ${
              liveSession 
                ? 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200' 
                : 'bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200'
            }`}
            title={liveSession ? 'End current session' : 'Start focus session'}
          >
            {liveSession ? 'End Session' : 'Start Session'}
          </button>
        )}
        
        {/* Mindfulness Toolkit */}
        {onOpenToolkit && (
          <button
            onClick={onOpenToolkit}
            className="px-2 py-1 text-xs rounded-lg bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200"
            title="Open Mindfulness Toolkit"
          >
            🧘
          </button>
        )}
        
        {/* 5-Step Protocol */}
        {onOpenProtocol && (
          <button
            onClick={onOpenProtocol}
            className="px-2 py-1 text-xs rounded-lg bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200"
            title="Open 5‑Step Protocol"
          >
            5️⃣
          </button>
        )}
        
        {/* Help */}
        {onOpenHelp && (
          <button
            onClick={onOpenHelp}
            className="px-2 py-1 text-xs rounded-lg bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            title="Help & Guide"
          >
            ❓
          </button>
        )}
        
        {/* Copy button (morning tab when timer complete) */}
        {showCopyButton && onCopy && (
          <button
            onClick={onCopy}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded-lg transition-colors ${
              !copyStatus 
                ? 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
            }`}
            title={!copyStatus ? 'Copy morning summary - not copied yet!' : 'Copy morning summary'}
          >
            📋
            {!copyStatus && <span className="text-red-600">⚠️</span>}
          </button>
        )}
      </div>
    </div>
  );
}

