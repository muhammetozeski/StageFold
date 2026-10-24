# Persistent production API

Prefix `/api/`. Reads use GET. Writes use POST with same-origin `Origin` and `application/json`, except the raw signed Stripe webhook. Errors are `{error,code}` with an actual HTTP refusal. Secrets do not appear in URLs. JSON writes have a bounded streaming reader. Action limits use salted identities and parameterized SQL. Every account write is authenticated by the secure HttpOnly SameSite cookie.

## Accounts

- `GET account` → `{account:null|{id,alias,createdAt,premium}}`.
- `POST accounts {alias}` → 201 `{account,recoveryKey}` and session cookie. Alias 1–40 characters; it is not a verified identity.
- `POST sessions {recoveryKey}` recovers the actual account and creates a session. `POST sessions/logout {}` invalidates that session.
- `POST account/delete {confirmation:'DELETE MY ACCOUNT'}` deletes owned private work, removes sessions and memberships, and withdraws/anonymizes own cuts. An active paid period blocks deletion.
- `POST invites/join {token}` consumes one unexpired/unrevoked private invite while atomically enforcing member allowance and inviter authority. It returns `{projectId,role}`. Existing membership is not silently replaced.

## Shared films

- `GET projects` lists this account's memberships and `{account:{projectLimit,usedProjects}}`. Free allowance: three owned projects, four members per project including owner. Verified live Studio allowance: thirty/twelve. A collaborator's project does not use the invitee's owned allowance.
- `POST projects {requestId,film}` creates a real project and immutable revision one. Request identity is a UUID; same identity/content recovers the existing project, changed content returns409.
- `GET projects/:id` returns `{project:{id,title,film,revision,role,parentCut,parent,createdAt,updatedAt}}` to an authorized member.
- `POST projects/:id {revision,requestId,film}` saves only if that exact revision and current owner/editor role still hold. It returns `{project,savedRevision}`. Stale revision409; viewer403; absent access404. After uncertain success, repeating the same write identity recovers its saved revision. Keep local JSON before explicitly reloading conflicting work.
- `GET projects/:id/history` lists up to100 immutable revision labels. `GET projects/:id/history/:revision` returns one film to owner/editor only. A historical copy is restored by an explicit new save, preserving the old revision.
- `GET projects/:id/members` lists actual member aliases/roles. Owner `POST projects/:id/members/:accountId {role:'editor'|'viewer'|'remove'}` cannot remove/reassign the owner.
- Owner `POST projects/:id/invites {role:'editor'|'viewer'}` → `{token,expiresAt}` for seven days. `GET projects/:id/invites` returns hashes/status only; owner `POST projects/:id/invites/:hash/revoke {}` revokes a pending invitation.
- Owner `POST projects/:id/delete {confirmation:'DELETE SHARED PROJECT'}` cascades private versions/members/invites. Published cuts are separate snapshots and need explicit withdrawal.

## Public cuts

- `GET cuts?search=&offset=0` returns twenty public summaries and `hasMore`. `mine=true` requires an account and includes its withdrawn/hidden records. There are no synthetic audience/reaction records.
- Owner `POST cuts {projectId,revision,requestId,allowRemix:true,rightsConfirmed:true}` publishes the exact saved revision under CC BY4.0. It returns `{cut}`. A public cut is immutable; later shared edits do not change it. Publication is limited to five per account per day.
- `GET cuts/:id` returns the film, hash, publisher, changes and pinned source attribution. Withdrawn/hidden cuts return404 publicly; their owner can inspect them. Private project IDs and memberships are not projected.
- `POST cuts/:id/fork {requestId}` creates the requesting account's private project from that exact cut and source pin. Same successful request recovers even if the source is later withdrawn. New forks require a visible source. A fork cannot republish unchanged/title-only scene content.
- Publisher `POST cuts/:id/withdraw {}` stops new public reads/forks. It does not revoke an existing licensed copy.
- `POST cuts/:id/report {reason:'spam'|'unsafe'|'rights'|'privacy',note}` sends a private operator report. Notes max1000 characters; reports are bounded and upserted per reporter/cut. A report does not manufacture an automatic hide.

## Moderation and payment

`GET moderation` and `POST moderation/cuts/:id {hidden,resolveReports}` require the separate private operator capability in Authorization. No normal account is an operator. `scripts/Moderate.ps1` reads the current-user-encrypted local key or an explicitly supplied private environment value.

`GET billing` reports actual configuration and live entitlement. `POST billing/checkout {requestId}` requires all three merchant values, validates the fixed USD9 monthly price, reuses one pending idempotent checkout and refuses a new checkout for active live members. `POST billing/portal {}` returns provider management for a linked subscription. `POST billing/webhook` verifies the raw body signature/timestamp and retrieves the canonical subscription from Stripe's fixed API origin. The exact app/account/price/liveness must match before a live allowance exists. Redirects and test events alone grant nothing.
