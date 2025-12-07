# GitHub Configuration

This directory contains configuration files for GitHub features and automation.

## Directory Structure

```
.github/
├── workflows/              # GitHub Actions workflows
│   ├── deploy.yml         # Deployment workflow
│   ├── release.yml        # Release management
│   ├── version-bump.yml   # Version bumping
│   └── sync-labels.yml    # Label synchronization
├── ISSUE_TEMPLATE/        # Issue templates
│   └── release.md         # Release planning template
├── pull_request_template.md  # PR template
├── labels.yml             # Repository labels configuration
└── release.json           # Release configuration

```

## Workflows

### Deploy (`deploy.yml`)
**Purpose**: Deploy application to various platforms
**Trigger**: Push to main, manual dispatch
**Features**:
- Multi-platform deployment (Vercel, Netlify, Docker, etc.)
- Build and test before deployment
- Concurrency control

### Release Management (`release.yml`)
**Purpose**: Create GitHub releases automatically
**Trigger**: Tag push (v*.*.*), manual dispatch
**Features**:
- Semantic version validation
- Automatic release notes generation
- Pre-release support (alpha, beta, rc)
- Latest release marking

### Version Bump (`version-bump.yml`)
**Purpose**: Bump version and create tags
**Trigger**: Manual dispatch
**Features**:
- Semantic version bumping (major, minor, patch)
- Pre-release versioning support
- CHANGELOG.md updates
- Automatic tag creation

### Sync Labels (`sync-labels.yml`)
**Purpose**: Synchronize repository labels
**Trigger**: Push to main (labels.yml changes), manual
**Features**:
- Automated label management
- Consistent labeling across the project

## Templates

### Issue Template: Release Planning
Location: `.github/ISSUE_TEMPLATE/release.md`

Template for planning new releases with:
- Version information
- Release checklist
- Version naming conventions
- Release notes template

### Pull Request Template
Location: `.github/pull_request_template.md`

Template for pull requests with:
- Change description
- Type of change checkboxes
- Related issues linking
- Version impact tracking
- Testing information
- Reviewer checklist

## Configuration Files

### Labels Configuration (`labels.yml`)
Defines repository labels for:
- Release management
- Version types (major, minor, patch)
- Pre-release stages (alpha, beta, rc)
- Branch types
- Workflow status
- Priority levels

### Release Configuration (`release.json`)
Configures release behavior:
- Versioning scheme (semver)
- Branch strategies
- Pre-release configurations
- Changelog format
- Automation settings

## Usage

### Creating a Release

**Option 1: Automated (Recommended)**
1. Go to Actions → Version Bump
2. Select bump type and pre-release ID
3. Run workflow
4. Release is created automatically

**Option 2: Manual**
1. Create tag: `git tag -a v1.0.0 -m "Release v1.0.0"`
2. Push tag: `git push origin v1.0.0`
3. Release workflow runs automatically

### Managing Labels

Labels are automatically synced from `labels.yml`:
1. Edit `.github/labels.yml`
2. Commit and push to main
3. Sync Labels workflow runs automatically

Or manually trigger:
1. Go to Actions → Sync Labels
2. Click "Run workflow"

### Using Templates

**Issues:**
- Click "New Issue"
- Select "Release Planning" template
- Fill in the information

**Pull Requests:**
- Create PR (template auto-loads)
- Fill in all sections
- Check all applicable boxes

## Workflow Triggers

### Automatic Triggers

| Workflow | Trigger | Condition |
|----------|---------|-----------|
| Deploy | Push | `main` branch |
| Release Management | Tag Push | Tags matching `v*.*.*` |
| Sync Labels | Push | `main` branch, `labels.yml` changes |

### Manual Triggers

All workflows support manual dispatch via GitHub Actions UI.

## Branch Protection

Recommended protection rules are documented in [/docs/BRANCH_PROTECTION.md](../docs/BRANCH_PROTECTION.md).

## Environment Variables & Secrets

### Deploy Workflow
- `DEFAULT_DEPLOY_TARGET`: Default deployment platform
- Platform-specific secrets (VERCEL_TOKEN, etc.)

### Release Workflow
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Sync Labels Workflow
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

## Permissions

Workflows use minimal required permissions:

**Deploy**:
- `contents: read`
- `pages: write` (for GitHub Pages)
- `id-token: write` (for deployments)

**Release Management**:
- `contents: write` (create releases, push tags)
- `pull-requests: write` (update PRs)
- `issues: write` (close issues)

**Sync Labels**:
- `issues: write` (manage labels)
- `contents: read` (read configuration)

## Customization

### Adding New Workflows

1. Create `.github/workflows/your-workflow.yml`
2. Define triggers, jobs, and steps
3. Test with manual dispatch
4. Document in this README

### Modifying Templates

1. Edit template files
2. Test by creating issue/PR
3. Adjust as needed
4. Update documentation

### Updating Labels

1. Edit `.github/labels.yml`
2. Add/remove/modify labels
3. Commit and push
4. Labels sync automatically

## Best Practices

### Workflows

- Use minimal permissions
- Add concurrency control for deployments
- Cache dependencies when possible
- Use official actions when available
- Document all custom workflows

### Templates

- Keep templates concise but comprehensive
- Provide examples and guidance
- Update regularly based on feedback
- Ensure all checkboxes are actionable

### Labels

- Use consistent naming
- Provide clear descriptions
- Use color coding effectively
- Keep the list manageable

## Troubleshooting

### Workflow Failures

1. Check workflow logs in Actions tab
2. Verify all required secrets are set
3. Ensure permissions are correct
4. Test locally when possible

### Template Issues

1. Verify template syntax
2. Check for YAML formatting errors
3. Test by creating issue/PR
4. Review GitHub's template documentation

### Label Sync Issues

1. Verify `labels.yml` syntax
2. Check workflow permissions
3. Review sync workflow logs
4. Manually sync if needed

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Issue Templates Guide](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests)
- [Managing Labels](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels)
- [Release Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github)

## Support

For issues or questions about GitHub configuration:
- Check existing documentation
- Review workflow logs
- Create an issue with the `automation` label
- Reference specific workflow or template

---

**Last Updated**: 2024-12-07
**Maintained By**: Repository maintainers
