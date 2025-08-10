import React, { useState } from 'react';
import BreathingGuideModal from './modals/BreathingGuideModal';
import AnchorModal from './modals/AnchorModal';
import PostureConfirmModal from './modals/PostureConfirmModal';

export default function FiveStepProtocol({
  isOpen,
  onClose,
  onSaveABC,
  onLogMicro,
  replacementActions = [],
  onStartReplacement,
  environmentProfile = {},
  onApplyEnvironment,
  onCompleteSession,
  onSaveAnxiety, // ({ rating, notes })
  onOpenSettings
}) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [abc, setAbc] = useState({ setting: '', antecedent: '', behavior: '', consequence: '', effect: '' });
  const [anxiety, setAnxiety] = useState({ rating: 5, notes: '' });

  function next() { setStep((s) => Math.min(5, s + 1)); }
  function prev() { setStep((s) => Math.max(1, s - 1)); }

  function complete() {
    if (typeof onSaveAnxiety === 'function') onSaveAnxiety(anxiety);
    if (typeof onCompleteSession === 'function') onCompleteSession();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 border border-gray-200 z-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">5‑Step Protocol</h3>
          <div className="text-sm text-gray-600">Step {step}/5</div>
        </div>

        {step === 1 && (
          <StepCard title="Step 1 — Identify Your Triggers">
            <p className="text-sm text-gray-700 mb-3">Track what happens right before anxiety hits. Note time, place, people, thoughts.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Setting" value={abc.setting} onChange={(v) => setAbc({ ...abc, setting: v })} placeholder="e.g., Desk at home" />
              <Field label="Antecedent" value={abc.antecedent} onChange={(v) => setAbc({ ...abc, antecedent: v })} placeholder="What happened right before?" />
              <Field label="Behavior" value={abc.behavior} onChange={(v) => setAbc({ ...abc, behavior: v })} placeholder="What did you do?" />
              <Field label="Consequence" value={abc.consequence} onChange={(v) => setAbc({ ...abc, consequence: v })} placeholder="What happened after?" />
              <Field label="Effect" value={abc.effect} onChange={(v) => setAbc({ ...abc, effect: v })} placeholder="Intensity/duration impact" />
            </div>
            <div className="mt-4">
              <button
                onClick={() => { onSaveABC && onSaveABC(abc); next(); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save & Next
              </button>
            </div>
          </StepCard>
        )}

        {step === 2 && (
          <StepCard title="Step 2 — Break the Chain Early">
            <p className="text-sm text-gray-700 mb-3">Small interruptions = big changes.</p>
            <InterruptConfirm onLogMicro={onLogMicro} />
            <FooterNav onPrev={prev} onNext={next} />
          </StepCard>
        )}

        {step === 3 && (
          <StepCard title="Step 3 — Replace the behavior">
            <p className="text-sm text-gray-700 mb-3">Choose an easy replacement and reward after.</p>
            <div className="flex flex-wrap gap-2">
              {replacementActions.slice(0, 5).map((a) => (
                <button
                  key={a.id}
                  onClick={() => onStartReplacement && onStartReplacement(a)}
                  className="px-3 py-2 text-xs rounded-lg border border-green-300 text-green-700 hover:bg-green-50"
                  title={a.rewardText ? `Reward: ${a.rewardText}` : ''}
                >
                  Do now: {a.title}
                </button>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-600">
              {replacementActions.length === 0 ? (
                <span>No replacement actions yet. </span>
              ) : (
                <span>Need more options? </span>
              )}
              {typeof onOpenSettings === 'function' && (
                <button onClick={onOpenSettings} className="underline text-blue-700">Add or edit in Settings</button>
              )}
            </div>
            <FooterNav onPrev={prev} onNext={next} />
          </StepCard>
        )}

        {step === 4 && (
          <StepCard title="Step 4 — Engineer your environment">
            <p className="text-sm text-gray-700 mb-3">Apply a tweak now.</p>
            <EnvironmentConfirm environmentProfile={environmentProfile} onApplyEnvironment={onApplyEnvironment} />
            <div className="mt-3 text-xs text-gray-600">
              {((environmentProfile?.removals || []).length + (environmentProfile?.additions || []).length) === 0 ? (
                <span>No environment items yet. </span>
              ) : (
                <span>Want to refine your list? </span>
              )}
              {typeof onOpenSettings === 'function' && (
                <button onClick={onOpenSettings} className="underline text-blue-700">Manage in Settings</button>
              )}
            </div>
            <FooterNav onPrev={prev} onNext={next} />
          </StepCard>
        )}

        {step === 5 && (
          <StepCard title="Step 5 — Track & Adjust">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm text-gray-700">Anxiety rating (1–10)</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={anxiety.rating}
                  onChange={(e) => setAnxiety({ ...anxiety, rating: parseInt(e.target.value || '0', 10) })}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-24"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">What worked / didn’t</span>
                <input
                  type="text"
                  value={anxiety.notes}
                  onChange={(e) => setAnxiety({ ...anxiety, notes: e.target.value })}
                  placeholder="Optional notes"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </label>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button onClick={prev} className="px-3 py-2 border border-gray-300 rounded-md">Back</button>
              <button onClick={complete} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Finish</button>
            </div>
          </StepCard>
        )}
      </div>
    </div>
  );
}

function StepCard({ title, children }) {
  return (
    <div>
      <h4 className="text-base font-semibold text-gray-900 mb-3">{title}</h4>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="flex flex-col">
      <span className="text-sm text-gray-700 mb-1">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="p-2 border border-gray-300 rounded-md"
      />
    </label>
  );
}

function ActionButton({ label, onClick }) {
  return (
    <button onClick={onClick} className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 text-sm">
      {label}
    </button>
  );
}

function FooterNav({ onPrev, onNext }) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <button onClick={onPrev} className="px-3 py-2 border border-gray-300 rounded-md">Back</button>
      <button onClick={onNext} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Next</button>
    </div>
  );
}

function InterruptConfirm({ onLogMicro }) {
  const [open, setOpen] = useState({ breath: false, posture: false, anchor: false });
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <button className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 text-sm" onClick={() => setOpen(o => ({ ...o, breath: true }))}>
        Take 3 breaths
      </button>
      <button className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 text-sm" onClick={() => setOpen(o => ({ ...o, posture: true }))}>
        Change posture
      </button>
      <button className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 text-sm" onClick={() => setOpen(o => ({ ...o, anchor: true }))}>
        Start 30s anchor
      </button>
      {open.breath && (
        <BreathingGuideModal onClose={() => setOpen(o => ({ ...o, breath: false }))} onComplete={() => { onLogMicro && onLogMicro('breaths'); }} />
      )}
      {open.posture && (
        <PostureConfirmModal onClose={() => setOpen(o => ({ ...o, posture: false }))} onConfirm={() => { onLogMicro && onLogMicro('posture'); }} />
      )}
      {open.anchor && (
        <AnchorModal onClose={() => setOpen(o => ({ ...o, anchor: false }))} seconds={30} onConfirm={() => { onLogMicro && onLogMicro('anchor'); }} />
      )}
    </div>
  );
}

function EnvironmentConfirm({ environmentProfile, onApplyEnvironment }) {
  const items = [
    ...(environmentProfile?.removals || []).map((t) => ({ type: 'removal', text: t })),
    ...(environmentProfile?.additions || []).map((t) => ({ type: 'addition', text: t })),
  ].slice(0, 5);
  const [confirming, setConfirming] = useState(null);
  const [confirmed, setConfirmed] = useState({});
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <button
          key={it.type+it.text}
          onClick={() => setConfirming(it)}
          className={`px-3 py-2 text-xs rounded-lg border ${confirmed[it.text] ? 'border-green-300 text-green-700 bg-green-50' : 'border-amber-300 text-amber-700 hover:bg-amber-50'}`}
        >
          {confirmed[it.text] ? 'Applied ✓ ' : 'Apply: '} {it.text}
        </button>
      ))}
      {confirming && (
        <EnvConfirmModal
          item={confirming}
          onCancel={() => setConfirming(null)}
          onConfirm={() => {
            onApplyEnvironment && onApplyEnvironment(confirming);
            setConfirmed((c) => ({ ...c, [confirming.text]: true }));
            setConfirming(null);
          }}
        />
      )}
    </div>
  );
}

// removed locally defined AnchorModal/BreathingGuideModal in favor of shared components

function EnvConfirmModal({ item, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-lg p-6 border border-gray-200 w-full max-w-sm">
        <h4 className="text-base font-semibold text-gray-900 mb-2">Apply environment tweak</h4>
        <p className="text-sm text-gray-700 mb-3">{item.type === 'removal' ? 'Remove cue:' : 'Add anchor:'} <span className="font-medium">{item.text}</span></p>
        <div className="flex items-center justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700">Confirm</button>
        </div>
      </div>
    </div>
  );
}


