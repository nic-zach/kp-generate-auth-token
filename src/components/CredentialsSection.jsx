function CredentialsSection({
  credentials,
  rememberSession,
  onCredentialsChange,
  onRememberSessionChange,
  onClearCredentials,
  onStartAuthorization,
  disabled,
}) {
  const handleClientTokenChange = (e) => {
    onCredentialsChange({
      ...credentials,
      clientToken: e.target.value,
    })
  }

  const handlePaymentMethodChange = (e) => {
    onCredentialsChange({
      ...credentials,
      paymentMethodCategory: e.target.value,
    })
  }

  return (
    <section className="section">
      <h2>Session Configuration</h2>
      <p className="section-description">
        Enter the client token from your backend session creation response and select the payment method category.
      </p>

      <div className="form-group">
        <label htmlFor="clientToken">
          Client Token <span className="required">*</span>
        </label>
        <input
          id="clientToken"
          type="text"
          value={credentials.clientToken}
          onChange={handleClientTokenChange}
          placeholder="Enter client token from session creation"
          autoComplete="off"
        />
      </div>

      <div className="form-group">
        <label htmlFor="paymentMethod">
          Payment Method Category <span className="required">*</span>
        </label>
        <select
          id="paymentMethod"
          value={credentials.paymentMethodCategory || ''}
          onChange={handlePaymentMethodChange}
          className="payment-method-select"
        >
          <option value="">Select payment method</option>
          <option value="pay_later">Pay Later</option>
          <option value="pay_now">Pay Now</option>
          <option value="pay_over_time">Pay Over Time</option>
        </select>
        <p className="field-hint">
          Choose the payment method category from your session configuration
        </p>
      </div>

      <div className="form-actions">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={rememberSession}
            onChange={(e) => onRememberSessionChange(e.target.checked)}
          />
          <span>Temporarily remember in session</span>
        </label>

        <button
          type="button"
          className="btn-secondary"
          onClick={onClearCredentials}
        >
          Clear Credentials
        </button>
      </div>

      <div className="form-actions" style={{ marginTop: 'var(--spacing-lg)' }}>
        <button
          type="button"
          className="btn-primary"
          onClick={onStartAuthorization}
          disabled={disabled}
          style={{ width: '100%' }}
        >
          Start Authorization Flow
        </button>
      </div>
    </section>
  )
}

export default CredentialsSection
