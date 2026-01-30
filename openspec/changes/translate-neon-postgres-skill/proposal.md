# Change: 翻译 neon-postgres 技能文档为中文版本

## Why

项目中存在 `.agents/skills/neon-postgres` 技能目录，包含 29 个英文 Markdown 文件，涵盖 Neon Serverless Postgres 的完整使用指南。为了方便中文开发者使用和理解，需要将这些技能文件翻译成中文版本，同时保留 Claude Code Skill 的标准格式（YAML frontmatter + Markdown 内容结构）。

## What Changes

- 在 `.agents/skills/` 目录下创建 `neon-postgres-zh/` 中文版技能目录
- 保持与原始 `neon-postgres/` 完全相同的目录层级和文件命名
- 将 29 个 Markdown 文件从英文翻译成简体中文
- 保留所有代码示例、命令、URL 链接不翻译
- 保留 YAML frontmatter 的 `name` 和 `description` 字段结构（description 翻译成中文）
- 保留表格、代码块等 Markdown 格式结构

## Impact

- 影响的规范：无（新增翻译文件，不修改现有规范）
- 影响的代码：`.agents/skills/neon-postgres-zh/` 目录（新增）
- 新增文件数量：29 个 Markdown 文件

## 翻译文件清单

### 1. 根目录（1 个文件）

| 序号 |               源文件路径                |                目标文件路径                |
| :--: | :-------------------------------------: | :----------------------------------------: |
|  1   | `.agents/skills/neon-postgres/SKILL.md` | `.agents/skills/neon-postgres-zh/SKILL.md` |

### 2. references 目录（14 个文件）

| 序号 |                            源文件路径                            |                            目标文件路径                             |
| :--: | :--------------------------------------------------------------: | :-----------------------------------------------------------------: |
|  2   | `.agents/skills/neon-postgres/references/connection-methods.md`  | `.agents/skills/neon-postgres-zh/references/connection-methods.md`  |
|  3   |      `.agents/skills/neon-postgres/references/devtools.md`       |      `.agents/skills/neon-postgres-zh/references/devtools.md`       |
|  4   |      `.agents/skills/neon-postgres/references/features.md`       |      `.agents/skills/neon-postgres-zh/references/features.md`       |
|  5   |   `.agents/skills/neon-postgres/references/getting-started.md`   |   `.agents/skills/neon-postgres-zh/references/getting-started.md`   |
|  6   |      `.agents/skills/neon-postgres/references/neon-auth.md`      |      `.agents/skills/neon-postgres-zh/references/neon-auth.md`      |
|  7   |      `.agents/skills/neon-postgres/references/neon-cli.md`       |      `.agents/skills/neon-postgres-zh/references/neon-cli.md`       |
|  8   |    `.agents/skills/neon-postgres/references/neon-drizzle.md`     |    `.agents/skills/neon-postgres-zh/references/neon-drizzle.md`     |
|  9   |       `.agents/skills/neon-postgres/references/neon-js.md`       |       `.agents/skills/neon-postgres-zh/references/neon-js.md`       |
|  10  |  `.agents/skills/neon-postgres/references/neon-platform-api.md`  |  `.agents/skills/neon-postgres-zh/references/neon-platform-api.md`  |
|  11  |   `.agents/skills/neon-postgres/references/neon-python-sdk.md`   |   `.agents/skills/neon-postgres-zh/references/neon-python-sdk.md`   |
|  12  |   `.agents/skills/neon-postgres/references/neon-serverless.md`   |   `.agents/skills/neon-postgres-zh/references/neon-serverless.md`   |
|  13  | `.agents/skills/neon-postgres/references/neon-typescript-sdk.md` | `.agents/skills/neon-postgres-zh/references/neon-typescript-sdk.md` |
|  14  |  `.agents/skills/neon-postgres/references/referencing-docs.md`   |  `.agents/skills/neon-postgres-zh/references/referencing-docs.md`   |
|  15  |    `.agents/skills/neon-postgres/references/what-is-neon.md`     |    `.agents/skills/neon-postgres-zh/references/what-is-neon.md`     |

### 3. references/neon-auth 子目录（5 个文件）

