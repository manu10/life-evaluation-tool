import React from 'react';
import { cn } from '../../utils/cn';

export function Input({ className, ...props }) {
  return (
    <input
      {...props}
      className={cn('p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400', className)}
    />
  );
}

export function Textarea({ className, rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      {...props}
      className={cn('p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400', className)}
    />
  );
}

export function Select({ className, ...props }) {
  return (
    <select
      {...props}
      className={cn('p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100', className)}
    />
  );
}


