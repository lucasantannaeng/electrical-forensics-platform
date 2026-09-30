import React from 'react';
import { ForensicAnalysisResult } from '@/types/forensics';
import {
  X,
  Printer,
  Download,
  FileCheck,
  Shield,
  Scale,
  Flame,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface ForensicReportModalProps {
  open: boolean;
  onClose: () => void;
  result: ForensicAnalysisResult;
}

export const ForensicReportModal: React.FC<ForensicReportModalProps> = ({ open, onClose, result }) => {
  if (!open) return null;

  const {
    metadata,
    diagnosis,
    rms,
    thd,
    symmetrical_components,
    normative_audit,
    fire_investigation,
  } = result;

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-industrial-900 border border-cyan-500/40 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header (Hidden during Print) */}
        <div className="flex items-center justify-between p-4 bg-industrial-950 border-b border-industrial-700 print:hidden">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-100 font-mono tracking-wide uppercase">
                Laudo Pericial Unificado de Engenharia Elétrica
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">
                Oscilografia IEEE C37.111 • NBR 5419 • NBR 5410 • NBR 16690 • Jurisprudência STJ
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all text-xs flex items-center gap-1.5 font-mono shadow-md shadow-cyan-950"
              title="Imprimir / Salvar em PDF"
            >
              <Printer className="w-4 h-4" /> Imprimir / PDF
            </button>
            <button
              onClick={handleDownloadJson}
              className="p-1.5 px-2.5 rounded-lg bg-industrial-800 hover:bg-industrial-700 text-slate-300 transition-all text-xs flex items-center gap-1.5 font-mono border border-industrial-700"
              title="Exportar JSON"
            >
              <Download className="w-4 h-4 text-cyan-400" /> JSON
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-industrial-800 text-slate-400 hover:text-white transition-all ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Document Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 font-sans text-xs bg-industrial-900 print:bg-white print:text-black print:p-8 print:max-h-none print:overflow-visible">
          {/* Official Document Header */}
          <div className="border-b border-industrial-700/80 print:border-black pb-4 text-center space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 print:text-gray-600 font-bold">
              República Federativa do Brasil • Conselho Regional de Engenharia e Agronomia (CREA)
            </div>
            <h1 className="text-base sm:text-lg font-bold font-mono text-slate-100 print:text-black uppercase">
              Laudo Técnico Pericial de Engenharia Elétrica & Investigação de Sinistro
            </h1>
            <p className="text-[11px] text-slate-400 print:text-gray-600 font-mono">
              Auditoria de Conformidade Normativa, Análise Oscilográfica e Parecer de Nexo Causal
            </p>
          </div>

          {/* Identification Metadata */}
          <div className="p-4 rounded-xl bg-industrial-950/80 print:bg-gray-100 border border-industrial-700/80 print:border-gray-300 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 print:text-gray-600">Local / Subestação:</span>
              <div className="text-slate-100 print:text-black font-bold">{metadata.station_name}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 print:text-gray-600">Registrador / IED:</span>
              <div className="text-slate-100 print:text-black font-bold">{metadata.recorder_id}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 print:text-gray-600">Padrão Oscilográfico:</span>
              <div className="text-slate-100 print:text-black font-bold">IEEE C37.111-{metadata.year}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 print:text-gray-600">Frequência da Rede:</span>
              <div className="text-slate-100 print:text-black font-bold">{metadata.frequency} Hz</div>
            </div>
          </div>

          {/* Section 1: COMTRADE Oscilografia & Diagnóstico de Falta */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-industrial-800 print:border-gray-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 print:bg-black" />
              <h3 className="text-xs font-bold font-mono text-slate-200 print:text-black uppercase tracking-wide">
                1. Diagnóstico Oscilográfico e Componentes Simétricas (IEEE C37.111)
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/30 print:bg-gray-50 border border-cyan-500/40 print:border-gray-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 print:text-black font-mono flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4" /> CONCLUSÃO OSCILOGRÁFICA DO EVENTO
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 print:bg-gray-200 text-cyan-200 print:text-black border border-cyan-600/40">
                  Nível de Confiança: {diagnosis.confidence}%
                </span>
              </div>
              <div className="text-sm font-bold text-slate-100 print:text-black">{diagnosis.faultTypeName}</div>
              <p className="text-slate-300 print:text-gray-800 leading-relaxed text-xs">{diagnosis.description}</p>
            </div>

            {/* Electrical Parameters Table */}
            <div className="border border-industrial-700 print:border-gray-300 rounded-lg overflow-hidden font-mono text-[11px]">
              <table className="w-full text-left">
                <thead className="bg-industrial-950 print:bg-gray-200 text-slate-400 print:text-black border-b border-industrial-700 print:border-gray-300">
                  <tr>
                    <th className="p-2">Grandeza Medida</th>
                    <th className="p-2">Fase A</th>
                    <th className="p-2">Fase B</th>
                    <th className="p-2">Fase C</th>
                    <th className="p-2">Critério / Limite Normativo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-industrial-800 print:divide-gray-200 bg-industrial-900/50 print:bg-white">
                  <tr>
                    <td className="p-2 text-slate-400 print:text-gray-700">Tensão Eficaz (RMS)</td>
                    <td className="p-2 font-bold text-sky-400 print:text-black">{rms.phase_a} V</td>
                    <td className="p-2 font-bold text-amber-400 print:text-black">{rms.phase_b} V</td>
                    <td className="p-2 font-bold text-rose-400 print:text-black">{rms.phase_c} V</td>
                    <td className="p-2 text-slate-400 print:text-gray-700">PRODIST Módulo 8 (±5%)</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-400 print:text-gray-700">Distorção Harmônica (THD)</td>
                    <td className="p-2 text-sky-400 print:text-black">{thd.phase_a}%</td>
                    <td className="p-2 text-amber-400 print:text-black">{thd.phase_b}%</td>
                    <td className="p-2 text-rose-400 print:text-black">{thd.phase_c}%</td>
                    <td className="p-2 text-slate-400 print:text-gray-700">≤ 5.0% (IEEE 519 / IEC)</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-400 print:text-gray-700">Taxa Desbalanço (VUF %)</td>
                    <td colSpan={3} className="p-2 font-bold text-cyan-300 print:text-black">
                      {symmetrical_components.voltageUnbalanceRate}% (V0: {symmetrical_components.zeroMagAvg}V | V2: {symmetrical_components.negMagAvg}V)
                    </td>
                    <td className="p-2 text-slate-400 print:text-gray-700">IEC 61000-4-30 (&lt; 2.0%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Auditoria Normativa NBR 5419 / NBR 5410 / NBR 16690 / CBMERJ */}
          {normative_audit && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 pb-1 border-b border-industrial-800 print:border-gray-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 print:bg-black" />
                <h3 className="text-xs font-bold font-mono text-slate-200 print:text-black uppercase tracking-wide">
                  2. Auditoria Técnica e Conformidade com Normas ABNT & CBMERJ
                </h3>
              </div>

              <div className="p-3 rounded-lg bg-industrial-950/80 print:bg-gray-100 border border-industrial-700 print:border-gray-300 flex items-center justify-between font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 print:text-gray-600 block">Índice Geral de Conformidade Normativa</span>
                  <span className="text-base font-bold text-cyan-300 print:text-black">
                    {normative_audit.complianceScore}% ({normative_audit.conformingCount} conformes / {normative_audit.nonConformingCount} não conformidades)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-rose-400 print:text-red-700 block font-bold">
                    Não Conformidades Críticas: {normative_audit.criticalNonConformities}
                  </span>
                  <span className="text-[10px] text-slate-400 print:text-gray-600">
                    Última Atualização: {new Date(normative_audit.lastUpdated).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Non-Conformities Summary */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-mono font-semibold text-amber-400 print:text-amber-800 uppercase">
                  Pontos de Irregularidade e Risco Técnico Identificados:
                </h4>
                <div className="space-y-2">
                  {normative_audit.sections.flatMap(sec => sec.items)
                    .filter(item => item.status === 'NON_CONFORMING')
                    .map(item => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg bg-industrial-950/90 print:bg-gray-50 border border-amber-600/40 print:border-gray-300 text-xs font-mono space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200 print:text-black">
                            [{item.clause}] {item.title}
                          </span>
                          {item.isCritical && (
                            <span className="text-[10px] text-rose-400 print:text-red-700 font-bold uppercase">
                              Risco Crítico
                            </span>
                          )}
                        </div>
                        {item.notes && (
                          <p className="text-slate-300 print:text-gray-700 font-sans text-xs">
                            <b>Constatação:</b> {item.notes}
                          </p>
                        )}
                        {item.recommendation && (
                          <p className="text-cyan-300 print:text-blue-900 font-sans text-xs">
                            <b>Ação Corretiva:</b> {item.recommendation}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Investigação Pericial de Incêndio & Jurisprudência STJ */}
          {fire_investigation && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 pb-1 border-b border-industrial-800 print:border-gray-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 print:bg-black" />
                <h3 className="text-xs font-bold font-mono text-slate-200 print:text-black uppercase tracking-wide">
                  3. Investigação Pericial de Incêndio & Nexo Causal (Jurisprudência STJ)
                </h3>
              </div>

              {/* STJ Ruling Notice */}
              <div className="p-4 rounded-xl bg-industrial-950/90 print:bg-gray-100 border border-amber-500/50 print:border-gray-300 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 print:text-black font-mono">
                  <Scale className="w-4 h-4 text-amber-400 print:text-black" /> FUNDAMENTAÇÃO LEGAL E JURISPRUDENCIAL
                </div>
                <p className="text-slate-300 print:text-gray-800 leading-relaxed font-sans text-xs">
                  {fire_investigation.stjJurisprudenceEnforcement.citation}
                </p>
                <p className="text-slate-400 print:text-gray-600 font-mono text-[11px] pt-1">
                  <b>Amparo Normativo Civil:</b> {fire_investigation.stjJurisprudenceEnforcement.civilCodeArticle}
                </p>
              </div>

              {/* Technical Assessment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-industrial-950/80 print:bg-gray-50 border border-industrial-700 print:border-gray-300 space-y-1">
                  <span className="text-[10px] text-cyan-400 print:text-black uppercase font-bold block">
                    Exame Metalográfico do Cobre
                  </span>
                  <p className="text-slate-300 print:text-gray-800 font-sans text-xs">
                    {fire_investigation.metallurgicalAnalysis}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-industrial-950/80 print:bg-gray-50 border border-industrial-700 print:border-gray-300 space-y-1">
                  <span className="text-[10px] text-amber-400 print:text-black uppercase font-bold block">
                    Histórico de Manutenção e Omissão
                  </span>
                  <p className="text-slate-300 print:text-gray-800 font-sans text-xs">
                    {fire_investigation.maintenanceAssessment}
                  </p>
                </div>
              </div>

              {/* Conclusion Notice */}
              <div className="p-4 rounded-xl bg-rose-950/40 print:bg-gray-100 border border-rose-600/50 print:border-gray-400 font-mono text-xs">
                <div className="text-rose-300 print:text-black font-bold uppercase mb-1">
                  Parecer Pericial Conclusivo de Responsabilidade Civil:
                </div>
                <p className="text-slate-200 print:text-black font-sans leading-relaxed">
                  {fire_investigation.stjJurisprudenceEnforcement.liabilityNotice}
                </p>
              </div>
            </div>
          )}

          {/* Section 4: Recomendações e Plano de Ação */}
          <div className="p-4 rounded-xl bg-industrial-950/80 print:bg-gray-50 border border-industrial-700/80 print:border-gray-300 space-y-2">
            <h4 className="text-xs font-mono font-semibold text-amber-400 print:text-black uppercase tracking-wide">
              4. Recomendações Periciais Mitigatórias e Exigências Legais
            </h4>
            <p className="text-slate-300 print:text-gray-800 leading-relaxed text-xs">
              {diagnosis.recommendation}
            </p>
            {fire_investigation?.urgentCorrectiveActions && (
              <ul className="list-disc list-inside text-slate-300 print:text-gray-800 text-xs pt-1 space-y-1">
                {fire_investigation.urgentCorrectiveActions.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Engineering Signature Block */}
          <div className="pt-6 border-t border-industrial-700/80 print:border-gray-400 grid grid-cols-2 gap-8 text-center font-mono text-[11px]">
            <div className="space-y-1">
              <div className="border-b border-industrial-600 print:border-black w-48 mx-auto pb-1" />
              <div className="font-bold text-slate-200 print:text-black">Engenheiro Eletricista Responsável</div>
              <div className="text-slate-400 print:text-gray-600">CREA-RJ / RNP • ART de Perícia Técnica</div>
            </div>
            <div className="space-y-1">
              <div className="border-b border-industrial-600 print:border-black w-48 mx-auto pb-1" />
              <div className="font-bold text-slate-200 print:text-black">Administração Predial / Responsável</div>
              <div className="text-slate-400 print:text-gray-600">Ciente do Laudo e Exigências Notificadas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
