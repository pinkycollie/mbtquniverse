/**
 * Agent and Project Registry Module
 * 
 * Manages registration and discovery of agents, projects, and organizations.
 * Provides a decentralized directory without third-party dependencies.
 * 
 * Features:
 * - Agent registration and discovery
 * - Project listing and metadata
 * - Reputation and metrics tracking
 * - Verification system
 */

export class Registry {
  constructor() {
    this.agents = new Map();
    this.projects = new Map();
    this.categories = new Set(['governance', 'tokenization', 'infrastructure', 'analytics', 'other']);
  }

  /**
   * Register a new agent
   * @param {Object} agentData - Agent information
   * @returns {Object} Registered agent
   * 
   * TIP: Agents can be AI systems, automated services, or organizational entities
   * TIP: Include clear capabilities and access requirements
   */
  registerAgent(agentData) {
    const {
      name,
      description,
      type = 'service',
      capabilities = [],
      endpoints = [],
      owner,
      verified = false,
      metadata = {}
    } = agentData;

    const agent = {
      id: this._generateId('AGENT'),
      name,
      description,
      type,
      capabilities,
      endpoints,
      owner,
      verified,
      metadata,
      registeredAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: 'active',
      metrics: {
        calls: 0,
        successRate: 1.0,
        averageResponseTime: 0
      }
    };

    this.agents.set(agent.id, agent);
    return agent;
  }

  /**
   * Register a new project
   * @param {Object} projectData - Project information
   * @returns {Object} Registered project
   * 
   * TIP: Projects can be organizational initiatives, DAOs, or public services
   * TIP: Tag projects appropriately for discoverability
   */
  registerProject(projectData) {
    const {
      name,
      description,
      category,
      owner,
      repository = null,
      website = null,
      tags = [],
      verified = false,
      metadata = {}
    } = projectData;

    if (!this.categories.has(category)) {
      throw new Error(`Invalid category. Must be one of: ${Array.from(this.categories).join(', ')}`);
    }

    const project = {
      id: this._generateId('PROJ'),
      name,
      description,
      category,
      owner,
      repository,
      website,
      tags,
      verified,
      metadata,
      registeredAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: 'active',
      metrics: {
        stars: 0,
        contributors: 0,
        activity: 'low'
      }
    };

    this.projects.set(project.id, project);
    return project;
  }

  /**
   * Update agent information
   * @param {string} agentId - ID of the agent
   * @param {Object} updates - Fields to update
   */
  updateAgent(agentId, updates) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error('Agent not found');
    }

    // Only allow updating specific fields
    const allowedFields = ['description', 'capabilities', 'endpoints', 'metadata', 'status'];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        agent[key] = value;
      }
    }

    agent.lastUpdated = new Date().toISOString();
    return agent;
  }

  /**
   * Update project information
   * @param {string} projectId - ID of the project
   * @param {Object} updates - Fields to update
   */
  updateProject(projectId, updates) {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const allowedFields = ['description', 'repository', 'website', 'tags', 'metadata', 'status'];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        project[key] = value;
      }
    }

    project.lastUpdated = new Date().toISOString();
    return project;
  }

  /**
   * Verify an agent or project
   * @param {string} entityType - 'agent' or 'project'
   * @param {string} entityId - ID of the entity
   * @param {Object} verificationData - Verification details
   * 
   * TIP: Federal/state entities should require formal verification
   * TIP: Document verification criteria clearly
   */
  verify(entityType, entityId, verificationData) {
    let entity;
    
    if (entityType === 'agent') {
      entity = this.agents.get(entityId);
    } else if (entityType === 'project') {
      entity = this.projects.get(entityId);
    } else {
      throw new Error('Invalid entity type. Must be "agent" or "project"');
    }

    if (!entity) {
      throw new Error(`${entityType} not found`);
    }

    entity.verified = true;
    entity.verificationData = {
      verifiedAt: new Date().toISOString(),
      verifiedBy: verificationData.verifier,
      verificationMethod: verificationData.method || 'manual',
      notes: verificationData.notes || ''
    };

    return entity;
  }

  /**
   * Search agents by criteria
   * @param {Object} criteria - Search criteria
   */
  searchAgents(criteria = {}) {
    let agents = Array.from(this.agents.values());

    if (criteria.type) {
      agents = agents.filter(a => a.type === criteria.type);
    }

    if (criteria.capability) {
      agents = agents.filter(a => a.capabilities.includes(criteria.capability));
    }

    if (criteria.verified !== undefined) {
      agents = agents.filter(a => a.verified === criteria.verified);
    }

    if (criteria.status) {
      agents = agents.filter(a => a.status === criteria.status);
    }

    if (criteria.owner) {
      agents = agents.filter(a => a.owner === criteria.owner);
    }

    return agents;
  }

  /**
   * Search projects by criteria
   * @param {Object} criteria - Search criteria
   */
  searchProjects(criteria = {}) {
    let projects = Array.from(this.projects.values());

    if (criteria.category) {
      projects = projects.filter(p => p.category === criteria.category);
    }

    if (criteria.tag) {
      projects = projects.filter(p => p.tags.includes(criteria.tag));
    }

    if (criteria.verified !== undefined) {
      projects = projects.filter(p => p.verified === criteria.verified);
    }

    if (criteria.status) {
      projects = projects.filter(p => p.status === criteria.status);
    }

    if (criteria.owner) {
      projects = projects.filter(p => p.owner === criteria.owner);
    }

    return projects;
  }

  /**
   * Get agent by ID
   * @param {string} agentId - ID of the agent
   */
  getAgent(agentId) {
    return this.agents.get(agentId);
  }

  /**
   * Get project by ID
   * @param {string} projectId - ID of the project
   */
  getProject(projectId) {
    return this.projects.get(projectId);
  }

  /**
   * List all agents
   */
  listAgents() {
    return Array.from(this.agents.values());
  }

  /**
   * List all projects
   */
  listProjects() {
    return Array.from(this.projects.values());
  }

  /**
   * Get registry statistics
   */
  getStatistics() {
    return {
      totalAgents: this.agents.size,
      totalProjects: this.projects.size,
      verifiedAgents: Array.from(this.agents.values()).filter(a => a.verified).length,
      verifiedProjects: Array.from(this.projects.values()).filter(p => p.verified).length,
      categories: Array.from(this.categories)
    };
  }

  // Private helper methods
  _generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }
}

export default Registry;
