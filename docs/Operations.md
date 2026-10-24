# Hosting and owner operations

Permanent source: `C:\E\Claude\WebSiteleri\StageFold`. Public repository: https://github.com/muhammetozeski/StageFold. Actual service: https://muhammetozeski-stagefold.pages.dev. Pages project `muhammetozeski-stagefold`; D1 `stagefold` (`18a3be59-9bf6-4c13-bc47-8a045fc2c71f`). The database binding is `DB` in production and preview.

The service stores scene JSON, not uploaded media. Free hosting was chosen for bounded snapshots and SQL transactions, without paid object storage or a managed media encoder. No paid hosting, domain purchase or outreach was performed. Resource use and demand are not projected as proven commercial outcomes.

## Publish and recover

GitHub main runs `.github/workflows/deploy.yml` with repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The job checks the domain, renderer/export, actual SQLite request admission, billing fixtures and actual compiled Razor state boundaries, then publishes Blazor and the Pages Functions. `scripts/Publish-App.ps1` resolves paths from its own location. Building needs .NET10; the published browser client does not need a desktop .NET install.

Apply SQL deliberately before a service version that requires it. `schema/001-stagefold.sql` initialized seventeen successful statements on production. Do not recreate or drop a database to apply an application change. Keep an owner-controlled database backup before an actual schema migration; no unrelated backup job is silently introduced here.

Deployment snapshots also retain API code and the same database binding. Updating only the main alias can leave an old authority implementation reachable. After verifying the new deployment's source/build and health, `scripts/Retire-Superseded.mjs` pages the provider's list with the accepted page size25 and retires superseded API URLs. It preserves Git history and all D1 data. An initial page size100 was rejected by the provider after the first successful deployment; using25 with pagination completed the next publication. Do not treat a failed post-deployment step as proof that the application itself was not published.

To recover source, use Git history, build the chosen compatible version and publish it as a new deployment. Do not expose a retired old API against the current database merely to roll back a UI asset. `public/build-info.json` pins the actual source commit and a UTC timestamp.

## Reports and operator access

The owner key is separate from customer accounts. Initial setup generated it, stored it as a Cloudflare secret and retained only current-Windows-user-encrypted DPAPI ciphertext at `.private/operator-key.dpapi`, excluded from Git and release archives. `scripts/Moderate.ps1 -Action Reports` reads the queue. For an explicit reviewed cut, use `-Action Hide -CutId <actual-id>` or `Show`. It sends the key in Authorization, never a URL or log. This script is owner-operated, not an automatic application task. A fresh computer/Windows user should rotate the hosting key with an owner credential; DPAPI ciphertext is not a cross-user portable password.

Account deletion, project deletion and cut withdrawal have different effects; see the service contract. QA accounts/cuts are labelled as fixtures, never presented as customer evidence. Withdrawn cut rows remain provenance until an explicit owner removal of identified disposable fixtures; a hidden row is not described as erased.

## Billing readiness

The deployed merchant key, fixed price and webhook secret are absent. Actual `GET /api/billing` therefore reports `configured:false`, `mode:'unconfigured'`, `premium:false`. Free operations are usable. No real Stripe customer, charge or subscription was created. USD9/month is an initial commercial hypothesis for thirty owned projects/twelve members, not demonstrated demand.

Owner `scripts/Configure-Billing.ps1` uses private process environment values, creates/reuses the fixed price and endpoint, and submits all three production readiness values together. Run it only when intentionally enabling or changing the merchant configuration. An existing webhook secret must be supplied privately; existing provider secrets are not retrievable. The script never creates a customer subscription or charge, and it was parsed but not executed without merchant credentials.

The adapter uses provider idempotency for one pending checkout per account, raw-body signature verification, a five-minute timestamp window, event identity/hash deduplication, canonical subscription retrieval and exact app/account/price/liveness checks. Sixty-one actual SQLite/request assertions include controlled provider responses for these paths; those fixtures are not a real payment. Source behavior and real provider transaction evidence are kept distinct.
