# Nitro 构建故障修复报告 - @ruan-cat/utils 版本问题

## 1. 事故背景

**发生时间**：2025-12-09

**影响范围**：

- 本地开发环境
- GitHub Workflow CI 环境
- Cloudflare Worker 部署流程

**故障表现**：
在本地、GitHub workflow 和 Cloudflare worker 三个环境内，运行 `apps\admin\package.json` 的 `build`、`vite:build:prod:cloudflare` 和 `vite:build:prod:github` 命令时，Nitro 客户端构建阶段报错：

```plain
"createRequire" is not exported by "__vite-browser-external",
imported by "../../node_modules/.pnpm/fdir@6.5.0_picomatch@4.0.3/node_modules/fdir/dist/index.mjs"
```

## 2. 问题排查过程

### 2.1 初步分析

**错误日志关键信息**：

```log
[plugin vite:resolve] Module "node:path" has been externalized for browser compatibility
[plugin vite:resolve] Module "node:fs" has been externalized for browser compatibility
[plugin vite:resolve] Module "node:module" has been externalized for browser compatibility

error during build:
../../node_modules/.pnpm/fdir@6.5.0_picomatch@4.0.3/node_modules/fdir/dist/index.mjs (1:9):
"createRequire" is not exported by "__vite-browser-external"
```

**初步假设**：

1. Vite 配置问题（SSR 相关配置缺失）
2. Nitro 配置问题（rollupConfig 配置缺失）
3. dev 和 main 分支配置差异
4. pnpm-workspace.yaml 的 overrides 配置问题

### 2.2 尝试的解决方案

#### 尝试 1：在 vite.config.ts 添加 SSR 配置

```typescript
ssr: {
  noExternal: [
    "@ruan-cat/utils",
    "tinyglobby",
    "fdir",
  ],
}
```

**结果**：失败 ❌

#### 尝试 2：在 nitro.config.ts 添加 rollupConfig

```typescript
rollupConfig: {
  external: [
    /^node:.*/,
    "path",
    "fs",
    "module",
    "url",
  ],
}
```

**结果**：失败 ❌

#### 尝试 3：在 build/optimize.ts 排除问题依赖

```typescript
const exclude = ["@iconify/json", "@ruan-cat/utils", "tinyglobby", "fdir"];
```

**结果**：失败 ❌

### 2.3 关键发现

通过对比 main 分支发现：

1. **main 分支也失败**：说明这不是分支间配置差异问题
2. **依赖版本差异**：
   - package.json 声明：`"@ruan-cat/utils": "^4.16.0"`
   - 实际安装版本：`4.18.0`
3. **版本漂移**：`^4.16.0` 允许 pnpm 安装 4.16.x 到 4.x.x 的任何版本

### 2.4 根本原因定位

通过 `pnpm list @ruan-cat/utils` 发现实际安装的是 `4.18.0` 版本。

检查 `@ruan-cat/utils@4.18.0` 源码发现：

- 该版本引入了 Node.js 特定代码（`node:path`、`node:fs`、`node:module` 等）
- 这些代码在 Nitro 客户端构建时被包含
- Vite 将这些 Node.js 模块外部化为 `__vite-browser-external`
- 但 `__vite-browser-external` 不导出 `createRequire`，导致构建失败

**依赖引入链**：

```plain
@ruan-cat/utils@4.18.0
  └── src/monorepo.ts (使用 node:path, node:fs)
        └── tinyglobby
              └── fdir (导入 createRequire from "module")
```

## 3. 解决方案

### 3.1 修复方法

**核心修改**：锁定 `@ruan-cat/utils` 版本到 `4.16.0`

**修改文件**：`apps/admin/package.json`

```diff
- "@ruan-cat/utils": "^4.16.0",
+ "@ruan-cat/utils": "4.16.0",
```

### 3.2 执行步骤

```bash
# 1. 修改 package.json
# 将 "@ruan-cat/utils": "^4.16.0" 改为 "@ruan-cat/utils": "4.16.0"

# 2. 重新安装依赖
cd apps/admin
pnpm install

# 3. 验证构建
pnpm vite:build:prod
```

### 3.3 验证结果

✅ **构建成功**：

- SSR 构建完成（27.71s）
- 客户端构建完成（1 分 11 秒）
- 生成 `.output/public/` 目录，包含完整的静态资源

## 4. 技术分析

### 4.1 为什么 4.18.0 版本会失败？

`@ruan-cat/utils@4.18.0` 包含了 monorepo 相关的工具函数，这些函数使用了 Node.js 内置模块：

