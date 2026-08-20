"""
FastAPI Application for Electrical Forensics Platform (IEEE C37.111 COMTRADE API)
"""
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from typing import List, Dict, Any, Optional

from main import analyze_comtrade

app = FastAPI(
    title="Electrical Forensics Platform API",
    description="Motor de Perícia e Diagnóstico de Oscilografias Elétricas IEEE COMTRADE",
    version="1.0.0"
)

# CORS para permitir conexões do frontend Vite (local ou em nuvem)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "service": "Electrical Forensics Platform API",
        "version": "1.0.0",
        "standards": ["IEEE C37.111", "IEC 61000-4-30", "IEEE 519"],
        "status": "healthy"
    }

@app.post("/analyze")
async def analyze_files(
    comtrade_cfg: UploadFile = File(..., description="Arquivo de configuração (.cfg)"),
    comtrade_dat: UploadFile = File(..., description="Arquivo de dados de oscilografia (.dat)"),
    scada_logs: Optional[UploadFile] = File(None),
    dga_results: Optional[UploadFile] = File(None)
):
    """
    Analisa registros oscilográficos COMTRADE e retorna componentes simétricas, THD, RMS e diagnóstico pericial.
    """
    try:
        cfg_content = (await comtrade_cfg.read()).decode('utf-8', errors='replace')
        dat_content = await comtrade_dat.read()
        
        result = analyze_comtrade(cfg_content, dat_content)
        
        if scada_logs:
            result["scada_logs_provided"] = scada_logs.filename
        if dga_results:
            result["dga_results_provided"] = dga_results.filename
            
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sample-data")
async def get_sample_data():
    """
    Retorna o caminho ou dados dos arquivos de exemplo para testes imediatos.
    """
    sample_cfg_path = os.path.join(os.path.dirname(__file__), "sample.cfg")
    sample_dat_path = os.path.join(os.path.dirname(__file__), "sample.dat")
    
    if os.path.exists(sample_cfg_path) and os.path.exists(sample_dat_path):
        with open(sample_cfg_path, "r", encoding="utf-8") as f:
            cfg = f.read()
        with open(sample_dat_path, "rb") as f:
            dat = f.read()
        return analyze_comtrade(cfg, dat)
    
    return {"status": "error", "message": "Arquivos de amostra não encontrados no servidor."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)