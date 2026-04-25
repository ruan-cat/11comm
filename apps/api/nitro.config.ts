import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "nitro";

const apiRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	serverDir: "./server",
	ignore: ["modules/**"],
	devServer: {
		port: 3102,
		watch: ["./server/**/*.ts"],
	},
	handlers: [
		{
			route: "/app/**",
			handler: "./server/handlers/legacy-dispatch",
		},
	],
	alias: {
		server: path.resolve(apiRoot, "server"),
	},
});
