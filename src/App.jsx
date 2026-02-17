import { useState, useEffect, useCallback } from 'react'
import EnvironmentBanner from './components/EnvironmentBanner'
import CredentialsSection from './components/CredentialsSection'
import SessionSection from './components/SessionSection'
import KlarnaWidget from './components/KlarnaWidget'
import FlowStatus from './components/FlowStatus'
import AuthorizationResult from './components/AuthorizationResult'
import useKlarnaSDK from './hooks/useKlarnaSDK'
import { FLOW_STATES } from './constants'

function App() {
  // Credentials state
  const [credentials, setCredentials] = useState({
    clientToken: '',
    paymentMethodCategory: '',
  })
  const [rememberSession, setRememberSession] = useState(false)

  // Session state
  const [sessionClientId, setSessionClientId] = useState('')

  // Error state
  const [error, setError] = useState(null)

  // Authorization result
  const [authorizationToken, setAuthorizationToken] = useState(null)
  const [timestamp, setTimestamp] = useState(null)

  // Klarna SDK hook
  const {
    sdkInitialized,
    widgetLoaded,
    sdkError,
    authorizationToken: sdkAuthToken,
    flowState: sdkFlowState,
    initializeSDK,
    loadWidget,
    authorize,
    resetFlow: resetSDK,
  } = useKlarnaSDK()

  // Widget container ref
  const [widgetContainerReady, setWidgetContainerReady] = useState(false)

  // Load credentials from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('kp_credentials')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setCredentials(parsed)
        setRememberSession(true)
      } catch (e) {
        sessionStorage.removeItem('kp_credentials')
      }
    }

    // Defensive: clear any localStorage
    localStorage.clear()
  }, [])

  // Save credentials to sessionStorage when remember is enabled
  useEffect(() => {
    if (rememberSession && credentials.clientToken) {
      sessionStorage.setItem('kp_credentials', JSON.stringify(credentials))
    } else if (!rememberSession) {
      sessionStorage.removeItem('kp_credentials')
    }
  }, [credentials, rememberSession])

  // Update authorization token when SDK provides it
  useEffect(() => {
    if (sdkAuthToken && !authorizationToken) {
      setAuthorizationToken(sdkAuthToken)
      setTimestamp(new Date())
    }
  }, [sdkAuthToken, authorizationToken])

  // Update error when SDK error changes
  useEffect(() => {
    if (sdkError) {
      setError(sdkError)
    }
  }, [sdkError])

  const handleCredentialsChange = (newCredentials) => {
    setCredentials(newCredentials)
  }

  const handleClearCredentials = () => {
    setCredentials({
      clientToken: '',
      paymentMethodCategory: '',
    })
    sessionStorage.removeItem('kp_credentials')
  }

  const handleStartFlow = async () => {
    // Validation
    if (!credentials.clientToken) {
      setError({ message: 'Client token is required' })
      return
    }
    if (!credentials.paymentMethodCategory) {
      setError({ message: 'Payment method category is required' })
      return
    }
    if (!sessionClientId.trim()) {
      setError({ message: 'Session Client ID is required' })
      return
    }

    // Clear previous error and token
    setError(null)
    setAuthorizationToken(null)
    setTimestamp(null)

    try {
      // Step 1: Initialize SDK
      const initResult = await initializeSDK(credentials)
      if (!initResult.success) {
        setError(initResult.error)
        return
      }

      // Step 2: Widget will be loaded when container is ready
      setWidgetContainerReady(true)
    } catch (err) {
      setError({
        message: 'Failed to start flow',
        details: err
      })
    }
  }

  const handleWidgetContainerReady = useCallback(async (container) => {
    if (!sdkInitialized || !credentials.paymentMethodCategory) {
      return
    }

    try {
      // Load the widget
      await loadWidget(container, credentials.paymentMethodCategory, {
        // Optional: pass additional session data here
      })
    } catch (err) {
      console.error('Failed to load widget:', err)
    }
  }, [sdkInitialized, credentials.paymentMethodCategory, loadWidget])

  const handleAuthorize = async () => {
    if (!widgetLoaded) {
      setError({ message: 'Widget not loaded yet' })
      return
    }

    try {
      const result = await authorize(credentials.paymentMethodCategory, {
        // Optional: pass billing_address or other data here
      })

      if (result.success && result.authorizationToken) {
        // Token will be set via useEffect when sdkAuthToken updates
        console.log('Authorization successful!')
      } else if (result.showForm) {
        setError({ message: 'Please complete the payment form and try again' })
      }
    } catch (err) {
      console.error('Authorization failed:', err)
    }
  }

  const handleReset = () => {
    setSessionClientId('')
    setError(null)
    setAuthorizationToken(null)
    setTimestamp(null)
    setWidgetContainerReady(false)
    resetSDK()
  }

  const isStartButtonDisabled =
    !credentials.clientToken ||
    !credentials.paymentMethodCategory ||
    !sessionClientId.trim() ||
    sdkFlowState === 'initializing_sdk' ||
    sdkFlowState === 'loading_widget'

  const isAuthorizeButtonDisabled =
    !widgetLoaded ||
    sdkFlowState === 'authorizing'

  const showWidget = widgetContainerReady && sdkInitialized

  return (
    <div className="app">
      <EnvironmentBanner />

      <div className="container">
        <header className="app-header">
          <h1>Klarna Playground Authorization Token Tester</h1>
          <p className="subtitle">Generate authorization tokens for backend API testing</p>
        </header>

        <CredentialsSection
          credentials={credentials}
          rememberSession={rememberSession}
          onCredentialsChange={handleCredentialsChange}
          onRememberSessionChange={setRememberSession}
          onClearCredentials={handleClearCredentials}
        />

        <SessionSection
          sessionClientId={sessionClientId}
          onSessionClientIdChange={setSessionClientId}
          onStartAuthorization={handleStartFlow}
          disabled={isStartButtonDisabled}
        />

        {showWidget && (
          <KlarnaWidget
            visible={showWidget}
            onLoad={handleWidgetContainerReady}
          />
        )}

        {widgetLoaded && !authorizationToken && (
          <section className="section">
            <h2>Complete Authorization</h2>
            <p className="section-description">
              Complete the payment details in the widget above, then click authorize to get your token.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={handleAuthorize}
              disabled={isAuthorizeButtonDisabled}
            >
              {sdkFlowState === 'authorizing' ? 'Authorizing...' : 'Authorize Payment'}
            </button>
          </section>
        )}

        <FlowStatus
          flowState={sdkFlowState}
          error={error}
        />

        {authorizationToken && (
          <AuthorizationResult
            token={authorizationToken}
            timestamp={timestamp}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  )
}

export default App
