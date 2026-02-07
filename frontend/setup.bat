@echo off
REM LearnHub Frontend Setup Script for Windows

echo ========================================
echo LearnHub Frontend Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo Please edit .env file with your API URL
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the development servers, run:
echo   Student Dashboard:  npm run dev:student  (http://localhost:3000)
echo   Checker Dashboard:  npm run dev:checker  (http://localhost:3001)
echo   Admin Dashboard:    npm run dev:admin    (http://localhost:3002)
echo.
echo To build for production:
echo   npm run build
echo.
pause
