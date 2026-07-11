<!-- 已经被吸收作为技能迭代材料 -->

# 2026-07-11 OpenSpec 长任务执行质量自我反省报告

## 问题分析

### 1. 错误行为描述

在执行 `migrate-superpowers-docs-to-openspec-longtask` 长任务文档重构时，出现了以下严重错误：

1. **错误移动 do-long-task 固定产物**
   - 试图将 `agent-findings.md` 和 `agent-progress.md` 重命名为 `2026-07-11-agent-findings.md`
   - 这违反了 do-long-task 核心纪律：这两个文件是固定产物，位置不能移动

2. **错误改动 OpenSpec 核心文件**
   - 试图将 `design.md` 和 `proposal.md` 重命名
   - 这违反了 OpenSpec 规范：这些是 OpenSpec 工件链的核心文件

3. **不理解任务边界**
   - 不清楚哪些文件可以重命名，哪些文件必须保留原名
   - 没有先阅读 do-long-task 技能指导

### 2. 根本原因分析

#### 2.1 OpenSpec 工件链认知缺失

OpenSpec change 有严格的工件链结构：

```plain
proposal.md     → 设计目标（Why/What）
design.md       → 架构设计
specs/*/spec.md → 详细规范
tasks.md        → 唯一可执行任务源
agent-progress.md  → 进度记录（固定产物）
agent-findings.md  → 风险发现（固定产物）
```

**核心错误**：不理解 `agent-progress.md` 和 `agent-findings.md` 是 do-long-task 框架的**固定产物**，它们的位置和名称是规范要求的，不能随意更改。

#### 2.2 do-long-task 核心纪律违反

根据 `do-long-task` 技能规范（SKILL.md §76-88）：

- 任务源只用一份，OpenSpec 下以 `tasks.md` 为唯一任务清单
- 进度写入 `agent-progress.md`
- 失败路径、坑点写入 `agent-findings.md`
- 不要创建第二套任务系统

**本次错误**：试图创建额外的文档结构，违反了"只保留一个任务源"的核心纪律。

---

## 历史经验教训整合

### 1. 已记录的关键 Gotcha

#### #4421: Do not conflate task conversion with execution progress

- **教训**：任务格式转换本身不是 Phase7 Nitro 迁移执行
- **教训**：`agent-progress.md` 不应记录尚未执行的任务格式转换流水
- **教训**：`tasks.md` 是唯一可执行任务源

#### #5250/#5253: 文档位置不能随意移动

- **教训**：`agent-findings.md` 和 `agent-progress.md` 必须在 openspec change 根目录
- **教训**：只能在 `tasks.md` 定义的目录结构下创建文档

### 2. 验证通过但 lint 未通过的边界意识

#### #4787: 不混淆 OpenSpec 完成与项目级质量

- **教训**：OpenSpec tasks 全部完成 ≠ 项目级 lint 全部通过
- **教训**：遇到 lint debt 应作为独立切片处理，不能混入 OpenSpec 收尾

---

## OpenSpec/Do-long-task 执行规范

### 1. 执行前必读清单

执行任何 OpenSpec 长任务前，必须阅读：

1. ✅ `do-long-task/SKILL.md` - 全局技能指导
2. ✅ `openspec/SKILL.md` - OpenSpec 工作流指导
3. ✅ 当前 change 的 `proposal.md` - 设计目标
4. ✅ 当前 change 的 `design.md` - 架构设计
5. ✅ 当前 change 的 `specs/*/spec.md` - 详细规范
6. ✅ 当前 change 的 `tasks.md` - 唯一任务源
7. ✅ 当前 change 的 `agent-progress.md` - 进度记录
8. ✅ 当前 change 的 `agent-findings.md` - 风险发现

### 2. OpenSpec 工件链纪律

| 文件类型              | 示例                                     | 能否重命名 | 能否移动 |
| --------------------- | ---------------------------------------- | ---------- | -------- |
| OpenSpec 核心工件     | `proposal.md`, `design.md`, `tasks.md`   | ❌ 不能    | ❌ 不能  |
| do-long-task 固定产物 | `agent-progress.md`, `agent-findings.md` | ❌ 不能    | ❌ 不能  |
| OpenSpec 规范         | `specs/*/spec.md`                        | ❌ 不能    | ❌ 不能  |
| 任务产生的报告        | `reports/**/*.md`                        | ✅ 可以    | ✅ 可以  |
| 审计证据              | `evidence-matrix/**/*.md`                | ✅ 可以    | ✅ 可以  |
| 台账记录              | `ledger/**/*.md`                         | ✅ 可以    | ✅ 可以  |

