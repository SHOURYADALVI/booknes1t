@echo off
REM BookNest Setup Script for Windows
REM This script automates the setup process

echo.
echo ========================================
echo     BookNest Setup Script - Windows
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed: 
node --version

echo.
echo [STEP 1] Installing root dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo [STEP 2] Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [STEP 3] Checking .env file...
if not exist ".env" (
    echo [INFO] .env file not found. Copying from .env.example...
    copy .env.example .env
    echo [OK] Created .env with demo credentials
) else (
    echo [OK] .env file already exists
)

echo.
echo ========================================
echo     Setup Complete!
echo ========================================
echo.
echo To start the project, open TWO terminals:
echo.
echo Terminal 1 (API Server):
echo   cd booknest
echo   node scripts/local-api-server.cjs
echo.
echo Terminal 2 (Frontend):
echo   cd booknest\frontend
echo   npm run dev
echo.
echo Then open: http://localhost:5173/
echo.
echo Demo Credentials:
echo   Admin:    admin@booknest.local / BookNest@2026
echo   Customer: reader@booknest.local / Reader@2026
echo.
pause
