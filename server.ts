import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { spawn, type ChildProcess } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const FASTAPI_PORT = Number(process.env.FASTAPI_PORT) || 8000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

let fastApiProcess: ChildProcess | null = null;
let fastApiReady = false;

function pingFastApi(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(
      {
        hostname: '127.0.0.1',
        port: FASTAPI_PORT,
        path: '/api/health',
        timeout: 1200,
      },
      (res) => {
        res.resume();
        resolve(res.statusCode === 200);
      }
    );
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForFastApi(timeoutMs = 15000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await pingFastApi()) {
      fastApiReady = true;
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error('FastAPI backend did not respond within startup timeout.');
}

function startFastApiBackend(): ChildProcess {
  const proc = spawn(
    'python3',
    ['-m', 'uvicorn', 'backend.main:app', '--host', '127.0.0.1', '--port', String(FASTAPI_PORT)],
    {
      cwd: __dirname,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
    }
  );

  proc.stdout?.on('data', (chunk: Buffer) => {
    const line = chunk.toString().trim();
    if (line) console.log(`[FastAPI] ${line}`);
  });

  proc.stderr?.on('data', (chunk: Buffer) => {
    const line = chunk.toString().trim();
    if (line) console.log(`[FastAPI] ${line}`);
  });

  proc.on('exit', (code) => {
    fastApiReady = false;
    if (code !== null && code !== 0) {
      console.error(`[FastAPI] exited with code ${code}`);
    }
  });

  return proc;
}

function proxyToFastApi(req: Request, res: Response): void {
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  const payload = hasBody ? JSON.stringify(req.body ?? {}) : null;

  const headers: http.OutgoingHttpHeaders = {
    'content-type': req.get('content-type') || 'application/json',
  };
  if (payload !== null) {
    headers['content-length'] = Buffer.byteLength(payload);
  }

  const upstreamReq = http.request(
    {
      hostname: '127.0.0.1',
      port: FASTAPI_PORT,
      path: req.originalUrl,
      method: req.method,
      headers,
      timeout: 15000,
    },
    (upstreamRes) => {
      const chunks: Buffer[] = [];
      upstreamRes.on('data', (chunk: Buffer) => chunks.push(chunk));
      upstreamRes.on('end', () => {
        const bodyBuffer = Buffer.concat(chunks);
        const contentType = upstreamRes.headers['content-type'] || 'application/json';
        res.status(upstreamRes.statusCode || 502).type(contentType).send(bodyBuffer);
      });
    }
  );

  upstreamReq.on('error', (error) => {
    console.error('FastAPI proxy error:', error);
    if (!res.headersSent) {
      res.status(502).json({
        ok: false,
        message: 'Python FastAPI backend is temporarily unavailable.',
      });
    }
  });

  upstreamReq.on('timeout', () => {
    upstreamReq.destroy();
    if (!res.headersSent) {
      res.status(504).json({
        ok: false,
        message: 'Python FastAPI request timed out.',
      });
    }
  });

  if (payload !== null) {
    upstreamReq.write(payload);
  }
  upstreamReq.end();
}

function cleanupFastApi() {
  if (fastApiProcess && !fastApiProcess.killed) {
    fastApiProcess.kill('SIGTERM');
    fastApiProcess = null;
  }
}

process.on('SIGINT', () => {
  cleanupFastApi();
  process.exit(0);
});
process.on('SIGTERM', () => {
  cleanupFastApi();
  process.exit(0);
});
process.on('exit', cleanupFastApi);

async function startServer() {
  fastApiProcess = startFastApiBackend();
  const readyPromise = waitForFastApi()
    .then(() => {
      console.log(`Python FastAPI + SQLite backend ready on 127.0.0.1:${FASTAPI_PORT}`);
    })
    .catch((err) => {
      console.error('FastAPI startup warning:', err);
    });

  const app = express();
  app.use(express.json({ limit: '128kb' }));

  // Proxy all /api/* traffic directly to Python FastAPI + SQLite
  app.use('/api', async (req: Request, res: Response) => {
    if (!fastApiReady) {
      await readyPromise;
    }
    proxyToFastApi(req, res);
  });

  const publicDir = path.join(__dirname, 'public');
  app.get('/Rakesh_Roshan_Resume.pdf', (_req: Request, res: Response) => {
    res.type('application/pdf');
    res.sendFile(path.join(publicDir, 'Rakesh_Roshan_Resume.pdf'));
  });

  if (!IS_PRODUCTION) {
    app.use(express.static(publicDir));
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  cleanupFastApi();
  process.exit(1);
});
