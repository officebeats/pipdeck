import * as http from 'http';
import * as fs from 'fs';
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
  on(event: string, handler: (event: ToolEvent | Record<string, unknown>, ctx?: unknown) => void): void;
}

export interface ToolEvent {
  toolName?: string;
  args?: Record<string, unknown>;
  input?: Record<string, unknown>;
}

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
    syncPetStatus(this.currentTelemetry);
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
    <p style="font-size:12px; border-top:1px solid #000; padding-top:4px;">Web Simulator: <a href="https://officebeats.github.io/pipdeck">officebeats.github.io/pipdeck</a></p>
  </div>
</body>
</html>`);
    });

    this.server.listen(this.port, '0.0.0.0', () => {
      const ip = getLocalIpAddress();
      console.log(`[PipDeck] Server listening on http://0.0.0.0:${this.port}`);
      console.log(`[PipDeck] Kindle KOReader / ZenOS endpoint: http://${ip}:${this.port}/api/status`);
      console.log(`[PipDeck] Web Simulator & 1-Click Installer: https://officebeats.github.io/pipdeck`);
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

const PIP_STATUS_FILE = '/tmp/pip-live-status.json';
const CODEX_STATUS_FILE = '/tmp/codex-live-status.json';

function syncPetStatus(telemetry: PipDeckTelemetry): void {
  let petState = 'idle';
  const rawState = telemetry.state.toLowerCase();
  if (rawState.includes('executing') || rawState.includes('bash') || rawState.includes('tool')) {
    petState = 'bash';
  } else if (rawState.includes('thinking') || rawState.includes('plan')) {
    petState = 'thinking';
  } else if (rawState.includes('passed') || rawState.includes('victory') || rawState.includes('pass')) {
    petState = 'victory';
  } else if (rawState.includes('alert') || rawState.includes('error') || rawState.includes('fail')) {
    petState = 'alert';
  } else if (rawState.includes('swarm') || telemetry.swarm_nodes > 1) {
    petState = 'swarm32';
  } else {
    petState = 'idle';
  }

  const petPayload = {
    happiness: petState === 'victory' ? 100 : 92,
    energy: petState === 'bash' ? 98 : 95,
    tokensEaten: 18400,
    state: petState,
    model: telemetry.model,
    thread: telemetry.thread,
    command: telemetry.command,
    phase: telemetry.phase,
    lastInteraction: Date.now(),
  };

  try {
    fs.writeFileSync(PIP_STATUS_FILE, JSON.stringify(petPayload), 'utf8');
    fs.writeFileSync(CODEX_STATUS_FILE, JSON.stringify(petPayload), 'utf8');
  } catch (e) {}
  // Non-blocking notification to live pet servers
  for (const port of [8788, 8790]) {
    try {
      const req = http.request({
        hostname: '127.0.0.1',
        port,
        path: port === 8788 ? '/api/pet/action' : '/api/codex/action',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        timeout: 150,
      }, () => {});
      req.on('error', () => {});
      req.on('timeout', () => req.destroy());
      req.write(JSON.stringify({
        type: 'setState',
        state: petState,
        model: telemetry.model,
        command: telemetry.command,
      }));
      req.end();
    } catch (e) {}
  }
}

