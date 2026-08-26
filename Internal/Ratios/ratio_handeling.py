import json
from pathlib import Path

# Configuration
CONFIG_FILE = Path(__file__).parent.parent.parent / "Importing" / "ratio_config.json"  # Go up to Stocks folder
DASHBOARD_PATH = Path(__file__).parent.parent.parent / "FinForge.xlsm"


def get_ratios_from_config():
    """Load ratio definitions from the config file"""
    try:
        if CONFIG_FILE.exists():
            with open(CONFIG_FILE, 'r') as f:
                return json.load(f)
        return {}
    except Exception as e:
        print(f"Error loading ratios: {e}")
        return {}


def save_ratios_to_config(ratios):
    """Save ratio definitions to the config file"""
    try:
        with open(CONFIG_FILE, 'w') as f:
            json.dump(ratios, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving ratios: {e}")
        return False
