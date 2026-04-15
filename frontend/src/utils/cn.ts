import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-display-1',
        'text-display-2',
        'text-display-3',
        'text-title-1',
        'text-title-2',
        'text-title-3',
        'text-heading-1',
        'text-heading-2',
        'text-headline-1',
        'text-headline-2',
        'text-body-1',
        'text-body-1-reading',
        'text-body-2',
        'text-body-2-reading',
        'text-label-1',
        'text-label-1-reading',
        'text-label-2',
        'text-caption-1',
        'text-caption-2',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
