import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormatterStore } from '@/stores/useFormatterStore';

export function Toolbar() {
  const { formatJSON, minifyJSON, clearAll, indentSize, setIndentSize } = useFormatterStore();

  return (
    <div className="border-b bg-card px-6 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Button onClick={formatJSON} className="gap-2">
            <span>Format</span>
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>Enter
            </kbd>
          </Button>

          <Button onClick={minifyJSON} variant="secondary" className="gap-2">
            <span>Minify</span>
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘⇧</span>M
            </kbd>
          </Button>
        </div>

        <div className="h-5 w-px bg-border" />

        <Button onClick={clearAll} variant="ghost">
          Clear
        </Button>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <label htmlFor="indent-size" className="text-sm text-muted-foreground">
            Indent:
          </label>
          <Select
            value={indentSize.toString()}
            onValueChange={(value) => setIndentSize(parseInt(value) as 2 | 4 | 8)}
          >
            <SelectTrigger id="indent-size" className="w-[130px] bg-background border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 spaces</SelectItem>
              <SelectItem value="4">4 spaces</SelectItem>
              <SelectItem value="8">8 spaces</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
