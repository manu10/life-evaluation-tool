import React from 'react';
import { Brain, TrendingUp, Lightbulb, Eye, Target } from 'lucide-react';
import { createDistractionSummary } from '../utils/distractionUtils';

/**
 * Reusable component for displaying distraction insights and analysis
 * Can be used in different tabs (evening reflection, morning review, etc.)
 */
export default function DistractionInsights({ 
  distractions, 
  title = "Focus & Distraction Analysis",
  showFullDetails = true,
  colorTheme = "purple" // purple, blue, gray
}) {
  const summary = createDistractionSummary(distractions);
  
  // Theme colors
  const themes = {
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      titleColor: 'text-purple-800',
      iconColor: 'text-purple-600',
      accentColor: 'bg-purple-100'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      titleColor: 'text-blue-800',
      iconColor: 'text-blue-600',
      accentColor: 'bg-blue-100'
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      titleColor: 'text-gray-800',
      iconColor: 'text-gray-600',
      accentColor: 'bg-gray-100'
    }
  };

  const theme = themes[colorTheme];

  if (!summary.hasDistractions) {
    return (
      <div className={`${theme.bg} ${theme.border} border rounded-lg p-6`}>
        <h3 className={`text-lg font-semibold ${theme.titleColor} mb-4 flex items-center gap-2`}>
          <Brain className={`w-5 h-5 ${theme.iconColor}`} />
          {title}
        </h3>
        <div className="text-center py-6">
          <Target className={`w-12 h-12 mx-auto mb-3 ${theme.iconColor} opacity-50`} />
          <p className={`text-lg font-medium ${theme.titleColor} mb-2`}>🎯 Perfect Focus Day!</p>
          <p className="text-gray-600">No distractions tracked today. Keep up the excellent work!</p>
          <div className={`mt-4 p-3 ${theme.accentColor} rounded-lg`}>
            <p className={`text-sm ${theme.titleColor} font-medium`}>
              Focus Score: 100/100 ✨
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.bg} ${theme.border} border rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme.titleColor} flex items-center gap-2`}>
          <Brain className={`w-5 h-5 ${theme.iconColor}`} />
          {title}
        </h3>
        <div className={`px-3 py-1 ${theme.accentColor} rounded-full`}>
          <span className={`text-sm font-medium ${theme.titleColor}`}>
            Focus Score: {summary.focusScore}/100
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-3 bg-white border ${theme.border} rounded-lg`}>
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${theme.iconColor}`} />
            <span className="text-sm font-medium text-gray-700">Total Distractions</span>
          </div>
          <p className={`text-2xl font-bold ${theme.titleColor} mt-1`}>{summary.stats.total}</p>
        </div>
        
        {summary.stats.topTriggers.length > 0 && (
          <div className={`p-3 bg-white border ${theme.border} rounded-lg`}>
            <div className="flex items-center gap-2">
              <Brain className={`w-4 h-4 ${theme.iconColor}`} />
              <span className="text-sm font-medium text-gray-700">Top Trigger</span>
            </div>
            <p className={`text-lg font-semibold ${theme.titleColor} mt-1 capitalize`}>
              {summary.stats.topTriggers[0][0]}
            </p>
            <p className="text-xs text-gray-500">{summary.stats.topTriggers[0][1]} times</p>
          </div>
        )}
      </div>

      {/* Observations */}
      {summary.insights.observations.length > 0 && (
        <div className="mb-4">
          <h4 className={`text-sm font-semibold ${theme.titleColor} mb-2 flex items-center gap-1`}>
            <Eye className="w-4 h-4" />
            Observations
          </h4>
          <div className="space-y-2">
            {summary.insights.observations.map((observation, index) => (
              <p key={index} className="text-sm text-gray-700 bg-white p-2 rounded border-l-4 border-blue-400">
                {observation}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Patterns */}
      {showFullDetails && summary.insights.patterns.length > 0 && (
        <div className="mb-4">
          <h4 className={`text-sm font-semibold ${theme.titleColor} mb-2 flex items-center gap-1`}>
            <TrendingUp className="w-4 h-4" />
            Patterns
          </h4>
          <div className="space-y-2">
            {summary.insights.patterns.map((pattern, index) => (
              <p key={index} className="text-sm text-gray-700 bg-white p-2 rounded border-l-4 border-yellow-400">
                {pattern}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {summary.insights.suggestions.length > 0 && (
        <div>
          <h4 className={`text-sm font-semibold ${theme.titleColor} mb-2 flex items-center gap-1`}>
            <Lightbulb className="w-4 h-4" />
            Suggestions for Tomorrow
          </h4>
          <div className="space-y-2">
            {summary.insights.suggestions.map((suggestion, index) => (
              <p key={index} className="text-sm text-gray-700 bg-white p-2 rounded border-l-4 border-green-400">
                💡 {suggestion}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Top Triggers Summary (if full details) */}
      {showFullDetails && summary.stats.topTriggers.length > 1 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className={`text-sm font-semibold ${theme.titleColor} mb-2`}>
            Trigger Breakdown
          </h4>
          <div className="flex flex-wrap gap-2">
            {summary.stats.topTriggers.slice(0, 3).map(([trigger, count]) => (
              <span
                key={trigger}
                className={`px-2 py-1 text-xs rounded-full bg-white border ${theme.border} ${theme.titleColor}`}
              >
                {trigger}: {count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 