/**
 * Example: State Digital Asset Platform
 * 
 * This example shows how a state government might implement
 * a digital asset platform for treasury operations.
 */

import { MBTQUniverse } from '../src/index.js';

async function stateDigitalAssetExample() {
  console.log('='.repeat(60));
  console.log('State Digital Asset Platform Example');
  console.log('='.repeat(60));

  const platform = new MBTQUniverse();

  // Create state digital currency
  console.log('\n1. Creating State Digital Currency...');
  const stateCoin = platform.stablecoin.createStablecoin({
    name: 'State Digital Treasury Token',
    symbol: 'SDTT',
    backingAsset: 'USD',
    initialSupply: 50000000, // $50 million
    issuer: 'State Treasury Department',
    regulatoryFramework: 'State Digital Asset Act',
    complianceLevel: 'state'
  });
  console.log(`✅ Created ${stateCoin.name}`);

  // Register state departments
  console.log('\n2. Registering State Departments...');
  platform.dao.registerMember({
    id: 'state-treasury',
    name: 'State Treasury Department',
    votingPower: 100,
    role: 'admin',
    verified: true
  });
  
  platform.dao.registerMember({
    id: 'state-finance',
    name: 'State Finance Office',
    votingPower: 80,
    role: 'admin',
    verified: true
  });

  // Register the platform as a project
  console.log('\n3. Registering Digital Asset Platform...');
  const project = platform.registry.registerProject({
    name: 'State Digital Asset Management System',
    description: 'Comprehensive platform for state treasury digital assets',
    category: 'tokenization',
    owner: 'state-treasury',
    tags: ['treasury', 'government', 'stablecoin', 'state'],
    verified: true,
    metadata: {
      launched: new Date().toISOString(),
      departments: 2,
      status: 'operational'
    }
  });
  console.log(`✅ Registered project: ${project.name}`);

  // Create staking pool for state employees
  console.log('\n4. Creating Employee Staking Pool...');
  const pool = platform.staking.createPool({
    name: 'State Employee Benefits Pool',
    tokenSymbol: stateCoin.symbol,
    minStake: 1000,
    lockPeriod: 30 * 24 * 60 * 60 * 1000,
    rewardRate: 0.04 // 4% APY
  });
  console.log(`✅ Created pool: ${pool.name}`);

  console.log('\n' + '='.repeat(60));
  console.log('State Digital Asset Platform Ready!');
  console.log('='.repeat(60));

  return { stateCoin, project, pool };
}

// Run example
if (import.meta.url === `file://${process.argv[1]}`) {
  stateDigitalAssetExample()
    .then(() => console.log('\n✅ Example completed'))
    .catch(err => console.error('\n❌ Error:', err));
}

export default stateDigitalAssetExample;
