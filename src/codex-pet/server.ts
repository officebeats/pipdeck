import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 8790;
const ROOT_DIR = path.resolve(__dirname, '../..');
const STATUS_FILE = '/tmp/codex-live-status.json';

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
  Object.assign(currentPetState, partial);
  currentPetState.lastInteraction = Date.now();
  try {
    fs.writeFileSync(STATUS_FILE, JSON.stringify(currentPetState), 'utf8');
  } catch (e) {}
  broadcastState();
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