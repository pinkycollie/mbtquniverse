# Release Management System Summary

This document provides an overview of the comprehensive release management system implemented for MBTQUniverse.

## 🎯 Overview

The release management system provides automated versioning, tagging, and release creation following semantic versioning principles. It includes GitHub Actions workflows, documentation, templates, and scripts to streamline the release process.

## 📦 Components

### 1. GitHub Actions Workflows

#### Release Management Workflow (`release.yml`)
- **Purpose**: Automatically create GitHub releases when tags are pushed
- **Features**:
  - Semantic version validation
  - Automatic/manual triggering
  - Pre-release support (alpha, beta, rc)
  - Auto-generated release notes
  - Mark as latest release for production versions

#### Version Bump Workflow (`version-bump.yml`)
- **Purpose**: Automate version bumping and tag creation
- **Features**:
  - Manual workflow dispatch
  - Support for major, minor, patch bumps
  - Pre-release versioning (alpha, beta, rc)
  - Automatic CHANGELOG updates
  - Git tag creation

#### Label Sync Workflow (`sync-labels.yml`)
- **Purpose**: Keep repository labels in sync
- **Features**:
  - Automatic label synchronization
  - Configuration-based label management
  - Manual trigger support

### 2. Templates

#### Issue Template: Release Planning
- Location: `.github/ISSUE_TEMPLATE/release.md`
- Provides structured format for planning releases
- Includes checklist and version naming guide

#### Pull Request Template
- Location: `.github/pull_request_template.md`
- Standardized PR format
- Version impact tracking
- Change type identification

### 3. Configuration Files

#### Labels Configuration (`labels.yml`)
- Defines all repository labels
- Categories:
  - Release-related
  - Version types
  - Pre-release stages
  - Branch types
  - Workflow status
  - Priorities

#### Release Configuration (`release.json`)
- Central release configuration
- Defines:
  - Versioning scheme
  - Branch strategies
  - Pre-release types
  - Changelog format
  - Automation settings

### 4. Scripts

#### Version Bump Script (`scripts/version-bump.js`)
- Node.js script for local version management
- Features:
  - Calculate new versions
  - Update package.json
  - Update CHANGELOG.md
  - Create git tags
  - Helpful error messages

### 5. Documentation

#### Release Guide (`docs/RELEASE_GUIDE.md`)
- Comprehensive guide to releasing
- Covers:
  - Semantic versioning
  - Release process options
  - Tagging best practices
  - Branch strategy
  - Release checklist
  - Troubleshooting

#### Release Quick Start (`docs/RELEASE_QUICKSTART.md`)
- Quick reference guide
- TL;DR for releases
- Common scenarios
- Troubleshooting tips

#### Branch Protection Guide (`docs/BRANCH_PROTECTION.md`)
- Branch strategy documentation
- Protection rules setup
- Workflow examples
- Best practices

#### Contributing Guide (`CONTRIBUTING.md`)
- Complete contribution guidelines
- Development workflow
- Commit message conventions
- PR process
- Coding standards

#### GitHub Configuration README (`.github/README.md`)
- Documents GitHub configuration
- Workflow descriptions
- Template usage
- Customization guide

### 6. Changelog

#### CHANGELOG.md
- Version history tracking
- Follows Keep a Changelog format
- Semantic versioning links
- Initial v1.0.0 release documented

## 🚀 Usage

### Creating a Release

#### Option 1: GitHub Actions (Recommended)
1. Navigate to **Actions** → **Version Bump**
2. Click **Run workflow**
3. Select bump type (major/minor/patch)
4. Optionally select pre-release ID
5. Release is created automatically

#### Option 2: Local Script
```bash
node scripts/version-bump.js [bump-type] [prerelease-id]
```

#### Option 3: Manual
```bash
npm version [bump-type]
git push && git push --tags
```

### Version Format

**Production:**
- v1.0.0 - Initial release
- v1.1.0 - New features
- v1.0.1 - Bug fixes
- v2.0.0 - Breaking changes

**Pre-release:**
- v1.0.0-alpha.1 - Alpha testing
- v1.0.0-beta.1 - Beta testing
- v1.0.0-rc.1 - Release candidate

## 🔄 Workflow Process

### Automated Release Flow

1. Developer runs version bump workflow OR pushes tag
2. Version bump workflow (if used):
   - Validates version format
   - Updates package.json
   - Updates CHANGELOG.md
   - Creates git tag
   - Pushes changes
