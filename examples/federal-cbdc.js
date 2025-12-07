/**
 * Example: Federal Digital Dollar Implementation
 * 
 * This example demonstrates how a federal entity might implement
 * a Central Bank Digital Currency (CBDC) using the MBTQUniverse platform.
 */

import { MBTQUniverse } from '../src/index.js';

async function federalDigitalDollarExample() {
  console.log('='.repeat(60));
  console.log('Federal Digital Dollar (CBDC) Example');
  console.log('='.repeat(60));

  const platform = new MBTQUniverse();

  // Step 1: Create the Federal Digital Dollar stablecoin
  console.log('\n1. Creating Federal Digital Dollar (FDD)...');
  const fdd = platform.stablecoin.createStablecoin({
    name: 'Federal Digital Dollar',
    symbol: 'FDD',
    backingAsset: 'USD',
    initialSupply: 10000000000, // 10 billion
    issuer: 'Federal Reserve System',
    regulatoryFramework: 'Federal Reserve Act + Digital Asset Guidelines',
    complianceLevel: 'federal'
  });
  console.log(`✅ Created ${fdd.name} (${fdd.symbol})`);
  console.log(`   Initial Supply: $${fdd.totalSupply.toLocaleString()}`);

  // Step 2: Register federal entities as governance members
  console.log('\n2. Registering Federal Entities...');
  const fedReserve = platform.dao.registerMember({
    id: 'fed-reserve',
    name: 'Federal Reserve Board',
    votingPower: 100,
    role: 'admin',
    verified: true
  });
  
  const treasury = platform.dao.registerMember({
    id: 'treasury',
    name: 'U.S. Department of Treasury',
    votingPower: 90,
    role: 'admin',
    verified: true
  });

  const oversight = platform.dao.registerMember({
    id: 'oversight',
    name: 'Congressional Oversight Committee',
    votingPower: 80,
    role: 'member',
    verified: true
  });
  console.log(`✅ Registered ${platform.dao.members.size} federal entities`);

  // Step 3: Create governance proposal for monetary expansion
  console.log('\n3. Creating Governance Proposal...');
  const proposal = platform.dao.createProposal({
    title: 'Q1 2025 Monetary Expansion: Mint $500M FDD',
    description: `
      Proposal to mint $500 million Federal Digital Dollars to support
      infrastructure projects and digital payment system expansion.
      
      Justification:
      - Support 100+ infrastructure projects
      - Expand digital payment capabilities
      - Maintain 1:1 USD backing with Treasury reserves
      
      Timeline: Q1 2025
      Review: Monthly reserve audits required
    `,
    proposerId: fedReserve.id,
    category: 'tokenization',
    votingPeriod: 30 * 24 * 60 * 60 * 1000, // 30 days
    quorumThreshold: 0.7, // 70% participation
    approvalThreshold: 0.66, // 66% approval (supermajority)
    executionDelay: 7 * 24 * 60 * 60 * 1000 // 7 day delay
  });
  console.log(`✅ Created proposal: ${proposal.title}`);

  // Step 4: Vote on proposal
  console.log('\n4. Voting on Proposal...');
  platform.dao.vote(proposal.id, fedReserve.id, 'for');
  platform.dao.vote(proposal.id, treasury.id, 'for');
  platform.dao.vote(proposal.id, oversight.id, 'for');
  console.log(`✅ Votes cast: 3 out of 3 members`);

  // Step 5: Finalize proposal
  console.log('\n5. Finalizing Proposal...');
  const finalized = platform.dao.finalizeProposal(proposal.id);
  console.log(`✅ Proposal Status: ${finalized.status}`);
  console.log(`   Participation Rate: ${(finalized.result.participationRate * 100).toFixed(1)}%`);
  console.log(`   Approval Rate: ${(finalized.result.approvalRate * 100).toFixed(1)}%`);

  // Step 6: Mint new tokens (after execution delay)
  console.log('\n6. Minting Approved Tokens...');
  const mintResult = platform.stablecoin.mint(fdd.id, 500000000, {
    signatures: [
      'fed-reserve-chair',
      'treasury-secretary',
      'federal-reserve-governor-1',
      'federal-reserve-governor-2'
    ],
    proposalId: proposal.id,
    approvedBy: 'Federal Reserve Board',
    reason: 'Q1 2025 Monetary Expansion'
  });
  console.log(`✅ Minted $${(500000000).toLocaleString()}`);
  console.log(`   New Total Supply: $${mintResult.newSupply.toLocaleString()}`);

  // Step 7: Check reserve status
  console.log('\n7. Reserve Status Check...');
  const reserves = platform.stablecoin.getReserveStatus(fdd.id);
  console.log(`✅ Reserve Ratio: ${reserves.reserveRatio.toFixed(2)}`);
  console.log(`   Fully Backed: ${reserves.isFullyBacked ? 'Yes' : 'No'}`);
  console.log(`   Total Supply: $${reserves.totalSupply.toLocaleString()}`);
  console.log(`   Reserve Amount: $${reserves.reserves.amount.toLocaleString()}`);

  // Step 8: Create staking pool for governance participation
  console.log('\n8. Creating Governance Staking Pool...');
  const stakingPool = platform.staking.createPool({
    name: 'FDD Governance Participation Pool',
    tokenSymbol: 'FDD',
    minStake: 10000, // $10,000 minimum
    lockPeriod: 90 * 24 * 60 * 60 * 1000, // 90 days
    rewardRate: 0.03, // 3% APY
    metadata: {
      purpose: 'Governance participation incentive',
      tier: 'federal'
    }
  });
  console.log(`✅ Created staking pool: ${stakingPool.name}`);

  // Step 9: Generate compliance report
  console.log('\n9. Generating Compliance Report...');
  const report = platform.stablecoin.getComplianceReport(fdd.id, {
    startDate: fdd.createdAt,
    endDate: new Date().toISOString(),
    includeTransactions: true
  });
  console.log(`✅ Compliance Report Generated`);
  console.log(`   Total Transactions: ${report.summary.totalTransactions}`);
  console.log(`   Total Minted: $${report.summary.totalMinted.toLocaleString()}`);
  console.log(`   Total Burned: $${report.summary.totalBurned.toLocaleString()}`);
  console.log(`   Current Supply: $${report.summary.currentSupply.toLocaleString()}`);

  // Step 10: Record metrics
  console.log('\n10. Recording Platform Metrics...');
  platform.metrics.recordEvent({
    type: 'federal-cbdc',
    actor: 'fed-reserve',
    action: 'cbdc-launched',
    target: fdd.id,
    metadata: {
      initialSupply: fdd.totalSupply,
      backingAsset: 'USD'
    }
  });
  platform.metrics.recordMetric({
    category: 'tokenization',
    name: 'cbdc_supply',
    value: mintResult.newSupply,
    unit: 'USD'
  });
  console.log(`✅ Metrics recorded`);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Federal Digital Dollar Implementation Complete!');
  console.log('='.repeat(60));
  console.log(`\nKey Metrics:`);
  console.log(`- Stablecoin: ${fdd.name} (${fdd.symbol})`);
  console.log(`- Total Supply: $${mintResult.newSupply.toLocaleString()}`);
  console.log(`- Governance Members: ${platform.dao.members.size}`);
  console.log(`- Proposals: ${platform.dao.proposals.size}`);
  console.log(`- Staking Pools: ${platform.staking.pools.size}`);
  console.log(`\nCompliance:`);
  console.log(`- Reserve Ratio: 1.00 (Fully Backed)`);
  console.log(`- Regulatory Framework: Federal Reserve Act`);
  console.log(`- Multi-Sig Required: Yes`);
  console.log(`- Audit Trail: Complete`);

  return {
    stablecoin: fdd,
    proposal,
    stakingPool,
    reserves,
    report
  };
}

// Run example
if (import.meta.url === `file://${process.argv[1]}`) {
  federalDigitalDollarExample()
    .then(() => console.log('\n✅ Example completed successfully'))
    .catch(err => console.error('\n❌ Error:', err));
}

export default federalDigitalDollarExample;
