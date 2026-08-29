# Product Requirements Document (PRD): PipDeck (Oh My Pi Hardware Companion)

## 1. Executive Summary & Multi-Platform Mandate (In Perpetuity)

**PipDeck** is an open-source hardware desktop companion display engineered to monitor the **Oh My Pi (OMP)** coding harness.

### Multi-Platform Mandate (In Perpetuity)
AI agents and contributors MUST in perpetuity maintain, support, and test both target hardware tiers across all telemetry protocols, UI layouts, and animation engines:
1. **Primary Platform (Tier 1) — Amazon Kindle E-Ink Devices Running KOReader & ZenOS**:
   - Jailbroken Kindle Paperwhite, Oasis, Basic, and Scribe e-ink readers.
   - Native Lua plugin `koreader/plugins/pipdeck.koplugin/` supporting both standard KOReader Main Menu and **ZenOS** (`zen_ui.koplugin` / ZenPM) App Launcher tiles.
   - **Zero-Config Local Wi-Fi Pairing**: mDNS auto-discovery on `omp.local:8787` (`_pipdeck._tcp.local`) with manual IP fallback.
   - **Persistent 4-Step In-App Connection Tutorial**: Accessible anytime via `[?] Guide` to onboard non-technical users directly on the Kindle.
   - **Display Engine**: Pure 1-bit high-contrast monochrome rendering, responsive auto-rotating Portrait and Landscape orientation layouts, and low-power e-ink stepped refresh rate / ghosting mitigation (1–2 FPS event-stepped waveforms with periodic full flash).
2. **Secondary Platform (Tier 2) — ESP32 Micro-Displays & Embedded Hardware**:
   - ESP32-2432S028R (CYD 2.8" & 3.5" color SPI LCDs, PlatformIO, LovyanGFX DMA framebuffer, FreeRTOS, 4–8 FPS retro LCD stepped timing).
   - **Unified High-Contrast Design**: Mirrors the clean, high-contrast, structured hierarchy of the E-Ink design on pure `#000000` OLED black with subtle, tasteful Matrix green structural accents.

---

## 2. Universal Low-Framerate Stepped Animation Invariant (LED/LCD Pace)

**Every animation across all SVGs, UI widgets, and graphic assets in PipDeck MUST strictly use discrete stepped keyframes (`steps(N)`)**:
- **Smooth `linear` and `ease-in-out` transitions are strictly prohibited.**
- **Mascot levitation & breathing**: `steps(2)` to `steps(4)`.
- **Orbital rotations (1 to 32 nodes)**: `steps(8)` to `steps(16)`.
- **Matrix code rain & confetti**: `steps(6)` to `steps(8)`.
- **Lightning strobe & eye blinks**: `steps(2)`.

---

## 3. Mascot Size Invariance & 5-Agent Incremental Swarm Scaling

PipDeck enforces a **strict size invariance rule for the central Pip mascot**: Pip's coordinate dimensions ($48 \times 48\text{px}$ bounding box centered at $(80, 100)$) remain **100% identical and persistently large** across all swarm counts (1 to 32 nodes) and all lifecycle states (`IDLE`, `THINKING`, `BASH`, `SWARM`, `ALERT`, `VICTORY`).

```
 1 Node (Solo)            10 Nodes (Dual Orbit)           32 Nodes (MAX Crowd)
+------------------+     +--------------------+          +--------------------+
|  [+]        [+]  |     |  [+]    ■    [+]   |          |  [+] ■  ■  ■  [+]  |
|                  |     |       ■   ■        |          |    ■ ■  ■  ■ ■     |
|     [ LARGE ]    | --> |    ■ [ LARGE ] ■   |   --->   |  ■ ■ [ LARGE ] ■ ■ |
|     [  PIP  ] ■  |     |       ■   ■        |          |    ■ ■  ■  ■ ■     |
|                  |     |         ■          |          |  ■   ■  ■  ■   ■   |
|  [+]        [+]  |     |  [+]          [+]  |          |  [+]          [+]  |
+------------------+     +--------------------+          +--------------------+
```

### 5-Agent Incremental Swarm Hierarchy

