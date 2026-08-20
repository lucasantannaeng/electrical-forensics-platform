import React from 'react';
import { FaultDiagnosis } from '@/types/forensics';
import { ShieldAlert, ShieldCheck, AlertTriangle, FileText, CheckCircle2, Wrench } from 'lucide-react';

interface FaultDiagnosticCardProps {
  diagnosis: FaultDiagnosis;
  onOpenReport: () => void;
}

export const FaultDiagnosticCard: React.FC<FaultDiagnosticCardProps> = ({ diagnosis, onOpenReport }) => {
  const getSeverityBadge = () => {
    switch (diagnosis.severity) {
      case 'CRITICAL':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-600/60 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" /> FALHA CRÍTICA
          </span>
        );
      case 'HIGH':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-600/60">
            <AlertTriangle className="w-3.5 h-3.5" /> ALERTA SEVERO
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-yellow-950 text-yellow-300 border border-yellow-600/60">
            <AlertTriangle className="w-3.5 h-3.5" /> DISTÚRBIO MÉDIO
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/60">
            <ShieldCheck className="w-3.5 h-3.5" /> OPERAÇÃO NORMAL
          </span>
        );
    }
  };

  return (
    <div className="glass-panel-glow rounded-xl p-5 border border-cyan-500/30 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-industrial-700">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-0.5">
            Diagnóstico Pericial Automatizado
          </div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            {diagnosis.faultTypeName}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {getSeverityBadge()}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md shadow-cyan-900/30"
          >
            <FileText className="w-3.5 h-3.5" /> Gerar Laudo Pericial
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="space-y-2 p-3 rounded-lg bg-industrial-900/90 border border-industrial-700/80">
          <div className="text-slate-400 text-[11px] font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Parecer Técnico Forense
          </div>
          <p className="text-slate-300 font-sans leading-relaxed text-[13px]">
            {diagnosis.description}
          </p>
          <div className="text-[10px] text-slate-400 pt-1 flex gap-3">
            <span>Confiança: <b className="text-cyan-300">{diagnosis.confidence}%</b></span>
            {diagnosis.durationMs > 0 && <span>Duração: <b className="text-cyan-300">{diagnosis.durationMs} ms</b></span>}
          </div>
        </div>

        <div className="space-y-2 p-3 rounded-lg bg-industrial-900/90 border border-industrial-700/80">
          <div className="text-slate-400 text-[11px] font-semibold flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-amber-400" /> Recomendação de Ação Corretiva
          </div>
          <p className="text-slate-300 font-sans leading-relaxed text-[13px]">
            {diagnosis.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
};
