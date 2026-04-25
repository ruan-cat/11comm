<!-- 一次性提示词 已完成 -->

# selectFloor、selectUnit、selectRoom 三页面迁移计划

> **文档创建时间**：2025-11-17
> **计划状态**：待执行
> **预计工期**：4.5-6.5 天
> **负责人**：待分配

---

## 一、技术决策总结

基于需求分析和技术评估，本次迁移将采用以下技术方案：

|     技术点     |      选定方案      |         备选方案         |                   选择理由                   |
| :------------: | :----------------: | :----------------------: | :------------------------------------------: |
| 页面间数据传递 |    Pinia Store     | uni.$emit / localStorage | 类型安全、响应式、可追踪、符合 Vue3 最佳实践 |
|  搜索功能实现  |   wd-search 组件   |  wd-input / 原生 input   |        UI 统一、功能完整、用户体验好         |
|  列表分页策略  | z-paging 上拉加载  |      一次性加载全部      |      支持大数据量、用户体验好、性能优秀      |
|   迁移优先级   | 先维修录单后选择器 |   先选择器 / 同步迁移    |     符合业务流程、便于集成测试、风险可控     |

---

## 二、项目背景与目标

### 2.1 项目背景

selectFloor（选择楼栋）、selectUnit（选择单元）、selectRoom（选择房屋）三个页面是**级联选择器组件**，用于在智慧社区物业管理系统中逐级选择房屋位置信息。

这三个页面在以下业务模块中被广泛使用：

- **维修工单录入** (`repairAdd.vue`) - 主要使用场景
- **投诉录单** (`complaintOrder.vue`)
- **采购申请** (`purchaseRequest.vue`)
- **抄表录入** (`addmeter.vue`)
- **房屋详情** (`roomDetail.vue`)

### 2.2 迁移目标

|   目标类型   | 具体目标                                                  |
| :----------: | :-------------------------------------------------------- |
| **功能目标** | 完整迁移三个选择器页面的所有功能（选择、搜索、分页）      |
| **技术目标** | Vue2 Options API → Vue3 Composition API + TypeScript      |
| **架构目标** | ColorUI + Java110Context → wot-design-uni + Alova + Pinia |
| **质量目标** | 类型覆盖率 100%、代码规范 100%、功能验收 100%             |

---

## 三、路由路径映射

根据 `docs\prompts\route-migration-map.yml` 映射表：

| 页面名称 |                    旧项目路径                     |                新项目路径                 | 页面类型 |
| :------: | :-----------------------------------------------: | :---------------------------------------: | :------: |
| 选择楼栋 | `gitee-example/pages/selectFloor/selectFloor.vue` | `src/pages-sub/selector/select-floor.vue` | 分包页面 |
| 选择单元 |  `gitee-example/pages/selectUnit/selectUnit.vue`  | `src/pages-sub/selector/select-unit.vue`  | 分包页面 |
| 选择房屋 |  `gitee-example/pages/selectRoom/selectRoom.vue`  | `src/pages-sub/selector/select-room.vue`  | 分包页面 |

**注意**：三个页面统一归属于 **`selector_modules`** 模块，放在 `src/pages-sub/selector/` 目录下。

---

## 四、页面功能与调用关系

### 4.1 功能概述

|  页面名称   | 功能说明 | 数据层级 |               依赖参数               |
| :---------: | :------: | :------: | :----------------------------------: |
| selectFloor | 选择楼栋 | 第 1 级  |        社区 ID (communityId)         |
| selectUnit  | 选择单元 | 第 2 级  |          楼栋 ID (floorId)           |
| selectRoom  | 选择房屋 | 第 3 级  | 楼栋 ID + 单元 ID (floorId + unitId) |

### 4.2 数据流转架构

```plain
维修录单页 (repairAdd.vue)
    ↓ 点击"选择楼栋"
selectFloor.vue
    ↓ 选中楼栋 → 存入 Pinia Store → 返回
维修录单页读取 Store 显示"X栋"
    ↓ 点击"选择单元"（携带 floorId）
selectUnit.vue
    ↓ 选中单元 → 存入 Pinia Store → 返回
维修录单页读取 Store 显示"X单元"
    ↓ 点击"选择房屋"（携带 floorId + unitId）
selectRoom.vue
    ↓ 选中房屋 → 存入 Pinia Store → 返回
维修录单页读取 Store 显示"XXX室"
```

### 4.3 参数传递方式

#### 4.3.1 调用页面 → 选择器页面

|        传递方向         | 传递方式 |      参数名称       | 参数类型 | 是否必填 |
| :---------------------: | :------: | :-----------------: | :------: | :------: |
| repairAdd → selectFloor |    -     |          -          |    -     |    -     |
| repairAdd → selectUnit  | URL 参数 |      `floorId`      |  string  |    是    |
| repairAdd → selectRoom  | URL 参数 | `floorId`, `unitId` |  string  |    是    |

#### 4.3.2 选择器页面 → 调用页面

|        传递方向         |  传递方式   |               数据结构               | 示例                                                                |
| :---------------------: | :---------: | :----------------------------------: | :------------------------------------------------------------------ |
| selectFloor → repairAdd | Pinia Store |   `{floorId, floorNum, floorName}`   | `{floorId: 'F001', floorNum: '1', floorName: '1栋'}`                |
| selectUnit → repairAdd  | Pinia Store |     `{unitId, unitNum, floorId}`     | `{unitId: 'U001', unitNum: '1', floorId: 'F001'}`                   |
| selectRoom → repairAdd  | Pinia Store | `{roomId, roomNum, unitId, floorId}` | `{roomId: 'R001', roomNum: '101', unitId: 'U001', floorId: 'F001'}` |

