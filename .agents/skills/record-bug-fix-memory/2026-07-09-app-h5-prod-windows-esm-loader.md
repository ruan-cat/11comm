# 2026-07-09 App H5 生产构建的 Windows ESM loader 路径事故

## 1. 问题现象

在 Windows 本地执行 `pnpm -F @01s-11comm/app build:h5:prod` 时，uni-app/Vite 构建链在动态导入 Windows 绝对路径时失败。关键报错是 Node 默认 ESM loader 不支持 `d:` 这类 scheme：

```log
Only URLs with a scheme in: file, data, and node are supported by the default ESM loader.
On Windows, absolute paths must be valid file:// URLs. Received protocol 'd:'
```

## 2. 实际根因

Uni/Vite 构建链在 Windows 下会把类似 `D:\...` 的绝对路径作为 ESM specifier 传给 Node。较新的 Node ESM loader 会把盘符 `D:` 当成 URL scheme，而不是本地文件路径，因此拒绝解析。

这不是页面代码、环境变量或 Vercel 输出目录本身的问题，首个可信信号来自 `build:h5:prod` 的 fresh 构建输出。

## 3. 关键误导点

历史上这个链路曾使用 `--experimental-loader ./scripts/window-path-loader.js` 解决 Windows 本地构建，但该方案会产生 Node experimental warning，并且曾和 Vercel 输出目录搬运问题混在一起被回退。误导点在于容易把问题误判为“loader 会破坏 Vercel 构建”，而不是区分本地 Windows 路径修复与 Linux/Vercel 输出链路。

另一个容易绕路的点是把 `build:h5:prod` 改回裸 `uni build --mode production`。这样可以减少命令复杂度，但会重新暴露 Windows 绝对路径 ESM 解析失败。

## 4. 有效修复

新增 `apps/app/scripts/register-window-path-loader.js`，使用 `node:module.register()` 只在 `process.platform === "win32"` 时注册已有的 `window-path-loader.js`。

同时把 `apps/app/package.json` 中的 `build:h5:prod` 调整为：

```bash
node --import ./scripts/register-window-path-loader.js node_modules/@dcloudio/vite-plugin-uni/bin/uni.js build --mode production
```

这个入口让 Windows 本地构建获得路径转换能力，同时让 Linux/Vercel CI 保持 Node 默认 ESM 解析，不注册额外 loader。

## 5. 验证方式

修复后已验证：

```bash
pnpm -F @01s-11comm/app build:h5:prod
pnpm -F @01s-11comm/app lint:fix
pnpm -F @01s-11comm/app build:vercel
git diff --check
```

其中 `build:vercel` 会复用 `build:h5:prod`，再执行 `move-vercel-output-to-root --source-dir dist/build/h5 --target-dir .vercel/output`，用于确认 Windows loader 兼容层没有破坏 Vercel 静态产物搬运链路。

## 6. 后续约束

后续 agent 不要把 `apps/app` 的 `build:h5:prod` 简单改回 `uni build --mode production`，也不要为了“看起来更直接”改回 `--experimental-loader`。

如果必须修改这条构建链路，至少同时验证：

```bash
pnpm -F @01s-11comm/app build:h5:prod
pnpm -F @01s-11comm/app build:vercel
```

相关决策说明已经同步写入 `apps/app/README.md`，未来排查时应先读 README 中的 `build:h5:prod` Windows 路径兼容决策小节。
