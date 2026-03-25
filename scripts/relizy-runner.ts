import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { parsePnpmWorkspaceYaml } from "pnpm-workspace-yaml";
import type { PackageJson } from "pkg-types";

/**
 * 本脚本将 `process.argv` 原样转发给 relizy CLI。
 *
 * **`release` / `bump` 建议附带 `--yes`**：`relizy` 在应用版本计划前会交互询问
 * 「Do you want to proceed with these version updates?」。在终端、CI、`pnpm` 脚本中若
 * 未关闭该提示，进程会一直等待 stdin，看起来像“卡死”。`--yes` 对应上游选项
 * *Skip confirmation prompt about bumping packages*，与改发版算法无关。
 */
const WINDOWS_GNU_COMMANDS = ["grep", "head", "sed"] as const;

/** 发版基线 tag 校验所需的最小字段，由 {@link PackageJson} 派生，避免重复定义 shape。 */
export type WorkspacePackageInfo = Required<Pick<PackageJson, "name" | "version">>;

// ── 工作区包发现 ──────────────────────────────────────────────────────────────

/**
 * 解析根目录 `pnpm-workspace.yaml` 并展开 glob 模式，
 * 收集所有含 `package.json` 的子包目录，返回其 name 与 version。
 *
 * 使用 [pnpm-workspace-yaml](https://github.com/antfu/pnpm-workspace-utils/tree/main/packages/pnpm-workspace-yaml)
 * 解析工作区清单，再用 `pkg-types` 的 `PackageJson` 约束子包字段。
 */
