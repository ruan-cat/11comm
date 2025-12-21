import type { ChangelogConfig } from "changelogen";
import { changelogogenUseTypes } from "@ruan-cat/commitlint-config/src/changelogen-use-types.ts";

/**
 * @see https://github.com/unjs/changelogen
 */
export default {
	// 提供明显的文件名
	output: "CHANGELOG.md",

	/** @see https://github.com/viapip/ozon-tracker/blob/master/changelogen.config.json */
	types: changelogogenUseTypes,

	templates: {
		commitMessage: "📢 publish: release package v{{newVersion}}",
	},
} satisfies Partial<ChangelogConfig>;
