import React, { useState, useEffect } from 'react';
import {
  Shield,
  Upload,
  Zap,
  Activity,
  FileText,
  RefreshCw,
  FolderOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers
} from 'lucide-react';
import { ForensicAnalysisResult } from '@/types/forensics';
import { analyzeComtradeClient, getSampleComtrade } from '@/utils/comtradeParser';
import { OscillogramViewer } from '@/components/OscillogramViewer';
import { PhasorDiagram } from '@/components/PhasorDiagram';
import { HarmonicsSpectrum } from '@/components/HarmonicsSpectrum';
import { FaultDiagnosticCard } from '@/components/FaultDiagnosticCard';
import { ForensicReportModal } from '@/components/ForensicReportModal';

export default function App() {
  const [cfgFile, setCfgFile] = useState<File | null>(null);
  const [datFile, setDatFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ForensicAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [activeSample, setActiveSample] = useState<'ground_fault' | 'harmonics' | 'normal'>('ground_fault');
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Check if FastAPI backend is available on localhost:8000
  useEffect(() => {
    fetch('http://localhost:8000/')
      .then(res => res.ok ? setBackendOnline(true) : setBackendOnline(false))
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
      setAnalysisResult(result);
    } catch (err) {
      console.error('Falha ao processar amostra:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!cfgFile || !datFile) {
      alert('Por favor, selecione ambos os arquivos (.cfg e .dat) do registro COMTRADE.');
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
            // Also run client diagnosis for UI enrichment
            const clientParsed = analyzeComtradeClient(cfgText, datText);
            setAnalysisResult({ ...clientParsed, ...data.results });
            setLoading(false);
            return;
          }
        }
      }

      // Client-side parser fallback
      const result = analyzeComtradeClient(cfgText, datText);
      setAnalysisResult(result);
    } catch (err: any) {
      alert(`Erro ao analisar arquivos COMTRADE: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-industrial-950 text-slate-100 flex flex-col">
      {/* Top Industrial Header / HUD */}
      <header className="bg-industrial-900/90 backdrop-blur-md border-b border-industrial-700/80 px-6 py-3.5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center shadow-lg shadow-cyan-950/50">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-wide text-white font-mono uppercase">
                  Electrical Forensics Platform
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-600/40">
                  IEEE C37.111
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Diagnóstico Pericial Automatizado de Oscilografias e Perturbações Industriais
              </p>
            </div>
          </div>

          {/* Quick HUD controls & sample buttons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-industrial-950 rounded-lg border border-industrial-700 text-xs font-mono">
              <span className="text-[10px] text-slate-400 px-2">Cenários:</span>
              <button
                onClick={() => loadSample('ground_fault')}
                className={`px-2.5 py-1 rounded transition-all ${
                  activeSample === 'ground_fault'
                    ? 'bg-rose-900/60 text-rose-200 border border-rose-600/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Fase-Terra (A-G)
              </button>
              <button
                onClick={() => loadSample('harmonics')}
                className={`px-2.5 py-1 rounded transition-all ${
                  activeSample === 'harmonics'
                    ? 'bg-amber-900/60 text-amber-200 border border-amber-600/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Harmônicas
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

            {/* Backend status indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-industrial-950 border border-industrial-700 text-[11px] font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                }`}
              />
              <span className="text-slate-400">
                {backendOnline ? 'FastAPI Online' : 'Client Engine Ativo'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Upload Zone Card */}
        <div className="glass-panel rounded-xl p-4 border border-industrial-700/80 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-mono font-semibold text-slate-200 uppercase tracking-wide">
                Ingestão de Arquivos COMTRADE (.cfg + .dat)
              </h2>
            </div>
            {analysisResult && (
              <span className="text-[11px] font-mono text-cyan-400">
                Estação: <b>{analysisResult.metadata.station_name}</b> | IED: <b>{analysisResult.metadata.recorder_id}</b>
              </span>
            )}
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
                2. Arquivo de Dados (.dat)
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
                Processar Oscilografia
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
      </main>

      {/* Technical Report Modal */}
      {analysisResult && (
        <ForensicReportModal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          result={analysisResult}
        />
      )}

      {/* Industrial Footer */}
      <footer className="bg-industrial-900/90 border-t border-industrial-700/80 px-6 py-3 mt-auto text-center text-[11px] font-mono text-slate-500">
        Electrical Forensics Platform • Padrão IEEE C37.111 / IEC 61000-4-30 • Análise Pericial Trifásica
      </footer>
    </div>
  );
}