### 4.4 旧项目实现方式（需要改进的地方）

#### 问题 1：直接修改上一页面数据（Vue3 不支持）

```javascript
// 旧代码 - Vue2 特性
let pages = getCurrentPages();
let prevPage = pages[pages.length - 2];
prevPage.floorName = item.name; // 直接修改
```

**新方案**：使用 Pinia Store 替代

#### 问题 2：使用微信专用 API（不跨平台）

```javascript
// 旧代码
wx.navigateBack({ delta: 1 });
```

**新方案**：使用 `uni.navigateBack()` 替代

---

## 五、迁移阶段规划

### 阶段 1：基础设施准备（预计 1-2 天）

#### 1.1 创建类型定义

**文件**：`src/types/selector.ts`

```typescript
/** 楼栋信息 */
export interface Floor {
	/** 楼栋ID */
	floorId: string;
	/** 楼栋编号 */
	floorNum: string;
	/** 楼栋名称 */
	floorName: string;
	/** 所属社区ID */
	communityId: string;
}

/** 单元信息 */
export interface Unit {
	/** 单元ID */
	unitId: string;
	/** 单元编号 */
	unitNum: string;
	/** 所属楼栋ID */
	floorId: string;
}

/** 房屋信息 */
export interface Room {
	/** 房屋ID */
	roomId: string;
	/** 房间号 */
	roomNum: string;
	/** 所属单元ID */
	unitId: string;
	/** 所属楼栋ID */
	floorId: string;
}

/** 选择器通用查询参数 */
export interface SelectorQueryParams {
	/** 社区ID */
	communityId: string;
	/** 页码 */
	page: number;
	/** 每页条数 */
	row: number;
}

/** 楼栋查询参数 */
export interface FloorQueryParams extends SelectorQueryParams {
	/** 楼栋编号（模糊搜索） */
	floorNum?: string;
}

/** 单元查询参数 */
export interface UnitQueryParams extends SelectorQueryParams {
	/** 楼栋ID */
	floorId: string;
	/** 单元编号（模糊搜索） */
	unitNum?: string;
}

/** 房屋查询参数 */
export interface RoomQueryParams extends SelectorQueryParams {
	/** 楼栋ID */
	floorId: string;
	/** 单元ID */
	unitId: string;
	/** 房间号（模糊搜索） */
	roomNum?: string;
}
```

#### 1.2 创建 Pinia Store

**文件**：`src/stores/useSelectorStore.ts`

```typescript
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Floor, Unit, Room } from "@/types/selector";

/** 选择器状态管理 */
export const useSelectorStore = defineStore("selector", () => {
	// 状态
	const selectedFloor = ref<Floor | null>(null);
	const selectedUnit = ref<Unit | null>(null);
	const selectedRoom = ref<Room | null>(null);

	// 计算属性 - 格式化显示文本
	const floorText = computed(() => (selectedFloor.value ? `${selectedFloor.value.floorNum}栋` : "请选择"));

	const unitText = computed(() => (selectedUnit.value ? `${selectedUnit.value.unitNum}单元` : "请选择"));

	const roomText = computed(() => (selectedRoom.value ? `${selectedRoom.value.roomNum}室` : "请选择"));

	// 方法
	const selectFloor = (floor: Floor) => {
		selectedFloor.value = floor;
		// 清空下级选择
		selectedUnit.value = null;
		selectedRoom.value = null;
	};

	const selectUnit = (unit: Unit) => {
		selectedUnit.value = unit;
		// 清空下级选择
		selectedRoom.value = null;
	};

	const selectRoom = (room: Room) => {
		selectedRoom.value = room;
	};

	const clearSelection = () => {
		selectedFloor.value = null;
		selectedUnit.value = null;
		selectedRoom.value = null;
	};

	return {
		// 状态
		selectedFloor,
		selectedUnit,
		selectedRoom,
		// 计算属性
		floorText,
		unitText,
		roomText,
		// 方法
		selectFloor,
		selectUnit,
		selectRoom,
		clearSelection,
	};
});
```

#### 1.3 创建 API 接口定义

##### 1.3.1 楼栋 API

**文件**：`src/api/floor.ts`

```typescript
import type { Floor, FloorQueryParams } from "@/types/selector";
import type { ApiResponse, PageResult } from "@/types/api";

/**
 * 获取楼栋列表
 * @param params 查询参数
 */
export function getFloorList(params: FloorQueryParams) {
	return useRequest<ApiResponse<PageResult<Floor>>>(
		(data) => ({
			url: "/api/floor/list",
			method: "GET",
			params: data,
		}),
		{
			initialData: params,
		},
	);
}
```

##### 1.3.2 单元 API

**文件**：`src/api/unit.ts`

```typescript
import type { Unit, UnitQueryParams } from "@/types/selector";
import type { ApiResponse, PageResult } from "@/types/api";

/**
 * 获取单元列表
 * @param params 查询参数
 */
export function getUnitList(params: UnitQueryParams) {
	return useRequest<ApiResponse<PageResult<Unit>>>(
		(data) => ({
			url: "/api/unit/list",
			method: "GET",
			params: data,
		}),
		{
			initialData: params,
		},
	);
}
```

