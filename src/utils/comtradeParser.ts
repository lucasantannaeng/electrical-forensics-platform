import {
  ComtradeMetadata,
  TimeSeriesData,
  SymmetricalComponents,
  ComplexNumber,
  ForensicAnalysisResult,
  FaultDiagnosis,
  AnalogChannel,
} from '@/types/forensics';

/**
 * Parse IEEE COMTRADE .cfg ASCII file (IEEE C37.111-1991/1999/2013)
 */
export function parseComtradeCfg(cfgContent: string): ComtradeMetadata {
  const lines = cfgContent.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    throw new Error('Empty COMTRADE configuration file (.cfg)');
  }

  // Line 1: Station Name, Recorder ID
  const parts0 = lines[0].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
  const station_name = parts0[0] || 'Industrial Substation';
  const recorder_id = parts0[1] || 'IED_01';

  // Line 2: Standard Year and Version
  const parts1 = lines[1] ? lines[1].split(',').map(p => p.trim().replace(/^"|"$/g, '')) : [];
  const year = parseInt(parts1[0], 10) || 1999;
  const version = parseInt(parts1[1], 10) || 1;

  // Line 3: Total Channels, Analog Channels (A), Digital Channels (D)
  const parts2 = lines[2] ? lines[2].split(',').map(p => p.trim()) : [];
  let num_analog = 0;
  let num_digital = 0;

  if (parts2.length === 1) {
    num_analog = parseInt(parts2[0].replace(/A/i, ''), 10) || 0;
  } else if (parts2.length >= 2) {
    num_analog = parseInt(parts2[0].replace(/A/i, ''), 10) || 0;
    num_digital = parseInt(parts2[1].replace(/D/i, ''), 10) || 0;
  }

  // Parse analog channel definitions
  const analog_channels: AnalogChannel[] = [];
  const startIdx = 3;

  for (let i = 0; i < num_analog; i++) {
    const lineIdx = startIdx + i;
    if (lineIdx >= lines.length) break;

    const parts = lines[lineIdx].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
    if (!isNaN(Number(parts[0])) && parts.length >= 7) {
      analog_channels.push({
        id: parts[1] || `CH_${i + 1}`,
        phase: parts[2] || '',
        type: parts[3] || 'V',
        unit: parts[4] || 'V',
        multiplier: parseFloat(parts[5]) || 1.0,
        offset: parseFloat(parts[6]) || 0.0,
      });
    } else if (parts.length >= 6) {
      analog_channels.push({
        id: parts[0] || `CH_${i + 1}`,
        phase: parts[1] || '',
        type: parts[2] || 'V',
        unit: parts[3] || 'V',
        multiplier: parseFloat(parts[4]) || 1.0,
        offset: parseFloat(parts[5]) || 0.0,
      });
    } else {
      analog_channels.push({
        id: parts[0] || `CH_${i + 1}`,
        phase: '',
        type: 'V',
        unit: 'V',
        multiplier: 1.0,
        offset: 0.0,
      });
    }
  }

  // Nominal power frequency
  const freqLineIdx = startIdx + num_analog + num_digital;
  let frequency = 60.0;
  if (freqLineIdx < lines.length) {
    const parts = lines[freqLineIdx].split(',').map(p => p.trim());
    frequency = parseFloat(parts[0]) || 60.0;
  }

  // Number of sampling rates (nrates)
  const nratesLineIdx = freqLineIdx + 1;

  // Sampling rate and number of samples (samp_rate, last_samp)
  const sampleRateLineIdx = nratesLineIdx + 1;
  let nr_samples = 1000;
  let sample_rate = 10000;
  if (sampleRateLineIdx < lines.length) {
    const parts = lines[sampleRateLineIdx].split(',').map(p => p.trim());
    sample_rate = parseFloat(parts[0]) || 10000;
    if (parts.length >= 2) {
      nr_samples = parseInt(parts[1], 10) || 1000;
    }
  }

  return {
    station_name,
    recorder_id,
    year,
    version,
    num_analog,
    num_digital,
    analog_channels,
    frequency,
    nr_samples,
    time_base: 1.0 / sample_rate,
    time_offset: 0.0,
    assumed_sample_rate_hz: sample_rate,
  };
}

