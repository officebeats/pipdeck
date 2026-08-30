import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 8790;
const ROOT_DIR = path.resolve(__dirname, '../..');
const STATUS_FILE = '/tmp/codex-live-status.json';
const HOME_DIR = process.env.HOME || '/home/beats-omarchy';
const SESSIONS_DIR = path.join(HOME_DIR, '.omp/agent/sessions');

export interface CodexPetState {
  happiness: number;
  energy: number;
  tokensEaten: number;
  state: 'idle' | 'thinking' | 'bash' | 'alert' | 'victory' | 'swarm32';
  model: string;
  thread: string;
  command: string;
  lastInteraction: number;
}

const currentPetState: CodexPetState = {
  happiness: 90,
  energy: 95,
  tokensEaten: 18400,
  state: 'idle',
  model: '🌀 OpenAI gpt-5.2-reasoning',
  thread: '🧵 #codex-session',
  command: '>_ codex: live session',
  lastInteraction: Date.now(),
};
const sseClients: http.ServerResponse[] = [];

function broadcastState() {
  const payload = `data: ${JSON.stringify(currentPetState)}\n\n`;
  for (let i = sseClients.length - 1; i >= 0; i--) {
    const res = sseClients[i];
    try {
      res.write(payload);
    } catch (e) {
      sseClients.splice(i, 1);
    }
  }
}

export function updateCodexPetState(partial: Partial<CodexPetState>) {
  const previous = JSON.stringify(currentPetState);
  Object.assign(currentPetState, partial);
  currentPetState.lastInteraction = Date.now();
  if (JSON.stringify(currentPetState) !== previous) {
    try {
      fs.writeFileSync(STATUS_FILE, JSON.stringify(currentPetState), 'utf8');
    } catch (e) {}
    broadcastState();
  }
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.svg': return 'image/svg+xml';
    case '.css': return 'text/css';
    case '.js': return 'application/javascript';
    case '.json': return 'application/json';
    case '.webp': return 'image/webp';
    case '.png': return 'image/png';
    default: return 'application/octet-stream';
  }
}

let lastReadSessionFile = '';
let lastReadSessionOffset = 0;
let lastActivityTs = Date.now();

function findLatestSessionFile(): string | null {
  try {
    if (!fs.existsSync(SESSIONS_DIR)) return null;
    let newestFile: string | null = null;
    let newestMtime = 0;

    function scanDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const ent of entries) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
          scanDir(full);
        } else if (ent.isFile() && ent.name.endsWith('.jsonl')) {
          const stat = fs.statSync(full);
          if (stat.mtimeMs > newestMtime) {
            newestMtime = stat.mtimeMs;
            newestFile = full;
          }
        }
      }
    }

    scanDir(SESSIONS_DIR);
    return newestFile;
  } catch (e) {
    return null;
  }
}

function processSessionLine(line: string) {
  if (!line.trim()) return;
  try {
    const entry = JSON.parse(line);
    lastActivityTs = Date.now();

    if (entry.type === 'custom' && entry.customType === 'tool_execution_start') {
      const data = entry.data || {};
      const toolName = data.toolName || 'tool';
      const args = data.args || {};
      const isTask = toolName === 'task';
      let preview = `>_ ${toolName}`;
      if (toolName === 'bash') {
        preview = `>_ bash: ${(args.command || '').slice(0, 32)}`;
      } else if (toolName === 'read' || toolName === 'write' || toolName === 'edit') {
        const p = args.path || args.file || '';
        preview = `>_ ${toolName}: ${p.split('/').pop() || p}`;
      } else if (toolName === 'grep' || toolName === 'glob') {
        preview = `>_ ${toolName}: ${(args.pattern || args.path || '').slice(0, 24)}`;
      } else if (isTask) {
        const tasks = Array.isArray(args.tasks) ? args.tasks.length : 1;
        preview = `>_ codex task: ${tasks} subagents`;
      }

      updateCodexPetState({
        state: isTask ? 'swarm32' : 'bash',
        command: preview,
        energy: Math.min(100, currentPetState.energy + 1),
      });
    } else if (entry.type === 'message' && entry.message?.role === 'assistant') {
      const content = entry.message.content;
      if (Array.isArray(content)) {
        for (const part of content) {
          if (part.type === 'thinking') {
            updateCodexPetState({
              state: 'thinking',
              command: '>_ codex: reasoning & thinking',
            });
            break;
          }
        }
      }
    } else if (entry.type === 'message' && entry.message?.role === 'user') {
      updateCodexPetState({
        state: 'thinking',
        command: '>_ codex: prompt received',
      });
    }
  } catch (e) {}
}

