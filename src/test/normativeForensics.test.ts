import { describe, it, expect } from 'vitest';
import {
  getDefaultNormativeSections,
  computeNormativeAuditScore,
  getDefaultFireEvidence,
  inferFireCausalNexus,
} from '../utils/normativeForensics';
import { ComplianceStatus } from '../types/forensics';

describe('Normative Forensics & STJ Causal Nexus — Test Suite', () => {
  it('should initialize default normative sections covering NBR 5419, NBR 5410, NBR 16690, NBR 17193, and STJ', () => {
    const sections = getDefaultNormativeSections();

    expect(sections.length).toBe(5);
    expect(sections[0].id).toBe('spda_cbmerj');
    expect(sections[0].standard).toBe('NBR_5419');
    expect(sections[1].id).toBe('nbr5410_bt');
    expect(sections[1].standard).toBe('NBR_5410');
    expect(sections[2].id).toBe('nbr16690_solar');
    expect(sections[2].standard).toBe('NBR_16690');
    expect(sections[3].id).toBe('nbr17193_fire_safety');
    expect(sections[3].standard).toBe('NBR_16690');
    expect(sections[4].id).toBe('stj_jurisprudencia');
    expect(sections[4].standard).toBe('CBMERJ');

    // Total default items count
    const totalItems = sections.reduce((acc, sec) => acc + sec.items.length, 0);
    expect(totalItems).toBeGreaterThanOrEqual(20);
  });

  it('should calculate compliance score and critical non-conformities accurately', () => {
    const sections = getDefaultNormativeSections();
    const audit = computeNormativeAuditScore(sections);

    expect(audit.totalItems).toBeGreaterThan(0);
    expect(audit.conformingCount).toBeGreaterThan(0);
    expect(audit.nonConformingCount).toBeGreaterThan(0);
    expect(audit.criticalNonConformities).toBeGreaterThanOrEqual(3);
    expect(audit.complianceScore).toBeGreaterThan(30);
    expect(audit.complianceScore).toBeLessThan(100);
  });

  it('should reach 100% compliance when all items are conforming', () => {
    const sections = getDefaultNormativeSections().map(sec => ({
      ...sec,
      items: sec.items.map(item => ({ ...item, status: 'CONFORMING' as ComplianceStatus })),
    }));

    const audit = computeNormativeAuditScore(sections);
    expect(audit.complianceScore).toBe(100);
    expect(audit.criticalNonConformities).toBe(0);
    expect(audit.nonConformingCount).toBe(0);
  });

  it('should infer definitive electrical failure and apply STJ jurisprudence for primary arc bead with overdue maintenance', () => {
    const evidence = getDefaultFireEvidence();
    evidence.copperMelt = 'PRIMARY_ARC_BEAD';
    evidence.maintenanceInterval = 'OVERDUE_OVER_12_MONTHS';
    evidence.hasThermographyReport = false;
    evidence.hasDpsInstalled = false;

    const result = inferFireCausalNexus(evidence);

    expect(result.primaryElectricalCauseProb).toBeGreaterThanOrEqual(75);
    expect(result.negligenceProbability).toBeGreaterThanOrEqual(60);
    expect(result.causalNexusClassification).toBe('DEFINITIVE_ELECTRICAL_FAILURE');
    expect(result.stjJurisprudenceEnforcement.appliesNoFortuitousCase).toBe(true);
    expect(result.stjJurisprudenceEnforcement.citation).toContain('Superior Tribunal de Justiça (STJ)');
    expect(result.stjJurisprudenceEnforcement.civilCodeArticle).toContain('Art. 1.348');
    expect(result.metallurgicalAnalysis).toContain('Primary Arc Bead');
    expect(result.urgentCorrectiveActions.length).toBeGreaterThan(0);
  });

  it('should classify secondary fire melting as external heat without negligence when maintenance is up to date', () => {
    const evidence = getDefaultFireEvidence();
    evidence.copperMelt = 'SECONDARY_FIRE_MELTING';
    evidence.maintenanceInterval = 'UP_TO_DATE';
    evidence.hasThermographyReport = true;
    evidence.hasDpsInstalled = true;
    evidence.tamperedProtection = false;
    evidence.eyewitnessFlickerOrSparks = false;
    evidence.combustiblesNearPanels = false;

    const result = inferFireCausalNexus(evidence);

    expect(result.primaryElectricalCauseProb).toBeLessThan(30);
    expect(result.causalNexusClassification).toBe('UNDETERMINED_SECONDARY_HEAT');
    expect(result.stjJurisprudenceEnforcement.appliesNoFortuitousCase).toBe(false);
    expect(result.metallurgicalAnalysis).toContain('Secondary Fire Melting');
  });
});
