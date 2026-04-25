# 2025-12-26 修复处理维修工单页无法选择有效师傅的故障

## 1. 问题描述

### 1.1 故障现象

在 `处理维修工单` 页面（`src/pages-sub/repair/handle.vue`）中，从 `维修工单池`（`src/pages-sub/repair/order-list.vue`）点击"派单"按钮进入后，无法选择任何有效的维修师傅。

### 1.2 对比测试

|     场景     | URL                                                         |      结果       |
| :----------: | :---------------------------------------------------------- | :-------------: |
| 从工单池进入 | `?action=DISPATCH&repairId=REP_022&repairType=1004&...`     | ❌ 无法选择师傅 |
|   直接访问   | `?action=DISPATCH&repairId=REP_001&repairType=水电维修&...` | ✅ 正常选择师傅 |

关键区别在于 `repairType` 参数：一个是代码（`1004`），另一个是中文名称（`水电维修`）。

## 2. 问题根因分析

### 2.1 数据流追踪

```plain
order-list.vue (handleDispatch)
  ↓ 传递 repairType: item.repairType  (值为 '1004' 代码)
handle.vue (onLoad)
  ↓ model.repairType = options.repairType  (值为 '1004')
handle.vue (loadStaffs)
  ↓ getRepairStaffs({ repairType: model.repairType })  (传入 '1004')
repair.mock.ts (/app/ownerRepair.listRepairStaffs)
  ↓ staffs.filter(staff => staff.repairTypes.includes('1004'))
  ↓ Mock 师傅数据的 repairTypes: ['水电维修', '管道疏通', ...] (中文名称)
  ↓ '1004' 无法匹配 ['水电维修', ...]
结果：返回空数组 []
```

### 2.2 数据不一致问题

#### 常量定义（`src/constants/repair.ts`）

```typescript
export const REPAIR_TYPE_OPTIONS: ColumnItem[] = [
	{ value: "1001", label: "水电维修" },
	{ value: "1002", label: "门窗维修" },
	{ value: "1003", label: "空调维修" },
	{ value: "1004", label: "电梯维修" },
	{ value: "1005", label: "管道疏通" },
	{ value: "1006", label: "墙面修补" },
	{ value: "1007", label: "其他维修" },
];
```

#### Mock 工单数据生成（`src/api/mock/repair.mock.ts`）

```typescript
// 工单的 repairType 字段使用 value（代码）
return {
	repairType: typeItem.value as RepairType, // '1001', '1004' 等
	repairTypeName: typeItem.label, // '水电维修', '电梯维修' 等
};
```

#### Mock 维修师傅数据

```typescript
staffs: [
	{ staffId: "STAFF_001", staffName: "张师傅", repairTypes: ["水电维修", "管道疏通"] },
	{ staffId: "STAFF_002", staffName: "李师傅", repairTypes: ["门窗维修", "墙面修补"] },
	{ staffId: "STAFF_003", staffName: "王师傅", repairTypes: ["空调维修", "电梯维修"] },
	// ... 使用中文名称而非代码
];
```

#### 原有筛选逻辑（有问题）

```typescript
if (params.repairType) {
	// 用代码（如 '1004'）去匹配中文名称数组，永远无法匹配
	staffs = staffs.filter((staff) => staff.repairTypes.includes(params.repairType));
}
```

### 2.3 问题总结

|        组件         |        字段        |    传递的值     |     期望匹配的值      |
| :-----------------: | :----------------: | :-------------: | :-------------------: |
|   order-list.vue    | `item.repairType`  | `'1004'` (代码) |           -           |
| handle.vue API 调用 | `repairType` 参数  | `'1004'` (代码) |           -           |
|    Mock 师傅数据    | `repairTypes` 数组 |        -        | `['电梯维修']` (名称) |
|    Mock 筛选逻辑    |    `includes()`    |    `'1004'`     |    `['电梯维修']`     |

**根本原因**：Mock 数据的 `repairTypes` 使用中文名称，而业务代码传递的是维修类型代码，两者无法匹配。

