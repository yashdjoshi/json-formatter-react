import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface LineNumbersProps {
  lineCount: number;
  scrollOffset: number;
  errorLine: number | null;
}

export function LineNumbers({ lineCount, scrollOffset, errorLine }: LineNumbersProps) {
  // Generate line numbers more efficiently
  const lineNumbersHtml = useMemo(() => {
    const lines: string[] = [];
    for (let i = 1; i <= lineCount; i++) {
      const isError = errorLine === i;
      const className = cn(
        'line-num block px-2 py-0 leading-6 text-right',
        isError && 'bg-destructive/20 text-destructive font-bold border-l-2 border-destructive'
      );
      lines.push(`<span class="${className}">${i}</span>`);
    }
    return lines.join('');
  }, [lineCount, errorLine]);

  return (
    <div
      className="select-none font-mono text-xs text-muted-foreground transition-transform will-change-transform"
      style={{ transform: `translateY(-${scrollOffset}px)` }}
      dangerouslySetInnerHTML={{ __html: lineNumbersHtml }}
    />
  );
}
