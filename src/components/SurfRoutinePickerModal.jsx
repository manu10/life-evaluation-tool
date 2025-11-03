import React from 'react';
import Modal from './ui/Modal';
import { LIBRARY } from './surfLibrary';

export default function SurfRoutinePickerModal({ isOpen, onClose, initialKeys = [], onSave }) {
  const [selected, setSelected] = React.useState(() => new Set(initialKeys));

  React.useEffect(() => {
    setSelected(new Set(initialKeys));
  }, [initialKeys]);

  const totalSeconds = Array.from(selected).reduce((acc, k) => {
    const ex = LIBRARY.find(e => e.key === k); return acc + (ex?.seconds || 0);
  }, 0);

  function toggle(key) {
    setSelected(prev => {
      const s = new Set(prev);
      if (s.has(key)) s.delete(key); else if (s.size < 5) s.add(key);
      return s;
    });
  }

  function handleSave() {
    const keys = Array.from(selected).slice(0, 5);
    if (typeof onSave === 'function') onSave(keys);
    if (typeof onClose === 'function') onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} containerClassName="w-full max-w-2xl p-5">
      <div className="text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="text-base font-semibold">Customize Routine (max 5)</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total: {Math.round(totalSeconds/60)}m</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {LIBRARY.map(ex => {
            const checked = selected.has(ex.key);
            return (
              <label key={ex.key} className={`p-3 rounded-lg border ${checked ? 'border-blue-400 ring-1 ring-blue-300' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 flex items-center gap-3`}>
                <input type="checkbox" checked={checked} onChange={() => toggle(ex.key)} className="w-4 h-4" />
                <img src={ex.photo} alt={ex.label} className="w-14 h-14 object-cover rounded-md border border-gray-200 dark:border-gray-700" />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{ex.label}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{ex.seconds}s {ex.splitMid ? '(split)' : ''}</div>
                </div>
              </label>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-700">Cancel</button>
          <button onClick={handleSave} className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700">Save</button>
        </div>
      </div>
    </Modal>
  );
}


