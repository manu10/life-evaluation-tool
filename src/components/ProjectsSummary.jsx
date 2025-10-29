import React from 'react';

export default function ProjectsSummary({ projects = [], onToggleAction, onOpenProject }) {
  const activeProjects = projects.filter(p => p.status === 'active');
  const projectsWithNext = activeProjects.filter(p => {
    const actions = Array.isArray(p.actions) ? p.actions : [];
    const nextIndex = p.nextActionIndex;
    return nextIndex != null && actions[nextIndex] && !actions[nextIndex].done;
  });

  if (projectsWithNext.length === 0) {
    return (
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4 mb-6">
        <div className="text-center text-sm text-emerald-700">
          <div className="font-semibold mb-1">🎯 No active project actions yet</div>
          <p className="text-xs">Open a project and star (⭐) your next action to see it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-emerald-900">🎯 Next Actions</h3>
        <span className="text-xs text-emerald-700">{projectsWithNext.length} active</span>
      </div>
      <div className="space-y-2">
        {projectsWithNext.map(project => {
          const actions = Array.isArray(project.actions) ? project.actions : [];
          const nextAction = actions[project.nextActionIndex];
          if (!nextAction || nextAction.done) return null;
          return (
            <div key={project.id} className="bg-white rounded-lg border border-emerald-200 p-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => onToggleAction && onToggleAction(project.id, project.nextActionIndex)}
                  className="w-5 h-5 mt-0.5 text-emerald-600 rounded focus:ring-emerald-500"
                  title="Mark as complete"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-600 mb-1">
                    <button
                      onClick={() => onOpenProject && onOpenProject(project.id)}
                      className="font-semibold hover:text-emerald-700"
                    >
                      {project.title || 'Untitled Project'}
                    </button>
                    {project.status === 'solved' && <span className="ml-2 text-emerald-600">✓ Solved</span>}
                  </div>
                  <div className="text-sm text-gray-900 flex items-center gap-2">
                    <span className="text-amber-500">⭐</span>
                    {nextAction.content}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

