#!/usr/bin/env python3
"""
Startup script for the Multi-Agent Healthcare Backend
This script starts the FastAPI server with proper configuration
"""

import uvicorn
import os
import sys
from pathlib import Path

# Add the current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

if __name__ == "__main__":
    print("🚀 Starting Multi-Agent Healthcare Backend...")
    print("📍 Server will be available at: http://localhost:8000")
    print("🔗 API Documentation: http://localhost:8000/docs")
    print("💚 Health Check: http://localhost:8000/health")
    print("\n" + "="*50)
    
    # Start the server
    uvicorn.run(
        "multiagent:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload for development
        log_level="info"
    )

