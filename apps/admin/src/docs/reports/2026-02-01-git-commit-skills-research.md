<!-- 有用 不删除 -->

# 2026-02-01 Git Commit Skills 调研报告

## 1. 调研背景

本次调研旨在寻找专门用于生成 git commit 提交信息的 Claude Code Skills，以提升项目开发过程中的提交规范性和效率。

## 2. 调研来源

| 序号 |              站点名称               |                URL                |      状态      |
| :--: | :---------------------------------: | :-------------------------------: | :------------: |
|  1   | skills.sh (Vercel 维护的 skills 站) |        https://skills.sh/         |    成功访问    |
|  2   |            skillsmp.com             |       https://skillsmp.com/       |  403 禁止访问  |
|  3   |         claude-plugins.dev          | https://claude-plugins.dev/skills |    成功访问    |
|  4   |    clawhub (重定向至 clawhub.ai)    |      https://www.clawhub.ai/      | 内容加载不完整 |

## 3. 调研结果

### 3.1. git-commit

|    属性     |                                  值                                   |
| :---------: | :-------------------------------------------------------------------: |
|    来源     |                       `github/awesome-copilot`                        |
|  安装次数   |                                  352                                  |
|   许可证    |                                  MIT                                  |
|  允许工具   |                                 Bash                                  |
| GitHub 仓库 | https://github.com/github/awesome-copilot/tree/main/skills/git-commit |

**安装命令：**

```bash
# 交互式安装（推荐）
npx skills add github/awesome-copilot --skill git-commit

# 指定安装到 claude-code
npx skills add github/awesome-copilot --skill git-commit -a claude-code

# 全局安装
npx skills add github/awesome-copilot --skill git-commit -g

# 非交互式安装（CI/CD 友好）
npx skills add github/awesome-copilot --skill git-commit -a claude-code -y
```

**功能概述：**

执行 git commit，支持 Conventional Commit 消息分析、智能暂存和消息生成。当用户要求提交更改、创建 git commit 或提及 `/commit` 时使用。

**支持的功能：**

1. 自动从更改中检测提交类型（type）和范围（scope）
2. 从 diff 生成 Conventional Commit 格式的提交消息
3. 交互式提交，支持可选的 type/scope/description 覆盖
4. 智能文件暂存，支持逻辑分组

**Conventional Commit 格式：**

```log
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**支持的提交类型：**

|    Type    |          用途           |
| :--------: | :---------------------: |
|   `feat`   |         新功能          |
|   `fix`    |        Bug 修复         |
|   `docs`   |       仅文档更改        |
|  `style`   |  格式化/样式（无逻辑）  |
| `refactor` | 代码重构（非功能/修复） |
|   `perf`   |        性能改进         |
|   `test`   |      添加/更新测试      |
|  `build`   |      构建系统/依赖      |
|    `ci`    |       CI/配置更改       |
|  `chore`   |        维护/杂项        |
|  `revert`  |        回滚提交         |

**Git 安全协议：**

- 永不更新 git config
- 永不运行破坏性命令（--force, hard reset）除非明确请求
- 永不跳过 hooks（--no-verify）除非用户要求
- 永不强制推送到 main/master
- 如果因 hooks 导致提交失败，修复后创建新提交（不使用 amend）

---

### 3.2. commit-work

|    属性     |                                    值                                    |
| :---------: | :----------------------------------------------------------------------: |
|    来源     |                        `softaworks/agent-toolkit`                        |
|  安装次数   |                                  2,140                                   |
| GitHub 仓库 | https://github.com/softaworks/agent-toolkit/tree/main/skills/commit-work |

**安装命令：**

```bash
# 交互式安装（推荐）
npx skills add softaworks/agent-toolkit --skill commit-work

# 指定安装到 claude-code
npx skills add softaworks/agent-toolkit --skill commit-work -a claude-code

# 全局安装
npx skills add softaworks/agent-toolkit --skill commit-work -g

