export interface AnalogChannel {
  id: string;
  phase: string;
  type: string;
  unit: string;
  multiplier: number;
  offset: number;
}

export interface ComtradeMetadata {
  station_name: string;
  recorder_id: string;
  year: number;
  version: number;
  num_analog: number;
  num_digital: number;
  analog_channels: AnalogChannel[];
  frequency: number;
  nr_samples: number;
  time_base: number;
  time_offset: number;
  assumed_sample_rate_hz?: number;
}

export interface TimeSeriesData {
  time: number[];
  analog: Record<string, number[]>;
}

export interface ComplexNumber {
  real: number;
  imag: number;
}

export interface SymmetricalComponents {
  zero: ComplexNumber[];
  positive: ComplexNumber[];
  negative: ComplexNumber[];
  zeroMagAvg: number;
  posMagAvg: number;
  negMagAvg: number;
  voltageUnbalanceRate: number; // IEC %
}

export interface HarmonicItem {
  order: number;
  frequencyHz: number;
  magnitude: number;
  percentOfFundamental: number;
}

export interface PhaseAnalysis {
  thd: number;
  rms: number;
  peak: number;
  crestFactor: number;
  harmonics: HarmonicItem[];
}

export type FaultType = 
  | 'NORMAL'
  | 'PHASE_A_GROUND'
  | 'PHASE_B_GROUND'
  | 'PHASE_C_GROUND'
  | 'PHASE_AB_FAULT'
  | 'PHASE_BC_FAULT'
  | 'PHASE_CA_FAULT'
  | 'THREE_PHASE_FAULT'
  | 'VOLTAGE_SAG'
  | 'VOLTAGE_SWELL'
  | 'HARMONIC_DISTORTION';

export interface FaultDiagnosis {
  faultType: FaultType;
  faultTypeName: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NORMAL';
  description: string;
  confidence: number;
  durationMs: number;
  peakCurrentAmp?: number;
  voltageSagPercent?: number;
  recommendation: string;
}

export interface ForensicAnalysisResult {
  metadata: ComtradeMetadata;
  time_series: TimeSeriesData;
  symmetrical_components: SymmetricalComponents;
  thd: {
    phase_a: number;
    phase_b: number;
    phase_c: number;
  };
  rms: {
    phase_a: number;
    phase_b: number;
    phase_c: number;
  };
  fft?: {
    frequencies: number[];
    magnitude: number[];
  };
  phase_analysis?: {
    phase_a: PhaseAnalysis;
    phase_b: PhaseAnalysis;
    phase_c: PhaseAnalysis;
  };
  diagnosis: FaultDiagnosis;
  status: 'success' | 'error';
  message?: string;
}
