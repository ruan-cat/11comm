/**
 * 复现 relizy / changelogen 在 Windows 上的路径匹配问题：
 * - Git `log --name-status` 正文使用正斜杠（apps/admin/...）
 * - Node path.relative 在 win32 上得到反斜杠（apps\admin）
 * - commit.body.includes(relativePath) 为 false → 独立模式下 commits 被滤空 → No packages to bump
 *
 * 运行（在仓库根目录）——不要用 `#!/usr/bin/env node`，否则 VS Code Code Runner 在 Windows 上可能去执行
 * 不存在的 `/usr/bin/env`，出现乱码（实为「系统找不到指定的路径」编码显示错误）：
 *   pnpm run repro:relizy-path
 * 或：
 *   pnpm exec node docs/issues/relizy/repro-relizy-body-path-includes.mjs
 */
import { relative, join, sep } from "node:path";
import { execSync } from "node:child_process";

const cwd = process.cwd();
const pkgPath = join(cwd, "apps", "admin");
const relativeWinStyle = relative(cwd, pkgPath);

/** 模拟 changelogen getGitDiff + --name-status 中会出现的一行（Git 使用 /） */
const simulatedGitNameStatusBody = ["", "接入示例说明", "", "M\tapps/admin/src/views/login/index.vue", ""].join("\n");

const posixStyle = relativeWinStyle.split(sep).join("/");

console.log("=== relizy 路径过滤语义复现 ===\n");
console.log("platform:", process.platform);
console.log("cwd:", cwd);
console.log("pkgPath:", pkgPath);
console.log("path.relative(cwd, pkgPath):", JSON.stringify(relativeWinStyle));
console.log("");
console.log("模拟 git log body 片段（含 name-status，路径为正斜杠）:");
console.log(simulatedGitNameStatusBody.split("\n").slice(0, 6).join("\n"), "...\n");
console.log("---");
console.log(
	"relizy 风格 includes(relative) [易在 Windows 失败]:",
	simulatedGitNameStatusBody.includes(relativeWinStyle),
);
console.log("规范化后再 includes [建议修复]:", simulatedGitNameStatusBody.includes(posixStyle));
console.log("---\n");

if (process.platform === "win32" && !simulatedGitNameStatusBody.includes(relativeWinStyle)) {
	console.log(
		"结论（Windows）: 与 relizy 使用 body.includes(relative) 时一致 → 可能滤掉所有「属于 apps/admin」的提交。\n",
	);
} else if (process.platform !== "win32") {
	console.log(
		"结论（非 Windows）: path.relative 通常已为 apps/admin，includes 多为 true；请在 Windows 上再跑一次以对比。\n",
	);
}

/** 可选：若当前仓库存在 baseline tag，打印一条真实 git log 片段供对照 */
try {
	const tag = execSync('git tag -l "@01s-11comm/admin@*"', {
		cwd,
		encoding: "utf8",
	})
		.trim()
		.split("\n")
		.filter(Boolean)
		.at(-1);
	if (!tag) {
		console.log("（未找到 @01s-11comm/admin@* tag，跳过真实 git 采样）");
		process.exit(0);
	}
	const range = `${tag}...HEAD`;
	const sample = execSync(`git --no-pager log ${JSON.stringify(range)} -1 --pretty=format:"%s%n%b" --name-status`, {
		cwd,
		encoding: "utf8",
		maxBuffer: 1024 * 1024,
	});
	const firstLines = sample.split("\n").slice(0, 12).join("\n");
	console.log("--- 真实仓库采样（最后一条在范围内的提交，节选）---");
	console.log(firstLines);
	console.log("");
	console.log("真实 body 是否包含 path.relative 结果:", sample.includes(relativeWinStyle));
	console.log("真实 body 是否包含 POSIX 相对路径:", sample.includes(posixStyle));
} catch {
	console.log("（git 采样失败，可能不在 git 仓库根目录）");
}
