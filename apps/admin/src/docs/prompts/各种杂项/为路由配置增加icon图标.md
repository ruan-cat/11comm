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

## 01 回答 AI 问题

1. 图标集偏好： 我没有明显的偏好。你看情况来即可。你喜欢什么就用什么吧。
2. 图标风格一致性： 优先弄**实心风格**的图标，本身无颜色的图标。
3. 页面层级处理：
   - 父级页面和子页面的图标选择，没有区别。
   - 详情页面，保留默认的 `f7:menu` 图标，不做设置。
4. 处理范围确认：
   - 没有默认图标时，就提供默认图标。
   - 只需要处理 meta.icon 。其他配置**绝对不做处理**。
5. 特殊页面处理： 不考虑什么平衡图标的表现力和简洁性。我不考虑这个方向，我考虑的是至少提供**有差异性的**，**实心风格**的图标。

## 02 更替其他可用的 icon 标签

以下页面的 index.vue 文件，其 meta.icon 标签无法渲染。是因为这些 icon 不存在，请你换成存在的图标。

- /property-manage/report-manage/arrears-details-list
- /property-manage/patrol-manage/path
- /property-manage/repairs-manage/repairs-setting
- /setting-manage/organize-manage/org-info
- /setting-manage/organize-manage/working-schedule
- /setting-manage/system-manage/register-protocol
- /setting-manage/system-manage/community-configuration
- /dev-team/config-manage/item

- apps\admin\src\pages\property-manage\expense-manage 全部**费用管理**的页面都被你遗漏了，请补全设置 icon
- apps\admin\src\pages\property-manage\contract-manage 全部**合同管理**的页面都被你遗漏了，请补全设置 icon
- apps\admin\src\pages\property-manage\house-property-manage 有部分**房产管理**的页面都被你遗漏了，请补全设置 icon
