import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "js-yaml";
import { defineConfig } from "relizy";
import changelogConfig from "./changelog.config";

interface PnpmWorkspaceManifest {
	packages?: string[];
}

function readWorkspacePackagePatterns(): string[] {
	const manifest = load(readFileSync(resolve("pnpm-workspace.yaml"), "utf8")) as PnpmWorkspaceManifest;

	return manifest?.packages?.filter((p) => !p.startsWith("!")) ?? [];
}

const workspacePatterns = readWorkspacePackagePatterns();

export default defineConfig({
	projectName: "11comm",
	types: changelogConfig.types,
	templates: {
		...(changelogConfig.templates ?? {}),
		changelogTitle: "{{newVersion}} ({{date}})",
	},
	monorepo: {
		versionMode: "independent",
		packages: workspacePatterns,
	},
	changelog: {
		rootChangelog: true,
		includeCommitBody: true,
		formatCmd: `pnpm exec prettier --experimental-cli --write CHANGELOG.md ${workspacePatterns.map((p) => `"${p}/CHANGELOG.md"`).join(" ")}`,
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
