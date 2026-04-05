<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Recurly subscription tracker app (Expo / React Native 0.81.5 with Expo Router). Here is a summary of all changes made:

**New files created:**
- `app.config.js` — Converted from `app.json` to a dynamic JS config that passes `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` into `expo.extra`, making them accessible via `expo-constants` at runtime.
- `src/config/posthog.ts` — Initialises the PostHog client from `Constants.expoConfig.extra`, with batching, retry, and feature-flag settings. Safely disables itself if the token is not configured.
- `.env` — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` entries (values stored locally, never committed).

**Files edited:**
- `app/_layout.tsx` — Added `PostHogProvider` (wrapping the whole app inside `ClerkProvider`), imported `posthog` client, and added manual screen tracking via `usePathname` / `useGlobalSearchParams` with a `useEffect` that calls `posthog.screen()` on each route change.
- `app/(auth)/sign-in.tsx` — Added `usePostHog()`, `posthog.identify()` on successful sign-in, `posthog.capture("user_signed_in")` on success, and `posthog.capture("user_sign_in_failed")` on errors.
- `app/(auth)/sign-up.tsx` — Added `usePostHog()`, `posthog.identify()` on successful registration, `posthog.capture("user_signed_up")` on success, and `posthog.capture("user_sign_up_failed")` on errors.
- `app/(tabs)/settings.tsx` — Added `usePostHog()`, `posthog.capture("user_signed_out")` and `posthog.reset()` before Clerk sign-out.
- `app/(tabs)/index.tsx` — Added `usePostHog()`, `posthog.capture("subscription_expanded")` and `posthog.capture("subscription_collapsed")` when users tap subscription cards.

**Package installation required:**

Due to sandbox network restrictions, the packages could not be installed automatically. Run this command to complete the setup:

```bash
npx expo install posthog-react-native react-native-svg
```

## Event tracking table

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in with email/password via Clerk | `app/(auth)/sign-in.tsx` |
| `user_sign_in_failed` | User sign-in attempt fails (wrong credentials or error) | `app/(auth)/sign-in.tsx` |
| `user_signed_up` | User completes registration and email verification | `app/(auth)/sign-up.tsx` |
| `user_sign_up_failed` | User sign-up attempt fails | `app/(auth)/sign-up.tsx` |
| `user_signed_out` | User signs out from the settings screen | `app/(tabs)/settings.tsx` |
| `subscription_expanded` | User expands a subscription card to view details | `app/(tabs)/index.tsx` |
| `subscription_collapsed` | User collapses a previously expanded subscription card | `app/(tabs)/index.tsx` |

## Next steps

Due to a temporary PostHog MCP connectivity issue during this session, the "Analytics basics" dashboard could not be created automatically. Once connectivity is restored or you open PostHog directly, create a dashboard with these recommended insights:

1. **Sign-up → Sign-in conversion funnel** — FunnelsQuery with `user_signed_up` → `user_signed_in` to track returning users
2. **Daily active users (sign-ins trend)** — TrendsQuery on `user_signed_in` DAU over time
3. **Sign-up vs sign-in failure rate** — TrendsQuery comparing `user_sign_up_failed` and `user_sign_in_failed` totals
4. **Churn trend (sign-outs)** — TrendsQuery on `user_signed_out` over time to spot churn spikes
5. **Subscription engagement** — TrendsQuery on `subscription_expanded` to see which subscriptions users explore most

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
