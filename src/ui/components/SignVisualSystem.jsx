import React, { useState, useEffect, useCallback } from 'react';
import { Activity, AlertCircle, CheckCircle, Loader, Pause, Play } from 'lucide-react';

// State Machine - Single source of truth
const AGENT_STATES = {
  IDLE: 'idle',
  LISTENING: 'listening',
  PROCESSING: 'processing',
  VALIDATING: 'validating',
  EXECUTING: 'executing',
  COMPLETED: 'completed',
  ERROR: 'error',
  NEEDS_INPUT: 'needs_input'
};

// Semantic mappings for sign visualization
const STATE_SEMANTICS = {
  [AGENT_STATES.IDLE]: {
    visual: 'Ready',
    color: 'bg-gray-500',
    icon: Pause,
    motion: 'pulse-slow',
    meaning: 'System ready to receive'
  },
  [AGENT_STATES.LISTENING]: {
    visual: 'Receiving',
    color: 'bg-blue-500',
    icon: Activity,
    motion: 'pulse',
    meaning: 'Processing your intent'
  },
  [AGENT_STATES.PROCESSING]: {
    visual: 'Thinking',
    color: 'bg-purple-500',
    icon: Loader,
    motion: 'spin',
    meaning: 'Reasoning through options'
  },
  [AGENT_STATES.VALIDATING]: {
    visual: 'Checking',
    color: 'bg-yellow-500',
    icon: AlertCircle,
    motion: 'bounce',
    meaning: 'Validating constraints'
  },
  [AGENT_STATES.EXECUTING]: {
    visual: 'Acting',
    color: 'bg-orange-500',
    icon: Play,
    motion: 'pulse-fast',
    meaning: 'Executing action'
  },
  [AGENT_STATES.COMPLETED]: {
    visual: 'Done',
    color: 'bg-green-500',
    icon: CheckCircle,
    motion: 'none',
    meaning: 'Action completed'
  },
  [AGENT_STATES.ERROR]: {
    visual: 'Error',
    color: 'bg-red-500',
    icon: AlertCircle,
    motion: 'shake',
    meaning: 'Issue requires attention'
  },
  [AGENT_STATES.NEEDS_INPUT]: {
    visual: 'Waiting',
    color: 'bg-indigo-500',
    icon: Pause,
    motion: 'pulse',
    meaning: 'Your input needed'
  }
};

// Event Bus for state changes
class StateEventBus {
  constructor() {
    this.listeners = [];
  }

  emit(event) {
    this.listeners.forEach(listener => listener(event));
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }
}

const eventBus = new StateEventBus();

