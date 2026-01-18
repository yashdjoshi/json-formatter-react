import { escapeHtml } from './utils';

export function highlightJSON(json: string): string {
  let result = '';
  let i = 0;
  let bracketDepth = 0;
  const bracketColors = ['json-bracket-1', 'json-bracket-2', 'json-bracket-3', 'json-bracket-4'];

  while (i < json.length) {
    const char = json[i];

    // String
    if (char === '"') {
      const stringStart = i;
      i++; // Skip opening quote

      // Find end of string
      while (i < json.length && (json[i] !== '"' || json[i - 1] === '\\')) {
        i++;
      }
      i++; // Skip closing quote

      const stringValue = json.substring(stringStart, i);

      // Check if it's a key or value
      let afterString = i;
      while (afterString < json.length && /\s/.test(json[afterString])) {
        afterString++;
      }
      const isKey = json[afterString] === ':';

      const className = isKey ? 'json-key' : 'json-string';
      result += `<span class="${className}">${escapeHtml(stringValue)}</span>`;
      continue;
    }

    // Number
    if (/[\d\-]/.test(char)) {
      const numStart = i;
      if (char === '-') i++;
      while (i < json.length && /[\d.eE+\-]/.test(json[i])) {
        i++;
      }
      const numValue = json.substring(numStart, i);
      result += `<span class="json-number">${numValue}</span>`;
      continue;
    }

    // Boolean: true
    if (json.substring(i, i + 4) === 'true') {
      result += `<span class="json-boolean">true</span>`;
      i += 4;
      continue;
    }

    // Boolean: false
    if (json.substring(i, i + 5) === 'false') {
      result += `<span class="json-boolean">false</span>`;
      i += 5;
      continue;
    }

    // Null
    if (json.substring(i, i + 4) === 'null') {
      result += `<span class="json-null">null</span>`;
      i += 4;
      continue;
    }

    // Opening brackets
    if (char === '{' || char === '[') {
      const bracketClass = bracketColors[bracketDepth % bracketColors.length];
      result += `<span class="${bracketClass}">${char}</span>`;
      bracketDepth++;
      i++;
      continue;
    }

    // Closing brackets
    if (char === '}' || char === ']') {
      bracketDepth--;
      const bracketClass = bracketColors[bracketDepth % bracketColors.length];
      result += `<span class="${bracketClass}">${char}</span>`;
      i++;
      continue;
    }

    // Colon
    if (char === ':') {
      result += `<span class="json-colon">:</span>`;
      i++;
      continue;
    }

    // Comma
    if (char === ',') {
      result += `<span class="json-comma">,</span>`;
      i++;
      continue;
    }

    // Everything else (whitespace, etc.)
    result += escapeHtml(char);
    i++;
  }

  return result;
}
