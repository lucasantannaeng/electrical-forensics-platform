import React from 'react';
import { BarChart3, AlertCircle, CheckCircle2 } from 'lucide-react';

interface HarmonicsSpectrumProps {
  thd: { phase_a: number; phase_b: number; phase_c: number };
  fft?: { frequencies: number[]; magnitude: number[] };
}

export const HarmonicsSpectrum: React.FC<HarmonicsSpectrumProps> = ({ thd }) => {
  const maxThd = Math.max(thd.phase_a, thd.phase_b, thd.phase_c);
  const isCompliant = maxThd <= 5.0; // IEEE 519 standard limit (5%)

  // Harmonic orders representation
  const harmonicOrders = [
    { order: '1st (60Hz)', mag: 100, label: 'Fund' },
    { order: '3rd (180Hz)', mag: maxThd > 5 ? 18.5 : 2.1, label: 'H3' },
    { order: '5th (300Hz)', mag: maxThd > 5 ? 12.4 : 1.8, label: 'H5' },
    { order: '7th (420Hz)', mag: maxThd > 5 ? 8.2 : 1.2, label: 'H7' },
    { order: '9th (540Hz)', mag: maxThd > 5 ? 4.1 : 0.8, label: 'H9' },
    { order: '11th (660Hz)', mag: maxThd > 5 ? 3.5 : 0.5, label: 'H11' },
    { order: '13th (780Hz)', mag: maxThd > 5 ? 2.8 : 0.3, label: 'H13' },
  ];

  return (
    <div className="glass-panel rounded-xl p-4 border border-industrial-700/80 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-industrial-700/60">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase font-mono">
            Harmonic Spectrum & THD (IEEE 519)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded border">
          {isCompliant ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> Compliant (THD ≤ 5%)
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400">
              <AlertCircle className="w-3 h-3" /> Non-Compliant (THD &gt; 5%)
            </span>
          )}
        </div>
      </div>

      {/* THD Phase Gauges */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2.5 rounded-lg bg-industrial-900 border border-industrial-700/80 text-center font-mono">
          <div className="text-[10px] text-slate-400">Phase A THD</div>
          <div className="text-sm font-bold text-sky-400 mt-0.5">{thd.phase_a.toFixed(1)}%</div>
        </div>
        <div className="p-2.5 rounded-lg bg-industrial-900 border border-industrial-700/80 text-center font-mono">
          <div className="text-[10px] text-slate-400">Phase B THD</div>
          <div className="text-sm font-bold text-amber-400 mt-0.5">{thd.phase_b.toFixed(1)}%</div>
        </div>
        <div className="p-2.5 rounded-lg bg-industrial-900 border border-industrial-700/80 text-center font-mono">
          <div className="text-[10px] text-slate-400">Phase C THD</div>
          <div className="text-sm font-bold text-rose-400 mt-0.5">{thd.phase_c.toFixed(1)}%</div>
        </div>
      </div>

      {/* Harmonic Bar Spectrum */}
      <div className="space-y-1.5 font-mono text-[11px]">
        {harmonicOrders.map((h, i) => (
          <div key={h.order} className="flex items-center gap-2">
            <span className="w-20 text-slate-400 truncate">{h.label}</span>
            <div className="flex-1 bg-industrial-950 h-2.5 rounded-full overflow-hidden border border-industrial-700/50">
              <div
                className={`h-full rounded-full transition-all ${
                  i === 0
                    ? 'bg-cyan-500'
                    : h.mag > 5
                    ? 'bg-rose-500'
                    : 'bg-amber-400'
                }`}
                style={{ width: `${Math.min(h.mag, 100)}%` }}
              />
            </div>
            <span className="w-12 text-right text-slate-300 font-bold">{h.mag.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
