mbtq-context-protocol/
├── README.md
├── LICENSE
├── docs/
│   ├── MBTQ-001-header-contract.md
│   ├── MBTQ-002-event-envelope.md
│   ├── MBTQ-003-actor-subject-context.md
│   ├── MBTQ-004-apache-configuration.md
│   ├── MBTQ-005-x402-tokens.md
│   ├── MBTQ-006-vde-versioning.md
│   ├── MBTQ-007-adapter-patterns.md
│   └── MBTQ-008-event-sourcing-rls.md
├── apache/
│   ├── production.conf
│   ├── staging.conf
│   ├── development-ubuntu.conf
│   └── development-windows.conf
├── sdk/
│   ├── javascript/
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── context-extractor.js
│   │   │   ├── event-emitter.js
│   │   │   ├── middleware.js
│   │   │   └── index.js
│   │   └── tests/
│   ├── python/
│   │   ├── setup.py
│   │   ├── mbtq_context/
│   │   │   ├── __init__.py
│   │   │   ├── context.py
│   │   │   ├── events.py
│   │   │   └── middleware.py
│   │   └── tests/
│   └── php/
│       ├── composer.json
│       ├── src/
│       │   ├── ContextExtractor.php
│       │   ├── EventEmitter.php
│       │   └── Middleware.php
│       └── tests/
├── examples/
│   ├── pinksync-badge-service/
│   │   ├── package.json
│   │   ├── server.js
│   │   └── README.md
│   ├── notification-service/
│   │   ├── requirements.txt
│   │   ├── app.py
│   │   └── README.md
│   └── analytics-service/
│       ├── composer.json
│       ├── index.php
│       └── README.md
├── adapters/
│   ├── stripe/
│   │   ├── stripe-adapter.js
│   │   └── README.md
│   ├── slack/
│   │   ├── slack-adapter.js
│   │   └── README.md
│   └── aws/
│       ├── eventbridge-adapter.js
│       └── README.md
├── tools/
│   ├── event-validator/
│   │   ├── validator.js
│   │   └── schemas/
│   ├── context-inspector/
│   │   ├── inspector.js
│   │   └── README.md
│   └── correlation-tracer/
│       ├── tracer.js
│       └── README.md
└── tests/
    ├── integration/
    ├── e2e/
    └── fixtures/
