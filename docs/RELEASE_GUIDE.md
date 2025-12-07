# Release Guide

## Semantic Versioning

MBTQUniverse follows [Semantic Versioning](https://semver.org/) (SemVer) for all releases.

### Version Format

Version numbers follow the format: `MAJOR.MINOR.PATCH`

- **MAJOR** version when you make incompatible API changes
- **MINOR** version when you add functionality in a backward compatible manner
- **PATCH** version when you make backward compatible bug fixes

### Version Examples

**Production Releases:**
- `v1.0.0` - Initial stable release
- `v1.1.0` - New features added
- `v1.1.1` - Bug fix
- `v2.0.0` - Breaking changes

**Pre-Release Versions:**
- `v1.0.0-alpha.1` - Alpha release (early testing, unstable)
- `v1.0.0-beta.1` - Beta release (feature complete, testing phase)
- `v1.0.0-rc.1` - Release candidate (final testing before production)

## Release Process

### Option 1: Automatic Version Bump (Recommended)

1. **Navigate to Actions** in your GitHub repository
2. **Select "Version Bump" workflow**
3. **Click "Run workflow"**
4. **Choose parameters:**
   - **Bump Type:** major, minor, patch, prepatch, preminor, or premajor
   - **Pre-release ID:** (optional) alpha, beta, or rc
   - **Target Branch:** (default: main)
5. **Run the workflow**

The workflow will:
- ✅ Calculate the new version
- ✅ Update `package.json`
- ✅ Update `CHANGELOG.md`
- ✅ Create a git tag
- ✅ Push changes and tag
- ✅ Trigger the release workflow automatically

### Option 2: Manual Version Bump

1. **Update version in `package.json`:**
   ```bash
   npm version patch   # For bug fixes (1.0.0 -> 1.0.1)
   npm version minor   # For new features (1.0.0 -> 1.1.0)
   npm version major   # For breaking changes (1.0.0 -> 2.0.0)
   ```

2. **For pre-release versions:**
   ```bash
   npm version prepatch --preid=alpha  # 1.0.0 -> 1.0.1-alpha.0
   npm version preminor --preid=beta   # 1.0.0 -> 1.1.0-beta.0
   npm version premajor --preid=rc     # 1.0.0 -> 2.0.0-rc.0
   ```

3. **Update CHANGELOG.md** with release notes

4. **Commit changes:**
   ```bash
   git add .
   git commit -m "chore: bump version to v1.2.3"
   ```

5. **Create and push tag:**
   ```bash
   git tag -a v1.2.3 -m "Release v1.2.3"
   git push origin main
   git push origin v1.2.3
   ```

6. **Release workflow triggers automatically** when tag is pushed

### Option 3: Manual Release Creation

1. **Go to GitHub Releases page**
2. **Click "Draft a new release"**
3. **Choose or create a tag** (e.g., v1.0.0)
4. **Fill in release details:**
   - Release title: "Release v1.0.0"
   - Description: Add release notes
5. **Mark as pre-release** if applicable
6. **Publish release**

## Tagging Best Practices

### Version Tag Format

✅ **Good tag names:**
- `v1.0.0`
- `v2.3.4`
- `v0.2.0-alpha`
- `v5.9.0-beta.3`
- `v1.0.0-rc.1`

❌ **Bad tag names:**
- `1.0.0` (missing 'v' prefix)
- `version-1.0.0` (incorrect format)
- `release-1.0` (incomplete version)
- `v1.0` (missing patch number)

### Tag Naming Convention

Always prefix version tags with the letter **`v`**:
- **Production:** `v1.0.0`, `v2.3.4`
- **Alpha:** `v0.2.0-alpha`, `v1.0.0-alpha.1`
- **Beta:** `v1.0.0-beta.1`, `v5.9.0-beta.3`
- **RC:** `v1.0.0-rc.1`, `v2.0.0-rc.2`

## Release Types

### Production Release

For stable, production-ready versions:

```bash
# Patch release (bug fixes)
npm version patch

# Minor release (new features)
npm version minor

# Major release (breaking changes)
npm version major
```

### Pre-Release (Alpha)

For early testing, unstable versions:

```bash
npm version prepatch --preid=alpha
npm version preminor --preid=alpha
npm version premajor --preid=alpha
```

### Pre-Release (Beta)

For feature-complete versions in testing:

```bash
npm version prepatch --preid=beta
npm version preminor --preid=beta
npm version premajor --preid=beta
```

### Pre-Release (RC)

For release candidates:

```bash
npm version prepatch --preid=rc
npm version preminor --preid=rc
npm version premajor --preid=rc
```

## Branch Strategy

### Main Branches

- **`main`** or **`master`**: Stable production code
- **`develop`**: Development branch for next release

### Feature Branches

- **`feat/feature-name`**: New features
- **`feat:feature-name`**: Alternative format
- **`feature/feature-name`**: Alternative format

### Support Branches

- **`hotfix/issue-description`**: Urgent production fixes
- **`release/v1.0.0`**: Release preparation
- **`bugfix/bug-description`**: Bug fixes

### Branch Protection

Recommended branch protection rules:

**For `main` branch:**
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require linear history
- ✅ Include administrators

**For `develop` branch:**
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging

## Release Checklist

### Pre-Release Checks

- [ ] All planned features are implemented
- [ ] All tests are passing
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated with all changes
- [ ] Version number follows semantic versioning
- [ ] Dependencies are up to date
- [ ] No security vulnerabilities in dependencies
- [ ] Code is properly formatted and linted
- [ ] Performance is acceptable

### Release Steps

- [ ] Version is bumped (manually or via workflow)
- [ ] CHANGELOG.md is updated
- [ ] Tag is created with proper format (v1.0.0)
- [ ] Changes are pushed to GitHub
- [ ] GitHub Release is created
- [ ] Release notes are generated
- [ ] Build artifacts are created (if applicable)

### Post-Release Tasks

- [ ] Verify release is visible on GitHub
- [ ] Test the released version
- [ ] Update documentation sites
- [ ] Announce release (if applicable)
- [ ] Monitor for issues
- [ ] Close related issues and PRs

## Release Notes Template

```markdown
## What's New in v[VERSION]

### 🎉 New Features
- **Feature 1**: Description
- **Feature 2**: Description

### 🐛 Bug Fixes
- Fixed issue with X (#123)
- Resolved bug in Y (#456)

### 🔧 Improvements
- Improved performance of Z
- Enhanced error handling in A

### ⚠️ Breaking Changes
- Changed API for X (migration guide: link)
- Removed deprecated Y

### 📚 Documentation
- Added guide for X
- Updated README with Y

### 🔒 Security
- Fixed security vulnerability in X (CVE-XXXX-XXXX)

### 📦 Dependencies
- Updated dependency X to v1.2.3
- Removed unused dependency Y

## Installation

\`\`\`bash
npm install mbtquniverse@1.0.0
\`\`\`

## Upgrade Guide

For users upgrading from v0.9.x:
1. Step 1
2. Step 2
3. Step 3

## Contributors

Thanks to all contributors who made this release possible!
```

## GitHub Actions Workflows

### Available Workflows

1. **Release Management** (`.github/workflows/release.yml`)
   - Automatically triggered when a tag is pushed
   - Creates GitHub releases
   - Generates release notes
   - Marks as latest release (if production)

2. **Version Bump** (`.github/workflows/version-bump.yml`)
   - Manual workflow dispatch
   - Calculates new version
   - Updates package.json and CHANGELOG
   - Creates and pushes tag

### Triggering Workflows

**Via GitHub UI:**
1. Go to Actions tab
2. Select workflow
3. Click "Run workflow"
4. Fill in parameters
5. Click "Run workflow" button

**Via GitHub CLI:**
```bash
gh workflow run version-bump.yml \
  -f bump_type=minor \
  -f prerelease_id=beta \
  -f target_branch=main
```

## Labels and Issue Management

### Release-Related Labels

- **`release`**: Release planning and tracking
- **`version-bump`**: Automatic version changes
- **`changelog`**: Requires changelog update
- **`breaking-change`**: Introduces breaking changes

### Version Type Labels

- **`major`**: Major version changes
- **`minor`**: Minor version changes
- **`patch`**: Patch version changes

### Pre-Release Labels

- **`alpha`**: Alpha pre-release
- **`beta`**: Beta pre-release
- **`rc`**: Release candidate

## Common Scenarios

### Scenario 1: Bug Fix Release

1. Fix the bug in a feature branch
2. Create PR and merge to main
3. Run version bump workflow with `patch`
4. Release workflow creates v1.0.1

### Scenario 2: New Feature Release

1. Develop feature in feature branch
2. Create PR and merge to main
3. Run version bump workflow with `minor`
4. Release workflow creates v1.1.0

### Scenario 3: Breaking Change Release

1. Implement breaking changes
2. Update documentation and migration guide
3. Run version bump workflow with `major`
4. Release workflow creates v2.0.0

### Scenario 4: Beta Release

1. Prepare features for testing
2. Run version bump workflow with `preminor` and `beta`
3. Release workflow creates v1.1.0-beta.1
4. After testing, run workflow with `minor` for production

### Scenario 5: Hotfix

1. Create hotfix branch from main
2. Fix critical issue
3. Merge to main
4. Run version bump workflow with `patch`
5. Release workflow creates v1.0.2

## Troubleshooting

### Tag Already Exists

If you get an error that a tag already exists:

```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin :refs/tags/v1.0.0

# Create new tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### Version Mismatch

If package.json version doesn't match the tag:

```bash
# Update package.json
npm version 1.0.0 --no-git-tag-version

# Commit the change
git add package.json
git commit -m "chore: sync version to v1.0.0"
git push
```

### Failed Release Workflow

If the release workflow fails:

1. Check the workflow logs in Actions tab
2. Fix any issues
3. Re-run the workflow or manually create the release

## Best Practices

### DO ✅

- Always prefix tags with 'v'
- Follow semantic versioning strictly
- Update CHANGELOG.md for every release
- Write clear, detailed release notes
- Test releases before publishing
- Use pre-releases for testing
- Tag releases immediately after merging

### DON'T ❌

- Don't skip version numbers
- Don't use inconsistent tag formats
- Don't release without testing
- Don't forget to update documentation
- Don't release breaking changes as patches
- Don't skip the CHANGELOG
- Don't force-push tags

## Resources

- [Semantic Versioning Specification](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [GitHub Releases Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [Git Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging)

## Support

For questions or issues with the release process:
- Open an issue with the `release` label
- Check existing issues for similar problems
- Review workflow logs for errors
