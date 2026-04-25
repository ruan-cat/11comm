# Change: 重构 Claude Code Skills 目录结构以符合 agentskills.io 规范

## Why

当前 `.claude/skills` 目录下的多个技能的子文档（参考文档）散落在技能根目录，未按照 [agentskills.io](https://agentskills.io/home) 规范放置在 `references/` 目录中。这导致：

1. 目录结构不规范，不符合行业标准
2. 参考文档与主文件混杂，难以区分
3. 存在空目录（`use-wot-design-uni`）需要清理
4. 部分技能的根目录文件（如编号文档 `01-*.md`）应归入 `references/`

## What Changes

### 1. 需要重构的技能（6 个）

|           技能名称           |     散落文件数      |             操作             |
| :--------------------------: | :-----------------: | :--------------------------: |
|       `api-migration`        |       7 个 md       | 创建 `references/`，移动文件 |
| `beautiful-component-design` | 4 个 md + 1 个 json | 创建 `references/`，移动文件 |
|       `code-migration`       |       8 个 md       | 创建 `references/`，移动文件 |
|    `component-migration`     |       4 个 md       | 创建 `references/`，移动文件 |
|   `backend-nitro-drizzle`    |     7 个编号 md     |   移动到已有 `references/`   |

### 2. 需要删除的空目录（1 个）

- `use-wot-design-uni` - 空目录，无任何文件

### 3. 需要更新引用的文件

所有被移动文件的 SKILL.md 中的引用路径需要从：

- `./xxx.md` → `./references/xxx.md`

## Impact

- **受影响的技能**: 6 个技能目录
- **受影响的文件**: 约 31 个 md 文件需要移动
- **需要更新引用**: 6 个 SKILL.md 文件
- **无破坏性变更**: 仅目录结构调整，不影响技能功能
