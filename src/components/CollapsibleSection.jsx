import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function CollapsibleSection({ 
  title, 
  children, 
  defaultExpanded = false,
  summary = "",
  icon = null,
  className = ""
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`mb-8 ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-2xl">{icon}</span>}
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
            {summary && !isExpanded && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{summary}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-6">
          {children}
        </div>
      )}
    </div>
  );
} 