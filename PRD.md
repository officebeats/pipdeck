# Product Requirements Document (PRD): PipDeck (Oh My Pi Hardware Companion)

## 1. Executive Summary & Vision

**PipDeck** is an open-source hardware desktop companion display powered by the **ESP32-2432S028R** (Cheap Yellow Display / CYD). It provides real-time telemetry, tool invocation feedback, subagent status, todo phases, chat thread tracking, and animated 8-bit mascot expressions for developers running the **Oh My Pi (OMP)** coding harness.

Every model reference strictly pairs the **Provider Name**, **Associated Provider Icon**, and **Model Name** (e.g. `🏺 Anthropic claude-3-7-sonnet`, `✨ Google gemini-3.7-flash`, `🌀 OpenAI gpt-5.2-reasoning`, `🦙 Local/Ollama qwen2.5-coder-7b`).

---

## 2. Mascot Size Invariance & 5-Agent Incremental Swarm Scaling

PipDeck enforces a **strict size invariance rule for the central Pip mascot**: Pip's coordinate dimensions ($48 \times 48\text{px}$ bounding box centered at $(80, 100)$) remain **100% identical and persistently large** across all swarm counts (1 to 32 nodes) and all lifecycle states (`IDLE`, `THINKING`, `BASH`, `SWARM`, `ALERT`, `VICTORY`).

As parallel tasks scale up, the surrounding square worker constellation grows progressively in **5-agent increments**:

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

| Swarm Level | Mascot Size Invariant | Orbital Constellation Structure | Visual Density Feeling |
| :--- | :--- | :--- | :--- |
| **1 Node** | Persistently Large ($48 \times 48\text{px}$) | 1 node rotating at $R=56\text{px}$ with a direct laser link. | Minimalist, single-turn focus. |
| **5 Nodes** | Persistently Large ($48 \times 48\text{px}$) | 5 nodes in an orbiting pentagon constellation web ($R=58\text{px}$). | Clean geometric wave. |
| **10 Nodes** | Persistently Large ($48 \times 48\text{px}$) | 10 nodes split into dual counter-spinning rings ($R=40\text{px}$, $R=64\text{px}$). | Balanced dual-orbital flow. |
| **15 Nodes** | Persistently Large ($48 \times 48\text{px}$) | 15 nodes in 3 counter-spinning rings ($R=34\text{px}$, $R=50\text{px}$, $R=68\text{px}$). | Active multi-agent web. |
| **20 Nodes** | Persistently Large ($48 \times 48\text{px}$) | 20 nodes in 3 dense rings ($R=36\text{px}$, $R=52\text{px}$, $R=68\text{px}$). | Dense, humming swarm hive. |
| **25 Nodes** | Persistently Large ($48 \times 48\text{px}$) | 25 nodes in 4 dense rings ($R=28\text{px}$, $R=42\text{px}$, $R=56\text{px}$, $R=70\text{px}$). | Heavily crowded particle matrix. |
| **32 Nodes (MAX)**| Persistently Large ($48 \times 48\text{px}$) | 32 nodes in 4 bounded rings with full cascading matrix rain &amp; lightning arcs. | **Maximum Swarm Crowding** (controlled chaos). |

---

## 3. Simplified Native TUI Display Architecture ($320 \times 240$ Screen)

```
+------------------------------------------------------------------------+
| [1. DASHBOARD]            [2. SUBAGENTS]            [3. TODO & LOGS]   | <-- Touch Tabs
+------------------------------------------------------------------------+
| OMP ❯ 🏺 Anthropic claude-3-7-sonnet      git:main*           12:45:02 | <-- Session Header
+------------------------------------------------------------------------+
| ┌─ Mascot Canvas ─────────┐ ┌─ OMP Execution Telemetry ──────────────┐ |
| │                         │ │ THREAD: #refactor-auth-flow            │ | <-- Chat Thread Name
| │   [ 8-Bit Pixel Pip ]   │ │ STATUS: ● THINKING                     │ |
| │     (48x48px Large)     │ │ TODO PHASE: Phase 2: Auth Flow         │ |
| │      160 x 200 px       │ │ >_ cargo test --all --lib              │ |
| │     (Pure Black)        │ │                                        │ |
| │                         │ │ AGENTS:                                │ |
| │                         │ │ [✨ Google] [🏺 Anthropic] [🌀 OpenAI]  │ |
| └─────────────────────────┘ └────────────────────────────────────────┘ |
+------------------------------------------------------------------------+
| CTX: [=====>        ] 34%  |  Cost: $0.14  |  Tokens: 42.8k tok        | <-- Context Progress
+------------------------------------------------------------------------+
```

---

## 4. Hardware Specifications & Pinout (ESP32-2432S028R)

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

## 5. Software & Firmware Architecture

### Dual-Core FreeRTOS Partitioning
- **Core 0 (Communication & State Engine):**
  - High-throughput USB Serial UART parser (921600 baud, newline-delimited JSON).
  - State machine transitions, LED PWM controller, DAC audio chimes.
- **Core 1 (Graphics & DMA Render Engine):**
  - LovyanGFX display driver with dual 16-bit DMA framebuffers.
  - LVGL 9 Matrix TUI widgets, provider badge chips, and 5-agent incremental swarm constellation engine.
  - XPT2046 touch input debounce & screen switching.