##### 1.3.3 房屋 API

**文件**：`src/api/room.ts`

```typescript
import type { Room, RoomQueryParams } from "@/types/selector";
import type { ApiResponse, PageResult } from "@/types/api";

/**
 * 获取房屋列表
 * @param params 查询参数
 */
export function getRoomList(params: RoomQueryParams) {
	return useRequest<ApiResponse<PageResult<Room>>>(
		(data) => ({
			url: "/api/room/list",
			method: "GET",
			params: data,
		}),
		{
			initialData: params,
		},
	);
}
```

#### 1.4 创建 Mock 数据

##### 1.4.1 楼栋 Mock 数据

**文件**：`src/api/mock/floor.mock.ts`

功能要求：

- 模拟 20+ 楼栋数据
- 支持分页（page/row 参数）
- 支持搜索（floorNum 模糊匹配）
- 支持社区筛选（communityId 参数）

##### 1.4.2 单元 Mock 数据

**文件**：`src/api/mock/unit.mock.ts`

功能要求：

- 模拟每栋楼 6 个单元
- 支持分页
- 支持搜索（unitNum 模糊匹配）
- 支持楼栋筛选（floorId 参数）

##### 1.4.3 房屋 Mock 数据

**文件**：`src/api/mock/room.mock.ts`

功能要求：

- 模拟每单元 6 个房间
- 支持分页
- 支持搜索（roomNum 模糊匹配）
- 支持单元筛选（unitId 参数）

#### 1.5 更新路由类型系统

##### 1.5.1 更新路由类型定义

**文件**：`src/types/routes.ts`

```typescript
export type PageRoute =
	| "/pages/index/index"
	// ... 现有路径
	| "/pages-sub/selector/select-floor"
	| "/pages-sub/selector/select-unit"
	| "/pages-sub/selector/select-room";

export interface PageParams {
	"/pages-sub/selector/select-floor": {};
	"/pages-sub/selector/select-unit": {
		floorId: string;
	};
	"/pages-sub/selector/select-room": {
		floorId: string;
		unitId: string;
	};
}
```

##### 1.5.2 更新路由 Helper

**文件**：`src/router/helpers.ts`

```typescript
export class TypedRouter {
	/** 跳转到选择楼栋页面 */
	static toSelectFloor() {
		return navigateToTyped("/pages-sub/selector/select-floor", {});
	}

	/** 跳转到选择单元页面 */
	static toSelectUnit(floorId: string) {
		return navigateToTyped("/pages-sub/selector/select-unit", { floorId });
	}

	/** 跳转到选择房屋页面 */
	static toSelectRoom(floorId: string, unitId: string) {
		return navigateToTyped("/pages-sub/selector/select-room", { floorId, unitId });
	}
}
```

---

### 阶段 2：维修录单页面框架迁移（预计 1 天）

#### 2.1 迁移目标

**文件**：`src/pages-sub/repair/repair-add.vue`（新建）

**迁移范围**：

- 页面基础结构（不含完整业务逻辑）
- 选择器调用接口
- 选择器结果显示

**暂不迁移**：

- 其他表单字段
- 提交逻辑
- 其他复杂业务

#### 2.2 选择器集成代码示例

```vue
<script setup lang="ts">
import { computed } from "vue";
import { useSelectorStore } from "@/stores/useSelectorStore";
import { TypedRouter } from "@/router/helpers";
import { useGlobalToast } from "@/hooks/useGlobal";

const selectorStore = useSelectorStore();
const toast = useGlobalToast();

// 选择楼栋
function handleSelectFloor() {
	TypedRouter.toSelectFloor();
}

// 选择单元
function handleSelectUnit() {
	if (!selectorStore.selectedFloor) {
		toast.show({ message: "请先选择楼栋" });
		return;
	}
	TypedRouter.toSelectUnit(selectorStore.selectedFloor.floorId);
}

// 选择房屋
function handleSelectRoom() {
	if (!selectorStore.selectedUnit) {
		toast.show({ message: "请先选择单元" });
		return;
	}
	TypedRouter.toSelectRoom(selectorStore.selectedFloor!.floorId, selectorStore.selectedUnit.unitId);
}

// 显示文本
const floorText = computed(() => selectorStore.floorText);
const unitText = computed(() => selectorStore.unitText);
const roomText = computed(() => selectorStore.roomText);
</script>

<template>
	<view class="p-4">
		<wd-cell-group>
			<wd-cell title="楼栋" :value="floorText" is-link @click="handleSelectFloor" />
			<wd-cell title="单元" :value="unitText" is-link @click="handleSelectUnit" />
			<wd-cell title="房屋" :value="roomText" is-link @click="handleSelectRoom" />
		</wd-cell-group>
	</view>
</template>
```

#### 2.3 子代理迁移要求

|       子代理        | 负责内容                                              |
| :-----------------: | :---------------------------------------------------- |
|   code-migration    | Vue2 Options API → Vue3 Composition API、生命周期迁移 |
| component-migration | ColorUI → wot-design-uni 组件映射                     |
|   style-migration   | cu-\* 类 → UnoCSS 原子类                              |
|   route-migration   | 配置页面路由、更新 pages.config.ts                    |

