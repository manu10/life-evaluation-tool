import React, { useMemo, useState } from 'react';
import Modal from './ui/Modal';

function getTodayISO() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0,10);
}

export default function SurfLandDrillModal({
  isOpen,
  onClose,
  videoId = 'Hwz1saHkMl8',
  items = [], // [{ id, text }]
  doneByDate = {}, // { iso: true }
  onMarkDone,
  onHideForever,
}) {
  const todayISO = useMemo(getTodayISO, []);
  const [checked, setChecked] = useState(() => Object.fromEntries(items.map(i => [i.id, false])));

  function toggle(id) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function renderStreakMiniGrid() {
    const cells = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const iso = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0,10);
      const done = !!doneByDate?.[iso];
      cells.push(
        <div key={iso} title={`${iso}${done?' • hecho':''}`} className={`h-3 w-3 rounded-sm ${done ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
      );
    }
    return (
      <div className="flex items-center gap-1 flex-wrap" style={{ rowGap: '4px' }}>
        {cells}
      </div>
    );
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&controls=1`;
  const videoHref = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} containerClassName="w-full max-w-4xl p-5">
      <div className="text-gray-900 dark:text-gray-100">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold">🏄‍♂️ Práctica en tierra (video + checklist)</h3>
          <div className="flex items-center gap-2">
            <a href={videoHref} target="_blank" rel="noreferrer" className="px-2.5 py-1.5 text-xs rounded-md border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">Abrir en YouTube</a>
            <button onClick={onHideForever} className="px-2.5 py-1.5 text-xs rounded-md border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20">No mostrar de nuevo</button>
            <button onClick={onClose} className="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-700">Cerrar</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-black">
              <iframe
                className="w-full h-full"
                src={embedUrl}
                title="Práctica en tierra"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">Fuente del video en modo privacidad: youtube‑nocookie.com</div>
          </div>
          <div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="text-sm font-semibold mb-2">Checklist diaria</div>
              <ul className="space-y-2">
                {items.map(it => (
                  <li key={it.id} className="flex items-start gap-2">
                    <label className="inline-flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!checked[it.id]} onChange={() => toggle(it.id)} />
                      <span className="text-sm leading-5">{it.text}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => onMarkDone && onMarkDone(todayISO)} className="px-3 py-2 text-xs rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Marcar como hecho</button>
                <button onClick={onClose} className="px-3 py-2 text-xs rounded-md border border-gray-300 dark:border-gray-700">Omitir hoy</button>
              </div>
              <div className="mt-3">
                {renderStreakMiniGrid()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}


