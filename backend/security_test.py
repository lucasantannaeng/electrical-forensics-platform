import requests
import base64
import json
import sys

API_URL = "http://localhost:8000"

def test_health():
    try:
        r = requests.get(f"{API_URL}/health", timeout=2)
        return r.status_code == 200
    except:
        return False

def test_sql_injection():
    # Attempt to inject via filename in metadata? We'll just test if error messages leak.
    # Upload a file with a filename containing SQL.
    files = {'file': ("test' OR '1'='1.cfg", b"dummy data", "text/plain")}
    try:
        r = requests.post(f"{API_URL}/upload", files=files, timeout=5)
        # If we get a 500 with SQL trace, that's bad.
        if r.status_code >= 500:
            return False, f"Server error: {r.text[:200]}"
        return True, "No SQL error leaked"
    except Exception as e:
        return False, str(e)

def test_path_traversal():
    # Try to upload a file with path traversal in filename
    files = {'file': ("../../etc/passwd.cfg", b"data", "text/plain")}
    try:
        r = requests.post(f"{API_URL}/upload", files=files, timeout=5)
        if r.status_code >= 500:
            return False, f"Server error: {r.text[:200]}"
        return True, "No path traversal error"
    except Exception as e:
        return False, str(e)

if __name__ == "__main__":
    if not test_health():
        print("API not healthy")
        sys.exit(1)
    ok1, msg1 = test_sql_injection()
    ok2, msg2 = test_path_traversal()
    print(f"SQL Injection test: {'PASS' if ok1 else 'FAIL'} - {msg1}")
    print(f"Path traversal test: {'PASS' if ok2 else 'FAIL'} - {msg2}")
    if ok1 and ok2:
        sys.exit(0)
    else:
        sys.exit(1)