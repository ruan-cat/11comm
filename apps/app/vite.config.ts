import path from 'node:path'
import process from 'node:process'
import Uni from '@uni-helper/plugin-uni'
import Components from '@uni-helper/vite-plugin-uni-components'
/** @see https://wot-ui.cn/guide/quick-use.html#基于-vite-配置自动引入组件方案-2 */
import { WotResolver } from '@uni-helper/vite-plugin-uni-components/resolvers'
// @see https://uni-helper.js.org/vite-plugin-uni-layouts
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
// @see https://github.com/uni-helper/vite-plugin-uni-manifest
import UniManifest from '@uni-helper/vite-plugin-uni-manifest'
// @see https://uni-helper.js.org/vite-plugin-uni-pages
import UniPages from '@uni-helper/vite-plugin-uni-pages'
// @see https://github.com/uni-helper/vite-plugin-uni-platform
// 需要与 @uni-helper/vite-plugin-uni-pages 插件一起使用
import UniPlatform from '@uni-helper/vite-plugin-uni-platform'
/**
 * 分包优化、模块异步跨包调用、组件异步跨包引用
 * @see https://github.com/uni-ku/bundle-optimizer
 */
import Optimization from '@uni-ku/bundle-optimizer'
// https://github.com/uni-ku/root
import UniKuRoot from '@uni-ku/root'
import dayjs from 'dayjs'
import { nitro } from 'nitro/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server'
import ViteRestart from 'vite-plugin-restart'

/** Mock compiler only needs the local aliases referenced by `src/api/mock` and `server/**`. */
function createMockRuntimeAliasEntries(root: string) {
  return [
    { find: '@', replacement: path.join(root, './src') },
    { find: '@img', replacement: path.join(root, './src/static/images') },
  ]
}

/**
 * Narrow aliases only while `vite-plugin-mock-dev-server` snapshots config.
 * This keeps the mock compiler away from extra Vite/uni aliases, then restores them immediately.
 */
function createMockRuntimeAliasLifecycle() {
  let originalAliases: any

  return {
    prepare: {
      name: 'mock-runtime-alias-prepare',
      apply: 'serve' as const,
      enforce: 'pre' as const,
      configResolved(config) {
        originalAliases = config.resolve.alias
        config.resolve.alias = createMockRuntimeAliasEntries(config.root)
      },
    },
    restore: {
      name: 'mock-runtime-alias-restore',
      apply: 'serve' as const,
      enforce: 'post' as const,
      configResolved(config) {
        if (originalAliases) {
          config.resolve.alias = originalAliases
        }
      },
    },
  }
}

