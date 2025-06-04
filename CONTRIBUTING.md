# 🤝 Contributing to lazy-import

Thank you for your interest in contributing to `@phantasm0009/lazy-import`! This document provides guidelines and information for contributors.

## 🌟 Ways to Contribute

### 🐛 Bug Reports
- Use our [issue template](https://github.com/Phantasm0009/lazy-import/issues/new?template=bug_report.md)
- Include reproduction steps and environment details
- Check existing issues before creating new ones

### 💡 Feature Requests
- Use our [feature request template](https://github.com/Phantasm0009/lazy-import/issues/new?template=feature_request.md)
- Explain the use case and benefits
- Consider backward compatibility

### 📚 Documentation
- Fix typos and improve clarity
- Add examples and use cases
- Update API documentation
- Improve tutorial content

### 🔧 Code Contributions
- Bug fixes and performance improvements
- New features and enhancements
- Test coverage improvements
- Static Bundle Helper optimizations

## 🚀 Getting Started

### Prerequisites
- Node.js >= 14.0.0
- npm >= 6.0.0
- Git

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/Phantasm0009/lazy-import.git
cd lazy-import

# Install dependencies
npm install

# Run tests to ensure everything works
npm run test:all

# Build the project
npm run build
```

### Development Scripts

```bash
# Development build with watch mode
npm run dev

# Run all tests
npm run test:all

# Run specific test suites
npm run test                    # Unit tests
npm run test:integration        # Integration tests
npm run test:performance        # Performance benchmarks
npm run test:edge-cases        # Edge case tests

# Linting
npm run lint

# Build for production
npm run build

# Run examples
node examples/basic-usage.js
node examples/advanced-usage.js
npm run demo
```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all source code
- Follow existing code formatting
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Testing Requirements
- All new features must include tests
- Maintain or improve test coverage
- Test both success and error scenarios
- Include performance tests for optimizations

### Commit Messages
We follow [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): description

feat(core): add intelligent preloading
fix(cache): resolve memory leak in cache cleanup
docs(tutorial): add SBH configuration examples
test(integration): add bundler compatibility tests
perf(core): optimize module resolution
```

Types:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `test`: Test additions/changes
- `perf`: Performance improvements
- `refactor`: Code refactoring
- `style`: Code style changes
- `ci`: CI/CD changes

### Pull Request Process

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/lazy-import.git
   cd lazy-import
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Write code following our guidelines
   - Add tests for new functionality
   - Update documentation if needed

4. **Test Your Changes**
   ```bash
   npm run test:all
   npm run lint
   npm run build
   ```

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(scope): your feature description"
   ```

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a pull request on GitHub.

### PR Requirements
- [ ] Tests pass (`npm run test:all`)
- [ ] Code follows style guidelines
- [ ] Documentation updated (if needed)
- [ ] Backward compatibility maintained
- [ ] Performance impact considered

## 🏗️ Project Structure

```
lazy-import/
├── src/                    # Source code
│   ├── core/              # Core lazy loading logic
│   ├── cache/             # Caching system
│   ├── bundler/           # Static Bundle Helper
│   ├── types/             # TypeScript definitions
│   └── index.ts           # Main entry point
├── tests/                 # Test suites
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   ├── performance/       # Performance tests
│   └── edge-cases/        # Edge case tests
├── examples/              # Usage examples
│   ├── bundler-configs/   # Bundler configurations
│   └── react-app/         # React demo app
├── docs/                  # Documentation
└── dist/                  # Built files
```

## 🧪 Testing Strategy

### Test Categories

1. **Unit Tests** (`tests/unit/`)
   - Core functionality
   - Cache operations
   - Error handling
   - Type checking

2. **Integration Tests** (`tests/integration/`)
   - Bundler integrations
   - Real module loading
   - SBH transformations
   - Cross-platform compatibility

3. **Performance Tests** (`tests/performance/`)
   - Load time benchmarks
   - Memory usage tests
   - Cache efficiency
   - Bundle size analysis

4. **Edge Case Tests** (`tests/edge-cases/`)
   - Error scenarios
   - Network failures
   - Invalid inputs
   - Resource constraints

### Writing Tests

```typescript
// Example unit test
describe('LazyLoader', () => {
  it('should cache loaded modules', async () => {
    const loader = new LazyLoader();
    
    // First load
    const start1 = performance.now();
    const module1 = await loader.load('path');
    const time1 = performance.now() - start1;
    
    // Second load (cached)
    const start2 = performance.now();
    const module2 = await loader.load('path');
    const time2 = performance.now() - start2;
    
    expect(module1).toBe(module2);
    expect(time2).toBeLessThan(time1);
  });
});
```

## 🔧 Static Bundle Helper Development

### SBH Architecture
- AST transformations
- Bundler plugin system
- Configuration management
- Type preservation

### Adding Bundler Support
1. Create plugin in `src/bundler/plugins/`
2. Add configuration types
3. Write integration tests
4. Update documentation

### SBH Testing
```bash
# Test specific bundler
npm run test:integration -- --bundler=webpack

# Test all bundlers
npm run test:integration

# Performance comparison
npm run test:performance -- --compare-sbh
```

## 📊 Performance Considerations

### Benchmarking
- Always benchmark performance changes
- Compare with and without SBH
- Test on different bundle sizes
- Monitor memory usage

### Optimization Guidelines
- Minimize runtime overhead
- Optimize cache efficiency
- Reduce bundle size impact
- Maintain fast startup times

## 🎯 Feature Development

### New Feature Checklist
- [ ] Use case analysis
- [ ] API design review
- [ ] Implementation plan
- [ ] Test strategy
- [ ] Documentation plan
- [ ] Backward compatibility check
- [ ] Performance impact assessment

### API Design Principles
1. **Simplicity**: Easy to use for common cases
2. **Flexibility**: Powerful options for advanced use
3. **Consistency**: Follow existing patterns
4. **Type Safety**: Full TypeScript support
5. **Performance**: Minimal overhead

## 🚀 Release Process

### Version Management
We follow [Semantic Versioning](https://semver.org/):
- `MAJOR`: Breaking changes
- `MINOR`: New features
- `PATCH`: Bug fixes

### Release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped
- [ ] Performance benchmarks run
- [ ] Examples tested

## 📋 Issue Templates

### Bug Report Template
```markdown
**Bug Description**
Clear description of the bug

**Reproduction Steps**
1. Step one
2. Step two
3. ...

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g. Windows 10]
- Node.js: [e.g. 16.14.0]
- Package Version: [e.g. 2.1.0]
- Bundler: [e.g. Webpack 5.70.0]
```

### Feature Request Template
```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why is this feature needed?

**Proposed API**
How should this feature work?

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Any other relevant information
```

## 🎉 Recognition

### Contributors Wall
We recognize all contributors in:
- README.md contributors section
- CHANGELOG.md acknowledgments
- GitHub releases
- Social media shoutouts

### Contribution Types
- 💻 Code
- 📝 Documentation
- 🐛 Bug reports
- 💡 Ideas
- 🤔 Answering questions
- ⚠️ Testing

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Email**: atiwar0414@gmail.com for private matters

### Response Times
- **Bug reports**: Within 48 hours
- **Feature requests**: Within 1 week
- **Pull requests**: Within 1 week
- **Questions**: Within 24 hours

## 📜 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors.

### Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards community members

### Enforcement
Violations may result in temporary or permanent bans from the project.

## 🙏 Thank You

Your contributions make lazy-import better for everyone. Whether you're:
- Reporting a bug
- Suggesting a feature
- Improving documentation
- Contributing code
- Answering questions

**Every contribution matters!**

---

**Happy Contributing! 🚀**

*Built with ❤️ by the lazy-import community*
