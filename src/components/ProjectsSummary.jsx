import React from 'react';

export default function ProjectsSummary({ projects = [], maxActiveProjects = 3, onToggleAction, onOpenProject }) {
  const activeProjects = projects.filter(p => p.status === 'active');
  const hasWarning = activeProjects.length > maxActiveProjects;

  // Build list of projects to display
  const projectsToShow = activeProjects.map(p => {
    const actions = Array.isArray(p.actions) ? p.actions : [];
    const activeActions = actions.filter(a => !a.done);
    
    let nextAction = null;
    let nextActionIndex = -1;
    let isStarred = false;
    let showWarning = false;
    
    // Check if user has starred an action
    if (typeof p.nextActionIndex === 'number' && p.nextActionIndex >= 0) {
      const starredAction = actions[p.nextActionIndex];
      if (starredAction && !starredAction.done) {
        nextAction = starredAction;
        nextActionIndex = p.nextActionIndex;
        isStarred = true;
      }
    }
    
    // If no starred action, show first active action
    if (!nextAction && activeActions.length > 0) {
      nextAction = activeActions[0];
      nextActionIndex = actions.indexOf(activeActions[0]);
      isStarred = false;
    }
    
    // If no actions at all, show warning
    if (!nextAction && activeActions.length === 0) {
      showWarning = true;
    }
    
    return { project: p, nextAction, nextActionIndex, isStarred, showWarning };
  }).filter(item => item.nextAction || item.showWarning);

  if (projectsToShow.length === 0 && !hasWarning) {
    return (
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4 mb-6">
        <div className="text-center text-sm text-emerald-700">
          <div className="font-semibold mb-1">🎯 No active projects yet</div>
          <p className="text-xs">Create a project and add tasks to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-emerald-900">🎯 Next Actions</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-700">{activeProjects.length} active</span>
          {hasWarning && (
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 border border-orange-300 rounded">
              <span className="text-orange-600">⚠️</span>
              <span className="text-xs font-medium text-orange-800">
                Too many active projects!
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {projectsToShow.map(({ project, nextAction, nextActionIndex, isStarred, showWarning }) => {
          if (showWarning) {
            return (
              <div key={project.id} className="bg-orange-50 rounded-lg border border-orange-300 p-3">
                <div className="flex items-start gap-3">
                  <span className="text-orange-500 text-lg">⚠️</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-600 mb-1">
                      <button
                        onClick={() => onOpenProject && onOpenProject(project.id)}
                        className="font-semibold hover:text-orange-700"
                      >
                        {project.title || 'Untitled Project'}
                      </button>
                    </div>
                    <p className="text-sm text-orange-800 font-medium">
                      No tasks defined for this active project
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      Add a small 30-min task or mark as complete/paused
                    </p>
                  </div>
                </div>
              </div>
            );
          }
          
          return (
            <div key={project.id} className="bg-white rounded-lg border border-emerald-200 p-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => onToggleAction && onToggleAction(project.id, nextActionIndex)}
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
                  </div>
                  <div className="text-sm text-gray-900 flex items-center gap-2">
                    {isStarred && <span className="text-amber-500">⭐</span>}
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

