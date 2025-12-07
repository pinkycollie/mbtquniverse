# Example Configuration File
# Copy this to config.local.js and customize for your needs

export default {
  # Platform Configuration
  platform: {
    name: 'MBTQUniverse',
    environment: 'development', # development, staging, production
    version: '1.0.0'
  },

  # Tokenization Settings
  tokenization: {
    defaultBackingAsset: 'USD',
    requireMultiSig: true,
    minSignatures: 2,
    reserveAuditFrequency: 'monthly' # daily, weekly, monthly, quarterly
  },

  # DAO Governance Settings
  governance: {
    defaultVotingPeriod: 7, # days
    defaultQuorum: 0.5, # 50%
    defaultApproval: 0.6, # 60%
    executionDelay: 2, # days
    requireVerification: true
  },

  # Staking Settings
  staking: {
    defaultLockPeriod: 30, # days
    defaultRewardRate: 0.05, # 5% APY
    minStake: 100,
    rewardDistributionFrequency: 'daily' # hourly, daily, weekly
  },

  # API Settings
  api: {
    rateLimit: {
      window: 60000, # 1 minute in ms
      maxRequests: 100
    },
    enableAuth: true,
    enableCors: true,
    logRequests: true
  },

  # Metrics Settings
  metrics: {
    enableTracking: true,
    retentionPeriod: 90, # days
    aggregationInterval: 'hourly' # hourly, daily, weekly
  },

  # Security Settings
  security: {
    enableRateLimiting: true,
    enableInputValidation: true,
    enableAuditLog: true,
    sessionTimeout: 3600000 # 1 hour in ms
  }
}
