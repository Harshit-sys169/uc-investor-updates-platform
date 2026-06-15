type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogPayload = Record<string, unknown> & {
  message: string;
};

function serialize(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return '[unserializable]';
  }
}

export function log(level: LogLevel, payload: LogPayload) {
  const entry = {
    level,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  const line = serialize(entry);

  if (level === 'error') {
    console.error(line);
    return;
  }

  if (level === 'warn') {
    console.warn(line);
    return;
  }

  if (level === 'debug') {
    console.debug(line);
    return;
  }

  console.log(line);
}

export function createRequestLogContext(requestId: string | null, path: string) {
  return {
    requestId: requestId ?? 'unknown',
    path,
  };
}
