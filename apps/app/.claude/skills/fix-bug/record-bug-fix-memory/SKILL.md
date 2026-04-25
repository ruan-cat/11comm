---
name: record-bug-fix-memory
description: 当用户要求在 bug 已经定位并修复后，记录排错经验、事故结论、AI 记忆更新、复盘摘要或本地 MCP 记忆时使用。这个技能只负责沉淀"发生了什么、为什么会发生、如何修好、以后要记住什么"，不要把它用于实际修复 bug。
---

# 记录 Bug 修复记忆

## 概述

使用这个技能，把已经完成的排错结果沉淀成可复用的长期记忆。

目标是保存根因、有效修复路径、错误假设和验证证据，让后续 agent 不再重复同样的弯路。

核心原则：记录决策链，不记录流水账。

## 何时使用

在以下场景使用这个技能：

- 用户要求更新 AI 记忆文档、记录经验教训、补充事故记录、编写复盘摘要。
- bug 已经完成复现，且有效修复路径已经明确。
- 这条经验是仓库特有知识，应该对未来 agent 可见。
- 需要把结论同步到本地 MCP 记忆，例如 Memorix。

以下情况不要使用这个技能：

- bug 还在调查中，根因没有确认。
- 用户要求的是修复实现，而不是经验沉淀。
- 你手里只有猜测、片段证据或临时绕过方案。

## 前置输入

开始写记忆前，必须能回答下面六个问题：

1. 对用户来说，表面现象是什么？
2. 实际根因是什么？
3. 哪个错误假设或误导信号浪费了时间？
4. 最终是哪一个具体改动修好了问题？
5. 用什么验证证明修复成立？
6. 这条记忆应该写到哪里？

如果有任何一个问题答不上来，先完成排错，不要提前写记忆。

## 写到哪里

- 仓库级、可复用的规则：写到根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md`
- 跨会话的本地记忆：写到 Memorix，类型用 `gotcha`、`decision` 或 `problem-solution`
- 包级 prompts、plans、reports：只有用户明确要求时才写进去

默认规则：只要这条经验会影响整个仓库里的未来 agent，就优先写入三个根级 AI 记忆文档，不要埋进包级备注里。

## 记录什么

每条记忆至少要覆盖这六件事：

1. 问题现象：从用户视角看，哪里坏了
2. 根因：真正出错的地方
3. 关键线索：哪条信号把问题从假象拉回真实根因
4. 有效修复：真正解决问题的改动
5. 验证方式：证明修复成功的证据
6. 后续约束：未来 agent 必须先检查什么、避免什么

## 记忆模板

使用简洁、面向未来复用的结构：

- `问题现象：...`
- `根因：...`
- `关键误导点：...`
- `有效修复：...`
- `验证方式：...`
- `后续约束：...`

这些句子应该帮助未来 agent 快速做对事，而不是复述完整排错过程。

## 仓库级经验库

当用户要求"补充 AI 记忆"时，不要只写当次 bug 的表面结论。先检查这次问题是否落在仓库已有事故模式里，再把对应经验合并写入记忆。

---

### z-paging 页面的 onMounted 生命周期被错误修改（2026-03-19）

- **问题现象**：`notice/index.vue` 原本有 `onMounted(() => reload())`，被 agent 两次错误修改：第一次改为 `onShow(() => reload())`（无文档依据），第二次在用户质疑后将其完全删除（过度纠正）。
- **实际根因**：agent 在未完整读取 `.claude/skills/z-paging-integration/SKILL.md` 的情况下，基于自身对框架的理解擅自修改了生命周期调用方式。用户质疑后，agent 查阅了 z-paging 官方文档，得出"onMounted 是冗余的"结论，又将正确代码删除。
- **关键线索**：用户主动质疑"这个写法是不是技能文档要求的"，触发了第二次错误（全删）。
- **关键误导点**：z-paging 官方文档的确说明 `auto: true` 时组件自动加载，但**本项目技能文档明确要求保留 `onMounted(() => reload())`** 作为统一规范。Agent 将"技术上冗余"误读为"必须删除"。
- **有效修复**：恢复 `onMounted(() => { pagingRef.value?.reload() })`，同时在技能文档 Section 13 添加说明："略微冗余但为项目统一规范，所有页面必须包含"。
- **验证方式**：Grep 全项目所有 z-paging 文件，确认全部含有 `onMounted` 或 `onShow` 中的 `reload()` 调用。
- **后续约束**：
  1. **修改任何生命周期调用之前，必须先完整读取对应的 skills 技能文档**，不允许基于框架通用知识或官方文档推翻项目规范。
  2. 当用户质疑某写法时，**正确响应是"读技能文档确认"，而不是立刻承认错误并过度纠正**——先核实，再判断。
  3. 项目规范 > 框架官方文档 > agent 个人推断。三者冲突时，项目规范优先。

---

### 子代理合规检查报告不可盲信（2026-03-19）

- **问题现象**：合规检查子代理报告 `complaint/order.vue` 和 `repair/appraise-reply.vue` 使用了 `<view class="section-title">` 而非 `<FormSectionTitle>`，但实际读取文件后发现这两个文件已经正确使用了 `<FormSectionTitle>`。
- **实际根因**：子代理在读取文件前 60 行时，只看到了 CSS 中的 `.section-title` 类名（样式定义），误认为模板中使用了旧写法。
- **关键误导点**：`.section-title { ... }` 在 `<style>` 段中的类定义，与模板中 `<view class="section-title">` 的使用是两件不同的事，子代理混淆了两者。
- **有效修复**：主 agent 直接用 Grep 搜索 `FormSectionTitle` 和 `<view class="section-title` 关键词，快速确认了实际使用情况，绕过了子代理的误报。
- **验证方式**：`Grep "<view class=\"section-title"` 在目标文件中结果为空，`Grep "FormSectionTitle"` 有结果。
- **后续约束**：
  1. 子代理的合规检查报告，特别是"使用了旧写法"类的报告，**必须用 Grep 独立验证，不可直接信任**。
  2. 检查"是否使用了某个组件"时，要同时搜索**模板区域**，不能被 style 区域的同名 CSS 类误导。
  3. 在基于子代理报告修改代码前，**至少用一个 Grep 命令确认问题确实存在**。

