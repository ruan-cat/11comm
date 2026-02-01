import { config } from "@dotenvx/dotenvx";
import { defineConfig } from "@ruan-cat/vercel-deploy-tool";
import { getDomains } from "@ruan-cat/domains";

/** 加载 Vercel 项目配置环境变量 */
config({ path: ".env.vercel" });

/** 加载包含 VERCEL_TOKEN 的敏感环境变量 */
config({ path: ".env" });

const VITE_IS_REVERSE_PROXY = process.env.VITE_IS_REVERSE_PROXY;
function IS_REVERSE_PROXY() {
	return VITE_IS_REVERSE_PROXY === "true";
}
/**
 * 需要反向代理时 就不需要vercel构建生成 .vercel 文件夹
 * 不需要反向代理时 就需要生成 .vercel 文件夹
 */
const isNeedVercelBuild = !IS_REVERSE_PROXY();

/**
 * - 需要 vercel 的 build 命令时   ./apps/admin/dist
 * - 不需要 vercel 的 build 命令时 ./apps/admin
 */
const targetCWD = isNeedVercelBuild ? "./apps/admin/dist" : "./apps/admin";

// 这里使用的是阮喵喵的vercel账号
export default defineConfig({
	// 01星球专门的vercel部署项目
	vercelProjectName: process.env.VERCEL_PROJECT_NAME!,
	vercelOrgId: process.env.VERCEL_ORG_ID!,
	vercelProjectId: process.env.VERCEL_PROJECT_ID!,
	vercelToken: process.env.VERCEL_TOKEN || "",

	// 暂不需要反向代理
	// vercelJsonPath: "./vercel.reverse-proxy.json",
	// TODO: 处理项目的404页面显示，让vercel项目可以自己显示出404
	// vercelJsonPath: "./vercel.404.json",

	deployTargets: [
		// 11comm智慧社区 主项目
		// {
		// 	type: "static",
		// 	isNeedVercelBuild,
		// 	targetCWD,
		// 	url: getDomains("11comm"),
		// },

		// 11comm智慧社区 前端技术文档
		{
			type: "static",
			targetCWD: "./apps/admin/src/.vitepress/dist",
			url: getDomains("11comm-doc"),
		},
	],
});
