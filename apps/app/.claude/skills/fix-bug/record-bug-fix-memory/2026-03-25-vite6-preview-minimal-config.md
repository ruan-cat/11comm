# 2026-03-25 vite@6 preview 最小改动经验
## 1. 问题现象

在 `.worktrees/vite8-preview` 里实验 `vite@6.4.1` 时，为了让 H5 构建和本地预览通过，曾一度把 `vite.config.ts` 改成大规模动态导入和环境兜底版本。这一版虽然能帮助定位问题，但不适合长期保留在公共配置文件里。

## 2. 实际根因

真正需要处理的不是“整个 `vite.config.ts` 必须重写”，而是两个更小的边界问题：

1. 纯 `vite preview` 不会经过 uni CLI 的 `initEnv`，所以相关环境变量要在命令入口就提前注入。
2. `vite preview` 在 Vite 语义里仍属于 `serve`，会误带开发态 `mockDevServerPlugin`，从而触发 `vite-plugin-mock-dev-server` 在 `vite@6` 下的兼容异常。

## 3. 关键误导点

“大改配置后跑通了”很容易误导人把诊断方案当成最终方案。实际上：

1. 动态导入和配置兜底更适合缩小排查范围。
2. 一旦根因确认，就应该把改动收回到脚本层和单点条件分支。
3. `vite.config.ts` 这类公共配置文件，默认应优先保留原注释、原顺序和原阅读路径。

## 4. 更合适的最小改动

优先采用以下更小的补丁组合：

1. `package.json` 的 `preview:h5` 脚本注入：
   - `VITE_PREVIEW=true`
   - `VITE_ROOT_DIR=.`
   - `UNI_INPUT_DIR=src`
   - `UNI_PLATFORM=h5`
2. `vite.config.ts` 只保留两处小补丁：
   - 构建态 `mockDevServerPlugin` 设置 `enabled: false`
   - 预览态通过 `VITE_PREVIEW=true` 跳过开发态 mock 插件
3. 配置文件主体结构尽量保持接近原始版本，不再为了 preview 单独重写成大规模动态导入版

## 5. 验证要求

这类经验写入前，至少要独立验证三条链路：

1. `pnpm build:h5`
2. `pnpm exec vitest run --config vitest.config.ts src/pages/work-dashboard/tests/menu-config.test.ts`
3. `preview:h5` 对目标端口返回 `200`，且首页 HTML 包含 `<title>`

## 6. 后续约束

1. 遇到 worktree 内的高版本 Vite 兼容问题时，先从脚本注入环境变量和单点条件分支入手。
2. 如果为了诊断临时大改了 `vite.config.ts`，根因确认后必须回收到最小改动版本。
3. 没有充分理由时，不要为了单个实验链路重写整个配置文件。
