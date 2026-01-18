import { useFormatterStore } from '@/stores/useFormatterStore';
import { formatBytes } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function StatusBar() {
  const { inputSize, outputSize, lineCount, isValid } = useFormatterStore();

  const percentageChange =
    inputSize > 0 ? ((outputSize - inputSize) / inputSize) * 100 : 0;

  const getValidityStatus = () => {
    if (isValid === null) return { text: 'Ready', color: 'bg-muted-foreground' };
    if (isValid) return { text: 'Valid', color: 'bg-emerald-500' };
    return { text: 'Invalid', color: 'bg-destructive' };
  };

  const validity = getValidityStatus();

  return (
    <footer className="border-t bg-card px-6 py-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Input:</span>
            <span className="font-mono">{formatBytes(inputSize)}</span>
          </div>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Output:</span>
            <span className="font-mono">{formatBytes(outputSize)}</span>
          </div>

          <div className="h-4 w-px bg-border" />

          <div
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              percentageChange > 0 && 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
              percentageChange < 0 && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
              percentageChange === 0 && 'bg-muted text-muted-foreground'
            )}
          >
            {percentageChange > 0 && '+'}
            {percentageChange.toFixed(1)}%
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-mono text-muted-foreground">
            {lineCount} {lineCount === 1 ? 'line' : 'lines'}
          </div>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-2">
            <div className={cn('h-2 w-2 rounded-full', validity.color)} />
            <span className="text-muted-foreground">{validity.text}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