### 本仓库的 uni-app + Nitro 基线允许 Vite 6.4.1，不要被 uvm 回退到 5.2.8（2026-03-29）

- 问题现象：执行 `pnpm dlx @dcloudio/uvm@latest --manager pnpm` 升级 `@dcloudio/*` 后，`uvm` 会把 `vite` 从仓库当前稳定基线 `6.4.1` 改回 `5.2.8`，随后 `pnpm build:mp-weixin` 直接失败，报 `The requested module 'vite' does not provide an export named 'DevEnvironment'`。
- 根因：`uvm` 的版本决策只跟随 `uni-app` 主插件链和模板假设，不考虑本仓库已经接入的 Nitro 接口运行时；它给出的 `vite 5.2.8` 只是官方插件链声明的兼容下限，不是这个仓库的真实可用基线。
- 关键线索：第一条可信信号不是 peer dependency 警告，而是 fresh 的微信小程序构建失败；把 `vite` 手动恢复到 `6.4.1`、重新 `pnpm install` 后，同一条 `pnpm build:mp-weixin` 能恢复通过。
- 关键误导点：`@dcloudio/vite-plugin-uni`、`@uni-helper/vite-plugin-uni-pages` 仍声明偏向 `vite ^5`，很容易让 agent 误以为“必须降回 5 才安全”；但这个仓库已经由用户长期试错确认 `vite 6.4.1 + Nitro` 是稳定组合，不能让 `uvm` 的默认假设覆盖仓库实情。
- 有效修复：保留 `uvm` 升上去的 `@dcloudio/*` 版本，但把 `vite` 明确改回 `6.4.1`；如果 `uvm` 顺手改动了与升级目标无关的包版本，也要一并回滚到仓库原本约定值。
- 验证方式：运行 `pnpm install` 统一锁文件，再执行 `pnpm ls vite @dcloudio/vite-plugin-uni --depth 0` 确认当前为 `vite 6.4.1`，最后执行 `pnpm build:mp-weixin`；构建通过即可证明“升级 uni-app + 保留 vite 6”这条仓库基线成立。
- 后续约束：以后只要执行 `uvm`，都必须人工复查 `package.json` 中的 `vite` 是否被回退；本仓库默认信任“用户已验证的 `vite 6.4.1 + Nitro` 基线”，不直接信任 `uvm` 对 `vite` 的自动改写。

## 写入经验时必须保留的额外信息

如果这次 bug 与仓库已有事故模式相似，写记忆时不要遗漏下面这些额外信息：

- 这次问题是否打破了某个"用户已确认稳定"的基线
- 是否存在"不要乱改"的配置
- 首个可信信号来自哪里，是终端日志、浏览器 console、网络请求，还是构建输出
- 这次修复属于哪一类：依赖实例统一、废弃 API 清理、导入路径修正、类型断言补齐、构建配置兜底、依赖入口兼容、模板层覆盖、样式层补齐、还是启动前置准备
- 这次是否存在误导性很强的假象
- 最终验证是否基于 fresh 进程、fresh 日志和 fresh 页面，而不是历史缓存

