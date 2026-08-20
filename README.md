# ⚡ Electrical Forensics Platform (B2B SaaS)

An enterprise-grade B2B White-Label SaaS platform for **automated electrical forensic diagnosis and industrial failure analysis**, ingesting and processing oscillograms adhering to the international **IEEE COMTRADE (C37.111)** standard.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-cyan.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.0-purple.svg)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95-emerald.svg)](https://fastapi.tiangolo.com/)

---

## 🌟 Key Features

- **Universal IEEE COMTRADE Ingestion:** High-fidelity decoding of configuration (`.cfg`) and time-series data (`.dat`) files complying with IEEE C37.111-1991, 1999, and 2013 standards.
- **High-Performance Oscillography Canvas:** Real-time rendering of three-phase voltage and current waveforms ($V_a, V_b, V_c$) with interactive time-measurement cursors and selective channel toggling.
- **Fortescue Symmetrical Components Decomposition:** Exact calculation of fundamental phasors and sequence components:
  - **Positive Sequence ($V_1$):** Active power transmission and balanced load.
  - **Negative Sequence ($V_2$):** System unbalance and phase-to-phase faults.
  - **Zero Sequence ($V_0$):** Ground return current and earth faults.
  - **Voltage Unbalance Rate (VUF %):** In accordance with IEC 61000-4-30 standard.
- **Harmonic Distortion & THD Analysis (IEEE 519):** Full FFT spectral decomposition with individual harmonic orders (3rd, 5th, 7th, 9th, 11th, etc.) and automated compliance checks.
- **Automated Forensic Event Classifier:** Machine-assisted diagnostic engine identifying:
  - Single Phase-to-Ground Faults ($A-G$, $B-G$, $C-G$)
  - Phase-to-Phase Line Faults ($A-B$, $B-C$, $C-A$)
  - Symmetrical Three-Phase Faults
  - Momentary Voltage Sags & Swells
  - Severe Harmonic Pollution (THD &gt; 5%)
  - Steady-State Normal Operation
- **Instant Engineering Forensic Report:** Generates structured technical reports ready for PDF printing and JSON export.
- **Dual Hybrid Architecture (Client-Side & FastAPI):** Autonomous in-browser client-side engine with automatic connection to local/cloud FastAPI backend when online.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS (Industrial Dark Slate/Cyan theme), Lucide Icons, HTML5 Canvas 2D.
- **Testing & QA:** Vitest, strict static type checking (`tsc --noEmit`).
- **Backend:** Python 3.11+, FastAPI, Uvicorn, NumPy, SciPy (FFT), Python-Multipart.
- **Database:** Supabase (PostgreSQL with Row Level Security multi-tenant isolation).
- **CI/CD:** GitHub Actions.

---

## 🚀 Getting Started

### 1. Running the Frontend (React + Vite)

1. Install Node dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open in your browser at [http://localhost:5173](http://localhost:5173).
4. Select one of the pre-configured **Scenarios** (*Phase-to-Ground*, *Harmonics*, *Normal Operation*) in the top HUD, or upload your own `.cfg` and `.dat` files.

---

### 2. Running Frontend Tests & Typecheck

To run automated unit tests:
```bash
npm test
```
To verify TypeScript static types:
```bash
npm run typecheck
```
To build the optimized production bundle:
```bash
npm run build
```

---

### 3. Running the Python Backend (FastAPI) [Optional]

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # Windows (PowerShell):
   .\.venv\Scripts\Activate.ps1
   # Linux / macOS:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn api:app --reload --port 8000
   ```
5. View interactive Swagger API documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🏛️ Directory Structure

```
electrical-forensics-platform/
├── .github/workflows/ci.yml       # Automated CI/CD pipeline
├── backend/                       # Python / FastAPI calculation engine
│   ├── api.py                     # REST endpoints & CORS
│   ├── main.py                    # COMTRADE parser, Fortescue & FFT engine
│   ├── requirements.txt           # Python dependencies
│   ├── sample.cfg                 # Example COMTRADE config
│   └── sample.dat                 # Example COMTRADE data
├── src/
│   ├── components/                # Industrial UI components
│   │   ├── FaultDiagnosticCard.tsx  # Technical assessment card
│   │   ├── ForensicReportModal.tsx  # Forensic report modal (PDF/JSON)
│   │   ├── HarmonicsSpectrum.tsx   # Harmonic spectrum & THD gauges
│   │   ├── OscillogramViewer.tsx   # Canvas 2D waveform renderer
│   │   └── PhasorDiagram.tsx       # Polar phasor diagram & Fortescue
│   ├── types/                     # Engineering domain types
│   │   └── forensics.ts
│   ├── utils/                     # Client-side math & COMTRADE parser
│   │   └── comtradeParser.ts
│   ├── test/                      # Vitest unit test suite
│   │   └── forensics.test.ts
│   ├── App.tsx                    # Main HUD & dashboard
│   ├── main.tsx                   # React root entrypoint
│   └── index.css                  # Industrial Dark design system
├── supabase/                      # Multi-tenant SQL schema with RLS
│   └── schema.sql
├── package.json                   # Node dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite bundler configuration
└── README.md                      # Technical documentation
```

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

Copyright (c) 2026 Luca Rodrigues Gomes de Sant'Anna.
