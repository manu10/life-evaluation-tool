import React from 'react';
import HelpContent from './HelpContent';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg p-0 border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[85vh] flex flex-col text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Help & Guide</h3>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">✕</button>
        </div>
        <div className="px-6 py-4 overflow-y-auto">
          <HelpContent />
        </div>
      </div>
    </div>
  );
}


