# DAO Governance Guide

## Overview

The DAO (Decentralized Autonomous Organization) Governance module enables transparent, democratic decision-making suitable for federal, state, and organizational use cases.

## Key Features

- **Proposal System**: Submit and track governance proposals
- **Voting Mechanisms**: Token-weighted, role-based, or quadratic voting
- **Execution Framework**: Automated execution of approved proposals
- **Audit Trails**: Complete transparency and accountability
- **Flexible Thresholds**: Customizable quorum and approval requirements

## Getting Started

### Registering Members

```javascript
import { DAOGovernance } from './dao/governance.js';

const dao = new DAOGovernance();

// Register federal entity
const treasury = dao.registerMember({
  id: 'treasury-001',
  name: 'U.S. Department of Treasury',
  votingPower: 100,
  role: 'admin',
  verified: true
});

// Register state entity
const stateFin = dao.registerMember({
  id: 'state-fin-001',
  name: 'State Finance Office',
  votingPower: 50,
  role: 'member',
  verified: true
});
```

### Creating Proposals

**TIP**: Include clear objectives and success criteria in proposals.

```javascript
// Create a proposal
const proposal = dao.createProposal({
  title: 'Increase Digital Asset Reserves by $10M',
  description: `
    Proposal to increase digital asset reserves to support
    expanded stablecoin issuance for infrastructure projects.
    
    Budget: $10,000,000
    Timeline: Q1 2025
    Expected Impact: Support 50+ infrastructure projects
  `,
  proposerId: treasury.id,
  category: 'funding',
  votingPeriod: 14 * 24 * 60 * 60 * 1000, // 14 days
  quorumThreshold: 0.6, // 60% participation required
  approvalThreshold: 0.66, // 66% approval required
  executionDelay: 3 * 24 * 60 * 60 * 1000 // 3 day delay
});

console.log(`Created: ${proposal.title}`);
console.log(`Voting ends: ${proposal.votingEndsAt}`);
```

### Voting on Proposals

```javascript
// Cast votes
dao.vote(proposal.id, treasury.id, 'for');
dao.vote(proposal.id, stateFin.id, 'for');

// Check current vote status
const currentProposal = dao.getProposal(proposal.id);
console.log('Current votes:', currentProposal.votes);
```

### Finalizing Proposals

**TIP**: Automatically finalize proposals after voting period ends.

```javascript
// After voting period ends
const finalized = dao.finalizeProposal(proposal.id);

console.log(`Status: ${finalized.status}`);
console.log(`Quorum met: ${finalized.result.quorumMet}`);
console.log(`Approval met: ${finalized.result.approvalMet}`);
console.log(`Participation rate: ${(finalized.result.participationRate * 100).toFixed(1)}%`);
console.log(`Approval rate: ${(finalized.result.approvalRate * 100).toFixed(1)}%`);
```

### Executing Approved Proposals

```javascript
// Wait for execution delay to pass
if (finalized.status === 'approved') {
  // After execution delay
  const executed = dao.executeProposal(proposal.id, {
    executedBy: 'system-bot',
    timestamp: new Date().toISOString(),
    actions: [
      'Transfer $10M to reserve account',
      'Update reserve tracking system',
      'Notify stakeholders'
    ]
  });
  
  console.log(`Executed at: ${executed.executedAt}`);
}
```

## Voting Mechanisms

### Token-Weighted Voting

Each member's vote is weighted by their voting power:

```javascript
// Member with 100 voting power
dao.registerMember({
  id: 'member-001',
  votingPower: 100
});

// Member with 50 voting power
dao.registerMember({
  id: 'member-002',
  votingPower: 50
});

// member-001's vote counts twice as much as member-002's
```

### Role-Based Voting

Different roles can have different voting powers:

```javascript
// Admin role: high voting power
dao.registerMember({
  id: 'admin-001',
  role: 'admin',
  votingPower: 100
});

// Member role: standard voting power
dao.registerMember({
  id: 'member-001',
  role: 'member',
  votingPower: 10
});
```

### Quadratic Voting (Custom Implementation)

**TIP**: Implement quadratic voting for more democratic outcomes.

```javascript
// PLACEHOLDER: Custom quadratic voting
// Vote cost increases quadratically: 1 vote = 1 token, 2 votes = 4 tokens, etc.
// This prevents wealthy members from dominating decisions
```

## Proposal Categories

Organize proposals by category:

- **governance**: Changes to governance structure
- **funding**: Budget and financial decisions
- **tokenization**: Stablecoin and asset management
- **infrastructure**: Technical and operational changes
- **policy**: Policy and procedure updates

```javascript
// Create categorized proposal
const policyProposal = dao.createProposal({
  title: 'Update Compliance Requirements',
  proposerId: 'admin-001',
  category: 'policy',
  // ...
});
```

## Best Practices

### For Federal Entities

1. **High Quorum Requirements**: Require 60-70% participation
2. **Supermajority Approval**: Use 66% or higher approval thresholds
3. **Extended Voting Periods**: Allow 14-30 days for major decisions
4. **Execution Delays**: Implement 3-7 day delays for security
5. **Verification Required**: Only allow verified members to vote

### For State Entities

1. **Balanced Thresholds**: 50-60% quorum and approval
2. **Reasonable Timelines**: 7-14 day voting periods
3. **Public Transparency**: Make all proposals and votes public
4. **Clear Categories**: Organize by department or function
5. **Regular Reviews**: Quarterly governance reviews

### For Organizations

1. **Flexible Governance**: Adjust thresholds based on proposal type
2. **Member Engagement**: Incentivize participation through rewards
3. **Clear Communication**: Detailed proposal descriptions
4. **Iterative Approach**: Start with simple proposals
5. **Community Input**: Gather feedback before formal proposals

