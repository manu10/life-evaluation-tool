import React, { useState } from 'react';

export default function ABCLogger({ isOpen, onClose, onSave, initial = {} }) {
  if (!isOpen) return null;

  const [form, setForm] = useState({
    setting: initial.setting || '',
    antecedent: initial.antecedent || '',
    behavior: initial.behavior || '',
    consequence: initial.consequence || '',
    effect: initial.effect || ''
  });

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    if (typeof onSave === 'function') onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">ABC Log (Antecedent • Behavior • Consequence • Effect)</h3>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Setting (where)" value={form.setting} onChange={(v) => update('setting', v)} placeholder="e.g., Math lesson – small group" />
          <Field label="Antecedent (what happened right before)" value={form.antecedent} onChange={(v) => update('antecedent', v)} placeholder="e.g., Offered assistance; tight chest; racing thoughts" />
          <Field label="Behavior (what happened)" value={form.behavior} onChange={(v) => update('behavior', v)} placeholder="e.g., Refused; stood up; checked phone" />
          <Field label="Consequence (what happened after)" value={form.consequence} onChange={(v) => update('consequence', v)} placeholder="e.g., Redirected to desk; opened YouTube" />
          <Field label="Effect (impact on intensity/duration)" value={form.effect} onChange={(v) => update('effect', v)} placeholder="e.g., Anxiety increased; swore; prolonged distraction" />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save ABC</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
      />
    </div>
  );
}


