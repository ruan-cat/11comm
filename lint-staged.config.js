import path from "node:path";

const ignoredPrefixes = ["examples/gitee-example-app/"];
const appLintFilePattern = /^apps\/app\/.*\.(?:js|mjs|cjs|jsx|ts|mts|cts|tsx|vue|json|css|scss|html|ya?ml)$/;
/**
 * App 的 ESLint 配置可以接管 JSON、样式和 HTML 等文件，但 oxlint 只处理
 * JS/TS/Vue 代码文件。这里单独收敛 oxlint 输入，避免把非代码文件传给 oxlint。
 */
const appOxlintFilePattern = /\.(?:js|mjs|cjs|jsx|ts|mts|cts|tsx|vue)$/;
const appMarkdownPattern = /^apps\/app\/.*\.md$/;
const binaryFilePattern = /\.(?:bmp|gif|ico|jpe?g|mp4|mov|png|pdf|ttf|otf|webm|webp|woff2?)$/i;

const toPosixRelativePath = (file) => {
	const relativePath = path.isAbsolute(file) ? path.relative(process.cwd(), file) : file;

	return relativePath.replaceAll(path.sep, "/");
};

const toAppRelativePath = (file) => file.replace(/^apps\/app\//, "");

const quotePath = (file) => `"${file.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;

const toPrettierCommand = (command, files) => (files.length > 0 ? `${command} ${files.map(quotePath).join(" ")}` : []);

/**
 * 为 App 子项目生成文件级 lint-staged 命令。
 *
 * 历史故障：这里曾直接运行 `pnpm -F @01s-11comm/app lint:fix`，而 App 的
 * `lint:fix` 会串行执行全量 `lint:oxlint && lint:eslint`。lint-staged 本应只处理
 * staged 文件，复用全量脚本会让少量提交触发整个 App 项目的 lint，导致 pre-commit
 * 性能退化。
 *
 * 决策：lint-staged 已经提供 staged 文件清单，所以这里把仓库相对路径转成 App 工作目录
 * 相对路径，并直接调用 App 本地 oxlint/eslint，只把本次提交涉及的文件传给 linter。
 *
 * @param {string[]} files 仓库根目录相对路径下的 staged App 文件。
 * @returns {string[]} 只作用于本次 staged 文件的 App lint 命令。
 */
const toAppLintCommands = (files) => {
	if (files.length === 0) {
		return [];
	}

	const appRelativeFiles = files.map(toAppRelativePath);
	const appOxlintFiles = appRelativeFiles.filter((file) => appOxlintFilePattern.test(file));
	const commands = [];

	if (appOxlintFiles.length > 0) {
		commands.push(
			`pnpm --dir ./apps/app exec oxlint --fix --fix-suggestions --fix-dangerously --no-error-on-unmatched-pattern ${appOxlintFiles.map(quotePath).join(" ")}`,
		);
	}

	commands.push(
		`pnpm --dir ./apps/app exec eslint --fix --no-warn-ignored --ignore-pattern "docs/.vitepress/**" ${appRelativeFiles.map(quotePath).join(" ")}`,
	);

	return commands;
};

/** @type {import('lint-staged').Configuration} */
export default (files) => {
	const stagedFiles = files.map(toPosixRelativePath);
	const includedFiles = stagedFiles.filter((file) => !ignoredPrefixes.some((prefix) => file.startsWith(prefix)));
	const appLintFiles = includedFiles.filter((file) => appLintFilePattern.test(file));
	const appMarkdownFiles = includedFiles.filter((file) => appMarkdownPattern.test(file));
	const rootPrettierFiles = includedFiles.filter(
		(file) => !appLintFilePattern.test(file) && !appMarkdownPattern.test(file) && !binaryFilePattern.test(file),
	);
	const commands = [];

	commands.push(...toAppLintCommands(appLintFiles));

	const appMarkdownCommand = toPrettierCommand(
		"prettier --ignore-unknown --experimental-cli --write --no-parallel",
		appMarkdownFiles,
	);
	const rootPrettierCommand = toPrettierCommand("prettier --experimental-cli --write --no-parallel", rootPrettierFiles);

	return commands.concat(appMarkdownCommand, rootPrettierCommand);
};
