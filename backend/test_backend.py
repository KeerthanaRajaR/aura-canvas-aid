#!/usr/bin/env python3
"""
Test script to verify the multi-agent backend is working correctly
"""

import requests
import json
import time

def test_backend():
    """Test the multi-agent backend endpoints"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Multi-Agent Healthcare Backend...")
    print("=" * 50)
    
    # Test 1: Health Check
    print("1. Testing health check...")
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to backend: {e}")
        print("   Make sure the backend is running on port 8000")
        return False
    
    # Test 2: Agent Validation
    print("\n2. Testing agent validation...")
    try:
        test_request = {
            "user_id": "1001",
            "intent": "validate",
            "message": "Hello, I'm user 1001"
        }
        response = requests.post(
            f"{base_url}/api/run_agent",
            json=test_request,
            timeout=10
        )
        if response.status_code == 200:
            result = response.json()
            print("✅ Agent validation passed")
            print(f"   Agent Response: {result.get('agent_response', 'No response')[:100]}...")
        else:
            print(f"❌ Agent validation failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Agent request failed: {e}")
        return False
    
    # Test 3: CGM Logging
    print("\n3. Testing CGM logging...")
    try:
        test_request = {
            "user_id": "1001",
            "intent": "log_cgm",
            "message": "My glucose reading is 120 mg/dL"
        }
        response = requests.post(
            f"{base_url}/api/run_agent",
            json=test_request,
            timeout=10
        )
        if response.status_code == 200:
            result = response.json()
            print("✅ CGM logging passed")
            print(f"   Agent Response: {result.get('agent_response', 'No response')[:100]}...")
        else:
            print(f"❌ CGM logging failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ CGM request failed: {e}")
        return False
    
    # Test 4: Mood Logging
    print("\n4. Testing mood logging...")
    try:
        test_request = {
            "user_id": "1001",
            "intent": "log_mood",
            "message": "I'm feeling happy today"
        }
        response = requests.post(
            f"{base_url}/api/run_agent",
            json=test_request,
            timeout=10
        )
        if response.status_code == 200:
            result = response.json()
            print("✅ Mood logging passed")
            print(f"   Agent Response: {result.get('agent_response', 'No response')[:100]}...")
        else:
            print(f"❌ Mood logging failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Mood request failed: {e}")
        return False
    
    print("\n" + "=" * 50)
    print("🎉 All tests passed! Multi-agent backend is working correctly.")
    print("🚀 You can now start the frontend with: npm run dev")
    return True

if __name__ == "__main__":
    test_backend()

