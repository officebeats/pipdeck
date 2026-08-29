# Product Requirements Document (PRD): PipDeck (Oh My Pi Hardware Companion)

## 1. Executive Summary & Multi-Platform Mandate (In Perpetuity)

**PipDeck** is an open-source hardware desktop companion display engineered to monitor the **Oh My Pi (OMP)** coding harness.

### Multi-Platform Mandate (In Perpetuity)
AI agents and contributors MUST in perpetuity maintain, support, and test both target hardware tiers across all telemetry protocols, UI layouts, and animation engines:
1. **Primary Platform (Tier 1) — Amazon Kindle E-Ink Devices Running KOReader**:
   - Jailbroken Kindle Paperwhite, Oasis, Basic, and Scribe e-ink readers.
   - Native Lua plugin `koreader/plugins/pipdeck.koreader`, wireless mDNS local Wi-Fi discovery (`omp.local:8787`), pure 1-bit high-contrast monochrome rendering, responsive auto-rotating Portrait and Landscape orientation layouts, and low-power e-ink stepped refresh rate / ghosting mitigation (1–2 FPS event-stepped waveforms with periodic full flash).
2. **Secondary Platform (Tier 2) — ESP32 Micro-Displays & Embedded Hardware**:
   - ESP32-2432S028R (CYD 2.8" & 3.5" color SPI LCDs, PlatformIO, LovyanGFX DMA framebuffer, FreeRTOS, 4–8 FPS retro LCD stepped timing).

---

## 2. Adaptive Frame Rate & E-Ink Stepped Waveform Engine

Because e-ink electrophoretic microcapsules have physical refresh latency (~250–450ms partial refresh), PipDeck's **stepped animation architecture** adapts dynamically based on display technology:

```
+-------------------------------------------------------------------------------+
|                        ADAPTIVE DISPLAY TIMING ENGINE                         |
+-------------------------------------------------------------------------------+
|  PRIMARY: KINDLE E-INK (KOREADER)       |  SECONDARY: ESP32 COLOR LCD (DMA)   |
|  • 1–2 FPS Ultra-Low-Pace Stepped       |  • 4–8 FPS Retro LCD Stepped Motion |
|  • Discrete State Ticks on Event        |  • Discrete steps(8)/steps(12)      |
|  • Periodic Full Flash Waveform Clear   |  • Constant 60 FPS Framebuffer Swap |
|  • Pure 1-Bit Monochrome High-Contrast  |  • High-Contrast Matrix Phosphor    |
+-------------------------------------------------------------------------------+
```

### E-Ink Refresh & Ghosting Mitigation
- **Partial Fast Refresh (1–2 FPS)**: Updates active tool strings, subagent pills, and rotating mascot nodes without flashing the whole screen.
- **Full Waveform Flash (Every 15 State Changes)**: Dispatches `Screen:refreshFull()` to clear residual particle ghosting and maintain contrast.
- **Battery Optimization**: Suspends network polling when OMP session is `IDLE`, preserving Kindle battery for weeks of desktop companion use.

---

## 3. Responsive Kindle E-Ink Display Layouts (KOReader)

### A. Portrait Orientation (600×800 / 1072×1448 / 1264×1680)
```
+------------------------------------------------------------------------+
| OMP ❯ 🏺 Anthropic claude-3-7-sonnet                          12:45:02 | <-- Status Header
+------------------------------------------------------------------------+
|                                                                        |
|                  ┌─ Centered 4:5 Mascot Arena ─────┐                   |
|                  │                                 │                   |
|                  │    [ 8-Bit Pixel Pip Mascot ]   │                   |
|                  │       (100% In-Frame Swarm)     │                   |
|                  │                                 │                   |
|                  └─────────────────────────────────┘                   |
|                                                                        |
| 🧵 #cleanse-workspace-diagnostics                                      | <-- Thread Name
+------------------------------------------------------------------------+
| ● PARALLEL SWARM                           📋 Phase 3: Parallel Fix    | <-- Status & Phase
+------------------------------------------------------------------------+
| >_ omp task[Scout, Coder, Reviewer, Sonic]                             | <-- Active Tool Box
+------------------------------------------------------------------------+
| ACTIVE SUBAGENTS:                                                      |
| [✨ Google Scout]  [🏺 Anthropic Coder]  [🌀 OpenAI Review]  [🦙 Sonic] |
+------------------------------------------------------------------------+
| CTX: 62%              COST: $0.38              TOKENS: 114.5k          | <-- Footer
+------------------------------------------------------------------------+
```

