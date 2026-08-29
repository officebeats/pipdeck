import { SerialPort } from 'serialport';

interface OmpEngine {
  getSessionName?(): string;
  getModel?(): string;
  on(event: string, handler: (event: ToolEvent, ctx: unknown) => void): void;
}

interface ToolEvent {
  toolName?: string;
  args?: Record<string, unknown>;
}

/**
 * PipDeck Hardware Companion Status Extension for Oh My Pi (OMP)
 * Drops into ~/.omp/agent/extensions/pipdeck-status.ts
 */
export default function (pi: OmpEngine): void {
  let port: SerialPort | null = null;
  const BAUD_RATE = 921600;

  function initSerial(): void {
    try {
      port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: BAUD_RATE, autoOpen: true });
      port.on('error', () => { port = null; });
    } catch {
      port = null;
    }
  }
  initSerial();

  function emitTelemetry(status: string, extra: Record<string, unknown> = {}): void {
    if (!port || !port.isOpen) return;
    const packet = JSON.stringify({
      v: 1,
      ts: Date.now(),
      status,
      thread: pi.getSessionName?.() || 'default',
      profile: process.env.OMP_PROFILE || 'default',
      model: pi.getModel?.() || 'default',
      ...extra,
    }) + '\n';
    port.write(packet);
  }

  pi.on('agent_start', () => emitTelemetry('THINKING'));
  pi.on('tool_execution_start', (event: ToolEvent) => {
    emitTelemetry('EXECUTING_TOOL', {
      tool: event.toolName,
      args: event.args,
    });
  });
  pi.on('tool_execution_end', () => emitTelemetry('THINKING'));
  pi.on('agent_settled', () => emitTelemetry('JOB_PASSED'));
  pi.on('agent_end', () => emitTelemetry('IDLE'));
}