| 序号 |                               源文件路径                               |                               目标文件路径                                |
| :--: | :--------------------------------------------------------------------: | :-----------------------------------------------------------------------: |
|  16  |  `.agents/skills/neon-postgres/references/neon-auth/auth-methods.md`   |  `.agents/skills/neon-postgres-zh/references/neon-auth/auth-methods.md`   |
|  17  | `.agents/skills/neon-postgres/references/neon-auth/common-mistakes.md` | `.agents/skills/neon-postgres-zh/references/neon-auth/common-mistakes.md` |
|  18  |  `.agents/skills/neon-postgres/references/neon-auth/setup-nextjs.md`   |  `.agents/skills/neon-postgres-zh/references/neon-auth/setup-nextjs.md`   |
|  19  | `.agents/skills/neon-postgres/references/neon-auth/setup-react-spa.md` | `.agents/skills/neon-postgres-zh/references/neon-auth/setup-react-spa.md` |
|  20  |  `.agents/skills/neon-postgres/references/neon-auth/ui-components.md`  |  `.agents/skills/neon-postgres-zh/references/neon-auth/ui-components.md`  |

### 4. references/neon-js 子目录（2 个文件）

| 序号 |                              源文件路径                              |                              目标文件路径                               |
| :--: | :------------------------------------------------------------------: | :---------------------------------------------------------------------: |
|  21  | `.agents/skills/neon-postgres/references/neon-js/common-mistakes.md` | `.agents/skills/neon-postgres-zh/references/neon-js/common-mistakes.md` |
|  22  |    `.agents/skills/neon-postgres/references/neon-js/data-api.md`     |    `.agents/skills/neon-postgres-zh/references/neon-js/data-api.md`     |

### 5. references/neon-rest-api 子目录（7 个文件）

| 序号 |                                源文件路径                                |                                目标文件路径                                 |
| :--: | :----------------------------------------------------------------------: | :-------------------------------------------------------------------------: |
|  23  |   `.agents/skills/neon-postgres/references/neon-rest-api/branches.md`    |   `.agents/skills/neon-postgres-zh/references/neon-rest-api/branches.md`    |
|  24  |   `.agents/skills/neon-postgres/references/neon-rest-api/endpoints.md`   |   `.agents/skills/neon-postgres-zh/references/neon-rest-api/endpoints.md`   |
|  25  |  `.agents/skills/neon-postgres/references/neon-rest-api/guidelines.md`   |  `.agents/skills/neon-postgres-zh/references/neon-rest-api/guidelines.md`   |
|  26  |     `.agents/skills/neon-postgres/references/neon-rest-api/keys.md`      |     `.agents/skills/neon-postgres-zh/references/neon-rest-api/keys.md`      |
|  27  |  `.agents/skills/neon-postgres/references/neon-rest-api/operations.md`   |  `.agents/skills/neon-postgres-zh/references/neon-rest-api/operations.md`   |
|  28  | `.agents/skills/neon-postgres/references/neon-rest-api/organizations.md` | `.agents/skills/neon-postgres-zh/references/neon-rest-api/organizations.md` |
|  29  |   `.agents/skills/neon-postgres/references/neon-rest-api/projects.md`    |   `.agents/skills/neon-postgres-zh/references/neon-rest-api/projects.md`    |

## 翻译规范

### 1. 保留不翻译的内容

- 代码块内的所有代码（包括注释）
- URL 链接
- 文件路径
- 包名（如 `@neondatabase/auth`）
- 命令行示例
- 环境变量名
- API 端点路径
- JSON/YAML 键名

### 2. 需要翻译的内容

- Markdown 标题
- 段落文本
- 表格的文字说明列
- 列表项的描述文字
- YAML frontmatter 中的 `description` 字段

### 3. 格式保持

- 保持原有的 Markdown 层级结构
- 保持表格的居中对齐格式
- 保持代码块的语言标识
- 保持链接的 Markdown 格式

## 复查机制

为确保翻译质量和完整性，建立以下复查机制：

1. **文件数量验证**：翻译完成后，验证 `neon-postgres-zh/` 目录下的文件数量是否等于 29
2. **目录结构对比**：对比源目录和目标目录的结构是否完全一致
3. **格式验证**：检查每个翻译后的文件是否保留了正确的 Markdown 格式
4. **frontmatter 验证**：检查 SKILL.md 的 YAML frontmatter 是否完整
