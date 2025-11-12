# Taskmaster AI 使用指南 - 列表页改造任务

## 概述

本文档说明如何使用 taskmaster-ai MCP 来完成 01s-11comm 智慧社区项目的列表页改造任务。

## 任务概览

总共需要改造 **82 个列表页**，这些页面分布在 4 个主要模块中：

| 模块            | 列表页数量 | 路径前缀                                |
| :-------------- | :--------- | :-------------------------------------- |
| setting-manage  | 12         | `apps/admin/src/pages/setting-manage/`  |
| dev-team        | 9          | `apps/admin/src/pages/dev-team/`        |
| operation-team  | 13         | `apps/admin/src/pages/operation-team/`  |
| property-manage | 48         | `apps/admin/src/pages/property-manage/` |

## 快速开始

### 步骤 1: 查看任务列表

```bash
# 查看所有任务
/taskmaster list

# 查看特定模块的任务
/taskmaster filter --tag setting-manage
/taskmaster filter --tag property-manage

# 查看单个任务详情
/taskmaster show task-001
```

### 步骤 2: 启动任务

```bash
# 启动单个任务（推荐）
/taskmaster start task-001

# 批量启动多个任务（不推荐，容易出错）
/taskmaster start task-001 task-002 task-003

# 启动整个标签下的所有任务
/taskmaster start --tag property-manage
```

### 步骤 3: 监控任务进度

```bash
# 查看当前进行中的任务
/taskmaster status

# 查看已完成的任务
/taskmaster list --status completed

# 查看统计信息
/taskmaster stats
```

## 推荐工作流程

### 方式一：按模块逐个完成（推荐）

按照模块顺序，一次只处理一个列表页，确保质量：

1. **从 setting-manage 开始**（共 12 个任务）

   ```bash
   /taskmaster start task-001  # 员工信息
   /taskmaster start task-002  # 组织信息
   ...
   /taskmaster start task-012  # 社区配置
   ```

2. **接着完成 dev-team**（共 9 个任务）

   ```bash
   /taskmaster start task-013  # 菜单目录
   ...
   /taskmaster start task-020  # 配置中心
   ```

3. **然后完成 operation-team**（共 13 个任务）

   ```bash
   /taskmaster start task-021  # 修改密码
   ...
   /taskmaster start task-032  # 报表组件
   ```

4. **最后完成 property-manage**（共 48 个任务，分批次）

   ```bash
   # 社区管理（9个）
   /taskmaster start task-033
   ...
   /taskmaster start task-039

   # 合同管理（5个）
   /taskmaster start task-040
   ...
   /taskmaster start task-044

   # 费用管理（16个） - 建议分2批
   /taskmaster start task-045
   ...
   /taskmaster start task-060

   # 房产管理（10个）
   /taskmaster start task-061
   ...
   /taskmaster start task-070

   # 停车管理（4个）
   /taskmaster start task-071
   ...
   /taskmaster start task-074

   # 巡检管理（6个）
   /taskmaster start task-075
   ...
   /taskmaster start task-080

   # 报修管理（7个）
   /taskmaster start task-081
   ...
   /taskmaster start task-087

   # 报表管理（13个） - 建议分2批
   /taskmaster start task-088
   ...
   /taskmaster start task-100
   ```

### 方式二：分批次执行

如果时间有限，可以按以下批次执行：

**每日批次（建议）**

- 上午：4-5 个任务
- 下午：4-5 个任务
- 预计完成时间：8-10 天

**每周批次**

- 每周完成 20-25 个任务
- 预计完成时间：3-4 周

## 任务结构说明

每个任务包含以下信息：

```json
{
  "id": "task-001",           // 任务ID，从 task-001 到 task-100
  "name": "改造 xxx 列表页",    // 任务名称
  "description": "...",        // 详细描述
  "priority": "medium",        // 优先级
  "status": "pending",         // 状态（pending/in_progress/completed）
  "dependencies": [],          // 依赖项（目前无依赖）
  "tags": [...],               // 标签，用于分类筛选
  "filePath": "...",           // 目标文件路径
  "command": "/make-std..."    // 执行的命令
}
```

## 常用命令速查

### 基础命令

```bash
# 列出所有命令
/taskmaster help

# 查看任务列表
/taskmaster list

# 查看任务详情
/taskmaster show <task-id>

# 启动任务
/taskmaster start <task-id>

# 完成任务（如果自动完成失败）
/taskmaster complete <task-id>

# 重置任务状态（如果出错）
/taskmaster reset <task-id>
```

