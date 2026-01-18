import { Toaster } from '@/components/ui/sonner';
import { TopBar } from '@/components/layout/TopBar';
import { StatusBar } from '@/components/layout/StatusBar';
import { EditorPanel } from '@/components/editor/EditorPanel';
import { useTheme } from '@/hooks/useTheme';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useFormatterStore } from '@/stores/useFormatterStore';

function App() {
  useTheme();

  const { formatJSON, minifyJSON, clearAll } = useFormatterStore();

  useKeyboardShortcuts([
    {
      key: 'Enter',
      ctrlOrCmd: true,
      callback: formatJSON
    },
    {
      key: 'm',
      ctrlOrCmd: true,
      shift: true,
      callback: minifyJSON
    },
    {
      key: 'k',
      ctrlOrCmd: true,
      callback: clearAll
    }
  ]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar />
      <EditorPanel />
      <StatusBar />
      <Toaster />
    </div>
  );
}

export default App;
