import { useRef } from 'react';
import { Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormatterStore } from '@/stores/useFormatterStore';
import { useScrollSync } from '@/hooks/useScrollSync';
import { LineNumbers } from './LineNumbers';
import { SyntaxHighlighter } from './SyntaxHighlighter';
import { ScrollToTop } from '../layout/ScrollToTop';
import { toast } from 'sonner';

export function OutputPanel() {
  const preRef = useRef<HTMLPreElement>(null);
  const { outputValue } = useFormatterStore();
  const { scrollOffset, handleScroll } = useScrollSync();

  const outputLineCount = outputValue ? outputValue.split('\n').length : 0;

  const handleCopy = async () => {
    if (!outputValue) return;

    try {
      // Try modern clipboard API first
      await navigator.clipboard.writeText(outputValue);
      toast.success('Copied to clipboard');
    } catch (error) {
      // Fallback to older method for HTTP contexts
      try {
        const textArea = document.createElement('textarea');
        textArea.value = outputValue;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          toast.success('Copied to clipboard');
        } else {
          toast.error('Failed to copy to clipboard');
        }
      } catch (fallbackError) {
        toast.error('Failed to copy to clipboard');
      }
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card relative">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/50">
        <span className="text-sm font-medium">Output</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopy}
            aria-label="Copy output"
            disabled={!outputValue}
          >
            <Clipboard className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Output Area */}
      <div className="flex-1 grid grid-cols-[auto_1fr] overflow-hidden relative">
        {/* Line Numbers */}
        <div className="overflow-hidden bg-muted/30 border-r">
          <LineNumbers lineCount={outputLineCount} scrollOffset={scrollOffset} errorLine={null} />
        </div>

        {/* Output Display */}
        <div className="overflow-hidden relative">
          <ScrollToTop targetRef={preRef} />
          <pre
            ref={preRef}
            className="w-full h-full p-4 bg-transparent overflow-auto whitespace-pre"
            onScroll={(e) => handleScroll(e.currentTarget.scrollTop)}
          >
            {outputValue ? (
              <SyntaxHighlighter code={outputValue} />
            ) : (
              <span className="text-muted-foreground text-sm">
                Formatted JSON will appear here...
              </span>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
