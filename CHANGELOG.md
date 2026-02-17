# Changelog

## [Unreleased] - Simplified Credentials

### Changed
- **Removed API Username and Password fields** - These were redundant for a frontend-only tool
- Simplified credentials to only require **Client Token** (from backend session creation)
- Updated all validation logic to only check for client token
- Renamed "API Credentials" section to "Client Token" for clarity
- Updated all documentation to reflect the simplified flow

### Why This Change?
The Klarna Web SDK (frontend) only needs the `client_token` to initialize. API username and password are used by the **backend** to create sessions via server-side API calls. Since this is a frontend-only tool for developers who have already created sessions on their backend, they only need:
1. **Client Token** (from session creation response)
2. **Session Client ID** (from session creation response)

### Security Benefits
- Eliminates the risk of exposing API credentials in frontend code
- Follows Klarna's recommended integration pattern
- Aligns with security best practices (credentials stay on backend)

### Files Modified
- `src/components/CredentialsSection.jsx` - Removed username/password fields
- `src/App.jsx` - Simplified credentials state and validation
- `src/hooks/useKlarnaSDK.js` - Updated comments and documentation
- `README.md` - Updated usage instructions and troubleshooting
