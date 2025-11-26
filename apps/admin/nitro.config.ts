import { defineConfig } from "nitro";
import { pathResolve } from "./build/utils";

// FIXME: 目前没有办法实现 nitro 打包 整个项目时无法运行的 ， 出现 SSR 渲染问题。无法正确识别项目中的路径别名。
export default defineConfig({
	// serverDir: "apps/admin",
	serverDir: false,
	alias: {
		"@": pathResolve("./src"),
	},
});
