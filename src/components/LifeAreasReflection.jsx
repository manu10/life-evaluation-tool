import React from 'react';

const FEELINGS = [
  { value: 'thriving', label: '🌟' },
  { value: 'good', label: '😊' },
  { value: 'okay', label: '😐' },
  { value: 'struggling', label: '😔' },
  { value: 'stuck', label: '😰' }
];

const ENCOURAGEMENTS = [
  'Small is big. One sentence is enough.',
  'Write the first thing that comes to mind.',
  '1% better beats 0% perfect.',
  'Keep it tiny and specific.',
  'What helped a little today?',
  'Name one tweak you can try.',
  'Gratitude first, improvement second.',
  'Make it doable in 2 minutes.',
  'Focus on what you can control.',
  'Reduce the scope, stick to the schedule.',
  'Action cures uncertainty.',
  'Identity first: be the person who shows up.',
  'Environment beats willpower—make it easy.',
  'Clear is kind: say it simply.',
  'You don’t need more time, just the first step.',
  'Tiny habits, big trajectory.',
  'Let go of perfect, aim for progress.',
  'What would the wiser you do next?',
  'Default to starting, not judging.',
  'Less friction, more momentum.',
  'Make it obvious. Make it attractive.',
  'Win the day with one small win.',
  'Consistency compounds quietly.',
  'Sustainability over intensity.',
  'Cue → Routine → Reward: design the loop.',
  'Begin anywhere; refinement comes after.',
  'Light a small fire, then add wood.',
  'Say “just this much” and begin.',
  'Choose the next right action.',
  'The obstacle is the way—find the smallest move.',
  'Don’t break the chain today.',
  'Lower the bar, keep the promise.',
  'Leave a breadcrumb for tomorrow-you.'
  , 'Be fearful when others are greedy; greedy when others are fearful.'
  , 'The big money is in the waiting.'
  , 'Invert — always invert.'
  , 'Know what you own, and why you own it.'
  , 'Stay within your circle of competence.'
  , 'Price is what you pay; value is what you get.'
  , 'Diversification protects against ignorance.'
  , 'Time in the market beats timing the market.'
  , 'Avoid activity bias — often, doing nothing is best.'
  , 'Check base rates before you guess.'
  , 'Think in second‑order effects.'
  , 'Invert the problem: what would break it?'
  , 'The map is not the territory.'
  , 'Occam’s razor: simpler first.'
  , 'Chesterton’s fence: understand before changing.'
  , 'Availability ≠ importance.'
  , 'Anchor less, re‑estimate fresh.'
  , 'Pre‑mortem: how could this fail?'
  , 'Sunk cost? Decide as if starting today.'
  , 'Seek disconfirming evidence (fight confirmation bias).'
  , 'Beware survivorship bias — where’s the missing data?'
  , 'Opportunity cost: what am I giving up?'
  , 'Expected value > gut certainty.'
  , 'Regression to the mean — don’t overreact.'
  , 'Lindy effect: will it still matter later?'
];