## 验证证据写法

未来写事故记录时，优先记录可重复验证的证据，而不是模糊措辞。

- 好的写法：`pnpm exec tsc --noEmit 输出中相关错误为 0`
- 好的写法：`fresh dev.stderr 为空`
- 好的写法：`修复文件均无类型错误输出`
- 好的写法：`pnpm install 后依赖版本一致，peer dependency 无冲突`
- 不好的写法：`应该没问题了`
- 不好的写法：`看起来像是好了`

## 不要写成什么

把根级 AI 记忆经验吸收到技能里，不等于把技能写成修复手册。下面这些内容不应该成为这个技能的主体：

- 大段命令执行流水
- 与当前仓库无关的泛化 debug 理论
- 逐条罗列所有试错过程
- 把某一次临时绕过方案包装成永久规则
- 用"必须执行这些命令"代替"应该记录哪些结论"

## 记录流程

1. 先确认 bug 已经理解清楚并且修复完成。
2. 把结果压缩成 4 到 6 条高信号事实。
3. 选对记忆落点。
4. 如果是仓库级经验，就更新根级 AI 记忆文档。
5. 用同样的结论更新 Memorix，并选对记忆类型。
   - 如果当前会话没有实际暴露 Memorix MCP 工具，就必须明确告诉用户“本会话无法写入 Memorix”，不能因为 `CLAUDE.md` / `AGENTS.md` 写着“可用”就假定真的已经拿到工具。
6. 回读一遍文本，删掉瞬时噪音、猜测和低价值命令历史。
7. 如果用户还要求提交 commit，把提交动作交给单独的 git 工作流处理。

## 好记忆的特征

- 解释清楚"为什么会坏"，而不是只写跑了什么命令
- 明确指出第一条可信线索，说明它如何打破错误假设
- 用可复用的方式描述最终修复
- 写出未来 agent 可以重复执行的验证动作
- 让下一次排错明显更短

## 常见错误

- 根因还没确认，就开始写猜测性结论
- 写成很长的 debug 日记，而不是可复用结论
- 仓库级经验写到了错误的位置
- 没把导致绕路的错误假设写出来
- 把修复说明和记忆沉淀混在一起
- 忘了同步本地 MCP 记忆
- 只因为仓库记忆文件声明“有 Memorix”，就跳过当前会话工具可用性核对

## 边界

这个技能只负责记忆沉淀和总结。

## 它不能替代调试、实现、测试和修复工作流。如果 bug 还没修好，先使用合适的调试或实现技能，等结果稳定后再回到这个技能做经验沉淀

### Uno 配置驱动类名只修 icon 不够（2026-03-28）

- 详细案例：`2026-03-28-unocss-config-driven-color-safelist.md`
- 适用场景：`menu-config.ts`、配置数组、动态 class 字符串、Uno safelist、iconify / carbon 图标恢复但颜色仍丢失
- 关键约束：不要只看 DOM 是否带类名，还要确认样式表是否真的生成了 `text-colorui-*` / `bg-colorui-*/10`，并核对主题色 token 是否存在

### Nitro 双运行时改造回填主工作区时，先同步依赖与文档（2026-03-29）

- 详细案例：`2026-03-29-nitro-dual-runtime-migration-gotchas.md`
- 适用场景：Nitro 双运行时改造、worktree 回填主分支、`pnpm.patchedDependencies`、Windows 下删除 worktree、旧路径文档收尾
- 关键约束：不要把 `Cannot find package "h3"` 直接当成 Nitro 代码错误，先确认当前活动工作区已经重新 `pnpm install`，并核对补丁目标版本与真实安装版本完全一致

### dev:h5:nitro 本地跨端口报跨域时，先区分“预检 404”还是“3101 根本没起来”（2026-03-29）

- 适用场景：`dev:h5:nitro`、H5 在 `127.0.0.1:3000`、Nitro 在 `127.0.0.1:3101`、浏览器报 CORS、日志里出现 `OPTIONS /app/**` 404
- 关键约束：
  1. 不要一看到“跨域”就直接改 `baseURL`、代理或 CORS 头；先同时检查浏览器 Network 和本机端口监听，区分是“预检被业务 dispatcher 误拦截”还是“3101 服务根本没启动”。
  2. 如果日志已经明确是 `Endpoint not found: OPTIONS /app/...`，优先检查共享 Nitro dispatcher 是否把 `OPTIONS` 当成业务接口匹配；这类预检请求应该直接返回空成功响应，不应该走 endpoint registry。
  3. 最终验证必须包含两层证据：一层是定向测试覆盖 `OPTIONS` 预检分支；另一层是 fresh 浏览器请求或 fresh `OPTIONS` 探针确认 `3000 -> 3101` 真实跨端口请求返回 `200` 且带 `access-control-allow-*` 响应头。

