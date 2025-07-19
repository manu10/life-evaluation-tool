import React from 'react';
import { Smartphone } from 'lucide-react';

// Function to parse time string and convert to minutes
function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  
  // Handle the new format "Xh Ym" from our time selector
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

// Function to parse time string into hours and minutes
function parseTimeToHoursMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return { hours: 0, minutes: 0 };
  
  const parts = timeStr.split(' ');
  let hours = 0;
  let minutes = 0;
  
  for (const part of parts) {
    if (part.endsWith('h')) {
      hours = parseInt(part.slice(0, -1));
    } else if (part.endsWith('m')) {
      minutes = parseInt(part.slice(0, -1));
    }
  }
  
  return { hours, minutes };
}

// Function to format hours and minutes into time string
function formatTimeString(hours, minutes) {
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  return parts.join(' ') || '0m';
}

// Function to get color classes based on usage time
function getUsageColorClasses(timeStr, isYesterday = false) {
  if (!isYesterday) return { borderColor: 'border-gray-200', titleColor: 'text-gray-800' };
  
  const minutes = parseTimeToMinutes(timeStr);
  
  if (minutes < 45) {
    return { 
      borderColor: 'border-green-300', 
      titleColor: 'text-green-800',
      bgColor: 'bg-green-50',
      message: '🎉✨ Great job! Your phone usage is in a healthy range. 📱💚',
      messageColor: 'text-green-700'
    };
  } else if (minutes <= 90) {
    return { 
      borderColor: 'border-yellow-300', 
      titleColor: 'text-yellow-800',
      bgColor: 'bg-yellow-50',
      message: '⚠️📊 Moderate usage. Consider reducing screen time for better balance. 🧘‍♂️⏰',
      messageColor: 'text-yellow-700'
    };
  } else {
    return { 
      borderColor: 'border-red-300', 
      titleColor: 'text-red-800',
      bgColor: 'bg-red-50',
      message: '🚨📱 High usage detected. Consider setting phone usage limits. 🔒💪',
      messageColor: 'text-red-700'
    };
  }
}

export default function PhoneUsageInput({ value, onChange, editable = true, label = "Phone Usage Time", placeholder = "e.g., 2h 30m", colorClass = "bg-white" }) {
  if (!editable && !(value || '').trim()) return null;
  
  const isYesterday = label.includes("Yesterday");
  const colorClasses = getUsageColorClasses(value, isYesterday);
  const finalColorClass = isYesterday ? colorClasses.bgColor : colorClass;
  const finalBorderColor = isYesterday ? colorClasses.borderColor : 'border-gray-200';
  
  const { hours, minutes } = parseTimeToHoursMinutes(value);
  
  const handleHoursChange = (newHours) => {
    if (!editable) return;
    const newTimeString = formatTimeString(parseInt(newHours), minutes);
    onChange(newTimeString);
  };
  
  const handleMinutesChange = (newMinutes) => {
    if (!editable) return;
    const newTimeString = formatTimeString(hours, parseInt(newMinutes));
    onChange(newTimeString);
  };
  
  return (
    <div className={`${finalColorClass} border ${finalBorderColor} rounded-lg p-6 shadow-sm`}>
      <h3 className={`text-lg font-semibold ${colorClasses.titleColor} mb-4`}>📱 {label}</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">How much time did you spend on your phone today?</label>
        <div className="flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-gray-600" />
          <div className="flex items-center gap-2">
            <select
              value={hours}
              onChange={e => handleHoursChange(e.target.value)}
              disabled={!editable}
              className={`p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${!editable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              {Array.from({ length: 13 }, (_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
            <span className="text-sm text-gray-600">hours</span>
            
            <select
              value={minutes}
              onChange={e => handleMinutesChange(e.target.value)}
              disabled={!editable}
              className={`p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${!editable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
            <span className="text-sm text-gray-600">minutes</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Select hours and minutes using the dropdowns above</p>
        {isYesterday && colorClasses.message && (
          <div className={`mt-3 p-3 rounded-lg border ${colorClasses.borderColor} ${colorClasses.bgColor}`}>
            <p className={`text-sm font-medium ${colorClasses.messageColor}`}>
              {colorClasses.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 