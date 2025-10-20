<!--
  一次性提示词
  尚未开始使用
-->

# 为每个页面的路由配置，增加 icon 图标

我需要你帮我替换掉默认的 `f7:menu` 图标。

- 处理的文件范围： `apps/admin/src/pages/**/index.vue` 全部名称为 `index.vue` 的文件，仅仅处理页面文件。
- icon 图标来源： iconify
- icon 图标格式： `图标集:图标名` ，**必须满足**该格式。
- 可参考的数据集合： `@iconify/json` 数据包。

我需要你遍历需要处理的页面文件，你仅仅只需要阅读每一个 `index.vue` 的 definePage 路由配置对象即可。按照以下步骤来实现默认 icon 替换：

1. 阅读每一个 `index.vue` 的 definePage 路由配置对象。
2. 阅读 meta.title 标题。
3. 根据每一个页面的标题，自己去寻找语义化强的，最满足标题的 icon。
4. 替换掉默认的 meta.icon 图标。
