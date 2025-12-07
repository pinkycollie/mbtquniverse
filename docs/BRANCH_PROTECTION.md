# Branch Protection and Management Guide

This guide explains the branch strategy and protection rules for the MBTQUniverse repository.

## Branch Strategy

### Main Branches

#### `main` or `master`
- **Purpose**: Production-ready code
- **Protection Level**: High
- **Release**: All production releases
- **Access**: Protected, requires PR approval

#### `develop` (Optional)
- **Purpose**: Integration branch for next release
- **Protection Level**: Medium
- **Release**: Beta and RC releases
- **Access**: Protected, requires PR approval

### Supporting Branches

#### Feature Branches
Naming patterns:
- `feat/feature-name`
- `feat:feature-name`
- `feature/feature-name`

**Purpose**: Develop new features
**Lifecycle**: Created from `develop` or `main`, merged back via PR
**Example**: `feat/user-authentication`, `feat:payment-system`

#### Hotfix Branches
Naming pattern:
- `hotfix/issue-description`

**Purpose**: Urgent production fixes
**Lifecycle**: Created from `main`, merged back to `main` and `develop`
**Example**: `hotfix/security-vulnerability`, `hotfix/critical-bug`

#### Release Branches
Naming pattern:
- `release/v1.0.0`

**Purpose**: Prepare for production release
**Lifecycle**: Created from `develop`, merged to `main` and back to `develop`
**Example**: `release/v1.0.0`, `release/v2.3.4`

#### Bugfix Branches
Naming pattern:
- `bugfix/bug-description`

**Purpose**: Fix non-critical bugs
**Lifecycle**: Created from `develop`, merged back via PR
**Example**: `bugfix/ui-alignment`, `bugfix/form-validation`

## Branch Protection Rules

### Protection for `main` Branch

Configure these settings in GitHub repository settings → Branches → Branch protection rules:

#### Required Reviews
- ✅ **Require pull request reviews before merging**
  - Required approving reviews: 1 (or 2 for critical projects)
  - Dismiss stale pull request approvals when new commits are pushed
  - Require review from Code Owners (if CODEOWNERS file exists)

#### Status Checks
- ✅ **Require status checks to pass before merging**
  - Required checks:
    - Build and Test (from CI workflow)
    - Linting
    - Code scanning (if configured)
  - Require branches to be up to date before merging

#### Commit Requirements
- ✅ **Require linear history**
  - Prevents merge commits, requires rebase or squash merge
- ✅ **Require signed commits** (optional but recommended)
  - Ensures commit authenticity

#### Access Control
- ✅ **Include administrators**
  - Administrators must follow the same rules
- ✅ **Restrict who can push to matching branches**
  - Only allow specific users/teams to push directly
- ✅ **Allow force pushes**: ❌ Disabled
- ✅ **Allow deletions**: ❌ Disabled

#### Additional Settings
- ✅ **Require conversation resolution before merging**
  - All PR comments must be resolved
- ✅ **Lock branch**
  - Make the branch read-only (optional, for very stable branches)

### Protection for `develop` Branch

Less strict than `main`, but still protected:

#### Required Reviews
- ✅ **Require pull request reviews before merging**
  - Required approving reviews: 1

#### Status Checks
- ✅ **Require status checks to pass before merging**
  - Required checks:
    - Build and Test
    - Linting

#### Access Control
- ✅ **Allow force pushes**: ❌ Disabled
- ✅ **Allow deletions**: ❌ Disabled

### Protection for Feature Branches

Feature branches (`feat/*`, `feat:*`, `feature/*`) typically don't need protection rules, but you can optionally:

- Enable automatic deletion after merge
- Require CI checks to pass

## Setting Up Branch Protection

### Via GitHub Web Interface

1. **Navigate to Repository Settings**
   - Go to your repository on GitHub
   - Click "Settings" tab

2. **Access Branch Protection**
   - In the left sidebar, click "Branches"
   - Click "Add rule" or "Add classic branch protection rule"

3. **Configure Protection Rule**
   - **Branch name pattern**: `main` or `master`
   - Check all desired protection options (see above)
   - Click "Create" or "Save changes"

4. **Repeat for Other Branches**
   - Create separate rules for `develop`, `release/*`, etc.

### Via GitHub CLI

```bash
# Protect main branch
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks[strict]=true \
  --field required_status_checks[contexts][]=build \
  --field required_status_checks[contexts][]=test \
  --field enforce_admins=true \
  --field required_pull_request_reviews[required_approving_review_count]=1 \
  --field required_pull_request_reviews[dismiss_stale_reviews]=true \
  --field required_linear_history=true \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

### Via Terraform (Infrastructure as Code)

```hcl
resource "github_branch_protection" "main" {
  repository_id = github_repository.repo.node_id
  pattern       = "main"

  required_pull_request_reviews {
    required_approving_review_count = 1
    dismiss_stale_reviews           = true
    require_code_owner_reviews      = true
  }

  required_status_checks {
    strict   = true
    contexts = ["build", "test", "lint"]
  }

  enforce_admins        = true
  require_linear_history = true
  allow_force_pushes    = false
  allow_deletions       = false
}
```

## Branch Workflow Examples

### Example 1: Feature Development

```bash
# 1. Create feature branch
git checkout main
git pull origin main
git checkout -b feat/new-feature

