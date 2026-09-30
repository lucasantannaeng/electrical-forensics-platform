import {
  NormativeSection,
  NormativeAuditState,
  FireEvidenceInput,
  FireCausalNexusResult,
  NormativeChecklistItem,
} from '@/types/forensics';

/**
 * Default engineering checklist template based on NBR 5419:2026, NBR 17193:2025,
 * NBR 16690 (Revisão 2026), NT 44/2025 (CBMGO), NBR 5410 (Revisão 2026) and CBMERJ ITs.
 *
 * Last updated: 2026-09-29 — incorporates NBR 5419:2026 (published 2026-03-10,
 * transition deadline 2026-10), NBR 17193:2025 (fire safety for PV), NT 44/2025
 * (CBMGO PV safety), NBR 16690 revision proposals (AFDD/AFPE), NBR 5410 revision
 * proposals (AFDD residential), and STJ AREsp 3.001.677 (Nov 2025).
 */
export function getDefaultNormativeSections(): NormativeSection[] {
  return [
    {
      id: 'spda_cbmerj',
      title: 'SPDA, Aterramento & Equipotencialização (NBR 5419 & CBMERJ)',
      standard: 'NBR_5419',
      items: [
        {
          id: 'spda_01',
          standard: 'NBR_5419',
          clause: 'NBR 5419-2:2026 — Análise de Risco (R1 a R4)',
          title: 'Análise de Gerenciamento de Risco (R1 a R4)',
          description: 'Cálculo de risco para determinação da obrigatoriedade e nível de proteção (Classe I, II, III ou IV) devidamente registrado.',
          status: 'CONFORMING',
          isCritical: true,
          recommendation: 'Elaborar memória de cálculo de risco conforme NBR 5419-2:2026 se houver alteração na ocupação predial.',
        },
        {
          id: 'spda_02',
          standard: 'NBR_5419',
          clause: 'NBR 5419-3:2026 — Subsistema de Captação e Descidas',
          title: 'Subsistema de Captação e Descidas',
          description: 'Condutores captores, hastes e descidas com espaçamento normativo, fixação mecânica e anéis de cintamento a cada 20m de altura.',
          status: 'CONFORMING',
          isCritical: true,
          recommendation: 'Inspecionar fixações mecânicas e verificar corrosão galvânica nas conexões de cobertura. Verificar seção mínima de 35mm² para aço cobreado.',
        },
        {
          id: 'spda_03',
          standard: 'NBR_5419',
          clause: 'NBR 5419-3:2026 — Seção 5.3.5',
          title: 'Ensaio de Continuidade Elétrica das Armaduras de Concreto',
          description: 'Medição ôhmica com corrente de ensaio de 1A a 10A, comprovando resistência máxima inferior a 0,2 Ω entre topo e solo.',
          status: 'CONFORMING',
          isCritical: true,
          recommendation: 'Realizar teste miliohmímetro de 4 pontas com certificado de calibração RBC vigente. Verificar condutores de aço cobreado ≥ 50mm² na malha de aterramento.',
        },
        {
          id: 'spda_04',
          standard: 'NBR_5419',
          clause: 'NBR 5419-4:2026 / CBMERJ',
          title: 'Dispositivos de Proteção contra Surtos (DPS Classe I e II)',
          description: 'Instalação obrigatória de DPS Classe I (onda 10/350 µs, mín. 12,5 kA) no QGBT e Classe II nos quadros de distribuição parciais.',
          status: 'NON_CONFORMING',
          isCritical: true,
          notes: 'Identificado DPS com cartucho desarmado ou ausência de proteção Classe I no painel de entrada de energia.',
          recommendation: 'Substituição imediata dos módulos DPS rompidos e instalação de coordenação Classe I + II conforme NBR 5419-4:2026.',
        },
        {
          id: 'spda_05',
          standard: 'CBMERJ',
          clause: 'NBR 5419-3:2026 / NBR 5419-1:2026 / CBMERJ IT-13',
          title: 'Barramento de Equipotencialização Principal (BEP)',
          description: 'Interligação de massas metálicas externas, tubulações de gás/água, condutor PE e malha de aterramento ao BEP.',
          status: 'CONFORMING',
          isCritical: false,
          recommendation: 'Reapertar barramento de cobre com torquímetro calibrado para evitar centelhamento perigoso.',
        },
        {
          id: 'spda_06',
          standard: 'CBMERJ',
          clause: 'CBMERJ IT-13 / ABNT NBR 5419-2:2026',
          title: 'Laudo Técnico de SPDA com ART de Engenharia Elétrica',
          description: 'Relatório técnico circunstanciado emitido por Engenheiro Eletricista com ART quitada e validade máxima de 12 meses.',
          status: 'NON_CONFORMING',
          isCritical: true,
          notes: 'Laudo anterior com vencimento há mais de 14 meses. Classificação de SPDA (I-IV) obsoleta — deve referenciar NBR 5419-2:2026 (Níveis de Proteção NP).',
          recommendation: 'Emitir novo Laudo Conclusivo referenciando NBR 5419:2026 e recolher ART de fiscalização periódica perante o CREA-RJ.',
        },
        {
          id: 'spda_07',
          standard: 'NBR_5419',
          clause: 'NBR 5419-3:2026 — Condutores de Aço Cobreado',
          title: 'Conformidade de Seção de Condutores de Aço Cobreado (35/50 mm²)',
          description: 'Verificação da seção mínima exigida para condutores de aço cobreado: 35mm² para captação e descidas, 50mm² para malha de aterramento, conforme NBR 5419:2026.',
          status: 'CONFORMING',
          isCritical: true,
          recommendation: 'Medir a bitola dos condutores de aço cobreado e atestar conformidade com as seções mínimas estabelecidas na edição 2026. Rejeitar cabos de aço cobreado abaixo de 35mm² nas descidas.',
        },
        {
          id: 'spda_08',
          standard: 'CBMERJ',
          title: 'Inspeção Periódica de SPDA (NBR 5419-4:2026)',
          description: 'Inspeção visual e ensaio de continuidade elétrica a cada 12 meses, com relatório assinado por engenheiro habilitado.',
          status: 'CONFORMING',
          isCritical: false,
          recommendation: 'Verificar histórico de inspeções periódicas do SPDA e exigir relatório com ensaios de continuidade e resistência de aterramento.',
          clause: 'NBR 5419-4:2026 — Manutenção e Inspeção',
        },
      ],
    },
    {
      id: 'nbr5410_bt',
      title: 'Instalações Elétricas de Baixa Tensão (NBR 5410 & Manutenção)',
      standard: 'NBR_5410',
      items: [
        {
          id: 'bt_01',
          standard: 'NBR_5410',
          clause: 'NBR 5410:2004 — Tabela 36 a 40 (aguardando Revisão 2026)',
          title: 'Capacidade de Condução de Corrente e Agrupamento',
          description: 'Dimensionamento adequado dos condutores elétricos considerando fatores de agrupamento e temperatura sem sobrecarga térmica.',
          status: 'CONFORMING',
          isCritical: true,
          recommendation: 'Monitorar ampacidade dos condutores de alimentação dos chillers e bombas de incêndio.',
        },
        {
          id: 'bt_02',
          standard: 'NBR_5410',
          clause: 'NBR 5410:2004 — Seção 5.1.3.2 (Proposta 2ª CP 2025: AFDD em residências)',
          title: 'Dispositivos DR (Diferencial-Residual 30 mA)',
          description: 'Instalação de DR de alta sensibilidade para proteção contra choques e fuga de corrente em circuitos de áreas molhadas e tomadas.',
          status: 'CONFORMING',
          isCritical: true,
          recommendation: 'Efetuar teste mecânico mensal pelo botão T de teste do dispositivo DR.',
        },
        {
          id: 'bt_03',
          standard: 'NBR_5410',
          clause: 'NBR 5410:2004 / NBR 15575 (Proposta 2ª CP 2025: inspeção AFDD)',
          title: 'Inspeção Termográfica Infravermelha nos Quadros',
          description: 'Auditoria termográfica semestral ou anual com câmera calibrada, registrando gradientes térmicos (ΔT > 15°C) em conexões elétricas.',
          status: 'NON_CONFORMING',
          isCritical: true,
          notes: 'Não há evidência de relatório termográfico nos últimos 18 meses. Pontos de oxidação observados nos terminais dos disjuntores gerais.',
          recommendation: 'Executar varredura termográfica sob carga máxima operacional e emitir laudo de pontos quentes.',
        },
        {
          id: 'bt_04',
          standard: 'NBR_5410',
          clause: 'NBR 5410:2004 — Seção 6.2.11',
          title: 'Integridade de Barramentos e Ausência de Materiais Combustíveis',
          description: 'Quadros elétricos desobstruídos, vedados contra poeira/água (IP adequado) e sem materiais inflamáveis na subestação/sala elétrica.',
          status: 'CONFORMING',
          isCritical: false,
          recommendation: 'Manter perímetro de 1 metro livre de qualquer material combustível ao redor de todos os painéis.',
        },
      ],
    },
    {
      id: 'nbr16690_solar',
      title: 'Arranjos Fotovoltaicos (NBR 16690: Quatro Situações Gerais)',
      standard: 'NBR_16690',
      items: [
        {
          id: 'pv_01',
          standard: 'NBR_16690',
          clause: 'NBR 16690: Seção 6.3.5',
          title: 'Enquadramento da Situação de Aterramento do Arranjo FV',
          description: 'Classificação estrita em uma das 4 situações gerais da norma: polaridade aterrada funcionalmente ou arranjo isolado de terra.',
          status: 'CONFORMING',
          isCritical: true,
          recommendation: 'Documentar a situação de aterramento (Situação 1 a 4) no esquema unifilar executivo do sistema fotovoltaico.',
        },
        {
          id: 'pv_02',
          standard: 'NBR_16690',
          clause: 'NBR 16690: Seção 7.3.2',
          title: 'Aterramento e Equipotencialização das Estruturas e Módulos Metálicos',
          description: 'Interligação contínua de todas as molduras metálicas dos módulos de alumínio e trilhos ao condutor de equipotencialização.',
          status: 'CONFORMING',
          isCritical: true,
          recommendation: 'Garantir uso de arruelas de pressão denteadas (bonding clips) que rompem a camada de anodização do alumínio.',
        },
        {
          id: 'pv_03',
          standard: 'NBR_16690',
          clause: 'NBR 16690:2019 — Seção 8.2 / NBR 5419:2026',
          title: 'Proteção contra Surtos CC e Afastamento do SPDA',
          description: 'DPS CC tipo 2 (Ucpv >= 1.2 x Voc) instalado nas String Boxes e respeito à distância de segurança (s) em relação aos captores do SPDA.',
          status: 'CONFORMING',
          isCritical: true,
          recommendation: 'Se a distância de segurança (s) não for atendida fisicamente, realizar a equipotencialização direta com condutor de cobre de 16mm². Validar DPS contra NBR IEC 61643-32:2022.',
        },
        {
          id: 'pv_04',
          standard: 'NBR_16690',
          clause: 'NBR 16690: Seção 7.3 / Revisão em andamento 2026',
          title: 'Proteção contra Falhas de Arco Elétrico em Série (AFDD/AFPE)',
          description: 'Obrigatoriedade de equipamento de detecção e proteção contra faltas de arco (AFDD/AFPE) em arranjos fotovoltaicos, conforme proposta de revisão da NBR 16690 para 2026 e exigência da NT 44/2025 do CBMGO para sistemas Tipo 1.',
          status: 'CONFORMING',
          isCritical: true,
          recommendation: 'Verificar presença de AFPE/AFCI nos inversores/string boxes. Conferir logs de detecção de arco e validar tempo de resposta < 300ms.',
        },
        {
          id: 'pv_05',
          standard: 'NT_44_2025',
          clause: 'NT 44/2025 (CBMGO) — Item 5.1 (Sistemas Tipo 1)',
          title: 'Desligamento Rápido (RSD) e Proteção GFCI em SFV Tipo 1',
          description: 'Implementação de Rapid Shutdown (RSD), AFPE e GFCI para sistemas fotovoltaicos do Tipo 1 (sem tensão de segurança em desenergização).',
          status: 'CONFORMING',
          isCritical: true,
          recommendation: 'Testar funcionalidade do Rapid Shutdown, verificar certificação dos otimizadores de módulo e confirmar integração do GFCI com proteção de aterramento.',
        },
      ],
    },
    {
      id: 'nbr17193_fire_safety',
      title: 'Segurança Contra Incêndio em Sistemas Fotovoltaicos (NBR 17193:2025 & NT 44/2025 CBMGO)',
      standard: 'NBR_16690',
      items: [
        {
          id: 'fire_01',
          standard: 'NBR_17193',
          clause: 'NBR 17193:2025 — Cláusula 5.1',
          title: 'Acondicionamento e Roteamento de Cabos CC',
          description: 'Verificação do distanciamento e isolamento térmico das rotas de cabos de corrente contínua em SFV com tensão até 1500V DC, mitigando propagação de incêndio.',
          status: 'CONFORMING',
          isCritical: true,
          recommendation: 'Inspecionar eletrodutos, bandejas e distanciamento de materiais combustíveis ao longo de toda a rota de cabeamento CC.',
        },
        {
          id: 'fire_02',
          standard: 'NBR_17193',
          clause: 'NBR 17193:2025 — Cláusula 6.2',
          title: 'Compartimentação e Instalação de Inversores',
          description: 'Avaliação de limites de compartimentação, uso de materiais incombustíveis e distanciamento entre inversor fotovoltaico e elementos estruturais combustíveis.',
          status: 'CONFORMING',
          isCritical: true,
          recommendation: 'Verificar distâncias de instalação do inversor para paredes/teto e conferir classificação de propagação de chamas do revestimento.',
        },
        {
          id: 'fire_03',
          standard: 'NT_44_2025',
          clause: 'NT 44/2025 (CBMGO) — Item 6.6',
          title: 'Prazo de Adequação de Sistemas PV Existentes',
          description: 'Edificações com SFV instalado antes desta NT têm prazo até 14/11/2026 (3 anos) ou até a primeira troca dos inversores, o que ocorrer primeiro.',
          status: 'CONFORMING',
          isCritical: false,
          recommendation: 'Verificar data de instalação do sistema fotovoltaico e confirmar se a adequação ao Item 5.2 da NT 44/2025 foi realizada dentro do prazo.',
        },
      ],
    },
    {
      id: 'stj_jurisprudencia',
      title: 'Jurisprudência STJ — Nexo Causal e Responsabilidade Civil (AREsp 3.001.677)',
      standard: 'CBMERJ',
      items: [
        {
          id: 'jur_01',
          standard: 'CBMERJ',
          clause: 'STJ AREsp 3.001.677 / Nov 2025',
          title: 'Omissão de Manutenção Preventiva e Ausência de SPDA/DPS',
          description: 'Incêndio originado por curto-circuito elétrico com projeção de partículas incandescentes sobre armazenamento de sólidos combustíveis. A ausência de sprinklers somada à manutenção precária de disjuntores e ausência de SPDA/DPS adequados configura negligência, afastando a excludente de caso fortuito.',
          status: 'CONFORMING',
          isCritical: true,
          recommendation: 'Coletar evidências de manutenção precária dos disjuntores e verificar a carga combustível armazenada, visando afastar a hipótese de caso fortuito com base no precedente do STJ.',
        },
      ],
    },
  ];
}

