# Contributing to MBTQUniverse

Thank you for considering contributing to MBTQUniverse! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Strategy](#branch-strategy)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Release Process](#release-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code:

- Be respectful and inclusive
- Welcome newcomers and encourage diversity
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 20 or higher
- Git
- GitHub account

### Setup

1. **Fork the repository**
   ```bash
   # Fork via GitHub UI, then clone your fork
   git clone https://github.com/YOUR_USERNAME/mbtquniverse.git
   cd mbtquniverse
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/pinkycollie/mbtquniverse.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Verify setup**
   ```bash
   npm test
   npm run lint
   ```

## Development Workflow

### 1. Create a Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feat/your-feature-name
```

### 2. Make Changes

- Write clear, concise code
- Follow existing code style
- Add tests for new functionality
- Update documentation as needed

### 3. Commit Changes

```bash
git add .
git commit -m "feat: add your feature"
```

### 4. Push to Your Fork

```bash
git push origin feat/your-feature-name
```

### 5. Create Pull Request

- Go to GitHub and create a PR from your fork to the main repository
- Fill out the PR template completely
- Link related issues
- Wait for review

## Branch Strategy

We follow a simplified Git Flow strategy:

### Branch Types

- **`main`**: Production-ready code
- **`feat/*`** or **`feat:`**: New features
- **`fix/*`**: Bug fixes
- **`hotfix/*`**: Urgent production fixes
- **`docs/*`**: Documentation updates
- **`refactor/*`**: Code refactoring
- **`test/*`**: Test updates
- **`chore/*`**: Maintenance tasks

### Branch Naming

Good examples:
- `feat/user-authentication`
- `fix/memory-leak`
- `docs/api-guide`
- `refactor/database-layer`

Bad examples:
- `test` (too generic)
- `my-changes` (not descriptive)
- `WIP` (not informative)

See [BRANCH_PROTECTION.md](docs/BRANCH_PROTECTION.md) for detailed information.

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Test updates
- **build**: Build system changes
- **ci**: CI/CD changes
- **chore**: Maintenance tasks
- **revert**: Revert previous commit

### Examples

```bash
# Feature
git commit -m "feat(auth): add OAuth2 authentication"

# Bug fix
git commit -m "fix(dao): resolve voting calculation error"

# Breaking change
git commit -m "feat(api)!: redesign REST API endpoints

BREAKING CHANGE: All API endpoints now use /v2/ prefix"

# Documentation
git commit -m "docs: update release guide"
```

## Pull Requests

### PR Title

Use the same format as commit messages:

```
feat(scope): add new feature
fix(scope): resolve bug
docs: update documentation
```

### PR Description

Use the provided PR template and include:

- **Description**: What changes were made and why
- **Type of Change**: Feature, bug fix, etc.
- **Related Issues**: Link to issues
- **Testing**: How you tested the changes
- **Screenshots**: For UI changes
- **Checklist**: Complete all items

### PR Process

1. **Create PR**: Fill out template completely
2. **Automated Checks**: Wait for CI/CD to pass
3. **Review**: Address reviewer comments
4. **Approval**: Get required approvals
5. **Merge**: Maintainer will merge

### PR Review Criteria

- Code quality and style
- Test coverage
- Documentation updates
- No breaking changes (unless major version)
- All CI checks passing
- No merge conflicts

## Release Process

### For Contributors

When contributing, indicate the version impact in your PR:

- **Major**: Breaking changes (`feat!`, `fix!`)
- **Minor**: New features (`feat`)
- **Patch**: Bug fixes (`fix`)

### For Maintainers

See [RELEASE_GUIDE.md](docs/RELEASE_GUIDE.md) for the complete release process.

Quick reference:
1. Merge approved PRs
2. Run version bump workflow
3. Verify release creation
4. Announce release

## Coding Standards

### JavaScript/Node.js

- Use ES6+ features
- Use `const` and `let` instead of `var`
- Use arrow functions where appropriate
- Use async/await instead of callbacks
- Follow ESLint configuration
- Use JSDoc comments for functions

### Code Style

```javascript
// Good
const createUser = async (name, email) => {
  const user = {
    id: generateId(),
    name,
    email,
    createdAt: Date.now()
  };
  
  await database.save(user);
  return user;
};

// Bad
function createUser(name, email) {
  var user = {
    id: generateId(),
    name: name,
    email: email,
    createdAt: Date.now()
  }
  
  database.save(user)
  return user
}
```

### Documentation

- Use clear, concise comments
- Document complex logic
- Add JSDoc for all public functions
- Update README when adding features

### File Organization

```
src/
├── module-name/
│   ├── module.js          # Main implementation
│   ├── module.test.js     # Tests (if applicable)
│   └── README.md          # Module documentation
```

## Testing

### Writing Tests

```javascript
// Example test structure
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { MyClass } from './my-class.js';

describe('MyClass', () => {
  it('should create instance', () => {
    const instance = new MyClass();
    assert.ok(instance);
  });

  it('should perform operation', () => {
    const instance = new MyClass();
    const result = instance.operation();
    assert.strictEqual(result, expectedValue);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test
node --test src/module/module.test.js

# Run with coverage (if configured)
npm run test:coverage
```

### Test Guidelines

- Write tests for new features
- Update tests for bug fixes
- Maintain test coverage
- Use descriptive test names
- Test edge cases

## Documentation

### What to Document

- New features
- API changes
- Configuration options
- Usage examples
- Breaking changes
- Migration guides

### Documentation Locations

- **README.md**: Project overview and quick start
- **docs/**: Detailed guides and references
- **Code comments**: Inline documentation
- **CHANGELOG.md**: Version history

### Documentation Style

- Use clear, simple language
- Provide code examples
- Include screenshots for UI features
- Link to related documentation
- Keep it up to date

## Project Structure

```
mbtquniverse/
├── .github/              # GitHub configuration
│   ├── workflows/        # CI/CD workflows
│   ├── ISSUE_TEMPLATE/   # Issue templates
│   └── pull_request_template.md
├── docs/                 # Documentation
├── scripts/              # Utility scripts
├── src/                  # Source code
│   ├── api/             # API gateway
│   ├── dao/             # Governance
│   ├── registry/        # Agent/project registry
│   ├── staking/         # Staking system
│   ├── tokenization/    # Stablecoin system
│   ├── metrics/         # Analytics
│   └── index.js         # Main entry point
├── examples/            # Usage examples
├── config/              # Configuration files
├── CHANGELOG.md         # Version history
├── CONTRIBUTING.md      # This file
├── README.md            # Project overview
└── package.json         # Project metadata
```

## Getting Help

### Resources

- **Documentation**: [docs/](docs/)
- **Examples**: [examples/](examples/)
- **Issues**: [GitHub Issues](https://github.com/pinkycollie/mbtquniverse/issues)

### Asking Questions

1. Check existing documentation
2. Search existing issues
3. Create new issue with `question` label
4. Provide context and examples

### Reporting Bugs

1. Search existing issues
2. Create new issue with `bug` label
3. Include:
   - Description
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details
   - Screenshots (if applicable)

### Suggesting Features

1. Search existing issues
2. Create new issue with `enhancement` label
3. Include:
   - Use case
   - Proposed solution
   - Alternative solutions
   - Additional context

## Recognition

Contributors are recognized in:
- Release notes
- Contributors section (if exists)
- GitHub contributors page

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions make MBTQUniverse better for everyone. We appreciate your time and effort!

---

**Questions?** Open an issue or reach out to the maintainers.