# 2. Develop feature (commit regularly)
git add .
git commit -m "feat: add new feature"

# 3. Push to GitHub
git push origin feat/new-feature

# 4. Create Pull Request on GitHub
# - Add description
# - Request reviews
# - Wait for CI checks

# 5. After approval, merge via GitHub UI
# - Choose squash and merge or rebase and merge

# 6. Delete feature branch
git checkout main
git pull origin main
git branch -d feat/new-feature
```

### Example 2: Hotfix

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# 2. Fix the issue
git add .
git commit -m "fix: resolve critical bug"

# 3. Push and create PR
git push origin hotfix/critical-bug

# 4. After approval, merge to main
# GitHub Actions will automatically create a patch release

# 5. Backport to develop (if exists)
git checkout develop
git merge main
git push origin develop
```

### Example 3: Release Preparation

```bash
# 1. Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# 2. Prepare release
# - Update version numbers
# - Update CHANGELOG.md
# - Run final tests

# 3. Commit changes
git add .
git commit -m "chore: prepare release v1.2.0"

# 4. Push and create PR to main
git push origin release/v1.2.0

# 5. After approval and merge:
# - Tag is automatically created
# - Release is automatically published

# 6. Merge back to develop
git checkout develop
git merge release/v1.2.0
git push origin develop

# 7. Delete release branch
git branch -d release/v1.2.0
```

## Branch Naming Rules

### Allowed Patterns

✅ **Good branch names:**
- `feat/user-authentication`
- `feat:payment-integration`
- `feature/dashboard-redesign`
- `hotfix/security-patch`
- `bugfix/form-validation`
- `release/v1.0.0`
- `docs/api-documentation`

❌ **Bad branch names:**
- `test` (too generic)
- `my-changes` (not descriptive)
- `WIP` (not informative)
- `temp123` (temporary, unclear)

### Naming Convention Rules

1. **Use lowercase**: `feat/my-feature` not `Feat/My-Feature`
2. **Use hyphens**: `feat/user-auth` not `feat/user_auth`
3. **Be descriptive**: `feat/oauth-login` not `feat/login`
4. **Use prefixes**: `feat/`, `hotfix/`, `bugfix/`, `docs/`
5. **Keep it short**: But still meaningful

## Common Branch Operations

### Creating a Branch

```bash
# From current branch
git checkout -b feat/new-feature

# From specific branch
git checkout -b feat/new-feature main

# Push to remote
git push -u origin feat/new-feature
```

### Updating a Branch

```bash
# While on feature branch
git fetch origin
git rebase origin/main

# Or merge (if rebase not preferred)
git merge origin/main
```

### Deleting a Branch

```bash
# Delete local branch
git branch -d feat/completed-feature

# Force delete (if not merged)
git branch -D feat/abandoned-feature

# Delete remote branch
git push origin --delete feat/completed-feature
```

### Listing Branches

```bash
# Local branches
git branch

# Remote branches
git branch -r

# All branches
git branch -a

# With last commit info
git branch -v
```

## Automation and Workflows

### Automatic Branch Cleanup

Configure in repository settings:
- ✅ Automatically delete head branches (after PR merge)

### Branch Protection via CODEOWNERS

Create `.github/CODEOWNERS` file:

```
# Global owners
* @team-leads

# Specific paths
/src/tokenization/ @tokenization-team
/src/dao/ @governance-team
/.github/ @devops-team
/docs/ @documentation-team

# Require approval from security team for sensitive files
*.key @security-team
*.pem @security-team
/.github/workflows/ @devops-team @security-team
```

### CI/CD Integration

Your workflows should check branch names:

```yaml
on:
  pull_request:
    branches:
      - main
      - develop
      - 'release/**'
  push:
    branches:
      - main
      - develop
      - 'feat/**'
      - 'feat:*'
      - 'hotfix/**'
```

## Troubleshooting

### Cannot Push to Protected Branch

**Error**: Remote rejected (protected branch hook declined)

**Solution**: Create a pull request instead of pushing directly

```bash
# Create feature branch
git checkout -b feat/my-changes

# Make changes and push
git push origin feat/my-changes

# Create PR on GitHub
```

### Need to Update Protected Branch Urgently

**Options**:
1. Temporarily disable protection (not recommended)
2. Use admin override (if you have permissions)
3. Follow standard PR process with expedited review

### Branch Out of Sync

**Error**: Your branch is behind 'origin/main'

**Solution**: Update your branch

```bash
git fetch origin
git rebase origin/main
# or
git merge origin/main
```

## Best Practices

### DO ✅

- Use descriptive branch names
- Delete branches after merging
- Keep branches up to date with base branch
- Use pull requests for all changes
- Follow the branch naming convention
- Protect important branches
- Use feature branches for all development
- Write clear commit messages

### DON'T ❌

- Don't push directly to protected branches
- Don't use generic branch names
- Don't keep stale branches
- Don't force push to shared branches
- Don't bypass protection rules
- Don't use admin privileges to skip reviews
- Don't merge without CI passing
- Don't leave unresolved comments in PRs

## Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [Git Branching Strategies](https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
