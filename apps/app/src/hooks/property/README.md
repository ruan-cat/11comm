# 物业管理 Hooks 使用文档

## 概述

本目录包含物业管理模块的 Vue3 Composition API Hooks，提供房屋申请相关的业务逻辑和辅助函数。

## 目录结构

```plain
src/hooks/property/
├── README.md                      # 使用文档（本文件）
└── use-property-apply-room.ts     # 房屋申请管理 Hook
```

---

## use-property-apply-room.ts

房屋申请管理 Hook，提供类型安全的路由参数处理和对象转换功能。

### 导入方式

```typescript
// 方式一：导入单个函数
import { extractApplyRecordParams, buildApplyFromParams } from "@/hooks/property/use-property-apply-room";

// 方式二：导入 Hook 函数
import { usePropertyApplyRoom } from "@/hooks/property/use-property-apply-room";
const { extractApplyRecordParams, buildApplyFromParams } = usePropertyApplyRoom();
```

### API 说明

#### 1. extractApplyRecordParams

从 `PropertyApplication` 对象提取跟踪记录所需参数。

**函数签名**

```typescript
function extractApplyRecordParams(apply: PropertyApplication): {
	ardId: string;
	communityId: string;
	roomId: string;
	roomName: string;
	state: string;
	stateName: string;
};
```

**使用场景**

从申请详情页跳转到跟踪记录页时，提取必要参数。

**完整示例**

```typescript
// 在 apply-room-detail.vue 中
import type { PropertyApplication } from "@/types/property-application";
import { TypedRouter } from "@/router";
import { extractApplyRecordParams } from "@/hooks/property/use-property-apply-room";
import { ref } from "vue";

const applyRoomInfo = ref<PropertyApplication>({
	ardId: "ARD001",
	communityId: "COM001",
	roomId: "ROOM001",
	roomName: "1号楼101",
	state: "1",
	stateName: "待验房",
	// ... 其他字段
});

/** 显示房屋申请跟踪记录 */
function showApplyRoomRecord() {
	// 提取必要参数
	const params = extractApplyRecordParams(applyRoomInfo.value);
	// 类型安全的路由跳转
	TypedRouter.toApplyRoomRecord(params);
}
```

---

#### 2. extractRecordDetailParams

从 `ApplicationRecord` 对象提取记录详情所需参数。

**函数签名**

```typescript
function extractRecordDetailParams(
	record: ApplicationRecord,
	communityId: string,
): {
	ardrId: string;
	applicationId: string;
	roomId: string;
	roomName: string;
	communityId: string;
	state: string;
	stateName: string;
};
```

**使用场景**

从记录列表页跳转到记录详情页时，提取必要参数。

**完整示例**

```typescript
// 在 apply-room-record.vue 中
import type { ApplicationRecord, PropertyApplication } from "@/types/property-application";
import { TypedRouter } from "@/router";
import { extractRecordDetailParams } from "@/hooks/property/use-property-apply-room";
import { ref } from "vue";

const applyRoomInfo = ref<PropertyApplication>({
	/* ... */
});

/** 显示记录详情 */
function showDetail(record: ApplicationRecord) {
	// 提取记录详情参数，附加 communityId
	const params = extractRecordDetailParams(record, applyRoomInfo.value.communityId);
	// 类型安全的路由跳转
	TypedRouter.toApplyRoomRecordDetail(params);
}
```

---

#### 3. buildApplyFromParams

从 URL 参数重建 `PropertyApplication` 对象的核心字段。

**函数签名**

```typescript
function buildApplyFromParams(params: {
	ardId: string;
	communityId: string;
	roomId: string;
	roomName: string;
	state: string;
	stateName: string;
}): Partial<PropertyApplication>;
```

**使用场景**

在目标页面的 `onLoad` 钩子中，从路由参数重建申请对象。

**完整示例**

