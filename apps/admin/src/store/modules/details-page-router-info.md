# 详情页路由信息存储工具

## 📖 工具介绍

`details-page-router-info.ts` 是一个基于路由地址的键值对存储工具，专门用于管理页面跳转时的路由信息。该工具使用 Pinia 和组合式 API 实现，提供了完整的数据持久化功能。

### 设计思路

1. **键值对存储**：以路由名称 (`name`) 为 key，路由信息为 value 的 Map 结构
2. **数据持久化**：集成 `storageLocal()` 实现本地存储，确保刷新页面后数据不丢失
3. **智能合并**：使用 `lodash-es` 的 `merge` 函数，支持数据的动态增量更新
4. **组合式 API**：使用现代化的组合式 API 设计，提供更好的类型支持和开发体验

## 🔧 核心功能

### 主要 API

| 函数名              | 功能描述         | 参数                   | 返回值                  |
| ------------------- | ---------------- | ---------------------- | ----------------------- |
| `setRouteInfo`      | 设置路由信息     | `SetRouteInfoParams`   | `void`                  |
| `getRouteInfo`      | 获取路由信息     | `key: RouteRecordName` | `RouteInfoData \| null` |
| `removeRouteInfo`   | 删除指定路由信息 | `key: string`          | `void`                  |
| `clearAllRouteInfo` | 清空所有路由信息 | -                      | `void`                  |

### 类型定义

```typescript
/** 路由信息数据类型 */
export interface RouteInfoData {
	/** 路由元信息 */
	meta?: {
		/** 激活路径 - 前驱页面的路由地址 */
		activePath?: string;
		/** 其他元信息 */
		[key: string]: any;
	};
	/** 其他路由信息 */
	[key: string]: any;
}

/** setRouteInfo 参数类型 */
export interface SetRouteInfoParams {
	/** 路由名称作为 key */
	key: RouteRecordName;
	/** 路由信息 */
	info: RouteInfoData;
}
```

## 📚 使用示例

### 基础用法

```typescript
import { useDetailsPageRouterInfoStoreHook } from "@/store/modules/details-page-router-info";

// 获取 store 实例
const detailsPageRouterInfoStore = useDetailsPageRouterInfoStoreHook();

// 设置路由信息
detailsPageRouterInfoStore.setRouteInfo({
	key: "property-manage-community-[id]", // 路由名称
	info: {
		meta: {
			activePath: "/property/manage/list", // 前驱页面路径
			title: "管理小区详情",
			icon: "community",
		},
		params: { id: "123" },
		query: { tab: "basic" },
	},
});

// 获取路由信息
const routeInfo = detailsPageRouterInfoStore.getRouteInfo("property-manage-community-[id]");
console.log(routeInfo?.meta?.activePath); // "/property/manage/list"

// 删除路由信息
detailsPageRouterInfoStore.removeRouteInfo("/property/manage/community/123");

// 清空所有路由信息
detailsPageRouterInfoStore.clearAllRouteInfo();
```

### 数据合并示例

```typescript
const store = useDetailsPageRouterInfoStoreHook();

// 第一次设置
store.setRouteInfo({
	key: "user-detail-[id]", // 路由名称
	info: {
		meta: {
			activePath: "/user/list",
			title: "用户详情",
		},
	},
});

// 第二次设置 - 会与第一次的数据合并
store.setRouteInfo({
	key: "user-detail-[id]", // 路由名称
	info: {
		meta: {
			icon: "user", // 新增字段
			title: "用户详情页面", // 覆盖已有字段
		},
		params: { id: "456" }, // 新增字段
	},
});

// 最终数据结构
const result = store.getRouteInfo("user-detail-[id]");
console.log(result);
/*
{
  meta: {
    activePath: "/user/list",    // 保持不变
    title: "用户详情页面",       // 被覆盖
    icon: "user"                 // 新增
  },
  params: { id: "456" }          // 新增
}
*/
```

### 在组件中使用

```vue
<script setup lang="ts">
import { useDetailsPageRouterInfoStoreHook } from "@/store/modules/details-page-router-info";

const detailsStore = useDetailsPageRouterInfoStoreHook();

// 设置当前页面的路由信息
const setCurrentRouteInfo = () => {
	detailsStore.setRouteInfo({
		key: route.name, // 使用路由名称
		info: {
			meta: {
				activePath: "/parent/page",
				timestamp: Date.now(),
			},
		},
	});
};

// 获取路由信息
const getCurrentRouteInfo = () => {
	const info = detailsStore.getRouteInfo(route.name); // 使用路由名称
	return info;
};
</script>
```

## 🚀 特性说明

### 1. 自动数据持久化

- 所有数据变更都会自动保存到本地存储
- 页面刷新后数据自动恢复
- 使用项目统一的存储命名空间

### 2. 智能数据合并

- 重复设置同一路由的信息时，使用 `merge` 函数合并数据
- 新字段会被添加，同名字段会被覆盖
- 保持数据结构的完整性

### 3. 类型安全

- 完整的 TypeScript 类型支持
- 编译时类型检查
- IDE 智能提示

### 4. 错误处理

- 参数校验和错误提示
- 优雅的异常处理

## 🔄 与第二阶段工具的关系

该存储工具是第二阶段"跳转详情页路由工具"的基础，两者高度耦合：

- **存储工具**：负责纯粹的数据存储和管理
- **路由工具**：负责封装跳转时的数据处理逻辑

在实际使用中，通常不会直接调用存储工具的 API，而是通过第二阶段的路由工具来间接使用。

## ⚠️ 注意事项

1. **存储空间管理**：长期使用可能积累大量路由信息，建议定期清理
2. **key 的唯一性**：确保路由地址的唯一性，避免数据覆盖
3. **数据结构一致性**：建议保持 `RouteInfoData` 结构的一致性

## 🎯 最佳实践

1. **命名规范**：使用完整的路由名称作为 key
2. **数据清理**：在适当时机清理不再需要的路由信息
3. **错误处理**：调用 API 前检查参数的有效性
4. **配合使用**：与第二阶段的路由跳转工具配合使用，获得最佳体验
