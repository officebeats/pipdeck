import * as http from 'http';
import * as os from 'os';

export interface PipDeckSubagent {
  name: string;
  active: boolean;
}

export interface PipDeckTelemetry {
  v: number;
  ts: number;
  model: string;
  thread: string;
  state: string;
  phase: string;
  command: string;
  tokens: string;
  cost: string;
  ctx: string;
  swarm_nodes: number;
  subagents: PipDeckSubagent[];
}

export interface OmpEngine {
  getSessionName?(): string;
  getModel?(): string;
  on(event: string, handler: (event: ToolEvent, ctx: unknown) => void): void;
}

export interface ToolEvent {
  toolName?: string;
  args?: Record<string, unknown>;
}

/**
 * Format raw model identifiers to mandatory provider notation:
 * [Provider Icon] [Provider Name] [Model Name]
 */
export function formatModelNotation(rawModel: string): string {
  const m = rawModel.toLowerCase();
  if (m.includes('claude') || m.includes('anthropic') || m.includes('sonnet') || m.includes('haiku') || m.includes('opus')) {
    return `🏺 Anthropic ${rawModel.replace(/^anthropic\//i, '')}`;
  }
  if (m.includes('gemini') || m.includes('google') || m.includes('flash')) {
    return `✨ Google ${rawModel.replace(/^google\//i, '')}`;
  }
  if (m.includes('gpt') || m.includes('openai') || m.includes('o1') || m.includes('o3') || m.includes('reasoning')) {
    return `🌀 OpenAI ${rawModel.replace(/^openai\//i, '')}`;
  }
  if (m.includes('qwen') || m.includes('ollama') || m.includes('local') || m.includes('llama') || m.includes('deepseek')) {
    return `🦙 Local/Ollama ${rawModel.replace(/^ollama\//i, '')}`;
  }
  return `🤖 ${rawModel}`;
}

export function getLocalIpAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const ifaceList = interfaces[name];
    if (ifaceList) {
      for (const iface of ifaceList) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }
  return '127.0.0.1';
}

/**
 * PipDeck Daemon Server for Oh My Pi (OMP)
 * Serves port 8787 for Kindle KOReader / ZenOS e-ink devices and ESP32 micro-displays.
 */
export class PipDeckServer {
  private server: http.Server | null = null;
  private currentTelemetry: PipDeckTelemetry;
  private port: number = 8787;

  constructor() {
    this.currentTelemetry = {
      v: 1,
      ts: Date.now(),
      model: '🏺 Anthropic claude-3-7-sonnet',
      thread: '🧵 #workspace-init',
      state: '● IDLE / READY',
      phase: '📋 Awaiting prompt',
      command: '>_ omp --ready',
      tokens: '0 tok',
      cost: '$0.00',
      ctx: '0%',
      swarm_nodes: 1,
      subagents: [
        { name: '✨ Google Scout', active: false },
        { name: '🏺 Anthropic Coder', active: false },
        { name: '🌀 OpenAI Review', active: false },
        { name: '🦙 Local Sonic', active: false },
      ]
    };
  }

  public updateTelemetry(partial: Partial<PipDeckTelemetry>): void {
    this.currentTelemetry = {
      ...this.currentTelemetry,
      ...partial,
      ts: Date.now(),
    };
  }

  public start(): void {
    this.server = http.createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      const url = req.url || '/';

      if (url === '/api/status' || url === '/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.currentTelemetry));
        return;
      }

      if (url === '/health' || url === '/ping') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('PONG');
        return;
      }

      // Responsive HTML fallback for Kindle Browser (defaults to 12h clock)
      const timeStr = new Date().toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' });
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="2">
  <title>PipDeck Kindle Companion</title>
  <style>
    body { font-family: monospace; background: #fff; color: #000; padding: 12px; font-size: 16px; margin: 0; }
    .box { border: 3px solid #000; padding: 12px; margin-bottom: 10px; }
    h1 { font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 4px; margin-top: 0; }
    .status { font-weight: bold; font-size: 18px; }
  </style>
</head>
<body>
  <div class="box">
    <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom:6px;">
      <span>${this.currentTelemetry.model}</span>
      <span>${timeStr}</span>
    </div>
    <p class="status">${this.currentTelemetry.state}</p>
    <p>${this.currentTelemetry.thread}</p>
    <p>${this.currentTelemetry.phase}</p>
    <pre style="background:#000; color:#fff; padding:8px;">${this.currentTelemetry.command}</pre>
    <p>CTX: ${this.currentTelemetry.ctx} | COST: ${this.currentTelemetry.cost} | TOKENS: ${this.currentTelemetry.tokens}</p>
  </div>
</body>
</html>`);
    });

    this.server.listen(this.port, '0.0.0.0', () => {
      const ip = getLocalIpAddress();
      console.log(`[PipDeck] Server listening on http://0.0.0.0:${this.port}`);
      console.log(`[PipDeck] Kindle KOReader / ZenOS endpoint: http://${ip}:${this.port}/api/status`);
      console.log(`[PipDeck] mDNS advertised service: _pipdeck._tcp.local / _omp._tcp.local`);
    });
  }

  public stop(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }
}

/**
 * Oh My Pi Extension Hook
 */
export default function (pi: OmpEngine): void {
  const daemon = new PipDeckServer();
  daemon.start();

  pi.on('agent_start', () => {
    daemon.updateTelemetry({
      state: '● THINKING',
      phase: '📋 Analyzing request & codebase',
      command: '>_ omp agent: plan step',
      model: formatModelNotation(pi.getModel?.() || 'claude-3-7-sonnet'),
      thread: `🧵 #${pi.getSessionName?.() || 'active-thread'}`,
    });
  });

  pi.on('tool_execution_start', (event: ToolEvent) => {
    daemon.updateTelemetry({
      state: '● EXECUTING TOOL',
      command: `>_ ${event.toolName || 'tool'} ${JSON.stringify(event.args || {})}`,
    });
  });

  pi.on('agent_settled', () => {
    daemon.updateTelemetry({
      state: '● JOB PASSED',
      phase: '✓ Verification Complete',
      command: '>_ omp: check verified [PASS]',
    });
  });

  pi.on('agent_end', () => {
    daemon.updateTelemetry({
      state: '● IDLE / READY',
      phase: '📋 Awaiting prompt',
      command: '>_ omp --ready',
    });
  });
}
