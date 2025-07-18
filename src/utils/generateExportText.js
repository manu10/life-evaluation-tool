/**
 * Generates the export text for morning or evening summary.
 * @param {Object} params
 * @param {boolean} params.isEvening
 * @param {Object} params.eveningResponses
 * @param {Object} params.yesterdaysGoals
 * @param {string} params.yesterdaysDayThoughts
 * @param {Object} params.todaysGoals
 * @param {Array} params.lifeAreas
 * @param {Object} params.morningResponses
 * @param {Array} params.feelingOptions
 * @returns {string}
 */
export function generateExportText({
  isEvening = false,
  eveningResponses = {},
  yesterdaysGoals = {},
  yesterdaysDayThoughts = '',
  todaysGoals = {},
  lifeAreas = [],
  morningResponses = {},
  feelingOptions = []
}) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  let exportText = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  exportText += `${isEvening ? '🌙 EVENING REFLECTION' : '🌅 MORNING CHECK-IN'} - ${dateStr}\n`;
  exportText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (isEvening) {
    exportText += `🎯 Tomorrow's Goals:\n`;
    [eveningResponses.goal1, eveningResponses.goal2, eveningResponses.goal3].forEach((goal, index) => {
      if (goal && goal.trim()) exportText += `   ${index + 1}. ${goal}\n`;
    });
    exportText += `\n`;

    if (eveningResponses.firstHour && eveningResponses.firstHour.trim()) {
      exportText += `🕒 First Hour Activity/Task:\n${eveningResponses.firstHour}\n\n`;
    }

    exportText += `\n`;

    if (eveningResponses.dayThoughts && eveningResponses.dayThoughts.trim()) {
      exportText += `💭 Day Thoughts:\n${eveningResponses.dayThoughts}\n\n`;
    }
  } else {
    // Yesterday's goals if available
    const hasYesterdayGoals = Object.values(yesterdaysGoals).some(goal => goal.text && goal.text.trim() !== '');
    if (hasYesterdayGoals) {
      exportText += `📋 Yesterday's Goals:\n`;
      Object.entries(yesterdaysGoals).forEach(([key, goal]) => {
        if (goal.text && goal.text.trim()) {
          const status = goal.completed ? '✅' : '❌';
          exportText += `   ${status} ${goal.text}\n`;
        }
      });
      exportText += `\n`;
    }

    // Yesterday's day thoughts if available
    if (yesterdaysDayThoughts && yesterdaysDayThoughts.trim()) {
      exportText += `💭 Yesterday's Day Thoughts:\n${yesterdaysDayThoughts}\n\n`;
    }

    // Today's goals


    if (eveningResponses.firstHour && eveningResponses.firstHour.trim()) {
      exportText += `🕒 First Hour Activity/Task:\n${eveningResponses.firstHour}\n\n`;
    }

    exportText += `\n`;

    const hasTodayGoals = Object.values(todaysGoals).some(goal => goal.text && goal.text.trim() !== '');
    if (hasTodayGoals) {
      exportText += `📋 Today's Goals:\n`;
      Object.entries(todaysGoals).forEach(([key, goal]) => {
        if (goal.text && goal.text.trim()) {
          const status = goal.completed ? '✅' : '⏳';
          exportText += `   ${status} ${goal.text}\n`;
        }
      });
      exportText += `\n`;
    }

    exportText += `🎯 Life Areas:\n`;
    lifeAreas.forEach((area) => {
      const response = morningResponses[area];
      if (response && response.feeling) {
        const selectedFeeling = feelingOptions.find(opt => opt.value === response.feeling);
        exportText += `🔸 ${area}: ${selectedFeeling ? selectedFeeling.label : response.feeling}\n`;
        if (response.notes && response.notes.trim()) exportText += `   💭 ${response.notes}\n`;
        exportText += `\n`;
      }
    });
  }

  exportText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  return exportText;
} 