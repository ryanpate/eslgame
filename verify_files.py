#!/usr/bin/env python3
"""
Verification script to check if all required files are present
Run this before deploying to catch missing files early
"""

import os
from pathlib import Path

def check_files():
    """Check if all required files and folders exist"""
    
    base_dir = Path(__file__).parent
    required_files = [
        'app.py',
        'requirements.txt',
        'Procfile',
    ]
    
    required_folders = [
        'templates',
        'static',
        'static/css',
        'static/js',
    ]
    
    template_files = [
        'templates/base.html',
        'templates/index.html',
        'templates/matching.html',
        'templates/spelling.html',
        'templates/scramble.html',
        'templates/vocabulary.html',
    ]
    
    static_files = [
        'static/css/style.css',
        'static/js/main.js',
    ]
    
    all_good = True
    
    print("🔍 Checking required files and folders...\n")
    
    # Check required files
    print("📄 Required Files:")
    for file in required_files:
        file_path = base_dir / file
        if file_path.exists():
            print(f"  ✅ {file}")
        else:
            print(f"  ❌ {file} - MISSING!")
            all_good = False
    
    print()
    
    # Check required folders
    print("📁 Required Folders:")
    for folder in required_folders:
        folder_path = base_dir / folder
        if folder_path.exists() and folder_path.is_dir():
            print(f"  ✅ {folder}")
        else:
            print(f"  ❌ {folder} - MISSING!")
            all_good = False
    
    print()
    
    # Check template files
    print("📝 Template Files:")
    for file in template_files:
        file_path = base_dir / file
        if file_path.exists():
            print(f"  ✅ {file}")
        else:
            print(f"  ❌ {file} - MISSING!")
            all_good = False
    
    print()
    
    # Check static files
    print("🎨 Static Files:")
    for file in static_files:
        file_path = base_dir / file
        if file_path.exists():
            print(f"  ✅ {file}")
        else:
            print(f"  ❌ {file} - MISSING!")
            all_good = False
    
    print()
    
    if all_good:
        print("✅ All required files are present! Ready to deploy! 🚀")
        return True
    else:
        print("❌ Some files are missing! Please add them before deploying.")
        return False

if __name__ == '__main__':
    import sys
    success = check_files()
    sys.exit(0 if success else 1)