```typescript
// 在 apply-room-record.vue 中
import type { PropertyApplication } from "@/types/property-application";
import { buildApplyFromParams } from "@/hooks/property/use-property-apply-room";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

const applyRoomInfo = ref<PropertyApplication>({} as PropertyApplication);

onLoad(
	(options: {
		ardId?: string;
		communityId?: string;
		roomId?: string;
		roomName?: string;
		state?: string;
		stateName?: string;
	}) => {
		// 检查所有必需参数是否存在
		if (
			options.ardId &&
			options.communityId &&
			options.roomId &&
			options.roomName &&
			options.state &&
			options.stateName
		) {
			// 从 URL 参数重建申请对象
			applyRoomInfo.value = buildApplyFromParams({
				ardId: options.ardId,
				communityId: options.communityId,
				roomId: options.roomId,
				roomName: options.roomName,
				state: options.state,
				stateName: options.stateName,
			}) as PropertyApplication;

			// 现在可以安全使用 applyRoomInfo
			console.log("房屋申请信息:", applyRoomInfo.value);
		}
	},
);
```

---

#### 4. buildRecordFromParams

从 URL 参数重建 `ApplicationRecord` 对象的核心字段。

**函数签名**

```typescript
function buildRecordFromParams(params: {
	ardrId: string;
	applicationId: string;
	roomId: string;
	roomName: string;
	communityId: string;
	state: string;
	stateName: string;
}): Partial<ApplicationRecord & { communityId: string }>;
```

**使用场景**

在记录详情页的 `onLoad` 钩子中，从路由参数重建记录对象。

**完整示例**

```typescript
// 在 apply-room-record-detail.vue 中
import type { ApplicationRecord } from "@/types/property-application";
import { buildRecordFromParams } from "@/hooks/property/use-property-apply-room";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

const recordInfo = ref<ApplicationRecord & { communityId?: string }>({} as ApplicationRecord);

onLoad(
	(options: {
		ardrId?: string;
		applicationId?: string;
		roomId?: string;
		roomName?: string;
		communityId?: string;
		state?: string;
		stateName?: string;
	}) => {
		// 检查所有必需参数是否存在
		if (
			options.ardrId &&
			options.applicationId &&
			options.roomId &&
			options.roomName &&
			options.communityId &&
			options.state &&
			options.stateName
		) {
			// 从 URL 参数重建记录对象
			recordInfo.value = buildRecordFromParams({
				ardrId: options.ardrId,
				applicationId: options.applicationId,
				roomId: options.roomId,
				roomName: options.roomName,
				communityId: options.communityId,
				state: options.state,
				stateName: options.stateName,
			}) as ApplicationRecord & { communityId: string };

			// 现在可以安全使用 recordInfo
			console.log("记录详情:", recordInfo.value);
		}
	},
);
```

---

## 完整路由链路示例

以下是房屋申请模块的完整路由跳转链路示例：

### 链路 1：列表 → 详情 → 记录

```typescript
// 1. apply-room.vue - 房屋申请列表
import { TypedRouter } from "@/router";

function toApplyRoomDetail(item: PropertyApplication) {
	TypedRouter.toApplyRoomDetail(item.ardId, item.communityId);
}
```

```typescript
// 2. apply-room-detail.vue - 房屋申请详情
import { TypedRouter } from "@/router";
import { extractApplyRecordParams } from "@/hooks/property/use-property-apply-room";

function showApplyRoomRecord() {
	const params = extractApplyRecordParams(applyRoomInfo.value);
	TypedRouter.toApplyRoomRecord(params);
}
```

```typescript
// 3. apply-room-record.vue - 申请跟踪记录
import { buildApplyFromParams } from '@/hooks/property/use-property-apply-room'

onLoad((options) => {
  if (/* 参数完整 */) {
    applyRoomInfo.value = buildApplyFromParams(options) as PropertyApplication
  }
})
```

### 链路 2：记录 → 记录处理

```typescript
// apply-room-record.vue
import { TypedRouter } from "@/router";

function addRecord() {
	const params = {
		ardId: applyRoomInfo.value.ardId,
		communityId: applyRoomInfo.value.communityId,
		roomId: applyRoomInfo.value.roomId,
		roomName: applyRoomInfo.value.roomName,
		state: applyRoomInfo.value.state,
		stateName: applyRoomInfo.value.stateName,
	};
	TypedRouter.toApplyRoomRecordHandle(params);
}
```

```typescript
// apply-room-record-handle.vue
import { buildApplyFromParams } from '@/hooks/property/use-property-apply-room'

onLoad((options) => {
  if (/* 参数完整 */) {
    applyRoomInfo.value = buildApplyFromParams(options) as PropertyApplication
  }
})
```

### 链路 3：记录 → 记录详情

