import type { ChangelogConfig } from "changelogen";

import { commitTypes } from "@ruan-cat/commitlint-config/src/commit-types.ts";
import { isConditionsSome } from "@ruan-cat/utils";

/**
 * @see https://github.com/unjs/changelogen
 */
export default {
	// 提供明显的文件名
	output: "CHANGELOG.md",

	/** @see https://github.com/viapip/ozon-tracker/blob/master/changelogen.config.json */
	types: Object.fromEntries(
		commitTypes.map((commitType) => {
			const { type, description, emoji } = commitType;

			if (
				isConditionsSome([
					() => type === "feat",
					() => type === "fix",
					() => type === "refactor",
					() => type === "build",
				])
			) {
				return [type, { title: `${emoji} ${description}` }];
			}
		}),
	),

	templates: {
		commitMessage: "📢 publish: release package v{{newVersion}}",
	},
} satisfies Partial<ChangelogConfig>;