---

### 阶段 3：选择器页面逐个迁移（预计 2-3 天）

#### 3.1 selectFloor 页面迁移

**文件**：`src/pages-sub/selector/select-floor.vue`

##### 3.1.1 页面结构设计

```vue
<script setup lang="ts">
import { ref } from "vue";
import { getFloorList } from "@/api/floor";
import { useSelectorStore } from "@/stores/useSelectorStore";
import type { Floor } from "@/types/selector";

definePage({
	name: "select-floor",
	style: {
		navigationBarTitleText: "选择楼栋",
	},
});

const selectorStore = useSelectorStore();

// 搜索关键词
const searchValue = ref("");

// 当前页码
const currentPage = ref(1);

// 每页条数
const pageSize = ref(50);

// 楼栋列表
const floorList = ref<Floor[]>([]);

// 加载状态
const loading = ref(false);

// 是否还有更多数据
const hasMore = ref(true);

// 搜索
function handleSearch() {
	currentPage.value = 1;
	floorList.value = [];
	loadFloorList();
}

// 加载楼栋列表
async function loadFloorList() {
	if (loading.value || !hasMore.value) return;

	loading.value = true;
	try {
		const { data } = await getFloorList({
			communityId: "COMM_001", // 实际应从登录信息获取
			page: currentPage.value,
			row: pageSize.value,
			floorNum: searchValue.value || undefined,
		});

		if (data?.records) {
			if (currentPage.value === 1) {
				floorList.value = data.records;
			} else {
				floorList.value = [...floorList.value, ...data.records];
			}

			hasMore.value = floorList.value.length < data.total;
		}
	} finally {
		loading.value = false;
	}
}

// 选择楼栋
function handleSelectFloor(floor: Floor) {
	selectorStore.selectFloor(floor);
	uni.navigateBack();
}

// 上拉加载更多
function handleLoadMore() {
	if (!hasMore.value) return;
	currentPage.value++;
	loadFloorList();
}
</script>

<template>
	<!--
    选择楼栋页面
    功能：选择楼栋，支持搜索和分页加载

    访问地址: http://localhost:3000/#/pages-sub/selector/select-floor
  -->
	<view class="h-screen flex flex-col bg-gray-50">
		<!-- 搜索栏 -->
		<view class="p-4 bg-white">
			<wd-search v-model="searchValue" placeholder="搜索楼栋编号" @search="handleSearch" />
		</view>

		<!-- 列表 -->
		<z-paging
			v-model="floorList"
			class="flex-1"
			:loading="loading"
			@query="loadFloorList"
			@scrollToLower="handleLoadMore"
		>
			<wd-cell-group>
				<wd-cell
					v-for="floor in floorList"
					:key="floor.floorId"
					:title="`${floor.floorNum}栋`"
					:label="floor.floorName"
					is-link
					@click="handleSelectFloor(floor)"
				>
					<template #icon>
						<wd-icon name="" custom-class="i-carbon-building mr-2" />
					</template>
				</wd-cell>
			</wd-cell-group>

			<!-- 空状态 -->
			<template #empty>
				<wd-status-tip image="search" tip="暂无楼栋数据" />
			</template>
		</z-paging>
	</view>
</template>
```

##### 3.1.2 组件迁移映射

|          旧组件 (ColorUI)           |           新组件 (wot-design-uni)            | 说明       |
| :---------------------------------: | :------------------------------------------: | :--------- |
|   `<view class="cu-bar search">`    |                `<wd-search>`                 | 搜索框组件 |
|    `<view class="cu-list menu">`    |              `<wd-cell-group>`               | 列表容器   |
|      `<view class="cu-item">`       |                 `<wd-cell>`                  | 列表项     |
|   `<text class="cuIcon-search">`    |  `<wd-icon custom-class="i-carbon-search">`  | 搜索图标   |
| `<text class="cuIcon-clothesfill">` | `<wd-icon custom-class="i-carbon-building">` | 楼栋图标   |

##### 3.1.3 样式迁移映射

|         旧样式类 (ColorUI)          | 新样式类 (UnoCSS)             |
| :---------------------------------: | :---------------------------- |
|      `cu-bar search bg-white`       | `p-4 bg-white`                |
|         `search-form round`         | - (由 wd-search 组件内置)     |
| `cu-btn bg-green shadow-blur round` | - (由 wd-search 组件内置)     |
|      `cu-list menu margin-top`      | - (由 wd-cell-group 组件内置) |
|              `cu-item`              | - (由 wd-cell 组件内置)       |
|       `content padding-tb-sm`       | `py-2`                        |
|             `text-blue`             | `text-colorui-blue`           |
|         `text-gray text-sm`         | `text-gray-500 text-sm`       |

##### 3.1.4 迁移步骤

| 步骤 | 任务           |       子代理        | 预计耗时 |
| :--: | :------------- | :-----------------: | :------: |
|  1   | 创建页面文件   |        手动         |   0.5h   |
|  2   | 迁移页面结构   |   code-migration    |    2h    |
|  3   | 集成 wd-search | component-migration |    1h    |
|  4   | 集成 z-paging  | component-migration |   1.5h   |
|  5   | 集成 API       |    api-migration    |    1h    |
|  6   | 迁移样式       |   style-migration   |    1h    |
|  7   | 集成 Store     |        手动         |   0.5h   |
|  8   | 配置路由       |   route-migration   |   0.5h   |

