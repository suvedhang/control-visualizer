import type { ResponseMetrics } from "@/lib/controlSystems";
import { formatPole } from "@/lib/controlSystems";

interface MetricsPanelProps {
  metrics: ResponseMetrics | null;
  inputType: "step" | "impulse";
}

function MetricCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="bg-muted rounded-lg p-3 panel-border">
      <div className="text-xs font-mono text-muted-foreground tracking-wider uppercase mb-1">
        {label}
      </div>
      <div className="text-lg font-mono font-semibold text-foreground">
        {value}
        {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
      </div>
    </div>
  );
}

export default function MetricsPanel({ metrics, inputType }: MetricsPanelProps) {
  if (!metrics) {
    return (
      <div className="text-center text-muted-foreground text-sm font-mono py-4 opacity-50">
        Run a simulation to see metrics
      </div>
    );
  }

  const fmt = (v: number | null, decimals = 4) =>
    v != null ? v.toFixed(decimals) : "—";

  const stabilityColor =
    metrics.stability === "Stable"
      ? "text-secondary"
      : metrics.stability === "Unstable"
        ? "text-destructive"
        : "text-accent";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {inputType === "step" && (
          <>
            <MetricCard label="Rise Time" value={fmt(metrics.riseTime)} unit="s" />
            <MetricCard label="Settling Time" value={fmt(metrics.settlingTime)} unit="s" />
            <MetricCard label="Overshoot" value={fmt(metrics.overshoot, 2)} unit="%" />
            <MetricCard label="Steady State" value={fmt(metrics.steadyStateValue)} />
          </>
        )}
        <MetricCard label="Peak Value" value={fmt(metrics.peakValue)} />
        <MetricCard label="Peak Time" value={fmt(metrics.peakTime)} unit="s" />
        <div className="bg-muted rounded-lg p-3 panel-border">
          <div className="text-xs font-mono text-muted-foreground tracking-wider uppercase mb-1">
            Stability
          </div>
          <div className={`text-lg font-mono font-semibold ${stabilityColor}`}>
            {metrics.stability}
          </div>
        </div>
      </div>

      {/* System classification row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {metrics.systemType && (
          <MetricCard label="System Type" value={metrics.systemType} />
        )}
        {metrics.dampingRatio != null && (
          <MetricCard label="Damping Ratio (ζ)" value={fmt(metrics.dampingRatio, 4)} />
        )}
        {metrics.naturalFrequency != null && (
          <MetricCard label="Natural Freq (ωn)" value={fmt(metrics.naturalFrequency, 4)} unit="rad/s" />
        )}
        {metrics.poles.length > 0 && (
          <div className="bg-muted rounded-lg p-3 panel-border">
            <div className="text-xs font-mono text-muted-foreground tracking-wider uppercase mb-1">
              Poles
            </div>
            <div className="text-sm font-mono font-semibold text-foreground space-y-0.5">
              {metrics.poles.map((p, i) => (
                <div key={i}>{formatPole(p)}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
