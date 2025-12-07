# Manual Deployment Guide

This guide explains how to deploy MBTQUniverse manually using GitHub Actions workflows. All deployment workflows have been configured to require manual approval to ensure controlled deployments.

## Overview

MBTQUniverse uses a manual deployment workflow to prevent automatic deployments. This ensures that:

1. **Human Review**: All deployments require explicit approval by authorized personnel
2. **Controlled Releases**: Deployments only occur when intentionally triggered
3. **Environment Protection**: Production and staging environments are protected
4. **Audit Trail**: All deployments are logged and traceable

## Deployment Workflow

### Prerequisites

Before deploying, ensure:

1. All code changes are committed and pushed to the repository
2. Tests and linting pass successfully
3. You have the necessary permissions to trigger workflows
4. Deployment secrets and credentials are configured in GitHub

### Step 1: Build and Review

The build process includes:
- Code linting
- Running tests
- Building the application
- Creating build artifacts

These steps run automatically when the deployment workflow is triggered but do NOT deploy automatically.

### Step 2: Manual Deployment Trigger

To deploy, follow these steps:

1. **Navigate to GitHub Actions**
   - Go to your repository on GitHub
   - Click on the "Actions" tab

2. **Select Deploy Workflow**
   - Find "Deploy" in the list of workflows
   - Click on it

3. **Run Workflow**
   - Click the "Run workflow" button (top right)
   - Select the branch to deploy from (typically `main`)
   - Choose deployment target:
     - `vercel` - Vercel platform
     - `netlify` - Netlify platform
     - `cloudflare` - Cloudflare Workers
     - `heroku` - Heroku platform
     - `docker` - Docker Hub
     - `gh-pages` - GitHub Pages
     - `nginx` - Nginx server
   - Choose environment:
     - `production` - Live production environment
     - `staging` - Staging/testing environment
   - Click "Run workflow" to start

4. **Monitor Deployment**
   - Watch the workflow execution in real-time
   - Review build logs
   - Verify deployment success

### Step 3: Environment Approval (Optional)

For additional security, you can configure GitHub environment protection rules:

1. **Go to Repository Settings**
   - Click "Settings" tab
   - Navigate to "Environments"

2. **Configure Protection Rules**
   - Select `production` or `staging` environment
   - Enable "Required reviewers"
   - Add authorized reviewers (specific users or teams)
   - Optionally set "Wait timer" for delayed deployments

3. **Approval Process**
   - When deployment workflow runs, it will pause before deploying
   - Required reviewers receive notification
   - Reviewer must explicitly approve the deployment
   - Deployment proceeds only after approval

## Release Workflow

The release workflow is also manual and creates GitHub releases:

### Triggering a Release

1. **Navigate to GitHub Actions**
   - Go to repository → Actions tab
   - Select "Release Management" workflow

2. **Run Workflow**
   - Click "Run workflow"
   - Enter version (e.g., `v1.0.0`, `v2.3.4-beta.1`)
   - Check "Mark as pre-release" if applicable
   - Click "Run workflow"

3. **Review Release**
   - Workflow creates release notes
   - Updates package.json version
   - Creates GitHub release tag
   - No automatic deployment occurs

## Version Bump Workflow

The version bump workflow helps manage semantic versioning:

1. **Navigate to Actions** → "Version Bump" workflow
2. **Run Workflow** with parameters:
   - Bump type: `patch`, `minor`, `major`, `prepatch`, `preminor`, `premajor`
   - Pre-release ID: `alpha`, `beta`, `rc` (optional)
   - Target branch: typically `main`
3. **Workflow Actions**:
   - Updates version in package.json
   - Updates CHANGELOG.md
   - Creates version tag
   - Pushes changes
   - Does NOT trigger deployment

## Best Practices

### For Production Deployments

1. **Review Changes**
   - Review all code changes since last deployment
   - Ensure all tests pass
   - Check for security vulnerabilities

2. **Staging First**
   - Always deploy to staging environment first
   - Test thoroughly in staging
   - Only promote to production after validation

3. **Communication**
   - Notify team members before deployment
   - Document deployment in team chat/logs
   - Have rollback plan ready

4. **Timing**
   - Deploy during low-traffic periods when possible
   - Avoid deployments during business-critical hours
   - Schedule maintenance windows if needed

### For Staging Deployments

1. **Test Features**
   - Deploy new features to staging first
   - Perform integration testing
   - Validate against staging data

2. **Frequent Updates**
   - Deploy to staging more frequently
   - Use for QA and testing
   - Share with stakeholders for feedback

## Rollback Process

If a deployment needs to be rolled back:

1. **Identify Previous Version**
   - Check GitHub releases for last stable version
   - Note the commit SHA or tag

2. **Redeploy Previous Version**
   - Trigger deployment workflow
   - Select branch/tag of previous version
   - Deploy to affected environment

3. **Document Issues**
   - Create issue describing problem
   - Link to failed deployment
   - Document rollback decision

## Deployment Targets

### Vercel
- Modern web applications
- Serverless functions
- Automatic preview deployments disabled

### Netlify
- Static sites and JAMstack apps
- Serverless functions
- Form handling

### Cloudflare Workers
- Edge computing
- Global CDN
- Serverless execution

### Heroku
- Full-stack applications
- Container deployments
- Add-ons and databases

### Docker Hub
- Container images
- Multi-platform support
- Version tagging

### GitHub Pages
- Static documentation sites
- Public project pages
- Custom domain support

### Nginx
- Custom server deployments
- SSH-based deployment
- Direct server control

## Security Considerations

1. **Secrets Management**
   - Store all credentials in GitHub Secrets
   - Never commit secrets to repository
   - Rotate secrets regularly

2. **Access Control**
   - Limit workflow permissions
   - Use environment protection rules
   - Audit deployment access

3. **Audit Trail**
   - All deployments logged in Actions
   - Review deployment history regularly
   - Track who deployed what and when

## Troubleshooting

### Workflow Won't Trigger
- Check branch permissions
- Verify you have workflow trigger permissions
- Ensure workflow file is valid YAML

### Build Fails
- Review build logs in Actions tab
- Check dependency versions
- Verify environment variables

### Deployment Fails
- Verify deployment credentials in Secrets
- Check target platform status
- Review deployment logs

### Approval Not Working
- Verify environment protection rules
- Check reviewer permissions
- Ensure reviewers are notified

## Getting Help

If you encounter issues with manual deployment:

1. Check workflow run logs in GitHub Actions
2. Review this documentation
3. Consult platform-specific documentation (Vercel, Netlify, etc.)
4. Create an issue in the repository
5. Contact repository maintainers

## Summary

All deployments in MBTQUniverse require manual approval to ensure:
- ✅ No automatic deployments on push
- ✅ Explicit approval required for each deployment
- ✅ Controlled release process
- ✅ Full audit trail of all deployments
- ✅ Environment-specific deployment choices
- ✅ Multiple deployment target support

This approach ensures maximum control and security for production deployments.
