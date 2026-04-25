# 2026-01-12 UnoCSS 图标加载失败问题报告

## 1. 问题描述

微信小程序编译期间出现以下警告：

```log
[unocss] failed to load icon "carbon-inbox"
[unocss] failed to load icon "carbon-footprints"
[unocss] failed to load icon "carbon-inspect"
[unocss] failed to load icon "carbon-number"
[unocss] failed to load icon "carbon-lock"
```

## 2. 问题原因

这些图标名称在 Carbon 图标集中不存在。经核实，本地安装的 `@iconify-json/carbon@1.2.15` 版本正常（最新版为 1.2.16），问题在于图标名称本身错误。

## 3. 影响范围

共涉及 5 个文件，8 处代码：

| 序号 |       错误图标        |                       文件路径                        | 行号 |    使用场景    |
| :--: | :-------------------: | :---------------------------------------------------: | :--: | :------------: |
|  1   |   `i-carbon-inbox`    |       `src/pages/test-use/z-paging-loading.vue`       | 301  | 空数据提示图标 |
|  2   | `i-carbon-footprints` | `src/pages-sub/property/apply-room-record-detail.vue` | 197  |  跟踪备注图标  |
|  3   | `i-carbon-footprints` |    `src/pages-sub/property/apply-room-detail.vue`     | 564  |  申请备注图标  |
|  4   | `i-carbon-footprints` |    `src/pages-sub/property/apply-room-detail.vue`     | 575  |  验房备注图标  |
|  5   | `i-carbon-footprints` |    `src/pages-sub/property/apply-room-detail.vue`     | 586  |  审核备注图标  |
|  6   |  `i-carbon-inspect`   |     `src/pages-sub/inspection/execute-single.vue`     | 306  |  巡检图标配置  |
|  7   |   `i-carbon-number`   |      `src/pages-sub/repair/select-resource.vue`       | 515  |  购买数量图标  |
|  8   |    `i-carbon-lock`    |     `src/components/activity/activity-error.vue`      |  66  | 无权限错误图标 |

## 4. 修复建议

|       错误图标        |       推荐替代        |             备选方案              |
| :-------------------: | :-------------------: | :-------------------------------: |
|   `i-carbon-inbox`    |   `i-carbon-email`    |         `i-carbon-folder`         |
| `i-carbon-footprints` | `i-carbon-pedestrian` |  `i-carbon-direction-loop-right`  |
|  `i-carbon-inspect`   |    `i-carbon-view`    |         `i-carbon-search`         |
|   `i-carbon-number`   |  `i-carbon-hashtag`   | `i-carbon-character-whole-number` |
|    `i-carbon-lock`    |   `i-carbon-locked`   |        `i-carbon-password`        |

## 5. 参考资源

- Carbon 图标集完整列表：https://icon-sets.iconify.design/carbon/