// https://vitejs.dev/config/
export default ({ command, mode }) => {
  // @see https://unocss.dev/
  // const UnoCSS = (await import('unocss/vite')).default
  // console.log(mode === process.env.NODE_ENV) // true

  // mode: 区分生产环境还是开发环境
  // pnpm dev:h5 => serve development
  // pnpm build:h5 => build production
  // pnpm dev:mp-weixin => build development（注意 command 仍然是 build）
  // pnpm build:mp-weixin => build production
  // pnpm dev:app => build development（注意 command 仍然是 build）
  // pnpm build:app => build production
  const { UNI_PLATFORM } = process.env
  console.log('UNI_PLATFORM -> ', UNI_PLATFORM) // 常见值：mp-weixin、h5、app

  const env = loadEnv(mode, path.resolve(process.cwd(), 'env'))
  const {
    VITE_APP_PORT,
    VITE_SERVER_BASEURL,
    VITE_DELETE_CONSOLE,
    VITE_SHOW_SOURCEMAP,
    VITE_APP_PUBLIC_BASE,
    VITE_APP_PROXY_ENABLE,
    VITE_APP_PROXY_PREFIX,
    VITE_API_RUNTIME,
    NITRO_PORT,
  } = env
  console.log('环境变量 env -> ', env)

  const isMockRuntime = !VITE_API_RUNTIME || VITE_API_RUNTIME === 'mock'
  const isNitroViteRuntime = VITE_API_RUNTIME === 'nitro-vite'
  const mockRuntimeAliasLifecycle = createMockRuntimeAliasLifecycle()

  return defineConfig({
    envDir: './env', // 自定义 env 目录
    base: VITE_APP_PUBLIC_BASE,
    plugins: [
      UniPages({
        exclude: ['**/components/**/**.*'],
        // `pages` 目录固定为 `src/pages`，分包页面由 `src/pages-sub` 注入
        subPackages: ['src/pages-sub'],
        dts: 'src/types/uni-pages.d.ts',
      }),
      UniLayouts(),
      UniPlatform(),
      UniManifest(),
      // Uni 系列插件需要在 Uni() 之前注册
      {
        // 临时规避 dcloud 官方 @dcloudio/uni-mp-compiler 的编译问题
        // 参考：https://github.com/dcloudio/uni-app/issues/4952
        name: 'fix-vite-plugin-vue',
        configResolved(config) {
          const plugin = config.plugins.find(p => p.name === 'vite:vue')
          if (plugin && plugin.api && plugin.api.options) {
            plugin.api.options.devToolsEnabled = false
          }
        },
      },
      UnoCSS(),
      AutoImport({
        imports: ['vue', 'uni-app'],
        dts: 'src/types/auto-import.d.ts',
        dirs: ['src/hooks'], // 自动导入 hooks
        vueTemplate: true, // default false
      }),
      // Optimization 依赖 pages.json，顺序必须在 UniPages 之后
      Optimization({
        enable: {
          'optimization': true,
          'async-import': true,
          'async-component': true,
        },
        dts: {
          base: 'src/types',
        },
        logger: false,
      }),
      ViteRestart({
        // 修改 Vite 主配置时自动重启开发服务器（与仓库实际文件名一致）
        restart: ['vite.config.ts', 'vite.config.js'],
      }),
      isNitroViteRuntime && nitro(),

      // 开发态保留 mock 服务；preview 预览态禁用，避免 vite@6 下触发 mock 插件兼容异常
      command === 'serve'
      && isMockRuntime
      && process.env.VITE_PREVIEW !== 'true'
      && mockRuntimeAliasLifecycle.prepare,
      command === 'serve'
      && isMockRuntime
      && process.env.VITE_PREVIEW !== 'true'
      && mockDevServerPlugin({
        dir: 'src/api/mock',
        /**
         * mock 文件变更后插件会重载内存中的路由与数据；默认不向浏览器发信号。
         * `reload: true` 在 mock:update-end 时通过 Vite WS 触发 full-reload，便于立刻看到新接口行为。
         * @see https://github.com/pengzhanbo/vite-plugin-mock-dev-server/blob/main/README.md#reload
         */
        reload: true,
      }),
      command === 'serve'
      && isMockRuntime
      && process.env.VITE_PREVIEW !== 'true'
      && mockRuntimeAliasLifecycle.restore,
      // 构建态临时关闭 mock 产物生成，规避 vite@6 实验链路下的尾部兼容异常
      command === 'build'
      && isMockRuntime
      && mockDevServerPlugin({
        dir: 'src/api/mock',
        enabled: false,
        build:
          mode === 'production'
            ? {
                dist: 'mock',
              }
            : false,
      }),

      // h5 环境增加 BUILD_TIME
      UNI_PLATFORM === 'h5'
      && {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace('%BUILD_TIME%', dayjs().format('YYYY-MM-DD HH:mm:ss'))
        },
      },
      // 打包分析插件：仅 h5 + 生产环境启用
      UNI_PLATFORM === 'h5'
      && mode === 'production'
      && visualizer({
        filename: './node_modules/.cache/visualizer/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
      Components({
        extensions: ['vue'],
        deep: true, // 递归扫描组件目录
        directoryAsNamespace: false, // 不把目录名合并进组件名
        dts: 'src/types/components.d.ts', // 自动生成组件类型声明
        resolvers: [WotResolver()],
      }),
      // 若存在会改写 pages.json 的插件，UniKuRoot 需要放在其后
      UniKuRoot(),
      Uni(),
    ],
    define: {
      __UNI_PLATFORM__: JSON.stringify(UNI_PLATFORM),
      __VITE_APP_PROXY__: JSON.stringify(VITE_APP_PROXY_ENABLE),
    },
    css: {
      postcss: {
        plugins: [
          // autoprefixer({
          //   overrideBrowserslist: ['> 1%', 'last 2 versions'],
          // }),
        ],
      },
    },

    resolve: {
      alias: {
        '@': path.join(process.cwd(), './src'),
        '@img': path.join(process.cwd(), './src/static/images'),
      },
    },
    server: {
      host: '0.0.0.0',
      hmr: true,
      port: Number.parseInt(VITE_APP_PORT, 10),
      open: true,
      // 仅 H5 开发服务器需要代理，其它端通常直接走 build 流程
      proxy: isMockRuntime && JSON.parse(VITE_APP_PROXY_ENABLE)
        ? {
            [VITE_APP_PROXY_PREFIX]: {
              target: VITE_SERVER_BASEURL,
              changeOrigin: true,
              rewrite: path => path.replace(new RegExp(`^${VITE_APP_PROXY_PREFIX}`), ''),
            },
          }
        : undefined,
    },
    nitro: {
      serverDir: './server',
      ignore: ['modules/**/*'],
      devServer: {
        port: Number.parseInt(NITRO_PORT || '3101', 10),
      },
    },
    esbuild: {
      drop: VITE_DELETE_CONSOLE === 'true' ? ['console', 'debugger'] : ['debugger'],
    },
    build: {
      sourcemap: false,
      // sourcemap: VITE_SHOW_SOURCEMAP === 'true',
      target: 'es6',
      // 开发环境不压缩
      minify: mode === 'development' ? false : 'esbuild',
    },
  })
}
