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
 * @param {Array} params.yesterdaysDistractions
 * @param {Object} params.todaysGoals
 * @param {Array} params.lifeAreas
 * @param {Object} params.morningResponses
 * @param {Array} params.feelingOptions
 * @param {Object} params.gratitude
 * @param {Array} params.microPracticeLogs
 * @param {Array} params.abcLogs
 * @param {Object} params.mindfulnessSettings
 * @param {Object} params.environmentProfile
 * @param {Array} params.replacementAttempts
 * @param {Array} params.environmentApplications
 * @param {Array} params.anxietyRatings
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
  yesterdaysDistractions = [],
  todaysGoals = {},
  lifeAreas = [],
  morningResponses = {},
  feelingOptions = [],
  gratitude = {},
  yesterdaysGratitude = {},
  microPracticeLogs = [],
  abcLogs = [],
  mindfulnessSettings = {},
  environmentProfile = { removals: [], additions: [] },
  replacementAttempts = [],
  environmentApplications = [],
  anxietyRatings = []
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

    // Environment updates
    const hasEnv = (environmentProfile?.removals?.length || 0) + (environmentProfile?.additions?.length || 0) > 0;
    if (hasEnv) {
      exportText += `🏡 Environment Updates:\n`;
      if (environmentProfile.removals?.length) {
        exportText += `   Removed cues: ${environmentProfile.removals.join(', ')}\n`;
      }
      if (environmentProfile.additions?.length) {
        exportText += `   Added anchors: ${environmentProfile.additions.join(', ')}\n`;
      }
      exportText += `\n`;
    }

    // Replacement summary (evening)
    if (replacementAttempts && replacementAttempts.length > 0) {
      const today = new Date().toDateString();
      const todayAttempts = replacementAttempts.filter(a => new Date(a.ts).toDateString() === today);
      if (todayAttempts.length > 0) {
        const helped = todayAttempts.filter(a => a.helped).length;
        const rewards = todayAttempts.filter(a => a.rewardGiven).length;
        exportText += `🔁 Replacement Summary Today: ${helped}/${todayAttempts.length} helped, ${rewards} rewards taken\n\n`;
      }
    }

    // Distractions for evening
    const distractionExport = formatDistractionsForExport(distractions);
    if (distractionExport) {
      exportText += distractionExport;
    }
  } else {
    // Protocol activity summary (morning export)
    if (microPracticeLogs && microPracticeLogs.length > 0) {
      const counts = microPracticeLogs.reduce((acc, m) => { acc[m.type] = (acc[m.type]||0)+1; return acc; }, {});
      const parts = [];
      if (counts.breaths) parts.push(`breaths: ${counts.breaths}`);
      if (counts.posture) parts.push(`posture: ${counts.posture}`);
      if (counts.anchor) parts.push(`anchors: ${counts.anchor}`);
      if (counts.pause) parts.push(`pauses: ${counts.pause}`);
      if (parts.length > 0) {
        exportText += `🧩 Protocol Activity: ${parts.join(', ')}\n\n`;
      }
    }

    // ABC highlights (show last up to 3 entries compact)
    if (abcLogs && abcLogs.length > 0) {
      exportText += `📋 ABC Highlights (recent):\n`;
      abcLogs.slice(0, 3).forEach((log, idx) => {
        const when = new Date(log.ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        exportText += `   ${idx+1}. [${when}] Setting: ${log.setting || '-'} | Antecedent: ${log.antecedent || '-'} | Behavior: ${log.behavior || '-'}\n`;
      });
      exportText += `\n`;
    }

    // Replacement summary (morning)
    if (replacementAttempts && replacementAttempts.length > 0) {
      const today = new Date().toDateString();
      const todayAttempts = replacementAttempts.filter(a => new Date(a.ts).toDateString() === today);
      if (todayAttempts.length > 0) {
        const helped = todayAttempts.filter(a => a.helped).length;
        const rewards = todayAttempts.filter(a => a.rewardGiven).length;
        const topAction = findTopHelpfulAction(todayAttempts);
        exportText += `🔁 Replacement Summary Today: ${helped}/${todayAttempts.length} helped, ${rewards} rewards taken\n`;
        if (topAction) exportText += `   Top action: ${topAction.title} (${topAction.helped}/${topAction.total})\n`;
        exportText += `\n`;
      }
    }

    // Environment adherence
    if (environmentApplications && environmentApplications.length > 0) {
      const today = new Date().toDateString();
      const todayEnv = environmentApplications.filter(a => new Date(a.ts).toDateString() === today);
      if (todayEnv.length > 0) {
        exportText += `🏡 Environment Applied Today: ${todayEnv.length} item(s)\n\n`;
      }
    }

    // Anxiety rating (last)
    if (anxietyRatings && anxietyRatings.length > 0) {
      const last = anxietyRatings[0];
      const when = new Date(last.ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      exportText += `🧠 Anxiety Rating: ${last.rating}/10 at ${when}${last.notes ? ` — ${last.notes}` : ''}\n\n`;
    }
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

    // Yesterday's distractions if available
    const yesterdayDistractionExport = formatDistractionsForExport(yesterdaysDistractions);
    if (yesterdayDistractionExport) {
      exportText += `📊 Yesterday's Focus & Distractions:\n`;
      exportText += yesterdayDistractionExport;
    }

    // Today's gratitude
    const hasGratitude = Object.values(gratitude).some(item => item && item.trim() !== '');
    if (hasGratitude) {
      exportText += `🙏 Daily Gratitude:\n`;
      Object.entries(gratitude).forEach(([key, item], index) => {
        if (item && item.trim()) {
          exportText += `   ${index + 1}. ${item}\n`;
        }
      });
      exportText += `\n`;
    }

    if (eveningResponses.firstHour && eveningResponses.firstHour.trim()) {
      exportText += `🕒 First Hour Activity/Task:\n${eveningResponses.firstHour}\n\n`;
    }

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

function findTopHelpfulAction(attempts) {
  const map = {};
  attempts.forEach(a => {
    const t = a.title || a.actionTitle;
    if (!t) return;
    if (!map[t]) map[t] = { title: t, helped: 0, total: 0 };
    map[t].total += 1;
    if (a.helped) map[t].helped += 1;
  });
  const arr = Object.values(map);
  arr.sort((a, b) => (b.helped / Math.max(1, b.total)) - (a.helped / Math.max(1, a.total)) || b.helped - a.helped);
  return arr[0];
}