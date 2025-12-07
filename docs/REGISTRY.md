# Agent & Project Registry Guide

## Overview

The Registry module provides a decentralized directory for agents, projects, and services. It enables discovery, collaboration, and verification without relying on third-party platforms.

## Use Cases

- **Service Discovery**: Find agents and services for specific tasks
- **Project Showcase**: Display organizational initiatives
- **Collaboration**: Connect projects with complementary capabilities
- **Verification**: Establish trust through verification system
- **Metrics Tracking**: Monitor project and agent performance

## Registering Agents

Agents can be AI systems, automated services, or organizational entities:

```javascript
import { Registry } from './registry/registry.js';

const registry = new Registry();

// Register a monitoring agent
const monitoringAgent = registry.registerAgent({
  name: 'Governance Monitor',
  description: 'Tracks proposal activity and sends notifications',
  type: 'service',
  capabilities: [
    'proposal-monitoring',
    'email-notifications',
    'metrics-reporting'
  ],
  endpoints: [
    { type: 'webhook', url: 'https://example.org/monitor' },
    { type: 'api', url: 'https://example.org/api' }
  ],
  owner: 'treasury-dept',
  verified: false,
  metadata: {
    version: '1.0.0',
    uptime: '99.9%',
    responseTime: '<100ms'
  }
});

console.log(`Registered agent: ${monitoringAgent.id}`);
```

### Agent Types

- **service**: Automated services and bots
- **ai**: AI-powered agents
- **human**: Human operators or teams
- **hybrid**: Combination of automated and human

## Registering Projects

Projects represent organizational initiatives, DAOs, or public services:

```javascript
// Register a tokenization project
const project = registry.registerProject({
  name: 'State Digital Asset Platform',
  description: 'Comprehensive digital asset management for state operations',
  category: 'tokenization',
  owner: 'state-treasury',
  repository: 'https://github.com/state/digital-assets',
  website: 'https://digitalassets.state.gov',
  tags: [
    'stablecoin',
    'government',
    'treasury',
    'compliance'
  ],
  verified: false,
  metadata: {
    launched: '2024-01-15',
    budget: 5000000,
    team_size: 12,
    status: 'active'
  }
});

console.log(`Registered project: ${project.id}`);
```

### Project Categories

- **governance**: DAO and governance systems
- **tokenization**: Digital asset and stablecoin projects
- **infrastructure**: Core platform and technical projects
- **analytics**: Data and metrics systems
- **other**: Miscellaneous projects

## Searching & Discovery

### Finding Agents

```javascript
// Search by capability
const monitoringAgents = registry.searchAgents({
  capability: 'proposal-monitoring',
  verified: true
});

// Search by type
const aiAgents = registry.searchAgents({
  type: 'ai',
  status: 'active'
});

// Search by owner
const orgAgents = registry.searchAgents({
  owner: 'treasury-dept'
});
```

### Finding Projects

```javascript
// Search by category
const tokenProjects = registry.searchProjects({
  category: 'tokenization',
  verified: true
});

// Search by tag
const govProjects = registry.searchProjects({
  tag: 'government',
  status: 'active'
});

// Search by owner
const stateProjects = registry.searchProjects({
  owner: 'state-treasury'
});
```

## Verification System

**TIP**: Federal/state entities should require formal verification.

```javascript
// Verify an agent
registry.verify('agent', monitoringAgent.id, {
  verifier: 'security-team',
  method: 'code-audit',
  notes: 'Passed security audit and compliance review'
});

// Verify a project
registry.verify('project', project.id, {
  verifier: 'oversight-board',
  method: 'documentation-review',
  notes: 'Meets all federal digital asset guidelines'
});

// Check verification status
const verifiedAgent = registry.getAgent(monitoringAgent.id);
console.log(`Verified: ${verifiedAgent.verified}`);
console.log(`Verified by: ${verifiedAgent.verificationData.verifiedBy}`);
console.log(`Verified at: ${verifiedAgent.verificationData.verifiedAt}`);
```

## Updating Registrations

```javascript
// Update agent
registry.updateAgent(monitoringAgent.id, {
  capabilities: [
    'proposal-monitoring',
    'email-notifications',
    'metrics-reporting',
    'slack-integration'  // New capability
  ],
  metadata: {
    version: '1.1.0',
    uptime: '99.95%',
    responseTime: '<80ms'
  }
});

// Update project
registry.updateProject(project.id, {
  tags: [
    'stablecoin',
    'government',
    'treasury',
    'compliance',
    'cbdc'  // New tag
  ],
  metadata: {
    team_size: 15,  // Team expanded
    status: 'scaling'
  }
});
```

## Metrics Tracking

```javascript
// Get agent details with metrics
const agent = registry.getAgent(monitoringAgent.id);
console.log('Agent Metrics:', agent.metrics);
// {
//   calls: 1245,
//   successRate: 0.998,
//   averageResponseTime: 75
// }

// Get project details with metrics
const proj = registry.getProject(project.id);
console.log('Project Metrics:', proj.metrics);
// {
//   stars: 156,
//   contributors: 12,
//   activity: 'high'
// }
```

## Best Practices

### For Federal Entities

