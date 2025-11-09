# 🚀 快速开始 - 第一个任务

**任务编号**: TASK-001
**目标页面**: dev-team/cache-manage/
**预计耗时**: 30-45 分钟

---

## 📋 任务详情

### 需要完成的工作

在 `apps/admin/src/pages/dev-team/cache-manage/` 目录：

1. ✅ `index.vue` 已存在
2. ✅ `components/` 目录和表单文件已存在
3. ❌ **创建 `test-data.ts`**（缺失）

### 具体要求

创建 `test-data.ts` 文件，包含：
- 定义业务类型（根据 index.vue 中的字段）
- 生成 35 条假数据
- 创建下拉选项（如果有）

---

## 🎯 开始改造

### 方式 1: 直接开始

告诉 Claude：

```
我要执行 TASK-001：改造 dev-team/cache-manage 页面
```

Claude 会自动：
1. 读取任务详情
2. 探索现有代码
3. 制定改造计划
4. 执行改造
5. 运行类型检查

### 方式 2: 学习后开始

1. **阅读文档**（5 分钟）
   ```bash
   # 查看改造要求
   code .claude/commands/make-std-list-page-and-formlike-dialog.md

   # 查看列表页标准
   code .claude/agents/make-list-page.md
   ```

2. **查看现有代码**（5 分钟）
   ```bash
   # 打开目标页面
   code apps/admin/src/pages/dev-team/cache-manage/index.vue

   # 查看参考示例
   code apps/admin/src/pages/operation-team/data-manage/property-management-company/
   ```

3. **开始改造**
   - 告诉 Claude 你的计划
   - 分步骤执行
   - 随时提问

---

## 📚 参考文件

### 标准格式示例

位置: `apps/admin/src/pages/operation-team/data-manage/property-management-company/`

```
property-management-company/
├── index.vue              # 学习这个文件的写法
├── test-data.ts           # 学习这个文件的数据结构
└── components/
    ├── form.ts           # 表单类型
    └── form.vue          # 表单组件
```

### 需要阅读的文件

1. **任务清单**: `.taskmaster/LIST.md`（TASK-001 详情）
2. **改造要求**: `.claude/commands/make-std-list-page-and-formlike-dialog.md`（步骤 1-7）
3. **列表页标准**: `.claude/agents/make-list-page.md`（所有章节）

---

## ⚡ 改造步骤

### 步骤 1: 创建 test-data.ts

目标文件: `apps/admin/src/pages/dev-team/cache-manage/test-data.ts`

需要包含：
```ts
// 1. 定义业务类型（根据 index.vue 的字段）
export interface CacheManage {
  // 字段...
}

// 2. 假数据（35条）
export const tableData: CacheManage[] = [
  // 数据...
];

// 3. 下拉选项（如果有）
// export const *Options: OptionsType = [...]
```

### 步骤 2: 重构 index.vue

修改文件: `apps/admin/src/pages/dev-team/cache-manage/index.vue`

需要添加/修改：

1. **导入数据**
   ```ts
   import { tableData } from "./test-data";
   ```

2. **添加响应式变量**
   ```ts
   const tableData = ref<CacheManage[]>([]);
   const pagination = ref<PaginationProps>({...});
   // ...其他变量
   ```

3. **实现 loadTableData() 函数**
   ```ts
   async function loadTableData() {
     // 模拟分页和搜索
   }
   ```

4. **添加事件处理函数**
   - handleSearch()
   - handleReSearch()
   - handlePageSizeChange()
   - handleCurrentPageChange()

5. **添加 onMounted**
   ```ts
   onMounted(async () => {
     await loadTableData();
   });
   ```

6. **修改模板**
   - 添加 `<PlusSearch>`
   - 修改 `<PureTableBar>` 和 `<PureTable>`
   - 配置 columns

### 步骤 3: 创建 components/form.ts

目标文件: `apps/admin/src/pages/dev-team/cache-manage/components/form.ts`

定义表单类型。

### 步骤 4: 创建 components/form.vue

目标文件: `apps/admin/src/pages/dev-team/cache-manage/components/form.vue`

创建命令式弹框表单。

