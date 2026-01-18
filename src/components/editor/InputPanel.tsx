import { useRef } from 'react';
import { Clipboard, ClipboardPaste, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormatterStore } from '@/stores/useFormatterStore';
import { useScrollSync } from '@/hooks/useScrollSync';
import { LineNumbers } from './LineNumbers';
import { ScrollToTop } from '../layout/ScrollToTop';
import { toast } from 'sonner';

export function InputPanel() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { inputValue, setInputValue, lineCount, errorLine, errorColumn, errorMessage, clearAll } = useFormatterStore();
  const { scrollOffset, handleScroll } = useScrollSync();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputValue(text);
      toast.success('Pasted from clipboard');
    } catch (error) {
      toast.error('Failed to paste from clipboard. Try Ctrl+V or Cmd+V instead.');
    }
  };

  const handleCopy = async () => {
    if (!inputValue) return;

    try {
      // Try modern clipboard API first
      await navigator.clipboard.writeText(inputValue);
      toast.success('Copied to clipboard');
    } catch (error) {
      // Fallback to older method for HTTP contexts
      try {
        const textArea = document.createElement('textarea');
        textArea.value = inputValue;
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

  const handleClear = () => {
    clearAll();
    toast.success('Input cleared');
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card relative">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/50">
        <span className="text-sm font-medium">Input</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handlePaste}
            aria-label="Paste from clipboard"
          >
            <ClipboardPaste className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopy}
            aria-label="Copy input"
          >
            <Clipboard className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleClear}
            aria-label="Clear input"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 grid grid-cols-[auto_1fr] overflow-hidden relative">
        {/* Line Numbers */}
        <div className="overflow-hidden bg-muted/30 border-r">
          <LineNumbers lineCount={lineCount} scrollOffset={scrollOffset} errorLine={errorLine} />
        </div>

        {/* Textarea */}
        <div className="overflow-hidden relative">
          <ScrollToTop targetRef={textareaRef} />
          <textarea
            ref={textareaRef}
            className="w-full h-full p-4 bg-transparent resize-none font-mono text-sm leading-6 outline-none overflow-auto whitespace-nowrap"
            placeholder="Paste your JSON here..."
            spellCheck={false}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onScroll={(e) => handleScroll(e.currentTarget.scrollTop)}
            wrap="off"
          />

          {/* Error Message Overlay */}
          {errorLine && errorMessage && (
            <div
              className="absolute left-4 right-4 bg-destructive/95 text-destructive-foreground px-4 py-3 rounded-lg text-xs font-mono shadow-xl border-2 border-destructive z-20 pointer-events-none backdrop-blur-sm"
              style={{
                top: `${(errorLine - 1) * 24 + 16 - scrollOffset}px`, // 24px = line-height (leading-6), 16px = padding-top
              }}
            >
              <div className="font-bold mb-1 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>
                  Syntax Error at line {errorLine}
                  {errorColumn && `, column ${errorColumn}`}:
                </span>
              </div>
              <div className="pl-6 leading-relaxed">{errorMessage}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