## Security Considerations

### Preventing Vote Manipulation

```javascript
// One vote per member per proposal
if (proposal.voters.has(voterId)) {
  throw new Error('Member has already voted');
}

// Verify member is registered
const voter = this.members.get(voterId);
if (!voter) {
  throw new Error('Voter not registered');
}
```

### Execution Safety

```javascript
// Ensure execution delay has passed
const scheduledTime = new Date(proposal.executionScheduledAt).getTime();
if (Date.now() < scheduledTime) {
  throw new Error('Execution delay period has not elapsed');
}

// Only approved proposals can be executed
if (proposal.status !== 'approved') {
  throw new Error('Only approved proposals can be executed');
}
```

### Audit Trail

All governance actions are logged:

```javascript
// Vote record
{
  proposalId: 'PROP-123',
  voterId: 'member-001',
  choice: 'for',
  power: 100,
  timestamp: '2024-12-07T12:00:00Z'
}

// Proposal result
{
  quorumMet: true,
  approvalMet: true,
  participationRate: 0.75,
  approvalRate: 0.8,
  finalizedAt: '2024-12-21T12:00:00Z'
}
```

## Integration Examples

### With Tokenization System

```javascript
// Proposal to mint new stablecoins
const mintProposal = dao.createProposal({
  title: 'Mint 1M FDD for Infrastructure',
  description: 'Backed by Treasury allocation',
  proposerId: 'treasury-001',
  category: 'tokenization',
  metadata: {
    action: 'mint',
    stablecoinId: 'SC-FDD-001',
    amount: 1000000,
    authorization: ['treasury', 'finance']
  }
});

// After approval
if (mintProposal.status === 'approved') {
  stablecoin.mint(
    mintProposal.metadata.stablecoinId,
    mintProposal.metadata.amount,
    { proposalId: mintProposal.id }
  );
}
```

### With Staking System

```javascript
// Proposal to adjust staking rewards
const stakingProposal = dao.createProposal({
  title: 'Increase Staking Rewards to 7%',
  description: 'Incentivize longer-term participation',
  proposerId: 'admin-001',
  category: 'governance',
  metadata: {
    action: 'updateRewardRate',
    poolId: 'POOL-001',
    newRate: 0.07
  }
});
```

## API Reference

### registerMember(memberData)

Registers a new governance member.

**Parameters:**
- `id` (string): Unique member ID
- `name` (string): Member name
- `votingPower` (number): Voting weight (default: 1)
- `role` (string): Member role (default: 'member')
- `verified` (boolean): Verification status (default: false)

**Returns:** Member object

### createProposal(proposalData)

Creates a new proposal.

**Parameters:**
- `title` (string): Proposal title
- `description` (string): Detailed description
- `proposerId` (string): ID of proposer
- `category` (string): Proposal category
- `votingPeriod` (number): Voting duration in ms (default: 7 days)
- `quorumThreshold` (number): Required participation (default: 0.5)
- `approvalThreshold` (number): Required approval (default: 0.6)
- `executionDelay` (number): Delay before execution in ms (default: 2 days)

**Returns:** Proposal object

### vote(proposalId, voterId, voteChoice)

Casts a vote on a proposal.

**Parameters:**
- `proposalId` (string): ID of proposal
- `voterId` (string): ID of voter
- `voteChoice` (string): 'for', 'against', or 'abstain'

**Returns:** Vote result and current vote counts

### finalizeProposal(proposalId)

Finalizes voting and determines outcome.

**Parameters:**
- `proposalId` (string): ID of proposal

**Returns:** Proposal with result details

### executeProposal(proposalId, executionContext)

Executes an approved proposal.

**Parameters:**
- `proposalId` (string): ID of proposal
- `executionContext` (object): Execution details

**Returns:** Execution result

## Example Workflows

### Federal Budget Allocation

```javascript
// 1. Treasury creates proposal
const budgetProposal = dao.createProposal({
  title: 'Q1 2025 Digital Infrastructure Budget',
  description: '$50M allocation for digital asset infrastructure',
  proposerId: 'treasury-001',
  category: 'funding',
  votingPeriod: 21 * 24 * 60 * 60 * 1000, // 21 days
  quorumThreshold: 0.7,
  approvalThreshold: 0.66
});

// 2. Stakeholders vote
// (Multiple departments and oversight bodies)

// 3. Finalize after voting period
const result = dao.finalizeProposal(budgetProposal.id);

// 4. Execute if approved
if (result.status === 'approved') {
  dao.executeProposal(budgetProposal.id, {
    allocations: [
      { department: 'Infrastructure', amount: 20000000 },
      { department: 'Technology', amount: 30000000 }
    ]
  });
}
```

### State Policy Update

```javascript
// 1. State agency proposes policy change
const policyUpdate = dao.createProposal({
  title: 'Update Digital Asset Reporting Requirements',
  proposerId: 'state-agency-001',
  category: 'policy',
  votingPeriod: 14 * 24 * 60 * 60 * 1000
});

// 2. State departments vote

// 3. Implement approved policy
```

## Troubleshooting

### Low Participation

- Lower quorum thresholds
- Extend voting periods
- Increase communication
- Add participation incentives

### Proposal Rejection

- Gather feedback before formal proposal
- Adjust proposal based on concerns
- Break into smaller proposals
- Provide more detailed information

### Execution Failures

- Verify proposal approval status
- Check execution delay has passed
- Ensure sufficient permissions
- Review execution logs

---

For more information, see:
- [Tokenization Guide](TOKENIZATION.md)
- [Registry Guide](REGISTRY.md)
- [Staking Guide](STAKING.md)
