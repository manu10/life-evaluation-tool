import React, { useState } from 'react';
import EveningGoalsInput from './EveningGoalsInput';

/**
 * EveningGoalsWithProjects wraps EveningGoalsInput and adds a collapsible
 * suggestion panel that pulls next actions from active projects, allowing
 * users to quickly add project tasks to tomorrow's goals or todos.
 * 
 * Tasks are added with format: [Project Name] Task description
 */
export default function EveningGoalsWithProjects({
  eveningResponses,
  onGoalChange,
  onFirstHourChange,
  onOnePercentPlanChange,
  onOnePercentLinkChange,
  editable,
  projects = [],
  onAddTodo
}) {
  const [expanded, setExpanded] = useState(false);

  /**
   * Extracts next actions from active projects (max 3).
   * Prefers starred actions, falls back to first active action.
   */
  const getNextActions = () => {
    const activeProjects = projects.filter(p => p.status === 'active');
    const nextActions = [];

    for (const project of activeProjects) {
      const actions = Array.isArray(project.actions) ? project.actions : [];
      const activeActions = actions.filter(a => !a.done);
      
      let nextAction = null;
      
      // Check if user has starred an action
      if (typeof project.nextActionIndex === 'number' && project.nextActionIndex >= 0) {
        const starredAction = actions[project.nextActionIndex];
        if (starredAction && !starredAction.done) {
          nextAction = starredAction;
        }
      }
      
      // If no starred action, use first active action
      if (!nextAction && activeActions.length > 0) {
        nextAction = activeActions[0];
      }
      
      if (nextAction) {
        nextActions.push({
          projectTitle: project.title || 'Untitled Project',
          content: nextAction.content,
          projectId: project.id
        });
      }
    }

    return nextActions.slice(0, 3);
  };

  const nextActions = getNextActions();

  const handleAddToGoal = (projectTitle, content, goalNum) => {
    onGoalChange(goalNum, `[${projectTitle}] ${content}`);
  };

  const handleAddToTodo = (projectTitle, content) => {
    if (onAddTodo) {
      onAddTodo(`[${projectTitle}] ${content}`);
    }
  };

  const renderSuggestions = () => {
    if (nextActions.length === 0) return null;

    return (
      <div className="mb-4 bg-blue-50 border-2 border-blue-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-100 transition-colors"
        >
          <span className="text-sm font-semibold text-blue-800">
            📋 {nextActions.length} suggested task{nextActions.length !== 1 ? 's' : ''} from projects
          </span>
          <span className="text-blue-600">{expanded ? '↑' : '↓'}</span>
        </button>
        
        {expanded && (
          <div className="px-4 pb-4 space-y-2">
            {nextActions.map((action, idx) => (
              <div key={idx} className="bg-white rounded p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {action.projectTitle}
                  </span>
                </div>
                <div className="text-sm text-gray-900 mb-2">{action.content}</div>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3].map(num => (
                    <button
                      key={num}
                      onClick={() => handleAddToGoal(action.projectTitle, action.content, num)}
                      disabled={!editable}
                      className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      → Goal {num}
                    </button>
                  ))}
                  <button
                    onClick={() => handleAddToTodo(action.projectTitle, action.content)}
                    disabled={!editable}
                    className="text-xs px-2 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    → Todo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {renderSuggestions()}
      <EveningGoalsInput
        eveningResponses={eveningResponses}
        onGoalChange={onGoalChange}
        onFirstHourChange={onFirstHourChange}
        onOnePercentPlanChange={onOnePercentPlanChange}
        onOnePercentLinkChange={onOnePercentLinkChange}
        editable={editable}
      />
    </div>
  );
}
