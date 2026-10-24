# StageFold

[Live studio](https://muhammetozeski-stagefold.pages.dev) · [Public source](https://github.com/muhammetozeski/StageFold) · .NET 10 / Blazor / Canvas / D1

A small stage for short, captioned motion comics. Arrange a cast, direct entrances and gestures, time dialogue, play a continuous scene, and export a standalone film player. Shared projects and immutable public cuts connect collaborators without silently replacing another person's work.

Source is permanent in this repository. The interface and original starter films are English. No voice synthesis, artificial audience, or generated customer activity is claimed.

## Project guide

- [Documentation](docs/INDEX.md)
- [Product and first-job contract](docs/Product.md)
- [Architecture](docs/Architecture.md)
- [Experience records](Walkthrough/Guide.md)

## Make a film

Open the studio without an account. Choose one of twelve original 28-second films, rewrite a caption, drag a performer's start/end handle, choose a gesture and Apply. Playback interpolates movement inside each shot. Export JSON, a PNG frame, a self-contained HTML player or an actual WebM when the browser supports it. No voice or media upload is implied.

Create an account only for shared work. Save the one-time private recovery key. A project owner invites a real editor/viewer, editors save expected revisions, and the owner publishes an immutable licensed cut. Forking pins that exact cut; a changed descendant carries source attribution and a shot comparison. Title-only copies cannot be republished as remixes.

## Build and operate

The client requires a browser supporting WebAssembly. Building uses .NET 10 and the WebAssembly package versions in the project. `scripts/Publish-App.ps1` builds the static client into `public`; authored routing/security headers remain there. The API is `functions/api/[[path]].js`, implemented in `server`, with SQL in `schema`. It requires a D1 binding named `DB` and private `RATE_SALT`/`MODERATION_KEY` environment values.

The GitHub workflow verifies domain rules, the renderer/offline export, real SQLite request behavior and selected-project UI boundaries before publishing. It then verifies the new service/build and retires superseded API deployment URLs without deleting Git history or database content.

See [Operations](docs/Operations.md) for exact owner actions, [Service contract](docs/Service-Contract.md) for integrations, and [Rendering and exports](docs/Rendering.md) for output limits. Local settings use browser storage; logs contain operation/status/timing, not films or credentials. Filesystem templates are not forced into the browser. The explicit English-only product requirement replaces the general two-language template default.

Membership checkout is currently **unconfigured** and unavailable. The free local workflow and real shared allowance work. The signed Stripe adapter requires all three merchant readiness values and never grants paid capacity from a return URL or a test notification. No advertising/analytics is loaded.

Original bundled starter text/vector artwork and the portable renderer are CC0; other source is MIT. Community cuts use the explicit CC BY 4.0 publication grant. Public repository access is not a claim of customer demand or commercial success.
