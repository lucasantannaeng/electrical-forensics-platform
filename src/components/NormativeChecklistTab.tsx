import React, { useState } from 'react';
import {
  NormativeAuditState,
  NormativeStandard,
  ComplianceStatus,
  NormativeChecklistItem,
} from '@/types/forensics';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MinusCircle,
  ShieldAlert,
  HelpCircle,
  Filter,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';

interface NormativeChecklistTabProps {
  auditState: NormativeAuditState;
  onUpdateItemStatus: (sectionId: string, itemId: string, status: ComplianceStatus) => void;
  onUpdateItemNotes: (sectionId: string, itemId: string, notes: string) => void;
  onResetToDefaults: () => void;
}

export const NormativeChecklistTab: React.FC<NormativeChecklistTabProps> = ({
  auditState,
  onUpdateItemStatus,
  onUpdateItemNotes,
  onResetToDefaults,
}) => {
  const [selectedStandard, setSelectedStandard] = useState<string>('ALL');
  const [activeNotesItem, setActiveNotesItem] = useState<string | null>(null);

  const getStatusBadge = (status: ComplianceStatus) => {
    switch (status) {
      case 'CONFORMING':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-950 text-emerald-300 border border-emerald-600/50">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Em Conformidade
          </span>
        );
      case 'NON_CONFORMING':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-rose-950 text-rose-300 border border-rose-600/50 animate-pulse">
            <XCircle className="w-3.5 h-3.5 text-rose-400" /> Não Conforme
          </span>
        );
      case 'NOT_APPLICABLE':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-900 text-slate-400 border border-slate-700">
            <MinusCircle className="w-3.5 h-3.5 text-slate-500" /> Não Aplicável
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-950 text-amber-300 border border-amber-700/50">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Não Inspecionado
          </span>
        );
    }
  };

  const filteredSections = auditState.sections.filter(sec => {
    if (selectedStandard === 'ALL') return true;
    return sec.standard === selectedStandard;
  });

  return (
    <div className="space-y-6">
      {/* Top Audit KPI Banner */}
      <div className="glass-panel-glow rounded-xl p-5 border border-cyan-500/40 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-industrial-700/80">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4" /> Auditoria Técnica & Normativa ABNT / CBMERJ
            </div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Radar de Conformidade Pericial
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Verificação obrigatória de SPDA (NBR 5419-1..4 e IT-13 CBMERJ), Instalações de Baixa Tensão (NBR 5410)
              e Sistemas Fotovoltaicos (NBR 16690: Quatro Situações Gerais).
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onResetToDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-industrial-900 hover:bg-industrial-800 text-slate-300 border border-industrial-700 text-xs font-mono transition-all"
              title="Restaurar padrão"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Reset Padrão
            </button>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 font-mono">
          <div className="p-3 rounded-lg bg-industrial-950/80 border border-industrial-700/70">
            <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Índice Geral de Conformidade</span>
            <div className="text-2xl font-bold text-cyan-300 mt-1">
              {auditState.complianceScore}%
            </div>
            <div className="w-full bg-industrial-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  auditState.complianceScore >= 85
                    ? 'bg-emerald-400'
                    : auditState.complianceScore >= 60
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${auditState.complianceScore}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-industrial-950/80 border border-industrial-700/70">
            <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Conformes / Avaliados</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {auditState.conformingCount} <span className="text-xs text-slate-500 font-normal">/ {auditState.totalItems}</span>
            </div>
            <span className="text-[10px] text-emerald-500/90 mt-1 block">Requisitos Atendidos</span>
          </div>

          <div className="p-3 rounded-lg bg-industrial-950/80 border border-industrial-700/70">
            <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Não Conformidades</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              {auditState.nonConformingCount}
            </div>
            <span className="text-[10px] text-amber-500/90 mt-1 block">Itens com Irregularidade</span>
          </div>

          <div className="p-3 rounded-lg bg-industrial-950/80 border border-rose-900/60 bg-rose-950/20">
            <span className="text-[10px] text-rose-300 uppercase tracking-wide block flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Riscos Críticos
            </span>
            <div className="text-2xl font-bold text-rose-400 mt-1">
              {auditState.criticalNonConformities}
            </div>
            <span className="text-[10px] text-rose-400/90 mt-1 block">Exposição Jurídica & Sinistro</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 p-1 bg-industrial-900 rounded-lg border border-industrial-700 text-xs font-mono">
          <span className="text-[11px] text-slate-400 px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filtrar Norma:
          </span>
          <button
            onClick={() => setSelectedStandard('ALL')}
            className={`px-3 py-1 rounded transition-all ${
              selectedStandard === 'ALL'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/50 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas ({auditState.totalItems})
          </button>
          <button
            onClick={() => setSelectedStandard('NBR_5419')}
            className={`px-3 py-1 rounded transition-all ${
              selectedStandard === 'NBR_5419'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/50 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            NBR 5419 (SPDA)
          </button>
          <button
            onClick={() => setSelectedStandard('NBR_5410')}
            className={`px-3 py-1 rounded transition-all ${
              selectedStandard === 'NBR_5410'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/50 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            NBR 5410 (BT)
          </button>
          <button
            onClick={() => setSelectedStandard('NBR_16690')}
            className={`px-3 py-1 rounded transition-all ${
              selectedStandard === 'NBR_16690'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/50 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            NBR 16690 (Solar)
          </button>
          <button
            onClick={() => setSelectedStandard('NBR_17193')}
            className={`px-3 py-1 rounded transition-all ${
              selectedStandard === 'NBR_17193'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/50 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            NBR 17193 (Fogo)
          </button>
          <button
            onClick={() => setSelectedStandard('NT_44_2025')}
            className={`px-3 py-1 rounded transition-all ${
              selectedStandard === 'NT_44_2025'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/50 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            NT 44/2025
          </button>
          <button
            onClick={() => setSelectedStandard('CBMERJ')}
            className={`px-3 py-1 rounded transition-all ${
              selectedStandard === 'CBMERJ'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/50 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CBMERJ
          </button>
        </div>
      </div>

      {/* Checklist Sections */}
      <div className="space-y-6">
        {filteredSections.map(section => (
          <div
            key={section.id}
            className="rounded-xl border border-industrial-700/80 bg-industrial-900/60 overflow-hidden shadow-xl"
          >
            {/* Section Header */}
            <div className="p-4 bg-industrial-950/90 border-b border-industrial-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100 font-mono tracking-wide">
                  {section.title}
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-industrial-800 text-slate-400 border border-industrial-700">
                {section.items.length} Requisitos Auditados
              </span>
            </div>

            {/* Items List */}
            <div className="divide-y divide-industrial-800">
              {section.items.map(item => (
                <div
                  key={item.id}
                  className={`p-4 transition-colors ${
                    item.status === 'NON_CONFORMING' && item.isCritical
                      ? 'bg-rose-950/20'
                      : 'hover:bg-industrial-800/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1 max-w-3xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-600/40">
                          {item.clause}
                        </span>
                        {item.isCritical && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700/50 flex items-center gap-1 font-bold">
                            <AlertTriangle className="w-3 h-3" /> Crítico
                          </span>
                        )}
                        <h4 className="text-xs font-bold text-slate-100">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {item.description}
                      </p>

                      {item.notes && (
                        <div className="p-2 mt-2 rounded bg-industrial-950 border border-amber-700/40 text-[11px] text-amber-200 font-mono">
                          <b>Constatação Pericial:</b> {item.notes}
                        </div>
                      )}

                      {item.recommendation && item.status === 'NON_CONFORMING' && (
                        <div className="text-[11px] text-cyan-300 font-mono mt-1">
                          <b>Ação Exigida:</b> {item.recommendation}
                        </div>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:items-end gap-2 flex-shrink-0">
                      {getStatusBadge(item.status)}

                      {/* Interactive toggle buttons */}
                      <div className="flex items-center gap-1 pt-1">
                        <button
                          onClick={() => onUpdateItemStatus(section.id, item.id, 'CONFORMING')}
                          className={`p-1.5 rounded text-xs font-mono transition-all ${
                            item.status === 'CONFORMING'
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'bg-industrial-800 hover:bg-emerald-950 text-slate-400 hover:text-emerald-300'
                          }`}
                          title="Marcar Conforme"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onUpdateItemStatus(section.id, item.id, 'NON_CONFORMING')}
                          className={`p-1.5 rounded text-xs font-mono transition-all ${
                            item.status === 'NON_CONFORMING'
                              ? 'bg-rose-600 text-white font-bold'
                              : 'bg-industrial-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300'
                          }`}
                          title="Marcar Não Conforme"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onUpdateItemStatus(section.id, item.id, 'NOT_APPLICABLE')}
                          className={`p-1.5 rounded text-xs font-mono transition-all ${
                            item.status === 'NOT_APPLICABLE'
                              ? 'bg-slate-600 text-white font-bold'
                              : 'bg-industrial-800 hover:bg-slate-700 text-slate-400'
                          }`}
                          title="Não Aplicável"
                        >
                          <MinusCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setActiveNotesItem(activeNotesItem === item.id ? null : item.id)
                          }
                          className="px-2 py-1 rounded bg-industrial-800 hover:bg-industrial-700 text-[10px] font-mono text-cyan-300 transition-all ml-1"
                        >
                          {activeNotesItem === item.id ? 'Fechar Nota' : 'Anotação'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Inline Notes Editor */}
                  {activeNotesItem === item.id && (
                    <div className="mt-3 p-3 rounded-lg bg-industrial-950 border border-cyan-500/40 space-y-2">
                      <label className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider block">
                        Anotações Técnicas do Perito / Evidências Fotográficas
                      </label>
                      <textarea
                        value={item.notes || ''}
                        onChange={e => onUpdateItemNotes(section.id, item.id, e.target.value)}
                        placeholder="Descreva a evidência em campo, número da foto, medição ôhmica ou histórico de não conformidade..."
                        rows={2}
                        className="w-full text-xs font-mono bg-industrial-900 border border-industrial-700 rounded p-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
