import React, { useMemo, useState } from 'react';
import ProjectCanvas from '../ProjectCanvas';
import Modal from '../ui/Modal';

export default function ProjectDetailModal({ isOpen, onClose, project, onUpdate, onSetNextAction, onDelete }) {
  const [localTitle, setLocalTitle] = useState(project?.title || '');
  const [localStatus, setLocalStatus] = useState(project?.status || 'active');
  const [localNotes, setLocalNotes] = useState(project?.notes || '');

  React.useEffect(() => {
    setLocalTitle(project?.title || '');
    setLocalStatus(project?.status || 'active');
    setLocalNotes(project?.notes || '');
  }, [project?.id]);

  if (!isOpen || !project) return null;

  function saveField(field, value) {
    if (typeof onUpdate === 'function') onUpdate({ [field]: value });
  }

  return (
    <Modal isOpen={isOpen && !!project} onClose={onClose} containerClassName="w-full max-w-3xl p-6" aria-label="Project Detail">
      <div
        className="text-gray-900 dark:text-gray-100"
        dir="ltr"
        style={{ direction: 'ltr', textAlign: 'left' }}
      >
        <div className="flex items-center justify-between mb-4">
          <input
            className="flex-1 text-lg font-semibold text-gray-900 dark:text-gray-100 bg-transparent outline-none"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={() => saveField('title', (localTitle||'').trim() || 'Untitled Project')}
            dir="ltr"
            style={{ direction: 'ltr' }}
          />
          <div className="flex items-center gap-2 ml-3">
            <span className="text-xs text-gray-600 dark:text-gray-300">Status</span>
            <select
              value={localStatus}
              onChange={(e) => { setLocalStatus(e.target.value); saveField('status', e.target.value); }}
              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              dir="ltr"
              style={{ direction: 'ltr' }}
            >
              <option value="active">active</option>
              <option value="solved">solved</option>
            </select>
            <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100" aria-label="Close">✕</button>
          </div>
        </div>

        <div className="space-y-6">
          <ProjectCanvas project={project} onUpdate={onUpdate} onSetNextAction={onSetNextAction} />

          <div className="flex items-center justify-end gap-2">
            <button onClick={onClose} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md">Close</button>
            <button
              onClick={() => { if (typeof onDelete === 'function') onDelete(); }}
              className="px-3 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}