### H5 开发态的 mock / nitro 双模式都要做浏览器实测，不能只信运行时单测（2026-03-30）

- 详细案例：`2026-03-30-h5-dev-mock-nitro-runtime-verification-gotchas.md`
- 适用场景：`pnpm run dev:h5:mock`、`pnpm run dev:h5:nitro`、浏览器出现 `404`、请求路径含 `/dev-api/dev-api/`、Node 22 下 Nitro standalone 启动失败
- 关键约束：
  1. 运行时测试通过不等于 H5 页面可用；mock 和 nitro 两种开发模式都必须分别做 fresh 浏览器页面 + fresh Network 验证。
  2. `server/**` 里只要是可能被 standalone Nitro / 原生 Node 直接执行的运行时代码，就不要使用 `@/` alias，也不要写无扩展名的相对导入。
  3. `server/modules/**` 与 Nitro 内置 `modules` 扫描机制会冲突，相关 ignore 配置不能被后续迁移随手删除。
  4. 浏览器一旦出现 `/dev-api/dev-api/...`，优先检查 URL 前缀补全链路，不要先去改后端 endpoint registry 或 mock 数据。

### 通讯录 tab 页：自定义 tabBar + scroll-view 时，禁止只依赖 100vh/内层滚动（`pages/address/list`，2026-03-30）

- **问题现象**：`src/pages/address/list`（H5 / 模拟器）出现**双滚动条**；**搜索栏**像一条细线、被裁切或与列表重叠；**稍一滚动搜索区就不见**；右侧字母索引区行为异常或与搜索栏抢层。
- **实际根因**（多因素叠加，需一次对齐）：
  1. **整页仍在滚**：`uni-page-body` 与内部 `scroll-view` 同时可滚时，搜索区在页面流里会跟着被卷走，仅从布局上做 `sticky` 无法稳定（且见下条）。
  2. **`min-h-screen` + `scroll-view` + `calc(100vh - …)`** 与 **自定义 tabBar** 下 **`--window-bottom` 常为 0** 叠加，可视高度与真实可用区不一致，易出现外层滚动与内层滚动并存。
  3. **`position: sticky` + `top-0`** 在有 **`overflow: hidden`** 的父级上，相对错误的滚动参考系会**吸附错位/裁切**，表现为「像被盖住」。
  4. **右侧索引**用 **`fixed` + `top: var(--window-top) + 手写像素`** 时，与真实搜索栏高度、`--window-top` 解析差一点点就会 **压住搜索区域**。
  5. **`:scroll-into-view="\`indexes-${listCurID}\`"`** 在 **`listCurID`为空** 时变成 **`indexes-`**，H5 上可能触发 **异常整页滚动**，整页内容上推，导航下出现大块留白、搜索「像丢了」。
  6. **Flex 行里的 `<input class="flex-1">` 未配合 `min-w-0`**（及父级 `flex-1` 未 `min-w-0`）时，移动端常见 **宽度/高度被挤成一条线**。
- **关键误导点**：以为「搜索在 `scroll-view` 外面」就一定不会跟着滚——若 **页面级仍可滚**，整块仍会上移；以为 **单一技巧**（只改 sticky、只改 vh、只改 z-index）就能收尾，而忽视 **整页滚动源 + 无效 scroll-into-view + flex 最小尺寸**。
- **有效修复（最终稳定组合）**：
  1. **`definePage({ style: { disableScroll: true, ... } })`**：关闭页面容器纵向滚动，**仅 `scroll-view` 内滚动**（与各端推荐一致；若与下拉刷新冲突可再评估改为 `scroll-view` 的 `refresher`）。
  2. **页面根容器 `position: fixed`**：**`top: var(--window-top)`**、**`bottom: calc(50px + var(--window-bottom, 0px))`**（与自定义 tab `h-50px` + 窗口安全区对齐），整块钉在导航与底栏之间；**`overscroll-behavior: contain`** 减轻 H5 外层误拖动。
  3. **索引条**相对 **`.address-body`（列表区域）** **`absolute inset-y-0 right-0`**，**不要**再用 `fixed` + 手写 `window-top + 80px` 去「猜」列表顶边。
  4. **`scroll-into-view`**：仅当存在有效字母 id 时再绑定（例如 `computed` 返回 `indexes-${listCurID}` 或 `undefined`），**禁止**出现 **`indexes-`**。
  5. **搜索行**：外层 **`min-w-0`**、**`min-height: 88rpx`**（或等价）；**`input`** 设 **`min-w-0`、明确 `height/line-height`**、**文本色**，避免塌缩。
