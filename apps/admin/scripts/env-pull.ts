/**
 * @file 环境变量拉取脚本
 * @description 先执行 vercel link 链接项目，再执行 vercel env pull 拉取环境变量
 *
 * 使用方式：
 * 1. 确保根目录 .env 文件中包含 VERCEL_TOKEN
 * 2. 确保根目录 .env.vercel 文件中包含 VERCEL_PROJECT_NAME
 * 3. 运行 pnpm env:pull
 */

import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "@dotenvx/dotenvx";
import { consola } from "consola";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const adminDir = resolve(__dirname, "..");

/** 加载根目录的环境变量文件 */
config({ path: resolve(adminDir, "../../.env.vercel") });
config({ path: resolve(adminDir, "../../.env") });

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_NAME = process.env.VERCEL_PROJECT_NAME;

/** 检查必要的环境变量 */
function checkEnvVariables() {
	const missing: string[] = [];

	if (!VERCEL_TOKEN) missing.push("VERCEL_TOKEN (在根目录 .env 中配置)");
	if (!VERCEL_PROJECT_NAME) missing.push("VERCEL_PROJECT_NAME (在根目录 .env.vercel 中配置)");

	if (missing.length > 0) {
		consola.error("缺少必要的环境变量：");
		missing.forEach((item) => consola.error(`  - ${item}`));
		process.exit(1);
	}
}

/** 执行 vercel link 命令链接项目 */
function linkVercelProject() {
	consola.info(`正在链接 Vercel 项目: ${VERCEL_PROJECT_NAME}`);

	try {
		execSync(`vercel link --project=${VERCEL_PROJECT_NAME} --yes --token=${VERCEL_TOKEN}`, {
			cwd: adminDir,
			stdio: "inherit",
		});
		consola.success(`Vercel 项目链接成功: ${VERCEL_PROJECT_NAME}`);
	} catch (error) {
		consola.error("Vercel 项目链接失败：", error);
		process.exit(1);
	}
}

/** 拉取环境变量 */
function pullEnvVariables() {
	const envFilePath = resolve(adminDir, ".env");

	consola.info("开始拉取 Vercel 环境变量...");

	try {
		execSync(`vercel env pull "${envFilePath}" --yes --token=${VERCEL_TOKEN}`, {
			cwd: adminDir,
			stdio: "inherit",
		});
		consola.success("环境变量拉取成功！");
		consola.info(`环境变量文件位置: ${envFilePath}`);
	} catch (error) {
		consola.error("环境变量拉取失败：", error);
		process.exit(1);
	}
}

/** 主函数 */
function main() {
	consola.start("开始执行环境变量拉取流程...\n");

	consola.info("1. 检查环境变量配置");
	checkEnvVariables();
	consola.success("环境变量配置检查通过\n");

	consola.info("2. 链接 Vercel 项目");
	linkVercelProject();
	consola.success("Vercel 项目链接完成\n");

	consola.info("3. 拉取环境变量");
	pullEnvVariables();

	consola.success("\n环境变量拉取流程完成！");
}

main();
