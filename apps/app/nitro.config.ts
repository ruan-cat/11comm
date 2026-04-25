import path from 'node:path'
import process from 'node:process'
import { defineConfig } from 'nitro'
import { loadEnv } from 'vite'
import { resolve11CommNitroServerBaseUrl } from './src/config/project-domains'

const nitroMode = process.env.NITRO_APP_MODE || 'development-nitro-api'
const envDir = path.resolve(process.cwd(), 'env')
const loadedEnv = loadEnv(nitroMode, envDir, '')

for (const [key, value] of Object.entries(loadedEnv)) {
  if (!(key in process.env)) {
    process.env[key] = value
  }
}

const nitroPort = Number.parseInt(process.env.NITRO_PORT || '3101', 10)

export default defineConfig({
  serverDir: './server',
  ignore: ['modules/**/*'],
  devServer: {
    port: nitroPort,
    watch: ['./server/**/*.ts'],
  },
  runtimeConfig: {
    nitroDataSource: process.env.NITRO_DATA_SOURCE || 'mock',
    public: {
      apiRuntime: process.env.VITE_API_RUNTIME || 'nitro-standalone',
      serverBaseUrl: process.env.VITE_SERVER_BASEURL || resolve11CommNitroServerBaseUrl(),
    },
  },
  routeRules: {
    '/__nitro/**': {
      cors: true,
    },
    '/app/**': {
      cors: true,
    },
    '/callComponent/**': {
      cors: true,
    },
  },
  handlers: [
    {
      route: '/app/**',
      handler: './server/handlers/legacy-dispatch',
    },
    {
      route: '/callComponent/**',
      handler: './server/handlers/legacy-dispatch',
    },
  ],
  alias: {
    '@': path.resolve(process.cwd(), 'src'),
    'server': path.resolve(process.cwd(), 'server'),
  },
})
