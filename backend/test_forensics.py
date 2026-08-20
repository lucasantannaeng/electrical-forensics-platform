"""
Unit tests for the Electrical Forensics Python Backend Engine
"""
import pytest
import numpy as np
import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(__file__))

from main import (
    parse_comtrade_cfg,
    parse_comtrade_dat,
    calculate_symmetrical_components,
    calculate_thd_from_magnitude,
    calculate_fft,
    diagnose_fault,
    analyze_comtrade
)

def test_parse_comtrade_cfg_valid():
    cfg_text = """Alpha Substation, IED_SEL_700
2013,1999
3A,0D
1,VA,A,V,1.0,0.0,0,-1000,1000,13800,115,P
2,VB,B,V,1.0,0.0,0,-1000,1000,13800,115,P
3,VC,C,V,1.0,0.0,0,-1000,1000,13800,115,P
60
1
10000,1000
1.0,0.0
1
"""
    meta = parse_comtrade_cfg(cfg_text)
    assert meta["station_name"] == "Alpha Substation"
    assert meta["recorder_id"] == "IED_SEL_700"
    assert meta["num_analog"] == 3
    assert meta["frequency"] == 60.0
    assert len(meta["analog_channels"]) == 3
    assert meta["analog_channels"][0]["id"] == "VA"

def test_calculate_symmetrical_components_balanced():
    t = np.linspace(0, 1/60, 600)
    va = (100 * np.sin(2 * np.pi * 60 * t)).tolist()
    vb = (100 * np.sin(2 * np.pi * 60 * t - 2*np.pi/3)).tolist()
    vc = (100 * np.sin(2 * np.pi * 60 * t + 2*np.pi/3)).tolist()
    
    sym = calculate_symmetrical_components(va, vb, vc)
    assert sym["posMagAvg"] > 30
    assert sym["zeroMagAvg"] < 1.0
    assert sym["negMagAvg"] < 1.0
    assert sym["voltageUnbalanceRate"] < 2.0

def test_diagnose_fault_ground_fault():
    sym_comp = {
        "zeroMagAvg": 45.0,
        "posMagAvg": 80.0,
        "negMagAvg": 15.0,
        "voltageUnbalanceRate": 18.75
    }
    diag = diagnose_fault(rms_a=12.0, rms_b=95.0, rms_c=98.0, sym_comp=sym_comp, thd_a=2.0, thd_b=2.1, thd_c=1.9)
    assert diag["severity"] == "CRITICAL"
    assert "Phase-to-Ground" in diag["faultTypeName"]
    assert "A-G" in diag["faultTypeName"]

if __name__ == "__main__":
    test_parse_comtrade_cfg_valid()
    test_calculate_symmetrical_components_balanced()
    test_diagnose_fault_ground_fault()
    print("All Python backend unit tests PASSED successfully!")
