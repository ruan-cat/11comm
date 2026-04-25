import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const apiRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			server: path.resolve(apiRoot, "server"),
		},
	},
	test: {
		environment: "node",
		include: ["tests/**/*.test.ts"],
	},
});