1. **Mandatory Verification**: Require verification for all agents/projects
2. **Security Audits**: Regular audits of registered services
3. **Access Control**: Limit who can register agents/projects
4. **Documentation Requirements**: Detailed descriptions and metadata
5. **Regular Reviews**: Quarterly reviews of active registrations

### For State Entities

1. **Clear Categories**: Use standardized categorization
2. **Public Directory**: Make registry searchable by public
3. **Verification Process**: Establish clear verification criteria
4. **Performance Tracking**: Monitor agent/project metrics
5. **Deactivation Policy**: Remove inactive or non-compliant entries

### For Organizations

1. **Comprehensive Metadata**: Include all relevant information
2. **Regular Updates**: Keep registrations current
3. **Tag Consistently**: Use standard tags for discoverability
4. **Showcase Achievements**: Highlight metrics and successes
5. **Community Engagement**: Encourage collaboration

## Integration Examples

### With Metrics System

```javascript
// Track agent usage
metrics.recordEvent({
  type: 'agent',
  actor: monitoringAgent.id,
  action: 'api_call',
  target: 'governance_check'
});

// Update agent metrics
const agent = registry.getAgent(monitoringAgent.id);
agent.metrics.calls++;
agent.metrics.successRate = 0.998;
```

### With DAO Governance

```javascript
// Create proposal to verify a project
const verificationProposal = dao.createProposal({
  title: `Verify Project: ${project.name}`,
  description: 'Proposal to officially verify state digital asset platform',
  proposerId: 'oversight-board',
  category: 'governance',
  metadata: {
    action: 'verify_project',
    projectId: project.id
  }
});

// After approval
if (verificationProposal.status === 'approved') {
  registry.verify('project', project.id, {
    verifier: 'dao-governance',
    method: 'dao-vote',
    notes: `Approved via proposal ${verificationProposal.id}`
  });
}
```

## API Reference

### registerAgent(agentData)

Registers a new agent.

**Parameters:**
- `name` (string): Agent name
- `description` (string): Detailed description
- `type` (string): Agent type (service, ai, human, hybrid)
- `capabilities` (array): List of capabilities
- `endpoints` (array): API endpoints
- `owner` (string): Owner ID
- `verified` (boolean): Verification status (default: false)
- `metadata` (object): Additional metadata

**Returns:** Agent object with unique ID

### registerProject(projectData)

Registers a new project.

**Parameters:**
- `name` (string): Project name
- `description` (string): Detailed description
- `category` (string): Project category
- `owner` (string): Owner ID
- `repository` (string): Git repository URL (optional)
- `website` (string): Project website (optional)
- `tags` (array): Searchable tags
- `verified` (boolean): Verification status (default: false)
- `metadata` (object): Additional metadata

**Returns:** Project object with unique ID

### searchAgents(criteria)

Searches for agents.

**Parameters:**
- `type` (string): Filter by type
- `capability` (string): Filter by capability
- `verified` (boolean): Filter by verification
- `status` (string): Filter by status
- `owner` (string): Filter by owner

**Returns:** Array of matching agents

### searchProjects(criteria)

Searches for projects.

**Parameters:**
- `category` (string): Filter by category
- `tag` (string): Filter by tag
- `verified` (boolean): Filter by verification
- `status` (string): Filter by status
- `owner` (string): Filter by owner

**Returns:** Array of matching projects

### verify(entityType, entityId, verificationData)

Verifies an agent or project.

**Parameters:**
- `entityType` (string): 'agent' or 'project'
- `entityId` (string): Entity ID
- `verificationData` (object): Verification details

**Returns:** Updated entity object

## Example Use Cases

### Federal Agency Service Directory

```javascript
// Register federal services
const taxAgent = registry.registerAgent({
  name: 'IRS Tax Calculation Service',
  type: 'service',
  capabilities: ['tax-calculation', 'compliance-check'],
  owner: 'irs',
  verified: true
});

const treasuryAgent = registry.registerAgent({
  name: 'Treasury Payment Gateway',
  type: 'service',
  capabilities: ['payment-processing', 'wire-transfer'],
  owner: 'treasury',
  verified: true
});

// Find all verified federal services
const federalServices = registry.searchAgents({
  verified: true,
  status: 'active'
});
```

### State Digital Transformation Projects

```javascript
// Register state initiatives
const dmvProject = registry.registerProject({
  name: 'Digital Driver License System',
  category: 'infrastructure',
  tags: ['identity', 'mobile', 'blockchain'],
  owner: 'state-dmv'
});

const votingProject = registry.registerProject({
  name: 'Secure Online Voting Platform',
  category: 'governance',
  tags: ['voting', 'security', 'accessibility'],
  owner: 'state-elections'
});
```

## Statistics & Reporting

```javascript
// Get registry statistics
const stats = registry.getStatistics();
console.log(`Total Agents: ${stats.totalAgents}`);
console.log(`Verified Agents: ${stats.verifiedAgents}`);
console.log(`Total Projects: ${stats.totalProjects}`);
console.log(`Verified Projects: ${stats.verifiedProjects}`);
console.log(`Categories: ${stats.categories.join(', ')}`);
```

---

For more information, see:
- [DAO Governance Guide](DAO.md)
- [Tokenization Guide](TOKENIZATION.md)
- [API Reference](API.md)
