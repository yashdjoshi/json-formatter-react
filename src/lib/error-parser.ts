import type { ErrorLocation } from '@/types';

export function parseErrorLocation(errorMessage: string, input: string): ErrorLocation | null {
  // Try to match "at line X column Y" format
  const lineColMatch = errorMessage.match(/line (\d+) column (\d+)/i);

  if (lineColMatch) {
    return {
      line: parseInt(lineColMatch[1]),
      column: parseInt(lineColMatch[2])
    };
  }

  // Try to match "at position X" format
  const positionMatch = errorMessage.match(/position (\d+)/i);

  if (positionMatch) {
    const position = parseInt(positionMatch[1]);
    const lines = input.substring(0, position).split('\n');
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    };
  }

  return null;
}
