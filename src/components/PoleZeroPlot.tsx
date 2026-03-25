import { useMemo } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

interface PoleZeroPlotProps {
  poles: { real: number; imag: number }[];
}

export default function PoleZeroPlot({ poles }: PoleZeroPlotProps) {
  const data = useMemo(() => {
    return poles.map((p, i) => ({
      real: parseFloat(p.real.toFixed(4)),
      imag: parseFloat(p.imag.toFixed(4)),
      label: `p${i + 1}`,
    }));
  }, [poles]);

  const bounds = useMemo(() => {
    if (data.length === 0) return { minR: -2, maxR: 2, minI: -2, maxI: 2 };
    const reals = data.map(d => d.real);
    const imags = data.map(d => d.imag);
    const maxAbs = Math.max(
      Math.abs(Math.min(...reals)),
      Math.abs(Math.max(...reals)),
      Math.abs(Math.min(...imags)),
      Math.abs(Math.max(...imags)),
      0.5
    );
    const pad = maxAbs * 1.5;
    return { minR: -pad, maxR: pad, minI: -pad, maxI: pad };
  }, [data]);

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-sm font-medium text-muted-foreground mb-2 font-mono tracking-wider uppercase">
        Pole-Zero Map
      </h3>
      <div className="flex-1 min-h-0">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            <span className="font-mono opacity-50">No poles to display</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 15 }}>
              <CartesianGrid stroke="hsl(220 20% 14%)" strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="real"
                domain={[bounds.minR, bounds.maxR]}
                stroke="hsl(218 11% 65%)"
                fontSize={11}
                fontFamily="JetBrains Mono"
                tickFormatter={(v: number) => v.toFixed(1)}
                label={{ value: "Real", position: "insideBottom", offset: -10, fill: "hsl(218 11% 65%)", fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="imag"
                domain={[bounds.minI, bounds.maxI]}
                stroke="hsl(218 11% 65%)"
                fontSize={11}
                fontFamily="JetBrains Mono"
                width={50}
                tickFormatter={(v: number) => v.toFixed(1)}
                label={{ value: "Imaginary", angle: -90, position: "insideLeft", offset: 0, fill: "hsl(218 11% 65%)", fontSize: 11 }}
              />
              {/* Axis crossing lines at origin */}
              <ReferenceLine x={0} stroke="hsl(218 11% 45%)" strokeWidth={1} />
              <ReferenceLine y={0} stroke="hsl(218 11% 45%)" strokeWidth={1} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220 40% 9%)",
                  border: "1px solid hsl(220 20% 18%)",
                  borderRadius: "6px",
                  fontFamily: "JetBrains Mono",
                  fontSize: "12px",
                  color: "hsl(216 20% 90%)",
                }}
                formatter={(value: number, name: string) => [value.toFixed(4), name === "real" ? "Re" : "Im"]}
              />
              <Scatter
                data={data}
                fill="hsl(0 84% 60%)"
                shape="cross"
                legendType="none"
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