# 非交互式安装（CI/CD 友好）
npx skills add softaworks/agent-toolkit --skill commit-work -a claude-code -y
```

**功能概述：**

帮助创建高质量的 git 提交，通过审查更改、正确暂存、拆分为逻辑单元，并使用 Conventional Commits 格式编写清晰的提交消息。

**目标：**

创建的提交应满足：

- 仅包含预期的更改
- 逻辑范围明确（必要时拆分）
- 使用清晰的消息描述更改内容和原因

**8 步工作流程：**

| 步骤 |                    操作                    |
| :--: | :----------------------------------------: |
|  1   | 使用 `git status` 和 `git diff` 检查工作树 |
|  2   |         决定是否需要拆分为多个提交         |
|  3   |    使用 `git add -p` 进行精细化暂存控制    |
|  4   | 使用 `git diff --cached` 审查已暂存的更改  |
|  5   |       用 1-2 句话描述更改内容和原因        |
|  6   |  编写 Conventional Commits 格式的提交消息  |
|  7   |         在提交前运行相关测试/检查          |
|  8   |             重复直到工作树清空             |

**提交拆分策略：**

- 功能代码 vs 重构代码
- 后端 vs 前端
- 格式化 vs 逻辑更改
- 测试代码 vs 生产代码
- 依赖更新 vs 行为更改

**安全检查：**

- 检测 secrets/tokens
- 检测 debug 日志代码
- 检测无关的格式化更改

**最佳实践：**

- 永不使用 `git add .` 或 `git add -A`
- 提交前始终使用 `git diff --cached` 验证
- 保持每个提交专注于一个逻辑更改
- 每次提交后运行测试

---

### 3.3. 相关工作流 Skills

以下 skills 虽非专门针对 commit message，但涉及 Git 版本控制最佳实践：

|         Skill          |        来源        | 安装次数 |
| :--------------------: | :----------------: | :------: |
| git-advanced-workflows | `wshobson/agents`  |   895    |
|  using-git-worktrees   | `obra/superpowers` |  2,364   |
|    gitops-workflow     | `wshobson/agents`  |   690    |

## 4. 对比分析

|   对比维度   |    git-commit     |      commit-work       |
| :----------: | :---------------: | :--------------------: |
|   安装次数   |        352        |         2,140          |
| 工作流完整性 |     基础流程      |      8 步标准流程      |
| 提交拆分支持 |     智能分组      |      详细拆分策略      |
|   安全检查   |   Git 安全协议    | secrets/debug 代码检测 |
|   暂存控制   |   支持 -p 模式    |    强调 -p 模式必用    |
|   触发方式   | 支持 /commit 命令 |        手动触发        |
|    许可证    |        MIT        |         未明确         |

## 5. 推荐建议

### 5.1. 首选推荐：commit-work

**推荐理由：**

1. **社区验证充分**：安装量 2,140，是 git-commit 的 6 倍
2. **流程更规范**：8 步检查清单确保提交质量
3. **安全性更强**：内置 secrets 和 debug 代码检测
4. **拆分策略明确**：提供清晰的提交拆分指导

### 5.2. 备选推荐：git-commit

**适用场景：**

1. 需要 `/commit` 命令快捷触发
2. 偏好轻量级方案
3. 需要明确的 MIT 许可证

## 6. Skills CLI 使用说明

`skills` 是由 Vercel Labs 维护的 AI Agent Skills 管理工具，仓库地址：https://github.com/vercel-labs/skills

### 6.1. 命令格式

```bash
npx skills <command> [options]
```

### 6.2. 常用命令

|   命令   |        说明         |              示例              |
| :------: | :-----------------: | :----------------------------: |
|  `add`   |     安装 skills     |  `npx skills add owner/repo`   |
|  `list`  | 列出已安装的 skills |       `npx skills list`        |
|  `find`  |     搜索 skills     |    `npx skills find commit`    |
| `remove` |     移除 skills     | `npx skills remove skill-name` |
| `check`  |      检查更新       |       `npx skills check`       |
| `update` |   更新所有 skills   |      `npx skills update`       |
|  `init`  |   创建新的 skill    |   `npx skills init my-skill`   |

### 6.3. 常用选项

|      选项      |                说明                |
| :------------: | :--------------------------------: |
| `-g, --global` |  安装到用户目录（~/）而非项目目录  |
| `-a, --agent`  | 指定目标 agent（如 `claude-code`） |
| `-s, --skill`  |       指定安装的 skill 名称        |
|  `-y, --yes`   |     跳过确认提示（非交互模式）     |
|    `--all`     |   安装所有 skills 到所有 agents    |
|    `--list`    | 列出仓库中可用的 skills（不安装）  |

### 6.4. 安装示例

```bash
# 列出仓库中可用的 skills（不安装）
npx skills add github/awesome-copilot --list

# 安装特定 skill 到特定 agent
npx skills add github/awesome-copilot --skill git-commit -a claude-code

# 安装多个 skills
npx skills add softaworks/agent-toolkit --skill commit-work --skill code-review

# 全局安装（对所有项目生效）
npx skills add github/awesome-copilot --skill git-commit -g

# CI/CD 非交互式安装
npx skills add github/awesome-copilot --skill git-commit -a claude-code -y
```

## 7. 安装指南

### 7.1. 安装 commit-work（推荐）

```bash
npx skills add softaworks/agent-toolkit --skill commit-work -a claude-code
```

### 7.2. 安装 git-commit

```bash
npx skills add github/awesome-copilot --skill git-commit -a claude-code
```

### 7.3. 验证安装

```bash
# 列出已安装的 skills
npx skills list
```

安装完成后，skill 文件将位于项目的 `.claude/skills/` 目录下。

## 8. 参考链接

- skills CLI 官方仓库：https://github.com/vercel-labs/skills
- skills.sh 官方站点：https://skills.sh/
- github/awesome-copilot 仓库：https://github.com/github/awesome-copilot
- softaworks/agent-toolkit 仓库：https://github.com/softaworks/agent-toolkit
- Conventional Commits 规范：https://www.conventionalcommits.org/
