@echo off
setlocal
cd /d "%~dp0"
echo Starting KrushiMitra Platform...

:: Start Backend
echo Starting Backend on Port 5000...
start "KrushiMitra Backend" cmd /k "cd backend && py app.py"

:: Start Frontend
echo Starting Frontend...
start "KrushiMitra Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo Servers are launching in new windows!
echo Backend API: http://localhost:5000
echo Frontend UI: http://localhost:5173
echo ===================================================
echo.
pause
