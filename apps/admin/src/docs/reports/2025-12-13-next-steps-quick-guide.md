# 2025-12-13 下一步操作快速指南

## 快速状态检查

```bash
# 检查待完成任务数量
grep -c "^- \[ \]" openspec/changes/migrate-static-data-to-nitro-query/tasks.md

# 检查类型错误数量
pnpm -F @01s-11comm/admin typecheck 2>&1 | grep -c "error TS"

# 查看类型错误列表
pnpm -F @01s-11comm/admin typecheck 2>&1 | grep "error TS" > type-errors.log
```

## 立即执行 - 修复类型错误（P0）

### 第 1 步：分析错误文件

```bash
# 获取所有有错误的文件列表
pnpm -F @01s-11comm/admin typecheck 2>&1 | grep "error TS" | cut -d'(' -f1 | sort -u > error-files.txt
```

### 第 2 步：按错误类型分类

**错误类型 1: Cannot find name 'XXX'**
- 原因: test-data 中定义的类型/变量被删除
- 解决: 将类型迁移到 `apps/type`，Options 迁移到常量文件

**错误类型 2: Cannot find module '../test-data'**
- 原因: 部分文件仍有导入语句残留
- 解决: 手动删除或运行脚本再次清理

### 第 3 步：修复典型错误示例

#### 示例 1: 修复表单类型错误

**错误文件**: `src/pages/property-manage/house-property-manage/house/components/form.ts`

**错误信息**:
```log
error TS2304: Cannot find name '房屋管理表单_VO'.
```

**修复步骤**:

1. **创建类型文件**:
   ```typescript
   // apps/type/src/business/property-manage/house-property-manage/house-form.ts

   /** 房屋管理表单 */
   export interface HouseFormVO {
     /** 房屋编号 */
     houseNo: string;
     /** 房屋名称 */
     houseName: string;
     /** 房屋状态 */
     houseStatus: string;
     /** 房屋类型 */
     houseType: string;
     // ... 其他字段
   }

   /** 房屋状态选项 */
   export const houseStatusOptions = [
     { label: "空置", value: "vacant" },
     { label: "已售", value: "sold" },
     { label: "已租", value: "rented" },
   ];

   /** 房屋类型选项 */
   export const houseTypeOptions = [
     { label: "住宅", value: "residential" },
     { label: "商业", value: "commercial" },
   ];
   ```

2. **更新表单文件**:
   ```typescript
   // src/pages/property-manage/house-property-manage/house/components/form.ts
   import type { HouseFormVO } from "@01s-11comm/type";
   import { houseStatusOptions, houseTypeOptions } from "@01s-11comm/type";

   // 使用类型
   export function createFormConfig(): FormConfig<HouseFormVO> {
     // ...
   }
   ```

3. **更新 type 包的 index.ts**:
   ```typescript
   // apps/type/src/business/property-manage/house-property-manage/index.ts
   export * from "./house-form";

   // apps/type/src/business/property-manage/index.ts
   export * from "./house-property-manage";
   ```

#### 示例 2: 修复 Options 错误

**错误文件**: `src/pages/property-manage/community-manage/handing-business/components/form.ts`

**错误信息**:
```log
error TS2304: Cannot find name '费用类型Options'.
error TS2304: Cannot find name '状态Options'.
```

**修复步骤**:

1. **在类型文件中定义 Options**:
   ```typescript
   // apps/type/src/business/property-manage/community-manage/handing-business.ts

   export const expenseTypeOptions = [
     { label: "物业费", value: "property_fee" },
     { label: "水费", value: "water_fee" },
     { label: "电费", value: "electricity_fee" },
   ];

   export const statusOptions = [
     { label: "待处理", value: "pending" },
     { label: "处理中", value: "processing" },
     { label: "已完成", value: "completed" },
   ];
   ```

