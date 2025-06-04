# 🛠️ Development Setup Guide

This guide will help you set up the development environment for the @phantasm0009/lazy-import package.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (>= 14.0.0) - [Download here](https://nodejs.org/)
- **npm** (>= 6.0.0) - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

### Recommended Tools

- **VS Code** - [Download here](https://code.visualstudio.com/)
- **VS Code Extensions**:
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier
  - GitLens
  - Jest Runner

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Phantasm0009/lazy-import.git
cd lazy-import
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Project

```bash
npm run build
```

### 4. Run Tests

```bash
# Run all tests
npm run test:all

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### 5. Start Development

```bash
# Build in watch mode
npm run dev

# Run the demo server
npm run demo
```

## 📁 Project Structure

```
lazy-import/
├── src/                     # Source code
│   ├── index.ts            # Main entry point
│   ├── bundler/            # Bundler integrations
│   └── cli/                # Command-line tools
├── examples/               # Usage examples
├── tests/                  # Test files
├── dist/                   # Built files (generated)
├── docs/                   # Generated documentation
└── .github/                # GitHub workflows and templates
```

## 🔧 Development Workflow

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build the project for production |
| `npm run dev` | Build in watch mode for development |
| `npm run test` | Run unit tests |
| `npm run test:all` | Run all tests (unit + integration + performance) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Lint the source code |
| `npm run lint:fix` | Lint and fix issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run type-check` | Run TypeScript type checking |
| `npm run validate` | Run all validation checks |
| `npm run clean` | Clean built files |
| `npm run docs:generate` | Generate API documentation |
| `npm run demo` | Start the demo server |

### Code Quality

We maintain high code quality standards:

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Jest** for testing
- **100% test coverage** target

### Pre-commit Checks

Before committing, ensure:

```bash
# Run validation
npm run validate

# This runs:
# - TypeScript type checking
# - ESLint linting
# - Prettier formatting check
# - All tests
```

## 🧪 Testing

### Test Types

1. **Unit Tests** (`src/*.test.ts`)
   - Test individual functions and components
   - Fast execution
   - High coverage

2. **Integration Tests** (`tests/integration-test.js`)
   - Test bundler integrations
   - Real-world scenarios

3. **Performance Tests** (`tests/performance-benchmark.js`)
   - Benchmark performance
   - Memory usage analysis

4. **Edge Case Tests** (`tests/edge-case-tests.js`)
   - Unusual scenarios
   - Error conditions

### Running Tests

```bash
# Quick test run
npm test

# Full test suite
npm run test:all

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

### Writing Tests

Follow these patterns:

```typescript
// Unit test example
describe('LazyImport', () => {
  it('should load modules lazily', async () => {
    const module = await lazyImport('./test-module');
    expect(module).toBeDefined();
  });
});
```

## 🏗️ Building

### Build Process

1. **TypeScript Compilation** - Converts TS to JS
2. **Bundle Generation** - Creates CJS and ESM builds
3. **Type Declarations** - Generates .d.ts files
4. **CLI Bundle** - Creates executable CLI tool

### Build Outputs

- `dist/index.js` - CommonJS build
- `dist/index.esm.js` - ES Module build
- `dist/index.d.ts` - TypeScript declarations
- `dist/cli.js` - CLI executable

## 📝 Code Style

### TypeScript Guidelines

- Use strict TypeScript settings
- Prefer explicit types over `any`
- Use meaningful variable names
- Document complex functions with JSDoc

### Code Formatting

We use Prettier with these settings:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### ESLint Rules

Key rules we follow:

- No unused variables
- Prefer const over let
- Use strict equality (===)
- No console.log in production code

## 🔍 Debugging

### VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Common Debug Scenarios

1. **Test Debugging**
   ```bash
   # Debug specific test
   npm test -- --testNamePattern="specific test name"
   ```

2. **Build Issues**
   ```bash
   # Clean and rebuild
   npm run clean
   npm run build
   ```

3. **Type Errors**
   ```bash
   # Run type check
   npm run type-check
   ```

## 📦 Package Management

### Adding Dependencies

```bash
# Production dependency
npm install package-name

# Development dependency
npm install --save-dev package-name
```

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest
```

## 🚀 Publishing

### Pre-publish Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version bumped in package.json
- [ ] CHANGELOG.md updated
- [ ] Build artifacts generated

### Publishing Process

```bash
# Dry run to check what will be published
npm run release:dry

# Actual publish (done via GitHub Actions)
# Create a release through GitHub UI
```

## 🤝 Contributing

### Git Workflow

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages

Follow conventional commits:

```
type(scope): description

Examples:
feat(bundler): add webpack 5 support
fix(core): handle circular dependencies
docs(readme): update installation guide
test(integration): add vite integration test
```

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   npm run clean
   npm install
   npm run build
   ```

2. **Test Failures**
   ```bash
   # Run tests individually
   npm test -- --verbose
   ```

3. **Type Errors**
   ```bash
   # Check TypeScript configuration
   npx tsc --showConfig
   ```

4. **Dependency Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

### Getting Help

- 📖 Check the [FAQ](FAQ.md)
- 🐛 [Report issues](https://github.com/Phantasm0009/lazy-import/issues)
- 💬 [Start a discussion](https://github.com/Phantasm0009/lazy-import/discussions)

## 📊 Development Metrics

### Performance Targets

- Bundle size: < 50KB
- Load time: < 100ms
- Memory usage: < 10MB

### Quality Metrics

- Test coverage: > 95%
- TypeScript strict mode: ✅
- Zero ESLint errors: ✅
- All examples working: ✅

---

Happy coding! 🎉