function pollOmpActivity() {
  const latestFile = findLatestSessionFile();
  if (!latestFile) return;

  try {
    const stat = fs.statSync(latestFile);
    if (latestFile !== lastReadSessionFile) {
      lastReadSessionFile = latestFile;
      lastReadSessionOffset = Math.max(0, stat.size - 8192);
    }

    if (stat.size > lastReadSessionOffset) {
      const fd = fs.openSync(latestFile, 'r');
      const len = stat.size - lastReadSessionOffset;
      const buffer = Buffer.alloc(len);
      fs.readSync(fd, buffer, 0, len, lastReadSessionOffset);
      fs.closeSync(fd);
      lastReadSessionOffset = stat.size;

      const text = buffer.toString('utf8');
      const lines = text.split('\n');
      for (const line of lines) {
        processSessionLine(line);
      }
    }
  } catch (e) {}

  if (Date.now() - lastActivityTs > 12000 && currentPetState.state !== 'idle') {
    updateCodexPetState({
      state: 'idle',
      command: '>_ codex: ready',
    });
  }
}

export function startCodexPetServer(port: number = PORT): http.Server {
  if (fs.existsSync(STATUS_FILE)) {
    try {
      const initData = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
      Object.assign(currentPetState, initData);
    } catch (e) {}
  }

  fs.watchFile(STATUS_FILE, { interval: 100 }, () => {
    try {
      if (fs.existsSync(STATUS_FILE)) {
        const data = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
        Object.assign(currentPetState, data);
        broadcastState();
      }
    } catch (e) {}
  });

  setInterval(pollOmpActivity, 150);

  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const reqUrl = req.url || '/';
    const parsedUrl = new URL(reqUrl, `http://localhost:${port}`);
    const pathname = parsedUrl.pathname;

    // Real-Time SSE Stream
    if (pathname === '/api/codex/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });
      res.write(`data: ${JSON.stringify(currentPetState)}\n\n`);
      sseClients.push(res);

      req.on('close', () => {
        const idx = sseClients.indexOf(res);
        if (idx !== -1) sseClients.splice(idx, 1);
      });
      return;
    }

    // State JSON Endpoint
    if (pathname === '/api/codex/state') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(currentPetState));
      return;
    }

    // Update Action Endpoint
    if (pathname === '/api/codex/action' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const action = JSON.parse(body);
          if (action.type === 'pet') {
            currentPetState.happiness = Math.min(100, currentPetState.happiness + 5);
            currentPetState.energy = Math.min(100, currentPetState.energy + 2);
          } else if (action.type === 'feed') {
            currentPetState.happiness = Math.min(100, currentPetState.happiness + 8);
            currentPetState.energy = Math.min(100, currentPetState.energy + 10);
            currentPetState.tokensEaten += 1024;
          } else if (action.state) {
            currentPetState.state = action.state;
          }
          if (action.command) currentPetState.command = action.command;
          if (action.model) currentPetState.model = action.model;
          updateCodexPetState({});
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, state: currentPetState }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON body' }));
        }
      });
      return;
    }

    // Static Routes (Reusing ROOT_DIR/assets for zero asset duplication)
    let targetFile = '';
    if (pathname === '/' || pathname === '/pet' || pathname === '/index.html') {
      targetFile = path.join(__dirname, 'pet.html');
    } else if (pathname.startsWith('/assets/')) {
      targetFile = path.join(ROOT_DIR, pathname);
    } else {
      targetFile = path.join(ROOT_DIR, pathname);
    }

    if (fs.existsSync(targetFile) && fs.statSync(targetFile).isFile()) {
      const mime = getMimeType(targetFile);
      res.writeHead(200, { 'Content-Type': mime });
      fs.createReadStream(targetFile).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`[Codex Pet] Server running at http://localhost:${port}`);
    console.log(`[Codex Pet] SSE Stream: http://localhost:${port}/api/codex/events`);
  });

  return server;
}

if (process.argv[1]?.endsWith('server.ts') || process.argv[1]?.endsWith('server.js')) {
  startCodexPetServer(PORT);
}