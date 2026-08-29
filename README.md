# PipDeck 📟⚡ — Multi-Platform Hardware Companion for Oh My Pi (OMP)

[![License: MIT](https://img.shields.io/badge/License-MIT-00ff41.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Target 1: ESP32-2432S028R](https://img.shields.io/badge/Hardware-ESP32--2432S028R-38bdf8.svg?style=flat-square)](https://www.amazon.com/AOICRIE-Development-ESP32-2432S028R-Bluetooth-Resistive/dp/B0FFGZTGYN)
[![Target 2: Kindle KOReader](https://img.shields.io/badge/E--Ink-Kindle%20KOReader-ffffff.svg?style=flat-square)](https://github.com/koreader/koreader)
[![Harness: Oh My Pi](https://img.shields.io/badge/Harness-Oh%20My%20Pi-00ff41.svg?style=flat-square)](https://github.com/officebeats/pipdeck)

> **PipDeck** is an open-source hardware desktop companion display engineered to monitor **Oh My Pi (OMP)** agent telemetry. It supports both **ESP32 color micro-displays (CYD)** and **jailbroken Amazon Kindle e-ink devices running KOReader** with automatic local wireless discovery and adaptive low-framerate stepped animations.

---

## 📸 Multi-Platform Showcase

### Platform 1: ESP32 2.8" SPI Color LCD (CYD)
High-contrast Matrix phosphor green theme on pure `#000000` OLED black with active RGB underglow:
![ESP32 Swarm 32](assets/screenshots/dashboard-swarm-32.webp)

---

### Platform 2: Amazon Kindle E-Ink (KOReader Plugin)
Pure 1-bit high-contrast monochrome with automatic **Portrait** and **Landscape** orientation adaptation and e-ink ghosting mitigation:

| Kindle Portrait Mode (600×800 / 1072×1448) | Kindle Landscape Mode (800×600 / 1448×1072) |
| :---: | :---: |
| ![Kindle Portrait](assets/screenshots/kindle-portrait.webp) | ![Kindle Landscape](assets/screenshots/kindle-landscape.webp) |

---

## ⚡ Adaptive Refresh Rate & E-Ink Animation Engine

E-ink displays have physical refresh latency (~250–450ms). PipDeck dynamically adapts its stepped animation pacing based on the target display:

| Platform | Display Tech | Animation Pacing | Ghosting Mitigation |
| :--- | :--- | :--- | :--- |
| **ESP32 Micro-Displays** | 2.8" Color SPI TFT | 4–8 FPS Retro LCD Stepped Motion (`steps(8)` to `steps(16)`) | Constant 60 FPS DMA Framebuffer Swap |
| **Kindle E-Ink (KOReader)**| 1-Bit Monochrome E-Ink | **1–2 FPS Low-Pace Stepped Waveforms / Event Ticks** | **Automatic Full Flash Waveform Clear every 15 state changes** |

---

## 🛒 Recommended Hardware & Bill of Materials

### Option A: Dedicated Color Hardware Display (ESP32)
- **Target Board**: **[AOICRIE ESP32-2432S028R 2.8" SPI TFT LCD (Amazon)](https://www.amazon.com/AOICRIE-Development-ESP32-2432S028R-Bluetooth-Resistive/dp/B0FFGZTGYN)**  
  *(ESP32-WROOM-32, 2.8" $320 \times 240$ SPI TFT with ILI9341 driver, XPT2046 resistive touch, onboard RGB LED, light sensor LDR, mono audio DAC speaker header, and USB-C).*

### Option B: Upcycled E-Ink Reader (Kindle + KOReader)
- Any jailbroken **Amazon Kindle** (Paperwhite 2/3/4/5, Oasis, Basic, Scribe) running [KOReader](https://github.com/koreader/koreader). Connects wirelessly over local Wi-Fi with weeks of battery life.

---

## ✨ Features & Architecture

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

### 3. Wireless Zero-Config for Non-Technical Users
- **mDNS Auto-Discovery**: The Kindle KOReader plugin auto-discovers `omp.local:8787` on your local Wi-Fi.
- **Terminal QR Code**: Typing `/companion` in `omp` displays an ASCII pairing QR code.

---

## 🛠️ Quick Start & Installation

### 1. Kindle KOReader Plugin Installation
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
Open [index.html](index.html) in any browser to toggle between **ESP32 2.8" Color LCD**, **Kindle E-Ink Portrait**, and **Kindle E-Ink Landscape** simulators with real-time state controls.

---

## 📜 License
Released under the [MIT License](LICENSE). Built with 💚 for the **Oh My Pi (OMP)** and **KOReader** communities.
