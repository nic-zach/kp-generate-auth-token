import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for Klarna Payments SDK integration
 *
 * ✅ SDK URL configured: https://x.klarnacdn.net/kp/lib/v1/api.js is loaded in index.html
 *
 * This hook implements the official Klarna Payments SDK flow:
 * 1. init() - Initialize SDK with client_token
 * 2. load() - Render payment widget in container
 * 3. authorize() - Get authorization_token
 *
 * References:
 * - https://docs.klarna.com/payments/web-payments/additional-resources/klarna-payments-sdk-reference/
 * - https://credit.klarnacdn.net/lib/v1/index.html
 */

export function useKlarnaSDK() {
  const [sdkInitialized, setSdkInitialized] = useState(false)
  const [widgetLoaded, setWidgetLoaded] = useState(false)
  const [sdkError, setSDKError] = useState(null)
  const [authorizationToken, setAuthorizationToken] = useState(null)
  const [flowState, setFlowState] = useState('idle')

  /**
   * Check if Klarna SDK is available
   */
  const checkSDK = useCallback(() => {
    if (typeof window !== 'undefined' && window.Klarna && window.Klarna.Payments) {
      return true
    }
    return false
  }, [])

  /**
   * Initialize the Klarna SDK with the client token
   *
   * @param {Object} credentials - Credentials object
   * @param {string} credentials.clientToken - Klarna client token from session creation
   */
  const initializeSDK = useCallback(async (credentials) => {
    try {
      setFlowState('initializing_sdk')
      setSDKError(null)

      if (!checkSDK()) {
        throw new Error('Klarna Payments SDK not loaded. Ensure script is included in index.html')
      }

      // Initialize SDK with client_token
      await window.Klarna.Payments.init({
        client_token: credentials.clientToken
      })

      console.log('✅ Klarna SDK initialized successfully')
      setSdkInitialized(true)
      setFlowState('sdk_ready')
      return { success: true }
    } catch (error) {
      console.error('❌ SDK initialization failed:', error)
      const errorObj = {
        message: error.message || 'Failed to initialize Klarna SDK',
        details: error,
      }
      setSDKError(errorObj)
      setFlowState('failed')
      return { success: false, error: errorObj }
    }
  }, [checkSDK])

  /**
   * Load the Klarna payment widget
   *
   * @param {HTMLElement} container - DOM element to render the widget into
   * @param {string} paymentMethodCategory - Payment method category (pay_later, pay_now, pay_over_time)
   * @param {Object} data - Optional session data
   */
  const loadWidget = useCallback((container, paymentMethodCategory, data = {}) => {
    return new Promise((resolve, reject) => {
      if (!sdkInitialized) {
        reject(new Error('SDK not initialized'))
        return
      }

      if (!checkSDK()) {
        reject(new Error('Klarna Payments SDK not available'))
        return
      }

      setFlowState('loading_widget')
      console.log('⏳ Loading Klarna payment widget...')

      try {
        window.Klarna.Payments.load(
          {
            container: container,
            payment_method_category: paymentMethodCategory
          },
          data,
          function (res) {
            console.log('Klarna load() callback:', res)

            if (res.show_form) {
              console.log('✅ Klarna widget loaded successfully')
              setWidgetLoaded(true)
              setFlowState('widget_loaded')
              resolve({ success: true, showForm: res.show_form })
            } else if (res.error) {
              console.error('❌ Klarna widget load error:', res.error)
              const error = {
                message: 'Failed to load payment widget',
                details: res.error
              }
              setSDKError(error)
              setFlowState('failed')
              reject(error)
            } else {
              // Form not shown (pre-assessment failed)
              console.warn('⚠️ Klarna widget: form not shown')
              setFlowState('widget_not_shown')
              resolve({ success: false, showForm: false })
            }
          }
        )
      } catch (error) {
        console.error('❌ Klarna load() error:', error)
        const errorObj = {
          message: error.message || 'Failed to load widget',
          details: error
        }
        setSDKError(errorObj)
        setFlowState('failed')
        reject(errorObj)
      }
    })
  }, [sdkInitialized, checkSDK])

  /**
   * Authorize the payment and get authorization token
   *
   * @param {string} paymentMethodCategory - Payment method category
   * @param {Object} data - Optional updated order/customer details
   */
  const authorize = useCallback((paymentMethodCategory, data = {}) => {
    return new Promise((resolve, reject) => {
      if (!widgetLoaded) {
        reject(new Error('Widget not loaded'))
        return
      }

      if (!checkSDK()) {
        reject(new Error('Klarna Payments SDK not available'))
        return
      }

      setFlowState('authorizing')
      setSDKError(null)
      console.log('⏳ Authorizing payment...')

      try {
        window.Klarna.Payments.authorize(
          {
            payment_method_category: paymentMethodCategory
          },
          data,
          function (res) {
            console.log('Klarna authorize() callback:', res)

            if (res.approved && res.authorization_token) {
              console.log('✅ Authorization successful!')
              setAuthorizationToken(res.authorization_token)
              setFlowState('authorized')
              resolve({
                success: true,
                approved: res.approved,
                authorizationToken: res.authorization_token,
                finalizeRequired: res.finalize_required || false
              })
            } else if (res.show_form) {
              // Customer needs to complete more information
              console.log('ℹ️ Customer needs to complete the form')
              setFlowState('widget_loaded')
              resolve({
                success: false,
                approved: false,
                showForm: true
              })
            } else if (res.error) {
              console.error('❌ Authorization error:', res.error)
              const error = {
                message: 'Authorization failed',
                details: res.error
              }
              setSDKError(error)
              setFlowState('failed')
              reject(error)
            } else {
              // Not approved
              console.warn('⚠️ Authorization not approved')
              const error = {
                message: 'Authorization was not approved',
                details: res
              }
              setSDKError(error)
              setFlowState('failed')
              reject(error)
            }
          }
        )
      } catch (error) {
        console.error('❌ Klarna authorize() error:', error)
        const errorObj = {
          message: error.message || 'Authorization failed',
          details: error
        }
        setSDKError(errorObj)
        setFlowState('failed')
        reject(errorObj)
      }
    })
  }, [widgetLoaded, checkSDK])

  /**
   * Reset the SDK state
   */
  const resetFlow = useCallback(() => {
    setSdkInitialized(false)
    setWidgetLoaded(false)
    setSDKError(null)
    setAuthorizationToken(null)
    setFlowState('idle')
  }, [])

  /**
   * Check if Klarna SDK is loaded on mount
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Give SDK time to load
      const timeout = setTimeout(() => {
        if (checkSDK()) {
          console.log('✅ Klarna Payments SDK detected:', window.Klarna.Payments)
        } else {
          console.error('❌ Klarna Payments SDK not found')
          console.error('Expected: window.Klarna.Payments')
          console.error('Make sure <script src="https://x.klarnacdn.net/kp/lib/v1/api.js"> is in index.html')
        }
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [checkSDK])

  return {
    sdkInitialized,
    widgetLoaded,
    sdkError,
    authorizationToken,
    flowState,
    initializeSDK,
    loadWidget,
    authorize,
    resetFlow,
  }
}

export default useKlarnaSDK
