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