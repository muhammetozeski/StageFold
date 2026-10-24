# Scene and collaboration boundaries

The planned implementation has a .NET 10 Blazor WebAssembly editor and typed document rules, an original Canvas renderer/exporter, and a Cloudflare Pages Functions/D1 service. The renderer receives only a validated finite scene vocabulary: no uploaded images, external URLs, arbitrary SVG or JavaScript. A film contains a cast and ordered shots; each shot has a duration, stage, actor performance and timed caption beats.

Local documents do not require an account. Browser storage is a convenience, and explicit JSON export owns the portable copy. The HTML export embeds the film and the first-party renderer, with script-closing characters encoded. WebM is a real-time browser recording and must stop visibly on interruption.

Private projects have owner/editor/viewer roles, expected-revision saves and durable versions. Invites are one-use capabilities, stored as hashes. Public cuts are immutable snapshots with a pinned parent cut and explicit reuse permission; private project history is never projected to public records. Reports and withdrawal affect public serving, not another author's already exported or lawfully forked copy. Public content contains no private project identifiers or membership lists.

This document describes the implementation boundary. Verification results and exact service contracts are recorded after the code is exercised.
