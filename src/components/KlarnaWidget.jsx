import { useEffect, useRef } from 'react'

function KlarnaWidget({ visible, onLoad }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (visible && containerRef.current) {
      // Notify parent that container is ready
      onLoad(containerRef.current)
    }
  }, [visible, onLoad])

  if (!visible) {
    return null
  }

  return (
    <section className="section">
      <h2>Klarna Payment Widget</h2>
      <p className="section-description">
        Complete your payment details below. The Klarna widget will guide you through the authorization process.
      </p>

      <div
        id="klarna-payments-container"
        ref={containerRef}
        className="klarna-widget-container"
      >
        {/* Klarna will inject the payment form here */}
      </div>

      <div className="widget-loading">
        <span className="loading-spinner">⏳</span>
        <span>Loading Klarna payment widget...</span>
      </div>
    </section>
  )
}

export default KlarnaWidget
