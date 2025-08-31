import {
	addChangelog2doc,
	setGenerateSidebar,
	setUserConfig,
	copyReadmeMd,
} from "@ruan-cat/vitepress-preset-config/config";

// import AutoImport from "../plugins/unplugin-auto-import/index.ts";
// import tsAlias from "../plugins/vite-plugin-ts-alias/index.ts";

copyReadmeMd("./src");

// 为文档添加自动生成的changelog
addChangelog2doc({
	// 设置changelog的目标文件夹
	target: "./src",
	// 设置changelog顶部的yaml数据。通常是排序
	data: {
		order: 1000,
		dir: {
			order: 1000,
		},
	},
});

const userConfig = setUserConfig(
	{
		title: "11comm前端组技术文档",
		description: "本前端项目的使用文档，说明文档",
		themeConfig: {
			socialLinks: [
				{
					icon: "github",
					link: "https://github.com/ruan-cat/11comm",
				},
			],
		},
	},
	{
		plugins: {
			// 不使用该插件
			vitePluginVercel: false,
		},
	},
);
// @ts-ignore
userConfig.themeConfig.sidebar = setGenerateSidebar({
	documentRootPath: "./src",
});
// @ts-ignore
// userConfig.vite.plugins = [AutoImport, tsAlias, ...userConfig.vite.plugins];
export default userConfig;
