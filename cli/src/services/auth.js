import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { logger } from '../utils/logger.js';
import ora from 'ora';

const KRESH_DIR = path.join(os.homedir(), '.kresh');
const CONFIG_FILE = path.join(KRESH_DIR, 'config.json');

export function getToken() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      return config.token || null;
    }
  } catch (err) {
    // ignore
  }
  return null;
}

export function setToken(token) {
  try {
    if (!fs.existsSync(KRESH_DIR)) {
      fs.mkdirSync(KRESH_DIR, { recursive: true });
    }
    const config = fs.existsSync(CONFIG_FILE) ? JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')) : {};
    config.token = token;
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    logger.error('Failed to save config: ' + err.message);
  }
}

function openBrowser(url) {
  const startCmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${startCmd} "${url}"`, (err) => {
    if (err) {
      logger.warn(`Could not open browser automatically. Please visit: ${url}`);
    }
  });
}

export async function cliAuthFlow() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      if (url.pathname === '/callback') {
        const token = url.searchParams.get('token');
        if (token) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <head><title>Kresh CLI Authenticated</title></head>
              <body style="font-family: monospace; padding: 2rem; text-align: center; background: #000; color: #fff;">
                <h2 style="color: #4ade80;">Success!</h2>
                <p>The Kresh CLI has been authenticated. You can close this window and return to your terminal.</p>
              </body>
            </html>
          `);
          
          setToken(token);
          
          setTimeout(() => {
            server.close();
            resolve(token);
          }, 500);
        } else {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Missing token in callback.');
          server.close();
          reject(new Error('Missing token'));
        }
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      const baseUrl = process.env.KRESH_API_URL || 'https://kresh.vercel.app';
      const authUrl = `${baseUrl}/cli/auth?port=${port}`;
      
      const spinner = ora('Opening browser for authentication...').start();
      openBrowser(authUrl);
      spinner.succeed(`Waiting for authentication... (if browser doesn't open, visit ${authUrl})`);
    });
    
    server.on('error', (err) => {
      reject(err);
    });
  });
}
