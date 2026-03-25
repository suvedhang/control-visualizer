import { presetSystems, type PresetSystem } from "@/lib/controlSystems";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SystemInputProps {
  numerator: string;
  denominator: string;
  onNumeratorChange: (v: string) => void;
  onDenominatorChange: (v: string) => void;
}

export default function SystemInput({ numerator, denominator, onNumeratorChange, onDenominatorChange }: SystemInputProps) {
  const handlePreset = (name: string) => {
    const preset = presetSystems.find(p => p.name === name);
    if (preset) {
      onNumeratorChange(preset.numerator);
      onDenominatorChange(preset.denominator);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xs font-mono tracking-wider uppercase text-muted-foreground mb-3">
          Transfer Function
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground font-mono mb-1 block">
              N(s) — Numerator
            </label>
            <input
              className="w-full bg-muted border border-border rounded-md px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
              value={numerator}
              onChange={(e) => onNumeratorChange(e.target.value)}
              placeholder="e.g. 1"
            />
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full h-px bg-muted-foreground/30" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-mono mb-1 block">
              D(s) — Denominator
            </label>
            <input
              className="w-full bg-muted border border-border rounded-md px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
              value={denominator}
              onChange={(e) => onDenominatorChange(e.target.value)}
              placeholder="e.g. s^2 + 3s + 2"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground font-mono mb-2 block tracking-wider uppercase">
          Preset Systems
        </label>
        <Select onValueChange={handlePreset}>
          <SelectTrigger className="w-full bg-muted border-border font-mono text-sm">
            <SelectValue placeholder="Select a preset..." />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {presetSystems.map((p) => (
              <SelectItem key={p.name} value={p.name} className="font-mono text-sm">
                <span>{p.name}</span>
                <span className="ml-2 text-muted-foreground text-xs">{p.description}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