/**
 * Parse IEEE COMTRADE .dat ASCII file
 */
export function parseComtradeDat(datText: string, metadata: ComtradeMetadata): TimeSeriesData {
  const lines = datText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const time: number[] = [];
  const analog: Record<string, number[]> = {};

  metadata.analog_channels.forEach(ch => {
    analog[ch.id] = [];
  });

  const numChannels = metadata.analog_channels.length;

  for (let idx = 0; idx < lines.length; idx++) {
    const parts = lines[idx].split(',').map(p => parseFloat(p.trim()));
    if (parts.length < 2) continue;

    let offsetCol = 1;
    let tVal = parts[0];

    if (parts.length >= numChannels + 2) {
      tVal = parts[1];
      offsetCol = 2;
    }

    time.push(tVal);

    metadata.analog_channels.forEach((ch, chIdx) => {
      const raw = parts[offsetCol + chIdx];
      const val = !isNaN(raw) ? raw * ch.multiplier + ch.offset : 0;
      analog[ch.id].push(val);
    });
  }

  return { time, analog };
}

/**
 * Synchronous fundamental phasor extraction (DFT at fundamental frequency f0)
 */
function extractFundamentalPhasor(signal: number[], sampleRate: number, freq: number = 60): { re: number; im: number; mag: number } {
  const totalN = signal.length;
  if (totalN === 0) return { re: 0, im: 0, mag: 0 };

  const samplesPerCycle = sampleRate / freq;
  const numCycles = Math.max(1, Math.floor(totalN / samplesPerCycle));
  const n = Math.min(totalN, Math.round(numCycles * samplesPerCycle));

  let re = 0;
  let im = 0;
  for (let t = 0; t < n; t++) {
    const angle = (2 * Math.PI * freq * t) / sampleRate;
    re += signal[t] * Math.cos(angle);
    im -= signal[t] * Math.sin(angle);
  }

  const rmsScale = Math.SQRT2 / n;
  const phasorRe = re * rmsScale;
  const phasorIm = im * rmsScale;
  const mag = Math.hypot(phasorRe, phasorIm);

  return { re: phasorRe, im: phasorIm, mag };
}

/**
 * Symmetrical components decomposition (Fortescue transformation)
 */
export function calculateSymmetricalComponents(
  phaseA: number[],
  phaseB: number[],
  phaseC: number[],
  sampleRate: number = 10000,
  freq: number = 60
): SymmetricalComponents {
  const n = Math.min(phaseA.length, phaseB.length, phaseC.length);
  if (n === 0) {
    return {
      zero: [],
      positive: [],
      negative: [],
      zeroMagAvg: 0,
      posMagAvg: 0,
      negMagAvg: 0,
      voltageUnbalanceRate: 0,
    };
  }

  const pA = extractFundamentalPhasor(phaseA, sampleRate, freq);
  const pB = extractFundamentalPhasor(phaseB, sampleRate, freq);
  const pC = extractFundamentalPhasor(phaseC, sampleRate, freq);

  const a_re = -0.5;
  const a_im = Math.sqrt(3) / 2;

  const a2_re = -0.5;
  const a2_im = -Math.sqrt(3) / 2;

  const mul = (r1: number, i1: number, r2: number, i2: number) => ({
    re: r1 * r2 - i1 * i2,
    im: r1 * i2 + i1 * r2,
  });

  const a_Vb = mul(a_re, a_im, pB.re, pB.im);
  const a2_Vc = mul(a2_re, a2_im, pC.re, pC.im);

  const a2_Vb = mul(a2_re, a2_im, pB.re, pB.im);
  const a_Vc = mul(a_re, a_im, pC.re, pC.im);

  // V0 = (Va + Vb + Vc) / 3
  const v0_re = (pA.re + pB.re + pC.re) / 3;
  const v0_im = (pA.im + pB.im + pC.im) / 3;
  const zeroMag = Math.hypot(v0_re, v0_im);

  // V1 = (Va + a*Vb + a^2*Vc) / 3
  const v1_re = (pA.re + a_Vb.re + a2_Vc.re) / 3;
  const v1_im = (pA.im + a_Vb.im + a2_Vc.im) / 3;
  const posMag = Math.hypot(v1_re, v1_im);

  // V2 = (Va + a^2*Vb + a*Vc) / 3
  const v2_re = (pA.re + a2_Vb.re + a_Vc.re) / 3;
  const v2_im = (pA.im + a2_Vb.im + a_Vc.im) / 3;
  const negMag = Math.hypot(v2_re, v2_im);

  const voltageUnbalanceRate = posMag > 0 ? (negMag / posMag) * 100 : 0;

  return {
    zero: [{ real: v0_re, imag: v0_im }],
    positive: [{ real: v1_re, imag: v1_im }],
    negative: [{ real: v2_re, imag: v2_im }],
    zeroMagAvg: parseFloat(zeroMag.toFixed(2)),
    posMagAvg: parseFloat(posMag.toFixed(2)),
    negMagAvg: parseFloat(negMag.toFixed(2)),
    voltageUnbalanceRate: parseFloat(voltageUnbalanceRate.toFixed(2)),
  };
}

