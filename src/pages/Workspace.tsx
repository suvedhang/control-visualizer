import { useState, useCallback, useEffect } from "react";
import SystemInput from "@/components/SystemInput";
import ControlPanel from "@/components/ControlPanel";
import ResponseGraph from "@/components/ResponseGraph";
import MetricsPanel from "@/components/MetricsPanel";
import PoleZeroPlot from "@/components/PoleZeroPlot";
import { simulateSystem, buildSecondOrderTF, type SimulationResult } from "@/lib/controlSystems";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorkspaceProps {
  onBack: () => void;
}

export default function Workspace({ onBack }: WorkspaceProps) {
  const [numerator, setNumerator] = useState("4");
  const [denominator, setDenominator] = useState("s^2 + 1.2s + 4");
  const [inputType, setInputType] = useState<"step" | "impulse">("step");
  const [timeRange, setTimeRange] = useState(10);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [paramMode, setParamMode] = useState(false);
  const [zeta, setZeta] = useState(0.3);
  const [wn, setWn] = useState(2);

  const runSimulation = useCallback((num: string, den: string, iType: "step" | "impulse", tEnd: number) => {
    try {
      const res = simulateSystem(num, den, iType, tEnd);
      setResult(res);
    } catch (e) {
      console.error("Simulation error:", e);
    }
  }, []);

  // Parameter mode: update TF from sliders
  useEffect(() => {
    if (!paramMode) return;
    const tf = buildSecondOrderTF(zeta, wn);
    setNumerator(tf.numerator);
    setDenominator(tf.denominator);
  }, [zeta, wn, paramMode]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 flex items-center px-4 border-b border-border bg-card/50 backdrop-blur-sm shrink-0">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-mono">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex-1 text-center">
          <span className="text-sm font-mono text-muted-foreground tracking-wider">
            G(s) ={" "}
            <span className="text-foreground">{numerator}</span>
            {" "}/{" "}
            <span className="text-foreground">({denominator})</span>
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
            defaultPreset="Second Order Underdamped"
          />

          {/* Parameter Mode Toggle */}
          <div className="mt-6 space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={paramMode}
                onChange={(e) => setParamMode(e.target.checked)}
                className="rounded border-border bg-muted accent-primary"
              />
              <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
                2nd-Order Parameter Mode
              </span>
            </label>

            {paramMode && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground font-mono mb-1 block">
                    ζ (Damping Ratio): <span className="text-foreground">{zeta.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={2}
                    step={0.01}
                    value={zeta}
                    onChange={(e) => setZeta(parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-mono mb-1 block">
                    ωn (Natural Freq): <span className="text-foreground">{wn.toFixed(1)} rad/s</span>
                  </label>
                  <input
                    type="range"
                    min={0.5}
                    max={10}
                    step={0.1}
                    value={wn}
                    onChange={(e) => setWn(parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Center Panel */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 p-4 min-h-[300px]">
            <Tabs defaultValue="response" className="h-full flex flex-col">
              <TabsList className="bg-muted self-start mb-2">
                <TabsTrigger value="response" className="font-mono text-xs">Response</TabsTrigger>
                <TabsTrigger value="poles" className="font-mono text-xs">Pole-Zero Map</TabsTrigger>
              </TabsList>
              <TabsContent value="response" className="flex-1 min-h-0 mt-0">
                <ResponseGraph result={result} inputType={inputType} />
              </TabsContent>
              <TabsContent value="poles" className="flex-1 min-h-0 mt-0">
                <PoleZeroPlot poles={result?.metrics.poles ?? []} />
              </TabsContent>
            </Tabs>
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
            onSimulate={() => runSimulation(numerator, denominator, inputType, timeRange)}
          />
        </aside>
      </div>
    </div>
  );
}
