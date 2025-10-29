import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function SessionsDashboard({ sessions = [], hooks = [], onUpdateHook }) {
  const [cardOpen, setCardOpen] = useState({}); // hookKey -> boolean
  const [dayOpen, setDayOpen] = useState({}); // key: `${hookKey}:${day}` -> boolean
  const grouped = useMemo(() => groupByHook(sessions, hooks), [sessions, hooks]);
  const totalMin = sessions.reduce((acc, s) => acc + (s.minutes || 0), 0);
  const overallEnjoy = calcEnjoyAvg(sessions);
  const last10Enjoy = calcEnjoyAvg(sessions.slice().sort((a,b)=>b.startedAt-a.startedAt).slice(0,10));
  const recentHighlights = sessions
    .filter(s => s.highlight && s.highlight.trim())
    .sort((a,b)=>b.startedAt-a.startedAt);

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      {/* Summary */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Tile label="Total minutes" value={`${totalMin}m`} />
          <Tile label="Sessions" value={`${sessions.length}`} />
          <Tile label="Hooks used" value={`${grouped.order.length}`} />
          <Tile label="Top hook" value={grouped.order[0] ? grouped.labels[grouped.order[0]] : '—'} />
          <Tile label="Avg enjoy (overall)" value={isNaN(overallEnjoy)?'—':`${overallEnjoy}/5`} />
          <Tile label="Avg enjoy (last 10)" value={isNaN(last10Enjoy)?'—':`${last10Enjoy}/5`} />
        </div>
      </div>

      {/* Time by hook */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Time by hook</h3>
        <HookBars grouped={grouped} />
      </div>

      {/* Collapsible per hook */}
      <div className="space-y-4">
        {grouped.order.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-600">No sessions yet.</div>
        ) : (
          grouped.order.map((hookKey) => {
            const items = grouped.byHook[hookKey];
            const latest = items.slice().sort((a,b)=>b.startedAt-a.startedAt);
            const palette = getHookPalette(grouped.colors[hookKey]);
            const hookEnjoy = grouped.enjoyAvg[hookKey];
            const hookHighlights = latest.filter(s => s.highlight && s.highlight.trim());
            const sessionsByDay = groupByDay(latest);
            const open = cardOpen[hookKey] ?? true;
            return (
          <div key={hookKey} className={`bg-white dark:bg-gray-800 border ${palette.border.replace('border-','dark:border-').replace('200','700')} ${palette.border} rounded-lg`}>
                <div className={`px-4 py-3 flex items-center justify-between ${palette.headerBg} ${toDarkBg(palette.headerBg)}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl" aria-hidden>{grouped.emojis[hookKey] || '🎯'}</span>
                    <div>
                      <div className={`font-semibold ${palette.headerText} ${toDarkText(palette.headerText)}`}>{grouped.labels[hookKey]}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{grouped.totals[hookKey] || 0}m • {items.length} sessions{!isNaN(hookEnjoy)?` • Avg enjoy ${hookEnjoy}/5`:''}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HookEditMenu
                      hookKey={hookKey}
                      label={grouped.labels[hookKey]}
                      emoji={grouped.emojis[hookKey]}
                      color={grouped.colors[hookKey]}
                      onUpdate={(partial) => onUpdateHook && onUpdateHook(hookKey, partial)}
                    />
                    <button onClick={() => setCardOpen(o => ({ ...o, [hookKey]: !open }))} className="p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700" aria-label={open?'Collapse':'Expand'}>
                      {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {open && (
                  <>
                    {/* Sessions list grouped by day (collapsible per day) */}
                    <div className="px-4 py-3 space-y-2">
                      {Object.entries(sessionsByDay).map(([day, arr], idx) => {
                        const key = `${hookKey}:${day}`;
                        const dayIsOpen = dayOpen[key] ?? (idx === 0);
                        return (
                          <div key={day} className="border border-gray-200 dark:border-gray-700 rounded">
                            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 cursor-pointer" onClick={() => setDayOpen(o => ({ ...o, [key]: !dayIsOpen }))}>
                              <div className="flex items-center gap-2">
                                {dayIsOpen ? <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" /> : <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                                <div className="text-xs text-gray-700 dark:text-gray-300">{day}</div>
                              </div>
                            </div>
                            {dayIsOpen && (
                              <div className="px-3 py-2 space-y-1">
                                {arr.map(s => (
                                  <div key={s.id} className="text-sm text-gray-800 dark:text-gray-100 flex items-center justify-between">
                                    <span>{formatTimeOnly(s.startedAt)} • {s.questTitle || '—'}</span>
                                    <span className="text-gray-600 dark:text-gray-400">{s.minutes || 0}m{s.enjoyment!=null?` • Enjoy ${s.enjoyment}/5`:''}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {/* Highlights within hook — grouped by day (collapsible per day) */}
                    {hookHighlights.length > 0 && (
                      <div className="px-4 pb-3">
                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Highlights by day</div>
                        <div className="space-y-2">
                          {Object.entries(groupByDay(hookHighlights)).map(([day, arr]) => {
                            const key = `${hookKey}:H:${day}`;
                            const dayIsOpen = dayOpen[key] ?? false;
                            return (
                              <div key={day} className="border border-gray-200 dark:border-gray-700 rounded">
                                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 cursor-pointer" onClick={() => setDayOpen(o => ({ ...o, [key]: !dayIsOpen }))}>
                                  <div className="flex items-center gap-2">
                                    {dayIsOpen ? <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" /> : <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                                    <div className="text-xs text-gray-700 dark:text-gray-300">{day}</div>
                                  </div>
                                </div>
                                {dayIsOpen && (
                                  <ul className="list-disc pl-5 py-2 pr-3 space-y-1">
                                    {arr.map(h => (
                                      <li key={`hc-${h.id}`} className="text-sm text-gray-800 dark:text-gray-100">{h.highlight}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Highlights recap removed per request (integrated into hook cards) */}
    </div>
  );
}

function toDarkBg(lightBg) {
  // Map bg-*-50 to dark translucent 900/20
  if (!lightBg) return '';
  return lightBg
    .replace('bg-emerald-50', 'dark:bg-emerald-900/20')
    .replace('bg-blue-50', 'dark:bg-blue-900/20')
    .replace('bg-purple-50', 'dark:bg-purple-900/20')
    .replace('bg-amber-50', 'dark:bg-amber-900/20')
    .replace('bg-rose-50', 'dark:bg-rose-900/20')
    .replace('bg-indigo-50', 'dark:bg-indigo-900/20')
    .replace('bg-teal-50', 'dark:bg-teal-900/20')
    .replace('bg-orange-50', 'dark:bg-orange-900/20');
}

function toDarkText(lightText) {
  if (!lightText) return '';
  return lightText
    .replace('text-emerald-900', 'dark:text-emerald-200')
    .replace('text-blue-900', 'dark:text-blue-200')
    .replace('text-purple-900', 'dark:text-purple-200')
    .replace('text-amber-900', 'dark:text-amber-200')
    .replace('text-rose-900', 'dark:text-rose-200')
    .replace('text-indigo-900', 'dark:text-indigo-200')
    .replace('text-teal-900', 'dark:text-teal-200')
    .replace('text-orange-900', 'dark:text-orange-200');
}

function toDarkBarBg(light) {
  if (!light) return '';
  return light
    .replace('bg-emerald-100', 'dark:bg-emerald-900/40')
    .replace('bg-blue-100', 'dark:bg-blue-900/40')
    .replace('bg-purple-100', 'dark:bg-purple-900/40')
    .replace('bg-amber-100', 'dark:bg-amber-900/40')
    .replace('bg-rose-100', 'dark:bg-rose-900/40')
    .replace('bg-indigo-100', 'dark:bg-indigo-900/40')
    .replace('bg-teal-100', 'dark:bg-teal-900/40')
    .replace('bg-orange-100', 'dark:bg-orange-900/40');
}

function Tile({ label, value }) {
  return (
    <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="text-xs text-gray-600 dark:text-gray-400">{label}</div>
      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{value}</div>
    </div>
  );
}

function HookBars({ grouped }) {
  const max = Math.max(1, ...grouped.order.map(k => grouped.totals[k] || 0));
  return (
    <div className="space-y-2">
      {grouped.order.map(k => {
        const palette = getHookPalette(grouped.colors[k]);
        return (
          <div key={k} className="flex items-center gap-2">
            <div className="w-40 text-sm text-gray-700 dark:text-gray-300 truncate">
              <span className="mr-1" aria-hidden>{grouped.emojis[k] || '🎯'}</span>
              {grouped.labels[k]}
            </div>
            <div className={`flex-1 ${palette.barBg} ${toDarkBarBg(palette.barBg)} h-3 rounded`}>
              <div className={`h-3 ${palette.barFill}`} style={{ width: `${Math.round(((grouped.totals[k]||0)/max)*100)}%` }} />
            </div>
            <div className="w-16 text-right text-sm text-gray-700 dark:text-gray-300">{grouped.totals[k]||0}m</div>
          </div>
        );
      })}
    </div>
  );
}

function HookEditMenu({ hookKey, label, emoji, color, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [localEmoji, setLocalEmoji] = useState(emoji || '🎯');
  const [localColor, setLocalColor] = useState(color || 'emerald');
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50">Edit</button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow p-3 z-10">
          <label className="block text-xs text-gray-600 mb-1">Emoji</label>
          <input value={localEmoji} onChange={(e)=>setLocalEmoji(e.target.value)} className="w-full p-1 border border-gray-300 rounded mb-2" />
          <label className="block text-xs text-gray-600 mb-1">Color</label>
          <select value={localColor} onChange={(e)=>setLocalColor(e.target.value)} className="w-full p-1 border border-gray-300 rounded mb-2">
            {HOOK_COLORS.map(c => (<option key={c} value={c}>{c}</option>))}
          </select>
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="text-xs text-gray-600">Cancel</button>
            <button onClick={() => { onUpdate && onUpdate({ emoji: localEmoji, color: localColor }); setOpen(false); }} className="text-xs text-blue-700">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

const HOOK_COLORS = ['emerald','blue','purple','amber','rose','indigo','teal','orange'];

function getHookPalette(color) {
  switch (color) {
    case 'blue': return { border: 'border-blue-200', headerBg: 'bg-blue-50', headerText: 'text-blue-900', btn: 'border-blue-300 text-blue-700 bg-white hover:bg-blue-50', barBg: 'bg-blue-100', barFill: 'bg-blue-600' };
    case 'purple': return { border: 'border-purple-200', headerBg: 'bg-purple-50', headerText: 'text-purple-900', btn: 'border-purple-300 text-purple-700 bg-white hover:bg-purple-50', barBg: 'bg-purple-100', barFill: 'bg-purple-600' };
    case 'amber': return { border: 'border-amber-200', headerBg: 'bg-amber-50', headerText: 'text-amber-900', btn: 'border-amber-300 text-amber-700 bg-white hover:bg-amber-50', barBg: 'bg-amber-100', barFill: 'bg-amber-600' };
    case 'rose': return { border: 'border-rose-200', headerBg: 'bg-rose-50', headerText: 'text-rose-900', btn: 'border-rose-300 text-rose-700 bg-white hover:bg-rose-50', barBg: 'bg-rose-100', barFill: 'bg-rose-600' };
    case 'indigo': return { border: 'border-indigo-200', headerBg: 'bg-indigo-50', headerText: 'text-indigo-900', btn: 'border-indigo-300 text-indigo-700 bg-white hover:bg-indigo-50', barBg: 'bg-indigo-100', barFill: 'bg-indigo-600' };
    case 'teal': return { border: 'border-teal-200', headerBg: 'bg-teal-50', headerText: 'text-teal-900', btn: 'border-teal-300 text-teal-700 bg-white hover:bg-teal-50', barBg: 'bg-teal-100', barFill: 'bg-teal-600' };
    case 'orange': return { border: 'border-orange-200', headerBg: 'bg-orange-50', headerText: 'text-orange-900', btn: 'border-orange-300 text-orange-700 bg-white hover:bg-orange-50', barBg: 'bg-orange-100', barFill: 'bg-orange-600' };
    case 'emerald':
    default:
      return { border: 'border-emerald-200', headerBg: 'bg-emerald-50', headerText: 'text-emerald-900', btn: 'border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-50', barBg: 'bg-emerald-100', barFill: 'bg-emerald-600' };
  }
}

function groupByHook(sessions, hooks) {
  const hookMap = {};
  hooks.forEach(h => { hookMap[h.id] = h; });
  const byHook = {};
  const labels = {};
  const totals = {};
  const colors = {};
  const emojis = {};
  const enjoySum = {};
  const enjoyCount = {};
  sessions.forEach(s => {
    const k = s.hookId || s.hookLabel || '—';
    byHook[k] = byHook[k] || [];
    byHook[k].push(s);
    const meta = hookMap[k];
    labels[k] = meta?.label || s.hookLabel || '—';
    totals[k] = (totals[k] || 0) + (s.minutes || 0);
    colors[k] = meta?.color || 'emerald';
    emojis[k] = meta?.emoji || '🎯';
    if (typeof s.enjoyment === 'number') {
      enjoySum[k] = (enjoySum[k] || 0) + s.enjoyment;
      enjoyCount[k] = (enjoyCount[k] || 0) + 1;
    }
  });
  const order = Object.keys(byHook).sort((a, b) => (totals[b]||0) - (totals[a]||0));
  const enjoyAvg = {};
  order.forEach(k => {
    const avg = (enjoySum[k] || 0) / Math.max(1, (enjoyCount[k] || 0));
    enjoyAvg[k] = Math.round(avg * 10) / 10;
  });
  return { byHook, labels, totals, order, colors, emojis, enjoyAvg };
}

function formatDateTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch {
    return String(ts);
  }
}

function formatTimeOnly(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return String(ts);
  }
}

function calcEnjoyAvg(list) {
  const arr = list.filter(s => typeof s.enjoyment === 'number');
  if (arr.length === 0) return NaN;
  const avg = arr.reduce((a, s) => a + s.enjoyment, 0) / arr.length;
  return Math.round(avg * 10) / 10;
}

function groupByDay(list) {
  const map = {};
  list.forEach(h => {
    const d = new Date(h.startedAt);
    const key = d.toLocaleDateString([], { month: 'short', day: '2-digit' });
    (map[key] = map[key] || []).push(h);
  });
  return map;
}


