import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const folders = ['assets/img', 'assets/portfolio'];
const images = folders.flatMap((folder) => readdirSync(join(root, folder))
  .filter((name) => name.toLowerCase().endsWith('.jpg'))
  .map((name) => `${folder}/${name}`));
const chromePath = process.env.CHROME_BIN || 'google-chrome';
const profilePath = join(tmpdir(), `maximum-designs-image-optimizer-${process.pid}`);
let browser;
let socket;
let server;

const page = `<!doctype html><meta charset="utf-8"><script>
window.__optimizer = (async () => {
  const files = ${JSON.stringify(images)};
  const manifest = {};
  let sourceBytes = 0;
  let outputBytes = 0;
  const encode = (canvas) => new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('WebP encoding failed')), 'image/webp', 0.78);
  });
  for (const file of files) {
    const response = await fetch('/image?path=' + encodeURIComponent(file));
    if (!response.ok) throw new Error('Unable to read ' + file);
    const jpeg = await response.blob();
    sourceBytes += jpeg.size;
    const bitmap = await createImageBitmap(jpeg);
    const folder = file.slice(0, file.lastIndexOf('/') + 1);
    const name = file.slice(file.lastIndexOf('/') + 1, -4);
    const save = async (label, width) => {
      const height = Math.round(bitmap.height * width / bitmap.width);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height);
      const webp = await encode(canvas);
      const output = folder + name + '-' + label + '.webp';
      const saved = await fetch('/save?path=' + encodeURIComponent(output), {
        method: 'POST',
        headers: { 'Content-Type': 'image/webp' },
        body: webp
      });
      if (!saved.ok) throw new Error('Unable to save ' + output + ': ' + await saved.text());
      outputBytes += webp.size;
      return { path: output, width, height };
    };
    const small = await save('640w', Math.min(640, bitmap.width));
    const full = await save('full', bitmap.width);
    manifest[file] = { width: bitmap.width, height: bitmap.height, small, full };
    bitmap.close();
  }
  const saved = await fetch('/manifest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(manifest)
  });
  if (!saved.ok) throw new Error('Unable to save image-size manifest: ' + await saved.text());
  return { converted: files.length, sourceBytes, outputBytes };
})();
</script>`;

function listenForMessage(websocket, id) {
  return new Promise((resolveMessage, rejectMessage) => {
    const onMessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      websocket.removeEventListener('message', onMessage);
      if (message.error) rejectMessage(new Error(message.error.message));
      else resolveMessage(message.result);
    };
    websocket.addEventListener('message', onMessage);
  });
}

function command(method, params = {}) {
  const id = ++command.id;
  const result = listenForMessage(socket, id);
  socket.send(JSON.stringify({ id, method, params }));
  return result;
}
command.id = 0;

async function waitForDebugPort(file) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const [port] = readFileSync(file, 'utf8').trim().split('\n');
      return Number(port);
    } catch {
      if (browser.exitCode !== null) throw new Error('Chrome exited before starting its debugging port.');
      await delay(100);
    }
  }
  throw new Error('Timed out waiting for Chrome to start.');
}

async function main() {
  server = createServer((request, response) => {
    const url = new URL(request.url, 'http://127.0.0.1');
    if (request.method === 'GET' && url.pathname === '/') {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(page);
      return;
    }
    if (request.method === 'GET' && url.pathname === '/image') {
      const file = url.searchParams.get('path') || '';
      if (!images.includes(file)) { response.writeHead(404).end('Unknown image'); return; }
      response.writeHead(200, { 'Content-Type': 'image/jpeg' }).end(readFileSync(join(root, file)));
      return;
    }
    if (request.method === 'POST' && url.pathname === '/save') {
      const file = url.searchParams.get('path') || '';
      if (!/^assets\/(?:img|portfolio)\/[a-z0-9-]+-(?:640w|full)\.webp$/i.test(file)) {
        response.writeHead(400).end('Invalid output path');
        return;
      }
      const chunks = [];
      let size = 0;
      request.on('data', (chunk) => {
        size += chunk.length;
        if (size > 5_000_000) { response.writeHead(413).end('Image is too large'); request.destroy(); }
        else chunks.push(chunk);
      });
      request.on('end', () => {
        const output = join(root, file);
        writeFileSync(output, Buffer.concat(chunks));
        response.writeHead(204).end();
      });
      return;
    }
    if (request.method === 'POST' && url.pathname === '/manifest') {
      const chunks = [];
      request.on('data', (chunk) => chunks.push(chunk));
      request.on('end', () => {
        const contents = `window.IMAGE_SIZES = ${JSON.stringify(JSON.parse(Buffer.concat(chunks).toString()), null, 2)};\n`;
        writeFileSync(join(root, 'assets/image-sizes.js'), contents);
        response.writeHead(204).end();
      });
      return;
    }
    response.writeHead(404).end('Not found');
  });

  await new Promise((resolveListen, rejectListen) => {
    server.once('error', rejectListen);
    server.listen(0, '127.0.0.1', resolveListen);
  });
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  browser = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--remote-debugging-port=0',
    '--remote-allow-origins=*',
    `--user-data-dir=${profilePath}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ], { stdio: 'ignore' });
  const browserError = new Promise((resolveError, rejectError) => {
    browser.once('error', (error) => rejectError(new Error(`Unable to launch Chrome: ${error.message}`)));
  });

  const port = await Promise.race([
    waitForDebugPort(join(profilePath, 'DevToolsActivePort')),
    browserError
  ]);
  const targetResponse = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(baseUrl)}`, { method: 'PUT' });
  if (!targetResponse.ok) throw new Error(`Unable to open the image conversion page: ${targetResponse.status}`);
  const target = await targetResponse.json();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolveOpen, rejectOpen) => {
    socket.addEventListener('open', resolveOpen, { once: true });
    socket.addEventListener('error', rejectOpen, { once: true });
  });
  await command('Runtime.enable');
  await command('Page.enable');
  const pageLoaded = new Promise((resolveLoad) => {
    const onMessage = (event) => {
      if (JSON.parse(event.data).method !== 'Page.loadEventFired') return;
      socket.removeEventListener('message', onMessage);
      resolveLoad();
    };
    socket.addEventListener('message', onMessage);
  });
  await command('Page.navigate', { url: baseUrl });
  await pageLoaded;
  const { result, exceptionDetails } = await command('Runtime.evaluate', {
    expression: 'window.__optimizer',
    awaitPromise: true,
    returnByValue: true
  });
  if (exceptionDetails) throw new Error(exceptionDetails.text || 'Image conversion failed.');
  const summary = result.value;
  console.log(`Optimized ${summary.converted} JPGs into responsive WebP variants.`);
  console.log(`Original JPEGs: ${(summary.sourceBytes / 1_000_000).toFixed(2)} MB; WebP variants: ${(summary.outputBytes / 1_000_000).toFixed(2)} MB.`);
  console.log('JPEG originals remain in place as browser fallbacks.');
}

try {
  await main();
} finally {
  if (browser && browser.exitCode === null) {
    await new Promise((resolveExit) => {
      browser.once('exit', resolveExit);
      browser.kill('SIGTERM');
    });
  }
  if (socket && socket.readyState === WebSocket.OPEN) socket.close();
  if (server) await new Promise((resolveClose) => server.close(resolveClose));
  await delay(250);
  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      rmSync(profilePath, { recursive: true, force: true });
      break;
    } catch (error) {
      if (error.code !== 'ENOTEMPTY' || attempt === 9) throw error;
      await delay(100);
    }
  }
}
