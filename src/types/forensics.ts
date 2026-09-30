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

// ==========================================
// Normative Checklist & Audit Types
// ==========================================

export type NormativeStandard = 'NBR_5419' | 'NBR_5410' | 'NBR_16690' | 'NBR_17193' | 'NT_44_2025' | 'CBMERJ';
export type ComplianceStatus = 'CONFORMING' | 'NON_CONFORMING' | 'NOT_APPLICABLE' | 'NOT_INSPECTED';

export interface NormativeChecklistItem {
  id: string;
  standard: NormativeStandard;
  clause: string;
  title: string;
  description: string;
  status: ComplianceStatus;
  isCritical: boolean;
  notes?: string;
  recommendation?: string;
}

export interface NormativeSection {
  id: string;
  title: string;
  standard: NormativeStandard;
  items: NormativeChecklistItem[];
}

export interface NormativeAuditState {
  sections: NormativeSection[];
  totalItems: number;
  conformingCount: number;
  nonConformingCount: number;
  criticalNonConformities: number;
  complianceScore: number; // 0 to 100%
  lastUpdated: string;
}

// ==========================================
// Electrical Fire Investigation & STJ Causal Nexus
// ==========================================

export type CopperMeltType = 
  | 'PRIMARY_ARC_BEAD'       // Fusão por arco primário (início do sinistro, cratera interna, óxido restrito)
  | 'SECONDARY_FIRE_MELTING' // Fusão secundária difusa (efeito térmico do fogo externo)
  | 'NO_MELTING'             // Condutores íntegros
  | 'NOT_ANALYZED';

export type MaintenanceInterval = 
  | 'UP_TO_DATE'             // < 6 meses com laudos e ART
  | 'OVERDUE_6_TO_12_MONTHS' // 6 a 12 meses
  | 'OVERDUE_OVER_12_MONTHS' // > 12 meses sem manutenção
  | 'NEVER_PERFORMED';       // Nunca realizada / sem histórico

export interface FireEvidenceInput {
  buildingType: string;
  installationAgeYears: number;
  copperMelt: CopperMeltType;
  hasThermographyReport: boolean;
  thermographyOverdueMonths: number;
  maintenanceInterval: MaintenanceInterval;
  hasSpdaInstalled: boolean;
  hasDpsInstalled: boolean;
  dpsDefectiveOrBurnt: boolean;
  circuitBreakerTripped: boolean;
  tamperedProtection: boolean; // Disjuntor superdimensionado ou jumpeado
  combustiblesNearPanels: boolean;
  eyewitnessFlickerOrSparks: boolean;
}

export interface FireCausalNexusResult {
  primaryElectricalCauseProb: number; // 0 to 100%
  negligenceProbability: number;      // 0 to 100%
  causalNexusClassification: 
    | 'DEFINITIVE_ELECTRICAL_FAILURE' 
    | 'PROBABLE_ELECTRICAL_FAILURE' 
    | 'UNDETERMINED_SECONDARY_HEAT' 
    | 'INCONCLUSIVE';
  technicalSummary: string;
  metallurgicalAnalysis: string;
  maintenanceAssessment: string;
  stjJurisprudenceEnforcement: {
    appliesNoFortuitousCase: boolean;
    citation: string;
    civilCodeArticle: string;
    liabilityNotice: string;
  };
  urgentCorrectiveActions: string[];
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
  normative_audit?: NormativeAuditState;
  fire_investigation?: FireCausalNexusResult;
  status: 'success' | 'error';
  message?: string;
}

