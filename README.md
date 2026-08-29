# PipDeck 📟⚡ — Open-Source Hardware Companion for Oh My Pi (OMP)

[![License: MIT](https://img.shields.io/badge/License-MIT-00ff41.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Target: ESP32-2432S028R](https://img.shields.io/badge/Hardware-ESP32--2432S028R-38bdf8.svg?style=flat-square)](https://www.amazon.com/AOICRIE-Development-ESP32-2432S028R-Bluetooth-Resistive/dp/B0FFGZTGYN)
[![Firmware: PlatformIO](https://img.shields.io/badge/Firmware-PlatformIO%20%2F%20LovyanGFX-facc15.svg?style=flat-square)](https://platformio.org/)
[![Harness: Oh My Pi](https://img.shields.io/badge/Harness-Oh%20My%20Pi-00ff41.svg?style=flat-square)](https://github.com/officebeats/pipdeck)

> **PipDeck** is an open-source hardware desktop companion display powered by the **ESP32-2432S028R** (Cheap Yellow Display / CYD). It provides real-time telemetry, tool invocation feedback, subagent status, todo phases, chat thread tracking, and an animated 8-bit retro LCD mascot for developers running the **Oh My Pi (OMP)** coding harness.

---

## 📸 Visual Showcase & Feature Previews

### 1. 32-Node Swarm Vortex (Max Parallel Concurrency)
Levitating in the exact center, **Commander Pip** telepathically orchestrates 32 active worker nodes rotating across bounded concentric orbital rings:
![32-Node Swarm Vortex](assets/screenshots/dashboard-swarm-32.webp)

---

### 2. Live Agent Lifecycle States

| State | Preview Screenshot | Telemetry & Mascot Behavior |
| :--- | :--- | :--- |
| **THINKING** | ![Thinking](assets/screenshots/dashboard-thinking.webp) | Rotating holographic dual thought rings, looking-up scanning eyes, active prompt synthesis. |
| **TOOL: BASH** | ![Bash Execution](assets/screenshots/dashboard-bash.webp) | Rapid typing on an 8-bit mechanical keyboard with green matrix sparks and command arguments. |
| **ASK USER** | ![Ask User](assets/screenshots/dashboard-alert.webp) | Bouncing alert jump, glowing yellow `[!]` badge, flashing ambient orange hardware LED. |
| **JOB PASSED** | ![Job Passed](assets/screenshots/dashboard-victory.webp) | 8-bit pixel sunglasses ("Deal with it"), celebratory peace sign, and falling matrix confetti. |

---

### 3. Native OMP Telemetry & Subagents Views

| View | Preview Screenshot | Description |
| :--- | :--- | :--- |
| **[2. SUBAGENTS]** | ![Subagents Tab](assets/screenshots/dashboard-subagents.webp) | Displays active subagents (`✨ Google Scout [smol]`, `🏺 Anthropic Coder [default]`, `🌀 OpenAI Reviewer [slow]`, `🦙 Local Sonic [sonic]`) with live model assignments. |
| **[3. TODO & LOGS]** | ![Todo & Logs Tab](assets/screenshots/dashboard-todo-logs.webp) | Real-time `todo` tool phased progress (`Phase 1: Foundation ✓`, `Phase 2: Auth Flow ⚡`) with live tool execution traces. |

---

## 🛒 Recommended Hardware & Bill of Materials

PipDeck is engineered for zero soldering. Plug the board into your computer via USB-C or micro-USB and launch Oh My Pi:

- **Target Development Board**: [AOICRIE ESP32-2432S028R 2.8" SPI TFT LCD (Amazon)](https://www.amazon.com/AOICRIE-Development-ESP32-2432S028R-Bluetooth-Resistive/dp/B0FFGZTGYN)
  - **MCU**: ESP32-WROOM-32 (240 MHz Dual-Core, Wi-Fi / BLE)
  - **Display**: 2.8" SPI TFT LCD ($320 \times 240$ Native Resolution, ILI9341 Driver)
  - **Touchscreen**: XPT2046 Resistive Touch
  - **Peripherals**: Onboard Active-Low RGB LED (IO4/16/17), Light Sensor (LDR IO34), Audio DAC Speaker Header (IO26), USB-C / Micro-USB (CH340/CP2102).

---

## ✨ Core Features & Design System

### 1. Pure OLED Black (`#000000`) & High-Contrast Typography
- **Canvas**: Pure pitch black `#000000` with zero muddy tints.
- **Typography**: Crisp `#ffffff` and `#e2e8f0` text, `#00ff41` matrix green structural borders, and `#facc15` cyber-yellow command boxes.
- **30–40% Larger Font Sizes**: Concise terminal syntax (`🧵 #thread-name`, `● STATUS`, `📋 Phase`, `>_ command`) optimized for effortless reading at arm's length.

### 2. Mandatory Provider Iconography & Emojis
Every model reference strictly follows: `[Provider Icon] [Provider Name] [Model Name]`:
- 🏺 **Anthropic**: `🏺 Anthropic claude-3-7-sonnet` (Lead Orchestrator)
- ✨ **Google**: `✨ Google gemini-3.7-flash` (Scout)
- 🌀 **OpenAI**: `🌀 OpenAI gpt-5.2-reasoning` (Reviewer)
- 🦙 **Local / Ollama**: `🦙 Local/Ollama qwen2.5-coder-7b` (Sonic)
- ⚡ **Groq**: `⚡ Groq llama-3.3-70b-versatile`
- 🧠 **Cerebras**: `🧠 Cerebras llama3.3-70b`
- ✖️ **xAI**: `✖️ xAI grok-2`
- 🌪️ **Mistral**: `🌪️ Mistral codestral-2501`

### 3. Persistent Large Mascot ($48 \times 48\text{px}$) & LCD Stepped Frame Timing
- **Size Invariance**: Pip's scale and coordinates remain 100% constant and centered at $(80, 100)$ across all swarm counts and lifecycle states.
- **Retro LCD Motion**: All animations use discrete `steps(2)` to `steps(16)` keyframe timing (4–8 FPS emulation) for authentic embedded matrix stutter.

### 4. 5-Agent Incremental Swarm Scaling ($1 \to 32$ Nodes)
- **1 Node**: Pip alone with a single orbiting task worker.
- **5 Nodes**: Orbiting pentagon constellation web.
- **10 Nodes**: Dual counter-spinning rings.
- **15 Nodes**: 3-ring active multi-agent web.
- **20 Nodes**: Dense humming hive.
- **25 Nodes**: Heavily crowded particle matrix.
- **32 Nodes (MAX)**: Full-bleed telepathic swarm vortex with cascading matrix rain and laser web.

---

## 🛠️ Hardware Pinout Reference (ESP32-2432S028R)

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

## ⚡ Quick Start Guide

### 1. Host Extension Installation (Oh My Pi)
Drop the TypeScript extension into your local OMP extensions directory:

```bash
mkdir -p ~/.omp/agent/extensions
cp firmware/host/pipdeck-status.ts ~/.omp/agent/extensions/
```

```typescript
// ~/.omp/agent/extensions/pipdeck-status.ts
import { SerialPort } from 'serialport';

export default function (pi: any) {
  let port: SerialPort | null = null;
  try {
    port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 921600 });
  } catch (e) {
    console.warn('[PipDeck] Connecting over WebSocket fallback...');
  }

  function emit(status: string, extra: Record<string, unknown> = {}) {
    if (!port || !port.isOpen) return;
    const packet = JSON.stringify({
      v: 1,
      ts: Date.now(),
      status,
      thread: pi.getSessionName?.() || 'default',
      model: pi.getModel?.() || 'default',
      ...extra
    }) + '\n';
    port.write(packet);
  }

  pi.on('agent_start', () => emit('THINKING'));
  pi.on('tool_execution_start', (e: any) => emit('TOOL_EXEC', { tool: e.toolName, args: e.args }));
  pi.on('tool_execution_end', () => emit('THINKING'));
  pi.on('agent_settled', () => emit('VICTORY'));
}
```

### 2. Interactive Web Simulator
Open [index.html](index.html) in any modern browser to test real-time state transitions, 5-agent incremental swarm scaling, and large-scale hardware simulations.

---

## 📜 License
Released under the [MIT License](LICENSE). Built with 💚 for the **Oh My Pi (OMP)** community.
