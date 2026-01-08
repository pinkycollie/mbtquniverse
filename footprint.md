## The Grand Footprint: MBTQ Context Protocol

The MBTQ Context Protocol is a comprehensive distributed systems architecture that unifies authentication, versioning, tracing, and event semantics into a single coherent framework. This protocol enables seamless context propagation across service boundaries while maintaining dev-prod parity through infrastructure-level enforcement.

### Protocol Stack Overview

### Layer 1: Infrastructure

- **Apache 2 Context Injector**
    - Enforces header contracts at trust boundary
    - Injects missing context (`X-Request-Id`, `X-MBTQ-Env`)
    - Provides identical semantics across dev/prod/local
- **Reverse Proxy Rules**
    - Header normalization and validation
    - Request ID generation (`%{UNIQUE_ID}`)
    - Environment detection and injection

### Layer 2: Wire Protocol

- **X-Header Contract**
    - `X-MBTQ-Tenant`: Multi-tenancy isolation
    - `X-MBTQ-User`: Actor identification
    - `X-MBTQ-Partner`: Partner context
    - `X-MBTQ-Env`: Environment designation
    - `X-Correlation-Id`: Distributed tracing
- **Authorization Context**
    - `x402`: Fine-grained permission tokens
    - Flows through entire request chain
- **Schema Versioning**
    - `VDE`: Versioned data envelopes
    - Wire-level compatibility guarantees

### Layer 3: Canonical Event Envelope

```json
{
  "event_id": "uuid-v7",
  "event_type": "ecosystem.domain.action",
  "event_version": "1.0.0",
  "timestamp": "ISO-8601",
  
  "actor": {
    "type": "user|system|partner",
    "id": "actor-identifier",
    "tenant_id": "tenant-xyz"
  },
  
  "subject": {
    "type": "resource-type",
    "id": "resource-identifier",
    "tenant_id": "tenant-xyz"
  },
  
  "context": {
    "correlation_id": "from X-Correlation-Id",
    "request_id": "from X-Request-Id",
    "environment": "from X-MBTQ-Env",
    "x402": "authorization-token",
    "vde_version": "envelope-version",
    "source_service": "service-name",
    "source_ecosystem": "ecosystem-name"
  },
  
  "payload": {
    "domain_specific_data": "..."
  }
}
```

### Layer 4: Service Implementation Patterns

### Inbound Request Handler

```jsx
async function handleRequest(req) {
  // 1. Extract context from headers (Apache already normalized)
  const context = {
    tenantId: req.headers['x-mbtq-tenant'],
    userId: req.headers['x-mbtq-user'],
    partnerId: req.headers['x-mbtq-partner'],
    environment: req.headers['x-mbtq-env'],
    correlationId: req.headers['x-correlation-id'],
    requestId: req.headers['x-request-id'],
    x402: req.headers['x-mbtq-x402'],
    vdeVersion: req.headers['x-mbtq-vde-version']
  };
  
  // 2. Perform business logic
  const result = await businessLogic(context, req.body);
  
  // 3. Emit canonical event
  await emitEvent({
    event_type: 'partner.badge_issued',
    actor: {
      type: 'partner',
      id: context.partnerId,
      tenant_id: context.tenantId
    },
    subject: {
      type: 'badge',
      id: result.badgeId,
      tenant_id: context.tenantId
    },
    context: context,
    payload: result
  });
  
  return result;
}
```

### Outbound API Call Pattern

```jsx
async function callDownstreamService(context, endpoint, data) {
  // Propagate full context to downstream
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${context.x402}`,
      'X-MBTQ-Tenant': context.tenantId,
      'X-MBTQ-User': context.userId,
      'X-MBTQ-Partner': context.partnerId || '',
      'X-MBTQ-Env': context.environment,
      'X-Correlation-Id': context.correlationId,
      'X-Request-Id': generateRequestId(), // New request ID
      'X-Parent-Request-Id': context.requestId, // Link to parent
      'X-MBTQ-VDE-Version': context.vdeVersion,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  return response;
}
```

### Layer 5: Cross-Ecosystem Adapters

When integrating with external systems (Stripe, Slack, etc.), adapters preserve MBTQ context:

```jsx
class StripeAdapter {
  async createCharge(mbtqContext, chargeData) {
    // Stripe API call with correlation tracking
    const charge = await stripe.charges.create({
      ...chargeData,
      metadata: {
        // Preserve MBTQ context in Stripe metadata
        mbtq_tenant: mbtqContext.tenantId,
        mbtq_correlation_id: mbtqContext.correlationId,
        mbtq_environment: mbtqContext.environment
      }
    });
    
    // Emit MBTQ event
    await emitEvent({
      event_type: 'finance.payment_processed',
      actor: {
        type: 'system',
        id: 'stripe-adapter',
        tenant_id: mbtqContext.tenantId
      },
      subject: {
        type: 'payment',
        id: charge.id,
        tenant_id: mbtqContext.tenantId
      },
      context: mbtqContext,
      payload: {
        stripe_charge_id: charge.id,
        amount: charge.amount,
        currency: charge.currency
      }
    });
    
    return charge;
  }
  
