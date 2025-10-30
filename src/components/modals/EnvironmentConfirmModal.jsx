import React, { useState } from 'react';

export default function EnvironmentConfirmModal({ isOpen, onClose, environmentProfile = {}, onApplyEnvironment }) {
  if (!isOpen) return null;
  const items = [
    ...(environmentProfile?.removals || []).map((t) => ({ type: 'removal', text: t })),
    ...(environmentProfile?.additions || []).map((t) => ({ type: 'addition', text: t })),
  ];
  const top = items.slice(0, 8);
  const [applied, setApplied] = useState({});

  function apply(it) {
    if (typeof onApplyEnvironment === 'function') onApplyEnvironment(it);
    setApplied((a) => ({ ...a, [it.text]: true }));
  }

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[85vh] flex flex-col text-gray-900 dark:text-gray-100">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Engineer your environment</h3>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">✕</button>
        </div>
        <div className="px-6 py-4 overflow-y-auto space-y-3">
          {top.length === 0 ? (
            <div className="p-3 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-sm text-amber-900 dark:text-amber-200">
              No environment items yet. Add removals/anchors in Settings.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {top.map((it) => (
                <div key={it.type + it.text} className="flex items-center justify-between p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-800 dark:text-gray-100 truncate">
                    {it.type === 'removal' ? 'Remove: ' : 'Add: '}<span className="font-medium">{it.text}</span>
                  </div>
                  <button
                    disabled={!!applied[it.text]}
                    onClick={() => apply(it)}
                    className={`px-3 py-1 text-xs rounded-md ${applied[it.text] ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-200 border border-green-300 dark:border-green-700 cursor-default' : 'bg-amber-600 text-white hover:bg-amber-700'}`}
                  >
                    {applied[it.text] ? 'Applied ✓' : 'Apply now'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">Close</button>
        </div>
      </div>
    </div>
  );
}


