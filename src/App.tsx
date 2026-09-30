import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  Upload,
  Zap,
  RefreshCw,
  FileCheck2,
  Flame,
  FileText,
  Activity,
  Layers,
} from 'lucide-react';
import {
  ForensicAnalysisResult,
  ComplianceStatus,
  FireEvidenceInput,
  NormativeAuditState,
} from '@/types/forensics';
import { analyzeComtradeClient, getSampleComtrade } from '@/utils/comtradeParser';
import {
  getDefaultNormativeSections,
  computeNormativeAuditScore,
  getDefaultFireEvidence,
  inferFireCausalNexus,
} from '@/utils/normativeForensics';
import { OscillogramViewer } from '@/components/OscillogramViewer';
import { PhasorDiagram } from '@/components/PhasorDiagram';
import { HarmonicsSpectrum } from '@/components/HarmonicsSpectrum';
import { FaultDiagnosticCard } from '@/components/FaultDiagnosticCard';
import { ForensicReportModal } from '@/components/ForensicReportModal';
import { NormativeChecklistTab } from '@/components/NormativeChecklistTab';
import { FireCausalNexusTab } from '@/components/FireCausalNexusTab';

export default function App() {
  const [cfgFile, setCfgFile] = useState<File | null>(null);
  const [datFile, setDatFile] = useState<File | null>(null);
  const [rawAnalysisResult, setRawAnalysisResult] = useState<ForensicAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [activeSample, setActiveSample] = useState<'ground_fault' | 'harmonics' | 'normal'>('ground_fault');
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Modular Tabs State
  const [activeTab, setActiveTab] = useState<'oscillography' | 'normative_checklist' | 'fire_causal_nexus'>(
    'oscillography'
  );

  // Normative Audit State
  const [normativeSections, setNormativeSections] = useState(() => getDefaultNormativeSections());
  const auditState: NormativeAuditState = useMemo(() => {
    return computeNormativeAuditScore(normativeSections);
  }, [normativeSections]);

  // Fire Causal Nexus State
  const [fireEvidence, setFireEvidence] = useState<FireEvidenceInput>(() => getDefaultFireEvidence());
  const fireCausalResult = useMemo(() => {
    return inferFireCausalNexus(fireEvidence);
  }, [fireEvidence]);

  // Combined Analysis Result for Unified Report
  const analysisResult: ForensicAnalysisResult | null = useMemo(() => {
    if (!rawAnalysisResult) return null;
    return {
      ...rawAnalysisResult,
      normative_audit: auditState,
      fire_investigation: fireCausalResult,
    };
  }, [rawAnalysisResult, auditState, fireCausalResult]);

  // Check if FastAPI backend is available on localhost:8000
  useEffect(() => {
    fetch('http://localhost:8000/')
      .then(res => (res.ok ? setBackendOnline(true) : setBackendOnline(false)))
      .catch(() => setBackendOnline(false));
  }, []);

  // Load initial sample COMTRADE on mount
  useEffect(() => {
    loadSample('ground_fault');
  }, []);

  const loadSample = (type: 'ground_fault' | 'harmonics' | 'normal') => {
    setActiveSample(type);
    setLoading(true);
    try {
      const sample = getSampleComtrade(type);
      const result = analyzeComtradeClient(sample.cfg, sample.dat);
      setRawAnalysisResult(result);
    } catch (err) {
      console.error('Failed to load COMTRADE sample:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!cfgFile || !datFile) {
      alert('Selecione ambos os arquivos COMTRADE (.cfg e .dat) para realizar a análise.');
      return;
    }

    setLoading(true);
    try {
      const cfgText = await cfgFile.text();
      const datText = await datFile.text();

      // If backend is online, try backend first; otherwise use robust client-side engine
      if (backendOnline) {
        const formData = new FormData();
        formData.append('comtrade_cfg', cfgFile);
        formData.append('comtrade_dat', datFile);

        const res = await fetch('http://localhost:8000/analyze', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.results) {
            const clientParsed = analyzeComtradeClient(cfgText, datText);
            setRawAnalysisResult({ ...clientParsed, ...data.results });
            setLoading(false);
            return;
          }
        }
      }

      // Client-side parser fallback
      const result = analyzeComtradeClient(cfgText, datText);
      setRawAnalysisResult(result);
    } catch (err: any) {
      alert(`Erro analisando arquivos COMTRADE: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Checklist Handlers
  const handleUpdateItemStatus = (sectionId: string, itemId: string, status: ComplianceStatus) => {
    setNormativeSections(prev =>
      prev.map(sec => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: sec.items.map(item => {
            if (item.id !== itemId) return item;
            return { ...item, status };
          }),
        };
      })
    );
  };

  const handleUpdateItemNotes = (sectionId: string, itemId: string, notes: string) => {
    setNormativeSections(prev =>
      prev.map(sec => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: sec.items.map(item => {
            if (item.id !== itemId) return item;
            return { ...item, notes };
          }),
        };
      })
    );
  };

  const handleResetChecklist = () => {
    setNormativeSections(getDefaultNormativeSections());
  };

  const handleChangeFireEvidence = (updated: Partial<FireEvidenceInput>) => {
    setFireEvidence(prev => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen bg-industrial-950 text-slate-100 flex flex-col">
      {/* Top Industrial Header / HUD */}
      <header className="bg-industrial-900/90 backdrop-blur-md border-b border-industrial-700/80 px-4 sm:px-6 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center shadow-lg shadow-cyan-950/50">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold tracking-wide text-white font-mono uppercase">
                  Electrical Forensics Platform
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-600/40 hidden sm:inline">
                  v2.0 • B2B SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Diagnóstico Oscilográfico (IEEE C37.111), Auditoria Normativa (NBR 5419/5410/16690) & Jurisprudência STJ
              </p>
            </div>
          </div>

          {/* Quick HUD controls & unified report button */}
          <div className="flex items-center gap-3">
            {/* Unified Report Trigger */}
            <button
              onClick={() => setReportOpen(true)}
              disabled={!analysisResult}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold shadow-md shadow-cyan-950 transition-all disabled:opacity-40"
            >
              <FileText className="w-4 h-4" />
              <span>Gerar Laudo Pericial Unificado</span>
            </button>

            {/* Backend status indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-industrial-950 border border-industrial-700 text-[11px] font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                }`}
              />
              <span className="text-slate-400">
                {backendOnline ? 'FastAPI Online' : 'Client Engine Autônomo'}
              </span>
            </div>
          </div>
        </div>

        {/* HUD Modular Tab Bar */}
        <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-industrial-800/80 flex items-center gap-2 overflow-x-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab('oscillography')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold whitespace-nowrap ${
              activeTab === 'oscillography'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/60 shadow-lg shadow-cyan-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-industrial-800/50'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>1. Oscilografia & COMTRADE</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-industrial-900 border border-industrial-700 text-slate-400">
              IEEE C37.111
            </span>
          </button>

          <button
            onClick={() => setActiveTab('normative_checklist')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold whitespace-nowrap ${
              activeTab === 'normative_checklist'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/60 shadow-lg shadow-cyan-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-industrial-800/50'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>2. Checklists Normativos (SPDA/BT/Solar)</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                auditState.criticalNonConformities > 0
                  ? 'bg-rose-950 text-rose-300 border border-rose-700'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
              }`}
            >
              {auditState.complianceScore}%
            </span>
          </button>

          <button
            onClick={() => setActiveTab('fire_causal_nexus')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold whitespace-nowrap ${
              activeTab === 'fire_causal_nexus'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/60 shadow-lg shadow-cyan-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-industrial-800/50'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>3. Perícia de Incêndio & Nexo Causal</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-700">
              STJ
            </span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* TAB 1: OSCILLOGRAPHY & COMTRADE */}
        {activeTab === 'oscillography' && (
          <div className="space-y-6">
            {/* Upload Zone Card */}
            <div className="glass-panel rounded-xl p-4 border border-industrial-700/80 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-xs font-mono font-semibold text-slate-200 uppercase tracking-wide">
                    Ingestão de Oscilograma COMTRADE (.cfg + .dat)
                  </h2>
                </div>

                {/* Scenario Presets Selector */}
                <div className="flex items-center gap-1.5 p-1 bg-industrial-950 rounded-lg border border-industrial-700 text-xs font-mono">
                  <span className="text-[10px] text-slate-400 px-2">Cenários de Teste:</span>
                  <button
                    onClick={() => loadSample('ground_fault')}
                    className={`px-2.5 py-1 rounded transition-all ${
                      activeSample === 'ground_fault'
                        ? 'bg-rose-900/60 text-rose-200 border border-rose-600/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Falta Fase-Terra (A-G)
                  </button>
                  <button
                    onClick={() => loadSample('harmonics')}
                    className={`px-2.5 py-1 rounded transition-all ${
                      activeSample === 'harmonics'
                        ? 'bg-amber-900/60 text-amber-200 border border-amber-600/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Harmônicos Elevados
                  </button>
                  <button
                    onClick={() => loadSample('normal')}
                    className={`px-2.5 py-1 rounded transition-all ${
                      activeSample === 'normal'
                        ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-600/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Regime Normal
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* File .cfg */}
                <div className="p-3 rounded-lg bg-industrial-950/80 border border-industrial-700/80 flex flex-col justify-between">
                  <label className="text-[11px] font-mono text-slate-400 mb-1 block">
                    1. Arquivo de Configuração (.cfg)
                  </label>
                  <input
                    type="file"
                    accept=".cfg"
                    onChange={e => setCfgFile(e.target.files?.[0] || null)}
                    className="text-xs font-mono text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-mono file:bg-cyan-950 file:text-cyan-300 hover:file:bg-cyan-900 file:cursor-pointer"
                  />
                  {cfgFile && <span className="text-[10px] font-mono text-cyan-400 mt-1 truncate">{cfgFile.name}</span>}
                </div>

                {/* File .dat */}
                <div className="p-3 rounded-lg bg-industrial-950/80 border border-industrial-700/80 flex flex-col justify-between">
                  <label className="text-[11px] font-mono text-slate-400 mb-1 block">
                    2. Arquivo de Dados Temporais (.dat)
                  </label>
                  <input
                    type="file"
                    accept=".dat"
                    onChange={e => setDatFile(e.target.files?.[0] || null)}
                    className="text-xs font-mono text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-mono file:bg-cyan-950 file:text-cyan-300 hover:file:bg-cyan-900 file:cursor-pointer"
                  />
                  {datFile && <span className="text-[10px] font-mono text-cyan-400 mt-1 truncate">{datFile.name}</span>}
                </div>

                {/* Action Trigger */}
                <div className="flex items-end">
                  <button
                    onClick={handleFileUpload}
                    disabled={loading || (!cfgFile && !datFile)}
                    className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-semibold text-xs tracking-wide transition-all shadow-md shadow-cyan-950/50 flex items-center justify-center gap-2"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    Processar Oscilograma
                  </button>
                </div>
              </div>
            </div>

            {/* Results Bento Grid */}
            {analysisResult && (
              <div className="space-y-6">
                {/* Top: Fault Diagnostic & Action Plan */}
                <FaultDiagnosticCard
                  diagnosis={analysisResult.diagnosis}
                  onOpenReport={() => setReportOpen(true)}
                />

                {/* Waveform Viewer (Full Width) */}
                <OscillogramViewer
                  timeSeries={analysisResult.time_series}
                  channels={analysisResult.metadata.analog_channels}
                />

                {/* Dual Grid: Phasor & Fortescue + Harmonics & THD */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PhasorDiagram
                    symmetricalComponents={analysisResult.symmetrical_components}
                    rms={analysisResult.rms}
                  />
                  <HarmonicsSpectrum
                    thd={analysisResult.thd}
                    fft={analysisResult.fft}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: NORMATIVE CHECKLIST */}
        {activeTab === 'normative_checklist' && (
          <NormativeChecklistTab
            auditState={auditState}
            onUpdateItemStatus={handleUpdateItemStatus}
            onUpdateItemNotes={handleUpdateItemNotes}
            onResetToDefaults={handleResetChecklist}
          />
        )}

        {/* TAB 3: FIRE CAUSAL NEXUS & STJ */}
        {activeTab === 'fire_causal_nexus' && (
          <FireCausalNexusTab
            evidence={fireEvidence}
            causalResult={fireCausalResult}
            onChangeEvidence={handleChangeFireEvidence}
          />
        )}
      </main>

      {/* Technical Report Modal (Unified with All 3 Pillars) */}
      {analysisResult && (
        <ForensicReportModal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          result={analysisResult}
        />
      )}

      {/* Industrial Footer */}
      <footer className="bg-industrial-900/90 border-t border-industrial-700/80 px-6 py-3 mt-auto text-center text-[11px] font-mono text-slate-500">
        Electrical Forensics Platform • NBR 5419:2026 • NBR 17193:2025 • NBR 16690 (Revisão 2026) • NT 44/2025 • NBR 5410 (Revisão 2026) • CBMERJ • STJ REsp 1.285.984/SP • STJ AREsp 3.001.677
      </footer>
    </div>
  );
}