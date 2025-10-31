@echo off
REM Halloween Vocabulary Game - Start Script for Windows

echo 🎃 Starting Halloween Vocabulary Game...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

echo ✅ Python found
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install requirements
echo 📥 Installing dependencies...
pip install -r requirements.txt --quiet

echo.
echo 🚀 Starting the game server...
echo 📱 Open your browser and go to: http://localhost:5000
echo ⚠️  Press Ctrl+C to stop the server
echo.

REM Run the app
python app.py

pause