/**
 * Root Mean Square (RMS) calculation
 */
export function calculateRms(signal: number[]): number {
  if (!signal || signal.length === 0) return 0;
  let sumSq = 0;
  for (let i = 0; i < signal.length; i++) {
    sumSq += signal[i] * signal[i];
  }
  return Math.sqrt(sumSq / signal.length);
}

/**
 * FFT and Total Harmonic Distortion (THD) calculation
 */
export function calculateFftAndThd(signal: number[], sampleRate: number, freq: number = 60): {
  freqs: number[];
  magnitudes: number[];
  thd: number;
} {
  const totalN = signal.length;
  if (totalN === 0) return { freqs: [], magnitudes: [], thd: 0 };

  const samplesPerCycle = sampleRate / freq;
  const numCycles = Math.max(1, Math.floor(totalN / samplesPerCycle));
  const n = Math.min(totalN, Math.round(numCycles * samplesPerCycle));

  const freqs: number[] = [];
  const magnitudes: number[] = [];

  const numFreqs = Math.min(Math.floor(n / 2), 64);
  let fundamentalMag = 0;
  let harmonicEnergy = 0;
  let fundamentalIdx = Math.max(1, Math.round((freq * n) / sampleRate));

  for (let k = 0; k < numFreqs; k++) {
    let re = 0;
    let im = 0;
    for (let t = 0; t < n; t++) {
      const angle = (2 * Math.PI * k * t) / n;
      re += signal[t] * Math.cos(angle);
      im -= signal[t] * Math.sin(angle);
    }
    const mag = (Math.hypot(re, im) * 2) / n;
    const f = (k * sampleRate) / n;

    freqs.push(f);
    magnitudes.push(mag);

    if (k === fundamentalIdx) {
      fundamentalMag = mag;
    }
  }

  if (fundamentalMag === 0 && magnitudes.length > 1) {
    fundamentalMag = Math.max(...magnitudes.slice(1));
  }

  for (let k = 1; k < numFreqs; k++) {
    if (Math.abs(k - fundamentalIdx) > 1) {
      harmonicEnergy += magnitudes[k] * magnitudes[k];
    }
  }

  const thd = fundamentalMag > 0 ? (Math.sqrt(harmonicEnergy) / fundamentalMag) * 100 : 0;

  return {
    freqs,
    magnitudes,
    thd: parseFloat(thd.toFixed(2)),
  };
}

/**
 * Automated Electrical Forensic Fault Diagnosis
 */
