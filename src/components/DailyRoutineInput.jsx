import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';

export default function DailyRoutineInput({ 
  routines, 
  onRoutineChange, 
  onRoutineToggle, 
  editable = true, 
  showCheckboxes = false,
  title = "Daily Routines",
  colorClass = "bg-white" 
}) {
  const handleRoutineChange = (index, value) => {
    if (!editable) return;
    const newRoutines = [...routines];
    newRoutines[index] = { ...newRoutines[index], text: value };
    onRoutineChange(newRoutines);
  };

  const handleToggle = (index) => {
    if (!showCheckboxes || !onRoutineToggle) return;
    onRoutineToggle(index);
  };

  // Filter out empty routines for display in morning tab
  const displayRoutines = showCheckboxes 
    ? routines.filter(routine => routine.text && routine.text.trim() !== '')
    : routines;

  // Don't render if no routines and not editable
  if (!editable && displayRoutines.length === 0) return null;

  return (
    <div className={`${colorClass} border border-gray-200 rounded-lg p-6 shadow-sm mb-6`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        {title}
      </h3>
      
      {editable ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Set up to 5 daily routine items that you want to track each day:
          </p>
          {routines.map((routine, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Routine {index + 1} (optional)
              </label>
              <input
                type="text"
                value={routine.text}
                onChange={e => handleRoutineChange(index, e.target.value)}
                placeholder={`e.g., ${
                  index === 0 ? 'Morning meditation' : 
                  index === 1 ? 'Drink 8 glasses of water' :
                  index === 2 ? 'Read for 30 minutes' :
                  index === 3 ? 'Exercise or walk' :
                  'Evening reflection'
                }`}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {displayRoutines.map((routine, index) => (
            <div key={index} className="flex items-center gap-3">
              {showCheckboxes ? (
                <>
                  <input
                    type="checkbox"
                    checked={routine.completed || false}
                    onChange={() => handleToggle(routines.findIndex(r => r.text === routine.text))}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className={`text-gray-800 ${routine.completed ? 'line-through text-gray-500' : ''}`}>
                    {routine.text}
                  </span>
                  {routine.completed && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                </>
              ) : (
                <span className="text-gray-800">{routine.text}</span>
              )}
            </div>
          ))}
          {displayRoutines.length === 0 && (
            <p className="text-gray-500 italic">No daily routines set up yet.</p>
          )}
        </div>
      )}
    </div>
  );
} 