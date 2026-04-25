# Drizzle CRUD 操作

> 本文档介绍使用 Drizzle ORM 进行类型安全的数据库 CRUD 操作。

---

## 1. 基础查询

### 1.1. 查询所有记录

```typescript
import { db } from "@/db/client";
import { repairOrders } from "@/db/schema";

// 查询所有
const allOrders = await db.select().from(repairOrders);
```

### 1.2. 带条件查询

```typescript
import { eq, and, or, gt, lt, like, desc, asc } from "drizzle-orm";

// 等值查询
const pendingOrders = await db.select().from(repairOrders).where(eq(repairOrders.status, "pending"));

// 多条件 AND
const urgentPending = await db
	.select()
	.from(repairOrders)
	.where(and(eq(repairOrders.status, "pending"), gt(repairOrders.priority, 3)));

// 多条件 OR
const activeOrders = await db
	.select()
	.from(repairOrders)
	.where(or(eq(repairOrders.status, "pending"), eq(repairOrders.status, "processing")));

// 模糊查询
const searchResults = await db.select().from(repairOrders).where(like(repairOrders.title, `%水管%`));
```

### 1.3. 排序和分页

```typescript
// 排序
const sortedOrders = await db.select().from(repairOrders).orderBy(desc(repairOrders.createdAt));

// 多字段排序
const multiSorted = await db
	.select()
	.from(repairOrders)
	.orderBy(desc(repairOrders.priority), asc(repairOrders.createdAt));

// 分页
const page = 1;
const pageSize = 10;

const pagedOrders = await db
	.select()
	.from(repairOrders)
	.orderBy(desc(repairOrders.createdAt))
	.limit(pageSize)
	.offset((page - 1) * pageSize);
```

### 1.4. 查询单条记录

```typescript
// 方式 1: 使用 limit(1) + 解构
const [order] = await db.select().from(repairOrders).where(eq(repairOrders.id, orderId)).limit(1);

// 方式 2: 使用 .then() 获取第一条
const order = await db
	.select()
	.from(repairOrders)
	.where(eq(repairOrders.id, orderId))
	.limit(1)
	.then((rows) => rows[0]);
```

### 1.5. 选择特定字段

```typescript
// 只选择部分字段
const orderList = await db
	.select({
		id: repairOrders.id,
		title: repairOrders.title,
		status: repairOrders.status,
	})
	.from(repairOrders);

// 类型会自动推断为:
// { id: string; title: string; status: string }[]
```

---

## 2. 插入数据

### 2.1. 插入单条记录

```typescript
import { repairOrders, NewRepairOrder } from "@/db/schema";

// 插入并返回新记录
const [newOrder] = await db
	.insert(repairOrders)
	.values({
		title: "水管漏水",
		description: "卫生间水管漏水严重",
		address: "A栋1单元101",
		contact: "张三",
		phone: "13800138000",
		priority: 4,
	})
	.returning();

console.log(newOrder.id); // 自动生成的 UUID
```

### 2.2. 插入多条记录

```typescript
const newOrders = await db
	.insert(repairOrders)
	.values([
		{ title: "电梯故障", address: "B栋" },
		{ title: "路灯不亮", address: "小区北门" },
		{ title: "门禁损坏", address: "C栋单元门" },
	])
	.returning();
```

### 2.3. 插入或更新 (Upsert)

```typescript
await db
	.insert(repairOrders)
	.values({
		id: existingId, // 指定 ID
		title: "更新的标题",
		status: "processing",
	})
	.onConflictDoUpdate({
		target: repairOrders.id,
		set: {
			title: "更新的标题",
			status: "processing",
			updatedAt: new Date(),
		},
	});
```

---

## 3. 更新数据

### 3.1. 更新单条记录

```typescript
import { eq } from "drizzle-orm";

await db
	.update(repairOrders)
	.set({
		status: "processing",
		assigneeId: "user-123",
		assigneeName: "维修员小李",
		updatedAt: new Date(),
	})
	.where(eq(repairOrders.id, orderId));
```

### 3.2. 更新并返回

```typescript
const [updatedOrder] = await db
	.update(repairOrders)
	.set({
		status: "completed",
		completedAt: new Date(),
		updatedAt: new Date(),
	})
	.where(eq(repairOrders.id, orderId))
	.returning();
```

### 3.3. 批量更新

```typescript
import { inArray } from "drizzle-orm";

// 批量更新多条记录
await db
	.update(repairOrders)
	.set({ status: "cancelled" })
	.where(inArray(repairOrders.id, ["id-1", "id-2", "id-3"]));
```

---

## 4. 删除数据

### 4.1. 删除单条记录

```typescript
await db.delete(repairOrders).where(eq(repairOrders.id, orderId));
```

### 4.2. 删除并返回

```typescript
const [deletedOrder] = await db.delete(repairOrders).where(eq(repairOrders.id, orderId)).returning();
```

### 4.3. 批量删除

```typescript
// 删除所有已取消的工单
await db.delete(repairOrders).where(eq(repairOrders.status, "cancelled"));

// 删除指定 ID 列表
await db.delete(repairOrders).where(inArray(repairOrders.id, idsToDelete));
```

