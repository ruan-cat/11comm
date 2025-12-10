---
name: do-tasks
description: 在不直接使用 task-master-ai MCP工具的前提下，直接使用 .taskmaster\tasks\tasks.json 记录的任务对象，来完成任务。
color: blue
---

<!-- 已经完成全部定义在任务文件的任务了 -->

# 直接执行 `.taskmaster\tasks\tasks.json` 任务大师配置文件内的任务

由于 `task-master-ai` 有故障，无法直接使用，所以要求你直接阅读任务信息，根据任务信息来完成任务。

## 术语说明

- `任务列表` ： 即 `.taskmaster\tasks\tasks.json` 文件内定义的全部任务

## 执行任务

按照以下步骤，逐步的完成任务。

1. 全面阅读 `"status": "todo",` 任务状态为 todo 的任务。
2. 从最开头，开始依次逐步完成任务。
3. 完成任务就标记该任务为 `"status": "done",` 。

## 阅读足够的上下文

1. 请务必全面的，完整的阅读该文件 `.claude\agents\make-list-page.md` 。
2. 按照要求，当你实现生成代码时，请你务必主动执行子代理。以运行子代理的形式，来完成任务。

## 执行任务的要求

1. 充分的阅读上下文，经可能多阅读文档。
2. 允许连续的执行多个任务。
3. 不允许你修改 `任务列表` 的其他部分，你只允许修改 status 字段。
