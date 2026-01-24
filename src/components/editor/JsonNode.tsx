import { useState, useCallback, useMemo } from 'react';
import { ChevronRight, ChevronDown, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface JsonNodeProps {
  data: unknown;
  depth?: number;
  isLast?: boolean;
  keyName?: string;
  indentSize: number;
}

// Helper to get bracket color class based on depth
function getBracketClass(depth: number): string {
  const level = (depth % 4) + 1;
  return `json-bracket-${level}`;
}

// Copy text to clipboard with fallback
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch {
      return false;
    }
  }
}

// Render a primitive value (string, number, boolean, null)
function PrimitiveValue({ value }: { value: unknown }) {
  if (value === null) {
    return <span className="json-null">null</span>;
  }
  if (typeof value === 'boolean') {
    return <span className="json-boolean">{value.toString()}</span>;
  }
  if (typeof value === 'number') {
    return <span className="json-number">{value}</span>;
  }
  if (typeof value === 'string') {
    return <span className="json-string">"{value}"</span>;
  }
  return <span>{String(value)}</span>;
}

// Main recursive component
export function JsonNode({
  data,
  depth = 0,
  isLast = true,
  keyName,
  indentSize
}: JsonNodeProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const indent = ' '.repeat(depth * indentSize);
  const childIndent = ' '.repeat((depth + 1) * indentSize);
  const bracketClass = getBracketClass(depth);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    const jsonString = JSON.stringify(data, null, indentSize);
    const success = await copyToClipboard(jsonString);
    if (success) {
      toast.success('Copied to clipboard');
    } else {
      toast.error('Failed to copy');
    }
  }, [data, indentSize]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  // Handle primitive values
  if (data === null || typeof data !== 'object') {
    return (
      <span>
        {keyName !== undefined && (
          <>
            <span className="json-key">"{keyName}"</span>
            <span className="json-colon">: </span>
          </>
        )}
        <PrimitiveValue value={data} />
        {!isLast && <span className="json-comma">,</span>}
        {'\n'}
      </span>
    );
  }

  const isArray = Array.isArray(data);
  const entries = isArray
    ? data.map((v, i) => [i, v] as const)
    : Object.entries(data);
  const isEmpty = entries.length === 0;
  const openBracket = isArray ? '[' : '{';
  const closeBracket = isArray ? ']' : '}';
  const itemCount = entries.length;
  const itemLabel = itemCount === 1 ? 'item' : 'items';

  // Empty object/array
  if (isEmpty) {
    return (
      <span>
        {keyName !== undefined && (
          <>
            <span className="json-key">"{keyName}"</span>
            <span className="json-colon">: </span>
          </>
        )}
        <span className={bracketClass}>{openBracket}{closeBracket}</span>
        {!isLast && <span className="json-comma">,</span>}
        {'\n'}
      </span>
    );
  }

  return (
    <span
      className="json-collapsible-node"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Key name (if this is a property) */}
      {keyName !== undefined && (
        <>
          <span className="json-key">"{keyName}"</span>
          <span className="json-colon">: </span>
        </>
      )}

      {/* Collapse toggle and open bracket */}
      <span
        className="json-collapse-toggle"
        onClick={toggleCollapse}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && toggleCollapse()}
        aria-label={isCollapsed ? 'Expand' : 'Collapse'}
        aria-expanded={!isCollapsed}
      >
        {isCollapsed ? (
          <ChevronRight className="json-chevron" />
        ) : (
          <ChevronDown className="json-chevron" />
        )}
        <span className={bracketClass}>{openBracket}</span>
      </span>

      {/* Copy button (shown on hover) */}
      {isHovered && (
        <button
          className="json-copy-button"
          onClick={handleCopy}
          aria-label="Copy this section"
          title="Copy this section"
        >
          <Copy className="h-3 w-3" />
        </button>
      )}

      {isCollapsed ? (
        // Collapsed view
        <>
          <span className="json-collapsed-preview">
            {' '}{itemCount} {itemLabel}{' '}
          </span>
          <span className={bracketClass}>{closeBracket}</span>
          {!isLast && <span className="json-comma">,</span>}
          {'\n'}
        </>
      ) : (
        // Expanded view
        <>
          {'\n'}
          {entries.map(([key, value], index) => (
            <span key={isArray ? index : key}>
              {childIndent}
              <JsonNode
                data={value}
                depth={depth + 1}
                isLast={index === entries.length - 1}
                keyName={isArray ? undefined : String(key)}
                indentSize={indentSize}
              />
            </span>
          ))}
          {indent}
          <span className={bracketClass}>{closeBracket}</span>
          {!isLast && <span className="json-comma">,</span>}
          {'\n'}
        </>
      )}
    </span>
  );
}

interface JsonTreeProps {
  jsonString: string;
  indentSize: number;
}

type ParseResult = {
  success: true;
  data: unknown;
} | {
  success: false;
  error: string;
};

function parseJson(jsonString: string): ParseResult {
  try {
    return { success: true, data: JSON.parse(jsonString) };
  } catch {
    return { success: false, error: 'Invalid JSON' };
  }
}

export function JsonTree({ jsonString, indentSize }: JsonTreeProps) {
  const parseResult = useMemo(() => parseJson(jsonString), [jsonString]);

  if (!parseResult.success) {
    return (
      <pre className="font-mono text-sm leading-6 whitespace-pre text-destructive">
        {parseResult.error}
      </pre>
    );
  }

  return (
    <pre className="json-tree font-mono text-sm leading-6 whitespace-pre">
      <JsonNode data={parseResult.data} indentSize={indentSize} />
    </pre>
  );
}