## 3. 解决方案

### 3.1 修复策略

修改 Mock 接口的筛选逻辑，使其同时支持**代码**和**名称**两种匹配方式。

### 3.2 修复内容

修改文件：`src/api/mock/repair.mock.ts`

#### 修复接口 1：`/app/ownerRepair.listRepairStaffs`

```typescript
// 修复前（有问题）
if (params.repairType) {
	staffs = staffs.filter((staff) => staff.repairTypes.includes(params.repairType));
}

// 修复后（支持双重匹配）
if (params.repairType) {
	const typeOption = REPAIR_TYPE_OPTIONS.find((item) => item.value === params.repairType);
	const repairTypeName = typeOption?.label || params.repairType;

	staffs = staffs.filter(
		(staff) => staff.repairTypes.includes(params.repairType) || staff.repairTypes.includes(repairTypeName),
	);
}
```

#### 修复接口 2：`/app/repair.listRepairTypeUsers`

应用相同的修复逻辑。

### 3.3 修复原理

1. 首先尝试从 `REPAIR_TYPE_OPTIONS` 常量中查找传入代码对应的中文名称
2. 如果找到，使用中文名称进行匹配
3. 如果未找到，则保持原参数进行匹配（兼容直接传入名称的情况）

## 4. 回答用户的问题

### 4.1 是否是 order-list.vue 传递的路由参数不够？

**不是**。`order-list.vue` 传递的参数是完整的，包括：

- `action`: 操作类型
- `repairId`: 工单 ID
- `repairType`: 维修类型代码
- `preStaffId`: 前任师傅 ID
- `preStaffName`: 前任师傅名称
- `repairObjType`: 维修对象类型

问题不在于参数是否足够，而在于 Mock 数据的设计与业务代码的参数格式不一致。

### 4.2 是否是 `/app/ownerRepair.listRepairStaffs` 接口传参不合适？

**是的，这是问题的表现形式**。但根本原因是 Mock 接口的筛选逻辑没有考虑到业务代码使用代码而非名称的情况。

传参本身没有问题（传递维修类型代码是正确的业务逻辑），问题在于 Mock 数据层面的设计不一致：

- Mock 工单数据使用代码（`repairType: '1004'`）
- Mock 师傅数据使用名称（`repairTypes: ['电梯维修']`）
- Mock 筛选逻辑没有做转换

### 4.3 问题定性

这是一个 **Mock 数据层面的设计缺陷**，不是业务代码的问题。修复方案是让 Mock 接口更智能地处理参数，同时支持代码和名称匹配。

## 5. 验证方法

修复后，请重新测试以下场景：

1. 从 `维修工单池` 点击待派单工单的"派单"按钮
2. 进入 `处理维修工单` 页面
3. 点击"维修师傅"选择器
4. 确认能看到与该维修类型匹配的师傅列表

**测试 URL**：

```log
http://localhost:3000/#/pages-sub/repair/handle?action=DISPATCH&repairId=REP_022&repairType=1004&repairObjType=001
```

预期结果：能够看到王师傅（擅长 `空调维修`、`电梯维修`）在选择列表中。

## 6. 经验总结

### 6.1 Mock 数据设计原则

1. **保持一致性**：Mock 数据应与常量定义保持一致的数据格式
2. **考虑边界情况**：筛选逻辑应考虑多种参数格式（代码/名称/ID 等）
3. **模拟真实后端**：Mock 接口的行为应尽可能模拟真实后端的容错能力

### 6.2 调试技巧

当遇到"数据筛选不出结果"的问题时：

1. 检查传入参数的实际值
2. 检查被筛选数据的字段格式
3. 对比两者是否使用相同的格式（代码 vs 名称 vs ID）
4. 查看常量定义了解数据格式的映射关系

## 7. 修改文件清单

| 文件                          | 修改内容                                                        |
| :---------------------------- | :-------------------------------------------------------------- |
| `src/api/mock/repair.mock.ts` | 修复 `listRepairStaffs` 和 `listRepairTypeUsers` 接口的筛选逻辑 |
