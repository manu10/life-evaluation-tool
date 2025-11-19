import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { Input, Textarea } from './ui/Input';
import { usePersistentState } from '../hooks/usePersistentState';

const DEFAULT_IDENTITY =
  'You are someone who keeps promises to yourself.';
const DEFAULT_PHRASES = [
  "You've got this.",
  'Stay with it. One step at a time.',
  'You handle hard things.',
  'Breathe. Focus on the next action.',
];

function getTodayId() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function computeConsecutiveDays(historyDates, todayId) {
  // historyDates: array of YYYY-MM-DD strings (unique), sorted not guaranteed
  if (!Array.isArray(historyDates) || historyDates.length === 0) return 0;
  const set = new Set(historyDates);
  let streak = 0;
  let cursor = new Date(todayId);
  // If today is not completed, streak is 0.
  if (!set.has(todayId)) return 0;
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!set.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default function SelfTalkCoach() {
  const todayId = React.useMemo(getTodayId, []);

  const [identity, setIdentity] = usePersistentState(
    'selfTalk.identity',
    DEFAULT_IDENTITY
  );
  const [phrases, setPhrases] = usePersistentState(
    'selfTalk.phrases',
    DEFAULT_PHRASES
  );
  const [selectedPhraseIdx, setSelectedPhraseIdx] = React.useState(0);

  const [thoughtInput, setThoughtInput] = React.useState('');
  const [labeledThoughts, setLabeledThoughts] = usePersistentState(
    'selfTalk.labeledThoughts',
    []
  );

  // progressByDay: { [yyyy-mm-dd]: { identityAt?: number, coachAt?: number, labelAt?: number } }
  const [progressByDay, setProgressByDay] = usePersistentState(
    'selfTalk.progressByDay',
    {}
  );

  const todayProgress = progressByDay[todayId] || {};
  const step1Done = !!todayProgress.identityAt;
  const step2Done = !!todayProgress.coachAt;
  const step3Done = !!todayProgress.labelAt;
  const allDoneToday = step1Done && step2Done && step3Done;

  // history of completed days (all three done)
  const completedDays = React.useMemo(() => {
    return Object.entries(progressByDay)
      .filter(([, v]) => v.identityAt && v.coachAt && v.labelAt)
      .map(([k]) => k);
  }, [progressByDay]);

  const consecutive = computeConsecutiveDays(completedDays, todayId);
  const threeDayProgress = Math.min(3, consecutive);

  function markProgress(field) {
    setProgressByDay((prev) => {
      const curr = { ...(prev[todayId] || {}) };
      curr[field] = Date.now();
      return { ...prev, [todayId]: curr };
    });
  }

  function handleAffirmIdentity() {
    if (String(identity || '').trim().length === 0) return;
    markProgress('identityAt');
    speakIfAvailable(identity);
  }

  function handleSayPhrase(idx) {
    const phrase = phrases[idx] || '';
    if (!phrase) return;
    setSelectedPhraseIdx(idx);
    markProgress('coachAt');
    speakIfAvailable(phrase.startsWith('You') ? phrase : `You: ${phrase}`);
  }

  async function handleCopyPhrase(idx) {
    const phrase = phrases[idx] || '';
    if (!phrase) return;
    try {
      await navigator.clipboard.writeText(phrase);
      markProgress('coachAt');
    } catch {
      // ignore
    }
  }

  function handleLabelThought() {
    const t = String(thoughtInput || '').trim();
    if (!t) return;
    const item = {
      id: Date.now(),
      ts: new Date().toISOString(),
      thought: t,
      label: "That's a thought, not a fact.",
    };
    setLabeledThoughts((prev) => [item, ...prev].slice(0, 50));
    setThoughtInput('');
    markProgress('labelAt');
    speakIfAvailable("That's a thought, not a fact.");
  }

  function speakIfAvailable(text) {
    try {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1;
        window.speechSynthesis.speak(u);
      }
    } catch {
      // ignore
    }
  }

  function addCustomPhrase() {
    const v = prompt('Add a second-person coach phrase (e.g., "You can do this")');
    const clean = String(v || '').trim();
    if (!clean) return;
    setPhrases((prev) => [clean, ...prev].slice(0, 8));
  }

  return (
    <Card className="border-emerald-300 dark:border-emerald-700" padding="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            3‑Day Self‑Talk Coach
          </h3>
          <div className="text-xs text-emerald-900 dark:text-emerald-300">
            Second‑person coaching, identity priming, and thought labeling.
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((d) => (
            <div
              key={d}
              title={`Day ${d}`}
              className={`w-2.5 h-2.5 rounded-full ${
                threeDayProgress >= d
                  ? 'bg-emerald-600'
                  : 'bg-emerald-200 dark:bg-emerald-900/40'
              }`}
            />
          ))}
        </div>
      </div>

      {allDoneToday ? (
        <div className="mt-3 p-3 rounded-md border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-200 text-sm">
          Nice — all three steps completed for today. Keep it going tomorrow.
        </div>
      ) : (
        <div className="mt-2 text-xs text-emerald-900 dark:text-emerald-300">
          Complete all 3 steps today to advance your 3‑day streak.
        </div>
      )}

      {/* Step 1: Identity priming */}
      <div className="mt-4">
        <div className="text-xs font-semibold text-gray-800 dark:text-gray-100 mb-1">
          1) Identity statement (use “You…”)
        </div>
        <Textarea
          value={identity}
          onChange={(e) => setIdentity(e.target.value)}
          placeholder='e.g., "You are someone who keeps promises to yourself."'
          className="w-full"
        />
        <div className="mt-2 flex items-center gap-2">
          <Button intent="success" size="sm" onClick={handleAffirmIdentity}>
            Affirm now
          </Button>
          {step1Done && (
            <span className="text-xs text-emerald-800 dark:text-emerald-300">
              Done ✓
            </span>
          )}
        </div>
      </div>

      {/* Step 2: Second-person coach */}
      <div className="mt-4">
        <div className="text-xs font-semibold text-gray-800 dark:text-gray-100 mb-1">
          2) Second‑person coaching phrase
        </div>
        <div className="flex flex-wrap gap-2">
          {phrases.map((p, idx) => (
            <Button
              key={idx}
              size="sm"
              intent={selectedPhraseIdx === idx ? 'info' : 'neutral'}
              onClick={() => setSelectedPhraseIdx(idx)}
              className="whitespace-nowrap"
            >
              {p}
            </Button>
          ))}
          <Button size="sm" intent="primary" onClick={addCustomPhrase}>
            + Add
          </Button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Button
            intent="success"
            size="sm"
            onClick={() => handleSayPhrase(selectedPhraseIdx)}
          >
            Say it
          </Button>
          <Button
            intent="neutral"
            size="sm"
            onClick={() => handleCopyPhrase(selectedPhraseIdx)}
          >
            Copy
          </Button>
          {step2Done && (
            <span className="text-xs text-emerald-800 dark:text-emerald-300">
              Done ✓
            </span>
          )}
        </div>
      </div>

      {/* Step 3: Cognitive diffusion */}
      <div className="mt-4">
        <div className="text-xs font-semibold text-gray-800 dark:text-gray-100 mb-1">
          3) Label a negative self‑talk
        </div>
        <Input
          value={thoughtInput}
          onChange={(e) => setThoughtInput(e.target.value)}
          placeholder='Type a thought (e.g., "I always mess this up")'
          className="w-full"
        />
        <div className="mt-2 flex items-center gap-2">
          <Button intent="success" size="sm" onClick={handleLabelThought}>
            Label it: “That’s a thought, not a fact.”
          </Button>
          {step3Done && (
            <span className="text-xs text-emerald-800 dark:text-emerald-300">
              Done ✓
            </span>
          )}
        </div>
      </div>

      {/* Recent labeled thoughts (compact) */}
      {labeledThoughts.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold text-gray-800 dark:text-gray-100 mb-1">
            Recent labels
          </div>
          <ul className="space-y-1">
            {labeledThoughts.slice(0, 3).map((it) => (
              <li
                key={it.id}
                className="text-xs text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded px-2 py-1"
                title={new Date(it.ts).toLocaleString()}
              >
                “{it.thought}” → {it.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}


