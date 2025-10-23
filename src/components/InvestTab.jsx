import React from 'react';

export default function InvestTab() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Invest (Preview)</h2>
      <p className="text-gray-600 mb-4">Structured flow to progress an opportunity, avoid tab‑hopping, and decide.</p>
      <div className="p-4 border border-gray-200 rounded-lg bg-white">
        <ul className="list-disc ml-5 text-sm text-gray-800 space-y-2">
          <li>Define the opportunity and decision deadline</li>
          <li>Checklist of questions to answer before deciding</li>
          <li>Timeboxed sessions with outcome notes</li>
          <li>Decision log with reasons and next review date</li>
        </ul>
      </div>
      <div className="mt-4 text-xs text-gray-500">Coming soon — we’ll refine this workflow together.</div>
    </div>
  );
}