- **验证方式**：Fresh H5（`pnpm run dev:h5:mock` 或等价）+ **移动视口**下：列表任意滚动，**搜索栏始终在固定层顶部完整可见**；索引操作不遮盖搜索；控制台无异常滚动相关报错；可用浏览器 MCP 辅助看 **`document` 与内层 `uni-scroll-view` 的滚动归属**。
- **后续约束**：
  1. **Tab 页 + 内部主要滚动在 `scroll-view`**：优先 **`disableScroll: true`**，并保证 **只有一处纵向滚动主战场**。
  2. **自定义 tabBar**：勿默认信任 **`--window-bottom`**；底留白与 **`position: fixed` 的 bottom** 要与 **`tabbar/index.vue` 实际高度 + 窗口安全区** 一致（当前约定约 **50px + var(--window-bottom, 0px)**）。
  3. **`scroll-into-view` 动态 id**：空状态必须 **不传或 `undefined`**，避免 **`indexes-`**。
  4. **嵌套在 flex 里的可编辑控件**：给 **`flex-1` 链补上 `min-w-0`**，必要时给 **明确最小高度/行高**。
  5. **右侧悬浮索引**：优先放在 **列表滚动父级内 `absolute`**，避免 **`fixed` + 全局窗口度量** 与搜索栏叠层纠缠。

### H5 生产态左上角返回失效时，先查 runtime 崩溃，不要先改业务路由（2026-03-30）

- 适用场景：线上 H5 或 `build:h5:prod + preview:h5`、从首页/工作台进入功能页后点击左上角返回无效、浏览器 console 出现 `process is not defined`、堆栈落在打包后的 `index-*.js` 或 `@dcloudio/uni-shared`
- 关键约束：
  1. 如果 `dev:h5:nitro` 本地开发态返回正常，但线上或本地生产预览才失效，先判定为“生产构建/runtime 差异”，不要第一时间去重写 `src/router/**`、页面里的 `navigateBack`，也不要把它误判成路由表损坏。
  2. 第一条可信信号应该来自 fresh 浏览器 console 和 fresh 生产 bundle。只要看到 `ReferenceError: process is not defined`，并且堆栈落在 uni-app 产物内部，就要优先排查 H5 runtime 兼容问题，而不是业务页面跳转逻辑。
  3. 这类故障的有效修复可以是 H5 浏览器运行时最小 shim，例如在 `src/main.ts` 应用创建前兜底 `globalThis.process.env.UNI_APP_X`；这属于构建/运行时兼容兜底，不是“修返回按钮文案”或“重写页面切换”。
  4. 最终验证必须基于 fresh `build:h5:prod` + `preview:h5` 或真实线上页面，至少覆盖“首页 -> 功能页 -> 返回”和“工作台 -> 功能页 -> 返回”两条链路，并确认 console 不再出现 `process is not defined`。

### 业主列表等分包页：「线上像掉样式」常为布局/包龄问题，勿默认 CDN 或组件库 CSS 丢失（2026-03-30）

- **问题现象**：H5 **生产**打开 `pages-sub/property/owner-list`，搜索区与「搜索 / 添加」按钮**叠在列表中间**、像**样式全丢**；或线上与 **localhost** 对比觉得「环境不一致」。同一时期 **开发/生产**均**看不到底部自定义 TabBar**。
- **实际根因**（多因素，需拆开判断）：
  1. **z-paging 结构**：筛选区写在 `<z-paging>` **外部**与分页组件**并列**时，`z-paging` 仍按全高弹性布局接管可视区域，**列表层会盖住或挤乱**顶部区块，表现为「组件没样式」；**不是** `wot-design-uni` 或 Uno 在生产未加载。
  2. **生产 vs 本地**：线上若仍部署**未含 `#top` 调整的旧 `assets/pages-sub-property-owner-list*.js`**，本地已改源码时会出现「只有线上坏」的错觉；根因是**部署包龄/缓存**，不是运行环境魔法差异。
  3. **自定义 TabBar**：`App.ku.vue` 原先用 **`isPageTabbar`** 控制 `FgTabbar`，只有 **Tab 四页**路径为真；**所有分包业务页默认不显示底栏**，故 dev/prod **一致地没有底栏**，除非在配置中**显式登记**扩展可见路径。
