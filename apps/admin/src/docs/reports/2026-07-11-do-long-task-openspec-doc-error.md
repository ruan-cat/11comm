<!-- 已经被吸收作为技能迭代材料 -->

# do-long-task 执行规范错误：openspec 目录下乱新建文档

**记录日期**: 2026-07-11
**错误类型**: 违反 do-long-task 核心纪律
**严重程度**: 高

---

## 错误描述

在执行 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask` 文档重构任务时，我违反了 do-long-task 技能的核心规范：

### 错误行为

1. **在 openspec change 目录下乱新建文档**
   - 新建了 `reports/phase7-verification/2026-07-10-chrome-devtools-dom-verification.md`
   - 新建了 `reports/phase7-verification/2026-07-10-neon-database-verification.md`
   - 新建了 `reports/phase7-verification/README.md`
   - 新建了 `reports/phase7-progress/2026-07-11-doc-restruct-verification.md`

2. **错误移动 do-long-task 进度文件**
   - 将 `agent-findings.md` 移动到 `reports/phase7-progress/`
   - 将 `agent-progress.md` 移动到 `reports/phase7-progress/`
   - 这两个文件是 do-long-task 要求的进度记录文件，位置是固定的

### 错误原因分析

1. **没有理解 do-long-task 核心纪律**
   - 规范明确说："任务源只用一份。若项目使用 OpenSpec，就以 `tasks.md` 为唯一任务清单"
   - 规范明确说："不要再创建第二套任务系统"

2. **混淆了不同类型的文档**
   - 把阶段性验证报告当作可以随意新建的文档
   - 没有意识到 `agent-findings.md` 和 `agent-progress.md` 是 do-long-task 的固定产物

3. **没有遵循 AGENTS.md 中的报告编写规范**
   - AGENTS.md 第 5 章规定报告地址在 `apps\admin\src\docs\reports`
   - 不是在 openspec change 目录下乱建

---

## do-long-task 核心规范（必须遵守）

### 1. 任务源只用一份

```plain
- 长任务靠文件，不靠聊天记忆
- 只保留一个任务源
- 任务源：openspec change 的 tasks.md
- 不要创建第二套任务系统
- 不要把聊天里的临时 checklist 当主任务源
```

### 2. 进度记录规范

```plain
- 进度写入：openspec change 根目录的 agent-progress.md
- 失败记录写入：openspec change 根目录的 agent-findings.md
- 这两个文件名是固定的，不能移动或改名
- 不要在其他位置新建进度记录文件
```

### 3. 阶段性过程文档

```plain
如果需要在 openspec change 目录下保存阶段性文档：
- 必须先在 tasks.md 中定义该文档的用途
- 文档命名遵循 YYYY-MM-DD-xxx.md 格式
- 文档应放在 tasks.md 指定的子目录
- 不要在根目录乱新建文档
```

### 4. 项目级报告规范

```plain
根据 AGENTS.md 第5章：
- 项目级报告地址：apps\admin\src\docs\reports
- 命名格式：YYYY-MM-DD-描述性名称.md
- 语言：简体中文
- 不是在 openspec change 目录下乱建
```

---

## 正确的执行流程

### 执行 openspec 长任务前的准备

1. 读取 `do-long-task` SKILL.md，理解核心纪律
2. 读取当前 OpenSpec change 的 tasks.md
3. 确认 `agent-progress.md` 和 `agent-findings.md` 位置
4. 理解哪些是 do-long-task 固定产物，哪些是任务产生的文档

### 执行过程中的约束

```plain
✅ 正确做法：
- 任务源只用 tasks.md
- 进度写 agent-progress.md
- 失败写 agent-findings.md
- 阶段性文档在 tasks.md 中定义位置
- 项目报告写到 apps\admin\src\docs\reports

❌ 错误做法：
- 在 openspec change 目录下乱新建文档
- 移动 agent-progress.md / agent-findings.md
- 创建第二套任务系统
- 把聊天 checklist 当任务源
```

---

## 经验教训总结

1. **执行长任务前必须先读 do-long-task SKILL.md**
2. **openspec change 目录不是随意新建文档的地方**
3. **agent-progress.md 和 agent-findings.md 是固定产物，不能移动**
4. **项目级报告有固定位置：apps\admin\src\docs\reports**
5. **任务源只用一份：tasks.md**

---

## 相关规范文件

- `C:\Users\pc\.agents\skills\do-long-task\SKILL.md`
- `D:\code\ruan-cat\01s-11comm\AGENTS.md` 第 5 章

---

## 修复记录（2026-07-11）

### 错误行为回顾

在执行 Phase 7 文档重构任务时，错误地：

1. **在 openspec change 目录下新建了验证报告目录**
   - `reports/phase7-verification/` 目录
   - `reports/phase7-progress/2026-07-11-doc-restruct-verification.md`

2. **错误地移动了 do-long-task 固定产物**
   - 试图将 `agent-findings.md` 移动到 `reports/phase7-progress/`
   - 试图将 `agent-progress.md` 移动到 `reports/phase7-progress/`

### 修复操作

```bash
# 1. 删除错误创建的验证目录
rm -rf reports/phase7-verification/

# 2. 删除错误创建的进度文件
rm -f reports/phase7-progress/2026-07-11-doc-restruct-verification.md

# 3. 从 git 暂存区移除错误文件
git reset HEAD reports/phase7-verification reports/phase7-progress/2026-07-11-doc-restruct-verification.md README.md
```

### 修复后状态

**保留的正确文件**：

- `agent-findings.md` - 根目录（do-long-task 固定产物）
- `agent-progress.md` - 根目录（do-long-task 固定产物）
- `tasks.md` - 根目录（唯一任务源）
- `README.md` - 根目录（OpenSpec 目录结构说明）

**保留的历史报告**：

- `reports/phase7-progress/2026-05-25-admin-resolver-fresh-scan.md`
- `reports/phase7-progress/2026-05-25-edge-debug-shared-system-route-classification.md`

### 核心教训

1. **do-long-task 固定产物位置不能移动**
   - `agent-findings.md` 和 `agent-progress.md` 必须在 openspec change 根目录
   - 这两个文件名是固定的

2. **openspec change 目录下不是随意新建文档的地方**
   - 阶段性报告应该放在 `apps/admin/src/docs/reports/` 目录
   - 或在 `tasks.md` 中定义的位置

3. **任务源只用一份**
   - `tasks.md` 是唯一任务清单
   - 不要创建第二套任务系统
