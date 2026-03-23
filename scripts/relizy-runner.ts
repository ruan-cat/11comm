import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const WINDOWS_GNU_COMMANDS = ["grep", "head", "sed"] as const;

export interface WorkspacePackageInfo {
	name: string;
	version: string;
}

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
		console.error("release:relizy could not find the GNU tools required by relizy on Windows.");
		console.error("Install Git for Windows first, or add its usr/bin directory to PATH.");
		process.exit(1);
	}

	const env = {
		...process.env,
		PATH: `${gitUsrBinPath};${process.env.PATH ?? ""}`,
	};

	if (!WINDOWS_GNU_COMMANDS.every((command) => hasExecutable(command, env))) {
		console.error("release:relizy found Git for Windows, but grep/head/sed are still unavailable.");
		console.error(`Check PATH, or verify this directory manually: ${gitUsrBinPath}`);
		process.exit(1);
	}

	return env;
}

function getWorkspacePackages() {
	const appsDir = resolve(process.cwd(), "apps");

	if (!existsSync(appsDir)) {
		return [];
	}

	return readdirSync(appsDir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => join(appsDir, entry.name, "package.json"))
		.filter((packageJsonPath) => existsSync(packageJsonPath))
		.map((packageJsonPath) => {
			const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as Partial<WorkspacePackageInfo>;

			return {
				name: packageJson.name,
				version: packageJson.version,
			};
		})
		.filter((pkg): pkg is WorkspacePackageInfo => typeof pkg.name === "string" && typeof pkg.version === "string");
}

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
		"release:relizy detected that this repository does not have baseline package tags yet:",
		...missingPackages.map((pkg) => `- ${pkg.name}@${pkg.version}`),
		"",
		"Before the first independent release, create baseline tags at the current package versions:",
		...tagCommands,
		`git push origin ${pushArgs}`,
	].join("\n");
}

function printBootstrapInstructions(missingPackages: WorkspacePackageInfo[]) {
	console.error(buildBootstrapInstructions(missingPackages));
}

function resolveRelizyEntrypoint() {
	return resolve(process.cwd(), "node_modules", "relizy", "bin", "relizy.mjs");
}

export function runRelizyRunner(relizyArgs: string[]) {
	if (relizyArgs.length === 0) {
		console.error("Usage: tsx scripts/relizy-runner.ts <relizy args>");
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
		console.error("Local relizy CLI was not found. Run pnpm install first.");
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
