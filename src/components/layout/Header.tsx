import { Moon, Sun, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormatterStore } from '@/stores/useFormatterStore';

export function Header() {
  const { theme, toggleTheme } = useFormatterStore();

  return (
    <header className="border-b bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold font-mono">{ }</span>
          <h1 className="text-xl font-semibold">JSON Formatter</h1>
          <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            Client-side
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Help"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
