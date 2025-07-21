// Utility functions for distraction data processing and analysis

/**
 * Get distraction statistics for analysis
 * @param {Array} distractions - Array of distraction objects
 * @returns {Object} Statistics object with various metrics
 */
export function getDistractionStats(distractions) {
  if (!Array.isArray(distractions) || distractions.length === 0) {
    return {
      total: 0,
      topTriggers: [],
      triggerCounts: {},
      mostCommonDistraction: null,
      distractionCounts: {},
      timeSpread: []
    };
  }

  // Count triggers
  const triggerCounts = {};
  distractions.forEach(d => {
    const triggerValue = d.trigger?.value || 'unknown';
    triggerCounts[triggerValue] = (triggerCounts[triggerValue] || 0) + 1;
  });

  // Count distractions
  const distractionCounts = {};
  distractions.forEach(d => {
    const distraction = d.distraction || 'unknown';
    distractionCounts[distraction] = (distractionCounts[distraction] || 0) + 1;
  });

  // Get top triggers (sorted by count)
  const topTriggers = Object.entries(triggerCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Get most common distraction
  const mostCommonDistraction = Object.entries(distractionCounts)
    .sort(([,a], [,b]) => b - a)[0];

  // Group by time periods (for potential time analysis)
  const timeSpread = distractions.map(d => ({
    timestamp: d.timestamp,
    hour: new Date().getHours() // This would need actual timestamp parsing in real implementation
  }));

  return {
    total: distractions.length,
    topTriggers,
    triggerCounts,
    mostCommonDistraction: mostCommonDistraction ? {
      name: mostCommonDistraction[0],
      count: mostCommonDistraction[1]
    } : null,
    distractionCounts,
    timeSpread
  };
}

/**
 * Format distraction data for export
 * @param {Array} distractions - Array of distraction objects
 * @returns {String} Formatted text for export
 */
export function formatDistractionsForExport(distractions) {
  if (!Array.isArray(distractions) || distractions.length === 0) {
    return '';
  }

  const stats = getDistractionStats(distractions);
  let exportText = `🧠 Distractions Today (${stats.total} total):\n`;

  // List all distractions with triggers
  distractions.forEach((distraction, index) => {
    exportText += `   ${index + 1}. ${distraction.distraction} (${distraction.trigger.label}) - ${distraction.timestamp}\n`;
  });

  // Add trigger analysis
  if (stats.topTriggers.length > 0) {
    exportText += `\n📊 Top Emotional Triggers:\n`;
    stats.topTriggers.forEach(([trigger, count], index) => {
      exportText += `   ${index + 1}. ${trigger}: ${count} times\n`;
    });
  }

  return exportText + '\n';
}

/**
 * Get reflection insights based on distraction patterns
 * @param {Array} distractions - Array of distraction objects
 * @returns {Object} Insights object with suggestions and observations
 */
export function getDistractionInsights(distractions) {
  const stats = getDistractionStats(distractions);
  const insights = {
    observations: [],
    suggestions: [],
    patterns: []
  };

  if (stats.total === 0) {
    insights.observations.push("🎯 Excellent focus today! No distractions tracked.");
    insights.suggestions.push("Keep up the great work maintaining your focus.");
    return insights;
  }

  // High distraction count
  if (stats.total >= 10) {
    insights.observations.push(`🚨 High distraction day: ${stats.total} distractions tracked.`);
    insights.suggestions.push("Consider implementing focused work blocks or removing distraction sources.");
  } else if (stats.total >= 5) {
    insights.observations.push(`⚠️ Moderate distraction day: ${stats.total} distractions tracked.`);
    insights.suggestions.push("Look for patterns in your triggers to build better awareness.");
  } else {
    insights.observations.push(`✅ Good focus day: Only ${stats.total} distractions tracked.`);
  }

  // Top trigger analysis
  if (stats.topTriggers.length > 0) {
    const topTrigger = stats.topTriggers[0];
    insights.patterns.push(`Your main emotional trigger today was "${topTrigger[0]}" (${topTrigger[1]} times).`);
    
    // Trigger-specific suggestions
    switch (topTrigger[0]) {
      case 'bored':
        insights.suggestions.push("When bored, try having a list of engaging activities ready.");
        break;
      case 'anxious':
        insights.suggestions.push("Consider breathing exercises or mindfulness when feeling anxious.");
        break;
      case 'stressed':
        insights.suggestions.push("Break large tasks into smaller chunks to reduce stress-induced distractions.");
        break;
      case 'procrastinating':
        insights.suggestions.push("Try the 2-minute rule: if it takes less than 2 minutes, do it now.");
        break;
      default:
        insights.suggestions.push(`Notice when you feel "${topTrigger[0]}" and have a coping strategy ready.`);
    }
  }

  // Most common distraction
  if (stats.mostCommonDistraction) {
    insights.patterns.push(`"${stats.mostCommonDistraction.name}" was your most frequent distraction (${stats.mostCommonDistraction.count} times).`);
    insights.suggestions.push(`Consider limiting access to "${stats.mostCommonDistraction.name}" during focused work time.`);
  }

  return insights;
}

/**
 * Create a summary object for easy component consumption
 * @param {Array} distractions - Array of distraction objects
 * @returns {Object} Summary object with stats, insights, and formatted data
 */
export function createDistractionSummary(distractions) {
  const stats = getDistractionStats(distractions);
  const insights = getDistractionInsights(distractions);
  const exportText = formatDistractionsForExport(distractions);

  return {
    stats,
    insights,
    exportText,
    hasDistractions: stats.total > 0,
    focusScore: Math.max(0, 100 - (stats.total * 5)) // Simple focus score calculation
  };
} 