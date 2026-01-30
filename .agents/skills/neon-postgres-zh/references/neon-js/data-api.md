# Neon JS Data API 参考

使用 `@neondatabase/neon-js` 进行 PostgREST 风格数据库查询的完整参考。

## 客户端设置

### Next.js

```typescript
// lib/db/client.ts
import { createClient } from "@neondatabase/neon-js";
import type { Database } from "./database.types";

export const dbClient = createClient<Database>({
	auth: { url: process.env.NEXT_PUBLIC_NEON_AUTH_URL! },
	dataApi: { url: process.env.NEON_DATA_API_URL! },
});
```

### React SPA

```typescript
import { createClient } from "@neondatabase/neon-js";
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";

const client = createClient<Database>({
	auth: {
		adapter: BetterAuthReactAdapter(),
		url: import.meta.env.VITE_NEON_AUTH_URL,
	},
	dataApi: { url: import.meta.env.VITE_NEON_DATA_API_URL },
});
```

### Node.js 后端

```typescript
import { createClient } from "@neondatabase/neon-js";

const client = createClient<Database>({
	auth: { url: process.env.NEON_AUTH_URL! },
	dataApi: { url: process.env.NEON_DATA_API_URL! },
});
```

---

## 查询模式

所有查询方法都遵循 PostgREST 语法（与 Supabase 相同）。

### Select 查询

**基本 select：**

```typescript
const { data, error } = await client.from("items").select();
```

**Select 特定列：**

```typescript
const { data } = await client.from("items").select("id, name, status");
```

**带过滤器的 Select：**

```typescript
const { data } = await client
	.from("items")
	.select("id, name, status")
	.eq("status", "active")
	.order("created_at", { ascending: false })
	.limit(10);
```

**Select 单行：**

```typescript
const { data, error } = await client.from("items").select("*").eq("id", 1).single();
```

### Insert

**Insert 单行：**

```typescript
const { data, error } = await client.from("items").insert({ name: "New Item", status: "pending" }).select().single();
```

**Insert 多行：**

```typescript
const { data, error } = await client
	.from("items")
	.insert([
		{ name: "Item 1", status: "pending" },
		{ name: "Item 2", status: "pending" },
	])
	.select();
```

### Update

**带过滤器的 Update：**

```typescript
await client.from("items").update({ status: "completed" }).eq("id", 1);
```

**Update 并返回数据：**

```typescript
const { data, error } = await client.from("items").update({ status: "completed" }).eq("id", 1).select().single();
```

### Delete

**Delete 单行：**

```typescript
await client.from("items").delete().eq("id", 1);
```

**Delete 并返回数据：**

```typescript
const { data, error } = await client.from("items").delete().eq("id", 1).select().single();
```

### Upsert

```typescript
await client.from("items").upsert({ id: 1, name: "Updated Item", status: "active" });
```

---

## 过滤

### 比较运算符

```typescript
// 等于
.eq("status", "active")

// 不等于
.neq("status", "archived")

// 大于
.gt("price", 100)

// 大于或等于
.gte("price", 100)

// 小于
.lt("price", 100)

// 小于或等于
.lte("price", 100)

// Like (模式匹配)
.like("name", "%item%")

// ILike (不区分大小写)
.ilike("name", "%item%")

// 为空
.is("deleted_at", null)

// 不为空
.not("deleted_at", "is", null)

// 在数组中
.in("status", ["active", "pending"])

// 包含 (用于数组/JSONB)
.contains("tags", ["important"])
```

### 逻辑运算符

```typescript
// AND (链式)
.eq("status", "active")
.gt("price", 100)

// OR
.or("status.eq.active,price.gt.100")

// NOT
.not("status", "eq", "archived")
```

### 排序

```typescript
// 升序
.order("created_at", { ascending: true })

// 降序
.order("created_at", { ascending: false })

// 多列
.order("status", { ascending: true })
.order("created_at", { ascending: false })
```

### 分页

