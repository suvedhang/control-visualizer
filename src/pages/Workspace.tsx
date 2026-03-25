import { useState, useCallback } from "react";
import SystemInput from "@/components/SystemInput";
import ControlPanel from "@/components/ControlPanel";
import ResponseGraph from "@/components/ResponseGraph";
import MetricsPanel from "@/components/MetricsPanel";
import { simulateSystem, type SimulationResult } from "@/lib/controlSystems";
import { ArrowLeft } from "lucide-react";

interface WorkspaceProps {
  onBack: () => void;
}

export default function Workspace({ onBack }: WorkspaceProps) {
  const [numerator, setNumerator] = useState("4");
  const [denominator, setDenominator] = useState("s^2 + 1.2s + 4");
  const [inputType, setInputType] = useState<"step" | "impulse">("step");
  const [timeRange, setTimeRange] = useState(10);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = useCallback(() => {
    try {
      const res = simulateSystem(numerator, denominator, inputType, timeRange);
      setResult(res);
    } catch (e) {
      console.error("Simulation error:", e);
    }
  }, [numerator, denominator, inputType, timeRange]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-12 flex items-center px-4 border-b border-border bg-card/50 backdrop-blur-sm shrink-0">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-mono">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex-1 text-center">
          <span className="text-sm font-mono text-muted-foreground tracking-wider">
            G(s) = <span className="text-foreground">{numerator}</span> / <span className="text-foreground">{denominator}</span>
          </span>
        </div>
        <div className="w-16" />
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left Panel */}
        <aside className="w-full lg:w-72 shrink-0 p-4 border-b lg:border-b-0 lg:border-r border-border overflow-y-auto bg-card/30">
          <h2 className="text-xs font-mono tracking-wider uppercase text-primary mb-4">System Definition</h2>
          <SystemInput
            numerator={numerator}
            denominator={denominator}
            onNumeratorChange={setNumerator}
            onDenominatorChange={setDenominator}
          />
        </aside>

        {/* Center Panel */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 p-4 min-h-[300px]">
            <ResponseGraph result={result} inputType={inputType} />
          </div>
          {/* Bottom Panel */}
          <div className="p-4 border-t border-border bg-card/30">
            <h2 className="text-xs font-mono tracking-wider uppercase text-primary mb-3">Performance Metrics</h2>
            <MetricsPanel metrics={result?.metrics ?? null} inputType={inputType} />
          </div>
        </main>

        {/* Right Panel */}
        <aside className="w-full lg:w-60 shrink-0 p-4 border-t lg:border-t-0 lg:border-l border-border overflow-y-auto bg-card/30">
          <h2 className="text-xs font-mono tracking-wider uppercase text-primary mb-4">Controls</h2>
          <ControlPanel
            inputType={inputType}
            onInputTypeChange={setInputType}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            onSimulate={handleSimulate}
          />
        </aside>
      </div>
    </div>
  );
}
