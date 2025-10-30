import React from 'react';

export default function PostureConfirmModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="posture-title" onKeyDown={(e) => { if (e.key === 'Escape') onClose && onClose(); }}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 w-full max-w-sm text-gray-900 dark:text-gray-100">
        <h4 id="posture-title" className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">Change posture</h4>
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2 mb-4">
          <p>Stand up, roll your shoulders, lengthen your spine, relax your jaw, and soften your gaze.</p>
          <p>Benefits: resets muscle tension, signals safety to the nervous system, and reduces anxious momentum.</p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">Close</button>
          <button onClick={() => { onConfirm && onConfirm(); onClose(); }} className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Confirm done</button>
        </div>
      </div>
    </div>
  );
}


