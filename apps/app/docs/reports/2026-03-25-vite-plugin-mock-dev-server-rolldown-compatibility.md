# 2026-03-25 vite-plugin-mock-dev-server 与 Rolldown 兼容性排查报告

## 1. 背景

本报告只记录隔离实验工作树 `.worktrees/vite8-preview` 内的结论，用于回答两个问题：

1. `vite-plugin-mock-dev-server` 是否存在 Rolldown / 高版本 Vite 兼容边界。
2. 当前 `uni-app` 主插件链下，`vite@6`、`vite@7`、`vite@8` 能否完成 H5 构建与本地预览。

## 2. 结论

截至 `2026-03-25`，当前实验结论如下：

1. `vite-plugin-mock-dev-server` 不是“完全没有 Rolldown 适配”，它已经在 `2.x` 版本里持续补过 Rolldown 兼容。
2. 但它在当前项目组合下，仍然会放大高版本 Vite 的兼容风险，尤其是 build 阶段的 mock 产物生成链路。
3. `vite@8` 目前不可行，`vite@7` 仍不可用，`vite@6.4.1` 可以通过最小补丁继续推进。
4. 当前 worktree 内，`vite@6.4.1` 已经实证可完成：
   - `pnpm build:h5`
   - `pnpm exec vitest run --config vitest.config.ts src/pages/work-dashboard/tests/menu-config.test.ts`
   - `pnpm exec vite preview --host 127.0.0.1 --port 43181 --outDir dist/build/h5`
5. 因此，当前最准确的表述不是“主链已经完全支持 Vite 6+”，而是“在实验 worktree 内，`vite@6` 可以通过受控补丁完成 H5 build 与本地 preview”。

## 3. 上游证据

### 3.1. `vite-plugin-mock-dev-server` 已明确适配过 Rolldown

公开信息显示，该插件并非完全未适配 Rolldown：

1. `vite-plugin-mock-dev-server@2.1.0` 的 `peerDependencies` 已声明：
   - `vite >=5.0.0`
   - `rolldown >=1.0.0-beta.1`
2. 官方 `CHANGELOG` 已明确记录多次 Rolldown 相关修复：
   - `2.0.0`: `rolldown support`
   - `2.0.2`: `move define to transform.define in rolldown`
   - `2.0.3`: `update aliasPlugin import to use viteAliasPlugin`

### 3.2. 公开 issue 说明兼容面仍在波动

仓库公开 issue 中，Rolldown / Vite 7 相关问题并未完全消失：

1. `#125`：`vite@7` 下的兼容问题。
2. `#132`：Rolldown 中 `aliasPlugin` 重命名为 `viteAliasPlugin`，后在 `2.0.3` 修复。
3. `#142`：`rolldown-vite@7.2.5` 组合下仍有告警，且被关闭为 `not_planned`。

这说明该插件在“有适配”与“完全稳定”之间，当前更接近前者。

## 4. 本地实验过程

### 4.1. `vite@8.0.2`

结果：失败。

现象：

1. `pnpm build:h5` 无法完成。
2. 错误首先落在 `pages.json` 与 `z-paging` 的 JSON 资源解析链路。
3. 这说明问题不再只是 mock 插件本身，而是 uni-app 主插件链整体尚未跟上 Vite 8。

### 4.2. `vite@7.3.1`

结果：失败。

现象：

1. `vitest@4.1.1` 可运行。
2. `pnpm build:h5` 最终仍失败，错误落在 `ViteAlias` / Rolldown / 插件转换链路。

### 4.3. `vite@6.4.1` 初始状态

结果：部分可用，但不完整。

现象：

1. `vitest@4.1.1` 可运行。
2. `pnpm build:h5` 主体流程接近完成，但尾部会被 `vite-plugin-mock-dev-server` 相关链路打断。
3. 直接执行 `vite preview` 时，又会暴露出 uni 生态插件在“脱离 uni CLI 环境初始化”后的额外问题。

## 5. 根因拆解

### 5.1. `vite-plugin-mock-dev-server` 的 build 链路会放大兼容问题

在 `vite@6.4.1` 下，worktree 中把 build 阶段 mock 产物生成关闭后，`pnpm build:h5` 才能稳定通过。

当前采用的最小补丁是：

1. 保留开发态 mock。
2. 对 build 阶段的 `mockDevServerPlugin` 设置 `enabled: false`。

这说明 build 阶段的 mock 产物生成链路，确实是当前实验组合里的高风险点。

### 5.2. `vite preview` 的第一层问题不是构建产物，而是环境初始化

最初直接执行 `vite preview` 时，worktree 里先后遇到这些问题：

1. `@vitejs/plugin-vue-jsx` 老版本与 `vite@6` 的 ESM / require 循环问题。
2. `@uni-ku/bundle-optimizer` 在模块初始化阶段要求 `process.env.VITE_ROOT_DIR` 已存在。
3. `@uni-helper/uni-pages` 依赖的 `@uni-helper/uni-env` 会在导入阶段读取 `UNI_PLATFORM`，如果未提前注入，后续会在 `toUpperCase()` 处报错。

这类问题的共同点是：

1. `uni build` / `uni dev` 会经过 uni CLI 的 `initEnv`。
2. 纯 `vite preview` 不会经过这条初始化链。
3. 所以实验 worktree 的最终收敛方案，不应是大规模改写配置，而应是把环境变量前置到预览命令，并在配置层只保留极小的 preview 条件分支。

### 5.3. `vite preview` 的第二层问题是默认 `outDir` 不对

当上面的初始化问题被解决后，`vite preview` 已经能监听端口，但根路径返回 `404`。

原因也很直接：

