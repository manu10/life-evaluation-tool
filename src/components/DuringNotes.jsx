import React, { useState } from 'react';

export default function DuringNotes({ notes = [], onAdd, onRemove, editable = true }) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = (text || '').trim();
    if (!editable || !trimmed) return;
    onAdd && onAdd(trimmed);
    setText('');
  }

  function renderNoteText(t) {
    // Auto-link simple URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = String(t).split(urlRegex);
    return parts.map((part, idx) => {
      if (urlRegex.test(part)) {
        return (
          <a key={idx} href={part} target="_blank" rel="noreferrer" className="text-blue-700 dark:text-blue-300 underline break-all">{part}</a>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">During Notes</h3>
      </div>
      {editable && (
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a reflection, phrase, book, or paste a link…"
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Add</button>
          </div>
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">Tip: Press Enter to add quickly. Links auto-detect.</div>
        </form>
      )}
      <ul className="space-y-2">
        {notes.map(n => (
          <li key={n.id} className="p-2 bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 rounded">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap break-words">
                {renderNoteText(n.text)}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-gray-500 dark:text-gray-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {editable && (
                  <button onClick={() => onRemove && onRemove(n.id)} className="text-xs px-2 py-1 rounded-md border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20">Delete</button>
                )}
              </div>
            </div>
          </li>
        ))}
        {!notes.length && (
          <li className="text-sm text-gray-500 dark:text-gray-400">No notes yet.</li>
        )}
      </ul>
    </div>
  );
}


