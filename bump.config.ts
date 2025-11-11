// bump.config.ts
import { defineConfig } from "bumpp";

/**
 * @see https://github.com/antfu-collective/bumpp
 */
export default defineConfig({
	// 不生成提交信息
	// commit: false,
	commit: "📢 publish: release package v%s",
	tag: "v%s",
	// 尝试不生成 tag
	// tag: false,
	// 不推送到远程仓库
	// push: false,
});
