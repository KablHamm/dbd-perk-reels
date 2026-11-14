@echo off
rem Double-click to start the Perk Randomiser and open it in your browser.
cd /d "%~dp0"
python server.py --open
if errorlevel 1 (
  echo.
  echo Could not start. Check that Python is installed, or that the app is not already running.
  pause
)
