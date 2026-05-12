import type { ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
  align?: 'left' | 'center';
  index?: string; // optional like "01", "02"
}

/**
 * Editorial-style label that replaces the green-pill badge.
 * Renders a thin accent line + uppercased tracked label.
 */
export function Eyebrow({ children, align = 'left', index }: EyebrowProps) {
  return (
    <div
      className={[
        'inline-flex items-center gap-3',
        align === 'center' ? 'justify-center' : '',
      ].join(' ')}
    >
      <span className="block h-px w-7 bg-[var(--color-primary-50)]/70" />
      {index && (
        <span className="text-[10.5px] font-semibold tracking-[0.18em] text-[var(--color-primary-50)]">
          {index}
        </span>
      )}
      <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-primary-50)]">
        {children}
      </span>
    </div>
  );
}
