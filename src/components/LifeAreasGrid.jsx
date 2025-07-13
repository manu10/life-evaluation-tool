import React from 'react';

export default function LifeAreasGrid({ lifeAreas, morningResponses, setMorningResponses, feelingOptions, editable = true }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {lifeAreas.map((area) => (
        <div key={area} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{area}</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">How do you feel about this area?</label>
            <div className="flex flex-wrap gap-2">
              {feelingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => editable && setMorningResponses(prev => ({
                    ...prev, [area]: { ...prev[area], feeling: option.value }
                  }))}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    morningResponses[area].feeling === option.value
                      ? `${option.color} text-white shadow-md`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled={!editable}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick thoughts (optional)</label>
            <textarea
              value={morningResponses[area].notes}
              onChange={e => editable && setMorningResponses(prev => ({
                ...prev, [area]: { ...prev[area], notes: e.target.value }
              }))}
              placeholder="What's on your mind about this area?"
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!editable}
            />
          </div>
        </div>
      ))}
    </div>
  );
} 