**小计**：约 8 小时

---

#### 3.2 selectUnit 页面迁移

**文件**：`src/pages-sub/selector/select-unit.vue`

##### 3.2.1 与 selectFloor 的差异

|  差异点  |     selectFloor     |    selectUnit    |
| :------: | :-----------------: | :--------------: |
| 路由参数 |         无          | `floorId` (必填) |
| API 调用 |  `getFloorList()`   | `getUnitList()`  |
| 搜索字段 |     `floorNum`      |    `unitNum`     |
|   图标   | `i-carbon-building` | `i-carbon-grid`  |
| 标题显示 |        `X栋`        |     `X单元`      |

##### 3.2.2 迁移步骤

| 步骤 | 任务                  |     子代理      | 预计耗时 |
| :--: | :-------------------- | :-------------: | :------: |
|  1   | 复制 selectFloor 页面 |      手动       |   0.5h   |
|  2   | 修改为 Unit 逻辑      | code-migration  |   1.5h   |
|  3   | 适配 floorId 参数     |      手动       |   0.5h   |
|  4   | 集成 Unit API         |  api-migration  |   0.5h   |
|  5   | 配置路由              | route-migration |   0.5h   |

**小计**：约 3.5 小时

---

#### 3.3 selectRoom 页面迁移

**文件**：`src/pages-sub/selector/select-room.vue`

##### 3.3.1 与 selectUnit 的差异

|  差异点  |   selectUnit    |      selectRoom      |
| :------: | :-------------: | :------------------: |
| 路由参数 |    `floorId`    | `floorId` + `unitId` |
| API 调用 | `getUnitList()` |   `getRoomList()`    |
| 搜索字段 |    `unitNum`    |      `roomNum`       |
|   图标   | `i-carbon-grid` |   `i-carbon-home`    |
| 标题显示 |     `X单元`     |       `XXX室`        |

##### 3.3.2 迁移步骤

| 步骤 | 任务                 |     子代理      | 预计耗时 |
| :--: | :------------------- | :-------------: | :------: |
|  1   | 复制 selectUnit 页面 |      手动       |   0.5h   |
|  2   | 修改为 Room 逻辑     | code-migration  |   1.5h   |
|  3   | 适配 unitId 参数     |      手动       |   0.5h   |
|  4   | 集成 Room API        |  api-migration  |   0.5h   |
|  5   | 配置路由             | route-migration |   0.5h   |

**小计**：约 3.5 小时

---

### 阶段 4：集成验证（预计 0.5 天）

#### 4.1 完整流程测试

##### 4.1.1 测试用例 1：正常流程

| 步骤 | 操作             | 预期结果                                           |
| :--: | :--------------- | :------------------------------------------------- |
|  1   | 访问维修录单页面 | 页面正常显示，三个选择器显示"请选择"               |
|  2   | 点击"选择楼栋"   | 跳转到 selectFloor 页面                            |
|  3   | 选择"1 栋"       | 返回维修录单页面，显示"1 栋"                       |
|  4   | 点击"选择单元"   | 跳转到 selectUnit 页面，显示 1 栋的单元列表        |
|  5   | 选择"1 单元"     | 返回维修录单页面，显示"1 单元"                     |
|  6   | 点击"选择房屋"   | 跳转到 selectRoom 页面，显示 1 栋 1 单元的房屋列表 |
|  7   | 选择"101 室"     | 返回维修录单页面，显示"101 室"                     |

##### 4.1.2 测试用例 2：搜索功能

| 步骤 | 操作                  | 预期结果                                             |
| :--: | :-------------------- | :--------------------------------------------------- |
|  1   | 进入 selectFloor 页面 | 显示全部楼栋                                         |
|  2   | 搜索框输入"2"         | -                                                    |
|  3   | 点击搜索              | 列表只显示编号包含"2"的楼栋（如 2 栋、12 栋、20 栋） |
|  4   | 清空搜索              | 列表恢复显示全部楼栋                                 |

##### 4.1.3 测试用例 3：分页加载

| 步骤 | 操作                  | 预期结果                 |
| :--: | :-------------------- | :----------------------- |
|  1   | 进入 selectFloor 页面 | 显示第一页楼栋（50 条）  |
|  2   | 滚动到底部            | 自动加载第二页数据       |
|  3   | 继续滚动              | 持续加载直到全部加载完成 |
|  4   | 全部加载完成后滚动    | 显示"已经到底了"         |

#### 4.2 边界情况测试

##### 4.2.1 测试用例 4：未选上级提示

| 步骤 | 操作                     | 预期结果                   |
| :--: | :----------------------- | :------------------------- |
|  1   | 未选楼栋，点击"选择单元" | 提示"请先选择楼栋"，不跳转 |
|  2   | 未选单元，点击"选择房屋" | 提示"请先选择单元"，不跳转 |

##### 4.2.2 测试用例 5：重新选择清空下级

| 步骤 | 操作                       | 预期结果                     |
| :--: | :------------------------- | :--------------------------- |
|  1   | 已选择"1 栋 1 单元 101 室" | 显示完整选择结果             |
|  2   | 重新选择楼栋为"2 栋"       | 单元和房屋自动清空为"请选择" |
|  3   | 重新选择单元为"2 单元"     | 房屋自动清空为"请选择"       |

##### 4.2.3 测试用例 6：空状态显示

