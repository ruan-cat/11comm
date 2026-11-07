import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Cloudflare 上的部署命令固定为 `npx wrangler --cwd=./apps/admin/.output deploy`。
 * Vite 只写出 dist。缺少 .output 时，wrangler 报 Missing file or directory。
 */
const adminDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = resolve(adminDir, ".output");
const config = {
	name: "01s-11comm-admin",
	compatibility_date: "2025-06-29",
	assets: {
		directory: "../dist",
		not_found_handling: "single-page-application",
	},
};

await mkdir(outputDir, { recursive: true });
await writeFile(resolve(outputDir, "wrangler.json"), `${JSON.stringify(config, null, "\t")}\n`);
