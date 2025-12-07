# Staking & Incentive Guide

## Overview

The Staking module provides mechanisms for locking tokens to earn rewards and participate in governance. This is suitable for federal, state, and organizational incentive programs.

## Quick Start

```javascript
import { StakingManager } from './staking/staking.js';

const staking = new StakingManager();

// Create a staking pool
const pool = staking.createPool({
  name: 'Governance Participation Pool',
  tokenSymbol: 'FDD',
  minStake: 1000,
  lockPeriod: 30 * 24 * 60 * 60 * 1000, // 30 days
  rewardRate: 0.05 // 5% APY
});

// Stake tokens
staking.stake(pool.id, 'user-001', 5000);

// Distribute rewards
staking.distributeRewards(pool.id);

// Claim rewards
staking.claimRewards(pool.id, 'user-001');
```

For complete documentation, see the inline comments in `src/staking/staking.js`.
