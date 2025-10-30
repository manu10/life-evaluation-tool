import React from 'react';
import { cn } from '../../utils/cn';

const INTENT = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  neutral: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  success: 'bg-green-600 text-white hover:bg-green-700',
  info: 'bg-amber-600 text-white hover:bg-amber-700'
};

const SIZE = {
  sm: 'px-2 py-1 text-xs rounded',
  md: 'px-3 py-2 text-sm rounded-md'
};

export default function Button({
  children,
  className,
  intent = 'neutral',
  size = 'md',
  disabled = false,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={cn(
        'transition-colors',
        SIZE[size] || SIZE.md,
        disabled ? 'opacity-50 cursor-not-allowed' : INTENT[intent] || INTENT.neutral,
        className
      )}
    >
      {children}
    </button>
  );
}


