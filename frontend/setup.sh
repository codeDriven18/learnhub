#!/bin/bash
# LearnHub Frontend Setup Script for Linux/Mac

set -e

echo "========================================"
echo "LearnHub Frontend Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please edit .env file with your API URL"
fi

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To start the development servers, run:"
echo "  Student Dashboard:  npm run dev:student  (http://localhost:3000)"
echo "  Checker Dashboard:  npm run dev:checker  (http://localhost:3001)"
echo "  Admin Dashboard:    npm run dev:admin    (http://localhost:3002)"
echo ""
echo "To build for production:"
echo "  npm run build"
echo ""
