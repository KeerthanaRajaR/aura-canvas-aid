#!/usr/bin/env python3
"""
Simple test to verify the backend is working
"""

import requests
import time

def test_backend():
    print("🧪 Testing Backend Connection...")
    
    # Wait for backend to start
    time.sleep(3)
    
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running successfully!")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"❌ Backend returned status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to backend: {e}")
        print("Make sure the backend is running on port 8000")
        return False

if __name__ == "__main__":
    test_backend()
