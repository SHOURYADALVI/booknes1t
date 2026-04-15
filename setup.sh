#!/bin/bash
# BookNest Setup Script for macOS/Linux
# This script automates the setup process

echo ""
echo "========================================"
echo "   BookNest Setup Script - macOS/Linux"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please download and install from: https://nodejs.org/"
    exit 1
fi

echo "[OK] Node.js is installed:"
node --version

echo ""
echo "[STEP 1] Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install root dependencies"
    exit 1
fi

echo ""
echo "[STEP 2] Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install frontend dependencies"
    cd ..
    exit 1
fi
cd ..

echo ""
echo "[STEP 3] Checking .env file..."
if [ ! -f ".env" ]; then
    echo "[INFO] .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "[OK] Created .env with demo credentials"
else
    echo "[OK] .env file already exists"
fi

echo ""
echo "========================================"
echo "    Setup Complete!"
echo "========================================"
echo ""
echo "To start the project, open TWO terminals:"
echo ""
echo "Terminal 1 (API Server):"
echo "  cd booknest"
echo "  node scripts/local-api-server.cjs"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd booknest/frontend"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173/"
echo ""
echo "Demo Credentials:"
echo "  Admin:    admin@booknest.local / BookNest@2026"
echo "  Customer: reader@booknest.local / Reader@2026"
echo ""
