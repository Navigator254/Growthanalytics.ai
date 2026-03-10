#!/bin/bash
# Soccer Predictor - Linux Setup Script
# For Parrot OS / Ubuntu / Debian

set -e

echo "========================================="
echo "⚽ Football Predictor Linux Setup"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_warning "Running as root, continuing..."
fi

# Update system
print_status "Updating package list..."
sudo apt update

# Install Python3 and pip if not present
if ! command -v python3 &> /dev/null; then
    print_status "Installing Python3..."
    sudo apt install -y python3 python3-pip python3-venv
fi

# Install tkinter for GUI
print_status "Installing Tkinter for GUI..."
sudo apt install -y python3-tk

# Create project structure
print_status "Creating project structure..."

mkdir -p ~/soccer_predictor/{config,src/{api,gui},logs}
cd ~/soccer_predictor

# Create virtual environment
print_status "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install --upgrade pip
pip install requests python-dotenv

# Create necessary files
print_status "Creating configuration files..."

# Create .env file
cat > .env << 'EOF'
# SportsMonks API Configuration
SPORTSMONKS_API_KEY=your_api_key_here

# Application Settings
APP_MODE=development
DEBUG=true
LOG_LEVEL=INFO

# Betting Configuration
MIN_EDGE_FOR_SAFE_BET=5.0
MIN_ARBITRAGE_PROFIT=0.5
DEFAULT_LEAGUE_ID=5
DEFAULT_STAKE_AMOUNT=1000
EOF

# Create requirements.txt
cat > requirements.txt << 'EOF'
requests>=2.31.0
python-dotenv>=1.0.0
EOF

# Create main.py
cat > main.py << 'EOF'
#!/usr/bin/env python3
"""
Football Predictions with Safe Bets & Arbitrage
Main Entry Point for Linux
"""
import sys
import os
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def setup_environment():
    """Setup Python environment"""
    # Add src directory to Python path
    src_path = os.path.join(os.path.dirname(__file__), 'src')
    sys.path.insert(0, src_path)
    
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    # Check API key
    api_key = os.getenv("SPORTSMONKS_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        logger.warning("No SportsMonks API key found in .env file")
        logger.info("The app will use simulated data mode")
        logger.info("Get your API key from: https://www.sportmonks.com")
    
    return True

def check_dependencies():
    """Check required packages"""
    required = ['requests', 'python-dotenv']
    missing = []
    
    for package in required:
        try:
            __import__(package)
        except ImportError:
            missing.append(package)
    
    if missing:
        logger.error(f"Missing packages: {', '.join(missing)}")
        logger.info("Install with: pip install -r requirements.txt")
        return False
    
    return True

def main():
    """Main entry point"""
    print("=" * 60)
    print("⚽ Football Predictions with Safe Bets & Arbitrage")
    print("=" * 60)
    print(f"Python: {sys.version}")
    print(f"Platform: {sys.platform}")
    print()
    
    # Setup
    if not setup_environment():
        sys.exit(1)
    
    if not check_dependencies():
        sys.exit(1)
    
    # Import and run GUI
    try:
        from src.gui.app import main as gui_main
        gui_main()
    except ImportError as e:
        logger.error(f"Import Error: {e}")
        print("File structure issue. Ensure:")
        print("  ~/soccer_predictor/src/api/sportsmonks.py exists")
        print("  ~/soccer_predictor/src/gui/app.py exists")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Application Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
EOF

# Make main.py executable
chmod +x main.py

# Create src/__init__.py
cat > src/__init__.py << 'EOF'
"""
Football Predictor Package
"""
__version__ = "1.0.0"
__author__ = "Football Predictor Team"

import os
import sys

# Package initialization
print(f"Initializing Football Predictor v{__version__}")
EOF

# Create src/api/__init__.py
cat > src/api/__init__.py << 'EOF'
"""
API Module
"""
from .sportsmonks import *
EOF

# Create src/gui/__init__.py
cat > src/gui/__init__.py << 'EOF'
"""
GUI Module
"""
from .app import SoccerApp, main
EOF

# Create config/settings.py
cat > config/settings.py << 'EOF'
"""
Configuration Settings for Linux
"""
import os
from pathlib import Path

# Base directory
BASE_DIR = Path.home() / 'soccer_predictor'

# Paths
LOG_DIR = BASE_DIR / 'logs'
LOG_FILE = LOG_DIR / 'app.log'

# Ensure directories exist
LOG_DIR.mkdir(exist_ok=True)

# API Settings
SPORTSMONKS_BASE_URL = "https://api.sportmonks.com/v3/football"
API_TIMEOUT = 15

# Application Settings
DEFAULT_LEAGUE_ID = 5  # Europa League
DEFAULT_DATE_FORMAT = "%Y-%m-%d"

# GUI Settings
WINDOW_SIZE = "1300x750"
WINDOW_TITLE = "Football Predictions with Safe Bets & Arbitrage"

# Colors
COLORS = {
    'bg': '#f0f0f0',
    'header': '#2c3e50',
    'accent': '#3498db',
    'success': '#27ae60',
    'warning': '#f39c12',
    'danger': '#e74c3c',
    'light': '#ecf0f1',
    'dark': '#34495e',
    'text': '#2c3e50'
}
EOF

print_status "Setup complete!"
echo ""
echo "========================================="
echo "NEXT STEPS:"
echo "========================================="
echo "1. Edit your API key:"
echo "   nano ~/soccer_predictor/.env"
echo ""
echo "2. Activate virtual environment:"
echo "   source ~/soccer_predictor/venv/bin/activate"
echo ""
echo "3. Run the application:"
echo "   cd ~/soccer_predictor && python main.py"
echo ""
echo "4. Or run directly:"
echo "   ~/soccer_predictor/main.py"
echo "========================================="