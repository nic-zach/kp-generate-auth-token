# Klarna Playground Authorization Token Tester

A minimal, frontend-only web application that allows backend developers to test Klarna authorization flows and retrieve authorization tokens in the Playground environment.

⚠️ **PLAYGROUND ONLY** - This tool is strictly for testing in Klarna's Playground environment and must never be used with production credentials.

## Purpose

This tool enables backend developers to:

- Complete the frontend authorization flow without building a full frontend integration
- Retrieve authorization tokens needed for backend API testing
- Validate Klarna session creation and order flows
- Test end-to-end integration in a safe Playground environment

## Prerequisites

- Node.js 18+ and npm
- Klarna Playground API credentials (username, password)
- A valid Klarna Playground session (created via your backend API)

## Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Production Build

```bash
npm run build
npm run preview
```

The built application can also be deployed to any static hosting service.

## Usage

### Step 1: Create a Session (Backend)

Use your backend to create a Klarna Playground session via the API. From the response, you'll need:
- **Client Token** (the `client_token` field)

**Note:** The `session_id` from the response is used for backend operations only - it's NOT needed for the frontend SDK integration. The `client_token` already contains the session reference.

### Step 2: Open the Application

Navigate to the running application in your browser.

### Step 3: Enter Session Details

In the **Session Configuration** section, enter:

1. **Client Token** - From your session creation response
2. **Payment Method Category** - Select from dropdown:
   - Pay Later
   - Pay Now
   - Pay Over Time

**Security Notes:**
- Client token is stored only in memory by default
- Use the "Temporarily remember in session" toggle to persist it across page reloads (stored in sessionStorage only)
- Click "Clear Credentials" to remove all stored data

### Step 4: Initialize and Load Widget

Click **"Start Authorization Flow"** to:

1. Initialize the Klarna Web SDK with your client token
2. Load the Klarna payment widget
3. The widget will render on the page

### Step 5: Complete Payment Details

Fill out the Klarna payment widget with the required payment information. The widget is interactive and provided directly by Klarna.

### Step 6: Authorize Payment

Once you've completed the payment details in the widget, click **"Authorize Payment"** to get your authorization token.

### Step 7: Retrieve Token

Upon successful authorization, the **Authorization Token** will be displayed in the result section. You can:

- Copy the token to clipboard using the "Copy to Clipboard" button
- Use the token in your backend API testing (valid for 60 minutes)
- Click "Reset" to clear the result and start a new test

## Flow States

The application displays the current flow state:

- **Idle**: Ready to start
- **Initializing SDK**: Loading and initializing Klarna SDK
- **SDK Ready**: SDK successfully initialized
- **Authorizing**: Authorization flow in progress
- **Authorized**: Authorization successful
- **Failed**: Authorization failed (error details will be displayed)
- **Cancelled**: Authorization cancelled by user

## Error Handling

If errors occur, they will be displayed in the **Flow Status** section with:

- A clear error summary message
- Expandable error details (click "▶ Error Details" to view)
- Actionable suggestions when available

## Security Considerations

### Credential Handling

- ✅ No credentials persisted by default
- ✅ sessionStorage used only when explicitly enabled
- ✅ localStorage defensively cleared on startup
- ✅ No external analytics or tracking
- ✅ No console logging of sensitive data
- ✅ Client token transmitted only to Klarna SDK
- ✅ No API credentials (username/password) required - frontend-only tool

### Token Handling

- ✅ Authorization tokens stored only in memory
- ✅ No automatic persistence
- ✅ Clear security warnings displayed
- ✅ Manual copy to clipboard required

## Project Structure

```
kp-generate-auth-token/
├── index.html              # Entry HTML file
├── package.json            # Project dependencies
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.jsx           # React entry point
│   ├── App.jsx            # Main application component
│   ├── components/        # React components
│   │   ├── EnvironmentBanner.jsx
│   │   ├── CredentialsSection.jsx
│   │   ├── SessionSection.jsx
│   │   ├── FlowStatus.jsx
│   │   └── AuthorizationResult.jsx
│   ├── hooks/             # Custom React hooks
│   │   └── useKlarnaSDK.js
│   └── styles/            # CSS styles
│       └── App.css
└── README.md              # This file
```

## Technology Stack

- **React 18**: Component-based UI
- **Vite**: Fast build tooling and development server
- **Klarna Web SDK**: Playground environment SDK

## Klarna SDK Integration

### ⚠️ Important: SDK Integration TODO

This application includes a placeholder implementation for Klarna SDK integration.

**✅ SDK URL Configured**: The Klarna Playground SDK (`https://x.klarnacdn.net/kp/lib/v1/api.js`) is now loaded in `index.html`.

To complete the integration, you need to:

1. **Update the SDK integration** in `src/hooks/useKlarnaSDK.js`:
   - Determine the correct SDK initialization method
   - Implement the authorization flow trigger
   - Handle SDK callbacks and responses
   - Update error handling for SDK-specific errors

2. **Verify the SDK response format**:
   - Confirm whether the SDK returns an authorization token directly
   - Or if it returns an authorization code requiring backend exchange

### Finding SDK Documentation

Refer to:
- Klarna Playground Documentation
- Klarna Web SDK Documentation
- Klarna Developer Portal

### Current Implementation

The current implementation includes:
- ✅ Full UI/UX as per specification
- ✅ State management and flow control
- ✅ Error handling infrastructure
- ✅ Security measures
- ✅ Klarna SDK loaded from CDN
- 🔄 Mock SDK integration (for UI testing)
- ❌ Actual Klarna SDK calls (needs implementation)

The mock implementation allows you to test the UI and flow without the actual SDK. When the SDK is properly integrated, replace the mock `setTimeout` calls in `useKlarnaSDK.js` with actual SDK method calls.

## Development Notes

### Testing Without SDK

The current implementation includes mock responses that simulate the SDK flow. This allows you to:

- Test the UI and user experience
- Validate the flow states and error handling
- Ensure credential handling works correctly
- Verify token display and copy functionality

### Integrating the Real SDK

The SDK script is now loaded. To complete the integration:

1. ✅ ~~Add the SDK script tag to `index.html`~~ (Complete)
2. Update `src/hooks/useKlarnaSDK.js` with actual SDK calls
3. Remove the mock `setTimeout` calls
4. Test with real Playground credentials and sessions

**Next Step**: Inspect the `window.Klarna` object in the browser console to discover available methods, or refer to Klarna's official documentation for the SDK API.

## Troubleshooting

### SDK Not Loading

- Verify the SDK URL is correct in `index.html`
- Check browser console for script loading errors
- Ensure you're using the Playground SDK URL (not production)

### Authorization Fails

- Verify the client token is correct and matches your session
- Ensure the Session Client ID is valid and not expired
- Check that the session was created for the Playground environment
- Confirm the client token and session ID are from the same session creation
- Review error details in the expandable error section

### Button Disabled

The "Start Authorization Flow" button is disabled when:
- Client Token is empty
- Session Client ID is empty
- SDK initialization is in progress
- Authorization flow is already in progress

## Contributing

This is an internal testing tool. If you encounter issues or have suggestions:

1. Document the issue clearly
2. Include steps to reproduce
3. Share error messages and screenshots
4. Suggest improvements

## License

Internal use only - Not for public distribution.

## Support

For questions about:
- **This tool**: Contact your development team
- **Klarna API**: Refer to Klarna documentation or contact Klarna support
- **Playground access**: Contact your Klarna account representative

---

**Remember**: This tool is for Playground testing only. Never use production credentials or attempt to connect to production endpoints.
