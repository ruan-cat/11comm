import { defineConfig } from "nitro";
import { pathResolve } from "./build/utils";

// FIXME: 目前没有办法实现 nitro 打包 整个项目时无法运行的 ， 出现 SSR 渲染问题。无法正确识别项目中的路径别名。
export default defineConfig({
	// serverDir: "apps/admin",
	serverDir: false,
	alias: {
		/**
		 * Nitro 构建需要显式传入当前文件的 import.meta.url，
		 * 否则默认会以 build/utils.ts 的路径为基准，导致解析到 build/src。
		 */
		"@": pathResolve("./src", import.meta.url),
		components: pathResolve("./src/components", import.meta.url),
		composables: pathResolve("./src/composables", import.meta.url),
	},
	compatibilityDate: "2024-09-19",
	preset: "cloudflare_module",
	cloudflare: {
		deployConfig: true,
		nodeCompat: true,
    wrangler: {
      // 部署到 cloudflare worker 的名称。 与 cloudflare worker 云端设置保持一致
      name: "01s-11comm-admin-nitro",
    },
	},
});
