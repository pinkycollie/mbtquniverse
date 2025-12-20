# Sign Visual System

A React-based visual system for displaying agent state as a first-class UI channel. This system provides real-time visual feedback for agent operations, making system state transparent and immediately understandable.

## Philosophy

- **Sign visuals reflect system state, not text output**
- **Every agent action emits a visible state change**
- **No silent processing, no hidden waits**
- **Confidence and uncertainty are first-class signals**
- **If the system thinks, it signs. If it cannot sign, it should not act.**

## Features

### State Machine
The system uses a centralized state machine with 8 core states:

- **IDLE**: System ready to receive input
- **LISTENING**: Processing user intent
- **PROCESSING**: Reasoning through options
- **VALIDATING**: Checking constraints
- **EXECUTING**: Performing actions
- **COMPLETED**: Action successfully finished
- **ERROR**: Issue requiring attention
- **NEEDS_INPUT**: Waiting for user input

### Components

#### SignerPanel
A persistent, dockable panel that displays the current agent state with:
- Visual icon representation
- Animated state transitions
- Confidence indicator
- Semantic meaning text
- Actor information

Configuration options:
- **Size**: small, medium, large
- **Position**: left, center, right

#### ConfidenceCue
A progress bar showing the agent's confidence level in its current action.

#### ActionLog
A scrollable log of all agent state transitions with timestamps and actors.

### Event Bus
A publish-subscribe event system for state changes:

```javascript
import { eventBus, AGENT_STATES } from './components/SignVisualSystem.jsx';

// Emit a state change
eventBus.emit({
  current: AGENT_STATES.PROCESSING,
  actor: 'MyAgent',
  confidence: 0.85,
  requiresUser: false
});

// Subscribe to state changes
const unsubscribe = eventBus.subscribe((event) => {
  console.log('State changed:', event);
});
```

## Development

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running the UI

```bash
# Development mode with hot reload
npm run dev:ui

# Build for production
npm run build:ui

# Preview production build
npm run preview:ui
```

The development server will start at `http://localhost:5173`

## Integration

To integrate the Sign Visual System into your agent workflow:

1. Import the event bus and states:
```javascript
import { eventBus, AGENT_STATES } from './ui/components/SignVisualSystem.jsx';
```

2. Emit state changes during your agent operations:
```javascript
// Start listening
eventBus.emit({
  current: AGENT_STATES.LISTENING,
  actor: 'YourAgent',
  confidence: 1.0,
  requiresUser: false
});

// Processing
eventBus.emit({
  current: AGENT_STATES.PROCESSING,
  actor: 'YourAgent',
  confidence: 0.87,
  requiresUser: false
});

// Completed
eventBus.emit({
  current: AGENT_STATES.COMPLETED,
  actor: 'YourAgent',
  confidence: 1.0,
  requiresUser: false
});
```

3. Handle errors:
```javascript
eventBus.emit({
  current: AGENT_STATES.ERROR,
  actor: 'YourAgent',
  confidence: 0.0,
  requiresUser: true
});
```

## Technology Stack

- **React 18**: UI framework
- **Lucide React**: Icon library
- **Tailwind CSS**: Styling
- **Vite**: Build tool and dev server

## File Structure

```
src/ui/
├── components/
│   └── SignVisualSystem.jsx  # Main component
├── styles/
│   └── index.css             # Tailwind CSS imports
├── main.jsx                  # React entry point
└── index.html                # HTML template
```

## Customization

### Adding New States

To add a new state, update the `AGENT_STATES` and `STATE_SEMANTICS` objects in `SignVisualSystem.jsx`:

```javascript
const AGENT_STATES = {
  // ... existing states
  MY_NEW_STATE: 'my_new_state'
};

const STATE_SEMANTICS = {
  // ... existing semantics
  [AGENT_STATES.MY_NEW_STATE]: {
    visual: 'Custom Label',
    color: 'bg-cyan-500',
    icon: YourIcon,
    motion: 'pulse',
    meaning: 'Doing something custom'
  }
};
```

### Styling

The system uses Tailwind CSS for styling. Modify the `tailwind.config.js` file to customize colors, animations, and other design tokens.

## License

MIT
