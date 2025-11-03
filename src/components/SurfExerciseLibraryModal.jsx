import React from 'react';
import Modal from './ui/Modal';
import { LIBRARY } from './surfLibrary';

export default function SurfExerciseLibraryModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} containerClassName="w-full max-w-2xl p-5">
      <div className="text-gray-900 dark:text-gray-100">
        <div className="text-base font-semibold mb-3">Surf Stretch Library</div>
        <div className="space-y-3">
          {LIBRARY.map((ex) => (
            <div key={ex.key} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <img src={ex.photo} alt={ex.label} className="w-20 h-20 object-cover rounded-md border border-gray-200 dark:border-gray-700" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{ex.label}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Duration: {ex.seconds}s{ex.splitMid ? ' (split sides)' : ''}</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-700 dark:text-gray-300"><span className="font-semibold">Why:</span> {ex.why}</div>
              <div className="mt-1 text-xs text-gray-700 dark:text-gray-300"><span className="font-semibold">How:</span> {ex.how}</div>
              {ex.url && (
                <div className="mt-1 text-xs"><a href={ex.url} target="_blank" rel="noreferrer" className="underline text-blue-700 dark:text-blue-300">Learn more</a></div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-3 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-700">Close</button>
        </div>
      </div>
    </Modal>
  );
}


