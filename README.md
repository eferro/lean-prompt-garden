# Lean Prompt Garden

A curated collection of software gardening prompts for lean development practices. Built with React and fully compatible with [Model Context Protocol (MCP)](https://modelcontextprotocol.io).

## Features

- 🌱 **10 Specialized Gardening Prompts** - Each designed for specific lean development practices
- 🔍 **Search & Filter** - Find prompts by name, title, or description
- 📋 **Copy & Download** - Easy copy-to-clipboard functionality
- 🎯 **MCP Compatible** - Full compatibility with Model Context Protocol specification
- ⚡ **Fast & Modern** - Built with React 18, TypeScript, and Vite
- 📱 **Responsive Design** - Works on all devices with Tailwind CSS

## Available Prompts

1. **Scout-Rule Refactorer** - Behavior-preserving micro-refactors in tiny reversible steps
2. **Naming & API Clarity** - DDD-aligned naming and intent-revealing APIs
3. **Dead Code & Duplication Pruner** - Evidence-driven deletion and DRY merges
4. **Complexity Reducer** - Lower cyclomatic/cognitive complexity via small extractions
5. **Test Gardener** - Strengthen tests first; eliminate flakiness
6. **Dependency Gardener** - Safe micro-upgrades with full CI + smoke checks
7. **Parallel-Change Preparer** - Introduce reversible seams with feature flags
8. **Boundary Clarifier** - Tighten domain/infra boundaries using ports/adapters
9. **Invariant Guardrails** - Add value objects/validations for domain invariants
10. **Fitness-Function Writer** - Encode architecture rules as automated checks

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** + **Headless UI** for styling
- **Hero Icons** for iconography
- **React Router v7** for navigation
- **React Markdown** for content rendering
- **Vitest** + **Testing Library** for testing

## Development

```bash
# Install dependencies
npm install

# Generate prompts.json from individual prompt files
npm run generate-prompts

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Run tests
npm run test
```

Git hooks are configured to run ESLint automatically before each commit. If hooks are missing, run `npm install` to set them up.

### Prompt data workflow

Prompt metadata and definitions now live in `data/prompts/*.yaml`. Each file contains the display information (`name`, `title`, `description`, `arguments`) and the full `messages` array for a single prompt. After editing any of these files, run `npm run generate-prompts` to regenerate `public/prompts.json`. The command is wired into the `prepare`, `dev`, and `build` scripts, but contributors should commit both the modified source files and the regenerated JSON.

## MCP Compatibility

This project is fully compatible with the [Model Context Protocol specification](https://modelcontextprotocol.io/specification/2025-06-18/server/prompts). Each prompt includes:

- **name**: Unique identifier
- **title**: Human-readable display name
- **description**: Clear explanation of the prompt's purpose
- **arguments**: Typed parameters with descriptions and validation
- **messages**: Structured content with role-based messaging

## Usage

1. **Browse Prompts**: View all available prompts on the homepage
2. **Search**: Use the search box to filter by keywords
3. **Configure**: Click on a prompt to set up arguments
4. **Copy**: Use the copy button to get the rendered prompt text
5. **Integrate**: Use the JSON format directly with MCP-compatible tools

## License

MIT License - Feel free to use these prompts in your own development workflow!
