import { useMemo } from 'react';
import { highlightJSON } from '@/lib/json-highlighter';

interface SyntaxHighlighterProps {
  code: string;
}

export function SyntaxHighlighter({ code }: SyntaxHighlighterProps) {
  const highlightedCode = useMemo(() => highlightJSON(code), [code]);

  return (
    <pre
      className="font-mono text-sm leading-6 whitespace-pre"
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
}
