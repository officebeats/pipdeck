# PipDeck 📖⚡ — Kindle KOReader, ZenOS & Hardware Companion for Oh My Pi (OMP)

[![Release: v0.1.0-alpha](https://img.shields.io/badge/Release-v0.1.0--alpha-facc15.svg?style=flat-square)](https://github.com/officebeats/pipdeck/releases)
[![Primary Platform: Kindle KOReader & ZenOS](https://img.shields.io/badge/Primary%20Platform-Kindle%20KOReader%20%26%20ZenOS-ffffff.svg?style=flat-square)](https://github.com/koreader/koreader)
[![Target: Paperwhite & Basic](https://img.shields.io/badge/Target-Kindle%20Paperwhite%20(PW1--5)-38bdf8.svg?style=flat-square)](https://github.com/officebeats/pipdeck)
[![Live Web Simulator & Installer](https://img.shields.io/badge/Live%20Web%20Simulator-officebeats.github.io%2Fpipdeck-00ff41.svg?style=flat-square)](https://officebeats.github.io/pipdeck)
[![Theme: Light & Dark Modes](https://img.shields.io/badge/Theme-Light%20%26%20Dark%20Modes-c084fc.svg?style=flat-square)](https://officebeats.github.io/pipdeck)
[![License: MIT](https://img.shields.io/badge/License-MIT-00ff41.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **PipDeck v0.1.0-alpha** is an open-source hardware companion display engineered primarily for **jailbroken Amazon Kindle e-ink devices running KOReader and ZenOS (Tier 1)** with dedicated optimization for **older Kindle Paperwhite devices (PW1, PW2, PW3, PW4, PW5, Basic, Touch)**, plus secondary support for **ESP32 micro-displays (Tier 2)**. It connects wirelessly over local Wi-Fi with mDNS auto-discovery, delivering real-time agent telemetry, chat thread tracking, subagent swarm matrix status, and 1-bit retro LCD/e-ink mascot animations with a full-bleed canvas, default 12-hour clock, and instant **Light Mode (Paper Day)** & **Dark Mode (OLED Night)** theme switching.
>
> 🌐 **Live Web Simulator & 1-Click Installer**: [https://officebeats.github.io/pipdeck](https://officebeats.github.io/pipdeck) *(Type: `officebeats.github.io/pipdeck`)*
>
> 📦 **Alpha Release ZIP**: [pipdeck-koreader-paperwhite-v0.1.0-alpha.zip](https://officebeats.github.io/pipdeck/dist/pipdeck-koreader-paperwhite-v0.1.0-alpha.zip)

---

## ⚠️ Prerequisite for Kindle Users

PipDeck runs as a KOReader plugin / KUAL extension on Amazon Kindle e-ink hardware.
- **Requirement**: You must have a **jailbroken Kindle with KOReader installed**.
- **Don't know what that is?** 👉 **[Let Me Google That For You 🖱️](https://letmegooglethat.com/?q=how+to+jailbreak+kindle+and+install+koreader)**

---

## 📸 Primary Platform Showcase: Kindle E-Ink (KOReader & ZenOS)

Pure 1-bit high-contrast monochrome rendering with responsive **Portrait**, **Landscape**, **ZenOS App Launcher**, and **Light & Dark Theme** modes:

| Kindle Portrait Mode (600×800 / 1072×1448) | Kindle Landscape Mode (800×600 / 1448×1072) |
| :---: | :---: |
| [![Kindle Portrait](assets/screenshots/kindle-portrait.webp)](assets/screenshots/kindle-portrait.webp) | [![Kindle Landscape](assets/screenshots/kindle-landscape.webp)](assets/screenshots/kindle-landscape.webp) |

---

## 📸 Secondary Platform Showcase: ESP32 2.8" SPI Color LCD (CYD)

Unified high-contrast design mirroring the clean E-Ink layout with instant **Light Terminal Mode** and **Dark Matrix Mode** support:
[![ESP32 High-Contrast Layout](assets/screenshots/dashboard-swarm-32.webp)](assets/screenshots/dashboard-swarm-32.webp)

---

## 🌐 Live Web Simulator & 1-Click Installer (GitHub Pages)

Experience the live interactive simulator, test stepped animations, or install directly to your Kindle via USB at:
👉 **[https://officebeats.github.io/pipdeck](https://officebeats.github.io/pipdeck)**

*(Short URL to type in browser: `officebeats.github.io/pipdeck`)*

---

## 🔌 Zero-Hassle Installation for Paperwhite & Kindle Users

PipDeck provides triple-store integration across KOReader, ZenOS, and KUAL:

### Method 1: 1-Click Web Drive Installer *(Recommended — Zero File Hunting)*
1. Plug your Kindle Paperwhite into your computer via USB.
2. Open **[officebeats.github.io/pipdeck](https://officebeats.github.io/pipdeck)** in Chrome, Edge, or Brave.
3. Click **`[ ⚡ Install to Kindle Drive ]`** and select your Kindle drive (e.g. `E:\` or `/Volumes/Kindle`).
4. The browser automatically writes `pipdeck.koplugin` to `koreader/plugins/` and the KUAL extension to `extensions/pipdeck/`. Safely eject and launch!

### Method 2: In-Kindle ZenPM Store *(Zero Cables / Direct Wi-Fi)*
1. On your Kindle running **ZenOS / ZenUI**, open **ZenPM** (Package Manager).
2. Search for **"PipDeck"** and tap **`[ Install ]`**.

### Method 3: 1-Step Drag & Drop Alpha ZIP
1. Download **[pipdeck-koreader-paperwhite-v0.1.0-alpha.zip](https://officebeats.github.io/pipdeck/dist/pipdeck-koreader-paperwhite-v0.1.0-alpha.zip)**.
2. Drag the unzipped `koreader` and `extensions` folders straight onto your Kindle drive root.

---

## ☀️ Light Mode & 🌙 Dark Mode Architecture

PipDeck supports seamless day/night theme switching on both E-Ink and color LCD hardware:
- **Kindle E-Ink (KOReader / ZenOS / KUAL)**:
  - **☀️ Light Mode (Day)**: Pure Paper White (`#ffffff`) background with stark black borders and typography.
  - **🌙 Dark Mode (Night)**: Pure Black (`#000000`) background with high-contrast white typography and inverted badges.
- **ESP32 Color Display**:
  - **🌙 Dark Matrix Mode**: Pitch black (`#000000`) OLED background with neon matrix green (`#00ff41`) and cyber-yellow accents.
  - **☀️ Light Terminal Mode**: Pure white (`#ffffff`) background with emerald green (`#15803d`) borders and dark typography.

---

## ⚡ Universal Low-Framerate Stepped Animation Invariant (LED/LCD Pace)

Every animation across all SVGs, UI widgets, and graphic assets in PipDeck **strictly uses discrete stepped keyframes (`steps(N)`)**:
- **Smooth `linear` and `ease-in-out` transitions are strictly prohibited.**
- **Mascot levitation & breathing**: `steps(2)` to `steps(4)`.
- **Orbital rotations (1 to 32 nodes)**: `steps(8)` to `steps(16)`.
- **Matrix code rain & confetti**: `steps(6)` to `steps(8)`.
- **Lightning strobe & eye blinks**: `steps(2)`.
- **Display Pacing Rationale**:
  - **Kindle E-Ink (KOReader & ZenOS Primary)**: 1–2 FPS event-stepped low-pace refresh prevents electrophoretic particle fatigue and preserves weeks of battery life.
  - **ESP32 Micro-Displays (Secondary)**: 4–8 FPS retro LCD stepped motion delivers authentic vintage hardware matrix stutter.

---

## 5-Agent Incremental Swarm Hierarchy (Full-Bleed Canvas & Top-Right HUD)

Pip maintains a **strictly constant large bounding box ($48 \times 48\text{px}$)** centered at $(80, 100)$ across all swarm increments ($1 \to 32$ nodes) with full vertical canvas bleed ($y=12$ to $y=190$) and a persistent top-right combo HUD tag:

| Swarm Level | Combo HUD Tag | Mascot Size Invariant | Stepped Animation Timing | Visual Density Feeling |
| :--- | :--- | :--- | :--- | :--- |
| **1 Node** | `[ 1x SOLO ]` | Persistently Large ($48 \times 48\text{px}$) | `8s steps(8)` solo orbit | Minimalist, single-turn focus. |
| **5 Nodes** | `[ 5x SWARM ]` | Persistently Large ($48 \times 48\text{px}$) | `10s steps(10)` pentagon web | Clean geometric wave. |
| **10 Nodes** | `[ 10x DUAL ]` | Persistently Large ($48 \times 48\text{px}$) | Dual rings: `8s steps(8)` / `14s steps(12)` | Balanced dual-orbital flow. |
| **15 Nodes** | `[ 15x TRIPLE ]` | Persistently Large ($48 \times 48\text{px}$) | 3 rings: `8s steps(8)` / `12s steps(10)` / `18s steps(12)` | Active multi-agent web. |
| **20 Nodes** | `[ 20x HIVE ]` | Persistently Large ($48 \times 48\text{px}$) | 3 rings: `8s steps(8)` / `12s steps(10)` / `18s steps(14)` | Dense, humming swarm hive. |
| **25 Nodes** | `[ 25x MATRIX ]` | Persistently Large ($48 \times 48\text{px}$) | 4 rings: `8s steps(8)` to `22s steps(14)` | Heavily crowded particle matrix. |
| **32 Nodes (MAX)**| `[ 32x CROWD ]` | Persistently Large ($48 \times 48\text{px}$) | 4 bounded rings: `6s steps(8)` to `18s steps(16)` + matrix rain | **Maximum Swarm Crowding** (controlled chaos). |

---

## 🛒 Target Hardware & Devices

### 1. Primary Platform: Upcycled E-Ink Reader (Kindle + KOReader / ZenOS / KUAL)
- **Flagship Target**: **Amazon Kindle Paperwhite (PW1, PW2, PW3, PW4, PW5)**, plus Kindle Keyboard K3, Touch, Basic, Oasis, and Scribe running [KOReader](https://github.com/koreader/koreader), [ZenOS / ZenUI](https://github.com/AnthonyGress/zen_ui.koplugin), or KUAL. Connects wirelessly over local Wi-Fi with weeks of battery life and default 12-hour clock.

### 2. Secondary Platform: Dedicated Color Hardware Display (ESP32)
- **Target Board**: **[AOICRIE ESP32-2432S028R 2.8" SPI TFT LCD (Amazon)](https://www.amazon.com/AOICRIE-Development-ESP32-2432S028R-Bluetooth-Resistive/dp/B0FFGZTGYN)**  
  *(ESP32-WROOM-32, 2.8" $320 \times 240$ SPI TFT with ILI9341 driver, XPT2046 resistive touch, onboard RGB LED, light sensor LDR, mono audio DAC speaker header, and USB-C).*


---

## 🐾 Orca & Codex Native Desktop Companion Sprites (Zero Background / LED Pixel Effect)

PipDeck includes native companion sprite support across both **Orca IDE** and **OpenAI Codex** coding environments:
- **Built-in Orca Pet Integration**: Upload or select Pip directly from the Orca status-bar pet menu (Experimental Settings) using the transparent SVGs/PNGs in `assets/animations/` (`pip-idle.svg`, `pip-hacking.svg`, `pip-victory.svg`).
- **Native Floating Companion Window**: 100% true alpha transparent Wayland window with zero gray/white/black background boxes, pinned over the desktop with discrete retro LED pixel animation.
- **Universal Asset Source (`assets/animations/`)**: Single canonical source of truth for all platforms (Kindle E-Ink, ESP32, Orca, Codex, Web Simulator) with zero asset drift.
- **Universal Stepped Pacing**: Strictly uses `steps(N)` low-framerate retro LED/LCD timing across all states.
- **Real-Time Live SSE Stream**: Broadcasts agent lifecycle transitions (idle, thinking, bash/coding, alert, victory, swarm) with sub-10ms latency via Server-Sent Events.
- **Launchers**:
  - **Orca Pet**: `./bin/orca-pet {start|stop|status|pet|feed|state}` (Port 8788, SSE stream + WebKit2 native alpha transparent Wayland window).
  - **Codex Pet**: `./bin/codex-pet {start|stop|status|pet|feed|state}` (Port 8790, SSE stream + WebKit2 native alpha transparent Wayland window).

## 🛠️ Quick Start & Installation

### 1. OMP Host Daemon Setup
Drop the companion server into your local Oh My Pi directory:
```bash
mkdir -p ~/.omp/agent/extensions
cp firmware/host/pipdeck-server.ts ~/.omp/agent/extensions/
```

### 2. Live Web Simulator
Visit [https://officebeats.github.io/pipdeck](https://officebeats.github.io/pipdeck) in any browser to test all platforms with real-time controls, Light/Dark themes, and 1-click Kindle installer.

---

## 📜 Invariants & Rules (In Perpetuity)
- `PRD.md` and `README.md` are kept strictly synchronized in lockstep across all feature definitions and code changes. See [RULES.md](RULES.md).
- Released under the [MIT License](LICENSE). Built with 💚 for the **Oh My Pi (OMP)**, **KOReader**, and **ZenOS** communities.
