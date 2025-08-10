import React, { useState } from 'react';

export default function EveningResetConfirm({ isOpen, onClose, todaysGoals, todaysTodos = [], onConfirm }) {
  if (!isOpen) return null;
  const [local, setLocal] = useState({
    goal1: !!todaysGoals?.goal1?.completed,
    goal2: !!todaysGoals?.goal2?.completed,
    goal3: !!todaysGoals?.goal3?.completed,
    todos: (todaysTodos || []).map(t => ({ id: t.id, completed: !!t.completed }))
  });

  function toggle(key) { setLocal(prev => ({ ...prev, [key]: !prev[key] })); }

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Reset evening reflection</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">✕</button>
        </div>
        <div className="px-6 py-4 overflow-y-auto space-y-4">
          <p className="text-sm text-gray-700">Before resetting, confirm the status of today's 3 main goals. Reset will lock the evening reflection and clear today's distractions.</p>
          <div className="space-y-2">
            {[1,2,3].map(n => {
              const key = `goal${n}`;
              const label = todaysGoals?.[key]?.text || `Goal ${n}`;
              return (
                <label key={key} className="flex items-center justify-between p-3 rounded-md border border-gray-200 bg-gray-50">
                  <span className="text-sm text-gray-800 truncate mr-3">{label || `Goal ${n}`}</span>
                  <span className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!local[key]} onChange={() => toggle(key)} />
                    Completed
                  </span>
                </label>
              );
            })}
          </div>
          {todaysTodos && todaysTodos.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Today's Todos</h4>
              <div className="space-y-2">
                {todaysTodos.map((t, idx) => (
                  <label key={t.id} className="flex items-center justify-between p-2 rounded-md border border-gray-200 bg-white">
                    <span className="text-sm text-gray-800 truncate mr-3">{t.text}</span>
                    <span className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={!!(local.todos?.[idx]?.completed)}
                        onChange={() => setLocal(prev => {
                          const copy = [...prev.todos];
                          copy[idx] = { ...copy[idx], completed: !copy[idx].completed };
                          return { ...prev, todos: copy };
                        })}
                      />
                      Completed
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-600">
            This will reset evening responses and clear all tracked distractions for today. You can always set tomorrow's goals again.
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 text-gray-700 hover:text-gray-900">Cancel</button>
          <button onClick={() => onConfirm && onConfirm(local)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Confirm & Reset</button>
        </div>
      </div>
    </div>
  );
}


