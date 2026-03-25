import { Button } from "@/components/ui/button";
import { Activity, Zap, Target, TrendingUp } from "lucide-react";

const concepts = [
  { icon: Activity, label: "Transfer Function Modeling" },
  { icon: Zap, label: "Step Response Analysis" },
  { icon: Target, label: "Impulse Response Analysis" },
  { icon: TrendingUp, label: "System Stability Metrics" },
];

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(220_20%_14%/0.5)_1px,transparent_1px),linear-gradient(90deg,hsl(220_20%_14%/0.5)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(217_91%_60%/0.08)_0%,transparent_70%)]" />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-slide-up" style={{ animationDelay: "0ms" }}>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-xs font-mono text-primary tracking-wider">CONTROL SYSTEMS</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tight animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
          Response{" "}
          <span className="text-primary">Visualizer</span>
        </h1>

        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
          Analyze dynamic system behavior using Laplace-domain transfer functions
        </p>

        <Button
          onClick={onStart}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-mono tracking-wider text-base px-8 py-3 h-auto animate-slide-up"
          style={{ animationDelay: "300ms", animationFillMode: "both" }}
        >
          Start Simulation →
        </Button>
      </div>

      <div className="relative z-10 mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 px-6 max-w-4xl w-full">
        {concepts.map((c, i) => (
          <div
            key={c.label}
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 panel-border backdrop-blur-sm animate-slide-up"
            style={{ animationDelay: `${400 + i * 100}ms`, animationFillMode: "both" }}
          >
            <c.icon className="w-5 h-5 text-primary" />
            <span className="text-xs font-mono text-muted-foreground text-center">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