| 步骤 | 操作                      | 预期结果                     |
| :--: | :------------------------ | :--------------------------- |
|  1   | 搜索不存在的楼栋编号"999" | 显示空状态提示"暂无楼栋数据" |

#### 4.3 Bug 修复与优化

预留时间处理测试中发现的问题：

- 数据未正确回传
- Store 状态未正确更新
- 分页加载异常
- 搜索结果不准确
- UI 显示问题

---

## 六、详细实施清单

### 6.1 阶段 1 任务清单

| 序号 | 任务             | 文件                             |     子代理      | 预计耗时 | 负责人 |  状态  |
| :--: | :--------------- | :------------------------------- | :-------------: | :------: | :----: | :----: |
| 1.1  | 创建类型定义     | `src/types/selector.ts`          |      手动       |   0.5h   |   -    | 待开始 |
| 1.2  | 创建 Pinia Store | `src/stores/useSelectorStore.ts` |      手动       |    1h    |   -    | 待开始 |
| 1.3  | 创建楼栋 API     | `src/api/floor.ts`               |  api-migration  |    1h    |   -    | 待开始 |
| 1.4  | 创建单元 API     | `src/api/unit.ts`                |  api-migration  |    1h    |   -    | 待开始 |
| 1.5  | 创建房屋 API     | `src/api/room.ts`                |  api-migration  |    1h    |   -    | 待开始 |
| 1.6  | 创建楼栋 Mock    | `src/api/mock/floor.mock.ts`     |  api-migration  |    1h    |   -    | 待开始 |
| 1.7  | 创建单元 Mock    | `src/api/mock/unit.mock.ts`      |  api-migration  |    1h    |   -    | 待开始 |
| 1.8  | 创建房屋 Mock    | `src/api/mock/room.mock.ts`      |  api-migration  |    1h    |   -    | 待开始 |
| 1.9  | 更新路由类型     | `src/types/routes.ts`            | route-migration |   0.5h   |   -    | 待开始 |
| 1.10 | 更新路由 Helper  | `src/router/helpers.ts`          | route-migration |   0.5h   |   -    | 待开始 |

**小计**：约 9 小时（1-2 天）

---

### 6.2 阶段 2 任务清单

| 序号 | 任务             | 文件                                  |       子代理        | 预计耗时 | 负责人 |  状态  |
| :--: | :--------------- | :------------------------------------ | :-----------------: | :------: | :----: | :----: |
| 2.1  | 创建维修录单页面 | `src/pages-sub/repair/repair-add.vue` |        手动         |   0.5h   |   -    | 待开始 |
| 2.2  | 迁移页面结构     | 同上                                  |   code-migration    |    2h    |   -    | 待开始 |
| 2.3  | 迁移 UI 组件     | 同上                                  | component-migration |    2h    |   -    | 待开始 |
| 2.4  | 迁移样式         | 同上                                  |   style-migration   |   1.5h   |   -    | 待开始 |
| 2.5  | 集成 Pinia Store | 同上                                  |        手动         |    1h    |   -    | 待开始 |
| 2.6  | 配置页面路由     | `pages.config.ts`                     |   route-migration   |   0.5h   |   -    | 待开始 |

**小计**：约 7.5 小时（1 天）

---

### 6.3 阶段 3 任务清单

#### 6.3.1 selectFloor 页面

| 序号  | 任务           | 文件                                      |       子代理        | 预计耗时 | 负责人 |  状态  |
| :---: | :------------- | :---------------------------------------- | :-----------------: | :------: | :----: | :----: |
| 3.1.1 | 创建页面文件   | `src/pages-sub/selector/select-floor.vue` |        手动         |   0.5h   |   -    | 待开始 |
| 3.1.2 | 迁移页面结构   | 同上                                      |   code-migration    |    2h    |   -    | 待开始 |
| 3.1.3 | 集成 wd-search | 同上                                      | component-migration |    1h    |   -    | 待开始 |
| 3.1.4 | 集成 z-paging  | 同上                                      | component-migration |   1.5h   |   -    | 待开始 |
| 3.1.5 | 集成 API       | 同上                                      |    api-migration    |    1h    |   -    | 待开始 |
| 3.1.6 | 迁移样式       | 同上                                      |   style-migration   |    1h    |   -    | 待开始 |
| 3.1.7 | 集成 Store     | 同上                                      |        手动         |   0.5h   |   -    | 待开始 |
| 3.1.8 | 配置路由       | `pages.config.ts`                         |   route-migration   |   0.5h   |   -    | 待开始 |

**小计**：约 8 小时

#### 6.3.2 selectUnit 页面

| 序号  | 任务                  | 文件                                     |     子代理      | 预计耗时 | 负责人 |  状态  |
| :---: | :-------------------- | :--------------------------------------- | :-------------: | :------: | :----: | :----: |
| 3.2.1 | 复制 selectFloor 页面 | `src/pages-sub/selector/select-unit.vue` |      手动       |   0.5h   |   -    | 待开始 |
| 3.2.2 | 修改为 Unit 逻辑      | 同上                                     | code-migration  |   1.5h   |   -    | 待开始 |
| 3.2.3 | 适配 floorId 参数     | 同上                                     |      手动       |   0.5h   |   -    | 待开始 |
| 3.2.4 | 集成 Unit API         | 同上                                     |  api-migration  |   0.5h   |   -    | 待开始 |
| 3.2.5 | 配置路由              | `pages.config.ts`                        | route-migration |   0.5h   |   -    | 待开始 |

