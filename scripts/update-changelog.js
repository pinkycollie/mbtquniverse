#!/usr/bin/env node

/**
 * Update Changelog Script
 * 
 * This script updates CHANGELOG.md with a new version entry.
 * 
 * Usage:
 *   node scripts/update-changelog.js <version>
 * 
 * Example:
 *   node scripts/update-changelog.js 1.2.3
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const version = process.argv[2];

if (!version) {
  console.error('❌ Error: Version argument is required');
  console.error('Usage: node scripts/update-changelog.js <version>');
  console.error('Example: node scripts/update-changelog.js 1.2.3');
  process.exit(1);
}

// Validate version format
if (!/^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/.test(version)) {
  console.error('❌ Error: Invalid version format');
  console.error('Valid formats: 1.0.0, 2.3.4, 1.0.0-alpha.1, 5.9.0-beta.3');
  process.exit(1);
}

const changelogPath = join(rootDir, 'CHANGELOG.md');
const date = new Date().toISOString().split('T')[0];

try {
  let changelog;
  
  // Create CHANGELOG.md if it doesn't exist
  if (!existsSync(changelogPath)) {
    changelog = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

`;
  } else {
    changelog = readFileSync(changelogPath, 'utf8');
  }

  // Create new version entry
  const newEntry = `
## [v${version}] - ${date}

### Added
- Version bump to v${version}

### Changed
- See commit history for detailed changes

`;

  // Find the position to insert the new entry
  const unreleasedMatch = changelog.match(/## \[Unreleased\]\s*\n/);
  
  if (unreleasedMatch) {
    // Insert after [Unreleased] section
    const insertPosition = unreleasedMatch.index + unreleasedMatch[0].length;
    changelog = 
      changelog.slice(0, insertPosition) + 
      newEntry + 
      changelog.slice(insertPosition);
  } else {
    // If no [Unreleased] section, insert after the header
    const headerMatch = changelog.match(/# Changelog.*?\n\n/s);
    if (headerMatch) {
      const insertPosition = headerMatch.index + headerMatch[0].length;
      changelog = 
        changelog.slice(0, insertPosition) + 
        `## [Unreleased]\n${newEntry}` + 
        changelog.slice(insertPosition);
    } else {
      // If no structure found, append at the end
      changelog += `\n## [v${version}] - ${date}\n\n### Added\n- Version bump to v${version}\n`;
    }
  }

  writeFileSync(changelogPath, changelog);
  console.log(`✅ Updated CHANGELOG.md with v${version}`);
} catch (error) {
  console.error('❌ Error updating CHANGELOG.md:');
  console.error(error.message);
  process.exit(1);
}