  async handleWebhook(stripeEvent) {
    // Reconstruct MBTQ context from Stripe metadata
    const mbtqContext = {
      tenantId: stripeEvent.data.object.metadata.mbtq_tenant,
      correlationId: stripeEvent.data.object.metadata.mbtq_correlation_id,
      environment: stripeEvent.data.object.metadata.mbtq_environment,
      // Generate new request ID for webhook processing
      requestId: generateRequestId()
    };
    
    // Process with full MBTQ context
    await processStripeEvent(mbtqContext, stripeEvent);
  }
}
```

### Protocol Guarantees

| **Guarantee** | **Mechanism** | **Layer** |
| --- | --- | --- |
| Context Propagation | X-Headers flow through all services | Infrastructure + Wire |
| Correlation Tracing | X-Correlation-Id + X-Request-Id chain | Wire + Event |
| Authorization Flow | x402 token passes through boundaries | Wire + Application |
| Schema Evolution | VDE version negotiation | Wire + Event |
| Multi-tenancy | X-MBTQ-Tenant + RLS enforcement | Wire + Storage |
| Actor Attribution | Separate actor/subject in events | Event + Storage |
| Dev-Prod Parity | Apache header injection (local = prod) | Infrastructure |
| Environment Isolation | X-MBTQ-Env routing + event tagging | Infrastructure + Event |

### Deployment Configurations

### Production (Cloud)

```
# /etc/apache2/sites-available/mbtq-api.conf
&lt;VirtualHost *:443&gt;
    ServerName api.mbtquniverse.com
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/mbtq.crt
    SSLCertificateKeyFile /etc/ssl/private/mbtq.key
    
    # Context Injection
    RequestHeader set X-MBTQ-Env "production"
    RequestHeader set X-Request-Id "%{UNIQUE_ID}e" env=!HTTP_X_REQUEST_ID
    
    # Validation
    RewriteEngine On
    RewriteCond %{HTTP:X-MBTQ-Tenant} ^$
    RewriteRule .* - [R=400,L]
    
    # Proxy to service mesh
    ProxyPass / http://internal-gateway:8080/
    ProxyPassReverse / http://internal-gateway:8080/
    ProxyPreserveHost On
&lt;/VirtualHost&gt;
```

### Development (Ubuntu Local)

```
# /etc/apache2/sites-available/mbtq-local.conf
&lt;VirtualHost *:80&gt;
    ServerName api.mbtq.local
    
    # Auto-inject dev environment
    RequestHeader set X-MBTQ-Env "dev"
    RequestHeader set X-Request-Id "%{UNIQUE_ID}e" env=!HTTP_X_REQUEST_ID
    
    # Auto-inject test tenant if missing
    RequestHeader set X-MBTQ-Tenant "test-tenant-001" env=!HTTP_X_MBTQ_TENANT
    
    # Proxy to local service (any port)
    ProxyPass / http://127.0.0.1:8080/
    ProxyPassReverse / http://127.0.0.1:8080/
    ProxyPreserveHost On
&lt;/VirtualHost&gt;
```

### Development (Windows/XAMPP)

```
# C:\xampp\apache\conf\extra\httpd-vhosts.conf
&lt;VirtualHost *:80&gt;
    ServerName api.mbtq.local
    DocumentRoot "C:/xampp/htdocs"
    
    RequestHeader set X-MBTQ-Env "dev"
    RequestHeader set X-Request-Id "%{UNIQUE_ID}e" env=!HTTP_X_REQUEST_ID
    RequestHeader set X-MBTQ-Tenant "test-tenant-001" env=!HTTP_X_MBTQ_TENANT
    
    ProxyPass / http://127.0.0.1:8080/
    ProxyPassReverse / http://127.0.0.1:8080/
    ProxyPreserveHost On
&lt;/VirtualHost&gt;
```

### Reference Implementation: Complete Service

Below is a minimal but complete service implementation showing all protocol layers:

```jsx
// pinksync-badge-service.js
import express from 'express';
import { v7 as uuidv7 } from 'uuid';

const app = express();
app.use(express.json());

// Context extraction middleware
app.use((req, res, next) => {
  req.mbtqContext = {
    tenantId: req.headers['x-mbtq-tenant'],
    userId: req.headers['x-mbtq-user'],
    partnerId: req.headers['x-mbtq-partner'],
    environment: req.headers['x-mbtq-env'] || 'unknown',
    correlationId: req.headers['x-correlation-id'] || uuidv7(),
    requestId: req.headers['x-request-id'] || uuidv7(),
    x402: req.headers['x-mbtq-x402'],
    vdeVersion: req.headers['x-mbtq-vde-version'] || '1.0.0'
  };
  next();
});

