// bump.config.ts
import { defineConfig } from "bumpp";

/**
 * @see https://github.com/antfu-collective/bumpp
 */
export default defineConfig({
	push: true,
	commit: "📢 publish: release package v%s",
	tag: "v%s",
});
