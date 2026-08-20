import React from 'react';
import { SymmetricalComponents } from '@/types/forensics';
import { Compass, Zap } from 'lucide-react';

interface PhasorDiagramProps {
  symmetricalComponents: SymmetricalComponents;
  rms: { phase_a: number; phase_b: number; phase_c: number };
}

export const PhasorDiagram: React.FC<PhasorDiagramProps> = ({ symmetricalComponents, rms }) => {
  const { zeroMagAvg, posMagAvg, negMagAvg, voltageUnbalanceRate } = symmetricalComponents;

  // Polar coordinates for Phase A (0°), Phase B (-120°), Phase C (+120°)
  const cx = 100;
  const cy = 100;
  const maxR = 75;

  const maxVal = Math.max(rms.phase_a, rms.phase_b, rms.phase_c, 1);
  const rA = (rms.phase_a / maxVal) * maxR;
  const rB = (rms.phase_b / maxVal) * maxR;
  const rC = (rms.phase_c / maxVal) * maxR;

  // Angles in radians (A: 0°, B: -120°, C: 120°)
  const angleA = 0;
  const angleB = (240 * Math.PI) / 180;
  const angleC = (120 * Math.PI) / 180;

  const ax = cx + rA * Math.cos(angleA);
  const ay = cy - rA * Math.sin(angleA);

  const bx = cx + rB * Math.cos(angleB);
  const by = cy - rB * Math.sin(angleB);

  const cx_pt = cx + rC * Math.cos(angleC);
  const cy_pt = cy - rC * Math.sin(angleC);

  return (
    <div className="glass-panel rounded-xl p-4 border border-industrial-700/80 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-industrial-700/60">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase font-mono">
            Diagrama Fasorial & Fortescue
          </h3>
        </div>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
            voltageUnbalanceRate > 3
              ? 'bg-rose-950/80 text-rose-300 border-rose-700/40'
              : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/40'
          }`}
        >
          VUF: {voltageUnbalanceRate}%
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* SVG Polar Viewport */}
        <div className="flex justify-center">
          <svg viewBox="0 0 200 200" className="w-44 h-44 bg-industrial-950/90 rounded-full border border-industrial-700 p-1">
            {/* Concentric rings */}
            <circle cx={cx} cy={cy} r={maxR} fill="none" stroke="rgba(30, 44, 69, 0.6)" strokeWidth="1" />
            <circle cx={cx} cy={cy} r={maxR * 0.66} fill="none" stroke="rgba(30, 44, 69, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={cx} cy={cy} r={maxR * 0.33} fill="none" stroke="rgba(30, 44, 69, 0.4)" strokeWidth="1" strokeDasharray="3 3" />

            {/* Axes */}
            <line x1={cx - maxR - 5} y1={cy} x2={cx + maxR + 5} y2={cy} stroke="rgba(71, 85, 105, 0.4)" strokeWidth="1" />
            <line x1={cx} y1={cy - maxR - 5} x2={cx} y2={cy + maxR + 5} stroke="rgba(71, 85, 105, 0.4)" strokeWidth="1" />

            {/* Vector A */}
            <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={ax} cy={ay} r="3" fill="#38bdf8" />
            <text x={ax + 6} y={ay + 4} fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono">Va</text>

            {/* Vector B */}
            <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={bx} cy={by} r="3" fill="#fbbf24" />
            <text x={bx - 12} y={by + 10} fill="#fbbf24" fontSize="10" fontFamily="JetBrains Mono">Vb</text>

            {/* Vector C */}
            <line x1={cx} y1={cy} x2={cx_pt} y2={cy_pt} stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={cx_pt} cy={cy_pt} r="3" fill="#f43f5e" />
            <text x={cx_pt - 14} y={cy_pt - 6} fill="#f43f5e" fontSize="10" fontFamily="JetBrains Mono">Vc</text>
          </svg>
        </div>

        {/* Component Values Card */}
        <div className="space-y-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-industrial-900 border border-industrial-700/80">
            <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
              <span>Sequência Positiva (V₁)</span>
              <span className="text-cyan-400 font-bold">{posMagAvg.toFixed(1)} V</span>
            </div>
            <div className="w-full bg-industrial-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${Math.min((posMagAvg / maxVal) * 100, 100)}%` }} />
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-industrial-900 border border-industrial-700/80">
            <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
              <span>Sequência Negativa (V₂)</span>
              <span className="text-amber-400 font-bold">{negMagAvg.toFixed(1)} V</span>
            </div>
            <div className="w-full bg-industrial-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${Math.min((negMagAvg / maxVal) * 100, 100)}%` }} />
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-industrial-900 border border-industrial-700/80">
            <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
              <span>Sequência Zero (V₀)</span>
              <span className="text-rose-400 font-bold">{zeroMagAvg.toFixed(1)} V</span>
            </div>
            <div className="w-full bg-industrial-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-400 h-full rounded-full" style={{ width: `${Math.min((zeroMagAvg / maxVal) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
