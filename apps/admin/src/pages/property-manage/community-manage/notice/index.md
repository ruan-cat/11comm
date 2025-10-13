# 小区公示 列表页 提示词

请深度思考。

对 `apps\admin\src\pages\property-manage\community-manage\notice\index.vue` 小区公示 列表页，使用 `make-dialog` 和 `make-list-page` 子代理。

生成合适的模拟假数据。

## 01

请你对 `apps\admin\src\pages\property-manage\community-manage\notice` 文件夹的代码，使用 `code-style` 子代理，确保这些文件遵守子代理的要求，特别是 i18n 的代码要求。

另外，请你认真检查之前的代码。请不要随意地给业务代码增加字段。不要增加额外的字段，不要更改掉字段的命名。

## 02 处理 i18n 的模板插值语法问题

请你在 `apps\admin\src\pages\property-manage\community-manage\notice\index.vue` 内，使用 `code-style` 子代理，处理 i18n 的模板插值语法问题。请使用正确的函数来使用模板插值语法的 i18n 翻译字段。

## 03 处理样式问题

`apps\admin\src\pages\property-manage\community-manage\notice\index.vue` 内，使用 `code-style` 子代理，不要增加样式。

## 04 `小区公示_列表查询_VO`

请深度思考。

该业务类型 `小区公示_列表查询_VO` 原来的写法是：

```ts
interface 小区公示_列表查询_VO {
	公示标题?: string;
	公示类型?: string;
}
```

请你不要新增多余的字段。请你严格遵守 `code-style` 子代理的要求，请你主动运行 `code-style` 子代理，并将类型更改回来。

请你统一对 `apps\admin\src\pages\property-manage\community-manage\notice` 文件夹的代码，做业务类型更改后的适配。
