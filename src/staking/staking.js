/**
 * Staking and Incentive Module
 * 
 * Provides staking mechanisms for governance participation and rewards.
 * Suitable for federal, state, and organizational incentive programs.
 * 
 * Features:
 * - Token staking and lock-up periods
 * - Reward distribution
 * - Delegation and voting power
 * - Unstaking and withdrawal
 */

export class StakingManager {
  constructor() {
    this.stakes = new Map();
    this.pools = new Map();
    this.rewards = new Map();
  }

  /**
   * Create a staking pool
   * @param {Object} poolData - Pool configuration
   * @returns {Object} Created pool
   * 
   * TIP: Organizations can create pools for different governance levels
   * TIP: Set appropriate lock periods based on governance requirements
   */
  createPool(poolData) {
    const {
      name,
      tokenSymbol,
      minStake = 100,
      lockPeriod = 30 * 24 * 60 * 60 * 1000, // 30 days default
      rewardRate = 0.05, // 5% APY default
      maxStakers = null,
      metadata = {}
    } = poolData;

    const pool = {
      id: this._generateId('POOL'),
      name,
      tokenSymbol,
      minStake,
      lockPeriod,
      rewardRate,
      maxStakers,
      metadata,
      totalStaked: 0,
      stakerCount: 0,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    this.pools.set(pool.id, pool);
    return pool;
  }

  /**
   * Stake tokens in a pool
   * @param {string} poolId - ID of the pool
   * @param {string} stakerId - ID of the staker
   * @param {number} amount - Amount to stake
   * 
   * TIP: Staking increases voting power in governance
   * TIP: Consider implementing tiered rewards for longer lock periods
   */
  stake(poolId, stakerId, amount) {
    const pool = this.pools.get(poolId);
    if (!pool) {
      throw new Error('Pool not found');
    }

    if (pool.status !== 'active') {
      throw new Error('Pool is not active');
    }

    if (amount < pool.minStake) {
      throw new Error(`Minimum stake amount is ${pool.minStake}`);
    }

    if (pool.maxStakers && pool.stakerCount >= pool.maxStakers) {
      throw new Error('Pool has reached maximum number of stakers');
    }

    const stakeKey = `${poolId}-${stakerId}`;
    const existingStake = this.stakes.get(stakeKey);

    if (existingStake) {
      // Add to existing stake
      existingStake.amount += amount;
      existingStake.lastUpdated = new Date().toISOString();
    } else {
      // Create new stake
      const stake = {
        id: this._generateId('STAKE'),
        poolId,
        stakerId,
        amount,
        stakedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        unlockAt: new Date(Date.now() + pool.lockPeriod).toISOString(),
        rewardsEarned: 0,
        status: 'locked'
      };
      this.stakes.set(stakeKey, stake);
      pool.stakerCount++;
    }

    pool.totalStaked += amount;

    return this.stakes.get(stakeKey);
  }

  /**
   * Calculate and distribute rewards
   * @param {string} poolId - ID of the pool
   * 
   * TIP: Automate reward distribution through scheduled jobs
   * TIP: Federal/state entities should maintain detailed reward records
   */
  distributeRewards(poolId) {
    const pool = this.pools.get(poolId);
    if (!pool) {
      throw new Error('Pool not found');
    }

    const rewards = [];
    
    // Find all stakes for this pool
    for (const [key, stake] of this.stakes.entries()) {
      if (stake.poolId === poolId && stake.status === 'locked') {
        // Calculate time-based rewards
        const stakeTime = Date.now() - new Date(stake.stakedAt).getTime();
        const yearInMs = 365 * 24 * 60 * 60 * 1000;
        const reward = (stake.amount * pool.rewardRate * stakeTime) / yearInMs;

        stake.rewardsEarned += reward;

        rewards.push({
          stakeId: stake.id,
          stakerId: stake.stakerId,
          reward,
          calculatedAt: new Date().toISOString()
        });
      }
    }

    return {
      poolId,
      distributedAt: new Date().toISOString(),
      totalRewardsDistributed: rewards.reduce((sum, r) => sum + r.reward, 0),
      rewards
    };
  }

  /**
   * Unstake tokens from a pool
   * @param {string} poolId - ID of the pool
   * @param {string} stakerId - ID of the staker
   * @param {number} amount - Amount to unstake
   * 
   * TIP: Enforce lock periods to maintain governance stability
   * TIP: Consider penalties for early unstaking
   */
  unstake(poolId, stakerId, amount) {
    const stakeKey = `${poolId}-${stakerId}`;
    const stake = this.stakes.get(stakeKey);

    if (!stake) {
      throw new Error('Stake not found');
    }

    const now = Date.now();
    const unlockTime = new Date(stake.unlockAt).getTime();

    if (now < unlockTime) {
      throw new Error(`Tokens are locked until ${stake.unlockAt}`);
    }

    if (amount > stake.amount) {
      throw new Error('Insufficient staked amount');
    }

    const pool = this.pools.get(poolId);
    stake.amount -= amount;
    pool.totalStaked -= amount;

    if (stake.amount === 0) {
      stake.status = 'withdrawn';
      pool.stakerCount--;
    }

    return {
      success: true,
      unstaked: amount,
      remainingStake: stake.amount,
      rewardsEarned: stake.rewardsEarned
    };
  }

  /**
   * Claim accumulated rewards
   * @param {string} poolId - ID of the pool
   * @param {string} stakerId - ID of the staker
   */
  claimRewards(poolId, stakerId) {
    const stakeKey = `${poolId}-${stakerId}`;
    const stake = this.stakes.get(stakeKey);

    if (!stake) {
      throw new Error('Stake not found');
    }

    if (stake.rewardsEarned === 0) {
      throw new Error('No rewards to claim');
    }

    const rewards = stake.rewardsEarned;
    stake.rewardsEarned = 0;

    const rewardKey = `${stakerId}-${Date.now()}`;
    this.rewards.set(rewardKey, {
      id: this._generateId('REWARD'),
      stakerId,
      poolId,
      amount: rewards,
      claimedAt: new Date().toISOString()
    });

    return {
      success: true,
      claimed: rewards,
      transactionId: this.rewards.get(rewardKey).id
    };
  }

  /**
   * Get stake information
   * @param {string} poolId - ID of the pool
   * @param {string} stakerId - ID of the staker
   */
  getStake(poolId, stakerId) {
    const stakeKey = `${poolId}-${stakerId}`;
    return this.stakes.get(stakeKey);
  }

  /**
   * Get pool information
   * @param {string} poolId - ID of the pool
   */
  getPool(poolId) {
    return this.pools.get(poolId);
  }

  /**
   * List all stakes for a staker
   * @param {string} stakerId - ID of the staker
   */
  getStakerStakes(stakerId) {
    const stakes = [];
    for (const stake of this.stakes.values()) {
      if (stake.stakerId === stakerId) {
        stakes.push(stake);
      }
    }
    return stakes;
  }

  /**
   * List all pools
   */
  listPools() {
    return Array.from(this.pools.values());
  }

  /**
   * Get staking statistics
   */
  getStatistics() {
    const pools = Array.from(this.pools.values());
    const stakes = Array.from(this.stakes.values());
    const activeStakes = stakes.filter(s => s.status === 'locked');

    return {
      totalPools: pools.length,
      activePools: pools.filter(p => p.status === 'active').length,
      totalStaked: pools.reduce((sum, p) => sum + p.totalStaked, 0),
      totalStakers: new Set(stakes.map(s => s.stakerId)).size,
      activeStakes: activeStakes.length,
      totalRewardsDistributed: Array.from(this.rewards.values())
        .reduce((sum, r) => sum + r.amount, 0)
    };
  }

  // Private helper methods
  _generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }
}

export default StakingManager;
