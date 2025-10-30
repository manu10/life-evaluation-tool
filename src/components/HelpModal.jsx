import React from 'react';
import HelpContent from './HelpContent';
import Modal from './ui/Modal';

export default function HelpModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} containerClassName="w-full max-w-2xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
        <h3 className="text-lg font-semibold">Help & Guide</h3>
        <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">✕</button>
      </div>
      <div className="px-6 py-4 overflow-y-auto text-gray-900 dark:text-gray-100">
        <HelpContent />
      </div>
    </Modal>
  );
}


