import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function SummaryPanel({ title, exportText, onCopy, googleDocsUrl, previewLabel }) {
  return (
    <div className="mt-8 bg-blue-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex gap-2">
          <button onClick={onCopy} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            📋 Copy for Google Doc
          </button>
          <a href={googleDocsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ExternalLink className="w-4 h-4" />Open Google Docs
          </a>
        </div>
      </div>
      <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">{previewLabel}</h4>
        <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed max-h-32 overflow-y-auto">
          {exportText}
        </pre>
      </div>
    </div>
  );
} 