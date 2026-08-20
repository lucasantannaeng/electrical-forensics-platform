# ⚡ Electrical Forensics Platform (Plataforma Pericial Elétrica B2B)

Plataforma SaaS B2B White-Label de alta performance para **diagnóstico forense e perícia de falhas em sistemas elétricos industriais**, automatizando a ingestão e análise de oscilografias no padrão internacional **IEEE COMTRADE (C37.111)**.

---

## 🌟 Principais Funcionalidades

- **Ingestão Universal IEEE COMTRADE:** Leitura e decodificação precisa de arquivos de configuração (`.cfg`) e dados temporais (`.dat`) segundo as normas IEEE C37.111-1991, 1999 e 2013.
- **Oscilografia Interativa em Alta Resolução:** Visualizador de ondas trifásicas ($V_a, V_b, V_c$) com aceleração via HTML5 Canvas, cursores de medição em tempo real e seleção dinâmica de canais.
- **Decomposição de Fortescue (Componentes Simétricas):** Cálculo exato de fasores fundamentais e sequências:
  - **Sequência Positiva ($V_1$):** Potência ativa e regime equilibrado.
  - **Sequência Negativa ($V_2$):** Desbalanço de carga e curtos entre fases.
  - **Sequência Zero ($V_0$):** Correntes de retorno e faltas à terra.
  - **Taxa de Desbalanço de Tensão (VUF %):** Conforme IEC 61000-4-30.
- **Análise Harmônica e THD (IEEE 519 / PRODIST):** Espectro FFT com identificação de ordens harmônicas (3ª, 5ª, 7ª, 9ª, 11ª, etc.) e verificação automática de conformidade.
- **Diagnóstico Pericial Automatizado:** Classificador inteligente de eventos transitórios e perturbações:
  - Curto-Circuito Monofásico Fase-Terra ($A-G$, $B-G$, $C-G$)
  - Curto-Circuito Bifásico Entre Fases (Fase-Fase)
  - Curto-Circuito Trifásico Simétrico
  - Afundamento Momentâneo de Tensão (*Voltage Sag*)
  - Poluição Harmônica Excessiva (THD &gt; 5%)
  - Regime Permanente Estável
- **Geração Instantânea de Laudo Pericial:** Emissão de laudo técnico em formato estruturado (JSON e visualização para impressão/PDF).
- **Motor Híbrido (Client-Side + FastAPI):** O frontend executa todo o processamento de forma autônoma e instantânea no navegador, integrando-se automaticamente com a API Python/FastAPI quando o servidor local estiver ativo.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS (Tema Dark Slate/Cyan Industrial), Lucide Icons, Canvas 2D Rendering.
- **Testes & QA:** Vitest, TypeScript strict type checking (`tsc --noEmit`).
- **Backend:** Python 3.11+, FastAPI, Uvicorn, NumPy, SciPy (FFT), Python-Multipart.
- **Banco de Dados:** Supabase (PostgreSQL com Row Level Security multi-tenant).
- **CI/CD:** GitHub Actions Pipeline.

---

## 🚀 Como Executar o Projeto

### 1. Executando o Frontend (React + Vite)

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Abra no navegador em [http://localhost:5173](http://localhost:5173).
4. No topo da tela, selecione um dos **Cenários Pré-configurados** (*Fase-Terra*, *Harmônicas* ou *Regime Normal*) ou faça upload dos seus próprios arquivos `.cfg` e `.dat`.

---

### 2. Executando a Suíte de Testes do Frontend

Para rodar os testes unitários de validação matemática e diagnóstica:
```bash
npm test
```
Para verificar a tipagem estática do TypeScript:
```bash
npm run typecheck
```
Para compilar o pacote de produção otimizado:
```bash
npm run build
```

---

### 3. Executando o Backend Python (FastAPI) [Opcional]

1. Navegue até a pasta `backend/`:
   ```bash
   cd backend
   ```
2. Crie e ative um ambiente virtual:
   ```bash
   python -m venv .venv
   # No Windows (PowerShell):
   .\.venv\Scripts\Activate.ps1
   # No Linux / macOS:
   source .venv/bin/activate
   ```
3. Instale as dependências do backend:
   ```bash
   pip install -r requirements.txt
   ```
4. Inicie o servidor FastAPI:
   ```bash
   uvicorn api:app --reload --port 8000
   ```
5. Acesse a documentação Swagger interativa em [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🏛️ Estrutura de Diretórios

```
electrical-forensics-platform/
├── .github/workflows/ci.yml       # Pipeline automatizada de CI/CD
├── backend/                       # Motor de processamento em Python / FastAPI
│   ├── api.py                     # Endpoints REST e CORS
│   ├── main.py                    # Parser COMTRADE, Fortescue e FFT
│   ├── requirements.txt           # Dependências Python
│   ├── sample.cfg                 # Registro de exemplo COMTRADE (Config)
│   └── sample.dat                 # Registro de exemplo COMTRADE (Dados)
├── src/
│   ├── components/                # Componentes da Interface Industrial
│   │   ├── FaultDiagnosticCard.tsx  # Card de parecer técnico e severidade
│   │   ├── ForensicReportModal.tsx  # Modal de laudo pericial (PDF/JSON)
│   │   ├── HarmonicsSpectrum.tsx   # Espectro harmônico e gauges de THD
│   │   ├── OscillogramViewer.tsx   # Visualizador de formas de onda em Canvas
│   │   └── PhasorDiagram.tsx       # Gráfico polar e decomposição de Fortescue
│   ├── types/                     # Tipagens estritas de engenharia
│   │   └── forensics.ts
│   ├── utils/                     # Motor matemático e parser client-side
│   │   └── comtradeParser.ts
│   ├── test/                      # Testes unitários com Vitest
│   │   └── forensics.test.ts
│   ├── App.tsx                    # Dashboard principal em Bento Grid
│   ├── main.tsx                   # Ponto de entrada React
│   └── index.css                  # Design system Slate/Cyan Industrial
├── supabase/                      # Schema DDL com RLS Multi-Tenant
│   └── schema.sql
├── package.json                   # Scripts e dependências Node
├── tsconfig.json                  # Configuração TypeScript
├── vite.config.ts                 # Configuração de build do Vite
└── README.md                      # Documentação técnica do projeto
```

---

## 📜 Licença

Distribuído sob a licença **MIT**. Consulte `LICENSE` para mais detalhes.
