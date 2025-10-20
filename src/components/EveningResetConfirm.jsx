import React, { useState } from 'react';

const CAUSES = [
  'Unclear next step',
  'Too big',
  'No time slot',
  'Distraction',
  'Low energy',
  'Blocked by something',
  'Forgot'
];
const COUNTERS = [
  'Timebox 15m',
  'Split first step',
  'Schedule window',
  'Add environment tweak',
  'Add reminder/anchor',
  'Ask for unblock'
];

export default function EveningResetConfirm({ isOpen, onClose, todaysGoals, todaysTodos = [], onePercentPlan, onePercentDone = false, onConfirm }) {
  if (!isOpen) return null;
  const [local, setLocal] = useState({
    goal1: !!todaysGoals?.goal1?.completed,
    goal2: !!todaysGoals?.goal2?.completed,
    goal3: !!todaysGoals?.goal3?.completed,
    goal1Meta: { causes: [], counters: [], note: '', carry: false },
    goal2Meta: { causes: [], counters: [], note: '', carry: false },
    goal3Meta: { causes: [], counters: [], note: '', carry: false },
    todos: (todaysTodos || []).map(t => ({ id: t.id, completed: !!t.completed })),
    todosMeta: (todaysTodos || []).map(() => ({ causes: [], counters: [], note: '', carry: false })),
    onePercentDone: !!onePercentDone,
    onePercentMeta: { causes: [], counters: [], note: '', carry: false }
  });

  function toggle(key) { setLocal(prev => ({ ...prev, [key]: !prev[key] })); }
  function toggleInArray(path, value) {
    setLocal(prev => {
      const parts = path.split('.');
      const next = { ...prev };
      let obj = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        obj[p] = Array.isArray(obj[p]) ? [...obj[p]] : { ...obj[p] };
        obj = obj[p];
      }
      const last = parts[parts.length - 1];
      const arr = obj[last] || [];
      const idx = arr.indexOf(value);
      obj[last] = idx >= 0 ? arr.filter(v => v !== value) : [...arr, value];
      return next;
    });
  }
  function setValue(path, value) {
    setLocal(prev => {
      const parts = path.split('.');
      const next = { ...prev };
      let obj = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        obj[p] = Array.isArray(obj[p]) ? [...obj[p]] : { ...obj[p] };
        obj = obj[p];
      }
      obj[parts[parts.length - 1]] = value;
      return next;
    });
  }

  function MissPanel({ title, causesPath, countersPath, notePath, carryPath }) {
    return (
      <div className="mt-2 p-3 rounded-md border border-amber-200 bg-amber-50" onClick={(e)=>e.stopPropagation()} onMouseDown={(e)=>e.stopPropagation()} onTouchStart={(e)=>e.stopPropagation()}>
        <div className="text-xs font-semibold text-amber-900 mb-1">{title}</div>
        <div className="mb-2">
          <div className="text-xs text-amber-900 mb-1">Why did it miss? (pick 1+)</div>
          <div className="flex flex-wrap gap-2">
            {CAUSES.map(c => (
              <button type="button" key={c} onClick={() => toggleInArray(causesPath, c)} className={`px-2 py-1 text-xs rounded border ${((causesPath.split('.').reduce((o,k)=>o?.[k], local))||[]).includes(c) ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-amber-900 border-amber-300'}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="mb-2">
          <div className="text-xs text-amber-900 mb-1">Counter‑action (pick 1+)</div>
          <div className="flex flex-wrap gap-2">
            {COUNTERS.map(c => (
              <button type="button" key={c} onClick={() => toggleInArray(countersPath, c)} className={`px-2 py-1 text-xs rounded border ${((countersPath.split('.').reduce((o,k)=>o?.[k], local))||[]).includes(c) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-900 border-emerald-300'}`}>{c}</button>
            ))}
          </div>
        </div>
        <textarea
          rows={2}
          inputMode="text"
          autoComplete="off"
          placeholder="Optional note (one line)"
          defaultValue={notePath.split('.').reduce((o,k)=>o?.[k], local) || ''}
          onBlur={e => setValue(notePath, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          className="w-full p-2 border border-gray-300 rounded text-xs resize-none"
        />
        <label className="mt-2 flex items-center gap-2 text-xs text-gray-700">
          <input type="checkbox" checked={!!(carryPath.split('.').reduce((o,k)=>o?.[k], local))} onChange={() => setValue(carryPath, !(carryPath.split('.').reduce((o,k)=>o?.[k], local)))} />
          Convert to tomorrow (add as a todo)
        </label>
      </div>
    );
  }

  function isValid() {
    const checks = [];
    // goals
    [1,2,3].forEach(n => {
      if (!local[`goal${n}`]) {
        const meta = local[`goal${n}Meta`];
        checks.push((meta.causes || []).length > 0 && (meta.counters || []).length > 0);
      }
    });
    // todos
    (local.todos || []).forEach((t, idx) => {
      if (!t.completed) {
        const meta = local.todosMeta?.[idx] || {};
        checks.push((meta.causes || []).length > 0 && (meta.counters || []).length > 0);
      }
    });
    // 1% plan
    if (onePercentPlan && onePercentPlan.trim() && !local.onePercentDone) {
      checks.push((local.onePercentMeta.causes || []).length > 0 && (local.onePercentMeta.counters || []).length > 0);
    }
    return checks.every(Boolean);
  }

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Reset evening reflection</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">✕</button>
        </div>
        <div className="px-6 py-4 overflow-y-auto space-y-4">
          <p className="text-sm text-gray-700">Before resetting, confirm the status of today's 3 main goals. For any missed item, select a cause and a counter‑action.</p>
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
          {[1,2,3].map(n => {
            const key = `goal${n}`;
            const show = !local[key] && (todaysGoals?.[key]?.text || '').trim();
            return show ? (
              <MissPanel
                key={`meta-${key}`}
                title={`Missed: ${todaysGoals?.[key]?.text}`}
                causesPath={`${key}Meta.causes`}
                countersPath={`${key}Meta.counters`}
                notePath={`${key}Meta.note`}
                carryPath={`${key}Meta.carry`}
              />
            ) : null;
          })}
          {onePercentPlan && onePercentPlan.trim() && (
            <div className="mt-2">
              <label className="flex items-center justify-between p-3 rounded-md border border-emerald-200 bg-emerald-50">
                <span className="text-sm text-emerald-900 truncate mr-3">📈 1% Better: {onePercentPlan}</span>
                <span className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!local.onePercentDone} onChange={() => toggle('onePercentDone')} />
                  Done
                </span>
              </label>
              {!local.onePercentDone && (
                <MissPanel
                  title="Why it missed and what you’ll do next"
                  causesPath={`onePercentMeta.causes`}
                  countersPath={`onePercentMeta.counters`}
                  notePath={`onePercentMeta.note`}
                  carryPath={`onePercentMeta.carry`}
                />
              )}
            </div>
          )}
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
              {todaysTodos.map((t, idx) => !local.todos?.[idx]?.completed ? (
                <MissPanel
                  key={`todo-meta-${t.id}`}
                  title={`Missed: ${t.text}`}
                  causesPath={`todosMeta.${idx}.causes`}
                  countersPath={`todosMeta.${idx}.counters`}
                  notePath={`todosMeta.${idx}.note`}
                  carryPath={`todosMeta.${idx}.carry`}
                />
              ) : null)}
            </div>
          )}

          <div className="text-xs text-gray-600">
            This will reset evening responses and clear all tracked distractions for today. You can always set tomorrow's goals again.
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 text-gray-700 hover:text-gray-900">Cancel</button>
          <button onClick={() => onConfirm && onConfirm(local)} disabled={!isValid()} className={`px-4 py-2 rounded-md ${isValid() ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>Confirm & Reset</button>
        </div>
      </div>
    </div>
  );
}


