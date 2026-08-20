import { describe, it, expect } from 'vitest';
import {
  parseComtradeCfg,
  parseComtradeDat,
  calculateSymmetricalComponents,
  calculateRms,
  calculateFftAndThd,
  diagnoseFault,
  getSampleComtrade,
  analyzeComtradeClient,
} from '../utils/comtradeParser';

describe('Electrical Forensics Engine — Test Suite', () => {
  it('should parse COMTRADE configuration (.cfg) accurately', () => {
    const sample = getSampleComtrade('ground_fault');
    const metadata = parseComtradeCfg(sample.cfg);

    expect(metadata.station_name).toBe('Subestação Mina Central');
    expect(metadata.recorder_id).toBe('RECORDER_SEL_700G');
    expect(metadata.num_analog).toBe(3);
    expect(metadata.frequency).toBe(60);
    expect(metadata.analog_channels.length).toBe(3);
    expect(metadata.analog_channels[0].id).toBe('VA');
  });

  it('should parse COMTRADE data (.dat) and extract time series', () => {
    const sample = getSampleComtrade('ground_fault');
    const metadata = parseComtradeCfg(sample.cfg);
    const data = parseComtradeDat(sample.dat, metadata);

    expect(data.time.length).toBe(600);
    expect(data.analog['VA'].length).toBe(600);
    expect(data.analog['VB'].length).toBe(600);
    expect(data.analog['VC'].length).toBe(600);
  });

  it('should calculate RMS correctly for a pure sine wave', () => {
    const numSamples = 1000;
    const freq = 60;
    const sampleRate = 10000;
    const V_peak = 100;
    const signal: number[] = [];

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      signal.push(V_peak * Math.sin(2 * Math.PI * freq * t));
    }

    const rms = calculateRms(signal);
    expect(rms).toBeCloseTo(70.71, 0.5);
  });

  it('should compute Fortescue symmetrical components for balanced 3-phase system', () => {
    const numSamples = 600;
    const freq = 60;
    const sampleRate = 10000;
    const V_peak = 100;

    const va: number[] = [];
    const vb: number[] = [];
    const vc: number[] = [];

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      va.push(V_peak * Math.sin(2 * Math.PI * freq * t));
      vb.push(V_peak * Math.sin(2 * Math.PI * freq * t - (2 * Math.PI) / 3));
      vc.push(V_peak * Math.sin(2 * Math.PI * freq * t + (2 * Math.PI) / 3));
    }

    const sym = calculateSymmetricalComponents(va, vb, vc, sampleRate, freq);

    // In balanced system:
    // Positive sequence V1 ≈ V_rms = 100 / sqrt(2) ≈ 70.71
    // Zero sequence V0 ≈ 0
    // Negative sequence V2 ≈ 0
    // VUF ≈ 0%
    expect(sym.posMagAvg).toBeGreaterThan(65);
    expect(sym.zeroMagAvg).toBeLessThan(1.0);
    expect(sym.negMagAvg).toBeLessThan(1.0);
    expect(sym.voltageUnbalanceRate).toBeLessThan(1.0);
  });

  it('should accurately diagnose a Phase-to-Ground fault (A-G)', () => {
    const sample = getSampleComtrade('ground_fault');
    const result = analyzeComtradeClient(sample.cfg, sample.dat);

    expect(result.status).toBe('success');
    expect(result.diagnosis.severity).toBe('CRITICAL');
    expect(result.diagnosis.faultTypeName).toContain('Fase-Terra');
    expect(result.diagnosis.confidence).toBeGreaterThan(90);
  });

  it('should detect harmonic distortion when THD exceeds limit', () => {
    const sample = getSampleComtrade('harmonics');
    const result = analyzeComtradeClient(sample.cfg, sample.dat);

    expect(result.status).toBe('success');
    expect(result.thd.phase_a).toBeGreaterThan(8.0);
    expect(result.diagnosis.faultTypeName).toContain('Harmônica');
  });

  it('should validate normal operating regime', () => {
    const sample = getSampleComtrade('normal');
    const result = analyzeComtradeClient(sample.cfg, sample.dat);

    expect(result.status).toBe('success');
    expect(result.diagnosis.severity).toBe('NORMAL');
    expect(result.diagnosis.faultTypeName).toContain('Regime Permanente');
  });
});