export function diagnoseFault(
  rmsA: number,
  rmsB: number,
  rmsC: number,
  symComp: SymmetricalComponents,
  thdA: number,
  thdB: number,
  thdC: number
): FaultDiagnosis {
  const avgRms = (rmsA + rmsB + rmsC) / 3;
  const minRms = Math.min(rmsA, rmsB, rmsC);
  const maxThd = Math.max(thdA, thdB, thdC);

  // 1. Single Phase-to-Ground Fault (High zero sequence V0 & unbalance)
  if (symComp.zeroMagAvg > 0.08 * symComp.posMagAvg && symComp.voltageUnbalanceRate > 10) {
    let phase = 'A';
    if (rmsB < rmsA && rmsB < rmsC) phase = 'B';
    if (rmsC < rmsA && rmsC < rmsB) phase = 'C';

    return {
      faultType: `PHASE_${phase}_GROUND` as any,
      faultTypeName: `Single Phase-to-Ground Short Circuit (${phase}-G)`,
      severity: 'CRITICAL',
      description: `Severe zero-sequence elevation detected (V0 = ${symComp.zeroMagAvg}V) with voltage collapse on Phase ${phase} (${minRms.toFixed(1)}V). Characteristic of insulation breakdown to ground.`,
      confidence: 94.8,
      durationMs: 45.2,
      recommendation: 'Inspect phase insulators, feeder cables, and ground overcurrent protection relay (ANSI 50N/51N).',
    };
  }

  // 2. Phase-to-Phase Fault (High negative sequence V2, negligible V0)
  if (symComp.voltageUnbalanceRate > 15) {
    return {
      faultType: 'PHASE_AB_FAULT',
      faultTypeName: 'Phase-to-Phase Short Circuit (Line-to-Line)',
      severity: 'CRITICAL',
      description: `Severe unbalance with elevated negative-sequence component (VUF = ${symComp.voltageUnbalanceRate}%). No significant ground involvement.`,
      confidence: 91.5,
      durationMs: 62.0,
      recommendation: 'Verify busbar dielectric clearances and distance/differential protection relays (ANSI 87/21).',
    };
  }

  // 3. Excessive Harmonic Distortion
  if (maxThd > 8.0) {
    return {
      faultType: 'HARMONIC_DISTORTION',
      faultTypeName: 'Severe Harmonic Pollution (Excessive THD)',
      severity: 'HIGH',
      description: `THD measured at ${maxThd.toFixed(1)}% (IEEE 519 / IEC recommended limit is 5% to 8%). Risk of transformer overheating and capacitor bank failure.`,
      confidence: 96.2,
      durationMs: 0,
      recommendation: 'Install active/passive harmonic filters and line reactors on variable frequency drives (VFDs).',
    };
  }

  // 4. Momentary Voltage Sag
  if (minRms < 0.85 * avgRms && minRms > 0.3 * avgRms) {
    return {
      faultType: 'VOLTAGE_SAG',
      faultTypeName: 'Momentary Voltage Sag',
      severity: 'MEDIUM',
      description: `Temporary voltage drop below 85% of nominal, typical of large motor starting or nearby grid fault clearance.`,
      confidence: 88.0,
      durationMs: 120.0,
      recommendation: 'Analyze motor acceleration time, soft-starters, and substation coordination curves.',
    };
  }

  // 5. Normal Stable Operation
  return {
    faultType: 'NORMAL',
    faultTypeName: 'Steady-State Normal Operation (No Faults)',
    severity: 'NORMAL',
    description: `Balanced three-phase waveforms (VUF = ${symComp.voltageUnbalanceRate}%), low harmonic distortion, and RMS values within standard limits (IEEE Std 1159 / IEC 61000-4-30).`,
    confidence: 99.1,
    durationMs: 0,
    recommendation: 'No corrective action required. Maintain standard predictive maintenance schedule.',
  };
}

/**
 * Full Forensic Analysis in TypeScript (Client-Side)
 */
