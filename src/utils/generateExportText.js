import { formatDistractionsForExport } from './distractionUtils';

// Function to parse time string and convert to minutes (reused from PhoneUsageInput)
function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  
  const parts = timeStr.split(' ');
  let totalMinutes = 0;
  
  for (const part of parts) {
    if (part.endsWith('h')) {
      totalMinutes += parseInt(part.slice(0, -1)) * 60;
    } else if (part.endsWith('m')) {
      totalMinutes += parseInt(part.slice(0, -1));
    }
  }
  
  return totalMinutes;
}

// Function to get phone usage feedback for export
function getPhoneUsageFeedback(timeStr) {
  const minutes = parseTimeToMinutes(timeStr);
  
  if (minutes < 45) {
    return {
      emoji: '💚',
      message: '🎉✨ Great job! Your phone usage is in a healthy range. 📱💚'
    };
  } else if (minutes <= 90) {
    return {
      emoji: '⚠️',
      message: '⚠️📊 Moderate usage. Consider reducing screen time for better balance. 🧘‍♂️⏰'
    };
  } else {
    return {
      emoji: '🚨',
      message: '🚨📱 High usage detected. Consider setting phone usage limits. 🔒💪'
    };
  }
}

/**
 * Generates the export text for morning or evening summary.
 * @param {Object} params
 * @param {boolean} params.isEvening
 * @param {Object} params.eveningResponses
 * @param {Object} params.yesterdaysGoals
 * @param {string} params.yesterdaysDayThoughts
 * @param {string} params.yesterdaysPhoneUsage
 * @param {Array} params.yesterdaysRoutines
 * @param {Array} params.dailyRoutines
 * @param {Array} params.distractions
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
  yesterdaysPhoneUsage = '',
  yesterdaysRoutines = [],
  dailyRoutines = [],
  distractions = [],
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

    // Phone usage for evening
    if (eveningResponses.phoneUsage && eveningResponses.phoneUsage.trim() && eveningResponses.phoneUsage !== '0m') {
      const feedback = getPhoneUsageFeedback(eveningResponses.phoneUsage);
      exportText += `📱 Phone Usage Today: ${feedback.emoji} **${eveningResponses.phoneUsage}**\n`;
      exportText += `   ${feedback.message}\n\n`;
    }

    // Daily routines setup for evening
    const hasRoutines = dailyRoutines.some(routine => routine.text && routine.text.trim() !== '');
    if (hasRoutines) {
      exportText += `📋 Daily Routines Setup:\n`;
      dailyRoutines.forEach((routine, index) => {
        if (routine.text && routine.text.trim()) {
          exportText += `   ${index + 1}. ${routine.text}\n`;
        }
      });
      exportText += `\n`;
    }

    // Distractions for evening
    const distractionExport = formatDistractionsForExport(distractions);
    if (distractionExport) {
      exportText += distractionExport;
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

    // Yesterday's phone usage if available
    if (yesterdaysPhoneUsage && yesterdaysPhoneUsage.trim() && yesterdaysPhoneUsage !== '0m') {
      const feedback = getPhoneUsageFeedback(yesterdaysPhoneUsage);
      exportText += `📱 Yesterday's Phone Usage: ${feedback.emoji} **${yesterdaysPhoneUsage}**\n`;
      exportText += `   ${feedback.message}\n\n`;
    }

    // Yesterday's daily routines if available
    const hasYesterdayRoutines = yesterdaysRoutines.some(routine => routine.text && routine.text.trim() !== '');
    if (hasYesterdayRoutines) {
      exportText += `📋 Yesterday's Daily Routines:\n`;
      yesterdaysRoutines.forEach((routine, index) => {
        if (routine.text && routine.text.trim()) {
          const status = routine.completed ? '✅' : '❌';
          exportText += `   ${status} ${routine.text}\n`;
        }
      });
      exportText += `\n`;
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