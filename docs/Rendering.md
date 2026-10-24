# Continuous scenes and portable outputs

The same closed-over `createRenderer` function powers the studio and offline films. It draws a fixed 960×540 stage with original vector geometry, six cast shapes, eight backdrops, eight articulated gestures and five expressions. Actor positions interpolate inside the shot with smoothstep movement. Walking and gesture joints move with elapsed time; captions are selected by exact local intervals. This is not a sequence of unchanged panel screenshots.

Studio interaction uses normalized foot positions. A yellow start/end marker and path can be dragged, and keyboard-accessible numeric direction controls provide an alternative. Apply validates before saving the browser draft or updating the rendered scene. Playback follows global film time into the correct shot so edits remain associated with that shot. A saved local JSON file is the portable scene copy; browser storage can be unavailable or cleared.

Offline HTML embeds the validated film JSON and the same renderer. `<`, `>`, `&` and JavaScript line separators are encoded in embedded JSON; titles/credits use HTML escaping. Caption text only reaches Canvas text drawing. The player contains no network dependency or account credential. Public-cut exports add the publisher and pinned source credit; scene JSON alone does not carry a service relationship, so users must retain attribution when using it elsewhere. The renderer is CC0 to allow embedding without a runtime license fetch.

WebM is capability-gated by canvas capture and a supported MediaRecorder codec, preferring VP9 then VP8. It records in real time, has no audio and refuses a hidden starting tab. Hiding or disposing the stage cancels the recording without downloading partial output. It uses a film snapshot; editing controls are disabled while recording. A browser with no supported codec still has offline HTML/JSON/PNG exports.

## Verified boundary

Twenty-three C# assertions exercise the complete original films, canonical round-trip, invalid timing/references/movement and actual scene comparisons. Ten Node consumer assertions check motion, caption drawing and the actual embedded offline script; that consumer alone is not native rendering evidence.

An isolated installed Edge headless profile then used production `stage.js`: native Canvas pixels changed within one shot, MediaRecorder produced a 252,768-byte VP9 WebM with the EBML container, the actual file decoded as 960×540 video, and the exported HTML loaded from `file://`, advanced its native playback time and changed pixels. The consumer and temporary browser profile stayed outside user browser data. `verification/browser.spec.mjs` reproduces this against an explicit NewTemp output folder; it downloads no browser. This proves the tested browser path, not every browser/codec combination.

The runtime contrast guard applies to actual DOM text, including dynamic Blazor content. Theme defaults to dark, with only the preference stored locally. Product markers are `data-sf-theme`, `data-sf-appearance="style"`, `data-sf-appearance="script"`; the public audit namespace is `StageFoldAppearance`. It does not import another product's layout.
