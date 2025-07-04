import { defineConfig } from "taze";

export default defineConfig({
	// fetch latest package info from registry without cache
	force: true,
	// write to package.json
	write: true,
	// run `npm install` or `yarn install` right after bumping
	install: true,
	// ignore paths for looking for package.json in monorepo
	ignorePaths: ["**/node_modules/**", "**/test/**"],
	// ignore package.json that in other workspaces (with their own .git,pnpm-workspace.yaml,etc.)
	ignoreOtherWorkspaces: true,
	// override with different bumping mode for each package
	packageMode: {
		codemirror: "ignore",
		// regex starts and ends with '/'
		"/@form-create/": "next",
		"/@wangeditor/": "next",
	},
	// disable checking for "overrides" package.json field
	depFields: {
		overrides: false,
	},
});
