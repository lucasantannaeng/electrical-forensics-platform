import sys
sys.path.append('backend')
from main import analyze_comtrade

# Read the generated sample files
with open('backend/sample.cfg', 'r') as f:
    cfg_content = f.read()

with open('backend/sample.dat', 'rb') as f:
    dat_content = f.read()

# Run analysis
result = analyze_comtrade(cfg_content, dat_content)

# Print the result as JSON
import json
print(json.dumps(result, indent=2))