function getWorkspacePackages(): WorkspacePackageInfo[] {
	const workspaceRoot = process.cwd();
	const yamlPath = resolve(workspaceRoot, "pnpm-workspace.yaml");

	if (!existsSync(yamlPath)) {
		console.error("release:relizy：未在当前目录找到 pnpm-workspace.yaml，请从仓库根目录执行。");
		return [];
	}

	const globs = parsePnpmWorkspaceYaml(readFileSync(yamlPath, "utf8")).toJSON().packages ?? [];
	const packages: WorkspacePackageInfo[] = [];

	for (const pattern of globs) {
		// 仅处理 "dir/*" 形式的简单一级通配（覆盖 pnpm-workspace.yaml 的常见写法）
		const parts = pattern.split("/");

		if (parts.length !== 2 || parts[1] !== "*") {
			continue;
		}

		const dir = resolve(workspaceRoot, parts[0]);

		if (!existsSync(dir)) {
			continue;
		}

		const discovered = readdirSync(dir, { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => join(dir, entry.name, "package.json"))
			.filter((pkgPath) => existsSync(pkgPath))
			.map((pkgPath) => {
				const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as PackageJson;

				return { name: pkg.name, version: pkg.version };
			})
			.filter((pkg): pkg is WorkspacePackageInfo => typeof pkg.name === "string" && typeof pkg.version === "string");

		packages.push(...discovered);
	}

	return packages;
}

// ── Windows GNU 工具兼容层 ────────────────────────────────────────────────────

function runLookup(command: string, args: string[], env: NodeJS.ProcessEnv = process.env) {
	return spawnSync(command, args, {
		cwd: process.cwd(),
		env,
		encoding: "utf8",
		stdio: "pipe",
	});
}

function hasExecutable(command: string, env: NodeJS.ProcessEnv = process.env) {
	const lookupCommand = process.platform === "win32" ? "where" : "which";

	return runLookup(lookupCommand, [command], env).status === 0;
}

function listExecutableMatches(command: string) {
	const lookupCommand = process.platform === "win32" ? "where" : "which";
	const result = runLookup(lookupCommand, [command]);

	if (result.status !== 0) {
		return [];
	}

	return result.stdout
		.split(/\r?\n/u)
		.map((line) => line.trim())
		.filter(Boolean);
}

function resolveGitUsrBinPath() {
	if (process.platform !== "win32") {
		return null;
	}

	const candidates = new Set<string>();

	for (const executablePath of [...listExecutableMatches("bash"), ...listExecutableMatches("git")]) {
		const executableDir = dirname(executablePath);

		candidates.add(resolve(executableDir, "..", "usr", "bin"));
		candidates.add(resolve(executableDir, "usr", "bin"));
	}

	for (const candidate of candidates) {
		const hasAllCommands = WINDOWS_GNU_COMMANDS.every((command) => existsSync(join(candidate, `${command}.exe`)));

		if (hasAllCommands) {
			return candidate;
		}
	}

	return null;
}

function ensureRelizyShellEnv() {
	if (process.platform !== "win32") {
		return { ...process.env };
	}

	if (WINDOWS_GNU_COMMANDS.every((command) => hasExecutable(command))) {
		return { ...process.env };
	}

	const gitUsrBinPath = resolveGitUsrBinPath();

	if (!gitUsrBinPath) {
		console.error("[release:relizy] 在 Windows 上未找到 relizy 所需的 GNU 工具（grep / head / sed）。");
		console.error("请先安装 Git for Windows，或将其安装目录下的 usr\\bin 加入 PATH。");
		process.exit(1);
	}

	const env = {
		...process.env,
		PATH: `${gitUsrBinPath};${process.env.PATH ?? ""}`,
	};

	if (!WINDOWS_GNU_COMMANDS.every((command) => hasExecutable(command, env))) {
		console.error("[release:relizy] 已定位到 Git for Windows，但 grep / head / sed 仍不可用。");
		console.error(`请检查 PATH，或手动确认该目录是否存在所需可执行文件：${gitUsrBinPath}`);
		process.exit(1);
	}

	return env;
}

// ── independent 模式 baseline tag 检查 ───────────────────────────────────────

function getPackageTags(packageName: string, env: NodeJS.ProcessEnv) {
	const stdout = execFileSync("git", ["tag", "--list", `${packageName}@*`], {
		cwd: process.cwd(),
		env,
		encoding: "utf8",
	});

	return stdout
		.split(/\r?\n/u)
		.map((line) => line.trim())
		.filter(Boolean);
}

export function shouldCheckIndependentBootstrap(relizyArgs: string[]) {
	const [command] = relizyArgs;

	return command === "release" || command === "bump";
}

function getPackagesMissingBootstrapTags(env: NodeJS.ProcessEnv) {
	return getWorkspacePackages().filter((pkg) => getPackageTags(pkg.name, env).length === 0);
}

export function buildBootstrapInstructions(missingPackages: WorkspacePackageInfo[]) {
	const tagCommands = missingPackages.map((pkg) => `git tag "${pkg.name}@${pkg.version}"`);
	const pushArgs = missingPackages.map((pkg) => `"${pkg.name}@${pkg.version}"`).join(" ");

	return [
		"[release:relizy] 检测到本仓库尚未为以下包建立基线 tag（independent 模式首次发版前需要）：",
		...missingPackages.map((pkg) => `- ${pkg.name}@${pkg.version}`),
		"",
		"请按当前 package.json 版本创建基线 tag，并推送到远端：",
		...tagCommands,
		`git push origin ${pushArgs}`,
	].join("\n");
}

function printBootstrapInstructions(missingPackages: WorkspacePackageInfo[]) {
	console.error(buildBootstrapInstructions(missingPackages));
}

// ── 主入口 ────────────────────────────────────────────────────────────────────

function resolveRelizyEntrypoint() {
	return resolve(process.cwd(), "node_modules", "relizy", "bin", "relizy.mjs");
}

export function runRelizyRunner(relizyArgs: string[]) {
	if (relizyArgs.length === 0) {
		console.error("用法：pnpm exec tsx scripts/relizy-runner.ts <relizy 子命令与参数>");
		console.error("示例：pnpm exec tsx scripts/relizy-runner.ts release --no-publish --no-provider-release --yes");
		return 1;
	}

	const env = ensureRelizyShellEnv();

	if (shouldCheckIndependentBootstrap(relizyArgs)) {
		const missingPackages = getPackagesMissingBootstrapTags(env);

		if (missingPackages.length > 0) {
			printBootstrapInstructions(missingPackages);
			return 1;
		}
	}

	const relizyEntrypoint = resolveRelizyEntrypoint();

	if (!existsSync(relizyEntrypoint)) {
		console.error("未在 node_modules 中找到 relizy 命令行入口，请先执行 pnpm install。");
		return 1;
	}

	const result = spawnSync(process.execPath, [relizyEntrypoint, ...relizyArgs], {
		cwd: process.cwd(),
		env,
		stdio: "inherit",
	});

	return result.status ?? 1;
}

function isDirectExecution() {
	if (!process.argv[1]) {
		return false;
	}

	return resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

if (isDirectExecution()) {
	process.exit(runRelizyRunner(process.argv.slice(2)));
}
