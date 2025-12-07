/**
 * API Gateway Module
 * 
 * Provides a unified API interface for all platform modules.
 * Routes requests and manages authentication/authorization.
 * 
 * Features:
 * - Request routing
 * - Rate limiting
 * - Authentication
 * - Response formatting
 */

export class APIGateway {
  constructor(modules = {}) {
    this.modules = modules;
    this.requestLog = [];
    this.rateLimits = new Map();
  }

  /**
   * Handle API request
   * @param {Object} request - API request object
   * @returns {Object} API response
   * 
   * TIP: Implement API versioning for backward compatibility
   * TIP: Use rate limiting to prevent abuse
   */
  async handleRequest(request) {
    const {
      module,
      action,
      params = {},
      auth = null,
      requestId = this._generateRequestId()
    } = request;

    // Log request
    const logEntry = {
      requestId,
      module,
      action,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    this.requestLog.push(logEntry);

    try {
      // Check rate limits
      if (auth && auth.userId) {
        this._checkRateLimit(auth.userId);
      }

      // Validate module exists
      if (!this.modules[module]) {
        throw new Error(`Module '${module}' not found`);
      }

      const moduleInstance = this.modules[module];

      // Validate action exists
      if (typeof moduleInstance[action] !== 'function') {
        throw new Error(`Action '${action}' not found in module '${module}'`);
      }

      // Execute action
      const result = await moduleInstance[action](...Object.values(params));

      logEntry.status = 'success';
      logEntry.completedAt = new Date().toISOString();

      return {
        success: true,
        requestId,
        data: result,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logEntry.status = 'error';
      logEntry.error = error.message;
      logEntry.completedAt = new Date().toISOString();

      return {
        success: false,
        requestId,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Check rate limit for a user
   * @param {string} userId - User ID
   * 
   * TIP: Implement tiered rate limits based on user roles
   */
  _checkRateLimit(userId) {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const maxRequests = 100; // Max requests per window

    if (!this.rateLimits.has(userId)) {
      this.rateLimits.set(userId, []);
    }

    const requests = this.rateLimits.get(userId);
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      throw new Error('Rate limit exceeded');
    }

    recentRequests.push(now);
    this.rateLimits.set(userId, recentRequests);
  }

  /**
   * Get API statistics
   */
  getStatistics() {
    const recentLogs = this.requestLog.slice(-1000); // Last 1000 requests

    return {
      totalRequests: this.requestLog.length,
      recentRequests: recentLogs.length,
      successRate: recentLogs.filter(log => log.status === 'success').length / recentLogs.length,
      errorRate: recentLogs.filter(log => log.status === 'error').length / recentLogs.length,
      moduleUsage: this._getModuleUsage(recentLogs)
    };
  }

  /**
   * Get request logs with filtering
   * @param {Object} filters - Filter criteria
   */
  getRequestLogs(filters = {}) {
    let logs = [...this.requestLog];

    if (filters.module) {
      logs = logs.filter(log => log.module === filters.module);
    }

    if (filters.status) {
      logs = logs.filter(log => log.status === filters.status);
    }

    if (filters.limit) {
      logs = logs.slice(-filters.limit);
    }

    return logs;
  }

  _getModuleUsage(logs) {
    const usage = {};
    for (const log of logs) {
      usage[log.module] = (usage[log.module] || 0) + 1;
    }
    return usage;
  }

  _generateRequestId() {
    return `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default APIGateway;
