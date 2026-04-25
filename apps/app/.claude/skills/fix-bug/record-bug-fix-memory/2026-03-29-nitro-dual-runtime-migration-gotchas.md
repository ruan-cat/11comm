# 2026-03-29 Nitro 双运行时改造与主工作区回填经验

## 1. 问题现象

Nitro 双运行时改造最初是在隔离 `git worktree` 里完成的，但后续决定回到主 `dev` 分支继续开发。回填过程中连续出现了 4 类容易误判的问题：

1. `pnpm exec vitest run src/tests/nitro-runtime` 先报 `Cannot find package "h3"`，表面上很像 Nitro 代码导入写错了。
2. 刚补跑 `pnpm install` 又立刻报 `ERR_PNPM_UNUSED_PATCH`，看起来像是 `patches/` 本身坏了。
3. `git worktree remove` 之后，磁盘上仍残留 `.worktrees/add-nitro-api-runtime` 目录，容易让人误以为 worktree 还没真正剥离。
4. 计划文档、prompt 文档和 OpenSpec 设计文档里还保留着旧的 worktree 路径，后续 agent 很容易被误导回旧目录继续开发。

## 2. 实际根因

真正的问题不是 Nitro 运行时本身不稳定，而是“改造完成后的迁移收尾动作”没有一次性做干净：

1. 从 worktree 把文件回填到主 `dev` 后，主工作区还没有同步安装新依赖，`h3` 缺失只是活动工作区依赖状态落后。
2. `pnpm.patchedDependencies` 对版本号是精确匹配；仓库里保留的是 `vite-plugin-mock-dev-server@2.1.1.patch`，但主工作区当时实际解析到的是 `2.0.6`，所以补丁根本不会生效。
3. Windows 下删除 worktree 经常会被 `node_modules` 原生二进制文件的长路径或文件锁卡住，Git 元数据移除了，不代表磁盘目录一定能同步删干净。
4. 文档如果不跟着切换实施位置，历史实验路径就会从“背景记录”变成“错误指导”，后续 agent 会把过期路径误认成当前执行入口。

## 3. 关键误导点

最容易浪费时间的误导信号有 3 个：

1. `h3` 缺失错误会把注意力引向 `server/` 代码，但第一优先级其实应该是确认“当前工作区是否已经重新安装依赖”。
2. `ERR_PNPM_UNUSED_PATCH` 很像 patch 文件内容损坏，实际上更常见的原因是“补丁文件名的精确版本”和真实安装版本不一致。
3. `git worktree list` 里已经看不到旧 worktree，不代表文档和磁盘残留都已经收尾完成；Git 侧完成删除，只是收尾的一部分。

## 4. 有效修复

这次最终证明有效的修复组合是：

1. 不继续硬扛失败的 `git apply --3way`，直接把确认过的改造文件从 worktree 原样回填到主 `dev` 工作区，再统一重新暂存。
2. 回填完成后，先在当前活动工作区执行 `pnpm install`，不要跳过依赖同步就直接解释测试失败。
3. 把 `package.json` 中的 `vite-plugin-mock-dev-server` 版本对齐到 `2.1.1`，让 `patches/vite-plugin-mock-dev-server@2.1.1.patch` 真正命中。
4. 清理 worktree 阶段结束后，立即同步修正文档：
   - `docs/plan/2026-03-28-add-nitro-api-runtime.md`
   - `openspec/changes/add-nitro-api-runtime/design.md`
   - `docs/prompts/use-nitro/index.md`
5. 对 Windows 下删不掉的 `.worktrees/add-nitro-api-runtime` 残留目录，只把它视为“非 Git 管理的磁盘残留”，不要误判成 Git 仍在使用这个 worktree。

## 5. 验证方式

这条经验成立时，至少要看到下面这些可重复证据：

1. `pnpm install` 能顺利完成，且不再出现 `ERR_PNPM_UNUSED_PATCH`。
2. `pnpm exec vitest run src/tests/nitro-runtime` 通过，结果为 `5` 个文件、`15` 个测试全部通过。
3. `git worktree list` 只剩主工作区，不再有 `add-nitro-api-runtime`。
4. 计划/Prompt/OpenSpec 文档已经明确写清楚“后续统一直接在主 `dev` 工作区继续开发”，旧 worktree 路径最多只作为历史上下文保留。

## 6. 后续约束

以后只要发生“把大改造从 worktree 回填到主工作区”的场景，必须先检查下面几件事：

1. `package.json`、`pnpm-lock.yaml`、`patches/` 和新增运行时文件必须视为一个原子集合一起迁移，不能只拷代码不补依赖。
2. 只要仓库使用了 `pnpm.patchedDependencies`，就必须先核对“补丁文件名中的版本号”和“真实解析安装版本”是否完全一致。
3. worktree 生命周期结束时，要做 3 层收尾：Git 元数据、磁盘残留目录、文档指导路径，缺一层都可能留下后续误导。
4. 如果用户已经决定放弃 worktree 开发模式，必须在同一轮把计划文档、prompt 文档和规范文档一起改掉，不要把“历史路径”留成“当前指令”。
