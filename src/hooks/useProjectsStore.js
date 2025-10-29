import { useCallback, useMemo } from 'react';
import { usePersistentState } from './usePersistentState';

const STORAGE_KEY = 'projects.v1';

function createProject() {
  const now = new Date().toISOString();
  return {
    id: `project_${Date.now()}`,
    title: 'Untitled Project',
    status: 'active',
    createdAt: now,
    updatedAt: now,
    goal: '',
    situation: '',
    ideas: [],
    actions: [],
    progress: [],
    notes: ''
  };
}

export function useProjectsStore() {
  const [projectsById, setProjectsById] = usePersistentState(STORAGE_KEY, {});

  const projects = useMemo(() => {
    const list = Object.values(projectsById || {});
    return list.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  }, [projectsById]);

  const addProject = useCallback(() => {
    const p = createProject();
    setProjectsById(prev => ({ ...(prev || {}), [p.id]: p }));
    return p.id;
  }, [setProjectsById]);

  const updateProject = useCallback((id, partial) => {
    setProjectsById(prev => {
      const curr = (prev || {})[id];
      if (!curr) return prev || {};
      const updated = { ...curr, ...partial, updatedAt: new Date().toISOString() };
      return { ...(prev || {}), [id]: updated };
    });
  }, [setProjectsById]);

  const removeProject = useCallback((id) => {
    setProjectsById(prev => {
      const copy = { ...(prev || {}) };
      delete copy[id];
      return copy;
    });
  }, [setProjectsById]);

  const addItem = (id, type) => {
    setProjectsById(prev => {
      const curr = (prev||{})[id];
      if (!curr) return prev||{};
      const list = Array.isArray(curr[type]) ? curr[type].slice() : [];
      const item = { content: '', timestamp: new Date().toISOString(), ...(type === 'actions' ? { done: false } : {}) };
      list.push(item);
      const updated = { ...curr, [type]: list, updatedAt: new Date().toISOString() };
      return { ...(prev||{}), [id]: updated };
    });
  };
  const updateItem = (id, type, index, content) => {
    setProjectsById(prev => {
      const curr = (prev||{})[id];
      if (!curr) return prev||{};
      const list = Array.isArray(curr[type]) ? curr[type].slice() : [];
      if (!list[index]) return prev||{};
      list[index] = { ...list[index], content };
      const updated = { ...curr, [type]: list, updatedAt: new Date().toISOString() };
      return { ...(prev||{}), [id]: updated };
    });
  };
  const deleteItem = (id, type, index) => {
    setProjectsById(prev => {
      const curr = (prev||{})[id];
      if (!curr) return prev||{};
      const list = Array.isArray(curr[type]) ? curr[type].slice() : [];
      list.splice(index, 1);
      const updated = { ...curr, [type]: list, updatedAt: new Date().toISOString() };
      return { ...(prev||{}), [id]: updated };
    });
  };
  const toggleAction = (id, index) => {
    setProjectsById(prev => {
      const curr = (prev||{})[id];
      if (!curr) return prev||{};
      const list = Array.isArray(curr.actions) ? curr.actions.slice() : [];
      if (!list[index]) return prev||{};
      list[index] = { ...list[index], done: !list[index].done };
      const updated = { ...curr, actions: list, updatedAt: new Date().toISOString() };
      return { ...(prev||{}), [id]: updated };
    });
  };

  return { projects, addProject, updateProject, removeProject, addItem, updateItem, deleteItem, toggleAction };
}