3. Release workflow triggers on tag push:
   - Validates semantic version
   - Determines if pre-release
   - Builds and tests code
   - Generates release notes
   - Creates GitHub release
   - Marks as latest (if production)
4. Notifications sent (if configured)

### Manual Release Flow

1. Developer updates version locally
2. Updates CHANGELOG.md
3. Commits changes
4. Creates and pushes tag
5. Release workflow triggers automatically
6. GitHub release created

## 🏷️ Labels

### Release Labels
- `release` - Release-related issues/PRs
- `version-bump` - Automatic version changes
- `changelog` - Requires changelog update
- `breaking-change` - Breaking changes

### Version Type Labels
- `major` - Major version changes
- `minor` - Minor version changes
- `patch` - Patch version changes

### Pre-release Labels
- `alpha` - Alpha pre-release
- `beta` - Beta pre-release
- `rc` - Release candidate

### Branch Labels
- `main` / `master` - Main branch related
- `feature` - Feature branches
- `hotfix` - Urgent fixes

## 🌳 Branch Strategy

### Main Branches
- **main** or **master**: Production code
- **develop**: Next release integration (optional)

### Supporting Branches
- **feat/*** or **feat:***: New features
- **fix/***: Bug fixes
- **hotfix/***: Urgent production fixes
- **release/***: Release preparation
- **docs/***: Documentation updates

## 📋 Release Checklist

### Pre-Release
- [ ] All features complete
- [ ] Tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version follows semver
- [ ] Dependencies updated
- [ ] Security vulnerabilities addressed

### Release
- [ ] Version bumped
- [ ] Tag created
- [ ] Release notes generated
- [ ] GitHub release created

### Post-Release
- [ ] Release verified
- [ ] Documentation sites updated
- [ ] Release announced
- [ ] Monitor for issues

## 🔧 Maintenance

### Updating Workflows
1. Edit workflow files in `.github/workflows/`
2. Test with manual dispatch
3. Document changes
4. Update relevant documentation

### Updating Templates
1. Edit template files
2. Test by creating issue/PR
3. Gather feedback
4. Iterate as needed

### Updating Labels
1. Edit `.github/labels.yml`
2. Commit and push to main
3. Sync Labels workflow runs automatically

## 📚 Documentation Structure

```
docs/
├── RELEASE_GUIDE.md          # Comprehensive release guide
├── RELEASE_QUICKSTART.md     # Quick reference
├── BRANCH_PROTECTION.md      # Branch strategy
├── API.md                    # API documentation
├── ARCHITECTURE.md           # System architecture
├── DAO.md                    # Governance guide
├── REGISTRY.md               # Registry guide
├── STAKING.md                # Staking guide
└── TOKENIZATION.md           # Tokenization guide
```

## 🎓 Best Practices

### Version Bumping
- Bug fixes: `patch` (1.0.0 → 1.0.1)
- New features: `minor` (1.0.0 → 1.1.0)
- Breaking changes: `major` (1.0.0 → 2.0.0)
- Pre-releases: Use alpha, beta, or rc

### Commit Messages
- Follow Conventional Commits
- Use feat, fix, docs, chore, etc.
- Mark breaking changes with `!`

### Release Notes
- Clear, descriptive titles
- Categorize changes
- Link to relevant issues/PRs
- Highlight breaking changes
- Provide migration guides

### Tagging
- Always prefix with 'v'
- Use semantic versioning
- Create annotated tags
- Push tags after commits

## 🚨 Common Issues

### Tag Already Exists
```bash
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

### Workflow Failed
- Check Actions logs
- Verify secrets are set
- Ensure tests pass
- Check permissions

### Version Mismatch
- Ensure package.json matches tag
- Run version bump again if needed
- Manual sync if necessary

## 📖 Additional Resources

- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- Development workflow
- Commit conventions
- PR process
- Coding standards

## 📞 Support

For help with releases:
1. Check documentation
2. Review workflow logs
3. Search existing issues
4. Create issue with `release` label

## ✅ Summary

The release management system provides:
- ✅ Automated versioning and tagging
- ✅ Semantic versioning compliance
- ✅ Pre-release support
- ✅ GitHub Actions workflows
- ✅ Comprehensive documentation
- ✅ Issue and PR templates
- ✅ Label management
- ✅ Local and remote workflows
- ✅ CHANGELOG automation
- ✅ Branch protection guidance

This system enables efficient, consistent, and reliable release management for MBTQUniverse.

---

**Version**: 1.0.0
**Last Updated**: 2024-12-07
**Status**: Active
