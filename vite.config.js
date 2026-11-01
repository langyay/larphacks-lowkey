import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const SERVER_PORT = 8787
const serverDir = path.resolve(import.meta.dirname, 'server')

// Is something already answering on the server's port?
const portInUse = (port) =>
  new Promise((resolve) => {
    const socket = net.connect(port, '127.0.0.1')
    socket.once('connect', () => resolve(socket.end() || true))
    socket.once('error', () => resolve(false))
  })

// `npm run dev` also starts our API server (/server), so one command runs
// everything. Skipped if the server is already running on its own.
function startApiServer() {
  return {
    name: 'lowkey-start-api-server',
    apply: 'serve',
    async configureServer(vite) {
      if (await portInUse(SERVER_PORT)) return
      if (!existsSync(path.join(serverDir, 'node_modules'))) {
        console.warn('\n  Lowkey server not started: run "npm install" first.\n')
        return
      }
      const child = spawn(process.execPath, ['--env-file-if-exists=../.env', 'index.js'], {
        cwd: serverDir,
        stdio: 'inherit',
        // Force the port: a PORT meant for the app (e.g. 5173) must not leak in.
        env: { ...process.env, PORT: String(SERVER_PORT) },
      })
      const stop = () => child.kill()
      vite.httpServer?.once('close', stop)
      process.once('exit', stop)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), startApiServer()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    // While developing, send /api requests to our server on port 8787.
    proxy: { '/api': `http://localhost:${SERVER_PORT}` },
  },
})
