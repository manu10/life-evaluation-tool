import React, { useState } from 'react';

export default function WeeklyReview({ isOpen, onClose, onSave, initial = {} }) {
  if (!isOpen) return null;

  const [form, setForm] = useState({
    whatWorked: initial.whatWorked || '',
    whatDidnt: initial.whatDidnt || '',
    adjustments: (initial.adjustments || []).join(', '),
    wins: (initial.wins || []).join(', '),
  });

  function save() {
    const payload = {
      whatWorked: form.whatWorked.trim(),
      whatDidnt: form.whatDidnt.trim(),
      adjustments: form.adjustments.split(',').map(s => s.trim()).filter(Boolean),
      wins: form.wins.split(',').map(s => s.trim()).filter(Boolean),
    };
    onSave && onSave(payload);
    onClose && onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Weekly Review</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">✕</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">What worked</span>
            <textarea value={form.whatWorked} onChange={(e) => setForm({ ...form, whatWorked: e.target.value })} className="mt-1 p-2 border border-gray-300 rounded-md w-full h-24" />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">What didn’t</span>
            <textarea value={form.whatDidnt} onChange={(e) => setForm({ ...form, whatDidnt: e.target.value })} className="mt-1 p-2 border border-gray-300 rounded-md w-full h-24" />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm text-gray-700">Adjustments (comma separated)</span>
            <input type="text" value={form.adjustments} onChange={(e) => setForm({ ...form, adjustments: e.target.value })} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm text-gray-700">Wins (comma separated)</span>
            <input type="text" value={form.wins} onChange={(e) => setForm({ ...form, wins: e.target.value })} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
          </label>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 border border-gray-300 rounded-md">Cancel</button>
          <button onClick={save} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Save</button>
        </div>
      </div>
    </div>
  );
}


