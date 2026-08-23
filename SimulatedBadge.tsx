import React from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  className?: string;
  size?: 'sm' | 'md';
  variant?: 'subtle' | 'pill' | 'banner';
  text?: string;
}

export const SimulatedBadge: React.FC<Props> = ({
  className = '',
  size = 'sm',
  variant = 'pill',
  text = 'SIMULATED DATA — DEMO ONLY',
}) => {
  if (variant === 'banner') {
    return (
      <div className={`flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-medium tracking-wide ${className}`}>
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
        <span>{text}</span>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold tracking-wider rounded-full border border-amber-500/25 bg-amber-500/10 text-amber-300 font-mono ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      } ${className}`}
    >
      <Sparkles className="w-3 h-3 text-amber-400" />
      {text}
    </span>
  );
};