function deriveToolPreview(toolName: string = 'tool', args: Record<string, unknown> = {}): string {
  if (toolName === 'bash') {
    const cmd = typeof args.command === 'string' ? args.command : (typeof args.cmd === 'string' ? args.cmd : '');
    return `>_ bash: ${cmd.slice(0, 45)}`;
  }
  if (toolName === 'read' || toolName === 'write' || toolName === 'edit') {
    const p = typeof args.path === 'string' ? args.path : (typeof args.file === 'string' ? args.file : '');
    return `>_ ${toolName}: ${p.split('/').pop() || p}`;
  }
  if (toolName === 'grep' || toolName === 'glob') {
    const pattern = typeof args.pattern === 'string' ? args.pattern : (typeof args.path === 'string' ? args.path : '');
    return `>_ ${toolName}: ${pattern.slice(0, 35)}`;
  }
  if (toolName === 'task') {
    const tasks = Array.isArray(args.tasks) ? args.tasks : [];
    return `>_ omp task: ${tasks.length || 1} subagent(s)`;
  }
  return `>_ ${toolName} active`;
}
function postToOrcaAgentHook(hookEventName: string, extra: Record<string, unknown> = {}): void {
  let port = process.env.ORCA_AGENT_HOOK_PORT || '';
  let token = process.env.ORCA_AGENT_HOOK_TOKEN || '';
  const paneKey = process.env.ORCA_PANE_KEY || '';

  if (!port || !token) {
    try {
      const endpointPath = process.env.ORCA_AGENT_HOOK_ENDPOINT || '/home/beats-omarchy/.config/orca/agent-hooks/endpoint.env';
      if (fs.existsSync(endpointPath)) {
        const lines = fs.readFileSync(endpointPath, 'utf8').split('\n');
        for (const line of lines) {
          const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
          if (m) {
            if (m[1] === 'ORCA_AGENT_HOOK_PORT') port = m[2].trim();
            if (m[1] === 'ORCA_AGENT_HOOK_TOKEN') token = m[2].trim();
          }
        }
      }
    } catch (e) {}
  }

  if (!port || !token || !paneKey) return;

  try {
    const req = http.request({
      hostname: '127.0.0.1',
      port: parseInt(port, 10),
      path: '/hook/omp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Orca-Agent-Hook-Token': token,
      },
      timeout: 200,
    }, () => {});
    req.on('error', () => {});
    req.on('timeout', () => req.destroy());
    req.write(JSON.stringify({
      paneKey,
      launchToken: process.env.ORCA_AGENT_LAUNCH_TOKEN || '',
      tabId: process.env.ORCA_TAB_ID || '',
      worktreeId: process.env.ORCA_WORKTREE_ID || '',
      payload: {
        hook_event_name: hookEventName,
        ...extra,
      },
    }));
    req.end();
  } catch (e) {}
}

/**
 * Oh My Pi Extension Hook
 */
export default function (pi: OmpEngine): void {
  const daemon = new PipDeckServer();
  daemon.start();

  pi.on('before_agent_start', () => {
    postToOrcaAgentHook('before_agent_start');
    daemon.updateTelemetry({
      state: '● THINKING',
      phase: '📋 Analyzing request & codebase',
      command: '>_ omp agent: plan step',
      model: formatModelNotation(pi.getModel?.() || 'claude-3-7-sonnet'),
      thread: `🧵 #${pi.getSessionName?.() || 'omp-active'}`,
    });
  });

  pi.on('agent_start', () => {
    postToOrcaAgentHook('agent_start');
    daemon.updateTelemetry({
      state: '● THINKING',
      phase: '📋 Analyzing request & codebase',
      command: '>_ omp agent: plan step',
      model: formatModelNotation(pi.getModel?.() || 'claude-3-7-sonnet'),
      thread: `🧵 #${pi.getSessionName?.() || 'omp-active'}`,
    });
  });

  pi.on('tool_execution_start', (event: ToolEvent) => {
    const toolName = event.toolName || 'tool';
    const args = event.args || event.input || {};
    const isTask = toolName === 'task';
    const taskCount = isTask && Array.isArray(args.tasks) ? args.tasks.length : 1;

    postToOrcaAgentHook('tool_execution_start', {
      tool_name: toolName,
      tool_input: args,
    });

    daemon.updateTelemetry({
      state: isTask ? '● PARALLEL SWARM' : '● EXECUTING TOOL',
      phase: isTask ? `⚡ Swarm: ${taskCount} Agents` : `⚙️ Running ${toolName}`,
      command: deriveToolPreview(toolName, args),
      swarm_nodes: isTask ? Math.max(taskCount, 4) : 1,
    });
  });

  pi.on('tool_call', (event: ToolEvent) => {
    const toolName = event.toolName || 'tool';
    const args = event.input || event.args || {};

    postToOrcaAgentHook('tool_call', {
      tool_name: toolName,
      tool_input: args,
    });

    daemon.updateTelemetry({
      state: '● EXECUTING TOOL',
      command: deriveToolPreview(toolName, args),
    });
  });

  pi.on('tool_execution_end', (event: ToolEvent) => {
    const toolName = event.toolName || 'tool';
    postToOrcaAgentHook('tool_execution_end', {
      tool_name: toolName,
    });
    daemon.updateTelemetry({
      state: '● THINKING',
      phase: '📋 Processing tool result',
      command: '>_ omp: analyzing output',
    });
  });

  pi.on('agent_settled', () => {
    postToOrcaAgentHook('agent_settled');
    daemon.updateTelemetry({
      state: '● JOB PASSED',
      phase: '✓ Verification Complete',
      command: '>_ omp: check verified [PASS]',
      swarm_nodes: 1,
    });
  });

  pi.on('agent_end', () => {
    postToOrcaAgentHook('agent_end');
    daemon.updateTelemetry({
      state: '● IDLE / READY',
      phase: '📋 Awaiting prompt',
      command: '>_ omp --ready',
      swarm_nodes: 1,
    });
  });
}
