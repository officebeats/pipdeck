# Product Requirements Document (PRD): PipDeck (Oh My Pi Hardware Companion)

## 1. Executive Summary & Multi-Platform Mandate (In Perpetuity)

**PipDeck** is an open-source hardware desktop companion display engineered to monitor the **Oh My Pi (OMP)** coding harness.
- **Current Version**: `v0.1.0-alpha` (Alpha Release for Kindle Paperwhite & KOReader devices)
- **Canonical Hosted URL (GitHub Pages)**: [https://officebeats.github.io/pipdeck](https://officebeats.github.io/pipdeck)
- **Visual Screenshot Gallery**: [https://officebeats.github.io/pipdeck/gallery.html](https://officebeats.github.io/pipdeck/gallery.html)
- **Short URL (Easy-Type)**: `officebeats.github.io/pipdeck`
- **GitHub Repository**: [https://github.com/officebeats/pipdeck](https://github.com/officebeats/pipdeck)
- **Alpha Release Package**: `dist/pipdeck-koreader-paperwhite-v0.1.0-alpha.zip`

### Multi-Platform Mandate (In Perpetuity)
AI agents and contributors MUST in perpetuity maintain, support, and test both target hardware tiers across all telemetry protocols, UI layouts, and animation engines:
1. **Primary Platform (Tier 1) — Amazon Kindle E-Ink Devices Running KOReader, ZenOS & KUAL**:
   - **Prerequisite**: Jailbroken Kindle with KOReader installed (Help search link: `https://letmegooglethat.com/?q=how+to+jailbreak+kindle+and+install+koreader`).
   - **Target Hardware (Alpha Focus)**: Older Kindle Paperwhite (PW1, PW2, PW3), Touch, Basic, Oasis, and Scribe.
   - **Triple-Store Integration**:
     - **KOReader Plugin**: `koreader/plugins/pipdeck.koplugin/` (standard menu).
     - **ZenOS (ZenUI)**: `package.json` / `manifest.json` for ZenPM in-app Wi-Fi installation.
     - **KUAL Launcher**: Native Kindle `/extensions/pipdeck/` with `menu.json` and shell action scripts.
   - **1-Click Web USB Drive Installer**: Available directly at `officebeats.github.io/pipdeck` using browser File System Access API.
   - **Light & Dark Mode Support**:
     - **☀️ Light Mode (Day / High-Contrast)**: Pure paper white (`#ffffff`) background with deep black borders, typography, and inverted black-filled active agent chips.
     - **🌙 Dark Mode (Night / OLED / Inverted)**: Pure black (`#000000`) background with pure white typography, reticles, and white-filled active agent chips.
   - **Default 12-Hour Time**: Clock displays standard 12h format with AM/PM (`12:45:02 PM`).
   - **Maximized Screen Real Estate**: Full-bleed edge-to-edge 4:5 mascot arena and zero letterbox padding.
   - **Zero-Config Local Wi-Fi Pairing**: mDNS auto-discovery on `omp.local:8787` (`_pipdeck._tcp.local`) with manual IP fallback.
   - **Persistent 4-Step In-App Connection Tutorial**: Accessible anytime via `[?] Guide` to onboard non-technical users directly on the Kindle.
   - **Display Engine**: Pure 1-bit high-contrast monochrome rendering, responsive auto-rotating Portrait and Landscape orientation layouts, and low-power e-ink stepped refresh rate / ghosting mitigation (1–2 FPS event-stepped waveforms with periodic full flash).
2. **Secondary Platform (Tier 2) — ESP32 Micro-Displays & Embedded Hardware**:
   - ESP32-2432S028R (CYD 2.8" & 3.5" color SPI LCDs, PlatformIO, LovyanGFX DMA framebuffer, FreeRTOS, 4–8 FPS retro LCD stepped timing).
   - **Official OMP Palette**: Block-matrix Pi logo with Hot Pink (`#ff4071`) $\to$ Purple (`#9333ea`) $\to$ Electric Cyan (`#00f0ff`) gradient and dithered halftone texture.
   - **Light & Dark Theme Engine**:
     - **🌙 Dark Matrix Mode**: Pure OLED `#000000` black with `#00ff41` matrix green borders and `#facc15` cyber-yellow commands.
     - **☀️ Light Terminal Mode**: Pure `#ffffff` white canvas with `#15803d` emerald structural borders and `#854d0e` dark commands.

---

## 2. Universal Low-Framerate Stepped Animation Invariant (LED/LCD Pace)

**Every animation across all SVGs, UI widgets, and graphic assets in PipDeck MUST strictly use discrete stepped keyframes (`steps(N)`)**:
- **Smooth `linear` and `ease-in-out` transitions are strictly prohibited.**
- **Mascot levitation & breathing**: `steps(2)` to `steps(4)`.
- **Orbital rotations (1 to 32 nodes)**: `steps(8)` to `steps(16)`.
- **Matrix code rain & confetti**: `steps(6)` to `steps(8)`.
- **Lightning strobe & eye blinks**: `steps(2)`.

---

## 3. Pure Floating Mascot & Reactive Orca Pet Bundle Architecture

PipDeck enforces a **pure floating, shadowless 25% scaled $\pi$ mascot** ($43 \times 50\text{px}$ bounding box centered at $(80, 100)$) across all swarm counts (1 to 32 nodes) and all lifecycle states (`IDLE`, `THINKING`, `BASH`, `SWARM`, `ALERT`, `VICTORY`).

### Micro-Compact Slender Desktop Companion Sizing
- **Micro-Compact Slender Profile**: The floating pet companion window and container geometry is slimmed down to an ultra-slender footprint ($52 \times 88\text{px}$ GTK/WebKit window, $42 \times 63\text{px}$ HTML container, and Hyprland `size 38 62` floating rule) with micro speech bubble and responsive stepped animations.
- **Zero Drop Shadows**: All overlapping ground shadow disks and floor meshes have been eliminated for a weightless floating aesthetic.
- **Interactive Orca & Codex Pet Bundle**: Includes native floating desktop companions (`bin/orca-pet`, `bin/codex-pet`) and a full 9-row $\times$ 8-column spritesheet bundle (`assets/orca-pet-bundle/`) that dynamically reflects live OMP agent turns:
  - **Row 0 (`idle`)**: Ambient floating levitation when agent is standby / idle (`assets/animations/pip-idle.svg`).
  - **Row 1 & 2 (`running-right` / `running-left`)**: Directional tilt and dash when dragged.
  - **Row 3 (`waving`)**: Crossbar waving greeting.
  - **Row 4 (`jumping`)**: Golden sparkle victory leap on mouse hover or task completion.
  - **Row 5 (`failed` / `alert`)**: Strobe alert and warning triangle on errors / user prompts (`assets/animations/pip-alert.svg`).
  - **Row 6 (`waiting` / `thinking`)**: Luminous thought ring orbital when agent is thinking or planning (`assets/animations/pip-thinking.svg`).
  - **Row 7 (`running` / `bash`)**: Cybernetic typing hands and matrix stream on active tool execution (`assets/animations/pip-hacking.svg`).
  - **Row 8 (`review` / `victory`)**: Floating trophy and celebration confetti on `agent_settled` (`assets/animations/pip-victory.svg`).

### Multi-Layer Real-Time OMP Activity Reactivity Engine
PipDeck features a 3-tier fault-tolerant activity detection pipeline guaranteeing zero drift and sub-second reactivity:
1. **Tier A (In-Process OMP Extension Hook)**: `firmware/host/pipdeck-server.ts` installs to `~/.omp/agent/extensions/pipdeck-server.ts`, intercepting `before_agent_start`, `agent_start`, `tool_execution_start`, `tool_call`, `tool_execution_end`, `agent_settled`, `agent_end` with atomic `/tmp/pip-live-status.json` write and non-blocking HTTP push.
2. **Tier B (Live JSONL Session Log Watcher)**: `src/orca-pet/server.ts` scans `~/.omp/agent/sessions/` every 150ms for newly appended tool calls (`bash`, `read`, `edit`, `write`, `grep`, `glob`, `task`, `eval`), thinking events, and user prompts.
3. **Tier C (E-Ink Daemon Polling & SSE Stream)**: Background poller checks port 8787 (`/api/status`) and streams instantaneous state changes over Server-Sent Events (`/api/pet/events` on port 8788 and `/api/codex/events` on port 8790).

### Interactive Mascot Actions & Chiptune Audio
- **Click (Petting)**: Spawns floating hearts (♥ with `steps(4)` keyframes), plays 8-bit square-wave purr SFX, and increments happiness.
- **Double-Click / 'F' (Feeding)**: Drops token crumb (`01` with `steps(4)` keyframes), plays chiptune bite SFX, and increments energy & tokens eaten.
- **Reactive Speech Bubble**: Automatically surfaces active tool command (`>_ bash: ...`, `>_ edit: ...`), model badge (`[Provider Icon] [Provider Name] [Model Name]`), and thinking status.
### 5-Agent Incremental Swarm Hierarchy

| Swarm Level | Combo HUD Tag | Mascot Invariant | Stepped Animation Timing | Visual Density Feeling |
| :--- | :--- | :--- | :--- | :--- |
| **1 Node** | `[ 1x SOLO ]` | Persistently Large ($48 \times 48\text{px}$) | `8s steps(8)` solo orbit | Minimalist, single-turn focus. |
| **5 Nodes** | `[ 5x SWARM ]` | Persistently Large ($48 \times 48\text{px}$) | `10s steps(10)` pentagon web | Clean geometric wave. |
| **10 Nodes** | `[ 10x DUAL ]` | Persistently Large ($48 \times 48\text{px}$) | Dual rings: `8s steps(8)` / `14s steps(12)` | Balanced dual-orbital flow. |
| **15 Nodes** | `[ 15x TRIPLE ]` | Persistently Large ($48 \times 48\text{px}$) | 3 rings: `8s steps(8)` / `12s steps(10)` / `18s steps(12)` | Active multi-agent web. |
| **20 Nodes** | `[ 20x HIVE ]` | Persistently Large ($48 \times 48\text{px}$) | 3 rings: `8s steps(8)` / `12s steps(10)` / `18s steps(14)` | Dense, humming swarm hive. |
| **25 Nodes** | `[ 25x MATRIX ]` | Persistently Large ($48 \times 48\text{px}$) | 4 rings: `8s steps(8)` to `22s steps(14)` | Heavily crowded particle matrix. |
| **32 Nodes (MAX)**| `[ 32x CROWD ]` | Persistently Large ($48 \times 48\text{px}$) | 4 bounded rings: `6s steps(8)` to `18s steps(16)` + matrix rain | **Maximum Swarm Crowding** (controlled chaos). |

---

## 4. In-App Setup Tutorial & Diagnostic Wizard (Non-Technical Users)

A 4-step interactive connection guide is available inside the KOReader plugin and web simulator:
1. **Step 1: Network Check & Jailbreak Prerequisite**: Verifies Kindle Wi-Fi is active, on the same subnet as the OMP workstation, and already jailbroken (with LMGTFY help link).
2. **Step 2: Start Harness**: Instructs running `$ omp` in terminal (spawns daemon on port 8787).
3. **Step 3: Auto-Discovery & Pairing**: Discovers `http://omp.local:8787` via mDNS or allows direct manual IP input with auto-save to `settings.reader.lua`.
4. **Step 4: Live Ping Diagnostic**: Executes instant HTTP test to `/api/status` confirming telemetry streaming.

---

## 5. Hardware Screen Layouts & Default 12-Hour Time

### A. Primary Platform: Kindle KOReader & ZenOS E-Ink (Portrait & Landscape)
```
+------------------------------------------------------------------------+
| OMP ❯ 🏺 Anthropic claude-3-7-sonnet                       12:45:02 PM | <-- 12-Hour Time Default
+------------------------------------------------------------------------+
|                  ┌─ Centered 4:5 Mascot Arena ─────┐                   |
|                  │    [ 8-Bit Pixel Pip Mascot ]   │                   |
|                  │       [ 32x CROWD ] Top-Right   │                   |
|                  │       (Full-Bleed Swarm)        │                   |
|                  └─────────────────────────────────┘                   |
| 🧵 #cleanse-workspace-diagnostics                                      |
+------------------------------------------------------------------------+
| ● PARALLEL SWARM                           📋 Phase 3: Parallel Fix    |
+------------------------------------------------------------------------+
| >_ omp task[Scout, Coder, Reviewer, Sonic]                             |
+------------------------------------------------------------------------+
| ACTIVE SUBAGENTS:                                                      |
| [✨ Google Scout]  [🏺 Anthropic Coder]  [🌀 OpenAI Review]  [🦙 Sonic] |
+------------------------------------------------------------------------+
| CTX: 62%              COST: $0.38              TOKENS: 114.5k          |
+------------------------------------------------------------------------+
```

### B. Secondary Platform: ESP32 Color LCD (E-Ink Mirrored with Subtle Matrix Green)
```
+------------------------------------------------------------------------+
| [1. DASHBOARD]            [2. SUBAGENTS]            [3. TODO & LOGS]   | <-- Touch Tabs
+------------------------------------------------------------------------+
| OMP ❯ 🏺 Anthropic claude-3-7-sonnet      git:main*        12:45:02 PM | <-- 12-Hour Time Default
+------------------------------------------------------------------------+
| ┌─ Mascot Canvas ─────────┐ ┌─ E-Ink Mirrored Telemetry Column ──────┐ |
| │   [ 8-Bit Pixel Pip ]   │ │ 🧵 #cleanse-workspace-diagnostics      │ |
| │   [ 32x CROWD ]         │ │ ● PARALLEL SWARM   📋 Phase 3: Fix     │ |
| │   (Full-Bleed Squeeze)  │ │ >_ omp task[Scout, Coder, Rev, Sonic]  │ |
| │   Matrix Green Border   │ │                                        │ |
| │                         │ │ ACTIVE SUBAGENTS:                      │ |
| │                         │ │ [✨ Google] [🏺 Anthropic] [🌀 OpenAI]  │ |
| └─────────────────────────┘ └────────────────────────────────────────┘ |
+------------------------------------------------------------------------+
| CTX: 62%                   COST: $0.38                  TOKENS: 114.5k |
+------------------------------------------------------------------------+
```

---

## 6. Standardized Provider Iconography

Every model reference strictly follows: `[Provider Icon] [Provider Name] [Model Name]`:

| Provider | Icon Badge | Flagship Models in OMP | Primary Agent Role |
| :--- | :--- | :--- | :--- |
| **Anthropic** | 🏺 / `[🏺 Anthropic]` | Claude 3.7 Sonnet, 3.5 Haiku, Opus | Lead orchestrator, complex coding (`default`) |
| **Google Gemini**| ✨ / `[✨ Google]` | Gemini 3.7 Flash, 2.0 Pro | Sub-second broad indexer & scout (`smol`) |
| **OpenAI** | 🌀 / `[🌀 OpenAI]` | GPT-5.2, o3-mini, o1 | Exhaustive AST verification & security (`slow`) |
| **Local / Ollama**| 🦙 / `[🦙 Local]` | Qwen 2.5 Coder 7B, DeepSeek, Llama 3.3 | Zero-cost bulk mechanical transforms (`sonic`) |
| **Groq / Cerebras**| ⚡ / 🧠 | Llama 3.3 70B (800+ tok/s) | Ultra-fast instant text completion |
| **xAI** | ✖️ / `[✖️ xAI]` | Grok 2, Grok 3 | Web synthesis & alternative reasoning |
| **Mistral** | 🌪️ / `[🌪️ Mistral]` | Codestral 2501, Mistral Large | Dedicated European coding & multilingual models |
