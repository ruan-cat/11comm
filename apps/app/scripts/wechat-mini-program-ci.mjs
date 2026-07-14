#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import miniprogramCi from "miniprogram-ci";

const ci = miniprogramCi.default ?? miniprogramCi;
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(appRoot, "..", "..");
const command = process.argv[2] ?? "help";
const mode = getArg("--mode") ?? process.env.WECHAT_MP_ENV_MODE ?? "production";
const packageJson = readJson(path.join(appRoot, "package.json"));
const appEnv = loadAppEnv(mode);

const config = {
	appid: getArg("--appid") ?? process.env.WECHAT_MP_APPID ?? appEnv.VITE_WX_APPID ?? "",
	privateKeyPath: resolveOptionalPath(getArg("--private-key-path") ?? process.env.WECHAT_MP_PRIVATE_KEY_PATH ?? ""),
	robot: Number(getArg("--robot") ?? process.env.WECHAT_MP_CI_ROBOT ?? "1"),
	version: getArg("--version") ?? process.env.WECHAT_MP_UPLOAD_VERSION ?? packageJson.version ?? "0.0.0",
	desc: getArg("--desc") ?? process.env.WECHAT_MP_UPLOAD_DESC ?? "uploaded by miniprogram-ci",
	projectPath: resolveProjectPath(getArg("--project-path") ?? process.env.WECHAT_MP_PROJECT_PATH),
	qrcodeOutputDest: resolveProjectPath(
		getArg("--qrcode-output") ?? process.env.WECHAT_MP_QRCODE_OUTPUT ?? ".tmp/wechat-mini-program/preview-qrcode.jpg",
	),
};

const ciSetting = {
	es6: true,
	es7: true,
	minify: true,
	codeProtect: false,
	minifyJS: true,
	minifyWXML: true,
	minifyWXSS: true,
};

try {
	if (command === "doctor") {
		doctor();
	} else if (command === "preview") {
		await preview();
	} else if (command === "upload") {
		await upload();
	} else {
		help();
	}
} catch (error) {
	console.error(sanitizeError(error));
	process.exitCode = 1;
}

function doctor() {
	const manifestPath = path.join(appRoot, "manifest.config.ts");
	const projectPathExists = fs.existsSync(config.projectPath);
	const sensitiveHits = scanAppEnvForSensitiveKeys();

	printHeader("doctor");
	printLine("appRoot", appRoot);
	printLine("homepage", packageJson.homepage ?? "(missing)");
	printLine("mode", mode);
	printLine("appid", mask(config.appid));
	printLine("projectPath", `${config.projectPath} (${projectPathExists ? "exists" : "missing"})`);
	printLine("manifest", `${manifestPath} (${fs.existsSync(manifestPath) ? "exists" : "missing"})`);
	printLine("miniprogram-ci", packageJson.devDependencies?.["miniprogram-ci"] ?? "(missing)");
	printLine("@cloudbase/cli", packageJson.devDependencies?.["@cloudbase/cli"] ?? "(missing)");
	printLine("@cloudbase/cloudbase-mcp", packageJson.devDependencies?.["@cloudbase/cloudbase-mcp"] ?? "(missing)");
	printLine("privateKeyPath", config.privateKeyPath ? "(configured, hidden)" : "(not required for doctor)");
	printLine("robot", String(config.robot));

	if (!config.appid) {
		console.warn("WARN missing WECHAT_MP_APPID or VITE_WX_APPID.");
	}

	if (!projectPathExists) {
		console.warn("WARN mp-weixin build output is missing. Run: pnpm -F @01s-11comm/app build:mp:prod");
	}

	if (sensitiveHits.length > 0) {
		console.warn("WARN app env files contain sensitive-looking keys:");
		for (const hit of sensitiveHits) {
			console.warn(`- ${path.relative(appRoot, hit.file)}:${hit.line} ${hit.key}`);
		}
	}

	console.log("Doctor finished. Missing secrets do not fail doctor; preview/upload will enforce them.");
}

async function preview() {
	const project = createCiProject();
	ensureOutputDir(config.qrcodeOutputDest);

	printHeader("preview");
	printLine("appid", mask(config.appid));
	printLine("projectPath", config.projectPath);
	printLine("robot", String(config.robot));
	printLine("qrcodeOutputDest", config.qrcodeOutputDest);

	await ci.preview({
		project,
		desc: config.desc,
		setting: ciSetting,
		robot: config.robot,
		qrcodeFormat: "image",
		qrcodeOutputDest: config.qrcodeOutputDest,
		onProgressUpdate: (progress) => console.log(sanitizeText(progress)),
	});

	console.log(`Preview QR code: ${config.qrcodeOutputDest}`);
}

async function upload() {
	const project = createCiProject();

	printHeader("upload");
	printLine("appid", mask(config.appid));
	printLine("projectPath", config.projectPath);
	printLine("robot", String(config.robot));
	printLine("version", config.version);
	printLine("desc", config.desc);

	await ci.upload({
		project,
		version: config.version,
		desc: config.desc,
		setting: ciSetting,
		robot: config.robot,
		onProgressUpdate: (progress) => console.log(sanitizeText(progress)),
	});

	console.log(
		"Upload finished. This only creates/updates the WeChat development version; it is not review approval or production release.",
	);
}

