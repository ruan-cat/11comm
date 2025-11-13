# Taskmaster AI 使用指南（Claude Code 场景）- 更正版

## 概述

本文档说明如何在 **Claude Code** 环境中使用任务管理系统完成 01s-11comm 智慧社区项目的列表页改造任务。

> **重要更正**：之前的报告（2025-11-12）中关于 `/taskmaster` 斜杠命令的说明是**错误的**。Claude Code 中不存在这些命令。本报告提供正确的使用方式。

## 任务概览

总共需要改造 **100 个列表页**，这些页面分布在 4 个主要模块中：

|      模块       | 列表页数量 |                路径前缀                 |
| :-------------: | :--------: | :-------------------------------------: |
| setting-manage  |     12     | `apps/admin/src/pages/setting-manage/`  |
|    dev-team     |     9      |    `apps/admin/src/pages/dev-team/`     |
| operation-team  |     13     | `apps/admin/src/pages/operation-team/`  |
| property-manage |     66     | `apps/admin/src/pages/property-manage/` |

## Claude Code 场景下的正确使用方式

### 方式一：直接与 Claude 对话（推荐）

**这是在 Claude Code 中唯一可行的方式。**

#### 1. 查看任务列表

```plain
请读取 .taskmaster/tasks/tasks.json 文件，显示所有待处理的任务
```

或者：

```plain
请读取 .taskmaster/tasks/tasks.json，筛选出状态为 pending 的任务，按 tag 分组显示
```

#### 2. 执行单个任务

```plain
请执行 task-001：改造 setting-manage/organize-manage/staff-info 列表页
```

Claude Code 会自动：

1. 读取任务详情
2. 执行 `/make-std-list-page-and-formlike-dialog` 命令
3. 运行类型检查
4. 更新任务状态

#### 3. 更新任务状态

完成后，告诉 Claude：

```plain
请将 task-001 的状态更新为 completed
```

#### 4. 查看进度

```plain
请统计 .taskmaster/tasks/tasks.json 中各状态的任务数量
```

### 方式二：使用 task-master-ai CLI（仅在终端）

如果你在**终端**中直接运行 `task-master-ai`，可以使用：

```bash
# 注意：这些命令只能在终端运行，不能在 Claude Code 对话中使用
task-master-ai list-tasks
task-master-ai task-complete task-001
```

## 推荐工作流程

### 每日工作流（按模块）

#### 第 1 阶段：setting-manage（12 个任务）

**第 1 天：**

```plain
今天我要完成以下任务：
1. task-001: staff-info
2. task-002: org-info
3. task-003: working-schedule
4. task-004: scheduling-setting

请按顺序执行这些任务
```

**第 2 天：**

```plain
今天继续完成：
5. task-005: shift-setting
6. task-006: role-permission
7. task-007: data-permission
8. task-008: change-password
```

**第 3 天：**

```plain
完成 setting-manage 模块：
9. task-009: system-config
10. task-010: register-protocol
11. task-011: initialize-cell
12. task-012: community-configuration
```

#### 第 2 阶段：dev-team（9 个任务）

**第 4-5 天：**类似方式完成 task-013 到 task-020

#### 第 3 阶段：operation-team（13 个任务）

**第 6-7 天：**完成 task-021 到 task-032

#### 第 4 阶段：property-manage（66 个任务）

**第 8-20 天：**分批完成 task-033 到 task-100

- 每天 4-6 个任务
- 按子模块分组（community-manage、contract-manage、expense-manage 等）

## 任务执行标准流程

### 与 Claude 的对话模板

```plain
我要执行 task-XXX：改造 [页面路径] 列表页

请按以下步骤执行：
1. 读取 .taskmaster/tasks/tasks.json 获取任务详情
2. 读取目标文件 [filePath]
3. 执行 /make-std-list-page-and-formlike-dialog [path]
4. 运行类型检查：pnpm -F @01s-11comm/admin typecheck
5. 如果通过，将 task-XXX 状态更新为 completed
```

### Claude 会自动完成

1. **读取任务详情**
   - 从 tasks.json 获取任务信息
   - 确认文件路径和命令

2. **执行改造**
   - 调用 `/make-std-list-page-and-formlike-dialog` 命令
   - 创建/修改必要文件
   - 生成假数据和表单组件

3. **类型检查**
   - 运行 `pnpm typecheck`
   - 修复任何类型错误

4. **更新状态**
   - 修改 tasks.json 中的任务状态
   - 更新 completedTasks 计数

## 查询和筛选任务

### 查看所有待处理任务

```plain
请读取 .taskmaster/tasks/tasks.json，列出所有 status 为 "pending" 的任务，显示 id、name 和 tags
```

### 按模块筛选

```plain
请列出所有包含 "setting-manage" tag 的任务
```

```plain
请列出所有包含 "property-manage" tag 的任务
```

### 按状态筛选