```typescript
// 限制
.limit(10)

// 范围 (offset + limit)
.range(0, 9)  // 前 10 项

// 分页范围
const page = 1;
const pageSize = 10;
.range((page - 1) * pageSize, page * pageSize - 1)
```

---

## 关系

### 带关系的 Select

**一对多：**

```typescript
const { data } = await client.from("posts").select("id, title, author:users(name, email)");
```

**多对多：**

```typescript
const { data } = await client.from("posts").select("id, title, tags:post_tags(tag:tags(name))");
```

**嵌套关系：**

```typescript
const { data } = await client.from("posts").select(`
    id,
    title,
    author:users(
      id,
      name,
      profile:profiles(bio, avatar)
    )
  `);
```

---

## 类型生成

从数据库架构生成 TypeScript 类型：

```bash
npx neon-js gen-types --db-url "postgresql://user:pass@host/db" --output src/types/database.ts
```

或使用环境变量：

```bash
npx neon-js gen-types --db-url "$DATABASE_URL" --output lib/db/database.types.ts
```

**在客户端中使用类型：**

```typescript
import { createClient } from "@neondatabase/neon-js";
import type { Database } from "./database.types";

export const dbClient = createClient<Database>({
	auth: { url: process.env.NEXT_PUBLIC_NEON_AUTH_URL! },
	dataApi: { url: process.env.NEON_DATA_API_URL! },
});
```

**好处：**

- 表和列的完整 TypeScript 自动补全
- 类型安全的查询
- 编译时错误检查

---

## 错误处理

**检查错误：**

```typescript
const { data, error } = await client.from("items").select();

if (error) {
	console.error("Database error:", error.message);
	console.error("Error code:", error.code);
	console.error("Error details:", error.details);
	return;
}

// 使用数据
console.log(data);
```

**常见错误代码：**

- `PGRST116` - 未返回行 (使用 `.single()` 时)
- `23505` - 唯一性违反
- `23503` - 外键违反
- `42P01` - 表不存在

---

## 用法示例

### 服务器组件 (Next.js)

```typescript
// app/posts/page.tsx
import { dbClient } from "@/lib/db/client";

export default async function PostsPage() {
  const { data: posts, error } = await dbClient
    .from("posts")
    .select("id, title, created_at, author:users(name)")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return <div>Error loading posts</div>;

  return (
    <ul>
      {posts?.map((post) => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>By {post.author?.name}</p>
        </li>
      ))}
    </ul>
  );
}
```

### API 路由 (Next.js)

```typescript
// app/api/posts/route.ts
import { dbClient } from "@/lib/db/client";
import { NextResponse } from "next/server";

export async function GET() {
	const { data, error } = await dbClient.from("posts").select();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data);
}

export async function POST(request: Request) {
	const body = await request.json();

	const { data, error } = await dbClient.from("posts").insert(body).select().single();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}

	return NextResponse.json(data, { status: 201 });
}
```

### 客户端组件 (React)

```typescript
"use client";

import { useEffect, useState } from "react";
import { dbClient } from "@/lib/db/client";

export function ItemsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      const { data, error } = await dbClient
        .from("items")
        .select("id, name, status")
        .eq("status", "active");

      if (error) {
        console.error(error);
        return;
      }

      setItems(data || []);
      setLoading(false);
    }

    fetchItems();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

---

## Supabase 迁移

Neon JS SDK 使用与 Supabase 相同的 PostgREST API，使迁移变得简单：

**之前 (Supabase)：**

```typescript
import { createClient } from "@supabase/supabase-js";

const client = createClient(SUPABASE_URL, SUPABASE_KEY);
```

**之后 (Neon)：**

```typescript
import { createClient, SupabaseAuthAdapter } from "@neondatabase/neon-js";

const client = createClient({
	auth: { adapter: SupabaseAuthAdapter(), url: NEON_AUTH_URL },
	dataApi: { url: NEON_DATA_API_URL },
});
```

**查询语法保持不变：**

```typescript
// 在两者中工作方式相同
await client.auth.signInWithPassword({ email, password });
const { data } = await client.from("items").select();
```
