import React from 'react';
import { formatDateEnglish } from '../utils/formatDateEnglish';

function TextBlock({ id, value, placeholder, onChange }) {
  return (
    <textarea
      id={id}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full min-h-[100px] p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-sm"
      spellCheck={true}
    />
  );
}

export default function ProjectCanvas({ project, onUpdate }) {
  const p = project || {};
  const ideas = Array.isArray(p.ideas) ? p.ideas : [];
  const actions = Array.isArray(p.actions) ? p.actions : [];
  const progress = Array.isArray(p.progress) ? p.progress : [];

  const updates = (partial) => typeof onUpdate === 'function' && onUpdate(partial);

  function addItem(type) {
    const list = Array.isArray(p[type]) ? p[type].slice() : [];
    const item = { content: '', timestamp: new Date().toISOString(), ...(type === 'actions' ? { done: false } : {}) };
    list.push(item);
    updates({ [type]: list });
  }
  function updateItem(type, index, content) {
    const list = Array.isArray(p[type]) ? p[type].slice() : [];
    if (!list[index]) return;
    list[index] = { ...list[index], content };
    updates({ [type]: list });
  }
  function deleteItem(type, index) {
    const list = Array.isArray(p[type]) ? p[type].slice() : [];
    list.splice(index, 1);
    updates({ [type]: list });
  }
  function toggleAction(index) {
    const list = Array.isArray(p.actions) ? p.actions.slice() : [];
    if (!list[index]) return;
    list[index] = { ...list[index], done: !list[index].done };
    updates({ actions: list });
  }

  const statBadge = (label, value) => (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
      {label} {value}
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-600">
        {statBadge('💡', ideas.length)}
        {statBadge('✅', actions.length)}
        {statBadge('📊', progress.length)}
        <span className="ml-auto">Last updated: {new Date(p.updatedAt || p.createdAt || Date.now()).toLocaleString()}</span>
      </div>

      <section>
        <div className="text-sm font-semibold text-gray-800 mb-1">🎯 Goal / Objective</div>
        <TextBlock id="goal" value={p.goal} placeholder="Click to write your goal..." onChange={(val) => updates({ goal: val })} />
      </section>

      <section>
        <div className="text-sm font-semibold text-gray-800 mb-1">🤔 Current Situation</div>
        <TextBlock id="situation" value={p.situation} placeholder="Describe the current state..." onChange={(val) => updates({ situation: val })} />
      </section>

      <section>
        <div className="text-sm font-semibold text-gray-800 mb-2">💡 Ideas & Options</div>
        <div className="space-y-2">
          {ideas.map((it, idx) => (
            <div key={idx} className="p-3 rounded-lg border border-gray-200 bg-white">
              <textarea
                value={it.content || ''}
                onChange={(e) => updateItem('ideas', idx, e.target.value)}
                placeholder="Idea or option..."
                className="w-full min-h-[60px] p-2 border-0 outline-none resize-none text-sm"
                spellCheck={true}
              />
              <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                <span>{formatDateEnglish(it.timestamp).short}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => deleteItem('ideas', idx)} className="px-2 py-0.5 border rounded text-xs">Delete</button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => addItem('ideas')} className="text-sm text-emerald-700 hover:underline">+ Add idea or option</button>
        </div>
      </section>

      <section>
        <div className="text-sm font-semibold text-gray-800 mb-2">✅ Actions & Next Steps</div>
        <div className="space-y-2">
          {actions.map((it, idx) => (
            <div key={idx} className={`p-3 rounded-lg border bg-white ${it.done ? 'border-emerald-200 opacity-80' : 'border-gray-200'}`}>
              <textarea
                value={it.content || ''}
                onChange={(e) => updateItem('actions', idx, e.target.value)}
                placeholder="Action or next step..."
                className="w-full min-h-[60px] p-2 border-0 outline-none resize-none text-sm"
                spellCheck={true}
              />
              <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                <span>{formatDateEnglish(it.timestamp).short}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleAction(idx)} className="px-2 py-0.5 border rounded text-xs">{it.done ? '↩ Undo' : '✓ Done'}</button>
                  <button onClick={() => deleteItem('actions', idx)} className="px-2 py-0.5 border rounded text-xs">Delete</button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => addItem('actions')} className="text-sm text-emerald-700 hover:underline">+ Add action or next step</button>
        </div>
      </section>

      <section>
        <div className="text-sm font-semibold text-gray-800 mb-2">📊 Progress & Updates</div>
        <div className="space-y-2">
          {[...progress].slice().reverse().map((it, revIdx) => {
            const realIndex = progress.length - 1 - revIdx;
            return (
              <div key={realIndex} className="p-3 rounded-lg border border-gray-200 bg-white">
                <textarea
                  value={it.content || ''}
                  onChange={(e) => updateItem('progress', realIndex, e.target.value)}
                  placeholder="Progress or update..."
                  className="w-full min-h-[60px] p-2 border-0 outline-none resize-none text-sm"
                  spellCheck={true}
                />
                <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDateEnglish(it.timestamp).short}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => deleteItem('progress', realIndex)} className="px-2 py-0.5 border rounded text-xs">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
          <button onClick={() => addItem('progress')} className="text-sm text-emerald-700 hover:underline">+ Log progress or update</button>
        </div>
      </section>

      <section>
        <div className="text-sm font-semibold text-gray-800 mb-1">📝 Notes & Thoughts</div>
        <TextBlock id="notes" value={p.notes} placeholder="Write freely..." onChange={(val) => updates({ notes: val })} />
        <div className="mt-1 text-xs text-gray-500 text-right">
          {(() => {
            const text = (p.notes || '').trim();
            const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
            return `${words} word${words === 1 ? '' : 's'}`;
          })()}
        </div>
      </section>
    </div>
  );
}
