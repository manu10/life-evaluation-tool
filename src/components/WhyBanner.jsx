import React, { useMemo, useState } from 'react';

export default function WhyBanner({
  whyText = '',
  onChangeWhy,
  readByDate = {},
  onMarkRead,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(whyText || '');

  const todayISO = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0,10);
  }, []);

  const readToday = !!readByDate?.[todayISO];

  function handleSave() {
    const t = (draft || '').trim();
    if (!t) return;
    onChangeWhy && onChangeWhy(t);
    setEditing(false);
  }

  function renderMiniGrid() {
    const cells = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const iso = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0,10);
      const done = !!readByDate?.[iso];
      cells.push(
        <div key={iso} title={`${iso}${done?' • read':''}`} className={`h-3 w-3 rounded-sm ${done ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
      );
    }
    return (
      <div className="flex items-center gap-1 flex-wrap" style={{ rowGap: '4px' }}>
        {cells}
      </div>
    );
  }

  return (
    <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wide text-amber-900 dark:text-amber-200 mb-1">Your WHY</div>
          {!editing ? (
            <div className="text-sm text-amber-900 dark:text-amber-100">
              {whyText ? whyText : <span className="italic text-amber-800/80 dark:text-amber-200/80">Add a short one‑liner that motivates you.</span>}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="e.g., Build a calmer, focused life for my family"
                className="flex-1 p-2 border border-amber-300 dark:border-amber-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              <button onClick={handleSave} className="px-3 py-2 text-xs rounded-md bg-amber-600 text-white hover:bg-amber-700">Save</button>
              <button onClick={() => { setEditing(false); setDraft(whyText || ''); }} className="px-3 py-2 text-xs rounded-md border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/30">Cancel</button>
            </div>
          )}
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(true)} className="px-2.5 py-1.5 text-xs rounded-md border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/30">Edit</button>
              <button onClick={() => onMarkRead && onMarkRead()} className={`px-2.5 py-1.5 text-xs rounded-md ${readToday ? 'bg-emerald-600 text-white' : 'border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'}`}>{readToday ? 'Re‑read ✓' : 'Re‑read now'}</button>
            </div>
            {renderMiniGrid()}
          </div>
        </div>
      </div>
    </div>
  );
}