```typescript
// apply-room-record.vue
import { TypedRouter } from "@/router";
import { extractRecordDetailParams } from "@/hooks/property/use-property-apply-room";

function showDetail(record: ApplicationRecord) {
	const params = extractRecordDetailParams(record, applyRoomInfo.value.communityId);
	TypedRouter.toApplyRoomRecordDetail(params);
}
```

```typescript
// apply-room-record-detail.vue
import { buildRecordFromParams } from '@/hooks/property/use-property-apply-room'

onLoad((options) => {
  if (/* 参数完整 */) {
    recordInfo.value = buildRecordFromParams(options) as ApplicationRecord & { communityId: string }
  }
})
```

---

## 最佳实践

### 1. 参数完整性检查

在接收路由参数时，务必检查所有必需参数是否存在：

```typescript
onLoad((options) => {
	// ✅ 正确：检查所有参数
	if (
		options.ardId &&
		options.communityId &&
		options.roomId &&
		options.roomName &&
		options.state &&
		options.stateName
	) {
		applyRoomInfo.value = buildApplyFromParams(options) as PropertyApplication;
	} else {
		// 处理参数缺失的情况
		uni.showToast({ title: "参数缺失", icon: "none" });
	}
});

// ❌ 错误：不检查参数直接使用
onLoad((options) => {
	applyRoomInfo.value = buildApplyFromParams(options) as PropertyApplication;
});
```

### 2. 类型断言

`buildApplyFromParams` 和 `buildRecordFromParams` 返回 `Partial<T>` 类型，使用时需要类型断言：

```typescript
// ✅ 正确：使用类型断言
const apply = buildApplyFromParams(options) as PropertyApplication;

// ❌ 错误：缺少类型断言
const apply = buildApplyFromParams(options); // 类型为 Partial<PropertyApplication>
```

### 3. 避免 JSON 传参

不要使用 `JSON.stringify` 传递复杂对象：

```typescript
// ❌ 错误：使用 JSON.stringify
uni.navigateTo({
	url: `/pages-sub/property/apply-room-record?apply=${JSON.stringify(applyRoomInfo.value)}`,
});

// ✅ 正确：使用参数提取函数
const params = extractApplyRecordParams(applyRoomInfo.value);
TypedRouter.toApplyRoomRecord(params);
```

### 4. 只传递必要字段

辅助函数只提取必要的标识符字段，不传递完整对象：

```typescript
// ✅ 正确：只传递必要字段
const params = extractApplyRecordParams(applyRoomInfo.value);
// params = { ardId, communityId, roomId, roomName, state, stateName }

// ❌ 错误：传递完整对象（不推荐）
TypedRouter.toApplyRoomRecord(applyRoomInfo.value); // 参数过多
```

---

## 优势对比

### 传统方式 vs 新方式

| 对比项         | 传统方式 (JSON.stringify) | 新方式 (辅助函数)      |
| :------------- | :------------------------ | :--------------------- |
| **类型安全**   | ❌ 不是类型安全的         | ✅ 完全类型安全        |
| **参数长度**   | ❌ 可能超出 URL 限制      | ✅ 参数长度可控        |
| **TypeScript** | ❌ 无法利用类型检查       | ✅ 编译时错误检测      |
| **IDE 支持**   | ❌ 无智能提示             | ✅ 完整智能提示        |
| **可维护性**   | ❌ 修改字段需要手动同步   | ✅ TypeScript 自动检测 |
| **错误提示**   | ❌ 运行时才发现错误       | ✅ 编译时就能发现错误  |
| **代码可读性** | ❌ 难以理解传递了哪些参数 | ✅ 清晰明了的参数结构  |

---

## 注意事项

1. **参数完整性**：务必在接收参数时检查所有必需参数是否存在
2. **类型断言**：`build*FromParams` 函数返回 `Partial<T>`，使用时需要类型断言
3. **只传必要字段**：只提取必要的标识符字段，不传递完整对象
4. **避免 JSON**：不要使用 `JSON.stringify` 传递对象
5. **配合 TypedRouter**：这些函数应该与 `TypedRouter` 配合使用，确保类型安全

---

## 相关文档

- [TypedRouter 路由工具类](../../router/README.md)
- [路由类型定义](../../types/routes.ts)
- [物业申请类型定义](../../types/property-application.ts)

---

## 变更日志

| 版本  | 日期       | 说明                             |
| :---- | :--------- | :------------------------------- |
| 1.0.0 | 2025-01-XX | 初始版本，提供基础的参数转换功能 |
