# OAuth Credential Setup Guide

This guide explains how to set up Google and GitHub OAuth credentials for the AI Job Application Assistant Platform.

## Google OAuth Setup

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  Navigate to **APIs & Services** > **Credentials**.
4.  Click **Create Credentials** and select **OAuth 2.0 Client ID**.
5.  If prompted, configure the OAuth consent screen. Set the User Type to **External**.
6.  Select **Web application** as the application type.
7.  Add the following under **Authorized redirect URIs**:
    *   `https://<CONVEX_SITE_URL>/api/auth/callback/google`
8.  Click **Create**.
9.  Copy the **Client ID** and **Client Secret**. These will be used for `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.

## GitHub OAuth Setup

1.  Go to your GitHub [Developer Settings](https://github.com/settings/developers).
2.  Select **OAuth Apps** and click **New OAuth App**.
3.  Set the **Homepage URL** to your frontend URL (e.g., `http://localhost:5173` for local development).
4.  Set the **Authorization callback URL** to:
    *   `https://<CONVEX_SITE_URL>/api/auth/callback/github`
5.  Click **Register application**.
6.  Copy the **Client ID**.
7.  Click **Generate a new client secret** and copy it. These will be used for `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`.

## Environment Variables

All OAuth environment variables must be configured in the **Convex Dashboard**, not in `.env.local`.

1.  Go to your project on the [Convex Dashboard](https://dashboard.convex.dev/).
2.  Navigate to **Settings** > **Environment Variables**.
3.  Add the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | `your-google-client-id` |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | `your-google-client-secret` |
| `AUTH_GITHUB_ID` | GitHub OAuth Client ID | `your-github-client-id` |
| `AUTH_GITHUB_SECRET` | GitHub OAuth Client Secret | `your-github-client-secret` |
| `SITE_URL` | The URL of your frontend application | `http://localhost:5173` |

> [!IMPORTANT]
> `SITE_URL` is separate from `CONVEX_SITE_URL`. `SITE_URL` refers to your React/Vite frontend, while `CONVEX_SITE_URL` is the URL of your Convex deployment.

## Testing & Troubleshooting

### How to Verify
1.  Start the application and navigate to the login page.
2.  Click the **Google** or **GitHub** sign-in button.
3.  You should be redirected to the provider's authorization page.
4.  After authorizing, you should be redirected back to the application and land on the `/dashboard`.

### Common Errors
*   **Redirect URI Mismatch**: Ensure the callback URL in your provider settings exactly matches `https://<CONVEX_SITE_URL>/api/auth/callback/<provider>`. Replace `<CONVEX_SITE_URL>` with your actual Convex deployment URL (found in the Convex Dashboard).
*   **Missing Environment Variables**: Double-check that all 5 variables are correctly set in the Convex Dashboard and that you have redeployed if necessary.