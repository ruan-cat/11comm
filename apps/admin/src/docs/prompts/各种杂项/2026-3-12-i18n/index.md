# <!-- 已完成 --> 全面更新本项目的 i18n 配置

在 `apps\admin\src\docs\plan\2026-03-13-admin-i18n-route-progress.md` 内记录任务进度。

---

后台项目出现很多 i18n 配置使用不当的情况。请你使用谷歌浏览器 MCP，访问 https://01s-11.ruan-cat.com/ 生产环境，逐步的阅读清楚全部的页面。

通过直接访问页面的方式，了解清楚到底有哪些页面没有正确的使用 i18n 。

将这些没有正确使用的页面罗列出来，列举到明确的清单文件内。然后进入到这些页面的 vue 组件内。正确的使用 i18n，完成修复。

这份 `apps\admin\src\docs\reports\2026-03-11-prod-i18n-audit-key-findings-and-fix-plan.md` 报告是上一次任务的进度，请你根据这一份报告，继续完成全面的 i18n 修复。

请务必使用 `.claude\skills\code-style` 技能，使用本项目正确的 i18n 使用方式，在 vue 组件内正确使用 i18n 。

### 只处理 i18n

你只负责更改 i18n，不要删改掉其他的代码。

比如这里：

原来的代码：

```vue
<ElButton type="success" @click="exportConfig"> 导出 </ElButton>
<ElButton type="warning" @click="importConfig"> 导入 </ElButton>
```

修改后的代码：

```vue
<ElButton type="info" @click="exportConfig">
  {{ transformI18n($t("devTeam.configManage.center.buttons.export")) }}
</ElButton>
<ElButton type="info" @click="importConfig">
  {{ transformI18n($t("devTeam.configManage.center.buttons.import")) }}
</ElButton>
```

不要去添油加醋，不要多修改了组件的 type 类型。这不是本次 i18n 任务的要求！

正确的修改是：

```vue
<ElButton type="success" @click="exportConfig">
  {{ transformI18n($t("devTeam.configManage.center.buttons.export")) }}
</ElButton>
<ElButton type="warning" @click="importConfig">
  {{ transformI18n($t("devTeam.configManage.center.buttons.import")) }}
</ElButton>
```

只负责完成 i18n 的使用和替换。

### 增加注释

修改例子如下：

旧代码：

```ts
definePage({
	meta: {
		title: "菜单组",
		icon: "mdi:group",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.menuManage.group"),
	},
});
```

按照 i18n 要求修改后的代码：

```ts
definePage({
	meta: {
		// 菜单组
		title: "devTeam.menuManage.group.pageTitle",
		icon: "mdi:group",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.menuManage.group"),
	},
});
```

注意在 definePage 的 meta.title 内补全中文注释，便于我阅读。

## 01 上一次完成的 i18n 非常差劲

请你主动使用谷歌浏览器 MCP，运行 `apps\admin\package.json` 的 "dev" 命令，检查每个页面的 i18n 使用情况。

实际上，有很多页面无法准确的使用你提供的 i18n key。请你认真参考阅读我提供给你的参考资料。根据参考资料，在本项目内使用正确的 i18n 写法。

pure-admin 后台框架模板：

`apps\admin` 项目套用是 `pure-admin` 模板。

- pure-admin 模板仓库 ： https://github.com/pure-admin/vue-pure-admin
- pure-admin 在线预览界面 ： https://pure-admin.github.io/vue-pure-admin/#/login
- pure-admin 文档 ： https://pure-admin.cn/
- pure-admin 文档仓库 ： https://github.com/pure-admin/pure-admin-doc
- pure-admin 注册路由 ： `https://github.com/pure-admin/pure-admin-doc/blob/master/docs/01.指南/01.指南/07.路由和菜单.md`

## 02 优化本项目的 i18n 实现的方式

我注意到很多 vue 组件私实现 i18n 的方式，写法非常糟糕冗长。特别是在很多 index.vue 和 form.vue 内的实现很冗长。

实现表格列的 i18n 标题切换，在表格列标题栏实现 i18n 标题切换时，你应该去模仿操作栏的做法，把 label 换成 headerRenderer 箭头函数。用 headerRenderer 函数来动态渲染标签栏。

在 form.vue 内实现 i18n 时，你应该主动把对应的存储对象，从 ref 换成 computed。

在大多数的配置内，你都应该主动使用 computed 来完成 i18n 的动态切换，而不是写冗长的配置。主动将 ref 换成 computed 来实现动态 i18n 配置。

---

注意主动使用谷歌浏览器 MCP，在`apps\admin\package.json`内运行 dev 命令来实现自我测试。

## 03 为 `<PlusSearch>` 组件增加按钮文本的 i18n 设计变量

我注意到这里两个很不错的设计。

```plain
			:search-text="renderI18n($t('common.buttons.search'))"
			:reset-text="renderI18n($t('common.buttons.reset'))"
```

我希望你在 `apps\admin\src\composables\use-i18n-config\index.ts` 内设计一个合适的 computed 导出。让每一个 `<PlusSearch>` 都可以实现导入这两个能够实现动态变化的 i18n 文本。

同时，因为 `apps\admin\src\composables\use-i18n-config\index.ts` 组合式 api 更新了，请你去 .claude\skills\code-style\SKILL.md 和 .claude\skills\frontend-development\SKILL.md 增加使用说明

在 .claude\skills\code-style\SKILL.md 的 i18n 部分增加导出的新设计，实现搜索栏按钮的 i18n 变化。

在 .claude\skills\frontend-development\SKILL.md 内的搜索栏组件部分，说明 `<PlusSearch>` 组件增加需要配置的内容。

## 04 持续完成本项目的 i18n 改造和补全

按照 `apps\admin\src\docs\plan\2026-03-13-admin-i18n-route-progress.md` 的要求，请继续完成 i18n 的改造改写任务。

请你及时的检查，用 MCP 工具查看本地的记忆，继续上一次的 i18n 修改进度。

请及时的更新 `apps\admin\src\docs\plan\2026-03-13-admin-i18n-route-progress.md` 报告文件。

## 05 <!-- TODO:  --> withLocale 的设计非常失败

withLocale 的设计纯属是多此一举，这根本就不是实现 i18n 自动切换的方案。

注意到这个函数：

```ts
/** 让配置型 computed 显式依赖当前语言，切换语言时自动重算。 */
function withLocale<T>(factory: () => T) {
	return computed(() => {
		void locale.value;
		return factory();
	});
}
```

### `record-bug-fix-memory` 技能更新经验教训

中间设计一个 `void locale.value;` 是非常愚蠢的做法，这个做法硬着头皮来关联 i18n，这个做法是错误的。这个错误应该被记录到经验教训内，记录到 `record-bug-fix-memory` 技能内。

### 更新数个技能对 withLocale 的说明，避免直接使用这个错误的 withLocale，避免错误引导

请你在 `.claude\skills\code-style` 和 `.claude\skills\frontend-development` 内，或者是其他的 skills 内，删改，删除掉对 withLocale 的使用，应该直接换成 computed 。直接使用 computed 就行了。这个封装非常失败。

### 正确做法

直接把 withLocale 换成 vue 提供的 computed 即可。
