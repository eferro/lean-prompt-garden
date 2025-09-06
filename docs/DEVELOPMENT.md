# 🛠️ Development Guide

This document explains the development workflow and quality validation system implemented in the project.

## 🚨 Error Prevention - Validation System

### Problem Solved
Previously, errors like **unused imports** and **TypeScript errors** would "slip through" commits because only basic linting was executed. Now we have multiple validation layers:

## 🔍 Validation Layers

### 1. **Pre-commit Hook** (Local Validation)
Executes automatically before each commit:

```bash
# Runs automatically when committing
git commit -m "my message"

# Or you can run it manually
./.githooks/pre-commit
```

**Validates:**
- ✅ ESLint (linting)
- ✅ TypeScript typecheck
- ✅ Unit tests
- ✅ Successful compilation

### 2. **GitHub Actions CI** (Remote Validation)
Executes automatically on each push/PR:

**Workflow: Continuous Integration** (`.github/workflows/ci.yml`)
- ✅ All pre-commit validations
- ✅ Production build test
- ✅ Runs on multiple branches

### 3. **Protected Deployment**
Deployment only occurs if CI passes successfully.

## 🎯 Development Commands

### Complete Manual Validation
```bash
# Run all validations (recommended before push)
npm run validate

# Run all validations + coverage report  
npm run validate:coverage

# Or individual:
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run test        # Tests
npm run build       # Build test
```

### Testing Scripts
```bash
npm run test              # Basic tests
npm run test:watch        # Tests in watch mode
npm run test:coverage     # Tests with coverage
npm run test:ui          # Tests with interactive UI
npm run test:unit        # Only unit tests
npm run test:components  # Only component tests
```

### Build Scripts
```bash
npm run build            # Standard build
npm run build:pages      # Build for GitHub Pages
```

## 🚫 Errors Now Automatically Detected

### Before ❌
- Unused imports went unnoticed
- TypeScript errors were committed
- Broken tests reached main
- Build problems were only discovered in CI

### Now ✅
- **Pre-commit hook**: Blocks commits with problems
- **TypeScript**: Detects all type errors
- **ESLint**: Configured to detect unused variables
- **Tests**: Required for committing
- **Complete CI**: Double remote validation

## 🔧 Quality Gates Configuration

### ESLint Configuration
```js
'@typescript-eslint/no-unused-vars': [
  'error',
  { 
    argsIgnorePattern: '^_',      // Ignore args starting with _
    varsIgnorePattern: '^_',      // Ignore vars starting with _
    ignoreRestSiblings: true      // Ignore destructuring rest
  }
],
```

### Git Hooks
Hooks are configured automatically with `npm install` via:
```bash
git config core.hooksPath .githooks
```

## 🎭 Recommended Workflow

### 1. During Development
```bash
# Normal development
npm run dev

# Tests in background (optional)
npm run test:watch
```

### 2. Before Commit
```bash
# Complete validation (recommended)
npm run validate

# Or trust the pre-commit hook
git add .
git commit -m "feat: new functionality"
# ☝️ All validations run automatically
```

### 3. Before Push
```bash
# Optional: final validation
npm run validate

# Safe push
git push
# ☝️ CI will run all validations remotely
```

## 🔍 Troubleshooting

### If pre-commit hook fails:
1. **Read the error** - it will tell you which validation failed
2. **Fix the problem**
3. **Try the commit again**

### If you want to commit without validations (NOT RECOMMENDED):
```bash
# Only in emergencies
git commit --no-verify -m "hotfix: emergency"
```

### If CI fails:
1. **Review the logs** in GitHub Actions
2. **Run locally**: `npm run validate`
3. **Fix the problems**
4. **Push again**

## 📊 Quality Metrics

With this system we now have:
- **0 TypeScript errors** guaranteed
- **0 broken tests** in main
- **0 linting problems** in main
- **100% successful builds** in deployment

## 🎉 Benefits

- **Consistent quality**: No more "I forgot to run the tests"
- **Safe deployment**: Only validated code reaches production
- **Fast feedback**: Errors detected locally before push
- **Less debugging**: Problems detected in development, not in production

---

Questions? The system is designed to be transparent and helpful, not to hinder development.
