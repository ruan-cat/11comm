# Claude Code Skills 目录结构规范

## ADDED Requirements

### Requirement: Skills 目录结构规范

每个 Claude Code Skill 必须（SHALL）遵循 agentskills.io 标准目录结构：

```plain
skill-name/
├── SKILL.md          # Required: 技能主文件（指令 + 元数据）
├── scripts/          # Optional: 可执行脚本
├── references/       # Optional: 参考文档
└── assets/           # Optional: 模板、资源文件
```

#### Scenario: 新建技能时遵循标准结构

- **WHEN** 创建新的 Claude Code Skill
- **THEN** 必须创建 `SKILL.md` 作为技能入口文件
- **AND** 如有参考文档，必须放入 `references/` 目录
- **AND** 如有代码示例，必须放入 `assets/` 或 `examples/` 目录

#### Scenario: 检查现有技能结构合规性

- **WHEN** 审查现有技能目录结构
- **THEN** 所有非 SKILL.md 的 markdown 文档必须位于 `references/` 目录
- **AND** 不允许散落的参考文档存在于技能根目录

### Requirement: SKILL.md 文件引用规范

SKILL.md 中引用参考文档时，必须（SHALL）使用相对于技能根目录的路径。

#### Scenario: 引用 references 目录中的文档

- **WHEN** SKILL.md 需要引用参考文档
- **THEN** 使用 `./references/xxx.md` 格式的相对路径
- **AND** 不使用绝对路径或 `../` 跨目录引用

### Requirement: 空技能目录清理

不包含 SKILL.md 文件的技能目录必须（SHALL）被删除或补全。

#### Scenario: 发现空技能目录

- **WHEN** 技能目录不包含 SKILL.md 文件
- **THEN** 要么删除该空目录
- **OR** 创建有效的 SKILL.md 文件

## File Migration Mapping

以下是本次重构需要移动的文件完整清单：

### api-migration

|       源文件       |           目标位置            |
| :----------------: | :---------------------------: |
| `api-定义示例.md`  | `references/api-定义示例.md`  |
|   `mock-规范.md`   |   `references/mock-规范.md`   |
| `mock-实现指南.md` | `references/mock-实现指南.md` |
| `mock-响应格式.md` | `references/mock-响应格式.md` |
| `mock-重启流程.md` | `references/mock-重启流程.md` |
| `接口地址迁移.md`  | `references/接口地址迁移.md`  |
| `类型定义规范.md`  | `references/类型定义规范.md`  |

### beautiful-component-design

|         源文件          |              目标位置              |
| :---------------------: | :--------------------------------: |
| `form-section-title.md` | `references/form-section-title.md` |
|     `icon-usage.md`     |     `references/icon-usage.md`     |
| `responsive-design.md`  | `references/responsive-design.md`  |
|   `text-alignment.md`   |   `references/text-alignment.md`   |
|      `skill.json`       |      `references/skill.json`       |

### code-migration

|         源文件          |              目标位置              |
| :---------------------: | :--------------------------------: |
| `TypeScript类型规范.md` | `references/TypeScript类型规范.md` |
| `Vue2到Vue3写法对比.md` | `references/Vue2到Vue3写法对比.md` |
|    `工具函数迁移.md`    |    `references/工具函数迁移.md`    |
|    `静态资源导入.md`    |    `references/静态资源导入.md`    |
|    `生命周期迁移.md`    |    `references/生命周期迁移.md`    |
|  `数据字典常量规范.md`  |  `references/数据字典常量规范.md`  |
|    `状态管理迁移.md`    |    `references/状态管理迁移.md`    |
|   `组合式函数规范.md`   |   `references/组合式函数规范.md`   |

### component-migration

|          源文件          |              目标位置               |
| :----------------------: | :---------------------------------: |
| `EXECUTION-CHECKLIST.md` | `references/EXECUTION-CHECKLIST.md` |
|    `Icon图标迁移.md`     |    `references/Icon图标迁移.md`     |
|  `wd-picker使用规范.md`  |  `references/wd-picker使用规范.md`  |
|    `全局反馈组件.md`     |    `references/全局反馈组件.md`     |

### backend-nitro-drizzle

|           源文件           |               目标位置                |
| :------------------------: | :-----------------------------------: |
|    `01-nitro-setup.md`     |    `references/01-nitro-setup.md`     |
|     `02-env-config.md`     |     `references/02-env-config.md`     |
|    `03-neon-drizzle.md`    |    `references/03-neon-drizzle.md`    |
| `04-drizzle-operations.md` | `references/04-drizzle-operations.md` |
|    `05-nitro-routes.md`    |    `references/05-nitro-routes.md`    |
|    `06-integration.md`     |    `references/06-integration.md`     |
|     `07-deployment.md`     |     `references/07-deployment.md`     |

### 删除目录

|         目录          |        原因         |
| :-------------------: | :-----------------: |
| `use-wot-design-uni/` | 空目录，无 SKILL.md |
