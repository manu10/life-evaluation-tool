import React from 'react';
import { cn } from '../../utils/cn';

export default function Modal({ isOpen, onClose, children, className, containerClassName }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className={cn('relative bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700', 'max-h-[85vh] overflow-y-auto', containerClassName, className)}>
        {children}
      </div>
    </div>
  );
}