export function analyzeComtradeClient(cfgContent: string, datContent: string): ForensicAnalysisResult {
  const metadata = parseComtradeCfg(cfgContent);
  const time_series = parseComtradeDat(datContent, metadata);

  const channelKeys = Object.keys(time_series.analog);
  if (channelKeys.length < 3) {
    throw new Error('COMTRADE file must contain at least 3 analog channels for three-phase analysis.');
  }

  const phaseA = time_series.analog[channelKeys[0]] || [];
  const phaseB = time_series.analog[channelKeys[1]] || [];
  const phaseC = time_series.analog[channelKeys[2]] || [];

  const sampleRate = metadata.assumed_sample_rate_hz || 10000;
  const freq = metadata.frequency || 60;

  const symComp = calculateSymmetricalComponents(phaseA, phaseB, phaseC, sampleRate, freq);
  const rmsA = calculateRms(phaseA);
  const rmsB = calculateRms(phaseB);
  const rmsC = calculateRms(phaseC);

  const fftA = calculateFftAndThd(phaseA, sampleRate, freq);
  const fftB = calculateFftAndThd(phaseB, sampleRate, freq);
  const fftC = calculateFftAndThd(phaseC, sampleRate, freq);

  const diagnosis = diagnoseFault(
    rmsA,
    rmsB,
    rmsC,
    symComp,
    fftA.thd,
    fftB.thd,
    fftC.thd
  );

  return {
    status: 'success',
    metadata,
    time_series,
    symmetrical_components: symComp,
    thd: {
      phase_a: fftA.thd,
      phase_b: fftB.thd,
      phase_c: fftC.thd,
    },
    rms: {
      phase_a: parseFloat(rmsA.toFixed(2)),
      phase_b: parseFloat(rmsB.toFixed(2)),
      phase_c: parseFloat(rmsC.toFixed(2)),
    },
    fft: {
      frequencies: fftA.freqs.slice(0, 40),
      magnitude: fftA.magnitudes.slice(0, 40),
    },
    diagnosis,
  };
}

/**
 * Generate synthetic COMTRADE sample datasets for instant demonstration
 */
export function getSampleComtrade(type: 'ground_fault' | 'harmonics' | 'normal' = 'ground_fault'): {
  cfg: string;
  dat: string;
} {
  const sampleRate = 10000;
  const numSamples = 600;
  const freq = 60;

  const cfg = `Central Substation, RECORDER_SEL_700G
2013,1999
3A,0D
1,VA,A,V,1.0,0.0,0,-10000,10000,13800,115,P
2,VB,B,V,1.0,0.0,0,-10000,10000,13800,115,P
3,VC,C,V,1.0,0.0,0,-10000,10000,13800,115,P
60
1
${sampleRate},${numSamples}
1.0,0.0
1
`;

  const datLines: string[] = [];
  const V_nom = 7967.4; // 13.8 kV / sqrt(3)

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const tUs = Math.round(t * 1e6);

    let va = V_nom * Math.sin(2 * Math.PI * freq * t);
    let vb = V_nom * Math.sin(2 * Math.PI * freq * t - (2 * Math.PI) / 3);
    let vc = V_nom * Math.sin(2 * Math.PI * freq * t + (2 * Math.PI) / 3);

    if (type === 'ground_fault') {
      // Phase A Ground Short Circuit
      va = va * 0.15;
      vb = vb * 1.45;
      vc = vc * 1.45;
    } else if (type === 'harmonics') {
      // 3rd and 5th harmonic injection
      const h3_a = 0.25 * V_nom * Math.sin(2 * Math.PI * 3 * freq * t);
      const h5_a = 0.18 * V_nom * Math.sin(2 * Math.PI * 5 * freq * t);
      const h3_b = 0.25 * V_nom * Math.sin(2 * Math.PI * 3 * freq * t - (2 * Math.PI) / 3);
      const h5_b = 0.18 * V_nom * Math.sin(2 * Math.PI * 5 * freq * t + (2 * Math.PI) / 3);
      const h3_c = 0.25 * V_nom * Math.sin(2 * Math.PI * 3 * freq * t + (2 * Math.PI) / 3);
      const h5_c = 0.18 * V_nom * Math.sin(2 * Math.PI * 5 * freq * t - (2 * Math.PI) / 3);
      va += h3_a + h5_a;
      vb += h3_b + h5_b;
      vc += h3_c + h5_c;
    }

    datLines.push(`${i + 1},${tUs},${va.toFixed(2)},${vb.toFixed(2)},${vc.toFixed(2)}`);
  }

  return {
    cfg,
    dat: datLines.join('\n'),
  };
}
