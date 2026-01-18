import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FormatterState, FormatterActions } from '@/types';
import { formatJSON as formatJSONUtil, minifyJSON as minifyJSONUtil } from '@/lib/json-formatter';

interface FormatterStore extends FormatterState, FormatterActions {}

export const useFormatterStore = create<FormatterStore>()(
  persist(
    (set, get) => ({
      // Initial State
      inputValue: '',
      outputValue: '',
      indentSize: 2,
      theme: 'system',
      isValid: null,
      errorLine: null,
      errorColumn: null,
      errorMessage: null,
      inputSize: 0,
      outputSize: 0,
      lineCount: 0,

      // Actions
      setInputValue: (value: string) => {
        set({
          inputValue: value,
          inputSize: new Blob([value]).size,
          lineCount: value.split('\n').length
        });
      },

      formatJSON: () => {
        const { inputValue, indentSize } = get();

        if (!inputValue.trim()) {
          set({
            isValid: false,
            errorMessage: 'Input is empty',
            errorLine: null,
            errorColumn: null,
            outputValue: '',
            outputSize: 0
          });
          return;
        }

        const result = formatJSONUtil(inputValue, indentSize);

        if (result.success && result.value) {
          set({
            outputValue: result.value,
            outputSize: new Blob([result.value]).size,
            isValid: true,
            errorLine: null,
            errorColumn: null,
            errorMessage: null
          });
        } else {
          set({
            isValid: false,
            errorMessage: result.error || 'Unknown error',
            errorLine: result.line || null,
            errorColumn: result.column || null,
            outputValue: '',
            outputSize: 0
          });
        }
      },

      minifyJSON: () => {
        const { inputValue } = get();

        if (!inputValue.trim()) {
          set({
            isValid: false,
            errorMessage: 'Input is empty',
            errorLine: null,
            errorColumn: null,
            outputValue: '',
            outputSize: 0
          });
          return;
        }

        const result = minifyJSONUtil(inputValue);

        if (result.success && result.value) {
          set({
            outputValue: result.value,
            outputSize: new Blob([result.value]).size,
            isValid: true,
            errorLine: null,
            errorColumn: null,
            errorMessage: null
          });
        } else {
          set({
            isValid: false,
            errorMessage: result.error || 'Unknown error',
            errorLine: result.line || null,
            errorColumn: result.column || null,
            outputValue: '',
            outputSize: 0
          });
        }
      },

      clearAll: () => {
        set({
          inputValue: '',
          outputValue: '',
          isValid: null,
          errorLine: null,
          errorColumn: null,
          errorMessage: null,
          inputSize: 0,
          outputSize: 0,
          lineCount: 0
        });
      },

      setIndentSize: (size: 2 | 4 | 8) => {
        set({ indentSize: size });
      },

      toggleTheme: () => {
        set((state) => {
          const themeOrder: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
          const currentIndex = themeOrder.indexOf(state.theme);
          const nextIndex = (currentIndex + 1) % themeOrder.length;
          return { theme: themeOrder[nextIndex] };
        });
      }
    }),
    {
      name: 'json-formatter-storage',
      partialize: (state) => ({
        indentSize: state.indentSize,
        theme: state.theme
      })
    }
  )
);
