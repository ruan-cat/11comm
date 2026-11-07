# 2026-07-14 App 微信小程序生产构建的 Windows loader 与 Vue shared hoist 事故

## 1. 问题现象

在 Windows 本地执行 `pnpm -F @01s-11comm/app build:mp:prod` 时，第一次失败为 Node ESM loader 把 `D:\...` 盘符路径识别成不支持的 `d:` 协议。修复构建入口后，第二次失败变成：

```log
"looseToNumber" is not exported by "../../node_modules/.pnpm/@vue+shared@3.0.5/node_modules/@vue/shared/dist/shared.esm-bundler.js"
```

这导致微信小程序生产产物 `apps/app/dist/build/mp-weixin` 无法生成。

## 2. 实际根因

第一层根因是 `build:mp:prod` 仍使用裸 `uni build -p mp-weixin --mode production`，没有复用 `build:h5:prod` 已验证过的 Windows-only path loader 注册入口。

第二层根因是 `miniprogram-ci@2.1.31` 引入 `@vue/reactivity@3.0.5 -> @vue/shared@3.0.5`，仓库启用 hoist 后根 `node_modules/@vue/shared` 指向旧版 `3.0.5`。uni 小程序构建阶段解析到了这个旧版，而 `@dcloudio/uni-mp-vue@3.0.0-5000520260324001` 实际需要包含 `looseToNumber` 的 `@vue/shared@3.4.21`。

## 3. 关键误导点

`@dcloudio/uni-mp-vue` 包自身的依赖没有坏；从该包位置用 Node `createRequire()` 解析 `@vue/shared` 能得到 `3.4.21`。误导点在于普通 Node 解析看起来正常，但 Rollup/uni 构建上下文受根 hoist 影响，实际命中了根部旧版本。

另一个误导点是容易把问题归为新增 `miniprogram-ci` 本身不能安装。真正需要修的是 app 构建上下文的依赖解析，不是手改 `node_modules` 或全局覆盖所有 Vue 内部包版本。

## 4. 有效修复

将 `apps/app/package.json` 的 `build:mp:prod` 改为复用 Windows path loader 注册入口：

```bash
node --import ./scripts/register-window-path-loader.js node_modules/@dcloudio/vite-plugin-uni/bin/uni.js build -p mp-weixin --mode production
```

同时在 `apps/app` 的 devDependencies 中显式加入 `@vue/shared@3.4.21`，让 app 构建上下文优先解析到 DCloud 小程序运行时需要的 Vue shared 版本。这个做法比 workspace 全局 override `@vue/shared` 更窄，也避免强行改 `miniprogram-ci` 旧 Vue reactivity 链路的内部依赖。

## 5. 验证方式

修复后已验证：

```bash
pnpm -F @01s-11comm/app exec node -e "const pkg=require('@vue/shared/package.json'); console.log(require.resolve('@vue/shared/package.json')); console.log(pkg.version); console.log('looseToNumber' in require('@vue/shared'))"
pnpm -F @01s-11comm/app build:mp:prod
pnpm -F @01s-11comm/app build:h5:prod
pnpm -F @01s-11comm/app build:vercel
pnpm -F @01s-11comm/app type-check
```

构建后还扫描了 `apps/app/dist/build/mp-weixin`，确认产物存在、包含 `app.json`、`app.js`、`app.wxss`、`project.config.json`，request base URL 指向 `https://01s-11-server.ruan-cat.com`，且没有 `laf`、`WECHAT_MP_SECRET`、`session_key`、私钥或 token 关键字残留。

## 6. 后续约束

后续 agent 不要把 `build:mp:prod` 改回裸 `uni build -p mp-weixin --mode production`。如果新增或升级 `miniprogram-ci`、uni-app、Vue、pnpm hoist 配置，必须重新验证：

```bash
pnpm -F @01s-11comm/app build:mp:prod
pnpm -F @01s-11comm/app build:h5:prod
pnpm -F @01s-11comm/app build:vercel
```

遇到 `looseToNumber`、`@vue/shared` 或 Vue 内部包导出错误时，先检查根 `node_modules/@vue/shared`、`apps/app/node_modules/@vue/shared` 和 `pnpm -F @01s-11comm/app why @vue/shared`，不要只看单个包的 `package.json`。