**小计**：约 3.5 小时

#### 6.3.3 selectRoom 页面

| 序号  | 任务                 | 文件                                     |     子代理      | 预计耗时 | 负责人 |  状态  |
| :---: | :------------------- | :--------------------------------------- | :-------------: | :------: | :----: | :----: |
| 3.3.1 | 复制 selectUnit 页面 | `src/pages-sub/selector/select-room.vue` |      手动       |   0.5h   |   -    | 待开始 |
| 3.3.2 | 修改为 Room 逻辑     | 同上                                     | code-migration  |   1.5h   |   -    | 待开始 |
| 3.3.3 | 适配 unitId 参数     | 同上                                     |      手动       |   0.5h   |   -    | 待开始 |
| 3.3.4 | 集成 Room API        | 同上                                     |  api-migration  |   0.5h   |   -    | 待开始 |
| 3.3.5 | 配置路由             | `pages.config.ts`                        | route-migration |   0.5h   |   -    | 待开始 |

**小计**：约 3.5 小时

**阶段 3 总计**：约 15 小时（2-3 天）

---

### 6.4 阶段 4 任务清单

| 序号 | 任务           | 预计耗时 | 负责人 |  状态  |
| :--: | :------------- | :------: | :----: | :----: |
| 4.1  | 完整流程测试   |    2h    |   -    | 待开始 |
| 4.2  | 边界情况测试   |    1h    |   -    | 待开始 |
| 4.3  | Bug 修复与优化 |    1h    |   -    | 待开始 |

**小计**：约 4 小时（0.5 天）

---

## 七、总体时间估算

|           阶段           |  工作量   |     工作日     | 依赖关系         |
| :----------------------: | :-------: | :------------: | :--------------- |
|   阶段 1：基础设施准备   |    9h     |     1-2 天     | 无               |
| 阶段 2：维修录单页面框架 |   7.5h    |      1 天      | 依赖阶段 1       |
|  阶段 3：选择器页面迁移  |    15h    |     2-3 天     | 依赖阶段 1、2    |
|     阶段 4：集成验证     |    4h     |     0.5 天     | 依赖阶段 1、2、3 |
|         **总计**         | **35.5h** | **4.5-6.5 天** | -                |

**关键路径**：阶段 1 → 阶段 2 → 阶段 3 → 阶段 4（串行）

---

## 八、风险与注意事项

### 8.1 技术风险

| 风险项                | 风险等级 | 影响                   | 缓解措施                                            |
| :-------------------- | :------: | :--------------------- | :-------------------------------------------------- |
| z-paging 组件学习曲线 |    中    | 可能延长开发时间 1-2h  | 提前阅读官方文档和示例代码                          |
| Pinia Store 时序问题  |    低    | 可能导致数据未及时更新 | 使用 `uni.navigateBack()` 的 `success` 回调确保时序 |
| Mock 数据关联关系错误 |    中    | 影响测试结果           | 严格按照层级关系设计 Mock 数据                      |
| API 类型定义不完整    |    低    | 编译错误               | 使用 TypeScript strict 模式提前发现问题             |

### 8.2 业务风险

| 风险项               | 风险等级 | 影响                         | 缓解措施                         |
| :------------------- | :------: | :--------------------------- | :------------------------------- |
| 多场景复用未充分验证 |    中    | 其他业务模块集成时可能出问题 | 在阶段 4 增加其他场景的简单验证  |
| 搜索逻辑不完善       |    低    | 用户体验不佳                 | 实现防抖、支持清空、支持实时搜索 |
| 分页性能问题         |    低    | 数据量大时卡顿               | 使用虚拟列表或限制单页数据量     |

### 8.3 实施注意事项

#### 8.3.1 代码规范要求

1. **不要直接运行子代理**：按计划手动实施，避免 token 消耗过快
2. **每个阶段都要提交代码**：使用有意义的 commit message，方便回滚
3. **先验证一个页面再迁移其他**：selectFloor 迁移完成并测试通过后再迁移其他两个
4. **保持代码风格一致**：遵循项目 ESLint 和 Prettier 配置

#### 8.3.2 测试要求

1. **手动测试优先**：在浏览器/模拟器中充分测试
2. **多场景测试**：至少在维修录单和投诉录单两个场景中测试
3. **边界测试完整**：必须测试所有边界情况
4. **性能测试**：测试大数据量情况（100+ 楼栋）

#### 8.3.3 文档要求

1. **代码注释完整**：每个页面顶部必须有业务说明和访问地址
2. **函数注释规范**：使用 JSDoc 格式，包含 `@example`
3. **更新迁移映射表**：完成后在 `docs\prompts\route-migration-map.yml` 标记状态

---

## 九、验收标准

### 9.1 功能验收

| 验收项             | 验收标准                           | 测试方法              |
| :----------------- | :--------------------------------- | :-------------------- |
| 选择器页面独立访问 | 三个页面可以独立访问，无报错       | 直接访问页面 URL      |
| 级联选择流程       | 从维修录单页面可以完整执行选择流程 | 执行测试用例 1        |
| 搜索功能           | 支持模糊搜索，结果准确             | 执行测试用例 2        |
| 分页加载           | 支持上拉加载更多，无重复数据       | 执行测试用例 3        |
| 数据回传           | 选中数据正确回传到调用页面         | 验证 Store 和页面显示 |
| 清空功能           | 重新选择上级时下级自动清空         | 执行测试用例 5        |
| 边界提示           | 未选上级时有正确提示               | 执行测试用例 4        |
| 空状态显示         | 无数据时显示空状态提示             | 执行测试用例 6        |

