import { useState } from 'react'

function AuthorizationResult({ token, timestamp, onReset }) {
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(token)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy token:', err)
    }
  }

  const formatTimestamp = (date) => {
    if (!date) return ''
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <section className="section result-section">
      <h2>Authorization Token</h2>

      <div className="security-warning">
        <span className="warning-icon">🔒</span>
        <span>
          Authorization tokens are sensitive. Do not share outside secure environments.
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="authToken">Token</label>
        <textarea
          id="authToken"
          className="token-display"
          value={token}
          readOnly
          rows={4}
        />
      </div>

      {timestamp && (
        <div className="token-metadata">
          <span className="metadata-label">Generated:</span>
          <span className="metadata-value">{formatTimestamp(timestamp)}</span>
        </div>
      )}

      <div className="result-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={handleCopyToClipboard}
        >
          {copySuccess ? '✓ Copied!' : 'Copy to Clipboard'}
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </section>
  )
}

export default AuthorizationResult