```plain
请统计已完成的任务数量（status: "completed"）
```

### 查看特定任务详情

```plain
请显示 task-001 的完整信息
```

## 批量操作（谨慎使用）

### 批量执行（小批次）

```plain
请依次执行以下任务：
- task-001
- task-002
- task-003

每个任务完成后运行类型检查，全部完成后统一更新状态
```

**注意**：建议一次不超过 3-5 个任务，避免上下文过长。

### 批量更新状态

```plain
请将以下任务状态更新为 completed：
task-001, task-002, task-003
```

## 进度追踪

### 手动统计进度

```plain
请分析 .taskmaster/tasks/tasks.json：
1. 总任务数
2. 已完成数量
3. 待处理数量
4. 按 tag 分组的进度

生成一份进度报告
```

### 生成 Markdown 报告

```plain
请根据 .taskmaster/tasks/tasks.json 的当前状态，生成一份 Markdown 格式的进度报告，包括：
- 总体进度
- 各模块进度
- 已完成任务列表
- 待处理任务列表

保存到 apps/admin/src/docs/reports/2025-11-13-progress.md
```

## 常见问题

### Q1: 为什么没有 `/taskmaster` 命令？

**A**: `/taskmaster` 命令**不存在**。之前的报告错误地假设了这些命令。在 Claude Code 中，你应该：

- 直接与 Claude 对话
- 让 Claude 读取和修改 tasks.json 文件
- 让 Claude 执行 `/make-std-list-page-and-formlike-dialog` 命令

### Q2: 如何查看任务列表？

**A**: 告诉 Claude：

```plain
请读取 .taskmaster/tasks/tasks.json 并显示任务列表
```

### Q3: 如何更新任务状态？

**A**: 告诉 Claude：

```plain
请将 task-XXX 的状态更新为 completed
```

Claude 会自动修改 tasks.json 文件。

### Q4: task-master-ai CLI 的作用是什么？

**A**: `task-master-ai` 是一个**命令行工具**，只能在**终端**中运行，不能在 Claude Code 对话中使用。在 Claude Code 场景下，你不需要直接使用它。

### Q5: 如何批量处理任务?

**A**: 与 Claude 对话：

```plain
请批量执行 task-001 到 task-005
```

但建议一次不超过 3-5 个任务。

## 正确的任务文件格式

`.taskmaster/tasks/tasks.json` 的正确格式：

```json
{
  "tasks": [
    {
      "id": "task-001",
      "name": "...",
      "description": "...",
      "priority": "medium",
      "status": "pending",
      "dependencies": [],
      "tags": [...],
      "filePath": "...",
      "command": "..."
    }
  ],
  "metadata": {
    "version": "1.0",
    "description": "...",
    "created": "2025-11-12",
    "updated": "2025-11-12T12:00:00.000Z",
    "totalTasks": 100,
    "completedTasks": 0
  }
}
```

**注意**：

- ✅ 顶层键是 `"tasks"` 和 `"metadata"`
- ❌ **不要**使用 `"master"` 包裹

## 完成标准

一个任务被认为"完成"的标准：

1. ✅ `/make-std-list-page-and-formlike-dialog` 命令执行成功
2. ✅ 类型检查通过（pnpm typecheck 无错误）
3. ✅ 文件已保存
4. ✅ tasks.json 中状态已更新为 "completed"
5. ✅ metadata.completedTasks 已递增

## 预计时间

根据经验估算：

- **单个任务**：3-5 分钟
- **setting-manage 模块**（12 个）：40-60 分钟
- **dev-team 模块**（9 个）：30-45 分钟
- **operation-team 模块**（13 个）：45-65 分钟
- **property-manage 模块**（66 个）：3-5 小时

**总计时间**：约 6-8 小时（不包括测试和调试时间）

建议分 5-10 天完成，每天 1-2 小时。

## 开始第一个任务

准备好了吗？与 Claude 说：

```plain
我要执行 task-001：改造 setting-manage/organize-manage/staff-info 列表页

请按标准流程执行：
1. 读取任务详情
2. 执行改造命令
3. 运行类型检查
4. 更新任务状态
```

## 更新日志

### 2025-11-13

- 🔧 **重大更正**：删除所有不存在的 `/taskmaster` 斜杠命令
- ✅ 提供 Claude Code 场景下的正确使用方式
- ✅ 说明 task-master-ai CLI 只能在终端使用
- ✅ 添加与 Claude 对话的模板和示例
- ✅ 修正任务文件格式说明

### 2025-11-12

- ❌ 初始版本（包含错误信息，已废弃）

---

**重要提醒**：

- ❌ 不要使用 `/taskmaster` 命令（不存在）
- ✅ 直接与 Claude 对话
- ✅ 让 Claude 读取和修改 tasks.json
- ✅ 使用 `/make-std-list-page-and-formlike-dialog` 执行改造

祝你改造顺利！🚀
