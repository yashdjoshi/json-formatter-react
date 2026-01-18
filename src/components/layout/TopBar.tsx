import { Moon, Sun, Monitor, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormatterStore } from '@/stores/useFormatterStore';

export function TopBar() {
  const { formatJSON, minifyJSON, clearAll, indentSize, setIndentSize, theme, toggleTheme } = useFormatterStore();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
    }
  };

  return (
    <header className="border-b bg-card">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        {/* Left: Branding */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-2xl font-semibold font-mono">{ }</span>
          <h1 className="text-xl font-semibold hidden sm:block">JSON Formatter</h1>
          <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground hidden md:block">
            Client-side
          </span>
        </div>

        {/* Center: Main Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button onClick={formatJSON} size="sm" className="gap-2">
            <span>Format</span>
            <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>↵
            </kbd>
          </Button>

          <Button onClick={minifyJSON} variant="secondary" size="sm" className="gap-2">
            <span>Minify</span>
            <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘⇧</span>M
            </kbd>
          </Button>

          <Button onClick={clearAll} variant="ghost" size="sm">
            Clear
          </Button>
        </div>

        {/* Right: Settings */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <label htmlFor="indent-size" className="text-sm text-muted-foreground hidden md:block">
              Indent:
            </label>
            <Select
              value={indentSize.toString()}
              onValueChange={(value) => setIndentSize(parseInt(value) as 2 | 4 | 8)}
            >
              <SelectTrigger id="indent-size" className="w-[110px] h-8 bg-background border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spaces</SelectItem>
                <SelectItem value="4">4 spaces</SelectItem>
                <SelectItem value="8">8 spaces</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-5 w-px bg-border hidden sm:block" />

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleTheme}
            aria-label={`Theme: ${getThemeLabel()}`}
            title={`Theme: ${getThemeLabel()} (click to cycle)`}
          >
            {getThemeIcon()}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hidden sm:flex"
            aria-label="Help"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
