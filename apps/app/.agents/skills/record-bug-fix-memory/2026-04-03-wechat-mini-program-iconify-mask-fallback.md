# 2026-04-03 微信小程序首页 Iconify mask 图标兼容性故障

## 1. 问题现象

- `src/pages/index/index.vue` 的首页入口在 H5 正常，但在微信小程序 `pages/index/index` 中，部分图标显示成纯色方块、纯色底块，或者根本看不到预期的线稿图形。
- 本次明确出故障的是首页这 4 个入口：
  - `投诉待办`
  - `巡检打卡`
  - `维修已办`
  - `办工作单`
- 这类故障最容易让人误判成“类名没生成”“safelist 漏了”“`wd-icon` 不支持自定义类名”，但本次真正的问题不在这些层面。

## 2. 本次确认有风险的 Iconify 类名

- 本次在微信小程序首页里明确出故障的 Carbon 类名：
  1. `i-carbon-warning`
  2. `i-carbon-location`
  3. `i-carbon-task-complete`
  4. `i-carbon-task`
- 这些类名在源码和编译产物里都存在，但在 `mp-weixin` 的最终渲染结果不可靠。

## 3. 实际根因

- `UnoCSS presetIcons` 对单色 `Iconify` 图标的默认产物不是 `<svg>` 标签，而是 CSS 图标规则。
- 这类规则在编译后会落成：
  1. `data:image/svg+xml` 的图标数据
  2. `-webkit-mask` / `mask`
  3. `background-color: currentColor`
- 本仓库 `dist/dev/mp-weixin/app.wxss` 中能明确看到这条链路；所以问题不是“图标没编出来”，而是“微信小程序对这批 mask 图标的渲染兼容性不稳定”。
- 一旦 `mask` 没正确生效，就只剩下 `background-color: currentColor`，最终表现就是截图里的纯色方块或纯色底块。

## 4. 关键误导点

1. 大部分 `Carbon` 图标在微信小程序里能显示，不代表这一批也安全；`Iconify` 的兼容性不是“整个集合一起成功或失败”，而是可能只坏某些图标。
2. 把 `wd-icon` 改成原生 `<view>` / `<text>` 只能绕开一层组件封装，不能绕开 `UnoCSS -> Iconify -> CSS mask` 这条真正的高风险渲染链。
3. 把 `Carbon` 换成别的单色 Iconify 集合也不一定有用。只要最终还是单色 CSS icon，大概率仍走同一条 `mask + currentColor` 链路。
4. 只看源码里的类名或 DOM 上的类名不够，必须看 `dist/dev/mp-weixin/app.wxss` 和 `dist/dev/mp-weixin/pages/index/index.wxml` 这种实际产物。

## 5. 本次尝试过但不能作为可靠修复的路径

1. 仅把 `wd-icon` 改成原生 `<view>` / `<text>`：不够，微信小程序里仍可能显示为纯色块。
2. 把故障图标换成其他 Carbon 类名，例如：
   - `i-carbon-warning-alt`
   - `i-carbon-task-view`
     这条路径在本次问题里不能作为稳定修复结论。
3. 把故障图标换成 `Tabler` 等其他单色 Iconify 图标，例如：
   - `i-tabler-alert-circle-filled`
   - `i-tabler-map-pin-filled`
   - `i-tabler-clipboard-check-filled`
   - `i-tabler-clipboard-text-filled`
     这条路径同样不能证明已经脱离 `mask` 兼容链，不能作为可靠兜底。

## 6. 最终有效修复

- 对关键首页入口，直接降级为静态图片资源，彻底绕开 `mask` 链：
  1. `complaint-todo` -> `/static/image/index_complaint.png`
  2. `inspection-task` -> `/static/image/index_inspection.png`
  3. `repair-finish` -> `/static/image/index_repair.png`
  4. `work-do` -> `/static/image/index_dealRepair.png`
- 代码层落点：
  1. 在 `src/pages/index/home-menu-config.ts` 中为故障入口增加 `iconImage`
  2. 在 `src/pages/index/index.vue` 中改为 `v-if="entry.iconImage"` 走原生 `<image>`，否则才走 CSS 图标分支
- 重要补充：
  - 图片分支不能继续复用 `entry.bgClass` 的有色图标底块，否则虽然兼容性问题解决了，但 H5 和小程序都会出现“图片外面又套一个有色方块”的难看效果。
  - 本次最终又补了一层：`iconImage` 分支的图标容器去掉 `bgClass`，只保留图片本身。

## 7. 本次推荐的降级方案顺序

1. 先确认是不是 `mask` 兼容性问题，而不是先换业务逻辑或先改导航。
2. 对关键首页/工作台入口，优先使用静态图片或静态 SVG 资源，原生 `<image>` 渲染。
3. 对非关键入口，如果暂时还没出现微信小程序故障，可以继续保留 CSS icon，但必须在 `mp-weixin` 真机或模拟器里单独验。
4. 不要把“换别的单色 Iconify 类名”当作首选方案；这更像试错，不是稳定策略。

## 8. 编译产物与验证证据

- 产物证据：
  1. `dist/dev/mp-weixin/app.wxss` 中可见 `-webkit-mask`、`mask`、`background-color:currentColor`
  2. `dist/dev/mp-weixin/pages/index/home-menu-config.js` 中可见 4 个 `iconImage` 静态资源路径
  3. `dist/dev/mp-weixin/pages/index/index.wxml` 中可见 `<image wx:if="...">` 分支，说明首页这 4 个入口已经不再依赖 CSS icon
- 测试证据：
  1. `pnpm vitest run src/pages/index/tests/home-menu-config.test.ts src/pages/index/tests/home-index-template.test.ts`
  2. `pnpm build:mp-weixin`
- 视觉证据：
  1. 微信开发者工具内重新导入或重新编译 `dist/dev/mp-weixin`，确认这 4 个入口不再是纯色方块
  2. H5 端使用浏览器 MCP 打开 `http://localhost:3000/#/pages/index/index`，确认图片分支已经没有额外的有色底块

## 9. 后续约束

1. 以后只要在微信小程序里看到“图标变纯色方块/纯色底块”，第一优先级就是去看 `dist/dev/mp-weixin/app.wxss` 是否走了 `mask + currentColor`。
2. 对关键导航入口，不要把“换一个 Iconify 集合”当作最终修复；先假设它仍然会走同一条 `mask` 兼容链。
3. 首页、工作台、tab 页这种高曝光入口，一旦确认微信小程序兼容性不稳定，应直接切静态图片资源，不要在 Iconify 集合里继续做长时间试错。
4. 使用静态图片兜底后，要同步处理视觉收尾：图片分支不再套 `bgClass` 色块，避免界面效果变差。
5. 以后若 `src/pages/work-dashboard/menu-config.ts` 中的相近图标也要在小程序首页或关键卡片中复用，默认把 `i-carbon-warning`、`i-carbon-location`、`i-carbon-task-complete`、`i-carbon-task` 视为高风险候选。

## 10. Memorix 状态

- 本次会话未暴露 `mcp__memorix__*` 工具，无法直接写入 Memorix。
- 已将同等经验沉淀到当前技能目录，后续若会话恢复 Memorix MCP，再按 `gotcha` 或 `problem-solution` 类型同步即可。
