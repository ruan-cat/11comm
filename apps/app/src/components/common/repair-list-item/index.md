# repair-list-item 组件使用文档

## 1. 文件存储结构

```plain
src/components/common/repair-list-item/
├── index.vue      # 组件主文件
├── types.ts       # TypeScript 类型定义
└── index.md       # 组件使用文档
```

### 1.1 文件说明

|  文件名   |                 说明                  |
| :-------: | :-----------------------------------: |
| index.vue |  组件主文件，实现维修列表项 UI 逻辑   |
| types.ts  | TypeScript 类型定义文件，对外导出类型 |
| index.md  |           组件使用文档说明            |

## 2. 组件简介

`repair-list-item` 是一个通用的维修工单列表项组件，用于统一展示维修工单的核心信息，并提供灵活的操作按钮插槽。

### 2.1 设计特点

- **统一视觉**：标准化的卡片式设计，统一的字号、颜色和间距。
- **信息分层**：清晰区分标题、状态、详情内容和操作区域。
- **图标辅助**：使用 Carbon Icons 增强信息识别度。
- **灵活扩展**：通过插槽机制支持不同场景下的操作按钮。

## 3. 基础用法

### 3.1 自动导入方式（推荐）

```vue
<template>
	<repair-list-item :item="item">
		<template #action>
			<wd-button size="small">详情</wd-button>
		</template>
	</repair-list-item>
</template>
```

## 4. Props 参数

| 参数名 |    类型     | 默认值 |       说明       |
| :----: | :---------: | :----: | :--------------: |
|  item  | RepairOrder |   -    | 维修工单数据对象 |

## 5. Slots 插槽

| 插槽名 |      说明      |
| :----: | :------------: |
| action | 底部操作栏区域 |

## 6. 完整示例

详细的使用示例和各种配置效果，请查看：

- **测试页面**：`src/pages/test-use/repair-list-item.vue`
- **业务页面**：`src/pages-sub/repair/dispatch.vue`

## 7. TypeScript 类型

如需导入类型定义：

```typescript
import type { RepairListItemProps } from "@/components/common/repair-list-item/types";
```
