# 基于路由名称的键值对存储工具

## 简介

`route-info.ts` 是一个基于路由名称的键值对存储工具，使用 Pinia 和组合式 API 实现。它提供了一种便捷的方式来存储和获取与特定路由相关的信息，特别适用于需要在不同页面间传递和保存路由状态的场景。

## 核心功能

本工具本质上是一个 Map 对象，其中：
- **key**: 路由的名称（RouteRecordName）
- **value**: 路由相关信息（RouteInfoData）

### 主要特性

1. **自动数据持久化**：使用 `storageLocal()` 函数实现数据的本地存储，确保数据在页面刷新后不会丢失
2. **智能数据合并**：使用 lodash-es 的 `merge` 函数，确保数据可以动态增加路由属性，新值会覆盖旧值
3. **类型安全**：提供完整的 TypeScript 类型定义，确保类型安全
4. **错误处理**：内置错误处理机制，防止因参数错误导致的异常

## 类型定义

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

/** Store 状态类型 */
export interface RouteInfoState {
  /** 路由信息映射表，key 为路由名称，value 为路由信息 */
  routeInfoMap: Record<string, RouteInfoData>;
}

/** setRouteInfo 参数类型 */
export interface SetRouteInfoParams {
  /** 路由名称作为 key */
  key: RouteRecordName;
  /** 路由信息 */
  info: RouteInfoData;
}
```

## 核心 API

### setRouteInfo

设置路由信息，支持智能合并已有数据。

```typescript
function setRouteInfo(params: SetRouteInfoParams): void
```

参数：
- `params`: 包含 key 和 info 的参数对象
  - `key`: 路由的名称，类型为 RouteRecordName
  - `info`: 路由信息，类型为 RouteInfoData

示例：

```typescript
import { useRouteInfoStoreHook } from '@/store/modules/route-info';

const routeInfoStore = useRouteInfoStoreHook();

routeInfoStore.setRouteInfo({
  key: 'detail-page',
  info: {
    meta: {
      activePath: '/list-page',
      title: '详情页'
    },
    customData: {
      id: 123
    }
  }
});
```

### getRouteInfo

获取指定路由名称的路由信息。

```typescript
function getRouteInfo(key: RouteRecordName): RouteInfoData | null
```

参数：
- `key`: 路由的名称，类型为 RouteRecordName

返回值：
- 路由信息对象或 null（如果不存在）

示例：

```typescript
import { useRouteInfoStoreHook } from '@/store/modules/route-info';

const routeInfoStore = useRouteInfoStoreHook();
const detailPageInfo = routeInfoStore.getRouteInfo('detail-page');

if (detailPageInfo?.meta?.activePath) {
  console.log('前驱页面路径:', detailPageInfo.meta.activePath);
}
```

### removeRouteInfo

删除指定路由名称的路由信息。

```typescript
function removeRouteInfo(key: RouteRecordName): void
```

参数：
- `key`: 路由的名称，类型为 RouteRecordName

### clearAllRouteInfo

清空所有路由信息。

```typescript
function clearAllRouteInfo(): void
```

### getAllRouteInfo

获取所有路由信息的映射表。

```typescript
const getAllRouteInfo: ComputedRef<Record<string, RouteInfoData>>
```

## 使用方式

### 在组件中使用

```typescript
import { useRouteInfoStoreHook } from '@/store/modules/route-info';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const routeInfoStore = useRouteInfoStoreHook();
    
    // 设置路由信息
    routeInfoStore.setRouteInfo({
      key: 'user-detail',
      info: {
        meta: {
          activePath: '/user-list',
          title: '用户详情'
        }
      }
    });
    
    // 获取路由信息
    const userDetailInfo = routeInfoStore.getRouteInfo('user-detail');
    
    return {
      userDetailInfo
    };
  }
});
```

### 在路由守卫中使用

```typescript
import { useRouteInfoStoreHook } from '@/store/modules/route-info';
import { Router } from 'vue-router';

export function setupRouterGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const routeInfoStore = useRouteInfoStoreHook();
    const routeInfo = routeInfoStore.getRouteInfo(to.name);
    
    if (routeInfo?.meta?.activePath) {
      // 设置当前路由的 meta 信息
      to.meta.activePath = routeInfo.meta.activePath;
    }
    
    next();
  });
}
```

## 与第二阶段路由工具的关系

本工具作为基础设施，将在第二阶段的「跳转详情页路由工具」中被高度耦合使用。它负责纯粹的数据存储，而「跳转详情页路由工具」将负责封装跳路由时的数据处理细节。

## 注意事项

1. 路由名称（key）会被转换为字符串存储，确保在使用时考虑到这一点
2. 在设置大量数据时要注意本地存储的容量限制
3. 为避免命名冲突，本工具使用了命名空间前缀存储数据

## 最佳实践

1. 在路由跳转前设置必要的路由信息
2. 在目标路由的守卫或组件中获取并使用这些信息
3. 当不再需要某些路由信息时，及时清理以避免存储空间浪费
4. 使用 TypeScript 类型系统确保类型安全