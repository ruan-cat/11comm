# 共享 Endpoint / Mock 响应格式规范

## 1. 当前推荐的响应工具

对于已经共享化的模块，优先使用：

```typescript
import { successResponse, errorResponse } from "../../shared/runtime/response-builder.ts";
```

这两个工具会返回统一结构：

```typescript
{
	success: boolean;
	code: string;
	message: string;
	data: T;
	timestamp: number;
}
```

## 2. 为什么前端 API 不写 `ApiResponse`

因为 `src/http/alova.ts` 已经在成功时直接返回 `rawData.data`。

完整链路是：

1. `endpoints.ts` 返回 `successResponse({ ownerRepair })`
2. Alova 拦截器检查 `code`
3. 成功后只把 `data` 返回给页面

所以页面最终拿到的是：

```typescript
{
	ownerRepair: RepairOrder;
}
```

而不是整包响应对象。

## 3. 共享 endpoint 的正确写法

```typescript
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'

{
  url: '/app/ownerRepair.queryOwnerRepair',
  method: ['GET', 'POST'],
  handler: ({ params }) => {
    const repairId = String(params.repairId || '').trim()
    if (!repairId) {
      return errorResponse('维修工单ID不能为空', '400')
    }

    const repair = repository.getById(repairId)
    if (!repair) {
      return errorResponse('维修工单不存在', '404')
    }

    return successResponse({ ownerRepair: repair }, '查询成功')
  },
}
```

## 4. legacy `*.mock.ts` 的兼容说明

如果你维护的是尚未共享化的旧模块，仍可能看到：

```typescript
import { errorResponse, successResponse, ResultEnumMap } from "./shared/utils";
```

这里的 `ResultEnumMap` 只是 legacy 兼容层工具，不是新模块首选。

新模块应优先写共享 endpoint，并使用 `response-builder.ts`。

## 5. 错误码使用规则

### 5.1. 共享 endpoint

共享 endpoint 当前允许直接使用字符串业务码：

```typescript
errorResponse("参数错误", "400");
errorResponse("资源不存在", "404");
```

### 5.2. legacy mock

legacy mock 如仍需维护，可继续使用：

```typescript
ResultEnumMap.Error;
ResultEnumMap.NotFound;
```

但不要把这个要求扩散成共享 endpoint 的首选写法。

## 6. 常见错误

### 6.1. 错误一：手写不统一的响应对象

```typescript
return {
	code: 0,
	msg: "ok",
	result: data,
};
```

字段名不统一，会让前端拦截器无法按既定结构处理。

### 6.2. 错误二：前端 API 泛型包裹 `ApiResponse`

```typescript
http.Get<ApiResponse<{ ownerRepair: RepairOrder }>>(...)
```

这会和已解包的真实运行时行为不一致。

## 7. 自检清单

- [ ] 共享 endpoint 使用 `successResponse` / `errorResponse`
- [ ] 前端 API 泛型未包裹 `ApiResponse`
- [ ] 未继续把 legacy `ResultEnumMap` 当成新模块首选
- [ ] 返回字段结构与 `src/http/alova.ts` 当前逻辑兼容
