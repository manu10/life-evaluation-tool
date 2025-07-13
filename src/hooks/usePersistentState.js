import { useState, useEffect } from 'react';

/**
 * usePersistentState - React state hook with localStorage persistence
 * @param {string} key - localStorage key
 * @param {any} initialValue - fallback value if nothing in storage
 */
export function usePersistentState(key, initialValue) {
  const getInitial = () => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [value, setValue] = useState(getInitial);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
} 