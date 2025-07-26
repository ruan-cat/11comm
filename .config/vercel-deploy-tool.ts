import type { Config } from "@ruan-cat/vercel-deploy-tool/src/config.ts";
import { domains } from "@ruan-cat/domains";

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
 * - 不需要 vercel 的 build 命令时 ./apps/admin/.vercel
 */
const targetCWD = isNeedVercelBuild ? "./apps/admin/dist" : "./apps/admin/.vercel";

// 这里使用的是阮喵喵的vercel账号
export default <Config>{
	// 01星球专门的vercel部署项目
	vercelProjetName: "01s-vercel",
	vercelOrgId: "team_cUeGw4TtOCLp0bbuH8kA7BYH",
	vercelProjectId: "prj_0dbaKzhoqP9C3A7C4QDkzjSprN2L",
	vercelToken: "",

	// 暂不需要反向代理
	// vercelJsonPath: "./vercel.reverse-proxy.json",
	// TODO: 处理项目的404页面显示，让vercel项目可以自己显示出404
	// vercelJsonPath: "./vercel.404.json",

	deployTargets: [
		// 11comm智慧社区 主项目
		{
			type: "static",
			isNeedVercelBuild,
			targetCWD,
			url: domains["11comm"] as unknown as string[],
		},
		// {
		// 	type: "userCommands",
		// 	targetCWD: "./apps/admin",
		// 	outputDirectory: "dist",
		// 	userCommands: ["pnpm -C=./apps/admin build"],
		// 	url: domains["11comm"] as unknown as string[],
		// },

		// 11comm智慧社区 前端技术文档
		{
			type: "static",
			targetCWD: "./apps/admin/src/.vitepress/dist",
			url: domains["11comm-doc"] as unknown as string[],
		},
	],
};
