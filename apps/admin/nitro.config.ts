import { defineConfig } from "nitro";

export default defineConfig({
	serverDir: "./server",

	/**
	 * 配置 Nitro 扫描目录
	 * @description
	 * 明确指定 Nitro 只扫描服务端目录，避免扫描客户端代码
	 * @see https://nitro.unjs.io/config#scandirs
	 */
	scanDirs: ["./server"],

	devServer: {
		watch: ["./server/**/*.ts"],
	},

	compatibilityDate: "2024-09-19",
	// 不提供任何写死的预设了 需要在运行命令的环境变量 NITRO_PRESET 内传入
	// preset: "cloudflare_module",
	typescript: {
		// typeCheck: true,
		// generatedTypesDir: pathResolve("./src/types"),
	},

	cloudflare: {
		deployConfig: true,
		nodeCompat: true,
		wrangler: {
			// 部署到 cloudflare worker 的名称。 与 cloudflare worker 云端设置保持一致
			name: "01s-11comm-admin",
			vars: {
				// 将包锁文件上传 即可更改构建流为 pnpm 了 以下环境变量失效
				/** @see https://developers.cloudflare.com/workers/ci-cd/builds/build-image/ */
				// SKIP_DEPENDENCY_INSTALL: 1,
				// NPM_CONFIG_PACKAGE_MANAGER: "pnpm",
				/** @see https://github.com/cloudflare/workers-sdk/pull/1427 */
				// npm_config_user_agent: "pnpm",
			},
		},
	},
});