// Event emitter
async function emitEvent(event) {
  const envelope = {
    event_id: uuidv7(),
    event_type: event.event_type,
    event_version: event.event_version || '1.0.0',
    timestamp: new Date().toISOString(),
    actor: event.actor,
    subject: event.subject,
    context: event.context,
    payload: event.payload
  };
  
  // In production: send to event bus (Kafka, EventBridge, etc.)
  // In dev: write to local file or SQLite
  if (event.context.environment === 'dev') {
    await writeToLocalEventLog(envelope);
  } else {
    await publishToEventBus(envelope);
  }
  
  console.log('Event emitted:', JSON.stringify(envelope, null, 2));
}

// Badge issuance endpoint
app.post('/v1/tenants/:tenantId/badges/:badgeId:issue', async (req, res) => {
  const { tenantId, badgeId } = req.params;
  const { reason, issued_by } = req.body;
  const ctx = req.mbtqContext;
  
  // Validate tenant matches context
  if (tenantId !== ctx.tenantId) {
    return res.status(403).json({ error: 'Tenant mismatch' });
  }
  
  // Business logic
  const issuanceId = uuidv7();
  const issuedAt = new Date().toISOString();
  
  // Emit canonical event
  await emitEvent({
    event_type: 'partner.badge_issued',
    actor: {
      type: ctx.partnerId ? 'partner' : 'user',
      id: ctx.partnerId || ctx.userId,
      tenant_id: ctx.tenantId
    },
    subject: {
      type: 'badge',
      id: badgeId,
      tenant_id: ctx.tenantId
    },
    context: ctx,
    payload: {
      issuance_id: issuanceId,
      badge_id: badgeId,
      reason: reason,
      issued_by: issued_by,
      issued_at: issuedAt
    }
  });
  
  // Return response
  res.status(201).json({
    issuance_id: issuanceId,
    badge_id: badgeId,
    issued_at: issuedAt,
    correlation_id: ctx.correlationId
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`PinkSync Badge Service running on port ${PORT}`);
  console.log('Protocol: MBTQ Context Protocol v1.0');
});
```

### Testing the Protocol

### Local Test (Ubuntu/Windows)

```bash
# Start local service
node pinksync-badge-service.js

# In another terminal, make request through Apache
curl -X POST http://api.mbtq.local/v1/tenants/test-tenant/badges/accessibility-gold:issue \
  -H "Authorization: Bearer test-token" \
  -H "X-MBTQ-User: user-123" \
  -H "X-MBTQ-Partner: partner-xyz" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Completed WCAG AA audit",
    "issued_by": "auditor-001"
  }'

# Apache will inject:
# X-MBTQ-Env: dev
# X-MBTQ-Tenant: test-tenant-001 (if not provided)
# X-Request-Id: &lt;generated&gt;
```

### Production Test

```bash
curl -X POST https://api.mbtquniverse.com/v1/tenants/tenant-prod/badges/accessibility-gold:issue \
  -H "Authorization: Bearer PROD_TOKEN" \
  -H "X-MBTQ-Tenant: tenant-prod" \
  -H "X-MBTQ-User: user-456" \
  -H "X-MBTQ-Partner: partner-abc" \
  -H "X-Correlation-Id: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Production badge issuance",
    "issued_by": "prod-auditor"
  }'

# Apache will inject:
# X-MBTQ-Env: production
# X-Request-Id: &lt;generated&gt;
```

### Protocol Benefits

- **Unified Context:** Single source of truth for tenant, user, environment, correlation across all services
- **Dev-Prod Parity:** Identical behavior on localhost, staging, production via Apache normalization
- **Audit Trail:** Every event has complete actor-subject-context triad for compliance
- **Schema Evolution:** VDE versioning allows gradual upgrades without breaking changes
- **Cross-Ecosystem:** Adapters preserve MBTQ context when calling Stripe, Slack, AWS, etc.
- **Lightweight:** No Kubernetes, no service mesh, works on Apache/Windows/Ubuntu/bare metal
- **Observable:** Correlation IDs + event envelopes provide complete distributed tracing
- **Secure:** x402 tokens flow through entire chain, RLS enforced at storage layer

### Protocol Specification Documents

- **MBTQ-001:** X-Header Contract Specification
- **MBTQ-002:** Canonical Event Envelope Format
- **MBTQ-003:** Actor-Subject-Context Semantics
- **MBTQ-004:** Apache Context Injector Configuration
- **MBTQ-005:** x402 Authorization Token Format
- **MBTQ-006:** VDE Schema Versioning Rules
- **MBTQ-007:** Cross-Ecosystem Adapter Patterns
- **MBTQ-008:** Event Sourcing and RLS Integration

### Future Protocol Extensions

- **MBTQ-101:** GraphQL subscription mapping to canonical events
- **MBTQ-102:** WebSocket context propagation
- **MBTQ-103:** gRPC metadata mapping
- **MBTQ-104:** Event replay and time-travel debugging
- **MBTQ-105:** Multi-region event replication
- **MBTQ-106:** Event-driven RLS policy compilation

---

**The MBTQ Context Protocol provides a complete foundation for distributed systems that span ecosystems, environments, and decades. It's built on proven technology (Apache, HTTP headers, JSON events) while introducing novel patterns (unified context propagation, actor-subject separation, infrastructure-enforced contracts) that deserve recognition in the distributed systems community.**
