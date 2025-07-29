# 生成 git commit 提交信息

我会在对话内，主动要求你根据现在 git 修改内容，生成提交信息。

## 生成时机

根据我的对话，来生成提交信息。没有我的要求，请不要生成

## 上下文信息

你应该先参考这些上下文信息，生成满足规范的 git commit 信息。

- commitlint.config.cjs
- https://github.com/ruan-cat/monorepo/blob/dev/configs-package/commitlint-config/README.md
- https://github.com/ruan-cat/monorepo/blob/dev/configs-package/commitlint-config/src/config.ts

认真阅读 `commitlint.config.cjs` 提供的配置。

## 生成步骤

按照以下步骤来生成 git commit 信息。

1. 使用终端，运行命令 `git add .` ，先暂存修改内容。
2. 根据提交规范，生成提交信息。
