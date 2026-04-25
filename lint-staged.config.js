import path from "node:path";

const ignoredPrefixes = ["examples/gitee-example-app/"];
const appLintFilePattern = /^apps\/app\/.*\.(?:js|mjs|cjs|jsx|ts|mts|cts|tsx|vue|json|css|scss|html|ya?ml)$/;
const appMarkdownPattern = /^apps\/app\/.*\.md$/;
const binaryFilePattern = /\.(?:bmp|gif|ico|jpe?g|mp4|mov|png|pdf|ttf|otf|webm|webp|woff2?)$/i;

const toPosixRelativePath = (file) => {
	const relativePath = path.isAbsolute(file) ? path.relative(process.cwd(), file) : file;

	return relativePath.replaceAll(path.sep, "/");
};

const quotePath = (file) => `"${file.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;

const toPrettierCommand = (command, files) => (files.length > 0 ? `${command} ${files.map(quotePath).join(" ")}` : []);

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

	if (appLintFiles.length > 0) {
		commands.push("pnpm -F @01s-11comm/app lint:fix");
	}

	const appMarkdownCommand = toPrettierCommand(
		"prettier --ignore-unknown --experimental-cli --write",
		appMarkdownFiles,
	);
	const rootPrettierCommand = toPrettierCommand("prettier --experimental-cli --write", rootPrettierFiles);

	return commands.concat(appMarkdownCommand, rootPrettierCommand);
};
