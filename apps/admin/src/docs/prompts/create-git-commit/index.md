# 生成 git commit 提交信息

我会在对话内，主动要求你根据现在 git 修改内容，生成提交信息。

## 生成时机

根据我的对话，来生成提交信息。没有我的要求，请不要生成

## 上下文信息

你应该先参考这些上下文信息，生成满足规范的 git commit 信息。

- commitlint.config.cjs
- https://github.com/ruan-cat/monorepo/blob/dev/configs-package/commitlint-config/README.md

认真阅读 `commitlint.config.cjs` 提供的配置。

## 生成步骤

按照以下步骤来生成 git commit 信息。

1. 使用终端，运行命令 `git add .` ，先暂存修改内容。
2. 运行命令 `cz` ，触发交互式提交。
3. 在交互式的终端内，选择提交范围、生成提交信息。
