import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

export default function OnePercentNoteModal({ initialValue = '', onSave, onClose }) {
  const [val, setVal] = useState(initialValue || '');
  const min = 15;
  const remaining = Math.max(0, min - (val || '').trim().length);
  useEffect(() => { setVal(initialValue || ''); }, [initialValue]);
  return (
    <Modal isOpen={true} onClose={onClose} containerClassName="w-full max-w-md p-5">
      <div className="text-gray-900 dark:text-gray-100">
        <h3 className="text-base font-semibold mb-2">Añade una nota (1% Better)</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Mínimo {min} caracteres. Esta nota aparecerá en el resumen de mañana.</p>
        <textarea
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="¿Qué hiciste o aprendiste hoy para ser 1% mejor?"
          className="w-full h-28 p-3 border border-emerald-300 dark:border-emerald-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm"
        />
        <div className="mt-2 text-xs flex items-center justify-between">
          <span className={remaining > 0 ? 'text-red-700 dark:text-red-300' : 'text-gray-600 dark:text-gray-400'}>
            {remaining > 0 ? `Faltan ${remaining} caracteres` : 'Listo'}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-2 text-xs rounded-md border border-gray-300 dark:border-gray-700">Cancelar</button>
            <button
              onClick={() => onSave && onSave(val)}
              disabled={val.trim().length < min}
              className={`px-3 py-2 text-xs rounded-md ${val.trim().length < min ? 'bg-emerald-600/60 text-white cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
            >
              Guardar nota
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}


