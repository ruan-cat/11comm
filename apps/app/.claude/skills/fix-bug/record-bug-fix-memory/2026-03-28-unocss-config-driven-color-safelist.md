# 2026-03-28 Uno 配置驱动动态类名的颜色生成故障

## 1. 问题现象

`/pages/work-dashboard/index` 的 icon 在恢复显示后，很多入口仍然全部变黑，图标外层浅色底块也消失。页面 DOM 上还能看到 `text-colorui-*`、`bg-colorui-*/10` 这类 class，表面上很像组件自己把颜色逻辑改坏了。

## 2. 实际根因

真正丢失的不是模板传参，而是 Uno 最终生成的 CSS：

1. `src/pages/work-dashboard/menu-config.ts` 把 `iconClass`、`bgClass` 写成了 TS 配置字符串。
2. 之前只修了 `i-carbon-*` 的生成链路，没有同时兜底 `text-colorui-*`、`bg-colorui-*/10`、`border-colorui-*`。
3. Uno 没把这些动态颜色类编译进样式表时，DOM 上即使保留了类名，图标也会退回黑色，背景也会透明。
4. `uno.config.ts` 原本还缺少 `colorui-cyan`，所以即使补 safelist，这一路颜色也会继续失效。

## 3. 关键误导点

最容易误判的地方是：DOM 上有类名，不代表样式规则真的生成了。

这类问题不能只看页面模板，也不能只看 `class` 绑定是否还在；必须同时检查浏览器样式表或 computed style，确认 Uno 是否真正产出了对应 CSS。

## 4. 有效修复

最有效的修法是收敛到 `uno.config.ts`，不要去改业务页面：

1. 自动扫描 `src/**/*.vue|ts` 中的 `i-carbon-*`，继续兜底配置驱动图标类。
2. 同时自动扫描 `text-colorui-*`、`bg-colorui-*/10`、`border-colorui-*` 并加入 safelist。
3. 补上缺失的 `colorui-cyan` 主题色。
4. 少量历史 Carbon 图标名通过 alias 兼容，不直接改 `pages/work-dashboard/index` 这类页面代码。

## 5. 验证方式

这类修复至少要保留 3 条证据链：

1. `src/tests/uno-config.test.ts` 证明动态颜色类进入 safelist，且 `colorui-cyan` 存在。
2. `pnpm exec eslint uno.config.ts src/tests/uno-config.test.ts` 通过。
3. 浏览器 fresh 页面确认 computed style 中图标颜色和浅色背景都恢复，而不是只看截图或缓存页面。

## 6. 后续约束

以后只要是 `menu-config.ts`、配置数组或其他“字符串 class 配置”驱动的页面，修 Uno / iconify 故障时必须同时检查：

1. DOM 上是否真的带了预期类名。
2. 样式表里是否真的生成了对应 CSS。
3. 主题色 token 是否存在。

不要再只修 `icon` safelist 就结束排查。
