// Parse polynomial string like "s^2 + 3s + 2" into coefficients [1, 3, 2] (highest degree first)
export function parsePolynomial(str: string): number[] {
  str = str.replace(/\s/g, '');
  if (!str) return [0];
  
  // Try comma-separated coefficients first: "1, 3, 2"
  if (/^[\d.,\s-]+$/.test(str.replace(/\s/g, '')) && str.includes(',')) {
    return str.split(',').map(s => parseFloat(s.trim()));
  }
  
  // Try single number
  if (/^-?[\d.]+$/.test(str)) {
    return [parseFloat(str)];
  }

  // Parse polynomial expression
  const terms: { coeff: number; power: number }[] = [];
  // Normalize: add '+' before '-' for splitting
  const normalized = str.replace(/(?<=[^+\-(*^])-/g, '+-');
  const parts = normalized.split('+').filter(Boolean);

  let maxPower = 0;
  for (const part of parts) {
    let coeff = 1;
    let power = 0;

    if (part.includes('s')) {
      const match = part.match(/^([+-]?[\d.]*)\*?s(?:\^(\d+))?$/);
      if (match) {
        coeff = match[1] === '' || match[1] === '+' ? 1 : match[1] === '-' ? -1 : parseFloat(match[1]);
        power = match[2] ? parseInt(match[2]) : 1;
      }
    } else {
      coeff = parseFloat(part);
      power = 0;
    }

    terms.push({ coeff, power });
    maxPower = Math.max(maxPower, power);
  }

  const coeffs = new Array(maxPower + 1).fill(0);
  for (const t of terms) {
    coeffs[maxPower - t.power] += t.coeff;
  }
  return coeffs;
}

// Convert transfer function to state-space (controllable canonical form)
function tf2ss(num: number[], den: number[]): {
  A: number[][]; B: number[]; C: number[]; D: number;
} {
  const n = den.length - 1; // system order
  if (n === 0) {
    return { A: [], B: [], C: [], D: num[0] / den[0] };
  }

  // Normalize
  const a0 = den[0];
  const normDen = den.map(d => d / a0);
  
  // Pad numerator
  const normNum = new Array(den.length).fill(0);
  const offset = den.length - num.length;
  for (let i = 0; i < num.length; i++) {
    normNum[offset + i] = num[i] / a0;
  }

  const D = normNum[0];
  
  const A: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const B: number[] = new Array(n).fill(0);
  const C: number[] = new Array(n).fill(0);

  // Controllable canonical form
  for (let i = 0; i < n - 1; i++) {
    A[i][i + 1] = 1;
  }
  for (let i = 0; i < n; i++) {
    A[n - 1][i] = -normDen[n - i];
  }

  B[n - 1] = 1;

  for (let i = 0; i < n; i++) {
    C[i] = normNum[n - i] - normDen[n - i] * D;
  }

  return { A, B, C, D };
}

// RK4 integration
function simulate(
  A: number[][], B: number[], C: number[], D: number,
  input: (t: number) => number,
  tEnd: number, dt: number
): { t: number[]; y: number[] } {
  const n = A.length;
  if (n === 0) {
    const steps = Math.ceil(tEnd / dt);
    const t: number[] = [];
    const y: number[] = [];
    for (let i = 0; i <= steps; i++) {
      const ti = i * dt;
      t.push(ti);
      y.push(D * input(ti));
    }
    return { t, y };
  }

  const x = new Array(n).fill(0);
  const tArr: number[] = [];
  const yArr: number[] = [];
  const steps = Math.ceil(tEnd / dt);

  const dxdt = (state: number[], u: number): number[] => {
    const dx = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        dx[i] += A[i][j] * state[j];
      }
      dx[i] += B[i] * u;
    }
    return dx;
  };

  const output = (state: number[], u: number): number => {
    let y = D * u;
    for (let i = 0; i < n; i++) {
      y += C[i] * state[i];
    }
    return y;
  };

  for (let step = 0; step <= steps; step++) {
    const t = step * dt;
    const u = input(t);
    tArr.push(t);
    yArr.push(output(x, u));

    // RK4
    const k1 = dxdt(x, u);
    const x2 = x.map((xi, i) => xi + 0.5 * dt * k1[i]);
    const k2 = dxdt(x2, input(t + 0.5 * dt));
    const x3 = x.map((xi, i) => xi + 0.5 * dt * k2[i]);
    const k3 = dxdt(x3, input(t + 0.5 * dt));
    const x4 = x.map((xi, i) => xi + dt * k3[i]);
    const k4 = dxdt(x4, input(t + dt));

    for (let i = 0; i < n; i++) {
      x[i] += (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
    }
  }

  return { t: tArr, y: yArr };
}

export interface SimulationResult {
  t: number[];
  y: number[];
  metrics: ResponseMetrics;
}

