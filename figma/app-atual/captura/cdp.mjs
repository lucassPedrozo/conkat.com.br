// Controle mínimo do Edge pelo DevTools Protocol, para tirar os prints do app.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launch({ port = 9333, width = 390, height = 844, scale = 2 } = {}) {
  const profile = join(tmpdir(), 'conkat-shots-profile-' + Date.now());
  const proc = spawn(EDGE, [
    '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
    '--no-first-run', '--disable-gpu', '--disable-extensions', '--mute-audio',
    `--window-size=${width},${height}`, 'about:blank',
  ], { stdio: 'ignore' });
  let targets;
  for (let i = 0; i < 60; i++) {
    try { targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (targets.some((t) => t.type === 'page')) break; } catch {}
    await sleep(500);
  }
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { const { r, j } = pending.get(m.id); pending.delete(m.id); m.error ? j(new Error(m.error.message)) : r(m.result); }
    else if (m.method) for (const l of listeners) l(m);
  };
  const send = (method, params = {}) => new Promise((r, j) => { const i = ++id; pending.set(i, { r, j }); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: scale, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });

  const errors = [];
  listeners.push((m) => { if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text); });

  const api = {
    send, errors,
    async eval(expr) {
      const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
      return r.result.value;
    },
    async go(url, wait = 3000) {
      const loaded = new Promise((r) => { const l = (m) => { if (m.method === 'Page.loadEventFired') { listeners.splice(listeners.indexOf(l), 1); r(); } }; listeners.push(l); });
      await send('Page.navigate', { url });
      await Promise.race([loaded, sleep(15000)]);
      await sleep(wait);
      // Esconde as barras de rolagem do navegador de computador (no celular elas não aparecem)
      await api.eval(`(() => { const s = document.createElement('style'); s.textContent = '*::-webkit-scrollbar{display:none!important} *{scrollbar-width:none!important}'; document.head.appendChild(s); })()`);
    },
    /** Acha o elemento visível com esse texto (o mais interno) e devolve o centro dele. */
    async find(text, { exact = true, nth = 0 } = {}) {
      return api.eval(`(() => {
        const want = ${JSON.stringify(text)}; const exact = ${exact};
        const all = [...document.querySelectorAll('body *')].filter((el) => {
          const t = (el.innerText || el.getAttribute('aria-label') || '').trim();
          if (!t) return false;
          const ok = exact ? t === want : t.includes(want);
          if (!ok) return false;
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight;
        });
        const leaves = all.filter((el) => !all.some((o) => o !== el && el.contains(o)));
        const el = leaves[${nth}];
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      })()`);
    },
    async tap(text, opts) {
      const p = await api.find(text, opts);
      if (!p) throw new Error('Não achei na tela: ' + text);
      await api.tapAt(p.x, p.y);
    },
    async tapAt(x, y) {
      for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
      await sleep(900);
    },
    async type(text) { await send('Input.insertText', { text }); await sleep(600); },
    async key(key) {
      const codes = { Enter: 13, Escape: 27, Backspace: 8 };
      for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key, code: key, windowsVirtualKeyCode: codes[key] || 0 });
      await sleep(600);
    },
    async scroll(dy, x = 195, y = 500) {
      await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY: dy });
      await sleep(900);
    },
    async shot(dir, name) {
      mkdirSync(dir, { recursive: true });
      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      writeFileSync(join(dir, name + '.png'), Buffer.from(data, 'base64'));
    },
    async text() { return api.eval('document.body.innerText'); },
    close() { try { ws.close(); } catch {} proc.kill(); },
  };
  return api;
}
