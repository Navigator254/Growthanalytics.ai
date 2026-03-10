#!/usr/bin/env python3
"""
Football Predictions with Safe Bets & Arbitrage
Main Application Entry Point
"""
import sys
import os

# Add src directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

def main():
    try:
        from src.gui.app import main as gui_main
        gui_main()
    except ImportError as e:
        print(f"❌ Import Error: {e}")
        print("Please ensure all files are in the correct structure:")
        print("  soccer_predictor/src/api/sportsmonks.py")
        print("  soccer_predictor/src/gui/app.py")
        sys.exit(1)

if __name__ == "__main__":
    main()