function createCiProject() {
	requireValue("appid", config.appid);
	requireValue("privateKeyPath", config.privateKeyPath);

	if (!Number.isInteger(config.robot) || config.robot < 1 || config.robot > 30) {
		throw new Error("WECHAT_MP_CI_ROBOT must be an integer from 1 to 30.");
	}

	if (!fs.existsSync(config.projectPath)) {
		throw new Error(`Project path does not exist: ${config.projectPath}. Run build:mp:prod first.`);
	}

	if (!fs.existsSync(config.privateKeyPath)) {
		throw new Error(`Private key path does not exist: ${config.privateKeyPath}`);
	}

	if (!fs.statSync(config.privateKeyPath).isFile()) {
		throw new Error(`Private key path must point to a file: ${config.privateKeyPath}`);
	}

	if (isSameOrInsidePath(config.privateKeyPath, repoRoot)) {
		throw new Error("WECHAT_MP_PRIVATE_KEY_PATH must not point inside this git repository.");
	}

	return new ci.Project({
		appid: config.appid,
		type: "miniProgram",
		projectPath: config.projectPath,
		privateKeyPath: config.privateKeyPath,
		ignores: ["node_modules/**/*", ".git/**/*"],
	});
}

function help() {
	console.log(`Usage:
  node ./scripts/wechat-mini-program-ci.mjs doctor
  node ./scripts/wechat-mini-program-ci.mjs preview
  node ./scripts/wechat-mini-program-ci.mjs upload

Environment:
  WECHAT_MP_APPID              Optional override for VITE_WX_APPID.
  WECHAT_MP_PRIVATE_KEY_PATH   Required by preview/upload. Must be outside the repo.
  WECHAT_MP_CI_ROBOT           Defaults to 1.
  WECHAT_MP_UPLOAD_VERSION     Defaults to package.json version.
  WECHAT_MP_UPLOAD_DESC        Defaults to a generic miniprogram-ci desc.
  WECHAT_MP_PROJECT_PATH       Defaults to apps/app/dist/build/mp-weixin.
  WECHAT_MP_QRCODE_OUTPUT      Defaults to apps/app/.tmp/wechat-mini-program/preview-qrcode.jpg.
`);
}

function loadAppEnv(envMode) {
	return {
		...readEnvFile(path.join(appRoot, "env", ".env")),
		...readEnvFile(path.join(appRoot, "env", `.env.${envMode}`)),
	};
}

function readEnvFile(file) {
	if (!fs.existsSync(file)) {
		return {};
	}

	const result = {};
	const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) {
			continue;
		}

		const eqIndex = trimmed.indexOf("=");
		if (eqIndex === -1) {
			continue;
		}

		const key = trimmed.slice(0, eqIndex).trim();
		const value = trimmed
			.slice(eqIndex + 1)
			.trim()
			.replace(/^['"]|['"]$/g, "");
		result[key] = value;
	}

	return result;
}

function readJson(file) {
	return JSON.parse(fs.readFileSync(file, "utf8"));
}

function getArg(name) {
	const prefix = `${name}=`;

	for (let index = 0; index < process.argv.length; index += 1) {
		const arg = process.argv[index];
		if (arg === name) {
			return process.argv[index + 1];
		}
		if (arg.startsWith(prefix)) {
			return arg.slice(prefix.length);
		}
	}

	return undefined;
}

function resolveProjectPath(value) {
	return path.resolve(appRoot, value ?? "dist/build/mp-weixin");
}

function resolveOptionalPath(value) {
	if (!value) {
		return "";
	}

	return path.resolve(value);
}

function scanAppEnvForSensitiveKeys() {
	const hits = [];
	const envDir = path.join(appRoot, "env");
	if (!fs.existsSync(envDir)) {
		return hits;
	}

	const pattern = /\b(WECHAT_MP_SECRET|SESSION_KEY|PRIVATE_KEY|BEGIN PRIVATE KEY|ACCESS_TOKEN|REFRESH_TOKEN)\b/i;
	for (const entry of fs.readdirSync(envDir)) {
		const file = path.join(envDir, entry);
		if (!fs.statSync(file).isFile()) {
			continue;
		}

		const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
		lines.forEach((line, index) => {
			const match = line.match(pattern);
			if (match) {
				hits.push({ file, line: index + 1, key: match[1] });
			}
		});
	}

	return hits;
}

function requireValue(name, value) {
	if (!value) {
		throw new Error(`Missing required config: ${name}`);
	}
}

function ensureOutputDir(file) {
	fs.mkdirSync(path.dirname(file), { recursive: true });
}

function isSameOrInsidePath(target, parent) {
	const relative = path.relative(parent, target);
	return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function printHeader(name) {
	console.log(`[wechat-mini-program-ci] ${name}`);
}

function printLine(key, value) {
	console.log(`${key}: ${value}`);
}

function mask(value) {
	if (!value) {
		return "(missing)";
	}

	if (value.length <= 8) {
		return "(configured)";
	}

	return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function sanitizeError(error) {
	return sanitizeText(error?.stack ?? error?.message ?? String(error));
}

function sanitizeText(value) {
	return String(value)
		.replace(/-----BEGIN[\s\S]+?-----END [^-]+-----/g, "[redacted-private-key]")
		.replace(/(secret|session_key|access_token|refresh_token|privateKey)\s*[:=]\s*[^,\s}]+/gi, "$1=[redacted]");
}
