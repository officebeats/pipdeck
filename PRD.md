# Product Requirements Document (PRD): PipDeck (Oh My Pi Hardware Companion)

## 1. Executive Summary & Multi-Platform Mandate (In Perpetuity)

**PipDeck** is an open-source hardware desktop companion display engineered to monitor the **Oh My Pi (OMP)** coding harness.

### Multi-Platform Mandate (In Perpetuity)
AI agents and contributors MUST in perpetuity maintain, support, and test both target hardware tiers across all telemetry protocols, UI layouts, and animation engines:
1. **Primary Platform (Tier 1) — Amazon Kindle E-Ink Devices Running KOReader & ZenOS**:
   - Compatible with older 600×800 e-ink devices (Kindle Keyboard K3, Touch, K4, K5, Basic 7/8/10 — most common) and modern 300 PPI readers (Paperwhite 3/4/5, Oasis, Scribe).
   - Native Lua plugin `koreader/plugins/pipdeck.koplugin/` supporting both standard KOReader Main Menu and **ZenOS** (`zen_ui.koplugin` / ZenPM) App Launcher tiles.
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

## 3. Mascot Size Invariance, Full-Bleed Squeeze & Top-Right Combo HUD

PipDeck enforces a **strict size invariance rule for the central Pip mascot** ($48 \times 48\text{px}$ bounding box centered at $(80, 100)$) across all swarm counts (1 to 32 nodes) and all lifecycle states (`IDLE`, `THINKING`, `BASH`, `SWARM`, `ALERT`, `VICTORY`).

All animations expand vertically from $y=12$ to $y=190$ to **eliminate dead padding at top and bottom**, and feature a **standardized top-right combo HUD badge**:

```
+───────────────────────────────────────────────────────────+
| [+] Reticle                        [ 32x CROWD ]  Reticle [+]| <-- Top-Right Combo HUD
|      ■               ■               ■                       |
|   ■                                      ■                   |
| ■              [ LARGE PIP 48px ]            ■               |
|   ■                                      ■                   |
|      ■               ■               ■                       |
| ═══════════════[ Ground Levitation Floor ]═════════════════| <-- Squeezed to Bottom
+───────────────────────────────────────────────────────────+
```

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
1. **Step 1: Network Check**: Verifies Kindle Wi-Fi is active and on the same subnet as the OMP workstation.
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
| [1. DASHBOARD]            [2. SETUP GUIDE]          [3. TODO & LOGS]   | <-- Touch Tabs
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
