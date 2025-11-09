# taskmaster-ai MCP 使用指南

**文档版本**: v1.0
**创建日期**: 2025-11-09
**适用项目**: 01s-11comm 智慧社区后台管理系统

---

## 📋 目录

1. [快速开始](#快速开始)
2. [任务管理流程](#任务管理流程)
3. [执行列表页改造任务](#执行列表页改造任务)
4. [常用命令](#常用命令)
5. [最佳实践](#最佳实践)
6. [故障排除](#故障排除)

---

## 🚀 快速开始

### 1.1 环境检查

确保你已经安装了 taskmaster-ai MCP：

```bash
# 检查是否已安装
claude mcp list

# 你应该能看到 taskmaster-ai
```

如果没有安装，执行：
```bash
claude mcp add taskmaster-ai -- npx -y task-master-ai
```

### 1.2 项目结构

执行初始化后，项目根目录应该有以下结构：

```
D:\code\github-desktop-store\01s-11comm/
├── .taskmaster/
│   ├── config.json          # 项目配置
│   ├── tasks/               # 任务文件存储
│   ├── docs/                # 文档
│   │   ├── prd.txt         # 产品需求文档
│   │   ├── pages-directory-structure.md
│   │   ├── LIST.md         # 任务清单
│   │   └── HOW-TO-USE.md   # 本文件
│   └── reports/             # 进度报告
├── apps/
│   └── admin/
│       └── src/
│           └── pages/       # 需要改造的页面
└── .claude/
    ├── agents/              # 子代理配置
    └── commands/            # 命令文档
```

### 1.3 配置 API 密钥

在 Cursor 或 Claude Code 中配置环境变量：

```json
{
  "mcpServers": {
    "task-master-ai": {
      "env": {
        "OPENAI_API_KEY": "your-key-here",
        "ANTHROPIC_API_KEY": "your-key-here"
      }
    }
  }
}
```

**注意**: 使用 Claude Code 时，可以不配置 API 密钥。

---

## 📊 任务管理流程

### 2.1 整体工作流程

```
┌─────────────────┐
│  查看任务清单    │  ←  TASK-001 到 TASK-109
│   (LIST.md)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  选择当前任务    │
│  从优先级1开始   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  阅读文档要求    │  ←  .claude/commands/
│                 │  ←  .claude/agents/
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  执行任务改造    │  ←  修改页面文件
│                 │  ←  创建缺失文件
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  类型检查        │  ←  pnpm typecheck
│                 │  ←  修复错误
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  提交代码        │  ←  git commit
│                 │  ←  包含任务编号
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  更新任务状态    │  ←  标记完成
│                 │  ←  生成报告
└─────────────────┘
```

### 2.2 单任务执行流程

对于每个任务（例如 TASK-001），执行以下步骤：

#### 步骤 1: 查看任务详情
```bash
# 打开 LIST.md 查看 TASK-001 的详细信息
# 了解需要改造的文件路径
```

#### 步骤 2: 阅读改造要求
```bash
# 仔细阅读以下文档
.claude\commands\make-std-list-page-and-formlike-dialog.md
.claude\agents\make-list-page.md
.claude\agents\make-dialog.md
.claude\agents\make-form-for-dialog.md
.claude\agents\code-style.md
.claude\agents\fix-type-error.md
```

#### 步骤 3: 分析现有代码
使用 Claude Code 打开需要改造的文件：

```bash
# 例如 TASK-001
code apps/admin/src/pages/dev-team/cache-manage/index.vue
```

分析当前代码与标准模板的差异。

#### 步骤 4: 执行改造
使用 Claude Code 的子代理来改造页面：

```
对 {{ 页面路径 }} 执行列表页改造
```

Claude Code 会自动调用相应的子代理（make-list-page, make-dialog, make-form-for-dialog）。

#### 步骤 5: 类型检查
```bash
# 在项目根目录执行
pnpm -F @01s-11comm/admin typecheck

# 如果有错误，继续修复
```

#### 步骤 6: 测试
```bash
# 启动开发服务器
pnpm -F @01s-11comm/admin dev

# 在浏览器中检查页面
# 测试搜索、分页、表单等功能
```

#### 步骤 7: 提交代码
```bash
# 添加文件
git add .

# 提交（包含任务编号）
git commit -m "$(cat <<'EOF'
feat(admin): 改造 TASK-001 dev-team/cache-manage 列表页

- 添加 test-data.ts
- 重构 index.vue 使用标准模板
- 创建 components/form.ts 和 form.vue
- 实现假分页和搜索功能

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# 推送到远程
git push origin dev
```

#### 步骤 8: 标记任务完成
使用 taskmaster-ai 标记任务完成：
```bash
# 查看可用命令（假设 taskmaster-ai 已连接）
task-master task-complete TASK-001
```

---

## 🎯 执行列表页改造任务

### 3.1 启动改造会话

每次开始工作时，告诉 Claude：

```
我今天要执行 TASK-XXX 任务，改造 XXXXXX 页面
```

### 3.2 自动执行流程

Claude Code 会自动：

1. **读取文档**
   - 从 LIST.md 获取任务详情
   - 从 .claude/commands/ 获取改造要求

2. **探索代码**
   - 读取目标页面文件
   - 分析现有代码结构
   - 对比标准模板

3. **生成计划**
   ```
   计划改造 XXXXXX 页面：

   1. 创建 test-data.ts
      - 定义业务类型
      - 生成 35 条假数据
      - 创建下拉选项

   2. 重构 index.vue
      - 添加 loadTableData() 函数
      - 配置搜索栏 (PlusSearch)
      - 配置表格 (PureTableBar + PureTable)
      - 添加分页事件处理
      - 添加操作按钮

   3. 创建 components/form.ts
      - 定义表单类型

   4. 创建 components/form.vue
      - 实现命令式弹框表单

   5. 运行类型检查并修复错误
   ```

4. **执行任务**
   - 创建文件
   - 修改代码
   - 调用子代理

5. **验证结果**
   - 运行类型检查
   - 确保无报错

### 3.3 单页面文件清单

每个页面改造后应包含：

```
页面目录/
├── index.vue                          # 主列表页
│   ├── <template>                     # 模板部分
│   │   ├── <PlusSearch>              # 搜索栏
│   │   ├── <PureTableBar>            # 表格容器
│   │   │   └── <PureTable>           # 表格
│   │   └── <style>                   # 样式
│   ├── <script setup lang="ts">       # 脚本
│   │   ├── 类型导入
│   │   ├── 常量定义
│   │   ├── 响应式变量
│   │   │   ├── plusSearchModel
│   │   │   ├── plusSearchDefaultValues
│   │   │   ├── pagination
│   │   │   ├── columns
│   │   │   ├── tableData
│   │   │   └── pureTableProps
│   │   ├── 函数
│   │   │   ├── loadTableData()      # 核心：假分页请求
│   │   │   ├── handleSearch()       # 搜索
│   │   │   ├── handleReSearch()     # 重置
│   │   │   ├── handlePageSizeChange()
│   │   │   └── handleCurrentPageChange()
│   │   └── onMounted()              # 生命周期
│   └── <style lang="scss" scoped>   # 样式
│
├── test-data.ts                       # 假数据
│   ├── 业务类型定义
│   ├── tableData (35条数据)
│   └── *Options (下拉选项)
│
└── components/
    ├── form.ts                        # 表单类型
    │   ├── 表单VO类型
    │   └── 表单字段类型
    └──
    └── form.vue                       # 表单组件
        ├── <template>                 # 表单模板
        ├── <script setup lang="ts">    # 表单逻辑
        └── <style>                    # 表单样式
```

### 3.4 批量处理技巧

如果需要批量处理多个页面，可以：

```
请批量处理 TASK-001 到 TASK-005
```

Claude Code 会按顺序处理每个任务，但建议每次只处理 1-3 个任务，确保质量。

---

## ⌨️ 常用命令

### 4.1 taskmaster-ai 命令

```bash
# 初始化项目（已完成）
task-master init

# 创建新任务
task-master task-create "改造 dev-team/cache-manage 页面"

# 完成任务
task-master task-complete TASK-001

# 查看任务状态
task-master task-status

# 生成进度报告
task-master generate-report

# 查看所有任务
task-master list-tasks
```

### 4.2 开发命令

```bash
# 类型检查（重要！每次改造后必须执行）
pnpm -F @01s-11comm/admin typecheck

# 启动开发服务器
pnpm -F @01s-11comm/admin dev

# 构建项目
pnpm -F @01s-11comm/admin build

# 运行测试
pnpm -F @01s-11comm/admin test
```

### 4.3 Git 命令

```bash
# 查看状态
git status

# 查看差异
git diff

# 添加文件
git add .

# 提交（使用规范格式）
git commit -m "$(cat <<'EOF'
type(scope): 简短描述

详细描述（可选）

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# 推送到远程
git push origin dev
```

---

## 💡 最佳实践

### 5.1 工作节奏

- **每日目标**: 完成 3-5 个任务
- **工作时间**: 建议在上午处理复杂任务
- **休息时间**: 每 90 分钟休息 10 分钟

### 5.2 代码质量

- **类型检查**: 每次改造后必须运行 `pnpm typecheck`
- **代码审查**: 提交前仔细审查更改
- **测试验证**: 在浏览器中测试功能

### 5.3 提交规范

提交消息格式：
```
type(admin): 简短描述

详细说明（可选）

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

其中 `type` 可以是：
- `feat`: 新功能
- `fix`: 修复问题
- `refactor`: 重构
- `docs`: 文档
- `style`: 格式
- `test`: 测试

### 5.4 任务管理

- **专注单任务**: 不要同时处理多个任务
- **及时更新**: 完成任务后立即标记
- **记录问题**: 遇到困难记录到 .taskmaster/issues.md

### 5.5 文档更新

- **保持同步**: 改造完成后更新相关文档
- **添加注释**: 复杂逻辑添加注释说明
- **记录决策**: 重要决策记录到文档

---

## 🔧 故障排除

### 6.1 taskmaster-ai 无法连接

**问题**: Claude Code 无法连接到 taskmaster-ai MCP

**解决方案**:
1. 检查 MCP 配置:
   ```bash
   claude mcp list
   ```

2. 如果未安装:
   ```bash
   claude mcp add taskmaster-ai -- npx -y task-master-ai
   ```

3. 重启 Claude Code

### 6.2 类型检查失败

**问题**: `pnpm typecheck` 报错

**解决方案**:
1. 查看错误信息
2. 使用 Claude Code 修复类型错误:
   ```
   请修复这些类型错误
   ```
3. 参考 `.claude/agents/fix-type-error.md`

### 6.3 页面不显示数据

**问题**: 浏览器中页面没有显示数据

**解决方案**:
1. 检查 `test-data.ts` 是否导出 `tableData`
2. 检查 `index.vue` 是否正确导入数据
3. 检查 `loadTableData()` 函数是否正确调用
4. 打开浏览器控制台查看错误

### 6.4 搜索功能不工作

**问题**: 搜索栏无法过滤数据

**解决方案**:
1. 检查 `plusSearchColumns` 配置
2. 检查 `loadTableData()` 中的过滤逻辑
3. 检查 `plusSearchModel` 双向绑定

### 6.5 分页不工作

**问题**: 分页组件无法切换页码

**解决方案**:
1. 检查 `pagination` ref 是否定义
2. 检查 `@page-size-change` 和 `@page-current-change` 事件
3. 检查 `handlePageSizeChange` 和 `handleCurrentPageChange` 函数
4. 确保 `loadTableData()` 正确计算分页

### 6.6 表单弹框不显示

**问题**: 点击"新增/编辑"按钮没有反应

**解决方案**:
1. 检查 `openDialog` 函数调用
2. 检查 `components/form.vue` 是否正确导出
3. 检查 `addDialog` 导入和配置
4. 查看浏览器控制台错误

---

## 📞 获取帮助

如果遇到无法解决的问题：

1. **查看文档**: 检查 `.claude/` 目录下的相关文档
2. **查看示例**: 参考标准格式页面的代码
3. **记录问题**: 在 `.taskmaster/issues.md` 中记录问题
4. **寻求帮助**: 使用 Claude Code 求助

**提示**: 在提问前，先使用 TodoWrite 工具记录问题详情，包括：
- 任务编号
- 错误信息
- 已尝试的解决方案
- 相关代码片段

---

## 🎉 完成所有任务

当所有任务（TASK-001 到 TASK-109）都完成后：

1. **生成最终报告**:
   ```bash
   task-master generate-report
   ```

2. **汇总更改**: `pnpm build`

3. **提交所有更改**:
   ```bash
   git add .
   git commit -m "全部列表页改造完成（TASK-001 到 TASK-109）"
   git push origin dev
   ```

4. **更新文档**: 更新本指南和 LIST.md

5. **庆祝**: 🎊 你完成了一项重大的代码质量改进项目！

---

**最后更新**: 2025-11-09
**维护者**: Claude Code + taskmaster-ai
