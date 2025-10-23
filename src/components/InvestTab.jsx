import React from 'react';

export default function InvestTab({
  opportunities = [],
  onAddOpportunity,
  onUpdateOpportunity,
  onStartSprint,
  onDecide,
  onDeleteOpportunity,
  readingUsedMin = 0,
  readingCapMin = 0,
  decisions = [],
  onCopyDecision
}) {
  const [quick, setQuick] = React.useState({ title: '', docUrl: '', tagId: 'none' });
  const [collapsedView, setCollapsedView] = React.useState(true);
  const [tags, setTags] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('investTags') || '[]'); } catch { return []; }
  });
  const [tagFilter, setTagFilter] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('investTagFilter') || '"all"'); } catch { return 'all'; }
  });

  React.useEffect(() => {
    try { localStorage.setItem('investTags', JSON.stringify(tags)); } catch {}
  }, [tags]);
  React.useEffect(() => {
    try { localStorage.setItem('investTagFilter', JSON.stringify(tagFilter)); } catch {}
  }, [tagFilter]);

  return (
    <div className="mb-12 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Invest</h2>
        {readingCapMin > 0 && (
          <div className="text-xs px-2 py-1 rounded bg-indigo-50 border border-indigo-200 text-indigo-800">
            Reading today: {Math.min(readingUsedMin, readingCapMin)}/{readingCapMin} min
          </div>
        )}
      </div>

      {/* Quick Capture */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Quick capture (Backlog)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input className="p-2 border border-gray-300 rounded" placeholder="Title" value={quick.title} onChange={e => setQuick({ ...quick, title: e.target.value })} />
          <input className="p-2 border border-gray-300 rounded" placeholder="Doc URL (optional)" value={quick.docUrl} onChange={e => setQuick({ ...quick, docUrl: e.target.value })} />
          <select className="p-2 border border-gray-300 rounded" value={quick.tagId} onChange={e => setQuick({ ...quick, tagId: e.target.value })}>
            <option value="none">No tag</option>
            {tags.map(t => (
              <option key={t.id} value={t.id}>{`${t.emoji || ''} ${t.label}`.trim()}</option>
            ))}
          </select>
          <button
            className="p-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            onClick={() => {
              if (!quick.title.trim()) return;
              const tagId = quick.tagId === 'none' ? null : quick.tagId;
              onAddOpportunity && onAddOpportunity({ title: quick.title.trim(), docUrl: quick.docUrl.trim(), tagId });
              setQuick({ title: '', docUrl: '', tagId: 'none' });
            }}
          >
            + Add to Backlog
          </button>
        </div>
      </div>

      {/* View toggle (A/B test helper) */}
      <div className="flex items-center justify-end">
        <label className="text-xs text-gray-700 flex items-center gap-2">
          <input type="checkbox" checked={collapsedView} onChange={e => setCollapsedView(e.target.checked)} />
          Collapsed cards
        </label>
      </div>

      {/* Tag filter chips */}
      <div className="flex items-center flex-wrap gap-2">
        <TagChip
          label="All"
          active={tagFilter === 'all'}
          onClick={() => setTagFilter('all')}
        />
        {tags.map(t => (
          <TagChip
            key={t.id}
            label={`${t.emoji || ''} ${t.label}`.trim()}
            color={t.color}
            active={tagFilter === t.id}
            onClick={() => setTagFilter(t.id)}
          />
        ))}
        <NewTagInline onAdd={(tag) => setTags(prev => [tag, ...prev])} />
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Backlog','Active','Decided'].map(col => (
          <div key={col} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">{col}</h3>
            <div className="space-y-3">
              {(
                opportunities
                .filter(o => o.status === col)
                .filter(o => tagFilter === 'all' || o.tagId === tagFilter)
                .map(o => (
                  <OppCard
                    key={o.id}
                    o={o}
                    column={col}
                    collapsed={collapsedView}
                    tags={tags}
                    onAssignTag={(oppId, tagId) => onUpdateOpportunity && onUpdateOpportunity(oppId, { tagId })}
                    onCreateTag={({ label, emoji, color }) => {
                      const t = { id: Date.now().toString(), label, emoji, color };
                      setTags(prev => [t, ...prev]);
                      onUpdateOpportunity && onUpdateOpportunity(o.id, { tagId: t.id });
                    }}
                    onUpdate={onUpdateOpportunity}
                    onStartSprint={onStartSprint}
                    onDecide={onDecide}
                    onDeleteOpportunity={onDeleteOpportunity}
                  />
                ))
              )}
              {opportunities.filter(o => o.status === col).length === 0 && (
                <div className="text-xs text-gray-500">No items</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Decision Log */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Decision Log</h3>
          {decisions && decisions.length > 0 && (
            <button
              className="text-xs px-2 py-1 rounded bg-gray-900 text-white hover:bg-gray-800"
              onClick={() => {
                const text = (decisions || []).map(d => formatDecision(opportunities, d)).join('\n\n');
                try { navigator.clipboard.writeText(text); alert('Copied all decisions'); } catch {}
              }}
            >
              Export all
            </button>
          )}
        </div>
        {(!decisions || decisions.length === 0) && <div className="text-xs text-gray-500">No decisions yet</div>}
        <div className="space-y-2">
          {(decisions || []).map(d => {
            const opp = opportunities.find(o => o.id === d.opportunityId);
            const kind = (d.type || '').toLowerCase();
            const style = kind === 'buy' ? 'border-emerald-300 bg-emerald-50' : kind === 'pass' ? 'border-rose-300 bg-rose-50' : 'border-amber-300 bg-amber-50';
            const emoji = kind === 'buy' ? '🟢' : kind === 'pass' ? '🔴' : '🟡';
            return (
              <div key={d.id} className={`p-3 border rounded hover:shadow-sm ${style}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate" title={opp?.title || ''}>{emoji} {kind.toUpperCase()} • {opp?.title || '—'}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-700">
                      <span>{new Date(d.decidedAt).toLocaleString()}</span>
                      {opp?.docUrl && <a href={opp.docUrl} target="_blank" rel="noreferrer" className="underline">Doc</a>}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <button
                      className="text-[11px] px-2 py-1 rounded bg-white border border-gray-300 hover:bg-gray-100"
                      onClick={() => {
                        const text = formatDecision(opportunities, d);
                        if (onCopyDecision) onCopyDecision(d); else { try { navigator.clipboard.writeText(text); alert('Copied'); } catch {} }
                      }}
                    >Copy</button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-900">
                  {d.reasons && d.reasons.length > 0 && (
                    <div>
                      <div className="font-medium">Reasons</div>
                      <ul className="list-disc ml-5">
                        {d.reasons.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  )}
                  {d.risk && <div className="mt-1"><span className="font-medium">Risk:</span> {d.risk}</div>}
                  {d.premortem && <div className="mt-1"><span className="font-medium">Premortem:</span> {d.premortem}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OppCard({ o, column = 'Backlog', collapsed = false, tags = [], onAssignTag, onCreateTag, onUpdate, onStartSprint, onDecide, onDeleteOpportunity }) {
  const [showDecide, setShowDecide] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [showTagPicker, setShowTagPicker] = React.useState(false);
  const hasNext = !!(o.nextAction && String(o.nextAction).trim());
  const hasDeadline = !!o.deadline;
  const canActivate = hasNext || hasDeadline;
  const canStart = hasNext; // must have a focused next action to start a sprint
  if (collapsed) {
    const duePill = o.deadline ? (<span className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200">Due {new Date(o.deadline).toLocaleDateString()}</span>) : null;
    const conviction = Math.max(1, Math.min(5, o.conviction ?? 3));
    const tag = (o.tagId && tags.find(t => t.id === o.tagId)) || null;
    // actionable (only)
    return (
      <div className="p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow" style={{ background: tag ? `${tag.color}11` : '#ffffff' }}>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="min-w-0 sm:col-span-8">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-gray-900 truncate" title={o.title}>{o.title}</div>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-700">
              {duePill}
              <span className="inline-flex items-center gap-1">
                Conviction
                <span className="inline-flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`inline-block w-1.5 h-1.5 rounded-full ${i < conviction ? convictionBgClass(conviction) : 'bg-gray-300'}`} />
                  ))}
                </span>
              </span>
              {o.docUrl && <a href={o.docUrl} target="_blank" rel="noreferrer" className="underline break-all">Open Doc</a>}
            </div>
            {o.nextAction && (
              <div className="mt-1 text-xs text-gray-800 truncate" title={o.nextAction}>Next: {o.nextAction}</div>
            )}
          </div>
          <div className="shrink-0 sm:col-span-4 flex flex-col items-start sm:items-end gap-1 sm:justify-self-end">
            <button
              className={`px-2 py-1 rounded text-xs ${canStart ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-600 cursor-not-allowed'}`}
              aria-disabled={!canStart}
              title={canStart ? '' : 'Add a Next action to start a sprint'}
              onClick={() => { if (!canStart) return; onUpdate && onUpdate(o.id, { status: 'Active' }); onStartSprint && onStartSprint(o.id, 'reading'); }}
            >Start 25m</button>
            <div className="flex flex-col items-end gap-1">
              <button className="px-2 py-1 rounded bg-purple-100 text-purple-800 border border-purple-300 text-[11px] hover:bg-purple-200" onClick={() => setShowDecide(true)}>Decide</button>
              <button className="px-2 py-1 rounded bg-gray-100 text-gray-800 border border-gray-300 text-[11px] hover:bg-gray-200" onClick={() => setShowEdit(true)}>Details</button>
              <button className="px-2 py-1 rounded bg-white text-rose-700 border border-rose-300 text-[11px] hover:bg-rose-50" onClick={() => { if (window.confirm('Delete this opportunity?')) onDeleteOpportunity && onDeleteOpportunity(o.id); }}>Delete</button>
            </div>
            {/* Tooltip via title on button; no inline hint to keep UI clean */}
          </div>
        </div>
        {showDecide && (
          <DecideModal onClose={() => setShowDecide(false)} onSubmit={(payload) => { setShowDecide(false); onDecide && onDecide(o.id, payload); }} />
        )}
        {showEdit && (
          <EditOppModal o={o} onClose={() => setShowEdit(false)} onSave={(partial) => { onUpdate && onUpdate(o.id, partial); setShowEdit(false); }} />
        )}
        {showTagPicker && (
          <TagPickerModal
            tags={tags}
            onClose={() => setShowTagPicker(false)}
            onAssign={(tagId) => { onAssignTag && onAssignTag(o.id, tagId); setShowTagPicker(false); }}
            onCreate={(t) => { onCreateTag && onCreateTag(t); setShowTagPicker(false); }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1"><div className="font-semibold text-gray-900 truncate" title={o.title}>{o.title}</div></div>
        <div className="shrink-0 flex items-center gap-2">
          <button className="text-xs px-2 py-1 rounded bg-gray-100 border border-gray-300 hover:bg-gray-200" onClick={() => setShowEdit(true)}>Edit…</button>
          <button className="text-xs px-2 py-1 rounded bg-white border border-gray-300 hover:bg-gray-50" onClick={() => setShowTagPicker(true)}>Tag…</button>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
        {o.docUrl && <a href={o.docUrl} target="_blank" rel="noreferrer" className="underline break-all">Open Doc</a>}
        {o.deadline && <span className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200">Due {new Date(o.deadline).toLocaleDateString()}</span>}
        {renderTagPill(tags, o, true)}
      </div>

      {/* Fields (stacked) */}
      <div className="mt-3 space-y-3">
        <label className="block text-xs text-gray-700">
          <span className="block mb-1">Thesis (one line or two)</span>
          <textarea
            rows={2}
            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Durable moat, high ROIC, aligned incentives"
            value={o.thesis || ''}
            onChange={e => onUpdate && onUpdate(o.id, { thesis: e.target.value })}
          />
        </label>
        <label className="block text-xs text-gray-700">
          <span className="block mb-1">Next action</span>
          <input
            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="e.g., Skim 10‑K; set decision deadline; sanity‑check valuation"
            value={o.nextAction || ''}
            onChange={e => onUpdate && onUpdate(o.id, { nextAction: e.target.value })}
          />
        </label>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-gray-700">Conviction</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-gray-300 bg-white">
            <ConvictionEmoji value={o.conviction ?? 3} />
            <span className="font-medium">{Math.max(1, Math.min(5, o.conviction ?? 3))}/5</span>
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={o.conviction ?? 3}
          onChange={e => onUpdate && onUpdate(o.id, { conviction: Math.max(1, Math.min(5, parseInt(e.target.value)||3)) })}
          className="w-40 accent-blue-600 cursor-pointer"
          aria-label="Conviction (1 to 5)"
        />
        <label className="flex items-center gap-1">Deadline
          <input type="date" value={o.deadline?.slice(0,10) || ''} onChange={e => onUpdate && onUpdate(o.id, { deadline: e.target.value })} className="p-1 border border-gray-300 rounded" />
        </label>
      </div>

      {/* Status controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {o.status !== 'Active' && (
          <button
            className={`px-2 py-1 rounded ${canActivate ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-gray-200 text-gray-600 cursor-not-allowed'}`}
            aria-disabled={!canActivate}
            title={canActivate ? '' : 'Set a Deadline or Next action to activate'}
            onClick={() => onUpdate && onUpdate(o.id, { status: 'Active' })}
          >Move to Active</button>
        )}
        {o.status === 'Active' && (
          <button className="px-2 py-1 rounded bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200" onClick={() => onUpdate && onUpdate(o.id, { status: 'Backlog' })}>Move to Backlog</button>
        )}
      </div>

      {/* Actions */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          className={`px-2 py-1 rounded text-xs ${canStart ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-600 cursor-not-allowed'}`}
          disabled={!canStart}
          title={canStart ? '' : 'Add a Next action to start'}
          onClick={() => { if (!canStart) return; onUpdate && onUpdate(o.id, { status: 'Active' }); onStartSprint && onStartSprint(o.id, 'reading'); }}
        >Start Reading Sprint</button>
        <button
          className={`px-2 py-1 rounded text-xs ${canStart ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-200 text-gray-600 cursor-not-allowed'}`}
          disabled={!canStart}
          title={canStart ? '' : 'Add a Next action to start'}
          onClick={() => { if (!canStart) return; onUpdate && onUpdate(o.id, { status: 'Active' }); onStartSprint && onStartSprint(o.id, 'analysis'); }}
        >Start Analysis Sprint</button>
        <button className="px-2 py-1 rounded bg-purple-100 text-purple-800 border border-purple-300 text-xs hover:bg-purple-200" onClick={() => setShowDecide(true)}>Decide…</button>
        <button className="px-2 py-1 rounded bg-white text-rose-700 border border-rose-300 text-xs hover:bg-rose-50" onClick={() => { if (window.confirm('Delete this opportunity?')) onDeleteOpportunity && onDeleteOpportunity(o.id); }}>Delete</button>
      </div>

      {showDecide && (
        <DecideModal
          onClose={() => setShowDecide(false)}
          onSubmit={(payload) => { setShowDecide(false); onDecide && onDecide(o.id, payload); }}
        />
      )}

      {showEdit && (
        <EditOppModal
          o={o}
          onClose={() => setShowEdit(false)}
          onSave={(partial) => { onUpdate && onUpdate(o.id, partial); setShowEdit(false); }}
        />
      )}
      {showTagPicker && (
        <TagPickerModal
          tags={tags}
          onClose={() => setShowTagPicker(false)}
          onAssign={(tagId) => { onAssignTag && onAssignTag(o.id, tagId); setShowTagPicker(false); }}
          onCreate={(t) => { onCreateTag && onCreateTag(t); setShowTagPicker(false); }}
        />
      )}
    </div>
  );
}

function DecideModal({ onClose, onSubmit }) {
  const [type, setType] = React.useState('track');
  const [reasons, setReasons] = React.useState('');
  const [risk, setRisk] = React.useState('');
  const [premortem, setPremortem] = React.useState('');
  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg p-0 border border-gray-200 w-full max-w-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Make a decision</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">✕</button>
        </div>
        <div className="px-6 py-4 space-y-3">
          <label className="block text-sm text-gray-700">Decision
            <select value={type} onChange={e => setType(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded w-full">
              <option value="buy">Buy</option>
              <option value="track">Track</option>
              <option value="pass">Pass</option>
            </select>
          </label>
          <label className="block text-sm text-gray-700">Top reasons (comma separated)
            <input value={reasons} onChange={e => setReasons(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded w-full" placeholder="e.g., durable moat, strong FCF, aligned incentives" />
          </label>
          <label className="block text-sm text-gray-700">Top risk
            <input value={risk} onChange={e => setRisk(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded w-full" placeholder="e.g., customer concentration" />
          </label>
          <label className="block text-sm text-gray-700">Premortem (how could this fail?)
            <input value={premortem} onChange={e => setPremortem(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded w-full" placeholder="e.g., pricing pressure compresses margins" />
          </label>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 text-gray-700 hover:text-gray-900">Cancel</button>
          <button onClick={() => onSubmit({ type, reasons: reasons.split(',').map(s=>s.trim()).filter(Boolean), risk, premortem })} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Save decision</button>
        </div>
      </div>
    </div>
  );
}

function formatDecision(opportunities, d) {
  const opp = opportunities.find(o => o.id === d.opportunityId);
  const header = `${(d.type||'').toUpperCase()} — ${opp?.title || ''} — ${new Date(d.decidedAt).toLocaleString()}`;
  const reasons = (d.reasons||[]).map((r,i)=>`${i+1}. ${r}`).join('\n');
  const risk = d.risk ? `Risk: ${d.risk}` : '';
  const prem = d.premortem ? `Premortem: ${d.premortem}` : '';
  const doc = opp?.docUrl ? `Doc: ${opp.docUrl}` : '';
  return [header, reasons && `Reasons:\n${reasons}`, risk, prem, doc].filter(Boolean).join('\n');
}

function EditOppModal({ o, onClose, onSave }) {
  const [draft, setDraft] = React.useState(() => ({
    title: o.title || '',
    docUrl: o.docUrl || '',
    tag: o.tag || '',
    thesis: o.thesis || '',
    nextAction: o.nextAction || '',
    conviction: o.conviction ?? 3,
    deadline: o.deadline?.slice(0,10) || ''
  }));
  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg p-0 border border-gray-200 w-full max-w-xl">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Edit opportunity</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">✕</button>
        </div>
        <div className="px-6 py-4 space-y-3">
          <label className="block text-sm text-gray-700">Title
            <input className="mt-1 p-2 border border-gray-300 rounded w-full" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="block text-sm text-gray-700">Doc URL
              <input className="mt-1 p-2 border border-gray-300 rounded w-full" value={draft.docUrl} onChange={e => setDraft({ ...draft, docUrl: e.target.value })} />
            </label>
            <label className="block text-sm text-gray-700">Tag
              <div className="mt-1 flex items-center gap-2">
                {renderTagPill(tags || [], { tagId: draft.tagId, tag: draft.tag }, true)}
                <button className="px-2 py-1 rounded border border-gray-300 text-xs" onClick={(e) => { e.preventDefault(); setDraft(prev => prev); }}>Select via card</button>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">Tip: use Tag… on the card to assign or create tags.</div>
            </label>
          </div>
          <label className="block text-sm text-gray-700">Thesis
            <textarea rows={4} className="mt-1 p-2 border border-gray-300 rounded w-full" value={draft.thesis} onChange={e => setDraft({ ...draft, thesis: e.target.value })} />
          </label>
          <label className="block text-sm text-gray-700">Next action
            <input className="mt-1 p-2 border border-gray-300 rounded w-full" value={draft.nextAction} onChange={e => setDraft({ ...draft, nextAction: e.target.value })} />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="block text-sm text-gray-700">Conviction (slide)
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-gray-300 bg-white text-xs">
                  <ConvictionEmoji value={draft.conviction} />
                  <span className="font-medium">{draft.conviction}/5</span>
                </span>
                <input type="range" min={1} max={5} step={1} value={draft.conviction} onChange={e => setDraft({ ...draft, conviction: Math.max(1, Math.min(5, parseInt(e.target.value)||3)) })} className="w-full accent-blue-600 cursor-pointer" aria-label="Conviction (1 to 5)" />
              </div>
            </label>
            <label className="block text-sm text-gray-700">Deadline
              <input type="date" className="mt-1 p-2 border border-gray-300 rounded w-full" value={draft.deadline} onChange={e => setDraft({ ...draft, deadline: e.target.value })} />
            </label>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 text-gray-700 hover:text-gray-900">Cancel</button>
          <button onClick={() => onSave(draft)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
}

function ConvictionEmoji({ value = 3 }) {
  const v = Math.max(1, Math.min(5, value));
  const map = { 1: '😬', 2: '😕', 3: '🙂', 4: '😎', 5: '🚀' };
  return <span role="img" aria-label={`conviction ${v}`}>{map[v] || '🙂'}</span>;
}

function convictionBgClass(v) {
  const n = Math.max(1, Math.min(5, v));
  return (
    n <= 2 ? 'bg-rose-500' :
    n === 3 ? 'bg-amber-500' :
    'bg-emerald-600'
  );
}

function TagChip({ label, color = '#e5e7eb', active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded-full border text-xs ${active ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}
      style={{ boxShadow: `inset 0 0 0 2px ${color}22` }}
    >
      {label}
    </button>
  );
}

function NewTagInline({ onAdd }) {
  const [open, setOpen] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [emoji, setEmoji] = React.useState('');
  const [color, setColor] = React.useState('#e5e7eb');
  function create() {
    if (!label.trim()) return;
    const tag = { id: Date.now().toString(), label: label.trim(), emoji: emoji.trim(), color };
    onAdd && onAdd(tag);
    setOpen(false); setLabel(''); setEmoji(''); setColor('#e5e7eb');
  }
  if (!open) return <button className="text-xs px-2 py-1 rounded border border-dashed border-gray-300 hover:bg-gray-50" onClick={() => setOpen(true)}>+ New tag</button>;
  return (
    <div className="flex items-center gap-2 text-xs p-2 border border-gray-200 rounded">
      <input className="p-1 border border-gray-300 rounded" placeholder="Label" value={label} onChange={e => setLabel(e.target.value)} />
      <input className="p-1 border border-gray-300 rounded w-16" placeholder="😊" value={emoji} onChange={e => setEmoji(e.target.value)} />
      <input type="color" className="w-10 h-7 p-0 border border-gray-300 rounded" value={color} onChange={e => setColor(e.target.value)} />
      <button className="px-2 py-1 rounded bg-gray-900 text-white" onClick={create}>Add</button>
      <button className="px-2 py-1 rounded border border-gray-300" onClick={() => setOpen(false)}>Cancel</button>
    </div>
  );
}

function TagPickerModal({ tags = [], onClose, onAssign, onCreate }) {
  const [label, setLabel] = React.useState('');
  const [emoji, setEmoji] = React.useState('');
  const [color, setColor] = React.useState('#e5e7eb');
  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg p-0 border border-gray-200 w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Select tag</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">✕</button>
        </div>
        <div className="px-6 py-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {tags.length === 0 && <div className="text-xs text-gray-500">No tags yet</div>}
            {tags.map(t => (
              <button key={t.id} onClick={() => onAssign && onAssign(t.id)} className="px-2 py-1 rounded-full border text-xs" style={{ background: `${t.color}22`, borderColor: t.color }}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-700 mb-2">Create new</div>
            <div className="flex items-center gap-2 text-xs">
              <input className="p-1 border border-gray-300 rounded" placeholder="Label" value={label} onChange={e => setLabel(e.target.value)} />
              <input className="p-1 border border-gray-300 rounded w-16" placeholder="😊" value={emoji} onChange={e => setEmoji(e.target.value)} />
              <input type="color" className="w-10 h-7 p-0 border border-gray-300 rounded" value={color} onChange={e => setColor(e.target.value)} />
              <button className="px-2 py-1 rounded bg-gray-900 text-white" onClick={() => onCreate && onCreate({ label, emoji, color })}>Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderTagPill(tags, o, large=false) {
  const tag = (o.tagId && tags.find(t => t.id === o.tagId)) || null;
  if (!tag && !o.tag) return null;
  if (tag) {
    return <div className={`${large?'text-xs':'text-[10px]'} px-2 py-0.5 rounded border`} style={{ background: `${tag.color}22`, borderColor: tag.color }}>{tag.emoji} {tag.label}</div>;
  }
  return <div className={`${large?'text-xs':'text-[10px]'} px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-700`}>{o.tag}</div>;
}


