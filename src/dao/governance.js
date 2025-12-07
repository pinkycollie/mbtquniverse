/**
 * DAO Governance Module
 * 
 * Provides decentralized governance capabilities for community-driven decision making.
 * Suitable for federal, state, and organizational governance structures.
 * 
 * Features:
 * - Proposal creation and management
 * - Voting mechanisms (token-weighted, quadratic, etc.)
 * - Execution framework for approved proposals
 * - Transparency and audit trails
 */

export class DAOGovernance {
  constructor() {
    this.proposals = new Map();
    this.votes = new Map();
    this.members = new Map();
  }

  /**
   * Register a governance member
   * @param {Object} memberData - Member information
   * 
   * TIP: Organizations can use role-based voting power
   * TIP: Federal/state entities may require identity verification
   */
  registerMember(memberData) {
    const {
      id,
      name,
      votingPower = 1,
      role = 'member',
      verified = false
    } = memberData;

    const member = {
      id,
      name,
      votingPower,
      role,
      verified,
      joinedAt: new Date().toISOString(),
      proposalsCreated: 0,
      votesSubmitted: 0
    };

    this.members.set(id, member);
    return member;
  }

  /**
   * Create a new governance proposal
   * @param {Object} proposalData - Proposal details
   * @returns {Object} Created proposal
   * 
   * TIP: Include clear objectives and success criteria
   * TIP: Set appropriate voting periods based on proposal importance
   */
  createProposal(proposalData) {
    const {
      title,
      description,
      proposerId,
      category = 'general',
      votingPeriod = 7 * 24 * 60 * 60 * 1000, // 7 days default
      quorumThreshold = 0.5, // 50% participation required
      approvalThreshold = 0.6, // 60% approval required
      executionDelay = 2 * 24 * 60 * 60 * 1000 // 2 day delay after approval
    } = proposalData;

    const proposer = this.members.get(proposerId);
    if (!proposer) {
      throw new Error('Proposer not found or not registered');
    }

    const proposal = {
      id: this._generateId(),
      title,
      description,
      proposerId,
      proposerName: proposer.name,
      category,
      status: 'active',
      createdAt: new Date().toISOString(),
      votingStartsAt: new Date().toISOString(),
      votingEndsAt: new Date(Date.now() + votingPeriod).toISOString(),
      executionDelay,
      quorumThreshold,
      approvalThreshold,
      votes: {
        for: 0,
        against: 0,
        abstain: 0
      },
      voters: new Set(),
      result: null,
      executedAt: null
    };

    this.proposals.set(proposal.id, proposal);
    proposer.proposalsCreated++;

    return proposal;
  }

  /**
   * Cast a vote on a proposal
   * @param {string} proposalId - ID of the proposal
   * @param {string} voterId - ID of the voter
   * @param {string} voteChoice - 'for', 'against', or 'abstain'
   * 
   * TIP: Token-weighted voting can be implemented by using votingPower
   * TIP: Consider implementing quadratic voting for more democratic outcomes
   */
  vote(proposalId, voterId, voteChoice) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (proposal.status !== 'active') {
      throw new Error('Voting period has ended for this proposal');
    }

    const voter = this.members.get(voterId);
    if (!voter) {
      throw new Error('Voter not registered');
    }

    if (proposal.voters.has(voterId)) {
      throw new Error('Member has already voted on this proposal');
    }

    const now = Date.now();
    const votingEnds = new Date(proposal.votingEndsAt).getTime();
    if (now > votingEnds) {
      proposal.status = 'closed';
      throw new Error('Voting period has ended');
    }

    // Record vote with member's voting power
    const votePower = voter.votingPower;
    
    if (!['for', 'against', 'abstain'].includes(voteChoice)) {
      throw new Error('Invalid vote choice. Must be: for, against, or abstain');
    }

    proposal.votes[voteChoice] += votePower;
    proposal.voters.add(voterId);
    voter.votesSubmitted++;

    // Store vote record
    const voteKey = `${proposalId}-${voterId}`;
    this.votes.set(voteKey, {
      proposalId,
      voterId,
      choice: voteChoice,
      power: votePower,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      proposalId,
      currentVotes: proposal.votes
    };
  }

  /**
   * Finalize voting and determine proposal outcome
   * @param {string} proposalId - ID of the proposal
   * 
   * TIP: Automatically trigger execution for approved proposals
   * TIP: Maintain transparency by publishing all voting records
   */
  finalizeProposal(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (proposal.status !== 'active' && proposal.status !== 'closed') {
      throw new Error('Proposal already finalized');
    }

    const totalVotingPower = Array.from(this.members.values())
      .reduce((sum, member) => sum + member.votingPower, 0);

    const totalVotes = proposal.votes.for + proposal.votes.against + proposal.votes.abstain;
    const participationRate = totalVotes / totalVotingPower;
    const approvalRate = proposal.votes.for / (proposal.votes.for + proposal.votes.against);

    const quorumMet = participationRate >= proposal.quorumThreshold;
    const approvalMet = approvalRate >= proposal.approvalThreshold;

    proposal.status = quorumMet && approvalMet ? 'approved' : 'rejected';
    proposal.result = {
      quorumMet,
      approvalMet,
      participationRate,
      approvalRate,
      finalizedAt: new Date().toISOString()
    };

    if (proposal.status === 'approved') {
      proposal.executionScheduledAt = new Date(
        Date.now() + proposal.executionDelay
      ).toISOString();
    }

    return proposal;
  }

  /**
   * Execute an approved proposal
   * @param {string} proposalId - ID of the proposal
   * @param {Object} executionContext - Context for execution
   * 
   * TIP: Implement safeguards and multi-sig for critical operations
   * TIP: Log all execution steps for audit trail
   */
  executeProposal(proposalId, executionContext = {}) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (proposal.status !== 'approved') {
      throw new Error('Only approved proposals can be executed');
    }

    const scheduledTime = new Date(proposal.executionScheduledAt).getTime();
    if (Date.now() < scheduledTime) {
      throw new Error('Execution delay period has not elapsed');
    }

    // PLACEHOLDER: Implement actual execution logic based on proposal type
    proposal.status = 'executed';
    proposal.executedAt = new Date().toISOString();
    proposal.executionContext = executionContext;

    return {
      success: true,
      proposalId,
      executedAt: proposal.executedAt
    };
  }

  /**
   * Get proposal details and voting statistics
   * @param {string} proposalId - ID of the proposal
   */
  getProposal(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    // Convert Set to Array for serialization
    const proposalData = {
      ...proposal,
      voters: Array.from(proposal.voters)
    };

    return proposalData;
  }

  /**
   * List all proposals with optional filtering
   * @param {Object} filters - Filter criteria
   */
  listProposals(filters = {}) {
    let proposals = Array.from(this.proposals.values());

    if (filters.status) {
      proposals = proposals.filter(p => p.status === filters.status);
    }

    if (filters.category) {
      proposals = proposals.filter(p => p.category === filters.category);
    }

    if (filters.proposerId) {
      proposals = proposals.filter(p => p.proposerId === filters.proposerId);
    }

    // Convert Sets to Arrays for serialization
    return proposals.map(p => ({
      ...p,
      voters: Array.from(p.voters)
    }));
  }

  /**
   * Get member information
   * @param {string} memberId - ID of the member
   */
  getMember(memberId) {
    return this.members.get(memberId);
  }

  /**
   * List all members
   */
  listMembers() {
    return Array.from(this.members.values());
  }

  // Private helper methods
  _generateId() {
    return `PROP-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }
}

export default DAOGovernance;