### 筛选命令

```bash
# 按标签筛选
/taskmaster filter --tag setting-manage
/taskmaster filter --tag property-manage
/taskmaster filter --tag expense-manage

# 按状态筛选
/taskmaster filter --status pending
/taskmaster filter --status completed

# 组合筛选
/taskmaster filter --tag property-manage --status pending
```

### 批量操作（谨慎使用）

```bash
# 启动前 N 个任务
/taskmaster start task-001 task-002 task-003 task-004 task-005

# 启动某个模块的所有任务（太多，建议分批）
/taskmaster start --tag setting-manage
```

## 最佳实践

### ✓ 推荐做法

1. **一次只处理一个任务**：确保质量，避免错误
2. **处理完检查类型错误**：每次完成后运行 `pnpm -F @01s-11comm/admin typecheck`
3. **及时提交代码**：完成一个模块后提交一次
4. **查看任务输出**：注意观察 Claude Code 的返回信息
5. **遇到问题及时重置**：如果任务出错，使用 `/taskmaster reset <task-id>`

### ✗ 避免做法

1. **不要一次性启动太多任务**：容易超出 token 限制，导致错误
2. **不要忽略类型错误**：确保每个任务完成后类型检查通过
3. **不要跳过测试**：关键页面需要进行功能测试
4. **不要忽略依赖关系**：（目前无依赖，但未来可能有）

## 监控进度

### 查看总体进度

```bash
/taskmaster stats
```

### 生成进度报告

每完成一个模块，可以生成报告：

```bash
# 查看已完成任务
/taskmaster list --status completed

# 复制已完成任务的列表到报告中
```

### 手动记录

建议在工作日志中记录：

```markdown
## 进度记录

### 已完成

- [x] setting-manage 模块（12/12）
  - task-001: staff-info
  - task-002: org-info
  - ...

- [x] dev-team 模块（9/9）
  - ...

### 进行中

- [ ] operation-team 模块（3/13）
  - task-021: change-password（已完成）
  - task-022: system-config（进行中）
  - ...

### 待开始

- [ ] property-manage 模块（0/48）
```

## 故障排除

### 问题 1: 任务启动后报错

**现象**：Claude Code 返回错误信息

**解决**：

```bash
# 1. 重置任务
/taskmaster reset <task-id>

# 2. 查看任务详情
/taskmaster show <task-id>

# 3. 手动执行命令（如果需要）
/make-std-list-page-and-formlike-dialog <path>
```

### 问题 2: 任务完成后类型检查不通过

**现象**：运行 `pnpm typecheck` 有错误

**解决**：

```bash
# 1. 查看具体错误
pnpm -F @01s-11comm/admin typecheck

# 2. 手动修复类型错误
# 3. 标记任务完成
/taskmaster complete <task-id>
```

### 问题 3: 超出 Token 限制

**现象**：Claude Code 提示 context length exceeded

**解决**：

```bash
# 1. 重置当前任务
/taskmaster reset <task-id>

# 2. 分批执行，减少并发任务
# 3. 清理不必要的上下文
```

## 完成标准

一个任务被认为"完成"的标准：

1. ✅ taskmaster-ai 执行成功
2. ✅ 命令 `/make-std-list-page-and-formlike-dialog` 完成
3. ✅ 类型检查通过（pnpm typecheck 无错误）
4. ✅ 代码已保存到文件系统
5. ✅ （可选）进行了基本功能测试

## 预计时间

根据经验估算：

- **单个任务**：3-5 分钟
- **setting-manage 模块**（12 个）：40-60 分钟
- **dev-team 模块**（9 个）：30-45 分钟
- **operation-team 模块**（13 个）：45-65 分钟
- **property-manage 模块**（48 个）：2.5-4 小时

**总计时间**：约 5-7 小时（不包括测试和调试时间）

建议分 3-5 天完成，每天 1-2 小时。

## 支持与反馈

如果遇到问题：

1. 查看 `.taskmaster/TASKMASTER-AI-QUICKSTART.md` 文档
2. 查看 `.taskmaster/README.md` 基础文档
3. 查看 `.claude/commands/make-std-list-page-and-formlike-dialog.md` 命令说明
4. 向团队成员寻求帮助

## 开始你的第一个任务

准备好了吗？让我们从第一个任务开始：

```bash
/taskmaster start task-001
```

按照提示操作，完成后使用：

```bash
/taskmaster start task-002
```

祝你好运！
