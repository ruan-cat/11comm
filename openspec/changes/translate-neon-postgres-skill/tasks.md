# 翻译任务清单

## 1. 准备工作

- [ ] 1.1 创建目标目录结构 `neon-postgres-zh/references/neon-auth/`
- [ ] 1.2 创建目标目录结构 `neon-postgres-zh/references/neon-js/`
- [ ] 1.3 创建目标目录结构 `neon-postgres-zh/references/neon-rest-api/`

## 2. 翻译根目录文件

- [ ] 2.1 翻译 `SKILL.md`（主技能文件）

## 3. 翻译 references 核心文件（批次 A：文件 2-8）

- [ ] 3.1 翻译 `references/connection-methods.md`
- [ ] 3.2 翻译 `references/devtools.md`
- [ ] 3.3 翻译 `references/features.md`
- [ ] 3.4 翻译 `references/getting-started.md`
- [ ] 3.5 翻译 `references/neon-auth.md`
- [ ] 3.6 翻译 `references/neon-cli.md`
- [ ] 3.7 翻译 `references/neon-drizzle.md`

## 4. 翻译 references 核心文件（批次 B：文件 9-15）

- [ ] 4.1 翻译 `references/neon-js.md`
- [ ] 4.2 翻译 `references/neon-platform-api.md`
- [ ] 4.3 翻译 `references/neon-python-sdk.md`
- [ ] 4.4 翻译 `references/neon-serverless.md`
- [ ] 4.5 翻译 `references/neon-typescript-sdk.md`
- [ ] 4.6 翻译 `references/referencing-docs.md`
- [ ] 4.7 翻译 `references/what-is-neon.md`

## 5. 翻译 neon-auth 子目录（文件 16-20）

- [ ] 5.1 翻译 `references/neon-auth/auth-methods.md`
- [ ] 5.2 翻译 `references/neon-auth/common-mistakes.md`
- [ ] 5.3 翻译 `references/neon-auth/setup-nextjs.md`
- [ ] 5.4 翻译 `references/neon-auth/setup-react-spa.md`
- [ ] 5.5 翻译 `references/neon-auth/ui-components.md`

## 6. 翻译 neon-js 子目录（文件 21-22）

- [ ] 6.1 翻译 `references/neon-js/common-mistakes.md`
- [ ] 6.2 翻译 `references/neon-js/data-api.md`

## 7. 翻译 neon-rest-api 子目录（文件 23-29）

- [ ] 7.1 翻译 `references/neon-rest-api/branches.md`
- [ ] 7.2 翻译 `references/neon-rest-api/endpoints.md`
- [ ] 7.3 翻译 `references/neon-rest-api/guidelines.md`
- [ ] 7.4 翻译 `references/neon-rest-api/keys.md`
- [ ] 7.5 翻译 `references/neon-rest-api/operations.md`
- [ ] 7.6 翻译 `references/neon-rest-api/organizations.md`
- [ ] 7.7 翻译 `references/neon-rest-api/projects.md`

## 8. 验证与复查

- [ ] 8.1 验证目录结构完整性（29 个文件）
- [ ] 8.2 验证 SKILL.md 的 frontmatter 格式正确
- [ ] 8.3 验证所有文件的 Markdown 格式正确
- [ ] 8.4 验证代码块、链接等未被错误翻译

## 并行执行策略

为提高效率，建议使用以下并行执行策略：

| 子代理 |    负责任务     |        文件范围         |
| :----: | :-------------: | :---------------------: |
|   1    | 任务 2 + 任务 3 |   SKILL.md + 文件 2-8   |
|   2    |     任务 4      |        文件 9-15        |
|   3    |     任务 5      |       文件 16-20        |
|   4    | 任务 6 + 任务 7 | 文件 21-22 + 文件 23-29 |

完成后由主代理执行任务 8（验证与复查）。
