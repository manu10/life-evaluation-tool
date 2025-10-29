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
  const [newActionText, setNewActionText] = React.useState('');
  const [showCompleted, setShowCompleted] = React.useState(false);
  const ideas = Array.isArray(p.ideas) ? p.ideas : [];
  const actions = Array.isArray(p.actions) ? p.actions : [];
  const progress = Array.isArray(p.progress) ? p.progress : [];

  const activeActions = actions.filter(a => !a.done);
  const completedActions = actions.filter(a => a.done);
  const canAddAction = actions.length < 5;

  const updates = (partial) => typeof onUpdate === 'function' && onUpdate(partial);

  function addItem(type) {
    const list = Array.isArray(p[type]) ? p[type].slice() : [];
    const item = { content: '', timestamp: new Date().toISOString(), ...(type === 'actions' ? { done: false } : {}) };
    list.push(item);
    updates({ [type]: list });
  }
  function addAction(text) {
    if (!text.trim() || !canAddAction) return;
    const list = actions.slice();
    list.push({ content: text.trim(), timestamp: new Date().toISOString(), done: false });
    updates({ actions: list });
    setNewActionText('');
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
  function deleteAction(index) {
    const list = actions.slice();
    list.splice(index, 1);
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
        {statBadge('✅', `${completedActions.length}/${actions.length}`)}
        {statBadge('📊', progress.length)}
        <span className="ml-auto">Last updated: {new Date(p.updatedAt || p.createdAt || Date.now()).toLocaleString()}</span>
      </div>

      {/* Actions - Prominent placement */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-lg font-bold text-emerald-900 flex items-center gap-2">
              ✅ Actions & Next Steps
            </div>
            <p className="text-xs text-emerald-700 mt-1">Break your goal into small, specific tasks (~30 min each)</p>
          </div>
          <div className="text-sm text-emerald-700 font-semibold">
            {completedActions.length}/{actions.length} done
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addAction(newActionText);
          }}
          className="flex items-center gap-2 mb-4"
        >
          <input
            type="text"
            value={newActionText}
            onChange={(e) => setNewActionText(e.target.value)}
            placeholder={canAddAction ? 'Add a specific action (max 5)' : 'Limit reached'}
            disabled={!canAddAction}
            className="flex-1 p-2 border border-emerald-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!canAddAction}
            className={`px-3 py-2 rounded-md text-sm font-medium ${canAddAction ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            Add
          </button>
        </form>

        {/* Active actions */}
        <div className="space-y-2 mb-3">
          {activeActions.map((action, idx) => {
            const realIndex = actions.findIndex(a => a === action);
            return (
              <div key={realIndex} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-emerald-200">
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => toggleAction(realIndex)}
                  className="w-5 h-5 mt-0.5 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900">{action.content}</div>
                  <div className="text-xs text-gray-500 mt-1">{formatDateEnglish(action.timestamp).short}</div>
                </div>
                <button
                  onClick={() => deleteAction(realIndex)}
                  className="text-xs text-gray-500 hover:text-red-600 ml-2"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        {/* Completed actions - collapsible */}
        {completedActions.length > 0 && (
          <div className="border-t border-emerald-200 pt-3">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="text-sm text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1"
            >
              {showCompleted ? '▼' : '▶'} Completed ({completedActions.length})
            </button>
            {showCompleted && (
              <div className="space-y-2 mt-2">
                {completedActions.map((action, idx) => {
                  const realIndex = actions.findIndex(a => a === action);
                  return (
                    <div key={realIndex} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100 opacity-75">
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => toggleAction(realIndex)}
                        className="w-5 h-5 mt-0.5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-700 line-through">{action.content}</div>
                        <div className="text-xs text-gray-500 mt-1">{formatDateEnglish(action.timestamp).short}</div>
                      </div>
                      <button
                        onClick={() => deleteAction(realIndex)}
                        className="text-xs text-gray-500 hover:text-red-600 ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

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
