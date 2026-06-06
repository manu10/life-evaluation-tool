import React from 'react';
import { toSafeHttpUrl } from '../utils/safeUrl';

export default function SafeExternalLink({ href, children, className, fallbackText }) {
  const safe = toSafeHttpUrl(href);
  if (!safe) {
    if (fallbackText) return <span className={className}>{fallbackText}</span>;
    return null;
  }
  return (
    <a href={safe} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