### B. Landscape Orientation (800×600 / 1448×1072 / 1680×1264)
```
+------------------------------------------------------------------------+
| OMP ❯ 🏺 Anthropic claude-3-7-sonnet      git:main*           12:45:02 |
+------------------------------------------------------------------------+
| ┌─ Left Mascot Arena ──────┐ ┌─ Right Telemetry Column ──────────────┐ |
| │                          │ │ 🧵 #cleanse-workspace-diagnostics     │ |
| │   [ 8-Bit Pixel Pip ]    │ │ ● PARALLEL SWARM   📋 Phase 3: Fix    │ |
| │     (Pure Monochrome)    │ │ >_ omp task[Scout, Coder, Rev, Sonic] │ |
| │     100% In-Frame Swarm  │ │                                       │ |
| │                          │ │ AGENTS:                               │ |
| │                          │ │ [✨ Google] [🏺 Anthropic] [🌀 OpenAI] │ |
| └──────────────────────────┘ └───────────────────────────────────────┘ |
+------------------------------------------------------------------------+
| CTX: 62%              COST: $0.38              TOKENS: 114.5k          |
+------------------------------------------------------------------------+
```

---

## 4. Wireless Zero-Config Discovery Protocol

1. **mDNS Auto-Discovery**:
   - The OMP daemon broadcasts service `_pipdeck._tcp.local` on port `8787`.
   - The Kindle KOReader plugin automatically resolves `omp.local:8787` on startup.
2. **Terminal QR Code Pairing**:
   - When running `omp`, typing `/companion` renders an ASCII QR code in the terminal.
   - Pointing the Kindle browser or scanning with KOReader pairs the device immediately.
3. **HTTP REST / SSE Fallback**:
   - Endpoint `/api/status` streams JSON updates with low network overhead.

---

## 5. Standardized Provider Iconography

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

## 6. Hardware Specifications (ESP32-2432S028R Secondary Tier)

| Subsystem | Peripheral | GPIO Pin | Bus / Protocol |
| :--- | :--- | :--- | :--- |
| **Display** | ILI9341 SPI MOSI | `GPIO 13` | High-speed HSPI (80 MHz DMA) |
| | ILI9341 SPI MISO | `GPIO 12` | HSPI |
| | ILI9341 SPI SCK | `GPIO 14` | HSPI |
| | ILI9341 SPI CS | `GPIO 15` | Chip Select |
| | ILI9341 D/C | `GPIO 2` | Data / Command |
| | TFT Backlight | `GPIO 21` | PWM LEDC Dimmer |
| **Touch** | XPT2046 SPI CLK | `GPIO 25` | Dedicated SPI / Bitbang |
| | XPT2046 SPI CS | `GPIO 33` | Chip Select |
| | XPT2046 MOSI | `GPIO 32` | Data In |
| | XPT2046 MISO | `GPIO 39` | Data Out |
| | XPT2046 IRQ | `GPIO 36` | Touch Interrupt |
| **Sensors/LED**| Onboard RGB (Red) | `GPIO 4` | Active Low |
| | Onboard RGB (Green) | `GPIO 16` | Active Low |
| | Onboard RGB (Blue) | `GPIO 17` | Active Low |
| | LDR Light Sensor | `GPIO 34` | ADC1 Channel 6 |
| **Audio** | Mono Speaker DAC | `GPIO 26` | 8-bit DAC Output (DAC1) |
| **Serial** | UART0 TX / RX | `GPIO 1 / GPIO 3` | CH340 / CP2102 USB Bridge |

---

## 7. Software Architecture & Plugin Scaffold

### A. Kindle KOReader Plugin (`koreader/plugins/pipdeck.koreader/`) - Primary
- `_meta.lua`: Plugin registration.
- `main.lua`: mDNS network listener, orientation-responsive drawing routines, partial/full e-ink refresh controller.

### B. ESP32 Firmware (PlatformIO / LovyanGFX) - Secondary
- **Core 0**: Serial UART / WebSocket parser, state machine, LED/DAC controller.
- **Core 1**: LovyanGFX DMA framebuffer swap (60 FPS render pipeline).