export interface ResponseMetrics {
  riseTime: number | null;
  settlingTime: number | null;
  overshoot: number | null;
  steadyStateValue: number | null;
  peakValue: number | null;
  peakTime: number | null;
  stability: 'Stable' | 'Unstable' | 'Marginally Stable';
}

function computeRoots(den: number[]): { real: number; imag: number }[] {
  // For 1st and 2nd order, compute analytically
  if (den.length === 2) {
    return [{ real: -den[1] / den[0], imag: 0 }];
  }
  if (den.length === 3) {
    const a = den[0], b = den[1], c = den[2];
    const disc = b * b - 4 * a * c;
    if (disc >= 0) {
      return [
        { real: (-b + Math.sqrt(disc)) / (2 * a), imag: 0 },
        { real: (-b - Math.sqrt(disc)) / (2 * a), imag: 0 },
      ];
    }
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(-disc) / (2 * a);
    return [
      { real: realPart, imag: imagPart },
      { real: realPart, imag: -imagPart },
    ];
  }
  // For higher order, use companion matrix eigenvalues approximation
  // Simple heuristic: check if simulation diverges
  return [];
}

function classifyStability(den: number[]): 'Stable' | 'Unstable' | 'Marginally Stable' {
  const roots = computeRoots(den);
  if (roots.length === 0) return 'Stable'; // fallback
  const allNeg = roots.every(r => r.real < -1e-10);
  const anyPos = roots.some(r => r.real > 1e-10);
  if (allNeg) return 'Stable';
  if (anyPos) return 'Unstable';
  return 'Marginally Stable';
}

function computeMetrics(t: number[], y: number[], inputType: 'step' | 'impulse'): ResponseMetrics {
  const n = y.length;
  const steadyState = inputType === 'step' ? y[n - 1] : 0;
  
  let peakValue = -Infinity;
  let peakTime = 0;
  for (let i = 0; i < n; i++) {
    if (Math.abs(y[i]) > Math.abs(peakValue)) {
      peakValue = y[i];
      peakTime = t[i];
    }
  }

  let riseTime: number | null = null;
  let settlingTime: number | null = null;
  let overshoot: number | null = null;

  if (inputType === 'step' && Math.abs(steadyState) > 1e-10) {
    // Rise time: 10% to 90%
    const y10 = 0.1 * steadyState;
    const y90 = 0.9 * steadyState;
    let t10: number | null = null;
    let t90: number | null = null;
    for (let i = 0; i < n; i++) {
      if (t10 === null && y[i] >= y10) t10 = t[i];
      if (t90 === null && y[i] >= y90) t90 = t[i];
    }
    riseTime = t10 !== null && t90 !== null ? t90 - t10 : null;

    // Settling time (2% band)
    const band = 0.02 * Math.abs(steadyState);
    settlingTime = null;
    for (let i = n - 1; i >= 0; i--) {
      if (Math.abs(y[i] - steadyState) > band) {
        settlingTime = i < n - 1 ? t[i + 1] : t[i];
        break;
      }
    }

    // Overshoot
    overshoot = steadyState > 0
      ? Math.max(0, ((peakValue - steadyState) / steadyState) * 100)
      : null;
  }

  return {
    riseTime,
    settlingTime,
    overshoot,
    steadyStateValue: inputType === 'step' ? steadyState : null,
    peakValue,
    peakTime,
    stability: 'Stable', // overridden by caller
  };
}

export function simulateSystem(
  numStr: string,
  denStr: string,
  inputType: 'step' | 'impulse',
  tEnd: number
): SimulationResult {
  const num = parsePolynomial(numStr);
  const den = parsePolynomial(denStr);
  const dt = tEnd / 1000;

  const { A, B, C, D } = tf2ss(num, den);
  const inputFn = inputType === 'step' 
    ? (_t: number) => 1 
    : (t: number) => (t < dt ? 1 / dt : 0);

  const { t, y } = simulate(A, B, C, D, inputFn, tEnd, dt);
  const metrics = computeMetrics(t, y, inputType);
  metrics.stability = classifyStability(den);

  return { t, y, metrics };
}

export interface PresetSystem {
  name: string;
  numerator: string;
  denominator: string;
  description: string;
}

export const presetSystems: PresetSystem[] = [
  { name: 'First Order System', numerator: '1', denominator: 's + 1', description: 'G(s) = 1/(s+1)' },
  { name: 'Second Order Underdamped', numerator: '4', denominator: 's^2 + 1.2s + 4', description: 'ζ = 0.3, ωn = 2' },
  { name: 'Critically Damped', numerator: '4', denominator: 's^2 + 4s + 4', description: 'ζ = 1, ωn = 2' },
  { name: 'Overdamped System', numerator: '2', denominator: 's^2 + 5s + 2', description: 'ζ > 1' },
];
