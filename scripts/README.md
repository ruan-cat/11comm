# 自动化迁移脚本使用说明

## 1. 脚本概述

本目录包含用于 `migrate-static-data-to-nitro-query` 任务的自动化迁移脚本。

## 2. 可用脚本

### 2.1 `migrate-tasks-batch.mjs` （推荐）

批量处理所有待办任务，一次性生成所有文件。

**使用方法**：

```bash
# 在项目根目录运行
node scripts/migrate-tasks-batch.mjs
```

**特点**：
- 一次性处理所有任务
- 不会因错误而中断
- 最后统一进行类型检查
- 提供详细的统计信息

**输出示例**：

```log
🚀 开始批量迁移任务...

📊 共找到 337 个待完成任务

✅ 更新任务文件，标记 227 个任务为已完成

📈 迁移统计：
   总任务数: 337
   完成任务: 210
   跳过任务: 61
   失败任务: 0
   页面更新: 66 (需要手动处理)

🔍 运行类型检查...
✅ 类型检查通过

✨ 完成！
```

### 2.2 `migrate-tasks-automation.mjs`

分批处理任务，每25个任务进行一次类型检查。

**使用方法**：

```bash
node scripts/migrate-tasks-automation.mjs
```

**特点**：
- 每25个任务运行一次类型检查
- 遇到类型错误时停止
- 适合需要及时发现问题的场景

## 3. 脚本功能

两个脚本都会自动完成以下工作：

### 3.1 文件生成

对于每个待处理的页面，自动生成4个文件：

1. **类型定义文件**
   - 路径：`apps/type/src/business/{module}/{submodule}/{page}.ts`
   - 内容：`ListItem`、`QueryParams` 接口和选项常量

2. **Mock 数据文件**
   - 路径：`apps/admin/server/api/{module}/{submodule}/{page}/mock-data.ts`
   - 内容：模拟的列表数据（5条示例）

3. **Nitro API 接口**
   - 路径：`apps/admin/server/api/{module}/{submodule}/{page}/list.post.ts`
   - 内容：Nitro event handler，支持分页和筛选

4. **TanStack Query Hook**
   - 路径：`apps/admin/src/api/{module}/{submodule}/{page}/index.ts`
   - 内容：`useListQuery` hook 封装

### 3.2 自动更新导出

脚本会自动更新以下导出文件：

```
apps/type/src/business/
├── property-manage/
│   ├── community-manage/index.ts
│   ├── contract-manage/index.ts
│   ├── expense-manage/index.ts
│   ├── parking-manage/index.ts
│   ├── patrol-manage/index.ts
│   ├── repairs-manage/index.ts
│   ├── report-manage/index.ts
│   └── index.ts
```

### 3.3 任务标记

自动将任务文件（`openspec/changes/migrate-static-data-to-nitro-query/tasks.md`）中的：

```markdown
- [ ] 4.1.1.1 迁移类型到 `apps/type/...`
```

更新为：

```markdown
- [x] 4.1.1.1 迁移类型到 `apps/type/...`
```

## 4. 查看进度

### 4.1 统计已完成任务

```bash
grep -c "^\- \[x\]" openspec/changes/migrate-static-data-to-nitro-query/tasks.md
```

### 4.2 统计待完成任务

```bash
grep -c "^\- \[ \]" openspec/changes/migrate-static-data-to-nitro-query/tasks.md
```

### 4.3 查看生成的文件数量

```bash
# 类型文件
find apps/type/src/business/property-manage -name '*.ts' -not -name 'index.ts' | wc -l

# Mock 数据文件
find apps/admin/server/api/property-manage -name 'mock-data.ts' | wc -l

# API 接口文件
find apps/admin/server/api/property-manage -name 'list.post.ts' | wc -l

# API Hook 文件
find apps/admin/src/api/property-manage -name 'index.ts' | wc -l
```

## 5. 注意事项

### 5.1 脚本限制

脚本**不会处理**以下任务：

- 页面文件更新（`更新 src/pages/.../index.vue`）
  - 原因：需要手动调整组件逻辑和数据绑定
  - 数量：约66个任务

### 5.2 手动处理项

运行脚本后，仍需手动完成：

1. **更新页面文件**：替换旧的测试数据导入和API调用
2. **调整类型定义**：根据实际需求修改生成的类型
3. **完善 Mock 数据**：替换示例数据为真实的业务数据
4. **修复类型错误**：处理页面使用旧类型的问题

## 6. 故障排除

### 6.1 类型检查失败

如果类型检查失败，可能的原因：

1. **导出冲突**：检查是否有重复的类型定义
2. **页面使用旧类型**：页面还在使用旧的测试数据类型
3. **项目原有错误**：某些错误可能不是迁移引入的

**解决方法**：

```bash
# 运行类型检查查看详细错误
pnpm -F @01s-11comm/admin typecheck
```

### 6.2 脚本执行失败

如果脚本执行失败：

1. 检查 Node.js 版本（需要 >= 16）
2. 确保在项目根目录运行
3. 检查任务文件路径是否正确

## 7. 效率提升

- **手动处理预估时间**：每个任务平均 5 分钟 × 337 任务 = 约 28 小时
- **自动化处理时间**：约 3 分钟
- **效率提升**：约 **560倍**

## 8. 相关文档

- 迁移报告：`apps/admin/src/docs/reports/2025-12-13-migration-automation-report.md`
- 任务清单：`openspec/changes/migrate-static-data-to-nitro-query/tasks.md`
- OpenSpec 文档：`openspec/AGENTS.md`
