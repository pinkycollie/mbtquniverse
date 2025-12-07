# Quick Start: Release Management

This is a quick reference guide for creating releases in MBTQUniverse. For detailed information, see [RELEASE_GUIDE.md](RELEASE_GUIDE.md).

## TL;DR

### Create a Release (GitHub Actions)

1. Go to **Actions** → **Version Bump**
2. Click **Run workflow**
3. Select bump type (major/minor/patch)
4. Run workflow
5. Done! Release is created automatically

### Create a Release (CLI)

```bash
# Patch release (1.0.0 -> 1.0.1)
node scripts/version-bump.js patch

# Minor release (1.0.0 -> 1.1.0)
node scripts/version-bump.js minor

# Major release (1.0.0 -> 2.0.0)
node scripts/version-bump.js major

# Beta release (1.0.0 -> 1.1.0-beta.0)
node scripts/version-bump.js preminor beta
```

## Version Format

### Production
- ✅ `v1.0.0` - Initial release
- ✅ `v1.1.0` - New features
- ✅ `v1.0.1` - Bug fixes
- ✅ `v2.0.0` - Breaking changes

### Pre-release
- ✅ `v1.0.0-alpha.1` - Alpha (unstable)
- ✅ `v1.0.0-beta.1` - Beta (testing)
- ✅ `v1.0.0-rc.1` - Release candidate

## When to Bump

| Change Type | Bump | Example |
|------------|------|---------|
| 🐛 Bug fixes | `patch` | 1.0.0 → 1.0.1 |
| ✨ New features | `minor` | 1.0.0 → 1.1.0 |
| 💥 Breaking changes | `major` | 1.0.0 → 2.0.0 |

## Available Workflows

### 1. Version Bump (`version-bump.yml`)
**Purpose**: Bump version and create tag
**Trigger**: Manual
**Usage**: Actions → Version Bump → Run workflow

### 2. Release Management (`release.yml`)
**Purpose**: Create GitHub release
**Trigger**: Automatic when tag is pushed
**Usage**: Runs automatically after version bump

## Branch Strategy

- **`main`**: Production code
- **`feat/*`**: New features
- **`hotfix/*`**: Urgent fixes
- **`release/*`**: Release preparation

See [BRANCH_PROTECTION.md](BRANCH_PROTECTION.md) for details.

## Common Scenarios

### Scenario 1: Bug Fix
```bash
# Fix the bug
git commit -m "fix: resolve issue #123"

# Bump version
node scripts/version-bump.js patch

# Push
git push && git push --tags
```

### Scenario 2: New Feature
```bash
# Develop feature
git commit -m "feat: add new feature"

# Bump version
node scripts/version-bump.js minor

# Push
git push && git push --tags
```

### Scenario 3: Breaking Change
```bash
# Implement changes
git commit -m "feat!: redesign API"

# Bump version
node scripts/version-bump.js major

# Push
git push && git push --tags
```

### Scenario 4: Beta Release
```bash
# Prepare beta
git commit -m "feat: prepare beta features"

# Bump version
node scripts/version-bump.js preminor beta

# Push
git push && git push --tags
```

## Files Modified by Release

- `package.json` - Version number
- `CHANGELOG.md` - Release notes
- Git tag - `v1.0.0` format

## Troubleshooting

### "Tag already exists"
```bash
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

### "Workflow failed"
- Check Actions tab for logs
- Verify version format
- Ensure tests pass

## Resources

- [RELEASE_GUIDE.md](RELEASE_GUIDE.md) - Complete guide
- [BRANCH_PROTECTION.md](BRANCH_PROTECTION.md) - Branch strategy
- [Semantic Versioning](https://semver.org/) - Version rules
- [Keep a Changelog](https://keepachangelog.com/) - Changelog format

## Need Help?

Open an issue with the `release` label.
