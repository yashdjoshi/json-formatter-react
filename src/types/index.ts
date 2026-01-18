export interface FormatterState {
  inputValue: string;
  outputValue: string;
  indentSize: 2 | 4 | 8;
  theme: 'light' | 'dark' | 'system';
  isValid: boolean | null;
  errorLine: number | null;
  errorColumn: number | null;
  errorMessage: string | null;
  inputSize: number;
  outputSize: number;
  lineCount: number;
}

export interface FormatterActions {
  setInputValue: (value: string) => void;
  formatJSON: () => void;
  minifyJSON: () => void;
  clearAll: () => void;
  setIndentSize: (size: 2 | 4 | 8) => void;
  toggleTheme: () => void;
}

export interface FormatResult {
  success: boolean;
  value?: string;
  error?: string;
  line?: number;
  column?: number;
}

export interface ErrorLocation {
  line: number;
  column: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  line?: number;
  column?: number;
}
