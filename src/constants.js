// Flow states for the authorization process
export const FLOW_STATES = {
  IDLE: 'idle',
  INITIALIZING_SDK: 'initializing_sdk',
  SDK_READY: 'sdk_ready',
  LOADING_WIDGET: 'loading_widget',
  WIDGET_LOADED: 'widget_loaded',
  WIDGET_NOT_SHOWN: 'widget_not_shown',
  AUTHORIZING: 'authorizing',
  AUTHORIZED: 'authorized',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
}
