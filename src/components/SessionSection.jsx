function SessionSection({
  sessionClientId,
  onSessionClientIdChange,
  onStartAuthorization,
  disabled,
}) {
  return (
    <section className="section">
      <h2>Session Configuration</h2>
      <p className="section-description">
        Enter the Session Client ID from your backend session creation response.
      </p>

      <div className="form-group">
        <label htmlFor="sessionClientId">
          Session Client ID <span className="required">*</span>
        </label>
        <input
          id="sessionClientId"
          type="text"
          value={sessionClientId}
          onChange={(e) => onSessionClientIdChange(e.target.value)}
          placeholder="Enter session client ID"
          autoComplete="off"
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={onStartAuthorization}
          disabled={disabled}
        >
          Start Authorization Flow
        </button>
      </div>
    </section>
  )
}

export default SessionSection
