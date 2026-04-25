# repair-status-tag 组件使用文档

## 1. 文件存储结构

```plain
src/components/common/repair-status-tag/
├── index.vue      # 组件主文件，实现状态标签 UI 和动效
├── types.ts       # TypeScript 类型定义
└── index.md       # 组件使用文档说明
```

### 1.1 文件说明

|  文件名   |                    说明                    |
| :-------: | :----------------------------------------: |
| index.vue | 组件主文件，实现维修状态标签 UI 和呼吸动效 |
| types.ts  | TypeScript 类型定义，对外导出组件属性类型  |
| index.md  |              组件使用文档说明              |

## 2. 组件简介

`repair-status-tag` 是一个专门用于显示维修工单状态的标签组件。

### 2.1 设计特点

- **统一管理**：集中管理维修状态标签的样式，避免重复代码
- **五种状态**：支持待派单、已派单、处理中、已完成、已取消五种状态
- **丝绸动效**：处理中状态具有从左到右的波浪丝绸呼吸动效
- **易于扩展**：组件结构预留扩展接口，可随时为其他状态增加动效
- **类型安全**：直接使用 `src/types/repair.ts` 定义的业务类型

### 2.2 支持的状态

| 状态代码 | 状态名称 | 标签类型 | 动效 |
| :------: | :------: | :------: | :--: |
|  10001   |  待派单  | warning  |  无  |
|  10002   |  已派单  | primary  |  无  |
|  10003   |  处理中  | primary  |  有  |
|  10004   |  已完成  | success  |  无  |
|  10005   |  已取消  |  danger  |  无  |

## 3. 基础用法

### 3.1 自动导入方式（推荐）

```vue
<template>
	<repair-status-tag statusCd="10001" statusName="待派单" />
</template>
```

### 3.2 手动导入方式

```vue
<script setup lang="ts">
import RepairStatusTag from "@/components/common/repair-status-tag/index.vue";
</script>

<template>
	<RepairStatusTag statusCd="10003" statusName="处理中" />
</template>
```

## 4. Props 参数

|   参数名   |        类型        | 默认值 |              说明              |
| :--------: | :----------------: | :----: | :----------------------------: |
|  statusCd  | `RepairStatusCode` |   -    |      工单状态代码（必填）      |
| statusName |      `string`      |   ''   | 状态显示名称（可选，自动获取） |
|  animated  |     `boolean`      | `true` |          是否启用动效          |
|   plain    |     `boolean`      | `true` |        是否使用朴素样式        |

### 4.1 statusCd 参数说明

状态代码与 `src/constants/repair.ts` 中的 `REPAIR_STATUSES` 保持一致：

- `10001` - 待派单
- `10002` - 已派单
- `10003` - 处理中（带丝绸动效）
- `10004` - 已完成
- `10005` - 已取消

## 5. 使用场景

### 5.1 基础使用

```vue
<repair-status-tag statusCd="10001" statusName="待派单" />
```

### 5.2 使用默认状态名称

如果不传 `statusName`，组件会自动根据 `statusCd` 获取对应的状态名称：

```vue
<repair-status-tag statusCd="10003" />
```

### 5.3 禁用动效

```vue
<repair-status-tag statusCd="10003" statusName="处理中" :animated="false" />
```

### 5.4 在列表中使用

```vue
<template>
	<view v-for="item in repairList" :key="item.repairId" class="repair-item">
		<text>{{ item.title }}</text>
		<repair-status-tag :statusCd="item.statusCd" :statusName="item.statusName" />
	</view>
</template>
```

## 6. 完整示例

详细的使用示例和各种配置效果，请查看：

- **测试页面**：`src/pages/test-use/repair-status-tag.vue`

## 7. 注意事项

1. **状态代码类型**：`statusCd` 是字符串类型，传入数字时会被自动转换为字符串
2. **动效说明**：目前只有 `10003`（处理中）状态启用了丝绸呼吸动效，其他状态无动效
3. **自动导入**：本项目使用 `@uni-helper/vite-plugin-uni-components` 自动注册组件，无需手动导入即可使用

## 8. TypeScript 类型

如需导入类型定义：

```typescript
import type { RepairStatusTagProps } from "@/components/common/repair-status-tag/types";
```

## 9. 扩展说明

### 9.1 如何为其他状态添加动效

组件预留了扩展接口。如需为其他状态添加动效，修改 `index.vue` 中的 `STATUS_CONFIG_MAP` 配置：

```typescript
'10004': {
	statusCd: '10004',
	statusName: '已完成',
	tagType: 'success',
	animated: true, // 设置为 true 即可启用动效
},
```

### 9.2 如何修改动效样式

动效样式定义在组件的 `<style>` 区域，可根据需要调整：

- `silk-shine` 类：控制光泽层的位置和背景色
- `@keyframes silk-shine-move`：控制动画的移动轨迹和速度
