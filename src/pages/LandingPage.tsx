import { Button } from "@/components/ui/button";
import { Activity, Zap, Target, TrendingUp } from "lucide-react";
import SoftAurora from "@/components/SoftAurora";

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
      {/* SoftAurora background effect */}
      <div className="absolute inset-0 pointer-events-none">
        <SoftAurora />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-3xl">
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

      <div className="relative z-10 mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 px-6 max-w-5xl w-full mb-8">
        {concepts.map((c, i) => (
          <div
            key={c.label}
            className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card/50 panel-border backdrop-blur-sm animate-slide-up hover:bg-card/70 transition-colors"
            style={{ animationDelay: `${400 + i * 100}ms`, animationFillMode: "both" }}
          >
            <c.icon className="w-6 h-6 text-primary" />
            <span className="text-xs font-mono text-muted-foreground text-center leading-tight">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-20 px-6 max-w-5xl w-full pb-16">
        <h2 className="text-center text-xs font-mono tracking-widest uppercase text-primary mb-16 font-semibold">Fundamental Equations</h2>
        <div className="space-y-8">
          {/* Transfer Function */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="p-8 rounded-xl bg-card/50 panel-border backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-colors">
              <p className="text-xs font-mono text-primary/70 mb-4 tracking-wider">TRANSFER FUNCTION</p>
              <div className="text-center font-mono text-foreground">
                <div className="text-2xl font-semibold">G(s) = N(s) / D(s)</div>
              </div>
            </div>
            <div className="p-8 rounded-xl bg-muted/20 border border-muted/30 hover:border-muted/50 transition-colors">
              <p className="text-xs font-mono text-muted-foreground/80 mb-4 tracking-wider">DEFINITION</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Represents the ratio of system output to input in Laplace domain. N(s) is the numerator polynomial and D(s) is the denominator polynomial.
              </p>
            </div>
          </div>

          {/* Second-Order System */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center md:flex-row-reverse">
            <div className="p-8 rounded-xl bg-card/50 panel-border backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-colors md:order-2">
              <p className="text-xs font-mono text-primary/70 mb-4 tracking-wider">SECOND-ORDER SYSTEM</p>
              <div className="text-center font-mono text-foreground">
                <div className="text-2xl font-semibold">G(s) = ωn² / (s² + 2ζωn·s + ωn²)</div>
              </div>
            </div>
            <div className="p-8 rounded-xl bg-muted/20 border border-muted/30 hover:border-muted/50 transition-colors md:order-1">
              <p className="text-xs font-mono text-muted-foreground/80 mb-4 tracking-wider">PARAMETERS</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ωn = Natural frequency (rad/s), ζ = Damping ratio. This canonical form describes most physical systems with oscillatory behavior.
              </p>
            </div>
          </div>

          {/* Step Response */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="p-8 rounded-xl bg-card/50 panel-border backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-colors">
              <p className="text-xs font-mono text-primary/70 mb-4 tracking-wider">STEP RESPONSE</p>
              <div className="text-center font-mono text-foreground">
                <div className="text-2xl font-semibold">Y(s) = G(s) / s</div>
              </div>
            </div>
            <div className="p-8 rounded-xl bg-muted/20 border border-muted/30 hover:border-muted/50 transition-colors">
              <p className="text-xs font-mono text-muted-foreground/80 mb-4 tracking-wider">DESCRIPTION</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                System output when subjected to a unit step input. Shows transient response, overshoot, settling time, and steady-state behavior.
              </p>
            </div>
          </div>

          {/* Impulse Response */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center md:flex-row-reverse">
            <div className="p-8 rounded-xl bg-card/50 panel-border backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-colors md:order-2">
              <p className="text-xs font-mono text-primary/70 mb-4 tracking-wider">IMPULSE RESPONSE</p>
              <div className="text-center font-mono text-foreground">
                <div className="text-2xl font-semibold">Y(s) = G(s)</div>
              </div>
            </div>
            <div className="p-8 rounded-xl bg-muted/20 border border-muted/30 hover:border-muted/50 transition-colors md:order-1">
              <p className="text-xs font-mono text-muted-foreground/80 mb-4 tracking-wider">DESCRIPTION</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                System output for an impulse input (Dirac delta). Directly shows the system's natural dynamics and pole locations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
