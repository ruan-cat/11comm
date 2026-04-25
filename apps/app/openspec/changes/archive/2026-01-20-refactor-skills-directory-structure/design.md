# Design: Claude Code Skills 目录结构重构

## 1. Context

### 1.1. 背景

Claude Code Skills 是一套用于指导 AI 助手执行特定任务的技能文件。根据 [agentskills.io](https://agentskills.io/home) 规范，技能目录应遵循标准结构：

```plain
my-skill/
├── SKILL.md          # Required: instructions + metadata
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation
└── assets/           # Optional: templates, resources
```

### 1.2. 当前问题

当前 6 个技能的参考文档散落在根目录，不符合规范。

### 1.3. 约束条件

- 不能破坏现有技能的触发机制
- 必须保持 SKILL.md 作为技能入口文件
- 需要更新所有文件引用路径

## 2. Goals / Non-Goals

### 2.1. Goals

- ✅ 将所有散落的参考文档移入 `references/` 目录
- ✅ 删除空目录 `use-wot-design-uni`
- ✅ 更新所有 SKILL.md 中的文件引用路径
- ✅ 确保技能仍可正常触发和加载

### 2.2. Non-Goals

- ❌ 不修改技能的实际内容
- ❌ 不创建新的技能
- ❌ 不修改 `.claude/settings.json` 配置

## 3. Decisions

### 3.1. Decision 1: 统一使用 `references/` 目录

**决策**: 所有非 SKILL.md 的 markdown 文件都移入 `references/` 目录

**理由**:

- 符合 agentskills.io 规范
- 清晰区分主文件和参考文档
- 便于后续维护和扩展

**替代方案**:

1. 使用 `docs/` 目录 - 不符合规范，放弃
2. 保持现状 - 不规范，放弃

### 3.2. Decision 2: 保留 `examples/` 目录

**决策**: `backend-nitro-drizzle/examples/` 目录保持不变

**理由**:

- 该目录存放的是代码示例，不是文档
- 符合规范中的 `assets/` 用途

### 3.3. Decision 3: 删除空目录

**决策**: 删除 `use-wot-design-uni` 空目录

**理由**:

- 没有 SKILL.md 文件，不是有效技能
- 避免混淆

## 4. Risks / Trade-offs

|       风险       |           影响           |          缓解措施          |
| :--------------: | :----------------------: | :------------------------: |
| 引用路径更新遗漏 |     技能文档链接断裂     | 使用 grep 全面检查所有引用 |
|   技能触发失效   |   AI 无法正确加载技能    |  重构后测试每个技能的触发  |
|   Git 历史丢失   | 文件移动导致历史追踪困难 |   使用 `git mv` 保留历史   |

## 5. Migration Plan

### 5.1. 执行顺序

1. **Phase 1**: 创建 `references/` 目录（不影响现有功能）
2. **Phase 2**: 移动文件（使用 `git mv`）
3. **Phase 3**: 更新 SKILL.md 引用路径
4. **Phase 4**: 删除空目录
5. **Phase 5**: 验证测试

### 5.2. 回滚方案

如果出现问题，可通过 `git reset --hard` 回滚到重构前的提交。

## 6. Open Questions

- [x] `skill.json` 文件是否需要移入 `references/`？ → 是，作为配置参考文档
- [x] `EXECUTION-CHECKLIST.md` 是否属于参考文档？ → 是，移入 `references/`
