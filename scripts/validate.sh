#!/bin/bash

# Validation script for lean-prompt-garden
# This script runs all quality checks that are also run in CI/CD

set -e  # Exit on any error

echo "🔍 Running complete project validation..."
echo "======================================"

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "📋 1/4 - Running ESLint..."
npm run lint
echo "✅ Linting passed"

echo ""
echo "🔍 2/4 - Running TypeScript type checking..."
npm run typecheck
echo "✅ Type checking passed"

echo ""
echo "🧪 3/4 - Running tests..."
npm run test
echo "✅ All tests passed"

echo ""
echo "🏗️  4/4 - Testing build..."
npm run build
echo "✅ Build successful"

echo ""
echo "🎉 All validations passed! Your code is ready for deployment."
echo "======================================"

# Optional: Show test coverage
echo ""
read -p "🔎 Would you like to see test coverage? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📊 Running test coverage..."
    npm run test:coverage
fi
