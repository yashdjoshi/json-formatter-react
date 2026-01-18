import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlOrCmd?: boolean;
  shift?: boolean;
  callback: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const isCtrlOrCmd = navigator.platform.toLowerCase().includes('mac')
          ? event.metaKey
          : event.ctrlKey;

        const matchesCtrlOrCmd = shortcut.ctrlOrCmd ? isCtrlOrCmd : !isCtrlOrCmd;
        const matchesShift = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (matchesKey && matchesCtrlOrCmd && matchesShift) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