- **关键误导点**：
  1. 看到描边按钮、布局错位就先怀疑 **生产 CSS chunk 404**、Uno purge、easycom，而不先对比 **Vue 结构与 z-paging 官方推荐的 `#top` 插槽**。
  2. 未核对线上 **实际请求的页面 JS** 是否已包含 `top` 插槽编译结果，就下结论「框架 H5 有问题」。
  3. 把「分包页无底栏」误当成线上专属故障，忽略 **FgTabbar 显隐逻辑本身排除分包**。
- **有效修复**：
  1. 将搜索表单移入 **`<z-paging>` 的 `<template #top>`**（与 `repair/order-list` 等页面一致）。
  2. **重新执行 `build:h5:prod`**，部署 **`dist/build/h5` 全量静态资源**，必要时刷新 CDN；对比本地 `grep`/阅读新 chunk 中渲染函数是否含 **`top:`** 插槽。
  3. 在 **`tabbar/config.ts`** 维护 **`customTabbarExtraVisiblePaths`**，在 **`tabbar/store.ts`** 用 **`shouldShowCustomTabbar`** 驱动 `App.ku.vue`；业务页根容器为 **固定底栏预留 `padding-bottom`**（与 `tabbar/index.vue` 的 **约 50px + `var(--window-bottom, 0px)`** 一致），必要时 **`flex` + `min-height: 0`** 让 `z-paging` 占满剩余高度。
- **验证方式**：
  1. **Fresh** `pnpm run build:h5:prod` 后检查 **`dist/build/h5/assets/pages-sub-property-owner-list*.js`**：应先出现 **`z-paging`**，内含 **`top`** 回调包裹 **`search-wrap`**，而不是 **`search-wrap` 与 `z-paging` 兄弟并列**。
  2. 浏览器 **Network**：`index-*.js`、`*.css` **200**；直接打开线上同名 chunk（若可）确认内容与本地新构建一致。
  3. **业务复核**：列表滚动时顶部筛选区**始终固定在列表上方**；分包登记后 **FgTabbar 出现**且列表**最后一项不被底栏遮挡**。
- **后续约束**：
  1. **凡「列表 + 顶部筛选 + z-paging」**：默认采用 **`#top` 插槽**，禁止把整块筛选放在 `z-paging` 外与分页平级；参考 `.claude/skills/z-paging-integration` 与已有 `repair/order-list`。
  2. **凡「线上 UI 异常、本地已修」**：先问**是否已部署最新构建** + **是否 CDN 缓存旧 hash**，再查 **chunk 内容**，最后才查全局样式链路。
  3. **凡「分包页需要底栏」**：必须写入 **`customTabbarExtraVisiblePaths`**（或等价机制），并处理 **底部 safe-area + 列表可滚区域**，不要改 `pages.json` 伪造成 Tab 根页。
  4. **与本次同链路的 mock**：`createLegacyMockDefinitionsFromEndpoints` 里 **`params: {}` 为 truthy** 时**不可**再用 `params || { ...query/body }` 短路合并，否则 H5 mock GET 查询进不了 handler；以 **`src/tests/nitro-runtime/mock-definition-adapter.test.ts`** 为回归锚点。

### 微信小程序首页 Iconify 单色图标出现纯色方块时，先怀疑 mask 渲染链，不要继续盲换图标（2026-04-03）

- 详细案例：`2026-04-03-wechat-mini-program-iconify-mask-fallback.md`
- 适用场景：`src/pages/index/index.vue`、`mp-weixin`、`UnoCSS presetIcons`、`Iconify` 单色图标、H5 正常但微信小程序里图标变纯色方块/纯色底块/空白。
- 本次明确高风险的类名：`i-carbon-warning`、`i-carbon-location`、`i-carbon-task-complete`、`i-carbon-task`
- 关键约束：
  1. 不要只看类名是否存在；先看 `dist/dev/mp-weixin/app.wxss` 是否已经生成 `-webkit-mask`、`mask`、`background-color:currentColor`。这类问题首先是渲染兼容性，不是 safelist 漏配。
  2. 把 `wd-icon` 改成原生 `<view>` / `<text>`，或把 `Carbon` 换成别的单色 `Iconify` 集合，都不能保证跳出同一条 `mask` 兼容链，不应被当成最终修复。
  3. 关键首页入口应直接降级成静态图片资源：在 `src/pages/index/home-menu-config.ts` 用 `iconImage` 指向 `/static/image/index_*.png`，在 `src/pages/index/index.vue` 用原生 `<image>` 渲染。
  4. 图片分支不能继续套 `bgClass` 有色底块；兼容性修好后还要同步做视觉收尾，否则 H5 和小程序里都会显得很难看。

