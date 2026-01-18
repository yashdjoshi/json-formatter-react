import { InputPanel } from './InputPanel';
import { OutputPanel } from './OutputPanel';

export function EditorPanel() {
  return (
    <main className="flex-1 p-6 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <InputPanel />
        <OutputPanel />
      </div>
    </main>
  );
}
