import React from 'react';
import { Smartphone } from 'lucide-react';

// Function to parse time string and convert to minutes
function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  
  const str = timeStr.toLowerCase().trim();
  let totalMinutes = 0;
  
  // Match patterns like "2h 30m", "2.5h", "150m", "2 hours 30 minutes"
  const hourMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:h|hour|hours)/);
  const minuteMatch = str.match(/(\d+)\s*(?:m|min|minute|minutes)/);
  
  if (hourMatch) {
    totalMinutes += parseFloat(hourMatch[1]) * 60;
  }
  
  if (minuteMatch) {
    totalMinutes += parseInt(minuteMatch[1]);
  }
  
  return totalMinutes;
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
  
  return (
    <div className={`${finalColorClass} border ${finalBorderColor} rounded-lg p-6 shadow-sm`}>
      <h3 className={`text-lg font-semibold ${colorClasses.titleColor} mb-4`}>📱 {label}</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">How much time did you spend on your phone today?</label>
        <div className="flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-gray-600" />
          <input
            type="text"
            value={value}
            onChange={e => editable && onChange(e.target.value)}
            disabled={!editable}
            placeholder={placeholder}
            className={`flex-1 p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${!editable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Enter time in any format (e.g., 2h 30m, 2.5h, 150m)</p>
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