### 3. 文档重命名规则

#### 3.1 可以重命名的文件

- 任务执行过程中产生的**阶段性报告**
- 审计证据、进度报告
- 必须遵循 `YYYY-MM-DD-*.md` 格式

#### 3.2 不能重命名的文件

- OpenSpec 核心工件：`proposal.md`, `design.md`, `tasks.md`
- do-long-task 固定产物：`agent-progress.md`, `agent-findings.md`
- OpenSpec 规范：`specs/*/spec.md`

### 4. 任务源纪律

1. **唯一任务源**：`tasks.md` 是唯一可执行任务清单
2. **不创建第二套**：禁止在聊天或临时文件中维护独立的 checklist
3. **遗漏任务处理**：发现遗漏时，先更新 `tasks.md`，再继续执行

### 5. 进度与发现记录

| 文件                | 职责                                | 更新时机       |
| ------------------- | ----------------------------------- | -------------- |
| `agent-progress.md` | 记录 checkpoint、验证命令、证据路径 | 每轮状态变更后 |
| `agent-findings.md` | 记录风险、冲突、失败路径、禁止误判  | 发现问题时     |

---

## 失败模式与改进方案

### 1. 失败模式清单

| #   | 失败模式                       | 严重程度 | 根因               |
| --- | ------------------------------ | -------- | ------------------ |
| 1   | 随意重命名 OpenSpec 核心工件   | CRITICAL | 不理解工件链       |
| 2   | 随意移动 do-long-task 固定产物 | CRITICAL | 不理解固定产物定义 |
| 3   | 不阅读 do-long-task 技能指导   | HIGH     | 急于行动           |
| 4   | 不阅读 OpenSpec specs 规范     | HIGH     | 跳过规范           |
| 5   | 任务清单不严格拓展             | HIGH     | 偷懒               |
| 6   | 不及时更新 tasks.md            | MEDIUM   | 遗忘               |

### 2. 改进方案

#### 2.1 执行前检查清单

```markdown
## OpenSpec 长任务执行前检查清单

- [ ] 已阅读 `do-long-task/SKILL.md`
- [ ] 已阅读当前 change 的 `proposal.md`
- [ ] 已阅读当前 change 的 `design.md`
- [ ] 已阅读当前 change 的 `specs/*/spec.md`
- [ ] 已阅读当前 change 的 `tasks.md`
- [ ] 已阅读当前 change 的 `agent-progress.md`
- [ ] 已阅读当前 change 的 `agent-findings.md`
- [ ] 已理解 OpenSpec 工件链
- [ ] 已理解哪些文件不能重命名/移动
```

#### 2.2 文档操作安全规则

**规则 1**：任何文件重命名/移动前，必须先判断：

- 是 OpenSpec 核心工件吗？（proposal/design/tasks）→ ❌ 不能
- 是 do-long-task 固定产物吗？（agent-progress/agent-findings）→ ❌ 不能
- 是 OpenSpec 规范文件吗？（specs/*/spec.md）→ ❌ 不能

**规则 2**：只有任务执行产生的报告/证据可以重命名，且必须遵循 `YYYY-MM-DD-*.md` 格式

#### 2.3 任务清单维护规则

- 发现遗漏任务 → 先更新 `tasks.md`
- 任务完成 → 更新 `agent-progress.md`
- 发现风险/坑点 → 更新 `agent-findings.md`
- 不在聊天中维护独立 checklist

---

## 未来执行承诺

### 1. 执行纪律

1. **严格执行前必读清单**：不跳读 OpenSpec 工件链
2. **严格遵守工件链纪律**：不随意重命名/移动核心文件
3. **严格维护任务清单**：遗漏任务先更新 tasks.md
4. **严格记录进度**：每轮变更后更新 agent-progress.md

### 2. 自我约束

1. **不急于行动**：先理解规范，再动手
2. **不跳过规范**：specs/*/spec.md 是严格的执行标准
3. **不偷懒**：任务清单必须严格完整
4. **不遗忘**：使用 Memorix 记录关键决策和进度

---

## 参考记忆

- obs:5250 - 文档重构错误记录
- obs:5253 - 文档错误修复记录
- obs:4421 - task conversion ≠ execution progress
- obs:4787 - OpenSpec 完成 ≠ lint 通过
- obs:4789 - Handoff 记录

---

**报告日期**：2026-07-11
**报告类型**：自我反省与经验教训
**涉及 Change**：migrate-superpowers-docs-to-openspec-longtask
