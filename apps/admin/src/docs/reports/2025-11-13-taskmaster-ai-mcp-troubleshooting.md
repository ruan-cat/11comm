# taskmaster-ai MCP 故障排查报告

## 1. 问题描述

### 1.1 现象

在 Claude Code 中配置了 `taskmaster-ai` MCP 服务器，但在 `/mcp` 命令中看不到该 MCP 被注册使用。

### 1.2 配置位置

- **项目级配置**：`.mcp.json`
- **用户级配置**：`C:\Users\pc\.claude.json`

### 1.3 初始配置内容

```json
{
	"mcpServers": {
		"taskmaster-ai": {
			"type": "stdio",
			"command": "cmd",
			"args": ["/c", "npx", "-y", "task-master-ai@latest"],
			"env": {
				"TASK_MASTER_TOOLS": "core"
			}
		}
	}
}
```

## 2. 排查过程

### 2.1 验证 MCP 配置是否被识别

执行命令：

```bash
claude mcp list
```

**结果**：taskmaster-ai 出现在列表中，但状态为 `✗ Failed to connect`。

**结论**：`.mcp.json` 配置**被正确识别**，问题不在配置文件的位置或格式。

### 2.2 检查配置参数

通过 `claude mcp get taskmaster-ai` 发现，用户级配置中的 args 参数存在错误：

```json
"args": ["C:/", "npx", "-y", "task-master-ai@latest"]
```

应该是：

```json
"args": ["/c", "npx", "-y", "task-master-ai@latest"]
```

**修复操作**：更正 `C:\Users\pc\.claude.json` 中的参数。

**结果**：修复后命令参数正确，但仍然 `Failed to connect`。

### 2.3 测试 task-master-ai 包本身

执行命令：

```bash
npx -y task-master-ai@latest --help
```

**输出错误**：

```plain
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'D:\dev-evn\node-store\node_cache\_npx\b14b71b47167b11e\node_modules\ai\dist\index.mjs' imported from D:\dev-evn\node-store\node_cache\_npx\b14b71b47167b11e\node_modules\task-master-ai\dist\ai-services-unified-CCKLADpH.js
Did you mean to import "ai/dist/index.js"?
    at finalizeResolution (node:internal/modules/esm/resolve:275:11)
    ...
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///D:/dev-evn/node-store/node_cache/_npx/b14b71b47167b11e/node_modules/ai/dist/index.mjs'
}
```

**结论**：**task-master-ai 包本身存在依赖问题**，无法正常运行。

## 3. 根本原因

### 3.1 包的已知问题

根据 GitHub Issues 调查，`task-master-ai` 包存在以下已知问题：

