import React from 'react';

export default function ProjectsTab({ projects = [], onCreate, onOpen }) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
        <button
          onClick={onCreate}
          className="px-3 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
        >
          + New Project
        </button>
      </div>
      {projects.length === 0 ? (
        <div className="p-6 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm">No projects yet. Create your first one.</div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {projects.map(p => {
            const ideas = Array.isArray(p.ideas) ? p.ideas.length : 0;
            const actions = Array.isArray(p.actions) ? p.actions.length : 0;
            const progress = Array.isArray(p.progress) ? p.progress.length : 0;
            return (
            <button
              key={p.id}
              onClick={() => onOpen(p.id)}
              className={`w-full text-left p-4 rounded-lg border hover:shadow-sm transition bg-white ${p.status === 'solved' ? 'border-emerald-200' : 'border-gray-200'}`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-800">{p.title || 'Untitled Project'}</div>
                <div className={`text-xs px-2 py-0.5 rounded ${p.status === 'solved' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{p.status || 'active'}</div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 border border-gray-200">💡 {ideas}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 border border-gray-200">✅ {actions}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 border border-gray-200">📊 {progress}</span>
                <span className="ml-auto">Updated: {new Date(p.updatedAt || p.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


