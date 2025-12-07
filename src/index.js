/**
 * MBTQUniverse - Quantum Ecosystem Hub
 * Main Entry Point
 * 
 * A clean, decentralized platform for DAO governance, tokenization,
 * agent/project registration, staking, and metrics tracking.
 * 
 * NO third-party company integrations - pure, generic platform.
 */

import StablecoinManager from './tokenization/stablecoin.js';
import DAOGovernance from './dao/governance.js';
import Registry from './registry/registry.js';
import StakingManager from './staking/staking.js';
import APIGateway from './api/gateway.js';
import MetricsManager from './metrics/metrics.js';

/**
 * Main Platform Class
 * Orchestrates all platform modules
 */
export class MBTQUniverse {
  constructor() {
    // Initialize all modules
    this.stablecoin = new StablecoinManager();
    this.dao = new DAOGovernance();
    this.registry = new Registry();
    this.staking = new StakingManager();
    this.metrics = new MetricsManager();
    
    // Initialize API Gateway with all modules
    this.api = new APIGateway({
      stablecoin: this.stablecoin,
      dao: this.dao,
      registry: this.registry,
      staking: this.staking,
      metrics: this.metrics
    });

    console.log('✅ MBTQUniverse Platform Initialized');
    console.log('📊 All modules loaded successfully');
  }

  /**
   * Get platform status
   */
  getStatus() {
    return {
      platform: 'MBTQUniverse',
      version: '1.0.0',
      status: 'active',
      modules: {
        stablecoin: 'active',
        dao: 'active',
        registry: 'active',
        staking: 'active',
        metrics: 'active',
        api: 'active'
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get platform statistics
   */
  async getStatistics() {
    return {
      tokenization: {
        stablecoins: this.stablecoin.listStablecoins().length,
        transactions: this.stablecoin.transactions.length
      },
      governance: {
        proposals: this.dao.proposals.size,
        members: this.dao.members.size
      },
      registry: this.registry.getStatistics(),
      staking: this.staking.getStatistics(),
      api: this.api.getStatistics(),
      metrics: this.metrics.getDashboardData()
    };
  }

  /**
   * Demo: Initialize platform with sample data
   * 
   * TIP: Use this to test the platform and understand how modules work together
   */
  async initializeDemo() {
    console.log('\n🚀 Initializing Demo Data...\n');

    // 1. Create a stablecoin
    console.log('1️⃣  Creating Federal Digital Dollar (FDD)...');
    const fdd = this.stablecoin.createStablecoin({
      name: 'Federal Digital Dollar',
      symbol: 'FDD',
      backingAsset: 'USD',
      initialSupply: 1000000,
      issuer: 'Federal Reserve (PLACEHOLDER)',
      regulatoryFramework: 'Federal Digital Asset Guidelines',
      complianceLevel: 'federal'
    });
    console.log(`   ✅ Created ${fdd.name} (${fdd.symbol})`);

    // 2. Register governance members
    console.log('\n2️⃣  Registering DAO Members...');
    const member1 = this.dao.registerMember({
      id: 'member-001',
      name: 'Treasury Department',
      votingPower: 100,
      role: 'admin',
      verified: true
    });
    const member2 = this.dao.registerMember({
      id: 'member-002',
      name: 'State Finance Office',
      votingPower: 50,
      role: 'member',
      verified: true
    });
    console.log(`   ✅ Registered ${this.dao.members.size} members`);

    // 3. Create a governance proposal
    console.log('\n3️⃣  Creating Governance Proposal...');
    const proposal = this.dao.createProposal({
      title: 'Increase Staking Rewards by 2%',
      description: 'Proposal to incentivize long-term participation in governance',
      proposerId: member1.id,
      category: 'governance',
      votingPeriod: 7 * 24 * 60 * 60 * 1000
    });
    console.log(`   ✅ Created proposal: ${proposal.title}`);

    // 4. Register agents and projects
    console.log('\n4️⃣  Registering Agents and Projects...');
    const agent = this.registry.registerAgent({
      name: 'Governance Bot',
      description: 'Automated proposal monitoring and notification system',
      type: 'service',
      capabilities: ['monitoring', 'notifications', 'analytics'],
      owner: 'system',
      verified: true
    });
    const project = this.registry.registerProject({
      name: 'Digital Asset Platform',
      description: 'State-level digital asset management system',
      category: 'tokenization',
      owner: member2.id,
      tags: ['stablecoin', 'government', 'infrastructure'],
      verified: true
    });
    console.log(`   ✅ Registered ${this.registry.agents.size} agents and ${this.registry.projects.size} projects`);

    // 5. Create staking pool
    console.log('\n5️⃣  Creating Staking Pool...');
    const pool = this.staking.createPool({
      name: 'Governance Staking Pool',
      tokenSymbol: 'FDD',
      minStake: 1000,
      lockPeriod: 30 * 24 * 60 * 60 * 1000,
      rewardRate: 0.05
    });
    console.log(`   ✅ Created pool: ${pool.name}`);

    // 6. Record metrics
    console.log('\n6️⃣  Recording Platform Metrics...');
    this.metrics.recordEvent({
      type: 'platform',
      actor: 'system',
      action: 'demo_initialized',
      target: 'platform'
    });
    this.metrics.recordMetric({
      category: 'platform',
      name: 'initialization',
      value: 1,
      unit: 'count'
    });
    console.log(`   ✅ Metrics recorded`);

    console.log('\n✨ Demo initialization complete!\n');

    // Return summary
    return {
      stablecoin: fdd,
      members: [member1, member2],
      proposal,
      agent,
      project,
      pool,
      statistics: await this.getStatistics()
    };
  }
}

// Export singleton instance
export const platform = new MBTQUniverse();

// If running directly, show platform info
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('   MBTQUniverse - Quantum Ecosystem Hub');
  console.log('   A Clean Platform for Digital Assets & Governance');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('📋 Platform Status:');
  console.log(JSON.stringify(platform.getStatus(), null, 2));
  
  console.log('\n💡 To initialize demo data, run:');
  console.log('   await platform.initializeDemo();\n');
}

export default platform;
