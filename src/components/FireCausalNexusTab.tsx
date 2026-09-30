import React from 'react';
import {
  FireEvidenceInput,
  FireCausalNexusResult,
  CopperMeltType,
  MaintenanceInterval,
} from '@/types/forensics';
import {
  Flame,
  Scale,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Building,
  Microscope,
  Calendar,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface FireCausalNexusTabProps {
  evidence: FireEvidenceInput;
  causalResult: FireCausalNexusResult;
  onChangeEvidence: (updated: Partial<FireEvidenceInput>) => void;
}

export const FireCausalNexusTab: React.FC<FireCausalNexusTabProps> = ({
  evidence,
  causalResult,
  onChangeEvidence,
}) => {
  const getNexusBadge = () => {
    switch (causalResult.causalNexusClassification) {
      case 'DEFINITIVE_ELECTRICAL_FAILURE':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-600 animate-pulse">
            <Flame className="w-4 h-4 text-rose-400" /> ORIGEM ELÉTRICA COMPROVADA (ARCO PRIMÁRIO)
          </span>
        );
      case 'PROBABLE_ELECTRICAL_FAILURE':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-600">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> CAUSA PROVÁVEL ELÉTRICA
          </span>
        );
      case 'UNDETERMINED_SECONDARY_HEAT':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-950 text-sky-300 border border-sky-600">
            <ShieldAlert className="w-4 h-4 text-sky-400" /> FUSÃO SECUNDÁRIA (FOGO EXTERNO)
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-900 text-slate-300 border border-slate-700">
            <HelpCircle className="w-4 h-4 text-slate-400" /> VESTÍGIOS INCONCLUSIVOS
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel-glow rounded-xl p-5 border border-cyan-500/40 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-industrial-700/80">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Scale className="w-4 h-4" /> Investigação Pericial de Incêndio & Nexo Causal
            </div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Motor de Inferência Pericial & Jurisprudência STJ
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Avaliação microscópica de condutores (Arco Primário vs. Calor Secundário), histórico de manutenção preventiva
              e enquadramento de responsabilidade civil da gestão predial conforme precedentes do STJ.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {getNexusBadge()}
          </div>
        </div>

        {/* Probabilities Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 font-mono">
          {/* Gauge 1: Probabilidade de Origem Elétrica */}
          <div className="p-4 rounded-lg bg-industrial-950/80 border border-industrial-700/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Probabilidade de Origem Elétrica Primária
              </span>
              <span className="text-lg font-bold text-amber-400">
                {causalResult.primaryElectricalCauseProb}%
              </span>
            </div>
            <div className="w-full bg-industrial-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  causalResult.primaryElectricalCauseProb >= 75
                    ? 'bg-rose-500'
                    : causalResult.primaryElectricalCauseProb >= 45
                    ? 'bg-amber-400'
                    : 'bg-slate-500'
                }`}
                style={{ width: `${causalResult.primaryElectricalCauseProb}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block pt-0.5">
              Baseado em glóbulos de fusão de cobre, atuação de disjuntores e relatos de centelhamento.
            </span>
          </div>

          {/* Gauge 2: Índice de Negligência por Falta de Manutenção */}
          <div className="p-4 rounded-lg bg-industrial-950/80 border border-industrial-700/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400" /> Índice de Negligência / Falha de Manutenção
              </span>
              <span className="text-lg font-bold text-rose-400">
                {causalResult.negligenceProbability}%
              </span>
            </div>
            <div className="w-full bg-industrial-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  causalResult.negligenceProbability >= 60
                    ? 'bg-rose-500'
                    : causalResult.negligenceProbability >= 30
                    ? 'bg-amber-400'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${causalResult.negligenceProbability}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block pt-0.5">
              Baseado na ausência de termografia, período sem ART e falta de DPS coordenado.
            </span>
          </div>
        </div>
      </div>

      {/* Decision Tree: Interactive Evidence Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column A: Evidências Físicas e Metalográficas */}
        <div className="rounded-xl border border-industrial-700/80 bg-industrial-900/60 p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-industrial-700/80">
            <Microscope className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wide">
              1. Evidências Físicas nos Condutores (Microscopia)
            </h3>
          </div>

          {/* Copper Melt Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-300 block">
              Morfologia dos Glóbulos de Cobre (Fusão de Condutores):
            </label>
            <select
              value={evidence.copperMelt}
              onChange={e => onChangeEvidence({ copperMelt: e.target.value as CopperMeltType })}
              className="w-full text-xs font-mono bg-industrial-950 border border-industrial-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="PRIMARY_ARC_BEAD">
                ⚡ Fusão Primária por Curto-Circuito (Arc Bead nítido com cratera interna de gás)
              </option>
              <option value="SECONDARY_FIRE_MELTING">
                🔥 Fusão Térmica Secundária (Fogo externo, condutor afilado, óxido difuso)
              </option>
              <option value="NO_MELTING">
                ✅ Condutores sem marcas de fusão no foco inicial
              </option>
              <option value="NOT_ANALYZED">
                ❓ Amostra não coletada / Sem exame metalográfico
              </option>
            </select>
            <p className="text-[10px] text-slate-400 font-mono">
              * Conforme NFPA 921 e ASTM E2888: o arco primário precede o fogo e comprova a causa elétrica.
            </p>
          </div>

          {/* Circuit Breakers & Protections */}
          <div className="space-y-3 pt-2">
            <label className="text-[11px] font-mono text-slate-300 block">
              Comportamento das Proteções Elétricas:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-industrial-950 border border-industrial-700/70 cursor-pointer hover:border-cyan-500/50">
                <input
                  type="checkbox"
                  checked={evidence.circuitBreakerTripped}
                  onChange={e => onChangeEvidence({ circuitBreakerTripped: e.target.checked })}
                  className="rounded border-industrial-700 text-cyan-500 focus:ring-0"
                />
                <span className="text-slate-300 text-[11px]">Disjuntor Desarmado</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-industrial-950 border border-industrial-700/70 cursor-pointer hover:border-cyan-500/50">
                <input
                  type="checkbox"
                  checked={evidence.tamperedProtection}
                  onChange={e => onChangeEvidence({ tamperedProtection: e.target.checked })}
                  className="rounded border-industrial-700 text-cyan-500 focus:ring-0"
                />
                <span className="text-slate-300 text-[11px]">Proteção Adulterada / Jumper</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-industrial-950 border border-industrial-700/70 cursor-pointer hover:border-cyan-500/50">
                <input
                  type="checkbox"
                  checked={evidence.eyewitnessFlickerOrSparks}
                  onChange={e => onChangeEvidence({ eyewitnessFlickerOrSparks: e.target.checked })}
                  className="rounded border-industrial-700 text-cyan-500 focus:ring-0"
                />
                <span className="text-slate-300 text-[11px]">Testemunhas: Centelhas/Ruído</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-industrial-950 border border-industrial-700/70 cursor-pointer hover:border-cyan-500/50">
                <input
                  type="checkbox"
                  checked={evidence.combustiblesNearPanels}
                  onChange={e => onChangeEvidence({ combustiblesNearPanels: e.target.checked })}
                  className="rounded border-industrial-700 text-cyan-500 focus:ring-0"
                />
                <span className="text-slate-300 text-[11px]">Inflamáveis Próximos</span>
              </label>
            </div>
          </div>
        </div>

        {/* Column B: Gestão, Manutenção e STJ */}
        <div className="rounded-xl border border-industrial-700/80 bg-industrial-900/60 p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-industrial-700/80">
            <Building className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wide">
              2. Gestão Predial & Histórico de Manutenção
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-300 block">
                Tipo de Ocupação:
              </label>
              <input
                type="text"
                value={evidence.buildingType}
                onChange={e => onChangeEvidence({ buildingType: e.target.value })}
                className="w-full text-xs font-mono bg-industrial-950 border border-industrial-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-300 block">
                Idade da Instalação (anos):
              </label>
              <input
                type="number"
                value={evidence.installationAgeYears}
                onChange={e => onChangeEvidence({ installationAgeYears: parseInt(e.target.value, 10) || 0 })}
                className="w-full text-xs font-mono bg-industrial-950 border border-industrial-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Maintenance Interval */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-300 block">
              Periodicidade da Manutenção Preventiva:
            </label>
            <select
              value={evidence.maintenanceInterval}
              onChange={e => onChangeEvidence({ maintenanceInterval: e.target.value as MaintenanceInterval })}
              className="w-full text-xs font-mono bg-industrial-950 border border-industrial-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="UP_TO_DATE">✅ Em dia (&lt; 6 meses com ART e Relatório)</option>
              <option value="OVERDUE_6_TO_12_MONTHS">⚠️ Em atraso intermediário (6 a 12 meses)</option>
              <option value="OVERDUE_OVER_12_MONTHS">🚨 Atraso crítico (&gt; 12 meses sem manutenção)</option>
              <option value="NEVER_PERFORMED">❌ Sem histórico de manutenção desde a entrega da obra</option>
            </select>
          </div>

          {/* Thermography Status */}
          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
              <input
                type="checkbox"
                checked={evidence.hasThermographyReport}
                onChange={e => onChangeEvidence({ hasThermographyReport: e.target.checked })}
                className="rounded border-industrial-700 text-cyan-500 focus:ring-0"
              />
              <span className="text-slate-300">Possui Relatório Termográfico com Câmera Infravermelha</span>
            </label>

            {!evidence.hasThermographyReport && (
              <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/60 text-[11px] font-mono text-rose-300">
                Ausência de termografia periódica descumpre boas práticas de manutenção preventiva (ABNT/NBR 15575) e configura negligência técnica perante o STJ.
              </div>
            )}
          </div>

          {/* DPS & SPDA presence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-1">
            <label className="flex items-center gap-2 p-2 rounded-lg bg-industrial-950 border border-industrial-700/70 cursor-pointer">
              <input
                type="checkbox"
                checked={evidence.hasDpsInstalled}
                onChange={e => onChangeEvidence({ hasDpsInstalled: e.target.checked })}
                className="rounded border-industrial-700 text-cyan-500 focus:ring-0"
              />
              <span className="text-slate-300 text-[11px]">DPS Instalado no QGBT</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-lg bg-industrial-950 border border-industrial-700/70 cursor-pointer">
              <input
                type="checkbox"
                checked={evidence.hasSpdaInstalled}
                onChange={e => onChangeEvidence({ hasSpdaInstalled: e.target.checked })}
                className="rounded border-industrial-700 text-cyan-500 focus:ring-0"
              />
              <span className="text-slate-300 text-[11px]">SPDA Externo Instalado</span>
            </label>
          </div>
        </div>
      </div>

      {/* Legal & STJ Jurisprudence Enforcement Card */}
      <div className="p-5 rounded-xl bg-industrial-900/80 border border-amber-500/40 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-mono uppercase tracking-wide">
          <Scale className="w-4 h-4 text-amber-400" /> 3. Fundamentação Jurídica & Jurisprudência Consolidada do STJ
        </div>

        <div className="p-4 rounded-lg bg-industrial-950/90 border border-industrial-700 space-y-2 text-xs font-mono">
          <div className="text-cyan-300 font-bold">Precedente Vinculante do Superior Tribunal de Justiça (STJ):</div>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            {causalResult.stjJurisprudenceEnforcement.citation}
          </p>

          <div className="pt-2 text-amber-300 font-bold">Dispositivo Legal do Código Civil:</div>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            {causalResult.stjJurisprudenceEnforcement.civilCodeArticle}
          </p>
        </div>

        {/* Conclusion / Liability Notice */}
        <div
          className={`p-4 rounded-lg border font-mono text-xs ${
            causalResult.stjJurisprudenceEnforcement.appliesNoFortuitousCase
              ? 'bg-rose-950/40 border-rose-600/60 text-rose-200'
              : 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
          }`}
        >
          <div className="font-bold uppercase tracking-wide mb-1 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Enquadramento de Responsabilidade Civil:
          </div>
          <p className="leading-relaxed font-sans">
            {causalResult.stjJurisprudenceEnforcement.liabilityNotice}
          </p>
        </div>
      </div>

      {/* Technical Summary and Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
        <div className="p-4 rounded-xl bg-industrial-950/80 border border-industrial-700 space-y-2">
          <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wide flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Síntese Metalúrgica e Pericial
          </h4>
          <p className="text-slate-300 font-sans leading-relaxed text-xs">
            {causalResult.metallurgicalAnalysis}
          </p>
          <p className="text-slate-400 font-sans text-[11px] pt-1">
            <b>Diagnóstico de Manutenção:</b> {causalResult.maintenanceAssessment}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-industrial-950/80 border border-industrial-700 space-y-2">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> Ações Mitigatórias Urgentes Exigidas
          </h4>
          <ul className="space-y-1.5 text-slate-300 font-sans text-xs">
            {causalResult.urgentCorrectiveActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
