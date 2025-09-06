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
- [ ] Test all new design prompts render correctly in UI
- [ ] Validate argument substitution works for all design prompts
- [ ] Verify copy-to-clipboard functionality for design prompts
- [ ] Test search integration finds design prompts by relevant keywords

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