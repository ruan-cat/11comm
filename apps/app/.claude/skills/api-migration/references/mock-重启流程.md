# Mock 文件修改后的自动重启流程

## 自动重启流程实现

```typescript
/** Mock 文件修改后的自动重启流程 */
async function handleMockFileChange(filePath: string) {
	// 1. 检测是否有运行中的 pnpm dev 进程
	const hasDevServer = await checkRunningDevServer();

	if (!hasDevServer) {
		console.log("⚠️ 未检测到运行中的开发服务器");
		return;
	}

	console.log("🔄 检测到 Mock 文件变更，准备重启开发环境...");

	// 2. 停止当前的 pnpm dev 进程
	await stopDevServer();

	// 3. 等待进程完全停止
	await delay(2000);

	// 4. 重新启动 pnpm dev
	await startDevServer();

	// 5. 等待开发服务器启动完成
	await waitForServerReady();

	// 6. 如果浏览器 MCP 已打开页面，刷新页面
	await refreshBrowserPage();

	console.log("✅ 开发环境重启完成，Mock 接口已更新");
}
```

## 检测运行中的开发服务器

```bash
# Windows 平台
tasklist | findstr /I "node.exe" | findstr /I "pnpm"

# 或者检查端口占用情况（默认 3000 端口）
netstat -ano | findstr :3000
```

## 停止开发服务器

```bash
# 方式1: 使用 taskkill 命令（推荐）
# 先找到进程 ID
tasklist | findstr /I "pnpm dev"
# 杀死进程
taskkill /F /PID <进程ID>

# 方式2: 通过 Bash 工具的 KillShell 功能
# 如果使用 Bash 工具启动的后台进程，可以直接使用 shell_id 停止
```

## 启动开发服务器

```bash
# 在后台启动 pnpm dev
pnpm dev
```

## 等待服务器就绪

```bash
# 方式1: 检查端口是否可访问
# 循环检查直到端口可用或超时（最多等待 30 秒）
for i in {1..30}; do
  netstat -ano | findstr :3000 && break
  sleep 1
done

# 方式2: 使用 curl/wget 检查 HTTP 响应
# 等待 http://localhost:3000 返回正常响应
```

## 刷新浏览器页面

如果使用谷歌浏览器 MCP:

```bash
# 使用 Chrome DevTools Protocol 刷新页面
# 通过 MCP 的 chrome-devtools 工具刷新当前页面
```

## 实施注意事项

1. **进程检测**: 确保准确识别 `pnpm dev` 进程，避免误杀其他 Node.js 进程
2. **等待时间**: 服务器停止和启动都需要适当的等待时间，避免操作过快导致失败
3. **错误处理**: 如果重启失败，应该提示用户手动重启
4. **状态反馈**: 在重启过程中提供清晰的状态提示，让用户了解当前进度

## 手动重启提示

如果自动重启失败，输出以下提示：

```plain
⚠️ 自动重启开发环境失败，请手动执行以下操作：

1. 停止当前的 pnpm dev 进程（Ctrl+C）
2. 重新运行: pnpm dev
3. 等待服务器启动完成
4. 刷新浏览器页面

Mock 接口更新需要重启开发环境才能生效。
```