### 9.2 代码质量验收

| 验收项              | 验收标准                             | 检查方法                         |
| :------------------ | :----------------------------------- | :------------------------------- |
| TypeScript 类型覆盖 | 所有代码类型覆盖率 100%，无 `any`    | `pnpm type-check` 无错误         |
| 代码规范            | 通过 ESLint 检查，无警告             | `pnpm lint` 无错误               |
| Mock 数据完整       | 所有 API 都有对应的 Mock 数据        | 检查 mock 文件                   |
| 代码风格            | 使用 Composition API，遵循 Vue3 规范 | Code Review                      |
| 样式实现            | 全部使用 UnoCSS 原子类               | 检查 `<style scoped>` 是否最小化 |
| 注释完整            | 页面顶部注释、函数 JSDoc 完整        | Code Review                      |

### 9.3 文档验收

| 验收项         | 验收标准                                                                      |
| :------------- | :---------------------------------------------------------------------------- |
| 迁移映射表更新 | `docs\prompts\route-migration-map.yml` 中 `选择器页面 (3个)` 部分已标记为完成 |
| 迁移计划文档   | 本文档已生成在 `docs\prompts\migrate-plan` 目录                               |

---

## 十、后续扩展计划

### 10.1 短期扩展（迁移完成后 1 周内）

| 序号 | 任务                     | 预计耗时 | 优先级 |
| :--: | :----------------------- | :------: | :----: |
|  1   | 在投诉录单页面集成选择器 |    2h    |   高   |
|  2   | 在采购申请页面集成选择器 |    2h    |   中   |
|  3   | 在抄表录入页面集成选择器 |    2h    |   中   |
|  4   | 在房屋详情页面集成选择器 |    2h    |   低   |

### 10.2 中期优化（1 个月内）

| 序号 | 任务                               | 预计耗时 | 优先级 |
| :--: | :--------------------------------- | :------: | :----: |
|  1   | 优化 Mock 数据（增加更多测试数据） |    3h    |   中   |
|  2   | 增加单元测试                       |    8h    |   中   |
|  3   | 性能优化（虚拟列表）               |    5h    |   低   |
|  4   | 增加实时搜索（防抖）               |    2h    |   低   |

### 10.3 长期规划（3 个月内）

| 序号 | 任务                     | 预计耗时 | 优先级 |
| :--: | :----------------------- | :------: | :----: |
|  1   | 抽象通用选择器组件       |   10h    |   中   |
|  2   | 支持多选模式             |    8h    |   低   |
|  3   | 支持快速定位（字母索引） |    6h    |   低   |
|  4   | 支持历史记录             |    4h    |   低   |

---

## 十一、附录

### 11.1 参考文档

| 文档名称                    | 路径                                    |
| :-------------------------- | :-------------------------------------- |
| Vue2 路由导航地图           | `docs\vue2-route-navigation-map.md`     |
| Vue2 到 Vue3 路由迁移映射表 | `docs\prompts\route-migration-map.yml`  |
| API 迁移子代理说明          | `.claude\agents\api-migration.md`       |
| 代码迁移子代理说明          | `.claude\agents\code-migration.md`      |
| 组件迁移子代理说明          | `.claude\agents\component-migration.md` |
| 路由迁移子代理说明          | `.claude\agents\route-migration.md`     |
| 样式迁移子代理说明          | `.claude\agents\style-migration.md`     |

### 11.2 旧项目文件路径

| 页面     | 路径                                                   |
| :------- | :----------------------------------------------------- |
| 选择楼栋 | `gitee-example/pages/selectFloor/selectFloor.vue`      |
| 选择单元 | `gitee-example/pages/selectUnit/selectUnit.vue`        |
| 选择房屋 | `gitee-example/pages/selectRoom/selectRoom.vue`        |
| 维修录单 | `gitee-example/pages/property/repairAdd/repairAdd.vue` |

### 11.3 新项目文件路径

| 页面     | 路径                                      |
| :------- | :---------------------------------------- |
| 选择楼栋 | `src/pages-sub/selector/select-floor.vue` |
| 选择单元 | `src/pages-sub/selector/select-unit.vue`  |
| 选择房屋 | `src/pages-sub/selector/select-room.vue`  |
| 维修录单 | `src/pages-sub/repair/repair-add.vue`     |

### 11.4 关键技术栈文档

| 技术           | 官方文档                                               |
| :------------- | :----------------------------------------------------- |
| uni-app Vue3   | https://uniapp.dcloud.net.cn/tutorial/vue3-basics.html |
| Pinia          | https://pinia.vuejs.org/zh/                            |
| wot-design-uni | https://wot-design-uni.pages.dev/                      |
| z-paging       | https://z-paging.zxlee.cn/                             |
| UnoCSS         | https://unocss.dev/                                    |
| Alova          | https://alova.js.org/zh-CN/                            |

---

**文档版本**：v1.0
**最后更新**：2025-11-17
**文档状态**：已完成
