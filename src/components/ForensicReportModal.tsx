import React from 'react';
import { ForensicAnalysisResult } from '@/types/forensics';
import { X, Printer, Download, FileCheck, Shield } from 'lucide-react';

interface ForensicReportModalProps {
  open: boolean;
  onClose: () => void;
  result: ForensicAnalysisResult;
}

export const ForensicReportModal: React.FC<ForensicReportModalProps> = ({ open, onClose, result }) => {
  if (!open) return null;

  const { metadata, diagnosis, rms, thd, symmetrical_components } = result;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laudo_Pericial_${metadata.station_name.replace(/\s+/g, '_')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-industrial-900 border border-cyan-500/40 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 bg-industrial-950 border-b border-industrial-700">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100 font-mono tracking-wide uppercase">
              Laudo Pericial de Engenharia Elétrica Forense
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-industrial-800 hover:bg-industrial-700 text-slate-300 transition-all text-xs flex items-center gap-1 font-mono"
              title="Imprimir / Salvar PDF"
            >
              <Printer className="w-4 h-4 text-cyan-400" /> Imprimir / PDF
            </button>
            <button
              onClick={handleDownloadJson}
              className="p-1.5 rounded-lg bg-industrial-800 hover:bg-industrial-700 text-slate-300 transition-all text-xs flex items-center gap-1 font-mono"
              title="Exportar JSON"
            >
              <Download className="w-4 h-4 text-cyan-400" /> JSON
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-industrial-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Report Document */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 font-sans text-xs">
          {/* Header Metadata */}
          <div className="p-4 rounded-xl bg-industrial-950/80 border border-industrial-700/80 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div>
              <span className="text-[10px] text-slate-400">Instalação / Estação</span>
              <div className="text-slate-200 font-bold">{metadata.station_name}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Gravador / IED</span>
              <div className="text-slate-200 font-bold">{metadata.recorder_id}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Norma COMTRADE</span>
              <div className="text-slate-200 font-bold">IEEE C37.111-{metadata.year}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Frequência Nominal</span>
              <div className="text-slate-200 font-bold">{metadata.frequency} Hz</div>
            </div>
          </div>

          {/* Forensic Conclusion Card */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" /> CONCLUSÃO PERICIAL DO EVENTO
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-200 border border-cyan-600/40">
                Grau de Certeza: {diagnosis.confidence}%
              </span>
            </div>
            <div className="text-sm font-bold text-slate-100">{diagnosis.faultTypeName}</div>
            <p className="text-slate-300 leading-relaxed text-xs">{diagnosis.description}</p>
          </div>

          {/* Electrical Metrics Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wide">
              1. Parâmetros Elétricos Calculados
            </h4>
            <div className="border border-industrial-700 rounded-lg overflow-hidden font-mono">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-industrial-950 text-slate-400 border-b border-industrial-700">
                  <tr>
                    <th className="p-2">Grandeza</th>
                    <th className="p-2">Fase A</th>
                    <th className="p-2">Fase B</th>
                    <th className="p-2">Fase C</th>
                    <th className="p-2">Critério / Limite</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-industrial-800 bg-industrial-900/50">
                  <tr>
                    <td className="p-2 text-slate-400">Tensão RMS</td>
                    <td className="p-2 text-sky-400 font-bold">{rms.phase_a} V</td>
                    <td className="p-2 text-amber-400 font-bold">{rms.phase_b} V</td>
                    <td className="p-2 text-rose-400 font-bold">{rms.phase_c} V</td>
                    <td className="p-2 text-slate-400">±5% da Tensão Nominal</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-400">THD Harmônico</td>
                    <td className="p-2 text-sky-400">{thd.phase_a}%</td>
                    <td className="p-2 text-amber-400">{thd.phase_b}%</td>
                    <td className="p-2 text-rose-400">{thd.phase_c}%</td>
                    <td className="p-2 text-slate-400">≤ 5.0% (IEEE 519)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Symmetrical Components Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wide">
              2. Decomposição de Fortescue & Desbalanço
            </h4>
            <div className="border border-industrial-700 rounded-lg overflow-hidden font-mono">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-industrial-950 text-slate-400 border-b border-industrial-700">
                  <tr>
                    <th className="p-2">Componente de Sequência</th>
                    <th className="p-2">Magnitude Média</th>
                    <th className="p-2">Interpretação Física</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-industrial-800 bg-industrial-900/50">
                  <tr>
                    <td className="p-2 text-slate-400">Sequência Positiva (V₁)</td>
                    <td className="p-2 text-cyan-400 font-bold">{symmetrical_components.posMagAvg.toFixed(1)} V</td>
                    <td className="p-2 text-slate-300">Regime trifásico equilibrado</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-400">Sequência Negativa (V₂)</td>
                    <td className="p-2 text-amber-400 font-bold">{symmetrical_components.negMagAvg.toFixed(1)} V</td>
                    <td className="p-2 text-slate-300">Desbalanço de carga / Falta entre fases</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-400">Sequência Zero (V₀)</td>
                    <td className="p-2 text-rose-400 font-bold">{symmetrical_components.zeroMagAvg.toFixed(1)} V</td>
                    <td className="p-2 text-slate-300">Corrente de retorno pelo terra / Faltas à terra</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-400">Taxa de Desbalanço (VUF)</td>
                    <td className="p-2 text-cyan-300 font-bold">{symmetrical_components.voltageUnbalanceRate}%</td>
                    <td className="p-2 text-slate-300">Norma IEC 61000-4-30 (&lt; 2.0% ideal)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="p-4 rounded-xl bg-industrial-950/80 border border-industrial-700/80 space-y-1.5">
            <h4 className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wide">
              3. Plano de Ação Recomendado
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs">
              {diagnosis.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
