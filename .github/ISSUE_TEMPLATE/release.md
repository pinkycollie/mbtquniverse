---
name: Release Planning
about: Plan a new release version
title: '[RELEASE] v'
labels: ['release', 'planning']
assignees: ''
---

## Release Information

**Target Version:** v<!-- e.g., 1.0.0, 2.3.4 -->
**Release Type:** <!-- Production / Pre-release (alpha, beta, rc) -->
**Target Date:** <!-- YYYY-MM-DD -->

## Release Checklist

### Pre-Release
- [ ] All planned features are complete
- [ ] All tests are passing
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version number follows semantic versioning
- [ ] Dependencies are up to date
- [ ] Security vulnerabilities are addressed

### Release Process
- [ ] Create version bump PR or use workflow
- [ ] Review and merge version bump
- [ ] Tag is created (automatically or manually)
- [ ] GitHub release is created
- [ ] Release notes are generated
- [ ] Artifacts are built and uploaded

### Post-Release
- [ ] Verify release on GitHub
- [ ] Update documentation sites
- [ ] Announce release (if applicable)
- [ ] Monitor for issues
- [ ] Close related issues/PRs

## Version Naming Convention

### Production Releases
- **Major** (v1.0.0, v2.0.0): Breaking changes, major new features
- **Minor** (v1.1.0, v1.2.0): New features, backward compatible
- **Patch** (v1.0.1, v1.0.2): Bug fixes, backward compatible

### Pre-Release Versions
- **Alpha** (v1.0.0-alpha.1): Early testing, unstable
- **Beta** (v1.0.0-beta.1): Feature complete, testing phase
- **RC** (v1.0.0-rc.1): Release candidate, final testing

## Release Notes Template

```markdown
## What's New in v[VERSION]

### 🎉 New Features
- Feature 1
- Feature 2

### 🐛 Bug Fixes
- Fix 1
- Fix 2

### 🔧 Improvements
- Improvement 1
- Improvement 2

### ⚠️ Breaking Changes
- Breaking change 1 (if any)

### 📚 Documentation
- Doc update 1

### 🔒 Security
- Security fix 1 (if any)
```

## Additional Context

<!-- Add any other context about the release here -->
