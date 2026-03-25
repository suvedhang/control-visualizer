import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface ControlPanelProps {
  inputType: "step" | "impulse";
  onInputTypeChange: (v: "step" | "impulse") => void;
  timeRange: number;
  onTimeRangeChange: (v: number) => void;
  onSimulate: () => void;
}

export default function ControlPanel({
  inputType, onInputTypeChange, timeRange, onTimeRangeChange, onSimulate,
}: ControlPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-mono tracking-wider uppercase text-muted-foreground mb-3 block">
          Input Signal
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(["step", "impulse"] as const).map((type) => (
            <button
              key={type}
              onClick={() => onInputTypeChange(type)}
              className={`px-3 py-2 rounded-md font-mono text-sm capitalize transition-all ${
                inputType === type
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-mono tracking-wider uppercase text-muted-foreground mb-3 block">
          Time Range: <span className="text-foreground">{timeRange}s</span>
        </label>
        <Slider
          value={[timeRange]}
          onValueChange={([v]) => onTimeRangeChange(v)}
          min={1}
          max={20}
          step={0.5}
          className="py-2"
        />
      </div>

      <div className="text-xs font-mono text-muted-foreground/60 mt-4">
        Manual simulation
      </div>

      <Button 
        onClick={onSimulate}
        className="w-full mt-4 font-mono text-sm"
      >
        Simulate
      </Button>
    </div>
  );
}
