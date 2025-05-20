import type { SVGProps } from 'react';

export function SolanaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="SolanaWiz Logo"
      {...props}
    >
      <defs>
        <linearGradient id="solanaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M20 80 L50 20 L80 80 Z" stroke="url(#solanaGradient)" />
      <path d="M35 70 Q50 50 65 70" stroke="currentColor" opacity="0.7" />
    </svg>
  );
}