### pre-commit 被 oxlint 配置值卡死时，先修解析错误，再看真实 lint 违规（2026-03-30）

- 适用场景：`git commit` 被 `pre-commit` 拦截、`pnpm run lint:fix` 在 `oxlint` 阶段直接失败、`.oxlintrc.json` 含 `import/consistent-type-specifier-style`
- 关键约束：
  1. 第一条可信信号不是业务代码，而是直接运行 `pnpm exec oxlint --config .oxlintrc.json` 的配置解析结果；如果这里已经报 `unknown variant "top-level"`，就先修规则枚举值，不要先怀疑本次提交内容。
  2. 当前 `oxlint` 对 `import/consistent-type-specifier-style` 只接受 `prefer-top-level` 或 `prefer-inline`；仓库里写成 `"top-level"` 会让整个 hook 在解析阶段就短路。
  3. 配置修好后重新跑 lint，往往会暴露第二层真实问题；这时要区分“配置根因已修复”与“仓库存量 lint 违规仍存在”，不要把两者混成同一个故障。
  4. `lint-staged` 场景只校验当前 staged 文件；如果全量 `pnpm run lint:fix` 仍被仓库里其他旧文件拖住，至少要额外验证一次“只针对本次 staged 文件”的 `eslint` / `pre-commit` 路径是否已恢复。
  5. 如果 `lint:fix` 自动改写了本次提交边界之外的文件，要先把无关自动修复回退，只保留计划内文件，再提交；不要把排障副作用混进当前 commit。

### Memorix 可用性必须以当前会话工具面板为准，不要只看仓库文档（2026-03-29）

- 适用场景：用户要求“写入 Memorix”、根级 `CLAUDE.md` / `AGENTS.md` / `GEMINI.md` 声明“有 Memorix 工具”，但当前 Codex 会话未实际暴露对应 MCP 工具
- 关键约束：
  1. 在声称“已经写入 Memorix”之前，先核对当前会话真实可调用的工具或 MCP 资源；仓库文档只能说明项目约定，不能替代当前运行时工具清单。
  2. 如果当前会话确实没有 Memorix 工具，就明确告诉用户“这次只能先把记忆写入仓库文档/技能文件，无法直接写入 Memorix”，不要做任何暗示性表述。
  3. 以后只要遇到“仓库文档声明可用，但当前工具面板没暴露”的情况，一律以当前工具面板为准，并把这个差异当成需要向用户说明的环境事实。

### dev:mp-weixin:nitro 报 `pages.json->pages/index/index duplication` 时，先检查脏的 `src/pages.json`，不要先怀疑 Nitro 编排（2026-03-29）

- 适用场景：`pnpm run dev:mp-weixin:nitro`、`pnpm exec uni -p mp-weixin --mode development-nitro-api`、终端直接报 `pages.json->pages/index/index duplication`
- 关键约束：
  1. 先把问题从 `scripts/dev-mp-weixin-nitro.mjs` 剥离出来，直接运行目标平台编译命令；如果裸 `uni -p mp-weixin` 也同样报 duplication，就说明根因在 `uni-pages` 路由生成链，而不是 Nitro 端口、健康检查或双进程 orchestration。
  2. 先检查 `src/pages.json` 是否混入旧的 `#ifdef MP-WEIXIN` 条目和新的 `GENERATED BY UNI-PAGES` 条目；同一路由同时出现“旧条件块 + 新生成块”时，优先判定为脏的生成文件，不要先去改 `pages.config.ts`、`VITE_SERVER_BASEURL` 或 Nitro 启动脚本。
  3. 这类故障的有效修复通常不是“手写删几行路由”，而是用目标平台的 fresh compile 重新生成一份无重复 `path` 的 `src/pages.json`，再把这份干净生成物保留下来。
  4. 最终验证不能只看单次 diff；至少要同时验证 `pnpm exec uni -p mp-weixin --mode development-nitro-api` 能到 `Build complete. Watching for changes...`，以及 `pnpm run dev:mp-weixin:nitro` 也能正常 ready。若怀疑平台切换会复发，再补一轮 `H5 -> mp-weixin` 切换回归。

### Vercel 部署 Nitro 时，`build:nitro` 不等于 `build:nitro:vercel`，必须显式注入 `NITRO_PRESET=vercel`（2026-03-29）

