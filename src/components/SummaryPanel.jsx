import React from 'react';
import { ExternalLink } from 'lucide-react';
import Card from './ui/Card';

export default function SummaryPanel({ title, exportText, onCopy, googleDocsUrl, previewLabel }) {
  return (
    <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => { if (onCopy) onCopy(); if (googleDocsUrl) { try { window.open(googleDocsUrl, '_blank', 'noopener,noreferrer'); } catch {} } }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Copy and open Google Docs"
          >
            <ExternalLink className="w-4 h-4" /> Copy & Open Google Doc
          </button>
        </div>
      </div>
      <Card className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{previewLabel}</h4>
        <pre className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed max-h-32 overflow-y-auto">
          {exportText}
        </pre>
      </Card>
    </div>
  );
} 