2. **更新表单文件**:
   ```typescript
   import { expenseTypeOptions, statusOptions } from "@01s-11comm/type";

   // 使用 Options
   const formConfig = {
     expenseType: {
       options: expenseTypeOptions,
     },
     status: {
       options: statusOptions,
     },
   };
   ```

### 第 4 步：批量修复脚本

创建 `scripts/fix-type-errors.js`:

```javascript
import fs from "fs";
import path from "path";

// 类型映射表：中文 -> 英文
const typeMapping = {
  "配置中心_列表数据": "ConfigCenterListItem",
  "房屋管理表单_VO": "HouseFormVO",
  "业主信息表单_VO": "OwnerInfoFormVO",
  // ... 添加更多映射
};

// Options 映射表
const optionsMapping = {
  "物业公司选项": "propertyCompanyOptions",
  "状态选项": "statusOptions",
  "费用类型Options": "expenseTypeOptions",
  // ... 添加更多映射
};

// 处理逻辑...
```

## 下一步 - setting-manage 迁移（P1）

### 快速迁移模板

对于每个 setting-manage 页面，按以下步骤操作：

#### 1. data-permission 页面（示例）

**Step 1: 创建类型文件**

```bash
# 创建目录
mkdir -p apps/type/src/business/setting-manage/organize-manage

# 创建类型文件
touch apps/type/src/business/setting-manage/organize-manage/data-permission.ts
```

**Step 2: 定义类型**

参考 `src/pages/setting-manage/organize-manage/data-permission/test-data.ts`（已删除，需从 git 历史恢复查看）：

```typescript
// apps/type/src/business/setting-manage/organize-manage/data-permission.ts

/** 数据权限列表项 */
export interface DataPermissionListItem {
  /** 编号 */
  code: string;
  /** 名称 */
  name: string;
  /** 描述 */
  description?: string;
  /** 创建时间 */
  createTime?: string;
}

/** 数据权限查询参数 */
export interface DataPermissionQueryParams {
  /** 名称 */
  name?: string;
  /** 当前页码 */
  pageIndex: number;
  /** 每页大小 */
  pageSize: number;
}
```

**Step 3: 创建 Mock 数据**

```bash
mkdir -p apps/admin/server/api/setting-manage/organize-manage/data-permission
touch apps/admin/server/api/setting-manage/organize-manage/data-permission/mock-data.ts
```

```typescript
// apps/admin/server/api/setting-manage/organize-manage/data-permission/mock-data.ts

import type { DataPermissionListItem } from "@01s-11comm/type";

export const mockDataPermissionData: DataPermissionListItem[] = [
  { code: "DP001", name: "A级数据权限", description: "最高级别权限" },
  { code: "DP002", name: "B级数据权限", description: "普通权限" },
  // ... 更多数据
];
```

**Step 4: 创建 API 接口**

```bash
touch apps/admin/server/api/setting-manage/organize-manage/data-permission/list.post.ts
```

```typescript
// apps/admin/server/api/setting-manage/organize-manage/data-permission/list.post.ts

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, DataPermissionListItem, DataPermissionQueryParams } from "@01s-11comm/type";
import { mockDataPermissionData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<DataPermissionListItem>>> => {
  const body = await readBody<DataPermissionQueryParams>(event);
  const { pageIndex = 1, pageSize = 10, name } = body ?? {};

  let filteredData = [...mockDataPermissionData];

  if (name) {
    filteredData = filteredData.filter((item) => item.name.includes(name));
  }

  const total = filteredData.length;
  const startIndex = (pageIndex - 1) * pageSize;
  const pageData = filteredData.slice(startIndex, startIndex + pageSize);

  return {
    success: true,
    code: 200,
    message: "查询成功",
    data: {
      list: pageData,
      total,
      pageIndex,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
});
```

**Step 5: 创建 Query Hook**

```bash
mkdir -p apps/admin/src/api/setting-manage/organize-manage/data-permission
touch apps/admin/src/api/setting-manage/organize-manage/data-permission/index.ts
```