1. `vite preview` 默认读取 `dist`。
2. 当前 uni-app H5 构建产物实际位于 `dist/build/h5`。

因此，本地 preview 必须显式加上：

```bash
pnpm exec vite preview --host 127.0.0.1 --outDir dist/build/h5
```

## 6. 当前 worktree 的有效补丁

当前 `.worktrees/vite8-preview` 内，已落地的关键补丁有三类：

1. `vite.config.ts`
   - 保留原有静态导入、插件顺序和主要注释结构。
   - 保留开发态 mock，但在 `VITE_PREVIEW=true` 时跳过开发态 `mockDevServerPlugin`。
   - 对构建态 `mockDevServerPlugin` 设置 `enabled: false`，避免 `vite@6` 组合下的尾部兼容异常。
2. `package.json`
   - 升级到 `vite@6.4.1`、`vitest@^4.1.1`。
   - 增加 `@vitejs/plugin-vue-jsx` override，避免旧版插件在 `vite@6` 下卡在 require cycle。
   - 增加 `preview:h5` 脚本，在命令层注入 `VITE_PREVIEW`、`VITE_ROOT_DIR`、`UNI_INPUT_DIR`、`UNI_PLATFORM`，尽量把补丁收敛在入口脚本。
3. 验证命令
   - build 走 `pnpm build:h5`
   - test 走 `pnpm exec vitest run --config vitest.config.ts src/pages/work-dashboard/tests/menu-config.test.ts`
   - preview 走 `pnpm exec vite preview --host 127.0.0.1 --port 43181 --outDir dist/build/h5`

## 7. 最新验证结果

本报告对应的最新实测结果如下。

### 7.1. H5 构建

命令：

```bash
pnpm build:h5
```

结果：成功。

日志摘要：

```log
DONE  Build complete.
```

补充说明：

1. 构建期间仍会出现大量 UnoCSS 图标加载告警。
2. 这些告警当前不会导致 H5 构建失败。

### 7.2. 工作台测试

命令：

```bash
pnpm exec vitest run --config vitest.config.ts src/pages/work-dashboard/tests/menu-config.test.ts
```

结果：成功。

日志摘要：

```log
Test Files  1 passed (1)
Tests       1 passed (1)
```

### 7.3. 本地预览

命令：

```bash
pnpm exec vite preview --host 127.0.0.1 --port 43181 --outDir dist/build/h5
```

结果：成功。

HTTP 验证结果：

```log
STATUS=200
HAS_TITLE=True
```

补充说明：

1. preview 过程中仍会出现一个 Node 循环依赖 warning。
2. 该 warning 当前没有阻断本地预览。

## 8. 对主仓库的影响

当前结论仍然不支持在主工作区直接升级：

1. 不能把主仓库直接宣布为“已支持 `vite@8`”。
2. 也不能把主仓库直接改成 `vite@7`。
3. `vite@6` 目前只适合在隔离 worktree 中继续推进，尚不适合直接回写主分支。

更稳妥的描述应是：

1. 主仓库继续留在官方主插件链支持范围内。
2. `vite@6` 的实验可以在 `.worktrees/vite8-preview` 中继续演化。
3. 如果后续要把实验结果反向合并回主仓库，必须再做一次主仓库级别的完整回归验证。

## 9. 参考资料

1. 插件 release：<https://github.com/pengzhanbo/vite-plugin-mock-dev-server/releases/tag/v2.1.0>
2. 插件包定义：<https://github.com/pengzhanbo/vite-plugin-mock-dev-server/blob/main/vite-plugin-mock-dev-server/package.json>
3. 插件变更记录：<https://github.com/pengzhanbo/vite-plugin-mock-dev-server/blob/main/CHANGELOG.md>
4. 相关 issue `#125`：<https://github.com/pengzhanbo/vite-plugin-mock-dev-server/issues/125>
5. 相关 issue `#132`：<https://github.com/pengzhanbo/vite-plugin-mock-dev-server/issues/132>
6. 相关 issue `#142`：<https://github.com/pengzhanbo/vite-plugin-mock-dev-server/issues/142>

## 10. 经验教训

### 10.1. 先做最小补丁，不要直接重写 `vite.config.ts`

这次实验里，较大规模地改写 `vite.config.ts` 虽然一度能跑通，但它不是最合适的长期形态。

更稳妥的顺序应当是：

1. 先定位到底是环境变量、命令语义、还是单个插件链路导致失败。
2. 优先把修补点收缩到脚本层或单个条件分支。
3. 只有在无法用小补丁解决时，才考虑大改配置结构。

### 10.2. `vite preview` 的问题优先放到预览脚本解决

对当前 `uni-app` + `vite@6` worktree 来说，`vite preview` 的额外问题主要来自两类：

1. 它不会经过 uni CLI 的 `initEnv`。
2. 它在 Vite 语义里仍属于 `serve`，会意外带上开发态插件链。

因此，更小的修复思路应该是：

1. 在 `preview:h5` 脚本里注入 `VITE_ROOT_DIR`、`UNI_INPUT_DIR`、`UNI_PLATFORM`。
2. 同时注入 `VITE_PREVIEW=true`，让配置层只做非常小的条件分流。
3. `vite.config.ts` 里只保留必要的 preview 特判，而不是整体改成动态导入版本。

### 10.3. 诊断态大改可以接受，但收尾时必须回收

这次已经验证出一个明确约束：

1. 为了快速定位问题，临时把配置改成动态导入和环境兜底是可以接受的。
2. 但一旦根因收敛，就应该尽快回收到更接近原文件的结构。
3. 特别是像 `vite.config.ts` 这种高频配置文件，要优先保留原注释、原插件顺序和原阅读路径，避免后续维护者把“诊断版配置”误当成长期方案。
