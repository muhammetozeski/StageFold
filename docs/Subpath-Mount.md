# Main-origin mount

Target application base: `/stagefold/`. The existing standalone deployment defaults to `/` and keeps its own source repository and existing D1 database.

## Frontend artifact

From this repository, call:

```powershell
./scripts/Publish-App.ps1 -BasePath '/stagefold/' -Destination '<BinSite absolute path>/public/stagefold/'
```

`-Output` optionally selects the intermediate .NET publish directory; `-NoRestore` uses restored packages. A non-root mount requires an explicit destination so a mounted build cannot replace the standalone `public` entry accidentally. The output contains a real Blazor application with `<base href="/stagefold/">`, relative navigation/API/module URLs and its own `_framework` directory. `build-info.json` includes the application base.

Merge the artifact's `_headers` and `_redirects` into BinSite's root files; nested copies have no routing effect. Redirects contain only the exact SPA routes and `project/:id` / `cut/:id` patterns. There is no catchall redirect for assets or `_framework`. The header rule `/stagefold/*` scopes StageFold's CSP to this application. Include `/stagefold/api/*` in the main Pages function invocation routes. The bare `/stagefold` redirects to `/stagefold/`.

## Backend runtime copy

Copy these paths unchanged relative to `integrations/mounted/stagefold/`:

- `functions/api/[[path]].js`
- `server/accounts.mjs`
- `server/billing.mjs`
- `server/cuts.mjs`
- `server/film.mjs`
- `server/moderation.mjs`
- `server/projects.mjs`
- `server/security.mjs`
- `server/paths.mjs`

The exported entry is `onRequest({request,env})`. Preserve the original main-host Request URL and Origin; do not strip the prefix or rewrite Origin. Set `APP_BASE_PATH='/stagefold/'`. The handler verifies and removes that prefix itself before dispatching.

Recommended main binding and mapping:

```javascript
import {onRequest as stageFold} from '../../../integrations/mounted/stagefold/functions/api/[[path]].js';
export const onRequest = ({request,env}) => stageFold({request,env:{
  APP_BASE_PATH:'/stagefold/',
  DB:env.STAGEFOLD_DB,
  RATE_SALT:env.STAGEFOLD_RATE_SALT,
  MODERATION_KEY:env.STAGEFOLD_MODERATION_KEY,
  STRIPE_SECRET_KEY:env.STAGEFOLD_STRIPE_SECRET_KEY,
  STRIPE_PRICE_ID:env.STAGEFOLD_STRIPE_PRICE_ID,
  STRIPE_WEBHOOK_SECRET:env.STAGEFOLD_STRIPE_WEBHOOK_SECRET
}});
```

Place this wrapper at BinSite `functions/stagefold/api/[[path]].js`. There is no fallback to another product's payment configuration. `RATE_SALT` is required for request-limit identities; it does not pepper account/session/recovery hashes. The main host may supply an explicit StageFold salt or a stable mount-specific HMAC derived from its rate-limit secret. `MODERATION_KEY` and the three provider values are optional and remain disabled when absent. No secret value belongs in source.

Existing D1 database: name `stagefold`, ID `18a3be59-9bf6-4c13-bc47-8a045fc2c71f`; standalone binding `DB`, proposed main binding `STAGEFOLD_DB`. Preserve its records and schema. No new database or migration is needed for this mount.

## Sessions, links and billing

The cookie remains `sf_session`, with `HttpOnly; Secure; SameSite=Strict`; its mounted Path is `/stagefold/api`, including logout/deletion expiry. Host-only cookies from the old origin cannot transfer automatically. The same recovery key restores the same account against the preserved database. Existing published cut IDs, project IDs and license provenance remain.

Browser API calls resolve below the application base. Film credits use `Navigation.BaseUri`, so mounted exports and new links name the main host and `/stagefold/`. Payment success/cancel/portal returns use the current request's origin and configured base. The standalone `/api/billing/webhook` remains available in its original deployment; no provider endpoint or key was changed during preparation.

## Preparation evidence

The actual mounted publish completed locally, with the expected base tag, scoped headers, explicit SPA fallbacks and separate app/renderer/framework files. A combined 21-assertion in-memory SQLite request check covered this product and Interlock: mounted account/session/project or room access, scoped set/clear cookies, recovery, wrong-prefix refusal and original-Origin enforcement. This is source/build/request evidence; the new main-origin mount has not yet been deployed or exercised in a native browser by this preparation task.