export default function LifeAreasReflection({ lifeAreas = [], reflections = {}, onChange, minRequired = 2, onAnyChange, style = 'unfold' }) {
  const [encByArea, setEncByArea] = React.useState({});
  function setField(area, key, value) {
    const next = { ...(reflections || {}) };
    const prev = next[area] || {};
    next[area] = { ...prev, [key]: value };
    onChange && onChange(next);
    onAnyChange && onAnyChange();
    if (key === 'feeling' && !prev.feeling && value) {
      setEncByArea(prevMap => (
        prevMap[area] ? prevMap : { ...prevMap, [area]: ENCOURAGEMENTS[Math.floor(Math.random()*ENCOURAGEMENTS.length)] }
      ));
    }
  }

  const filledCount = lifeAreas.filter(a => {
    const r = reflections?.[a];
    return !!(r && ((r.grateful && r.grateful.trim()) || (r.improve && r.improve.trim())));
  }).length;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Areas Reflection</h2>
      <p className="text-sm text-gray-600 mb-4">Pick a feeling for each area, then add a gratitude or an improvement for at least {minRequired} areas.</p>
      {style === 'focus' ? (
        <FocusCarousel lifeAreas={lifeAreas} reflections={reflections} setField={setField} />
      ) : (
        <div className="space-y-4">
        {lifeAreas.map(area => {
          const feeling = reflections?.[area]?.feeling;
          const showDetails = style === 'inline' ? true : style === 'unfold' ? !!feeling : true;
          const completed = !!((reflections?.[area]?.grateful && reflections[area].grateful.trim()) || (reflections?.[area]?.improve && reflections[area].improve.trim()));
          return (
            <div key={area} className={`p-4 bg-white border border-gray-200 rounded-lg transition-all`}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <span>{area}</span>
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 transform transition-transform duration-200 ${completed ? 'scale-100' : 'scale-0'}`}>✓</span>
                </div>
                <div className="flex items-center gap-1">
                  {FEELINGS.map(f => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setField(area, 'feeling', f.value)}
                      className={`w-8 h-8 rounded-md border text-base flex items-center justify-center transition-all ${feeling === f.value ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}
                      title={f.value}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              {style === 'focus' ? (
                <div className="text-xs text-gray-500">Focus mode will be available in a dedicated carousel view.</div>
              ) : (
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 overflow-hidden transition-all duration-200 ${showDetails ? 'opacity-100 max-h-48' : 'opacity-0 max-h-0 pointer-events-none'}`}>
                  {feeling && encByArea[area] && (
                    <div className="col-span-1 md:col-span-2 text-xs text-indigo-800 bg-indigo-50 border border-indigo-200 rounded px-2 py-1">{encByArea[area]}</div>
                  )}
                  <label className={`block text-xs text-gray-700 ${style==='inline' && !feeling ? 'opacity-50 pointer-events-none' : ''}`}>
                    <span className="block mb-1">Grateful for</span>
                    <input
                      type="text"
                      value={reflections?.[area]?.grateful || ''}
                      onChange={(e) => setField(area, 'grateful', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="One small thing you appreciate"
                    />
                  </label>
                  <label className={`block text-xs text-gray-700 ${style==='inline' && !feeling ? 'opacity-50 pointer-events-none' : ''}`}>
                    <span className="block mb-1">One thing to improve</span>
                    <input
                      type="text"
                      value={reflections?.[area]?.improve || ''}
                      onChange={(e) => setField(area, 'improve', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Tiny adjustment you can make"
                    />
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}
      <div className="mt-3 text-sm text-gray-700">Completed: {filledCount}/{minRequired} required • Feelings: required for all areas</div>
    </div>
  );
}

function FocusCarousel({ lifeAreas, reflections, setField }) {
  const [idx, setIdx] = React.useState(0);
  const [fade, setFade] = React.useState(true);
  const [encMap, setEncMap] = React.useState({});
  const gratefulRef = React.useRef(null);
  const area = lifeAreas[idx];
  const feeling = reflections?.[area]?.feeling;

  React.useEffect(() => {
    setFade(false);
    const t = setTimeout(() => setFade(true), 10);
    return () => clearTimeout(t);
  }, [idx]);

  React.useEffect(() => {
    if (feeling) {
      if (!encMap[area]) {
        setEncMap(prev => ({ ...prev, [area]: ENCOURAGEMENTS[Math.floor(Math.random()*ENCOURAGEMENTS.length)] }));
      }
      // Focus the first input after selecting a feeling
      const t = setTimeout(() => {
        if (gratefulRef.current) {
          try { gratefulRef.current.focus(); } catch {}
        }
      }, 50);
      return () => clearTimeout(t);
    }
  }, [feeling, area, encMap]);

  function next() { setIdx(i => Math.min(lifeAreas.length - 1, i + 1)); }
  function prev() { setIdx(i => Math.max(0, i - 1)); }

  // keyboard navigation
  React.useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const completed = !!((reflections?.[area]?.grateful && reflections[area].grateful.trim()) || (reflections?.[area]?.improve && reflections[area].improve.trim()));

  const canNext = !!feeling && idx < lifeAreas.length - 1;

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <div className="mb-2 h-1 w-full bg-gray-100 rounded overflow-hidden">
        <div className="h-1 bg-blue-500 transition-all" style={{ width: `${((idx+1)/lifeAreas.length)*100}%` }} />
      </div>
      <div className={`transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <span>{area}</span>
            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 transform transition-transform duration-200 ${completed ? 'scale-100' : 'scale-0'}`}>✓</span>
          </div>
          <div className="text-xs text-gray-600">{idx + 1}/{lifeAreas.length}</div>
        </div>
        <div className="flex items-center gap-1 mb-3">
          {FEELINGS.map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => setField(area, 'feeling', f.value)}
              className={`w-10 h-10 rounded-md border text-lg flex items-center justify-center transition-all ${feeling === f.value ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}
              title={f.value}
            >
              {f.label}
            </button>
          ))}
        </div>
        {feeling && encMap[area] && (
          <div className="mb-2 text-xs text-indigo-800 bg-indigo-50 border border-indigo-200 rounded px-2 py-1">{encMap[area]}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block text-xs text-gray-700">
            <span className="block mb-1">Grateful for</span>
            <input
              ref={gratefulRef}
              type="text"
              value={reflections?.[area]?.grateful || ''}
              onChange={(e) => setField(area, 'grateful', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="One small thing you appreciate"
              disabled={!feeling}
            />
          </label>
          <label className="block text-xs text-gray-700">
            <span className="block mb-1">One thing to improve</span>
            <input
              type="text"
              value={reflections?.[area]?.improve || ''}
              onChange={(e) => setField(area, 'improve', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Tiny adjustment you can make"
              disabled={!feeling}
            />
          </label>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button onClick={prev} disabled={idx === 0} className={`px-3 py-2 rounded-md ${idx===0?'bg-gray-200 text-gray-600':'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>Prev</button>
          <div className="flex items-center gap-3">
            {feeling && !completed && (
              <button onClick={next} disabled={!canNext} className={`px-3 py-2 rounded-md ${canNext?'bg-gray-100 hover:bg-gray-200 text-gray-800':'bg-gray-200 text-gray-600'}`}>Skip details</button>
            )}
            <button onClick={next} disabled={!canNext} className={`px-3 py-2 rounded-md ${canNext ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-600'}`}>{idx===lifeAreas.length-1?'Done':'Next'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}


