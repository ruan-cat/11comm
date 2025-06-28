import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// 本地https支持插件，插件启动的时候需要从Github下载文件，所以没有梯子可能无法正常工作
// import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
	server: {
		host: "0.0.0.0",
		port: 3000,
		proxy: {
			"/api": {
				changeOrigin: true,
				//FIXME[TEST_CODE]:使用Apifox云MOCK,联调阶段需要修改成网关地址
				target: "https://apifoxmock.com/m1/5579661-5257590-default",
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
			"/captcha": {
				changeOrigin: true,
				//FIXME[TEST_CODE]:联调阶段需要修改成网关地址
				target: "http://localhost:10680",
				rewrite: (path) => path.replace(/^\/captcha/, ""),
			},
		},
	},
	build: {
		assetsDir: "static",
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) {
						return id.toString().split("node_modules/")[1].split("/")[0].toString();
					}
				},
			},
			external: new RegExp("views/sample/.*"),
		},
	},
	plugins: [
		//mkcert(),
		vue(),
		vueDevTools(),
		AutoImport({
			resolvers: [ElementPlusResolver()],
		}),
		Components({
			resolvers: [ElementPlusResolver()],
		}),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