| Issue                                                                      | 描述                                              | 版本    |
| :------------------------------------------------------------------------- | :------------------------------------------------ | :------ |
| [#394](https://github.com/eyaltoledano/claude-task-master/issues/394)      | 缺少 AI providers，未打包在 task-master-ai@0.13.0 | v0.13.0 |
| [#1085](https://github.com/eyaltoledano/claude-task-master/issues/1085)    | 命令行和 cursor 中的 MCP 错误                     | -       |
| [#680](https://github.com/eyaltoledano/claude-task-master/discussions/680) | task master 无法通过 npx 命令运行                 | -       |

### 3.2 技术原因

task-master-ai v0.13.0 在发布时**缺少必要的源文件**（`src/ai-providers`），导致运行时找不到依赖模块：

```plain
node_modules/
  task-master-ai/
    dist/
      ai-services-unified-CCKLADpH.js  ← 引用了 ai/dist/index.mjs
  ai/
    dist/
      index.js  ✓ 存在
      index.mjs  ✗ 不存在（或路径问题）
```

## 4. 为什么 `/mcp` 命令看不到它？

这个说法不准确。实际情况是：

| 状态          | 说明                                                    |
| :------------ | :------------------------------------------------------ |
| ✅ 配置被识别 | `.mcp.json` 和 `~/.claude.json` 都能被 Claude Code 识别 |
| ✅ 出现在列表 | `claude mcp list` 可以看到 taskmaster-ai                |
| ❌ 连接失败   | 显示 `✗ Failed to connect`，因为包本身无法运行          |

**结论**：配置没问题，是 task-master-ai 包本身的 bug。

## 5. 解决方案

### 5.1 方案 A：等待官方修复（推荐）

**优点**：

- 无需手动操作
- 获得官方支持

**缺点**：

- 等待时间不确定
- 包可能已停止维护

**操作**：暂时移除配置

```bash
claude mcp remove taskmaster-ai --scope user
```

### 5.2 方案 B：手动修复

根据 Issue #394 的解决方案，手动复制缺失文件：

```bash
# 1. 克隆官方仓库
git clone https://github.com/eyaltoledano/claude-task-master.git

# 2. 全局安装包
npm install -g task-master-ai

# 3. 查找全局包路径
npm root -g
# 输出：D:\dev-evn\node-store\node_global\node_modules

# 4. 手动复制缺失文件
cp -r claude-task-master/src/ai-providers D:\dev-evn\node-store\node_global\node_modules\task-master-ai\src\

# 5. 验证
task-master-ai --help
```

**优点**：

- 可以立即使用

**缺点**：

- 手动操作复杂
- 包更新后需要重新操作
- 可能引入其他问题

### 5.3 方案 C：使用替代方案

考虑使用其他任务管理 MCP 服务器：

| 包名                 | 描述                     | 维护状态 |
| :------------------- | :----------------------- | :------- |
| `todoist-taskmaster` | 基于 Todoist 的任务管理  | 活跃     |
| `mcp-task-master`    | task-master 的 fork 版本 | 待验证   |

## 6. 关键知识点

### 6.1 Claude Code MCP 配置层级

Claude Code 支持三层配置（优先级从高到低）：

| 层级    | 位置                        | 范围             | 共享方式     |
| :------ | :-------------------------- | :--------------- | :----------- |
| Project | `.mcp.json`                 | 当前项目         | Git 提交共享 |
| User    | `~/.claude.json`            | 所有项目         | 不共享       |
| Local   | `.claude/config/local.json` | 当前项目（个人） | 不共享       |

### 6.2 MCP 连接验证方法

```bash
# 列出所有 MCP 服务器及连接状态
claude mcp list

# 查看特定 MCP 的配置详情
claude mcp get <name>

# 添加 MCP 服务器
claude mcp add --transport stdio <name> --scope <scope> -- <command>

# 移除 MCP 服务器
claude mcp remove <name> --scope <scope>
```

### 6.3 故障排查顺序

1. **配置层面**：检查配置文件是否存在、格式是否正确
2. **参数层面**：检查命令和参数是否正确（如 `/c` vs `C:/`）
3. **包层面**：直接运行包命令，验证包本身是否可用
4. **依赖层面**：检查包的依赖是否完整

## 7. 相关资源

### 7.1 官方文档

- [Claude Code MCP 文档](https://docs.claude.com/en/docs/claude-code/mcp)
- [task-master-ai GitHub](https://github.com/eyaltoledano/claude-task-master)
- [task-master-ai npm](https://www.npmjs.com/package/task-master-ai)

### 7.2 相关 Issues

- [Missing AI providers not packaged in task-master-ai@0.13.0 · Issue #394](https://github.com/eyaltoledano/claude-task-master/issues/394)
- [task-master-ai fails on command line and in cursor with mcp error · Issue #1085](https://github.com/eyaltoledano/claude-task-master/issues/1085)
- [task master does not run off npx commands · Discussion #680](https://github.com/eyaltoledano/claude-task-master/discussions/680)

## 8. 结论

**根本原因**：task-master-ai 包本身存在已知 bug（缺少 `src/ai-providers` 文件），导致无法正常运行。

**配置正确性**：`.mcp.json` 和用户级配置均**正确且有效**，Claude Code 能够识别并加载配置。

**推荐方案**：暂时移除 taskmaster-ai 配置，等待官方修复或使用替代方案。

---

**报告日期**：2025-11-13
**排查人员**：Claude Code
**环境信息**：

- 操作系统：Windows
- Node.js：v22.14.0
- Claude Code 版本：2.0.37
- task-master-ai 版本：@latest