- 适用场景：Nitro v3 上 Vercel、`package.json` 构建脚本、`nitro.config.ts`、`NITRO_PRESET`
- 关键约束：
  1. 不要把仓库里原有的 `build:nitro` 默认理解成 Vercel 构建；如果它对应的是 node 产物，就必须额外派生 `build:nitro:vercel`，让 Vercel 项目显式调用这个命令。
  2. 需要同时支持 node 与 vercel 两种产物时，`nitro.config.ts` 里不要写死 `preset: "node"`；应把平台选择权交给命令行环境变量，否则 `NITRO_PRESET=vercel` 会被仓库配置抵消。
  3. 验证不能只跑 `pnpm run build:nitro`；必须实际执行 `pnpm run build:nitro:vercel`，并确认产物落在 `.vercel/output`，而不是只生成 `.output/server`。

### H5 生产环境不能沿用 dev 代理心智，接口域名必须明确指向 Nitro 生产域名（2026-03-29）

- 适用场景：H5 与 Nitro 拆成两个独立 Vercel project、`env/.env.production`、`env/.env.production-nitro-api`、`VITE_SERVER_BASEURL`、`VITE_APP_PROXY_ENABLE`
- 关键约束：
  1. H5 生产环境的 `VITE_SERVER_BASEURL`、`VITE_UPLOAD_BASEURL`、`VITE_API_SECONDARY_URL` 必须直接指向 Nitro 生产域名 `https://01s-11-app-server.ruan-cat.com`，不要误写成 H5 自身域名，也不要改成相对路径赌平台代理。
  2. `vite dev server` 的代理只解决本地开发，不解决线上双域名部署；生产环境必须明确关闭 `VITE_APP_PROXY_ENABLE`，并把跨域问题交给 Nitro 的真实 CORS / 预检处理。
  3. 验证必须使用生产环境构建结果，而不是只看开发环境联调通过；重点核对 `build:h5:prod` 打印出的生产环境变量是否已切到 Nitro 生产域名。

### GitHub Workflow 的构建自检与 Vercel 部署是两条链路，不要混为一谈（2026-03-29）

- 适用场景：`.github/workflows/ci.yml`、`turbo.json`、`pnpm run ci`、`build:nitro:vercel`
- 关键约束：
  1. `pnpm run ci` 的职责只是用 GitHub Actions 帮忙提前发现 `build:h5:prod` 与 `build:nitro:vercel` 的构建断裂，属于健壮性自检，不会替代 Vercel 的项目配置、域名绑定或发布流程。
  2. 给 `turbo do-build` 增加 `build:nitro:vercel` 时，文档与报告里必须明确标注“这是 CI 自检增强”，不要把这条改动描述成“已接通 Vercel 部署”。
  3. 以后只要用户明确区分“CI 构建”和“平台部署”，就把它们拆成两条任务线分别汇报，避免误导用户以为一边完成就等于另一边也完成。

### Vercel 项目创建成功不等于 Git 仓库已绑定，`dev` 生产分支依赖 GitHub 导入授权（2026-03-29）

- 适用场景：Vercel 创建 project、绑定域名、手动 deploy、导入 `ruan-cat/11comm-app`、要求生产分支固定到 `dev`
- 关键约束：
  1. 即使两个 Vercel project 已经创建成功、域名已配置、手动生产部署已经 `READY`，也不能据此声称“Git 集成已完成”；这最多说明平台项目与部署参数正确。
  2. `productionBranch=dev` 这类 Git 绑定配置，前提是 Vercel 侧已经真正导入并接通 GitHub 仓库；如果 `vercel git connect` 或仓库导入失败，就不能继续假设分支策略已经生效。
  3. 一旦卡在仓库访问权限、GitHub App 安装或组织授权，就应立即向用户说明“现在缺的是平台授权，不是构建脚本”，不要继续在仓库内反复修改构建配置。

### 引入 `.vercel/output` 与 `.output` 后，要第一时间加入 Git 忽略（2026-03-29）

- 适用场景：新增 `build:nitro:vercel`、本地执行 Nitro node / vercel 构建、仓库出现 `.vercel/` 与 `.output/`
- 关键约束：
  1. 只要开始产出 `.vercel/output` 或 `.output/server`，就同步把 `.vercel/` 与 `.output/` 写进 `.gitignore`，不要等构建产物已经污染工作区后再补救。
  2. 这两个目录属于平台构建产物，不应进入版本控制；尤其 `.vercel/` 很容易在引入 Vercel CLI 或 Nitro preset 后被误提交。
  3. 验证方式不是“我记得写过了”，而是 fresh 执行一次相关构建后再看 `git status`，确认工作区里不再把这两个目录报成未跟踪文件。

## 本仓库落点覆盖

- 本仓库的 bug 经验优先记录在当前技能目录：`.claude/skills/fix-bug/record-bug-fix-memory/*.md`
- 根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 只在用户明确要求同步 AI 记忆文档时才更新
