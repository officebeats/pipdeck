# PipDeck 📖⚡ — Kindle KOReader & Hardware Companion for Oh My Pi (OMP)

[![Primary Platform: Kindle KOReader E-Ink](https://img.shields.io/badge/Primary%20Platform-Kindle%20KOReader%20E--Ink-ffffff.svg?style=flat-square)](https://github.com/koreader/koreader)
[![Secondary Platform: ESP32-2432S028R](https://img.shields.io/badge/Secondary%20Platform-ESP32--2432S028R-38bdf8.svg?style=flat-square)](https://www.amazon.com/AOICRIE-Development-ESP32-2432S028R-Bluetooth-Resistive/dp/B0FFGZTGYN)
[![License: MIT](https://img.shields.io/badge/License-MIT-00ff41.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Harness: Oh My Pi](https://img.shields.io/badge/Harness-Oh%20My%20Pi-00ff41.svg?style=flat-square)](https://github.com/officebeats/pipdeck)

> **PipDeck** is an open-source hardware companion display engineered primarily for **jailbroken Amazon Kindle e-ink devices running KOReader (Tier 1)**, with secondary support for **ESP32 micro-displays (Tier 2)**. It connects wirelessly over local Wi-Fi with mDNS auto-discovery, delivering real-time agent telemetry, chat thread tracking, subagent swarm matrix status, and 1-bit retro LCD/e-ink mascot animations with zero configuration.

---

## 📸 Primary Platform Showcase: Kindle E-Ink (KOReader)

Pure 1-bit high-contrast monochrome rendering with responsive **Portrait** and **Landscape** auto-orientation and e-ink ghosting mitigation:

| Kindle Portrait Mode (600×800 / 1072×1448) | Kindle Landscape Mode (800×600 / 1448×1072) |
| :---: | :---: |
| [![Kindle Portrait](assets/screenshots/kindle-portrait.webp)](assets/screenshots/kindle-portrait.webp) | [![Kindle Landscape](assets/screenshots/kindle-landscape.webp)](assets/screenshots/kindle-landscape.webp) |

---

## 📸 Secondary Platform Showcase: ESP32 2.8" SPI Color LCD (CYD)

High-contrast Matrix phosphor green theme on pure `#000000` OLED black with active RGB underglow:
[![ESP32 Swarm 32](assets/screenshots/dashboard-swarm-32.webp)](assets/screenshots/dashboard-swarm-32.webp)

---

## ⚡ Adaptive Refresh Rate & E-Ink Animation Engine

E-ink electrophoretic microcapsules have physical refresh latency (~250–450ms). PipDeck dynamically adapts its stepped animation pacing based on the target display:

| Platform Tier | Display Tech | Animation Pacing | Ghosting Mitigation |
| :--- | :--- | :--- | :--- |
| **Primary (Tier 1): Kindle E-Ink (KOReader)** | 1-Bit Monochrome E-Ink | **1–2 FPS Low-Pace Stepped Waveforms / Event Ticks** | **Automatic Full Flash Waveform Clear every 15 state changes** |
| **Secondary (Tier 2): ESP32 Micro-Displays** | 2.8" Color SPI TFT | 4–8 FPS Retro LCD Stepped Motion (`steps(8)` to `steps(16)`) | Constant 60 FPS DMA Framebuffer Swap |

---

## 🛒 Target Hardware & Devices

### 1. Primary Platform: Upcycled E-Ink Reader (Kindle + KOReader)
- Any jailbroken **Amazon Kindle** (Paperwhite 2/3/4/5, Oasis, Basic, Scribe) running [KOReader](https://github.com/koreader/koreader). Connects wirelessly over local Wi-Fi with weeks of battery life.

### 2. Secondary Platform: Dedicated Color Hardware Display (ESP32)
- **Target Board**: **[AOICRIE ESP32-2432S028R 2.8" SPI TFT LCD (Amazon)](https://www.amazon.com/AOICRIE-Development-ESP32-2432S028R-Bluetooth-Resistive/dp/B0FFGZTGYN)**  
  *(ESP32-WROOM-32, 2.8" $320 \times 240$ SPI TFT with ILI9341 driver, XPT2046 resistive touch, onboard RGB LED, light sensor LDR, mono audio DAC speaker header, and USB-C).*

---

## ✨ Features & Architecture Invariants

### 1. Mandatory Provider Iconography & Format
Every model reference strictly follows: `[Provider Icon] [Provider Name] [Model Name]`:
- 🏺 **Anthropic**: `🏺 Anthropic claude-3-7-sonnet` (Lead Orchestrator)
- ✨ **Google**: `✨ Google gemini-3.7-flash` (Scout)
- 🌀 **OpenAI**: `🌀 OpenAI gpt-5.2-reasoning` (Reviewer)
- 🦙 **Local / Ollama**: `🦙 Local/Ollama qwen2.5-coder-7b` (Sonic)
- ⚡ **Groq**: `⚡ Groq llama-3.3-70b-versatile`
- 🧠 **Cerebras**: `🧠 Cerebras llama3.3-70b`
- ✖️ **xAI**: `✖️ xAI grok-2`
- 🌪️ **Mistral**: `🌪️ Mistral codestral-2501`

### 2. Persistent Large Mascot ($48 \times 48\text{px}$)
Pip maintains a strictly constant scale and position centered at $(80, 100)$ across all states and swarm increments ($1 \to 32$ nodes).

### 3. 5-Agent Incremental Swarm Scaling ($1 \to 32$ Nodes)
- **1 Node**: Pip alone with a single orbiting task worker.
- **5 Nodes**: Orbiting pentagon constellation web.
- **10 Nodes**: Dual counter-spinning rings.
- **15 Nodes**: 3-ring active multi-agent web.
- **20 Nodes**: Dense humming hive.
- **25 Nodes**: Heavily crowded particle matrix.
- **32 Nodes (MAX)**: Full-bleed telepathic swarm vortex with cascading matrix rain and laser web.

### 4. Wireless Zero-Config for Non-Technical Users
- **mDNS Auto-Discovery**: The Kindle KOReader plugin auto-discovers `omp.local:8787` on your local Wi-Fi.
- **Terminal QR Code**: Typing `/companion` in `omp` displays an ASCII pairing QR code.

---

## 🛠️ Quick Start & Installation

### 1. Kindle KOReader Plugin Installation (Primary)
1. Connect your jailbroken Kindle to your computer via USB.
2. Copy the `koreader/plugins/pipdeck.koreader` folder into your Kindle's `koreader/plugins/` directory:
   ```bash
   cp -r koreader/plugins/pipdeck.koreader /media/kindle/koreader/plugins/
   ```
3. Open KOReader $\to$ Main Menu $\to$ **PipDeck (OMP Companion)** $\to$ **Launch PipDeck E-Ink Display**.

### 2. OMP Host Extension Setup
Drop the TypeScript extension into your local Oh My Pi directory:
```bash
mkdir -p ~/.omp/agent/extensions
cp firmware/host/pipdeck-status.ts ~/.omp/agent/extensions/
```

### 3. Interactive Web Simulator
Open [index.html](index.html) in any browser to test the **Kindle E-Ink Portrait (Primary)**, **Kindle E-Ink Landscape**, and **ESP32 2.8" Color LCD (Secondary)** simulators with real-time state controls.

---

## 📜 Invariants & Rules (In Perpetuity)
- `PRD.md` and `README.md` are kept strictly synchronized in lockstep across all feature definitions and code changes. See [RULES.md](RULES.md).
- Released under the [MIT License](LICENSE). Built with 💚 for the **Oh My Pi (OMP)** and **KOReader** communities.
