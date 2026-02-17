import { useState } from 'react'
import { FLOW_STATES } from '../constants'

const STATUS_CONFIG = {
  [FLOW_STATES.IDLE]: {
    message: 'Ready to start',
    type: 'idle',
    icon: '⏹️',
  },
  [FLOW_STATES.INITIALIZING_SDK]: {
    message: 'Initializing Klarna SDK...',
    type: 'loading',
    icon: '⏳',
  },
  [FLOW_STATES.SDK_READY]: {
    message: 'SDK initialized successfully',
    type: 'success',
    icon: '✓',
  },
  [FLOW_STATES.LOADING_WIDGET]: {
    message: 'Loading Klarna payment widget...',
    type: 'loading',
    icon: '⏳',
  },
  [FLOW_STATES.WIDGET_LOADED]: {
    message: 'Payment widget loaded - complete the form above',
    type: 'success',
    icon: '✓',
  },
  [FLOW_STATES.WIDGET_NOT_SHOWN]: {
    message: 'Payment widget not shown (pre-assessment)',
    type: 'warning',
    icon: '⚠',
  },
  [FLOW_STATES.AUTHORIZING]: {
    message: 'Authorizing payment...',
    type: 'loading',
    icon: '⏳',
  },
  [FLOW_STATES.AUTHORIZED]: {
    message: 'Authorization successful!',
    type: 'success',
    icon: '✓',
  },
  [FLOW_STATES.FAILED]: {
    message: 'Authorization failed',
    type: 'error',
    icon: '✗',
  },
  [FLOW_STATES.CANCELLED]: {
    message: 'Authorization cancelled',
    type: 'warning',
    icon: '⚠',
  },
}

function FlowStatus({ flowState, error }) {
  const [showErrorDetails, setShowErrorDetails] = useState(false)

  // Don't show the status section if we're in idle state and there's no error
  if (flowState === FLOW_STATES.IDLE && !error) {
    return null
  }

  const config = STATUS_CONFIG[flowState] || STATUS_CONFIG[FLOW_STATES.IDLE]

  return (
    <section className="section">
      <h2>Flow Status</h2>

      <div className={`status-indicator status-${config.type}`}>
        <span className="status-icon">{config.icon}</span>
        <span className="status-message">{config.message}</span>
      </div>

      {error && (
        <div className="error-container">
          <div className="error-summary">
            <span className="error-icon">⚠</span>
            <span className="error-message">{error.message || 'An error occurred'}</span>
          </div>

          {error.details && (
            <div className="error-details">
              <button
                type="button"
                className="error-toggle"
                onClick={() => setShowErrorDetails(!showErrorDetails)}
              >
                {showErrorDetails ? '▼' : '▶'} Error Details
              </button>

              {showErrorDetails && (
                <pre className="error-payload">
                  {typeof error.details === 'string'
                    ? error.details
                    : JSON.stringify(error.details, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default FlowStatus