---

## 5. 聚合查询

### 5.1. 计数

```typescript
import { count, sum, avg } from "drizzle-orm";

// 总数
const [{ total }] = await db.select({ total: count() }).from(repairOrders);

// 条件计数
const [{ pendingCount }] = await db
	.select({ pendingCount: count() })
	.from(repairOrders)
	.where(eq(repairOrders.status, "pending"));
```

### 5.2. 分组统计

```typescript
// 按状态分组统计
const statusStats = await db
	.select({
		status: repairOrders.status,
		count: count(),
	})
	.from(repairOrders)
	.groupBy(repairOrders.status);

// 结果: [{ status: "pending", count: 10 }, { status: "completed", count: 25 }]
```

---

## 6. 事务

### 6.1. 基本事务

```typescript
await db.transaction(async (tx) => {
	// 创建工单
	const [order] = await tx.insert(repairOrders).values({ title: "测试工单" }).returning();

	// 创建关联记录
	await tx.insert(repairLogs).values({
		orderId: order.id,
		action: "created",
		message: "工单已创建",
	});
});
```

### 6.2. 事务回滚

```typescript
try {
	await db.transaction(async (tx) => {
		await tx.insert(repairOrders).values({ title: "工单1" });

		// 模拟错误
		throw new Error("Something went wrong");

		// 这行不会执行，上面的插入会回滚
		await tx.insert(repairOrders).values({ title: "工单2" });
	});
} catch (error) {
	console.error("事务失败，已回滚:", error);
}
```

---

## 7. 封装查询函数

### 7.1. 维修工单查询函数

```typescript
// lib/db/queries/repair.ts
import { db } from "@/db/client";
import { repairOrders, RepairOrder, NewRepairOrder } from "@/db/schema";
import { eq, desc, and, like, count } from "drizzle-orm";

/** 获取工单列表 */
export async function getRepairOrders(options?: {
	status?: string;
	search?: string;
	page?: number;
	pageSize?: number;
}) {
	const { status, search, page = 1, pageSize = 10 } = options || {};

	// 构建查询条件
	const conditions = [];
	if (status) {
		conditions.push(eq(repairOrders.status, status));
	}
	if (search) {
		conditions.push(like(repairOrders.title, `%${search}%`));
	}

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	// 查询数据
	const data = await db
		.select()
		.from(repairOrders)
		.where(whereClause)
		.orderBy(desc(repairOrders.createdAt))
		.limit(pageSize)
		.offset((page - 1) * pageSize);

	// 查询总数
	const [{ total }] = await db.select({ total: count() }).from(repairOrders).where(whereClause);

	return { data, total, page, pageSize };
}

/** 获取工单详情 */
export async function getRepairOrderById(id: string): Promise<RepairOrder | null> {
	const [order] = await db.select().from(repairOrders).where(eq(repairOrders.id, id)).limit(1);

	return order || null;
}

/** 创建工单 */
export async function createRepairOrder(data: NewRepairOrder): Promise<RepairOrder> {
	const [order] = await db.insert(repairOrders).values(data).returning();

	return order;
}

/** 更新工单状态 */
export async function updateRepairStatus(
	id: string,
	status: string,
	assignee?: { id: string; name: string },
): Promise<void> {
	await db
		.update(repairOrders)
		.set({
			status,
			assigneeId: assignee?.id,
			assigneeName: assignee?.name,
			updatedAt: new Date(),
			...(status === "completed" ? { completedAt: new Date() } : {}),
		})
		.where(eq(repairOrders.id, id));
}

/** 删除工单 */
export async function deleteRepairOrder(id: string): Promise<void> {
	await db.delete(repairOrders).where(eq(repairOrders.id, id));
}
```

---

## 8. 常用操作符速查表

| 操作符       | 用途                 | 示例                      |
| :----------- | :------------------- | :------------------------ |
| `eq`         | 等于                 | `eq(col, value)`          |
| `ne`         | 不等于               | `ne(col, value)`          |
| `gt`         | 大于                 | `gt(col, value)`          |
| `gte`        | 大于等于             | `gte(col, value)`         |
| `lt`         | 小于                 | `lt(col, value)`          |
| `lte`        | 小于等于             | `lte(col, value)`         |
| `like`       | 模糊匹配             | `like(col, '%text%')`     |
| `ilike`      | 不区分大小写模糊匹配 | `ilike(col, '%text%')`    |
| `isNull`     | 为空                 | `isNull(col)`             |
| `isNotNull`  | 不为空               | `isNotNull(col)`          |
| `inArray`    | 在数组中             | `inArray(col, [1, 2, 3])` |
| `notInArray` | 不在数组中           | `notInArray(col, [1, 2])` |
| `between`    | 区间                 | `between(col, min, max)`  |
| `and`        | 与                   | `and(cond1, cond2)`       |
| `or`         | 或                   | `or(cond1, cond2)`        |
| `not`        | 非                   | `not(cond)`               |

---

## 9. 下一步

掌握 CRUD 操作后，继续阅读：

1. [05-nitro-routes.md](./05-nitro-routes.md) - Nitro 文件路由系统
