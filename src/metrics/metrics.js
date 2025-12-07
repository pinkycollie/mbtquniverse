/**
 * Metrics and Analytics Module
 * 
 * Tracks platform metrics, performance, and generates leaderboards.
 * Provides transparency and data-driven insights.
 * 
 * Features:
 * - Performance metrics
 * - User activity tracking
 * - Leaderboards
 * - Analytics dashboard data
 */

export class MetricsManager {
  constructor() {
    this.metrics = new Map();
    this.events = [];
    this.leaderboards = new Map();
  }

  /**
   * Record a metric
   * @param {Object} metricData - Metric information
   * 
   * TIP: Track key performance indicators (KPIs) relevant to your organization
   * TIP: Use time-series data for trend analysis
   */
  recordMetric(metricData) {
    const {
      category,
      name,
      value,
      unit = 'count',
      tags = {},
      timestamp = new Date().toISOString()
    } = metricData;

    const metric = {
      id: this._generateId(),
      category,
      name,
      value,
      unit,
      tags,
      timestamp
    };

    const key = `${category}:${name}`;
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }

    this.metrics.get(key).push(metric);
    return metric;
  }

  /**
   * Record an event
   * @param {Object} eventData - Event information
   */
  recordEvent(eventData) {
    const {
      type,
      actor,
      action,
      target,
      metadata = {},
      timestamp = new Date().toISOString()
    } = eventData;

    const event = {
      id: this._generateId(),
      type,
      actor,
      action,
      target,
      metadata,
      timestamp
    };

    this.events.push(event);
    return event;
  }

  /**
   * Get metrics by category and name
   * @param {string} category - Metric category
   * @param {string} name - Metric name
   * @param {Object} options - Query options (timeRange, aggregation, etc.)
   */
  getMetrics(category, name, options = {}) {
    const key = `${category}:${name}`;
    let metrics = this.metrics.get(key) || [];

    // Filter by time range
    if (options.startTime) {
      const startTime = new Date(options.startTime).getTime();
      metrics = metrics.filter(m => new Date(m.timestamp).getTime() >= startTime);
    }

    if (options.endTime) {
      const endTime = new Date(options.endTime).getTime();
      metrics = metrics.filter(m => new Date(m.timestamp).getTime() <= endTime);
    }

    // Aggregate if requested
    if (options.aggregation) {
      return this._aggregateMetrics(metrics, options.aggregation);
    }

    return metrics;
  }

  /**
   * Get events with filtering
   * @param {Object} filters - Filter criteria
   */
  getEvents(filters = {}) {
    let events = [...this.events];

    if (filters.type) {
      events = events.filter(e => e.type === filters.type);
    }

    if (filters.actor) {
      events = events.filter(e => e.actor === filters.actor);
    }

    if (filters.action) {
      events = events.filter(e => e.action === filters.action);
    }

    if (filters.startTime) {
      const startTime = new Date(filters.startTime).getTime();
      events = events.filter(e => new Date(e.timestamp).getTime() >= startTime);
    }

    if (filters.limit) {
      events = events.slice(-filters.limit);
    }

    return events;
  }

  /**
   * Update leaderboard
   * @param {string} leaderboardName - Name of the leaderboard
   * @param {string} entityId - Entity to update
   * @param {number} score - Score value
   * 
   * TIP: Use leaderboards to gamify participation and recognize contributions
   */
  updateLeaderboard(leaderboardName, entityId, score) {
    if (!this.leaderboards.has(leaderboardName)) {
      this.leaderboards.set(leaderboardName, new Map());
    }

    const leaderboard = this.leaderboards.get(leaderboardName);
    leaderboard.set(entityId, {
      entityId,
      score,
      lastUpdated: new Date().toISOString()
    });

    return this.getLeaderboard(leaderboardName);
  }

  /**
   * Get leaderboard rankings
   * @param {string} leaderboardName - Name of the leaderboard
   * @param {Object} options - Query options (limit, offset)
   */
  getLeaderboard(leaderboardName, options = {}) {
    const leaderboard = this.leaderboards.get(leaderboardName);
    if (!leaderboard) {
      return [];
    }

    let rankings = Array.from(leaderboard.values())
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({
        rank: index + 1,
        ...entry
      }));

    if (options.limit) {
      const offset = options.offset || 0;
      rankings = rankings.slice(offset, offset + options.limit);
    }

    return rankings;
  }

  /**
   * Get platform dashboard data
   * 
   * TIP: Customize dashboard metrics for your organization's needs
   */
  getDashboardData() {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

    const recentEvents = this.events.filter(
      e => new Date(e.timestamp).getTime() >= oneDayAgo
    );

    return {
      timestamp: new Date().toISOString(),
      events: {
        last24Hours: recentEvents.length,
        last7Days: this.events.filter(
          e => new Date(e.timestamp).getTime() >= oneWeekAgo
        ).length,
        total: this.events.length
      },
      metrics: {
        totalCategories: new Set(
          Array.from(this.metrics.keys()).map(k => k.split(':')[0])
        ).size,
        totalMetrics: this.metrics.size
      },
      leaderboards: {
        total: this.leaderboards.size,
        names: Array.from(this.leaderboards.keys())
      }
    };
  }

  /**
   * Generate analytics report
   * @param {Object} options - Report options
   */
  generateReport(options = {}) {
    const {
      startTime,
      endTime = new Date().toISOString(),
      categories = []
    } = options;

    const report = {
      generatedAt: new Date().toISOString(),
      period: {
        start: startTime || 'all time',
        end: endTime
      },
      summary: {}
    };

    // Event summary
    let events = this.events;
    if (startTime) {
      const startMs = new Date(startTime).getTime();
      events = events.filter(e => new Date(e.timestamp).getTime() >= startMs);
    }

    report.summary.events = {
      total: events.length,
      byType: this._groupBy(events, 'type'),
      byAction: this._groupBy(events, 'action')
    };

    // Metrics summary
    if (categories.length > 0) {
      report.metrics = {};
      for (const category of categories) {
        const categoryMetrics = Array.from(this.metrics.entries())
          .filter(([key]) => key.startsWith(`${category}:`));
        
        report.metrics[category] = categoryMetrics.length;
      }
    }

    return report;
  }

  // Private helper methods
  _aggregateMetrics(metrics, aggregationType) {
    const values = metrics.map(m => m.value);
    
    switch (aggregationType) {
      case 'sum':
        return values.reduce((sum, val) => sum + val, 0);
      case 'avg':
        return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
      case 'min':
        return Math.min(...values);
      case 'max':
        return Math.max(...values);
      case 'count':
        return values.length;
      default:
        return metrics;
    }
  }

  _groupBy(array, property) {
    const grouped = {};
    for (const item of array) {
      const key = item[property] || 'unknown';
      grouped[key] = (grouped[key] || 0) + 1;
    }
    return grouped;
  }

  _generateId() {
    return `MET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default MetricsManager;
