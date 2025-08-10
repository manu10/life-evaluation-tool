import React, { useState } from 'react';

export default function TodosList({
  todos = [],
  onAdd,
  onToggle,
  onRemove,
  editable = true,
  title = "Today's Todos (optional)",
  colorClass = 'bg-yellow-50'
}) {
  const [newText, setNewText] = useState('');
  const canAddMore = (todos?.length || 0) < 5;

  return (
    <div className={`${colorClass} rounded-lg p-6 mb-8`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {editable && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const text = newText.trim();
            if (!text || !canAddMore) return;
            onAdd && onAdd(text);
            setNewText('');
          }}
          className="flex items-center gap-2 mb-4"
        >
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder={canAddMore ? 'Add a todo (max 5)' : 'Limit reached'}
            disabled={!canAddMore}
            className="flex-1 p-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            disabled={!canAddMore}
            className={`px-3 py-2 rounded-md text-sm ${canAddMore ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            title="Add todo"
          >
            Add
          </button>
        </form>
      )}

      {(!todos || todos.length === 0) && (
        <p className="text-sm text-gray-600">No todos yet.</p>
      )}

      <div className="space-y-3">
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center justify-between">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!todo.completed}
                onChange={() => onToggle && onToggle(todo.id)}
                disabled={!editable}
                className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500"
              />
              <span className={`text-gray-800 ${todo.completed ? 'line-through text-gray-500' : ''}`}>{todo.text}</span>
            </label>
            {editable && (
              <button
                onClick={() => onRemove && onRemove(todo.id)}
                className="text-xs text-gray-600 hover:text-red-600"
                title="Remove todo"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


