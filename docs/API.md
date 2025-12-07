# API Reference

## Overview

The MBTQUniverse platform provides a unified API gateway for all modules. All requests go through the API Gateway which handles routing, authentication, and rate limiting.

## Modules

- **stablecoin**: Tokenization and stablecoin management
- **dao**: DAO governance and voting
- **registry**: Agent and project registration
- **staking**: Staking and rewards
- **metrics**: Analytics and metrics tracking

## Making Requests

```javascript
import { APIGateway } from './api/gateway.js';

const api = new APIGateway({
  stablecoin: stablecoinManager,
  dao: daoGovernance,
  registry: registry,
  staking: stakingManager,
  metrics: metricsManager
});

// Make a request
const response = await api.handleRequest({
  module: 'stablecoin',
  action: 'createStablecoin',
  params: {
    name: 'Federal Digital Dollar',
    symbol: 'FDD',
    initialSupply: 1000000
  },
  auth: {
    userId: 'treasury-001'
  }
});

console.log(response);
// {
//   success: true,
//   requestId: 'REQ-...',
//   data: { ... },
//   timestamp: '2024-12-07T...'
// }
```

## Rate Limiting

Default: 100 requests per minute per user.

## API Statistics

```javascript
const stats = api.getStatistics();
// {
//   totalRequests: 1234,
//   recentRequests: 100,
//   successRate: 0.98,
//   errorRate: 0.02,
//   moduleUsage: { ... }
// }
```

For detailed module APIs, see:
- [Tokenization API](TOKENIZATION.md#api-reference)
- [DAO API](DAO.md#api-reference)
- [Registry API](REGISTRY.md#api-reference)