// Signer Panel Component - Persistent, dockable state renderer
const SignerPanel = ({ state, position = 'right', size = 'medium' }) => {
  const semantic = STATE_SEMANTICS[state.current];
  const Icon = semantic.icon;

  const sizeClasses = {
    small: 'w-48 h-48',
    medium: 'w-64 h-64',
    large: 'w-80 h-80'
  };

  const positionClasses = {
    right: 'right-4',
    left: 'left-4',
    center: 'left-1/2 -translate-x-1/2'
  };

  return (
    <div className={`fixed ${positionClasses[position]} top-4 ${sizeClasses[size]} bg-gray-900 rounded-2xl shadow-2xl border-2 ${semantic.color.replace('bg-', 'border-')} flex flex-col overflow-hidden z-50`}>
      {/* State Indicator Header */}
      <div className={`${semantic.color} px-4 py-3 flex items-center justify-between`}>
        <span className="font-bold text-white text-lg">{semantic.visual}</span>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Visual Sign Area */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Primary Visual Cue */}
        <div className={`relative ${semantic.motion === 'spin' ? 'animate-spin' : ''} 
                        ${semantic.motion === 'pulse' ? 'animate-pulse' : ''}
                        ${semantic.motion === 'pulse-slow' ? 'animate-pulse-slow' : ''}
                        ${semantic.motion === 'pulse-fast' ? 'animate-pulse-fast' : ''}
                        ${semantic.motion === 'bounce' ? 'animate-bounce' : ''}
                        ${semantic.motion === 'shake' ? 'animate-shake' : ''}`}>
          <Icon className={`w-32 h-32 ${semantic.color.replace('bg-', 'text-')}`} />
        </div>

        {/* Confidence Indicator */}
        {state.confidence !== undefined && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full ${semantic.color} transition-all duration-500`}
                style={{ width: `${state.confidence * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 mt-1 block">
              Confidence: {Math.round(state.confidence * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Semantic Meaning */}
      <div className="bg-gray-800 px-4 py-3 border-t border-gray-700">
        <p className="text-sm text-gray-300 font-medium">{semantic.meaning}</p>
        {state.actor && (
          <p className="text-xs text-gray-500 mt-1">Agent: {state.actor}</p>
        )}
        {state.requiresUser && (
          <p className="text-xs text-yellow-400 mt-1 font-bold">⚠ Action Required</p>
        )}
      </div>
    </div>
  );
};

// Confidence Cue Component
const ConfidenceCue = ({ confidence, type = 'bar' }) => {
  const getColor = () => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400">Certainty:</span>
      <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300`}
          style={{ width: `${confidence * 100}%` }}
        />
      </div>
      <span className="text-sm font-mono text-gray-300">
        {Math.round(confidence * 100)}%
      </span>
    </div>
  );
};

// Agent Action Log
const ActionLog = ({ events }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
      <h3 className="text-lg font-bold text-white mb-3">Agent Activity</h3>
      <div className="space-y-2">
        {events.map((event, idx) => {
          const semantic = STATE_SEMANTICS[event.current];
          return (
            <div key={idx} className="flex items-start gap-3 text-sm">
              <span className={`${semantic.color} w-2 h-2 rounded-full mt-1.5 flex-shrink-0`} />
              <div className="flex-1">
                <span className="text-gray-300 font-medium">{semantic.visual}</span>
                <span className="text-gray-500 mx-2">·</span>
                <span className="text-gray-400">{semantic.meaning}</span>
                {event.actor && (
                  <span className="text-gray-600 text-xs ml-2">({event.actor})</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main App - Sign Visual System Demo
export default function SignVisualSystem() {
  const [agentState, setAgentState] = useState({
    current: AGENT_STATES.IDLE,
    actor: null,
    confidence: 1.0,
    requiresUser: false
  });

  const [eventLog, setEventLog] = useState([]);
  const [panelSize, setPanelSize] = useState('medium');
  const [panelPosition, setPosition] = useState('right');

  // Subscribe to state events
  useEffect(() => {
    const unsubscribe = eventBus.subscribe((event) => {
      setAgentState(event);
      setEventLog(prev => [event, ...prev].slice(0, 20));
    });

    return unsubscribe;
  }, []);

  // Simulate agent workflow
  const simulateAgentFlow = useCallback(() => {
    const flow = [
      { current: AGENT_STATES.LISTENING, actor: 'MagicianCore', confidence: 1.0, requiresUser: false },
      { current: AGENT_STATES.PROCESSING, actor: 'MagicianCore', confidence: 0.85, requiresUser: false },
      { current: AGENT_STATES.VALIDATING, actor: 'Validator', confidence: 0.92, requiresUser: false },
      { current: AGENT_STATES.EXECUTING, actor: 'PinkSync', confidence: 0.95, requiresUser: false },
      { current: AGENT_STATES.COMPLETED, actor: 'MagicianCore', confidence: 1.0, requiresUser: false }
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step >= flow.length) {
        clearInterval(interval);
        setTimeout(() => {
          eventBus.emit({ current: AGENT_STATES.IDLE, actor: null, confidence: 1.0, requiresUser: false });
        }, 1500);
        return;
      }
      eventBus.emit(flow[step]);
      step++;
    }, 1800);
  }, []);

  const simulateError = () => {
    eventBus.emit({
      current: AGENT_STATES.ERROR,
      actor: 'Validator',
      confidence: 0.0,
      requiresUser: true
    });
  };

  const simulateNeedsInput = () => {
    eventBus.emit({
      current: AGENT_STATES.NEEDS_INPUT,
      actor: 'MagicianCore',
      confidence: 0.7,
      requiresUser: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      {/* Signer Panel - Always visible, persistent */}
      <SignerPanel state={agentState} size={panelSize} position={panelPosition} />

      {/* Control Panel */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-2">Sign Visual System</h1>
          <p className="text-gray-400 mb-6">
            Agent state as first-class visual channel. Sign leads. Text follows.
          </p>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={simulateAgentFlow}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Simulate Agent Flow
            </button>
            <button
              onClick={simulateError}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Simulate Error State
            </button>
            <button
              onClick={simulateNeedsInput}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Simulate Needs Input
            </button>
            <button
              onClick={() => eventBus.emit({ current: AGENT_STATES.IDLE, actor: null, confidence: 1.0, requiresUser: false })}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Reset to Idle
            </button>
          </div>

          {/* Panel Configuration */}
          <div className="border-t border-gray-700 pt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Panel Size</label>
              <div className="flex gap-2">
                {['small', 'medium', 'large'].map(size => (
                  <button
                    key={size}
                    onClick={() => setPanelSize(size)}
                    className={`px-4 py-2 rounded ${panelSize === size ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Panel Position</label>
              <div className="flex gap-2">
                {['left', 'center', 'right'].map(pos => (
                  <button
                    key={pos}
                    onClick={() => setPosition(pos)}
                    className={`px-4 py-2 rounded ${panelPosition === pos ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Current State Details */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Current State</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">State:</span>
              <span className="text-white font-mono">{agentState.current}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Actor:</span>
              <span className="text-white font-mono">{agentState.actor || 'None'}</span>
            </div>
            <ConfidenceCue confidence={agentState.confidence} />
            <div className="flex justify-between">
              <span className="text-gray-400">Requires User:</span>
              <span className={agentState.requiresUser ? 'text-yellow-400' : 'text-gray-500'}>
                {agentState.requiresUser ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <ActionLog events={eventLog} />

        {/* Philosophy */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-3">Design Philosophy</h2>
          <div className="space-y-2 text-gray-300">
            <p>• Sign visuals reflect system state, not text output</p>
            <p>• Every agent action emits a visible state change</p>
            <p>• No silent processing, no hidden waits</p>
            <p>• Confidence and uncertainty are first-class signals</p>
            <p>• If the system thinks, it signs. If it cannot sign, it should not act.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the event bus for external use
export { eventBus, AGENT_STATES, STATE_SEMANTICS };