/**
 * Compute the normative compliance audit state from sections
 */
export function computeNormativeAuditScore(sections: NormativeSection[]): NormativeAuditState {
  let totalItems = 0;
  let conformingCount = 0;
  let nonConformingCount = 0;
  let criticalNonConformities = 0;
  let weightedEarned = 0;
  let weightedTotal = 0;

  sections.forEach(sec => {
    sec.items.forEach(item => {
      if (item.status === 'NOT_APPLICABLE') return;
      totalItems++;

      const weight = item.isCritical ? 3 : 1;
      weightedTotal += weight;

      if (item.status === 'CONFORMING') {
        conformingCount++;
        weightedEarned += weight;
      } else if (item.status === 'NON_CONFORMING') {
        nonConformingCount++;
        if (item.isCritical) {
          criticalNonConformities++;
        }
      }
    });
  });

  const complianceScore = weightedTotal > 0 ? parseFloat(((weightedEarned / weightedTotal) * 100).toFixed(1)) : 100;

  return {
    sections,
    totalItems,
    conformingCount,
    nonConformingCount,
    criticalNonConformities,
    complianceScore,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Default initial evidence for fire causal nexus investigation
 */
export function getDefaultFireEvidence(): FireEvidenceInput {
  return {
    buildingType: 'Condomínio Residencial Multifamiliar',
    installationAgeYears: 18,
    copperMelt: 'PRIMARY_ARC_BEAD',
    hasThermographyReport: false,
    thermographyOverdueMonths: 24,
    maintenanceInterval: 'OVERDUE_OVER_12_MONTHS',
    hasSpdaInstalled: true,
    hasDpsInstalled: false,
    dpsDefectiveOrBurnt: false,
    circuitBreakerTripped: true,
    tamperedProtection: false,
    combustiblesNearPanels: true,
    eyewitnessFlickerOrSparks: true,
  };
}

/**
 * Guided Causal Nexus and Fire Cause Inference Engine based on STJ Case Law and NFPA 921 / ABNT Standards
 */
export function inferFireCausalNexus(input: FireEvidenceInput): FireCausalNexusResult {
  let primaryScore = 0;
  let negligenceScore = 0;
  const urgentActions: string[] = [];

  // 1. Metallurgical Analysis of Copper Melt
  let metallurgicalAnalysis = '';
  if (input.copperMelt === 'PRIMARY_ARC_BEAD') {
    primaryScore += 45;
    metallurgicalAnalysis = 
      'Evidência microscópica positiva de fusão por arco elétrico primário (Primary Arc Bead). ' +
      'Apresenta limite nítido entre a zona fundida e o cobre não fundido, presença de crateras internas de desgasificação ' +
      'e ausência de recozimento generalizado na haste do condutor. Indica inequivocamente que a corrente de curto-circuito ' +
      'ocorreu sob atmosfera não contaminada por fuligem de incêndio pré-existente (Causa Raiz Primária do Fogo).';
  } else if (input.copperMelt === 'SECONDARY_FIRE_MELTING') {
    primaryScore += 5;
    metallurgicalAnalysis = 
      'Morfologia compatível com fusão secundária decorrente do calor ambiental do incêndio (Secondary Fire Melting). ' +
      'Condutores apresentam afilamento gradual, queima difusa com espessa camada de óxido de cobre (CuO) e pontas arredondadas sem crateras de ejeção. ' +
      'O curto-circuito elétrico ocorreu tardiamente após o colapso isolante provocado por chamas externas.';
  } else if (input.copperMelt === 'NO_MELTING') {
    primaryScore += 0;
    metallurgicalAnalysis = 'Condutores elétricos recolhidos do foco inicial sem indícios de fusão de cobre.';
  } else {
    metallurgicalAnalysis = 'Amostras de condutores não submetidas à análise metalográfica.';
  }

  // 2. Eyewitness corroboration
  if (input.eyewitnessFlickerOrSparks) {
    primaryScore += 15;
  }

  // 3. Protection status
  if (!input.hasDpsInstalled || input.dpsDefectiveOrBurnt) {
    primaryScore += 15;
    negligenceScore += 25;
    urgentActions.push('Instalar conjunto de DPS Classe I e II coordenados no painel principal.');
  }

  if (input.tamperedProtection) {
    primaryScore += 20;
    negligenceScore += 35;
    urgentActions.push('Remover imediatamente disjuntores sobredimensionados ou ligações clandestinas (jumper) nos circuitos ramais.');
  }

  if (input.circuitBreakerTripped) {
    primaryScore += 10;
  }

  // 4. Maintenance History Assessment
  let maintenanceAssessment = '';
  if (input.maintenanceInterval === 'OVERDUE_OVER_12_MONTHS' || input.maintenanceInterval === 'NEVER_PERFORMED') {
    negligenceScore += 40;
    maintenanceAssessment = 
      `Instalação com ${input.installationAgeYears} anos de operação sem manutenções preventivas documentadas há mais de ` +
      `${input.maintenanceInterval === 'NEVER_PERFORMED' ? 'toda sua vida útil' : '12 meses'}. ` +
      'A falta de reaperto de conexões, ausência de limpeza técnica e acúmulo de poeira condutiva propiciaram degradação isolante progressiva.';
    urgentActions.push('Implementar plano de manutenção preventiva contínua com cronograma de reaperto e emissão semestral de ART.');
  } else if (input.maintenanceInterval === 'OVERDUE_6_TO_12_MONTHS') {
    negligenceScore += 20;
    maintenanceAssessment = 'Plano de manutenção preventiva em atraso intermediário (6 a 12 meses).';
  } else {
    maintenanceAssessment = 'Instalações com rotina de manutenção preventiva formalmente comprovada dentro da periodicidade semestral.';
  }

  // 5. Thermography report check
  if (!input.hasThermographyReport || input.thermographyOverdueMonths > 12) {
    negligenceScore += 25;
    urgentActions.push(`Contratar ensaio termográfico com câmera infravermelha calibrada (inadimplente há ${input.thermographyOverdueMonths} meses).`);
  }

  // 6. Combustibles near panels
  if (input.combustiblesNearPanels) {
    negligenceScore += 20;
    urgentActions.push('Desobstruir imediatamente o perímetro dos quadros elétricos de qualquer material inflamável (papelão, tintas, solventes).');
  }

  // Clamping percentages
  const primaryElectricalCauseProb = Math.min(99, Math.max(5, primaryScore));
  const negligenceProbability = Math.min(99, Math.max(5, negligenceScore));

  // Nexus Classification
  let causalNexusClassification: FireCausalNexusResult['causalNexusClassification'] = 'UNDETERMINED_SECONDARY_HEAT';
  if (primaryElectricalCauseProb >= 75) {
    causalNexusClassification = 'DEFINITIVE_ELECTRICAL_FAILURE';
  } else if (primaryElectricalCauseProb >= 50) {
    causalNexusClassification = 'PROBABLE_ELECTRICAL_FAILURE';
  } else if (input.copperMelt === 'SECONDARY_FIRE_MELTING') {
    causalNexusClassification = 'UNDETERMINED_SECONDARY_HEAT';
  } else {
    causalNexusClassification = 'INCONCLUSIVE';
  }

  // Technical Summary
  let technicalSummary = '';
  if (causalNexusClassification === 'DEFINITIVE_ELECTRICAL_FAILURE') {
    technicalSummary = 
      `Foco inicial do incêndio determinado como sendo de ORIGEM ELÉTRICA PRIMÁRIA (Probabilidade: ${primaryElectricalCauseProb}%). ` +
      'A sobrecarga/mau contato prolongado nos barramentos evoluiu para arco elétrico sustentado e centelhamento térmico de alta temperatura (> 3.000 °C), ' +
      'ignificando os materiais combustíveis adjacentes ao painel.';
  } else if (causalNexusClassification === 'PROBABLE_ELECTRICAL_FAILURE') {
    technicalSummary = 
      `Forte convergência de vestígios para FALHA ELÉTRICA COMO CAUSA PROVÁVEL DO SINISTRO (Probabilidade: ${primaryElectricalCauseProb}%). ` +
      'Constatado colapso isolante com atuação tardia de dispositivos de sobrecorrente e indícios de aquecimento anômalo prévio.';
  } else {
    technicalSummary = 
      'Vestígios inconclusivos para causa elétrica primária. Os danos elétricos encontrados nos condutores são consistentes com ' +
      'aquecimento térmico secundário propagado a partir de foco externo alheio à rede de potência.';
  }

  // STJ Jurisprudence Enforcement
  const appliesNoFortuitousCase = negligenceProbability >= 50 && primaryElectricalCauseProb >= 50;
  const stjCitation = 
    'Jurisprudência consolidada do Superior Tribunal de Justiça (STJ) pacificou que o incêndio deflagrado por defeito em instalação elétrica ' +
    'decorrente de omissão na manutenção preventiva NÃO CONSTITUI CASO FORTUITO OU FORÇA MAIOR (STJ - REsp 1.285.984/SP e REsp 1.834.195/RJ). ' +
    'Trata-se de fortuito interno inerente à responsabilidade do guardião da coisa pela integridade das instalações prediais. ' +
    ' | STJ AREsp 3.001.677 (Nov 2025): Incêndio originado por curto-circuito em painel elétrico com consequente projeção de partículas incandescentes sobre armazenamento de sólidos combustíveis. A ausência de sistema de chuveiros automáticos (sprinklers) somada à manutenção precária do sistema de disjuntores e à ausência de SPDA/DPS adequados configura negligência. Afastada a excludente de responsabilidade por caso fortuito, aplicando-se a responsabilização civil pelos danos, visto que tais falhas constituem fortuito interno inerente à operação.';

  const civilCodeArticle = 
    'Art. 1.348, inciso V da Lei Federal 10.406/2002 (Código Civil Brasileiro): Compete ao síndico e à administração predial ' +
    '"diligenciar a conservação e a guarda das partes comuns e zelar pela prestação dos serviços que interessem aos possuidores".';

  const liabilityNotice = appliesNoFortuitousCase
    ? 'PARECER PERICIAL JURÍDICO-TÉCNICO: Caracterizado o nexo de causalidade entre a omissão de manutenção preventiva periódica ' +
      `(índice de negligência técnica apurado em ${negligenceProbability}%) e o sinistro elétrico. ` +
      'A administração da edificação e os responsáveis técnicos respondem civilmente pelos danos materiais causados a terceiros, ' +
      'sendo inadmissível a excludente de caso fortuito ou força maior perante as cortes judiciais.'
    : 'PARECER PERICIAL JURÍDICO-TÉCNICO: Instalação demonstrou histórico satisfatório ou indeterminado de conformidade, ' +
      'não restando caracterizada negligência manifesta por omissão deliberada de manutenção.';

  return {
    primaryElectricalCauseProb,
    negligenceProbability,
    causalNexusClassification,
    technicalSummary,
    metallurgicalAnalysis,
    maintenanceAssessment,
    stjJurisprudenceEnforcement: {
      appliesNoFortuitousCase,
      citation: stjCitation,
      civilCodeArticle,
      liabilityNotice,
    },
    urgentCorrectiveActions: urgentActions,
  };
}
