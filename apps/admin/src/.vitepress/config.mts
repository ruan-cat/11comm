import {
	addChangelog2doc,
	setGenerateSidebar,
	setUserConfig,
	copyReadmeMd,
	copyClaudeFiles,
} from "@ruan-cat/vitepress-preset-config/config";

// import AutoImport from "../plugins/unplugin-auto-import/index.ts";
// import tsAlias from "../plugins/vite-plugin-ts-alias/index.ts";

copyReadmeMd("./src");

copyClaudeFiles({
	/**
	 * 该地址是写相对路径的 不能写绝对路径，容易导致意外。
	 * vitepress 命令运行在 apps/admin 目录内，该地址是相对于该运行目录的。
	 */
	target: "src/docs/prompts/claude",
	// rootDir: "../../",
});

// 为文档添加自动生成的changelog
addChangelog2doc({
	// 设置changelog的目标文件夹
	target: "./src",
});

const userConfig = setUserConfig({
	title: "11comm前端组技术文档",
	description: "本前端项目的使用文档，说明文档",
	themeConfig: {
		socialLinks: [
			{
				icon: "github",
				link: "https://github.com/ruan-cat/11comm",
			},
		],
		editLink: {
			pattern: "https://github.com/ruan-cat/11comm/tree/dev/apps/admin/src/:path",
		},
	},
});
// @ts-ignore
userConfig.themeConfig.sidebar = setGenerateSidebar({
	documentRootPath: "./src",
});
// @ts-ignore
// userConfig.vite.plugins = [AutoImport, tsAlias, ...userConfig.vite.plugins];
export default userConfig;