### 步骤 5: 类型检查

```bash
pnpm -F @01s-11comm/admin typecheck
```

修复所有错误。

### 步骤 6: 测试

```bash
pnpm -F @01s-11comm/admin dev
```

在浏览器中测试：
- 数据显示
- 搜索功能
- 分页功能
- 新增/编辑弹框

### 步骤 7: 提交代码

```bash
git add .

# Claude 会帮你生成提交消息
git commit -m "$(cat <<'EOF'
feat(admin): 改造 TASK-001 dev-team/cache-manage 页面

- 添加 test-data.ts（35条假数据）
- 重构 index.vue 使用标准模板
- 创建 components/form.ts 和 form.vue
- 实现 loadTableData() 假分页
- 添加搜索、分页、重置功能

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

git push origin dev
```

### 步骤 8: 标记完成

告诉 Claude：
```
我已成功完成 TASK-001
```

---

## 💡 提示和技巧

### 如何与 Claude 交流

❌ 不要说：
```
改造这个页面
```

✅ 应该说：
```
我要执行 TASK-001：改造 dev-team/cache-manage 页面（需要创建 test-data.ts）
```

### 遇到困难时

告诉 Claude：
```
我在改造 TASK-001 时遇到了问题：

1. 问题描述
2. 错误信息（如果有）
3. 相关代码片段
4. 我已经尝试了...

请帮助我解决
```

### 节省时间

- [ ] 熟悉改造要求文档（.claude/commands/...）
- [ ] 记住常用的变量名（pagination, columns, plusSearchModel）
- [ ] 使用快捷键（例如: `pnpm typecheck`）
- [ ] 保持终端和编辑器快速切换

---

## 📊 预期结果

完成后，你的页面应该有：

### 文件结构
```
dev-team/cache-manage/
├── index.vue
├── test-data.ts          ← 新建
└── components/
    ├── form.ts          ← 新建
    └── form.vue         ← 新建
```

### 功能清单
- [x] 加载数据（假数据）
- [x] 显示数据（表格）
- [x] 搜索过滤
- [x] 分页切换
- [x] 重置搜索
- [x] 新增按钮（弹框）
- [x] 编辑按钮（弹框）
- [x] 删除按钮（确认）

### 质量标准
- [x] 无 TypeScript 错误
- [x] 代码风格统一
- [x] 符合 .claude 文档要求

---

## 🎉 第一个任务完成！

完成后，你应该：

1. ✅ `test-data.ts` 已创建（35条数据）
2. ✅ `index.vue` 已重构（标准模板）
3. ✅ `components/form.ts` 已创建
4. ✅ `components/form.vue` 已创建
5. ✅ 类型检查通过
6. ✅ 功能测试通过
7. ✅ 代码已提交
8. ✅ 任务已标记完成

**接下来**: 继续 TASK-002！

---

## 🤔 可能遇到的问题

### Q: 我不知道页面有哪些字段，怎么办？

**A**: 告诉 Claude：
```
请帮我分析 dev-team/cache-manage/index.vue，提取所有业务字段
```

### Q: 测试数据应该怎么生成？

**A**: 告诉 Claude：
```
请为 dev-team/cache-manage 生成 35 条假数据
字段：xxx, yyy, zzz...
```

### Q: 类型检查有很多错误，怎么办？

**A**: 告诉 Claude：
```
请帮我修复这些类型错误：[粘贴错误信息]
```

### Q: 页面不显示数据，怎么办？

**A**:
1. 检查 test-data.ts 是否导出了 tableData
2. 检查 index.vue 是否正确导入
3. 检查 loadTableData() 是否正确调用
4. 打开浏览器控制台查看错误

---

## 🔗 快速链接

- **任务清单**: `.taskmaster/LIST.md`
- **改造要求**: `.claude/commands/make-std-list-page-and-formlike-dialog.md`
- **列表页标准**: `.claude/agents/make-list-page.md`
- **使用指南**: `.taskmaster/HOW-TO-USE.md`

---

**祝你成功完成第一个任务！** 🚀

开始时间: 2025-11-09
预计耗时: 30-45 分钟
