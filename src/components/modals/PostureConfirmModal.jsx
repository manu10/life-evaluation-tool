import React from 'react';

export default function PostureConfirmModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg p-6 border border-gray-200 w-full max-w-sm">
        <h4 className="text-base font-semibold text-gray-900 mb-2">Change posture</h4>
        <div className="text-sm text-gray-700 space-y-2 mb-4">
          <p>Stand up, roll your shoulders, lengthen your spine, relax your jaw, and soften your gaze.</p>
          <p>Benefits: resets muscle tension, signals safety to the nervous system, and reduces anxious momentum.</p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 text-gray-600 hover:text-gray-800">Close</button>
          <button onClick={() => { onConfirm && onConfirm(); onClose(); }} className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Confirm done</button>
        </div>
      </div>
    </div>
  );
}


