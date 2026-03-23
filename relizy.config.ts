import { defineConfig } from "relizy";
import changelogConfig from "./changelog.config";

export default defineConfig({
	projectName: "11comm",
	types: changelogConfig.types,
	templates: {
		...(changelogConfig.templates ?? {}),
		changelogTitle: "{{newVersion}} ({{date}})",
	},
	monorepo: {
		versionMode: "independent",
		packages: ["apps/*"],
	},
	changelog: {
		rootChangelog: true,
		includeCommitBody: true,
		formatCmd: 'pnpm exec prettier --experimental-cli --write CHANGELOG.md "apps/*/CHANGELOG.md"',
	},
	release: {
		changelog: true,
		commit: true,
		push: true,
		gitTag: true,
		clean: true,
		noVerify: false,
		publish: false,
		providerRelease: false,
		social: false,
		prComment: false,
	},
});
