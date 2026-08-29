# PipDeck Repository Invariants & AI Agent Rules (In Perpetuity)

## 1. Strict PRD & README Synchronization Invariant
- **`PRD.md` and `README.md` MUST NEVER be out of sync** regarding code, architecture, feature definitions, platform requirements, and telemetry schemas.
- Whenever any feature, platform tier, animation timing, telemetry field, or hardware mapping is modified, added, or removed, the agent MUST update BOTH `PRD.md` and `README.md` in lockstep in the same turn. Zero drift permitted.

## 2. Multi-Platform Tier Mandate
- MUST ALWAYS maintain, support, and test all PipDeck target platforms across all designs, code, and documentation:
  1. **Primary Platform (Tier 1) — Amazon Kindle E-Ink Devices Running KOReader**:
     - Jailbroken Kindle Paperwhite, Oasis, Basic, and Scribe e-ink readers.
     - Native Lua plugin `koreader/plugins/pipdeck.koreader`, wireless mDNS local Wi-Fi discovery (`omp.local:8787`), pure 1-bit high-contrast monochrome rendering, responsive auto-rotating Portrait and Landscape orientation layouts, and low-power e-ink stepped refresh rate / ghosting mitigation (1–2 FPS event-stepped waveforms with periodic full flash).
  2. **Secondary Platform (Tier 2) — ESP32 Micro-Displays & Embedded Hardware**:
     - ESP32-2432S028R (CYD 2.8" & 3.5" color SPI LCDs, PlatformIO, LovyanGFX DMA framebuffer, FreeRTOS, 4–8 FPS retro LCD stepped timing).
- NEVER drop, forget, or omit either platform when designing features, telemetry protocols, animations, UI layouts, or setup workflows.

## 3. Universal Low-Framerate Stepped Animation Invariant (LED/LCD Pace)
- **ALL animations in PipDeck MUST strictly use discrete stepped keyframes (`steps(N)`)**.
- **NEVER use smooth `linear` or `ease-in-out` transitions** anywhere in any SVG, graphic asset, or UI element.
- Pacing rules:
  - Mascot levitation & breathing: `steps(2)` to `steps(4)`.
  - Orbital rotations: `steps(8)` to `steps(16)`.
  - Rain & confetti drops: `steps(6)` to `steps(8)`.
  - Lightning strobe & eye blinks: `steps(2)`.
  - Ensures uniform, choppy retro 4–8 FPS embedded LED/LCD motion on ESP32 and ghosting-free 1–2 FPS rendering on Kindle KOReader e-ink.

## 4. Mandatory Model & Provider Formatting
- Every model reference in prose, documentation, tables, and UI MUST strictly follow the standard format:
  `[Provider Icon] [Provider Name] [Model Name]`
  (e.g., `🏺 Anthropic claude-3-7-sonnet`, `✨ Google gemini-3.7-flash`, `🌀 OpenAI gpt-5.2-reasoning`, `🦙 Local/Ollama qwen2.5-coder-7b`).

## 5. Hyperlink Delivery Rule
- Always format all referenced file paths, created/edited files, generated artifacts, images, documents, and web links as clickable Markdown hyperlinks (`[label](file:///absolute/path/to/file)` or `[label](https://...)`).
