# 2026-04-03 微信小程序样式兼容清扫经验

## 1. 问题现象

- `uni-app` 页面在 H5 端正常，但到微信小程序端出现布局错位、间距丢失、卡片叠压、顶部和底部安全区异常，看起来像“样式整体失效”。

## 2. 根因

- 真正的问题通常不是“CSS 没加载”，而是微信小程序只支持 CSS/WXSS 子集，导致部分 Web 导向写法在小程序端失效或降级。
- 高风险来源主要有五类：
  1. `display: grid` 与依赖 `grid-cols-*` 的布局。
  2. `backdrop-filter`、`backdrop-blur-*`、`blur()` 等滤镜类效果。
  3. `env(safe-area-inset-*)` 与 H5 心智下的安全区写法。
  4. `:not()`、复杂 `:nth-child()`、以及 Uno/Tailwind 生成的 `space-*`、`divide-*` 选择器。
  5. raw CSS 与工具类里的 `gap`，尤其是多处用于按钮行、纵向列表、图片宫格、搜索栏的场景。

## 3. 关键误导点

- 误导点 1：看到页面“像没样式”，容易先怀疑 CSS chunk、组件库、CDN、打包异常；但这次多数问题其实是“小程序不兼容写法仍被编译进去了”。
- 误导点 2：UnoCSS/Tailwind 工具类在 H5 里表现正常，不代表在微信小程序端安全，尤其是 `space-*`、`divide-*`、`backdrop-*`。
- 误导点 3：修 `safe-area` 时很容易继续沿用 `safe-area-inset-*` 或 `env(...)`，但 uni-app 小程序端更稳的是 `var(--status-bar-height)`、`var(--window-bottom)`。
- 误导点 4：批量替换间距时，不能为了图快再引入 `:not(:first-child)`、复杂 sibling 选择器；这会把问题重新带回去。

## 4. 有效修复

- 全仓库按规则收敛为一套小程序安全基线：
  1. `grid` 改为 `flex + wrap + 显式宽度`。
  2. `backdrop-filter / blur` 全部去掉或降级成普通阴影、纯色、半透明背景。
  3. `safe-area-inset-* / env(safe-area-inset-*)` 改成 `var(--status-bar-height, 0px)`、`var(--window-bottom, 0px)`。
  4. `gap` 改为显式 `margin`、负 margin 容器、按钮 `custom-class="ml-*"` 等确定性写法。
  5. 避免 `:not()`、复杂 `:nth-child()`；如需间隔，优先写成组件项自身类名或固定 sibling margin。
- 同步更新了项目技能规则，避免后续 agent 再生成同类高风险写法：
  - `.claude/skills/style-migration/SKILL.md`
  - `.claude/skills/style-migration/references/wechat-mini-program-compatibility.md`
  - 若干相关技能中的旧示例也已收口。

## 5. 验证方式

- 交叉搜索验证业务源码：
  - `rg -n --glob '*.vue' --glob '*.scss' --glob '*.css' 'gap\\s*:' src`
  - `rg -n --glob '*.vue' 'grid-cols-|gap-[^\\s\"'']+|space-y-|space-x-|divide-y-|divide-x-|safe-area-inset|backdrop-blur|backdrop-filter|blur\\(' src`
  - `rg -n --glob '*.vue' --glob '*.scss' --glob '*.css' 'env\\(safe-area-inset|:not\\(|:nth-child\\(' src`
- 本次结果：
  - 业务源码中的上述风险项搜索已清零。
  - 仅剩第三方 `src/uni_modules/**` 和注释文本中的 `:not(...)` 命中，不属于业务待改代码。
- 构建验证：
  - `pnpm build:mp-weixin` 通过。

## 6. 后续约束

- 以后只要是面向微信小程序的页面或组件，默认禁止新增以下写法，除非先证明该写法在小程序端稳定：
  1. `grid` / `grid-cols-*`
  2. `backdrop-filter` / `backdrop-blur-*` / `blur()`
  3. `safe-area-inset-*` / `env(safe-area-inset-*)`
  4. `space-*` / `divide-*`
  5. raw CSS `gap`
- 新增页面时，应优先使用：
  - `flex + wrap`
  - 显式 `margin`
  - `var(--status-bar-height, 0px)` / `var(--window-bottom, 0px)`
- 遇到“H5 正常，小程序乱掉”时，优先先跑上述三组 `rg` 搜索，而不是先怀疑样式文件丢失。

## 7. Memorix 状态

- 本次会话未暴露 Memorix MCP 工具，无法直接写入本地 Memorix。
- 已将同等经验沉淀到本文件，后续如会话恢复 `mcp__memorix__*`，可按 `gotcha` 或 `problem-solution` 类型再同步一份。