```typescript
// apps/admin/src/api/setting-manage/organize-manage/data-permission/index.ts

import { useListQuery } from "@/composables/use-list-query";
import type { DataPermissionListItem, DataPermissionQueryParams } from "@01s-11comm/type";

export function useDataPermissionListQuery(initialParams?: Partial<DataPermissionQueryParams>) {
  return useListQuery<DataPermissionListItem, DataPermissionQueryParams>({
    queryKeyPrefix: "settingManage:organizeManage:dataPermission:list",
    apiUrl: "/api/setting-manage/organize-manage/data-permission/list",
    initialParams,
  });
}
```

**Step 6: 更新页面文件**

```vue
<!-- src/pages/setting-manage/organize-manage/data-permission/index.vue -->
<script lang="ts" setup>
import { useDataPermissionListQuery } from "@/api/setting-manage/organize-manage/data-permission";

// 移除旧的 test-data 导入
// import { dataPermissionListData } from "./test-data"; // 删除这行

// 使用新的查询 hook
const { data, isLoading, refetch } = useDataPermissionListQuery();

// 使用 computed 获取列表数据
const dataPermissionList = computed(() => data.value?.list ?? []);
</script>
```

## 验证和测试

### 验证类型检查

```bash
# 修复一个模块后验证
pnpm -F @01s-11comm/admin typecheck

# 查看剩余错误数量
pnpm -F @01s-11comm/admin typecheck 2>&1 | grep -c "error TS"
```

### 验证运行时

```bash
# 启动开发服务器
pnpm -F @01s-11comm/admin dev

# 访问对应页面测试功能
```

### 测试检查清单

对每个修复的页面:

- [ ] 页面能正常加载
- [ ] 列表数据显示正常
- [ ] 搜索功能工作
- [ ] 分页功能工作
- [ ] Loading 状态显示
- [ ] 错误处理正常

## 批量处理建议

### 建议 1: 优先修复高频模块

1. setting-manage（7个页面）- 影响范围小，完成后立即可测试
2. 高频使用的 property-manage 页面
3. 其他模块

### 建议 2: 使用 Git 分支策略

```bash
# 为每个模块创建分支
git checkout -b fix/setting-manage-migration
# 完成后合并到 dev
git checkout dev
git merge fix/setting-manage-migration

# 下一个模块
git checkout -b fix/property-manage-migration
```

### 建议 3: 增量提交

```bash
# 每完成一个页面就提交一次
git add .
git commit -m "fix: migrate data-permission page to use Nitro API"

# 每完成一个模块就推送一次
git push origin fix/setting-manage-migration
```

## 问题排查

### 问题 1: 找不到类型定义

**症状**: `Cannot find module '@01s-11comm/type'`

**解决**:
```bash
# 重新构建 type 包
pnpm -F @01s-11comm/type build
```

### 问题 2: API 404

**症状**: 页面加载时提示 404

**检查**:
- API 文件路径是否正确
- 文件名是否为 `list.post.ts`
- Nitro 服务器是否正常运行

### 问题 3: 类型不匹配

**症状**: 运行时数据类型与定义不符

**解决**:
- 检查 Mock 数据是否符合类型定义
- 检查 API 返回格式是否正确

## 进度跟踪

### 每日更新清单

```bash
# 运行统计脚本
node scripts/complete-migration-tasks.js

# 更新 tasks.md
node scripts/update-tasks-md.js

# 查看进度
grep -c "^- \[x\]" openspec/changes/migrate-static-data-to-nitro-query/tasks.md
grep -c "^- \[ \]" openspec/changes/migrate-static-data-to-nitro-query/tasks.md
```

### 完成标准

当满足以下条件时，迁移任务完成：

- [ ] tasks.md 中所有任务标记为 `[x]`
- [ ] `pnpm typecheck` 无错误
- [ ] 所有页面手动测试通过
- [ ] 文档更新完整

---

**指南版本**: 1.0
**生成时间**: 2025-12-13
**适用范围**: migrate-static-data-to-nitro-query 任务