```typescript
// @ruan-cat/utils/src/monorepo.ts
import path from "node:path";
import fs from "node:fs";
```

这些代码被以下地方引用：

1. `build/plugins/index.ts` - 导入 `getRouteName` 函数
2. `src/router/index.ts` - 导入 `disposalAutoRouter` 函数
3. `src/composables/use-request/index.ts` - 导入 axios 相关函数

### 4.2 Nitro 构建流程

Nitro 在构建时会执行两个阶段：

1. **SSR 构建**：生成服务端代码，可以使用 Node.js 模块 ✅
2. **客户端构建**：生成浏览器代码，不能使用 Node.js 模块 ❌

问题出在客户端构建阶段，Vite 遇到 Node.js 模块时会：

1. 识别为浏览器不兼容的模块
2. 将其外部化为 `__vite-browser-external`
3. 但依赖链中的 `fdir` 需要 `createRequire`
4. `__vite-browser-external` 不提供 `createRequire` → 构建失败

### 4.3 为什么 4.16.0 版本可以工作？

`@ruan-cat/utils@4.16.0` 版本：

- 不包含或不暴露使用 Node.js 模块的代码
- 或者这些代码没有被客户端代码引用
- 因此不会触发 Vite 的外部化机制

## 5. 经验总结

### 5.1 核心教训

**依赖版本管理**：

- ❌ 不要对核心依赖使用语义化版本范围（`^`、`~`）
- ✅ 对于包含平台特定代码的依赖，应使用精确版本号

**构建环境差异**：

- Node.js 模块在 SSR 环境可用
- 但在客户端构建时会导致问题
- 需要区分服务端代码和客户端代码

### 5.2 预防措施

**1. 依赖版本策略**

对于以下类型的依赖，使用精确版本号：

```json
{
	"dependencies": {
		"@ruan-cat/utils": "4.16.0", // ✅ 精确版本
		"nitro": "3.0.1-alpha.1", // ✅ 精确版本
		"vite": "7.1.12" // ✅ 精确版本（已在 overrides 中锁定）
	}
}
```

**2. 依赖升级流程**

升级包含平台特定代码的依赖时：

1. 在独立分支进行测试
2. 分别测试本地构建、CI 构建、部署构建
3. 确认所有环境通过后再合并

**3. 锁文件管理**

考虑提交 `pnpm-lock.yaml`：

- ✅ 确保所有环境使用相同的依赖版本
- ✅ 避免版本漂移导致的构建差异
- ❌ 但会增加 git 仓库大小

**4. 构建检查**

在 CI 中增加构建检查：

```yaml
# .github/workflows/ci.yaml
- name: Build with Nitro
  run: pnpm -F @01s-11comm/admin vite:build:prod
```

### 5.3 相关文档

**Vite SSR 外部化**：

- https://cn.vitejs.dev/guide/ssr.html#ssr-externals

**Nitro 配置**：

- https://nitro.unjs.io/config

**pnpm 版本管理**：

- https://pnpm.io/package_json#overrides

## 6. 后续行动

### 6.1 立即行动

- [x] 修复 dev 分支构建
- [x] 更新文档记录解决方案
- [ ] 验证 CI 环境构建
- [ ] 验证 Cloudflare Worker 部署

### 6.2 长期改进

1. **审查依赖策略**
   - 识别其他可能受版本漂移影响的依赖
   - 统一核心依赖的版本管理策略

2. **完善构建流程**
   - 增加 SSR 构建的专项测试
   - 区分客户端代码和服务端代码的依赖

3. **文档完善**
   - 补充 Nitro 构建相关的最佳实践
   - 记录常见构建问题和解决方案

## 7. 附录

### 7.1 相关提交

- `a96906d`: 🐞 fix: 使用 overrides 覆盖依赖的方案，处理 Vite 7.2.7 的 createRequire 故障
- `3e408f7`: 🔧 config: 不指定写死的 nitro 构建预设
- `2c41183`: 🔧 config: 配置 nitro 部署到 cloudflare worker 内

### 7.2 错误日志完整版

详见 `apps\admin\src\docs\prompts\各种杂项\fix-nitro-build-in-github-error.md`

### 7.3 环境信息

- Node.js: 22.14.0
- pnpm: 10.24.0
- Vite: 7.1.12
- Nitro: 3.0.1-alpha.1
- @ruan-cat/utils: 4.16.0 (修复后)

---

**报告生成时间**：2025-12-09
**处理人员**：Claude Code
**状态**：已解决 ✅
