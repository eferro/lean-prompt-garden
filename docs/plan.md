# TDD Development Plan - Lean Prompt Garden

## Completed Tests ✅

### Core Types and Utilities
- ✅ Type validation tests (`src/types/prompt.test.ts`)
- ✅ Prompt utility functions tests (`src/utils/prompt.test.ts`) 
- ✅ Data fetching hooks tests (`src/hooks/usePrompts.test.ts`, `src/hooks/usePromptDetail.test.ts`)
- ✅ SearchBox component tests (`src/components/SearchBox/index.test.tsx`)

## Remaining Test Coverage

### Component Tests (High Priority)
- ✅ PromptCard component tests - should display prompt information correctly
- ✅ PromptRenderer component tests - should render prompt content with arguments
- ✅ ArgumentsForm component tests - should handle dynamic form inputs
- ✅ Layout component tests - should render navigation and content areas

### Page Tests (Medium Priority)
- ✅ Home page tests - should integrate search and prompt listing
- ✅ PromptDetail page tests - should display prompt details and handle arguments

### Integration Tests (Low Priority)
- [ ] End-to-end user flows - search → select → render prompt
- [ ] Error handling flows - network errors, missing prompts
- [ ] URL routing tests - navigation between pages

## Production Reliability Fixes (High Priority)

### 1. Error Boundary — Prevent White Screen of Death
- ✅ Create `ErrorBoundary` component that catches React errors
- ✅ Test: ErrorBoundary displays fallback UI when child throws
- ✅ Test: ErrorBoundary logs error details for debugging
- ✅ Test: ErrorBoundary provides "Try Again" action
- ✅ Wrap App with ErrorBoundary in main.tsx

### 2. Route Parameter Guard — Fix Undefined Name Crash
- ✅ Test: PromptDetail redirects to home when name param is undefined
- ✅ Test: PromptDetail redirects to home when name param is empty string
- ✅ Remove non-null assertion (`name!`) and add proper guard

### 3. Clipboard Feedback — User-Visible Error States
- ✅ Test: Copy button shows error state when clipboard API fails
- ✅ Test: Copy button shows error state when clipboard not available
- ✅ Test: Error state clears after timeout
- [ ] Add fallback for insecure contexts (show text selection modal)

### 4. Configuration Extraction — Remove Hardcoded Paths
- ✅ Create `src/config.ts` with base path configuration
- ✅ Test: Config returns correct path for production environment
- ✅ Test: Config returns correct path for development environment
- ✅ Replace hardcoded paths in usePrompts, usePromptDetail, main.tsx

## Production Reliability Fixes (Medium Priority)

### 5. Empty Messages Guard — Prevent Empty Clipboard Copy
- ✅ Test: Copy extracts text from first text-type message
- ✅ Test: Copy shows warning when no copyable text found
- ✅ Test: Copy handles resource-type content appropriately

### 6. JSON Validation — Runtime Safety for Fetched Data
- ✅ Create validation utility for PromptData structure
- ✅ Test: Validation rejects missing prompts array
- ✅ Test: Validation rejects malformed prompt objects
- ✅ Apply validation in usePrompts and usePromptDetail hooks

## Production Reliability Fixes (Low Priority)

### 7. Retry Mechanism — Network Resilience
- [ ] Test: Hook retries fetch on transient failure
- [ ] Test: Hook respects max retry limit
- [ ] Test: Error state shows "Retry" button after max retries
- [ ] Add retry logic to usePrompts and usePromptDetail

## Software Design Prompts (New Features)

### Design Quality Prompts (High Priority)
- ✅ Create `gardener_cohesion_analyzer` prompt - identify mixed responsibilities and extract secondary concerns
- ✅ Create `gardener_coupling_reducer` prompt - reduce inter-module dependencies through interfaces
- ✅ Create `gardener_encapsulation_strengthener` prompt - hide internal details behind meaningful operations
- ✅ Create `gardener_clarity_enhancer` prompt - make code self-explanatory through better naming
- ✅ Create `gardener_design_principles_auditor` prompt - comprehensive design health check

### Prompt Integration Tasks (Medium Priority)
- ✅ Add cohesion analyzer to prompts.json following prompt-creator.md guidelines
- ✅ Add coupling reducer to prompts.json following prompt-creator.md guidelines
- ✅ Add encapsulation strengthener to prompts.json following prompt-creator.md guidelines
- ✅ Add clarity enhancer to prompts.json following prompt-creator.md guidelines
- ✅ Add design principles auditor to prompts.json following prompt-creator.md guidelines

### Validation Tasks (Medium Priority)
- ✅ Test all new design prompts render correctly in UI
- ✅ Validate argument substitution works for all design prompts
- ✅ Verify copy-to-clipboard functionality for design prompts
- ✅ Test search integration finds design prompts by relevant keywords

## Direct API Access (New Feature)

### API Endpoint Implementation (High Priority)
- ✅ Create direct endpoint for accessing prompts.json
- ✅ Add API documentation section to Home page
- ✅ Test endpoint accessibility and CORS configuration
- ✅ Validate JSON response structure matches MCP specification

## TDD Rules for Next Steps

1. **Red → Green → Refactor** cycle for each unmarked test
2. Write ONE failing test at a time
3. Implement minimal code to make test pass
4. Refactor only when tests are green
5. Run `npm run test:fast` after each change

## Test Commands

- `npm run test` - Run all tests with watch mode
- `npm run test:fast` - Quick test run without watch
- `npm run test:coverage` - Generate coverage report
- `npm run test:unit` - Run only utils and hooks tests
- `npm run test:components` - Run only component tests

## Quality Standards

- All tests must pass before proceeding
- Maintain >80% test coverage
- Keep tests focused and independent
- Use descriptive test names
- Mock external dependencies (fetch, etc.)