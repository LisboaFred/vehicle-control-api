import { config } from '../config';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const LOG_COLORS: Record<LogLevel, string> = {
  info: '\x1b[36m',   // Cyan
  warn: '\x1b[33m',   // Yellow
  error: '\x1b[31m',  // Red
  debug: '\x1b[35m',  // Magenta
};

const RESET = '\x1b[0m';

function formatTimestamp(): string {
  return new Date().toISOString();
}

function log(level: LogLevel, message: string, meta?: unknown): void {
  // Suppress logs during tests to keep output clean
  if (config.isTest) return;

  const color = LOG_COLORS[level];
  const timestamp = formatTimestamp();
  const prefix = `${color}[${level.toUpperCase()}]${RESET}`;

  const output = `${prefix} ${timestamp} — ${message}`;

  if (level === 'error') {
    console.error(output, meta !== undefined ? meta : '');
  } else if (level === 'warn') {
    console.warn(output, meta !== undefined ? meta : '');
  } else {
    console.log(output, meta !== undefined ? meta : '');
  }
}

/**
 * Simple structured logger.
 * Suppresses output in test environment to keep jest output clean.
 */
export const logger = {
  info: (message: string, meta?: unknown) => log('info', message, meta),
  warn: (message: string, meta?: unknown) => log('warn', message, meta),
  error: (message: string, meta?: unknown) => log('error', message, meta),
  debug: (message: string, meta?: unknown) => {
    if (config.isDevelopment) {
      log('debug', message, meta);
    }
  },
};
