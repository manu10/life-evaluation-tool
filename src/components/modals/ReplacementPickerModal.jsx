import React from 'react';

export default function ReplacementPickerModal({ isOpen, onClose, actions = [], onStartReplacement, onOpenSettings }) {
  if (!isOpen) return null;
  const list = Array.isArray(actions) ? actions : [];
  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Choose a replacement</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">✕</button>
        </div>
        <div className="px-6 py-4 overflow-y-auto space-y-3">
          {list.length === 0 ? (
            <div className="p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-900 flex items-center justify-between">
              <span>No replacement actions yet. Add a couple of easy options.</span>
              {typeof onOpenSettings === 'function' && (
                <button onClick={onOpenSettings} className="text-xs px-2 py-1 rounded-md bg-green-600 text-white hover:bg-green-700">Settings</button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {list.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-md bg-gray-50 border border-gray-200">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{a.title}</div>
                    <div className="text-xs text-gray-600">Reward: {a.rewardText || '—'} {a.isEasy ? '• Easy' : ''}</div>
                  </div>
                  <button
                    onClick={() => { onStartReplacement && onStartReplacement(a); onClose(); }}
                    className="px-3 py-1 text-xs rounded-md bg-green-600 text-white hover:bg-green-700"
                  >
                    Do now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">Close</button>
        </div>
      </div>
    </div>
  );
}


