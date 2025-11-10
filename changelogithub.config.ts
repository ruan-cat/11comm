import { defineConfig } from "changelogithub";

import { commitTypes } from "@ruan-cat/commitlint-config/src/commit-types.ts";

/**
 * @see https://github.com/antfu/changelogithub
 */
export default defineConfig({
	output: "CHANGELOG.md",

	/** @see https://github.com/viapip/ozon-tracker/blob/master/changelogen.config.json */
	types: Object.fromEntries(
		commitTypes.map((commitType) => [
			commitType.type,
			{
				title: commitType.type.charAt(0).toUpperCase() + commitType,
			},
		]),
	),
});
