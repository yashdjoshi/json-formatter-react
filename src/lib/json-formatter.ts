import type { FormatResult, ValidationResult } from '@/types';
import { parseErrorLocation } from './error-parser';

export function formatJSON(input: string, indent: number): FormatResult {
  if (!input.trim()) {
    return {
      success: false,
      error: 'Input is empty'
    };
  }

  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, indent);

    return {
      success: true,
      value: formatted
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const location = parseErrorLocation(errorMessage, input);

    return {
      success: false,
      error: errorMessage,
      line: location?.line,
      column: location?.column
    };
  }
}

export function minifyJSON(input: string): FormatResult {
  if (!input.trim()) {
    return {
      success: false,
      error: 'Input is empty'
    };
  }

  try {
    const parsed = JSON.parse(input);
    const minified = JSON.stringify(parsed);

    return {
      success: true,
      value: minified
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const location = parseErrorLocation(errorMessage, input);

    return {
      success: false,
      error: errorMessage,
      line: location?.line,
      column: location?.column
    };
  }
}

export function validateJSON(input: string): ValidationResult {
  if (!input.trim()) {
    return { isValid: false };
  }

  try {
    JSON.parse(input);
    return { isValid: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const location = parseErrorLocation(errorMessage, input);

    return {
      isValid: false,
      error: errorMessage,
      line: location?.line,
      column: location?.column
    };
  }
}
