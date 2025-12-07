#!/usr/bin/env node

/**
 * Version Bump Script
 * 
 * This script helps manage version bumps for the MBTQUniverse project.
 * It follows semantic versioning and can create tags automatically.
 * 
 * Usage:
 *   node scripts/version-bump.js [major|minor|patch|prepatch|preminor|premajor] [prerelease-id]
 * 
 * Examples:
 *   node scripts/version-bump.js patch              # 1.0.0 -> 1.0.1
 *   node scripts/version-bump.js minor              # 1.0.0 -> 1.1.0
 *   node scripts/version-bump.js major              # 1.0.0 -> 2.0.0
 *   node scripts/version-bump.js prepatch alpha     # 1.0.0 -> 1.0.1-alpha.0
 *   node scripts/version-bump.js preminor beta      # 1.0.0 -> 1.1.0-beta.0
 *   node scripts/version-bump.js premajor rc        # 1.0.0 -> 2.0.0-rc.0
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Parse arguments
const args = process.argv.slice(2);
const bumpType = args[0];
const prereleaseId = args[1];

const validBumpTypes = ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch'];

if (!bumpType || !validBumpTypes.includes(bumpType)) {
  console.error('❌ Error: Invalid or missing bump type');
  console.error('');
  console.error('Usage: node scripts/version-bump.js [bump-type] [prerelease-id]');
  console.error('');
  console.error('Bump types:');
  console.error('  - major     : 1.0.0 -> 2.0.0 (breaking changes)');
  console.error('  - minor     : 1.0.0 -> 1.1.0 (new features)');
  console.error('  - patch     : 1.0.0 -> 1.0.1 (bug fixes)');
  console.error('  - premajor  : 1.0.0 -> 2.0.0-[id].0 (pre-release major)');
  console.error('  - preminor  : 1.0.0 -> 1.1.0-[id].0 (pre-release minor)');
  console.error('  - prepatch  : 1.0.0 -> 1.0.1-[id].0 (pre-release patch)');
  console.error('');
  console.error('Pre-release IDs (optional for pre* bump types):');
  console.error('  - alpha     : Early testing, unstable');
  console.error('  - beta      : Feature complete, testing phase');
  console.error('  - rc        : Release candidate');
  console.error('');
  console.error('Examples:');
  console.error('  node scripts/version-bump.js patch');
  console.error('  node scripts/version-bump.js minor');
  console.error('  node scripts/version-bump.js major');
  console.error('  node scripts/version-bump.js prepatch alpha');
  console.error('  node scripts/version-bump.js preminor beta');
  console.error('  node scripts/version-bump.js premajor rc');
  process.exit(1);
}

if (bumpType.startsWith('pre') && !prereleaseId) {
  console.error('❌ Error: Pre-release bump type requires a pre-release ID');
  console.error('   Valid IDs: alpha, beta, rc');
  process.exit(1);
}

// Get current version from package.json
const packageJsonPath = join(rootDir, 'package.json');
let packageJson;
try {
  packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
} catch (error) {
  console.error('❌ Error: Could not read package.json');
  console.error(error.message);
  process.exit(1);
}

const currentVersion = packageJson.version;
console.log(`📦 Current version: ${currentVersion}`);

// Calculate new version
let newVersion;
try {
  // Split only on the first dot to preserve pre-release identifiers
  // E.g., "1.0.0-alpha.1" -> ["1", "0", "0-alpha.1"]
  const versionMatch = currentVersion.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!versionMatch) {
    throw new Error('Invalid version format');
  }
  
  let major = parseInt(versionMatch[1], 10);
  let minor = parseInt(versionMatch[2], 10);
  let patch = parseInt(versionMatch[3], 10);
  
  // Validate that we got valid numbers
  if (isNaN(major) || isNaN(minor) || isNaN(patch)) {
    throw new Error('Version contains non-numeric parts');
  }

  switch (bumpType) {
    case 'major':
      major++;
      minor = 0;
      patch = 0;
      newVersion = `${major}.${minor}.${patch}`;
      break;
    case 'minor':
      minor++;
      patch = 0;
      newVersion = `${major}.${minor}.${patch}`;
      break;
    case 'patch':
      patch++;
      newVersion = `${major}.${minor}.${patch}`;
      break;
    case 'premajor':
      major++;
      minor = 0;
      patch = 0;
      newVersion = `${major}.${minor}.${patch}-${prereleaseId}.0`;
      break;
    case 'preminor':
      minor++;
      patch = 0;
      newVersion = `${major}.${minor}.${patch}-${prereleaseId}.0`;
      break;
    case 'prepatch':
      patch++;
      newVersion = `${major}.${minor}.${patch}-${prereleaseId}.0`;
      break;
  }
} catch (error) {
  console.error('❌ Error: Could not parse version');
  console.error(error.message);
  process.exit(1);
}

console.log(`✨ New version: ${newVersion}`);
console.log('');

// Update package.json
packageJson.version = newVersion;
try {
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log('✅ Updated package.json');
} catch (error) {
  console.error('❌ Error: Could not write package.json');
  console.error(error.message);
  process.exit(1);
}

// Update CHANGELOG.md
try {
  execSync(`node ${join(rootDir, 'scripts', 'update-changelog.js')} ${newVersion}`, { 
    stdio: 'inherit' 
  });
  console.log('✅ Updated CHANGELOG.md');
} catch (error) {
  console.warn('⚠️  Warning: Could not update CHANGELOG.md');
  console.warn(error.message);
}

// Git operations
console.log('');
console.log('📋 Git operations:');

try {
  // Check if there are uncommitted changes
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    console.log('   Staging changes...');
    execSync('git add package.json CHANGELOG.md', { stdio: 'inherit' });
    
    console.log('   Committing changes...');
    execSync(`git commit -m "chore: bump version to v${newVersion}"`, { stdio: 'inherit' });
  }

  console.log('   Creating tag...');
  execSync(`git tag -a v${newVersion} -m "Release v${newVersion}"`, { stdio: 'inherit' });
  
  console.log('');
  console.log('✅ Version bump complete!');
  console.log('');
  console.log('📌 Next steps:');
  console.log('   1. Review the changes: git log -1');
  console.log('   2. Push the changes: git push origin main');
  console.log(`   3. Push the tag: git push origin v${newVersion}`);
  console.log('   4. The release workflow will automatically create a GitHub release');
  console.log('');
  console.log(`🎉 Release v${newVersion} is ready!`);
} catch (error) {
  console.error('');
  console.error('❌ Error during git operations:');
  console.error(error.message);
  console.error('');
  console.error('You may need to:');
  console.error('  - Commit changes manually');
  console.error(`  - Create tag manually: git tag -a v${newVersion} -m "Release v${newVersion}"`);
  console.error('  - Push manually: git push && git push --tags');
  process.exit(1);
}
