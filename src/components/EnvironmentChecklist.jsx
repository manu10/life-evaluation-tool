import React from 'react';

function isSameDay(tsA, tsB) {
  const a = new Date(tsA);
  const b = new Date(tsB);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function EnvironmentChecklist({ profile, appliedToday = [], onApply }) {
  const allItems = [
    ...(profile?.removals || []).map((t) => ({ type: 'removal', text: t })),
    ...(profile?.additions || []).map((t) => ({ type: 'addition', text: t })),
  ];
  // Show up to 3 most recent configured items
  const target = allItems.slice(0, 3);
  const appliedSet = new Set(appliedToday.map((a) => a.text));
  const appliedCount = target.filter((i) => appliedSet.has(i.text)).length;

  if (target.length === 0) return null;

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800">Environment Checklist Today</h3>
        <span className="text-xs text-gray-600">{appliedCount}/{target.length} applied</span>
      </div>
      <ul className="space-y-2">
        {target.map((item) => {
          const applied = appliedSet.has(item.text);
          return (
            <li key={item.type + ':' + item.text} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200">
              <div className="text-sm text-gray-800">
                {item.type === 'removal' ? 'Remove: ' : 'Add: '}
                <span className="font-medium">{item.text}</span>
              </div>
              <button
                disabled={applied}
                onClick={() => onApply && onApply(item)}
                className={`px-3 py-1 text-xs rounded-md ${applied ? 'bg-green-100 text-green-700 border border-green-300 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {applied ? 'Applied' : 'Mark applied'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}


