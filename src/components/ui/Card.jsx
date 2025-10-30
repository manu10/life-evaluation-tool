import React from 'react';
import { cn } from '../../utils/cn';

export default function Card({ className, children, padding = 'p-4', ...props }) {
  return (
    <div
      {...props}
      className={cn('bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg', padding, className)}
    >
      {children}
    </div>
  );
}