| Swarm Level | Mascot Size Invariant | Stepped Animation Timing | Visual Density Feeling |
| :--- | :--- | :--- | :--- |
| **1 Node** | Persistently Large ($48 \times 48\text{px}$) | `8s steps(8)` solo orbit | Minimalist, single-turn focus. |
| **5 Nodes** | Persistently Large ($48 \times 48\text{px}$) | `10s steps(10)` pentagon web | Clean geometric wave. |
| **10 Nodes** | Persistently Large ($48 \times 48\text{px}$) | Dual rings: `8s steps(8)` / `14s steps(12)` | Balanced dual-orbital flow. |
| **15 Nodes** | Persistently Large ($48 \times 48\text{px}$) | 3 rings: `8s steps(8)` / `12s steps(10)` / `18s steps(12)` | Active multi-agent web. |
| **20 Nodes** | Persistently Large ($48 \times 48\text{px}$) | 3 rings: `8s steps(8)` / `12s steps(10)` / `18s steps(14)` | Dense, humming swarm hive. |
| **25 Nodes** | Persistently Large ($48 \times 48\text{px}$) | 4 rings: `8s steps(8)` / `12s steps(10)` / `16s steps(12)` / `22s steps(14)` | Heavily crowded particle matrix. |
| **32 Nodes (MAX)**| Persistently Large ($48 \times 48\text{px}$) | 4 bounded rings: `8s steps(8)` to `28s steps(16)` + matrix rain | **Maximum Swarm Crowding** (controlled chaos). |

---

## 4. In-App Setup Tutorial & Diagnostic Wizard (Non-Technical Users)

A 4-step interactive connection guide is available inside the KOReader plugin and web simulator:
1. **Step 1: Network Check**: Verifies Kindle Wi-Fi is active and on the same subnet as the OMP workstation.
2. **Step 2: Start Harness**: Instructs running `$ omp` in terminal (spawns daemon on port 8787).
3. **Step 3: Auto-Discovery & Pairing**: Discovers `http://omp.local:8787` via mDNS or allows direct manual IP input with auto-save to `settings.reader.lua`.
4. **Step 4: Live Ping Diagnostic**: Executes instant HTTP test to `/api/status` confirming telemetry streaming.

---

## 5. Hardware Screen Layouts

### A. Primary Platform: Kindle KOReader & ZenOS E-Ink (Portrait & Landscape)
```
+------------------------------------------------------------------------+
| OMP ❯ 🏺 Anthropic claude-3-7-sonnet                          12:45:02 |
+------------------------------------------------------------------------+
|                  ┌─ Centered 4:5 Mascot Arena ─────┐                   |
|                  │    [ 8-Bit Pixel Pip Mascot ]   │                   |
|                  │       (100% In-Frame Swarm)     │                   |
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
| [1. DASHBOARD]            [2. SETUP GUIDE]          [3. TODO & LOGS]   | <-- Touch Tabs
+------------------------------------------------------------------------+
| OMP ❯ 🏺 Anthropic claude-3-7-sonnet      git:main*           12:45:02 | <-- White Separator
+------------------------------------------------------------------------+
| ┌─ Mascot Canvas ─────────┐ ┌─ E-Ink Mirrored Telemetry Column ──────┐ |
| │                         │ │ 🧵 #cleanse-workspace-diagnostics      │ |
| │   [ 8-Bit Pixel Pip ]   │ │ ● PARALLEL SWARM   📋 Phase 3: Fix     │ |
| │     (Pure Black)        │ │ >_ omp task[Scout, Coder, Rev, Sonic]  │ |
| │   Matrix Green Border   │ │                                        │ |
| │                         │ │ ACTIVE SUBAGENTS:                      │ |
| │                         │ │ [✨ Google] [🏺 Anthropic] [🌀 OpenAI]  │ |
| └─────────────────────────┘ └────────────────────────────────────────┘ |
+------------------------------------------------------------------------+
| CTX: 62%                   COST: $0.38                  TOKENS: 114.5k | <-- White Separator
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

---

## 7. Software Architecture & Plugin Scaffold

### A. Kindle KOReader & ZenOS Plugin (`koreader/plugins/pipdeck.koplugin/`) - Primary
- `_meta.lua`: Plugin registration with `is_app = true`, `category = "app"`, `icon = "pipdeck_icon"` for ZenOS launcher and standard KOReader menus.
- `main.lua`: mDNS network listener, 4-step tutorial modal, orientation-responsive drawing routines, partial/full e-ink refresh controller.

### B. OMP Host Companion Daemon (`firmware/host/pipdeck-server.ts`)
- Background HTTP server on port `8787` (`http://0.0.0.0:8787`).
- Broadcasts mDNS service `_pipdeck._tcp.local` and `_omp._tcp.local`.
- Exposes `/api/status` for JSON telemetry and `/` for Kindle HTML fallback.

### C. ESP32 Firmware (PlatformIO / LovyanGFX) - Secondary
- **Core 0**: Serial UART / WebSocket parser, state machine, LED/DAC controller.
- **Core 1**: LovyanGFX DMA framebuffer swap (60 FPS render pipeline).
