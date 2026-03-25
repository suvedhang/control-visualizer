import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, ReferenceDot,
} from "recharts";
import type { SimulationResult } from "@/lib/controlSystems";

interface ResponseGraphProps {
  result: SimulationResult | null;
  inputType: "step" | "impulse";
}

export default function ResponseGraph({ result, inputType }: ResponseGraphProps) {
  const data = useMemo(() => {
    if (!result) return [];
    const step = Math.max(1, Math.floor(result.t.length / 500));
    const points: { t: number; y: number }[] = [];
    for (let i = 0; i < result.t.length; i += step) {
      points.push({ t: parseFloat(result.t[i].toFixed(4)), y: parseFloat(result.y[i].toFixed(6)) });
    }
    return points;
  }, [result]);

  const title = inputType === "step" ? "Step Response" : "Impulse Response";

  const settlingBand = useMemo(() => {
    if (!result || inputType !== "step" || result.metrics.steadyStateValue == null) return null;
    const ss = result.metrics.steadyStateValue;
    if (Math.abs(ss) < 1e-10) return null;
    const band = 0.02 * Math.abs(ss);
    return { upper: ss + band, lower: ss - band };
  }, [result, inputType]);

  const peakPoint = useMemo(() => {
    if (!result || result.metrics.peakValue == null || result.metrics.peakTime == null) return null;
    return { t: parseFloat(result.metrics.peakTime.toFixed(4)), y: parseFloat(result.metrics.peakValue.toFixed(6)) };
  }, [result]);

  // Generate explicit ticks - max 6
  const xTicks = useMemo(() => {
    if (!result || result.t.length === 0) return [];
    const tMax = result.t[result.t.length - 1];
    const count = 6;
    const step = tMax / (count - 1);
    const ticks: number[] = [];
    for (let i = 0; i < count; i++) {
      ticks.push(parseFloat((i * step).toFixed(2)));
    }
    return ticks;
  }, [result]);

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-sm font-medium text-muted-foreground mb-2 font-mono tracking-wider uppercase">
        {title}
      </h3>
      <div className="flex-1 min-h-0">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            <span className="font-mono opacity-50">Awaiting simulation...</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 15 }}>
              <CartesianGrid stroke="hsl(220 20% 14%)" strokeDasharray="3 3" />
              <XAxis
                dataKey="t"
                type="number"
                domain={["dataMin", "dataMax"]}
                ticks={xTicks}
                stroke="hsl(218 11% 65%)"
                fontSize={11}
                fontFamily="JetBrains Mono"
                tickFormatter={(v: number) => v.toFixed(2)}
                label={{ value: "Time (s)", position: "insideBottom", offset: -10, fill: "hsl(218 11% 65%)", fontSize: 11 }}
              />
              <YAxis
                stroke="hsl(218 11% 65%)"
                fontSize={11}
                fontFamily="JetBrains Mono"
                tickFormatter={(v: number) => v.toFixed(2)}
                width={55}
                label={{ value: "Amplitude", angle: -90, position: "insideLeft", offset: 0, fill: "hsl(218 11% 65%)", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220 40% 9%)",
                  border: "1px solid hsl(220 20% 18%)",
                  borderRadius: "6px",
                  fontFamily: "JetBrains Mono",
                  fontSize: "12px",
                  color: "hsl(216 20% 90%)",
                }}
                labelFormatter={(v) => `t = ${v}s`}
                formatter={(v: number) => [v.toFixed(4), "y(t)"]}
              />
              {/* Settling band ±2% */}
              {settlingBand && (
                <ReferenceArea
                  y1={settlingBand.lower}
                  y2={settlingBand.upper}
                  fill="hsl(142 71% 45%)"
                  fillOpacity={0.08}
                  strokeOpacity={0}
                />
              )}
              {/* Steady state reference line */}
              {inputType === "step" && result?.metrics.steadyStateValue != null && (
                <ReferenceLine
                  y={result.metrics.steadyStateValue}
                  stroke="hsl(142 71% 45%)"
                  strokeDasharray="5 5"
                  strokeOpacity={0.6}
                />
              )}
              {/* Peak marker */}
              {peakPoint && (
                <ReferenceDot
                  x={peakPoint.t}
                  y={peakPoint.y}
                  r={5}
                  fill="hsl(38 92% 50%)"
                  stroke="hsl(38 92% 50%)"
                  strokeWidth={2}
                />
              )}
              <Line
                type="monotone"
                dataKey="y"
                stroke="hsl(217 91% 60%)"
                strokeWidth={2}
                dot={false}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
