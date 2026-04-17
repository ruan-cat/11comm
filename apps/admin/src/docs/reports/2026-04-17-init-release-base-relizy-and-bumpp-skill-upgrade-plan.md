<!-- 已完成 -->

# 2026-04-17 升级 `init-release-base-relizy-and-bumpp` 技能以支持官方 `bumpp` push 策略

## 背景

本次在 `11comm` 仓库内落地最新版 `init-release-base-relizy-and-bumpp` 技能时，我们确认了一个新的全局优化点：

根包发版同时存在两种真实使用方式：

1. 串行模式：`release` -> `release:sub` -> `release:root` -> `git:push`
2. 单独模式：开发者直接运行 `release:bumpp` / `bumpp`

旧版技能模板在 `bump.config.ts` 中写死 `push: false`，这对串行模式是成立的，但会破坏单独运行 `bumpp` 的场景：本地会打 tag，但远程没有 tag，最终表现为 GitHub Actions 的 `release.yaml` 没有被触发。

后续我们一度尝试过项目私有环境变量方案（如 `BUMPP_PUSH`），但进一步核对 `bumpp@10.4.1` 官方能力后确认：

- `BUMPP_PUSH` 不是 `bumpp` 官方环境变量
- 官方支持的是命令行参数 `--push` / `--no-push`
- 因此最干净、最稳妥、最可复用的全局技能升级方案，是把 push 策略显式收敛到 `package.json` scripts，而不是继续在 `bump.config.ts` 里写死

这意味着：`init-release-base-relizy-and-bumpp` 技能需要升级一轮模板、文档和验证矩阵。

## 本次确认的全局结论

### 1. 根包发版的 push 策略必须回到官方 CLI 参数

推荐的根包脚本基线应改为：

```json
{
	"release:bumpp": "bumpp --push",
	"release:root": "bumpp --no-push --yes --release patch"
}
```

含义如下：

- `release:root` 用于串行主链路中的根包 bump，只负责本地 commit/tag，不负责推送
- `release:bumpp` 用于单独执行 `bumpp` 的场景，需要立即推送 tag
- 不再依赖技能模板里写死的 `push: false`

### 2. `bump.config.ts` 不应承担“智能 push 决策”

`bump.config.ts` 是静态配置文件，会同时服务于“串行执行”和“单独执行”两种入口。  
因此它不适合承担动态推送策略。

推荐做法是：

- 配置文件里保留说明注释
- 把 `push` 配置注释掉，不作为生效配置
- 让命令行入口显式通过 `--push` / `--no-push` 决定行为

推荐模板形态：

```ts
export default defineConfig({
	commit: "📢 publish(root): release v%s",
	tag: "v%s",
	// bump.config.ts 可能单独使用，也可能被串行命令复用。
	// 因此 push 策略需要在命令行里通过 --push / --no-push 显式控制，
	// 不能在配置文件里写死。
	// push: false,
	execute: (operation) => {
		execSync(`pnpm exec changelogen --output CHANGELOG.md -r ${operation.state.newVersion}`, {
			cwd: operation.options.cwd,
			stdio: "inherit",
		});
	},
	all: true,
});
```

### 3. “工作流未触发”不一定是 `release.yaml` 识别失败

这次实测暴露出一个非常容易误判的问题：

- 本地存在 `v0.11.5-beta.1`
- `CHANGELOG.md` 里也存在 `## v0.11.5-beta.1`
- `release.yaml` 的匹配逻辑本身也兼容 `v0.11.5-beta.1`
- 但远程根本没有这个 tag，所以 GitHub Actions 没有触发

根因是：单独运行 `bumpp` 时没有 push tag。

因此技能文档必须新增一条明确的排障认知：

- 若 GitHub Release 工作流未触发，先检查远程 tag 是否存在
- 不要第一时间怀疑 `release.yaml` 的 changelog 提取逻辑

建议加入的排障命令：

```bash
git tag --list "v0.11.5-beta.1"
git ls-remote --tags origin "v0.11.5-beta.1"
```

## 目标技能仓库

本计划的目标不是修改当前 `11comm` 仓库，而是后续在以下技能仓库中升级：

`D:\code\ruan-cat\monorepo\ai-plugins\dev-skills\skills\init-release-base-relizy-and-bumpp`

## 建议升级范围

### 一、升级模板文件

#### 1. `templates/bump.config.ts`

必须修改：

- 删除生效中的 `push: false`
- 不引入任何项目私有环境变量协议，如 `BUMPP_PUSH`
- 保留 `commit`、`tag`、`execute`、`all` 的原有模板语义
- 在 `push` 位置改为注释说明

验收标准：

- 模板中不存在生效中的 `push:` 字段
- 模板中保留注释化的 `// push: false,`
- 模板中明确说明“push 由 CLI 控制，而不是配置文件控制”

#### 2. `templates/package-scripts.md`

必须修改：

- 把根包脚本模板改成官方 CLI 方案
- 显式区分“单独 bumpp”和“串行根发版”两个入口

建议模板：

```json
{
	"release": "pnpm run release:sub && pnpm run release:root && pnpm run git:push",
	"release:sub": "relizy-runner release --no-publish --no-provider-release --no-push --yes",
	"release:root": "bumpp --no-push --yes --release patch",
	"release:bumpp": "bumpp --push",
	"changelog:root": "changelogen --output CHANGELOG.md",
	"git:push": "git push --follow-tags"
}
```

验收标准：

- 文档中不再把 `release:root` 写成 `bumpp --yes --release patch`
- 文档中明确新增 `release:bumpp`
- 文档中不出现 `BUMPP_PUSH`

### 二、升级主技能文档

#### 3. `SKILL.md`

必须同步修改以下位置：

- “设计理念”
- “根包 scripts 模板”
- “核心决策（速查）”
- “验证命令基线”
- 任意提到 `push: false` 为固定策略的段落

必须新增的认知说明：

1. 根包存在两种合法入口：
   - 串行入口：`release:root`
   - 单独入口：`release:bumpp`
2. `bump.config.ts` 不做 push 动态决策
3. `bumpp` 的推送策略必须使用官方 `--push` / `--no-push`
4. 若工作流未触发，应先检查远程 tag 是否存在

建议将技能版本从 `2.0.0` 升到：

- `2.1.0`

这是一次模板行为层面的增量优化，不属于完全重写，但已经改变了技能输出的推荐基线。

### 三、升级 reference 文档

#### 4. `references/release-workflow-architecture.md`

补充说明：

- 为什么 `release:root` 必须 `--no-push`
- 为什么 `release:bumpp` 必须 `--push`
- 为什么 `push` 不能写死在 `bump.config.ts`

#### 5. `references/verification-matrix.md`

补充以下验证内容：

```bash
pnpm exec bumpp --help
pnpm exec bumpp --dry-run --release patch
git ls-remote --tags origin "v0.0.1"
```

并明确分成两类验收：

- 配置正确性验收
- 远程 tag 触发链路验收

#### 6. 新增一份排障参考文档

建议新增：

`references/bumpp-push-and-remote-tag-troubleshooting.md`

内容应覆盖：

- 本地 tag 存在但远程 tag 不存在的症状
- GitHub Actions 未触发时的排查顺序
- `release.yaml` 识别失败 与 “根本没有推送 tag” 的区别
- 典型命令与预期输出

如果不想新增文件，也至少应把这些内容并入：

- `references/verification-matrix.md`
- 或 `references/rollback-and-risks.md`

## 非目标

本轮技能升级不建议顺手引入以下内容：

- 不要再发明 `BUMPP_PUSH` 之类的项目私有环境变量协议
- 不要把 `bump.config.ts` 改造成读取 `npm_lifecycle_event` 的“智能配置”
- 不要把 `release.yaml` 的 root tag 识别问题与“远程 tag 缺失”混为一谈
- 不要回退到 `push: false` 固定策略
- 不要为了这个问题重新引入本地 runner 或额外 shell 包装层

## 推荐实施顺序

1. 修改 `templates/bump.config.ts`
2. 修改 `templates/package-scripts.md`
3. 修改 `SKILL.md` 中所有关于根包 push 策略的描述
4. 修改 `references/release-workflow-architecture.md`
5. 修改 `references/verification-matrix.md`
6. 视需要新增 `references/bumpp-push-and-remote-tag-troubleshooting.md`
7. 用一个最小示例 monorepo 手工演练一次：
   - 串行模式
   - 单独 `release:bumpp` 模式
8. 回填技能版本号和变更摘要

## 验收标准

完成后，应满足以下条件：

### 文档与模板验收

- 全技能目录中不再把 `push: false` 写成默认生效配置
- 全技能目录中不再出现 `BUMPP_PUSH`
- `package-scripts` 模板明确包含 `release:bumpp`
- `release:root` 明确使用 `--no-push`
- `release:bumpp` 明确使用 `--push`

### 行为验收

使用技能模板落地一个测试仓库后：

1. 运行串行主链路：

```bash
pnpm run release
```

应表现为：

- `release:sub` 不推送
- `release:root` 不推送
- `git:push` 统一推送 tags

2. 单独运行：

```bash
pnpm run release:bumpp
```

应表现为：

- 本地产生 commit/tag
- tag 被直接推送到远程

3. 若使用预发布版本（例如 `v0.11.5-beta.1`），在远程 tag 存在时，`release.yaml` 应能被正常触发

## 可直接交给下一个 AI 的执行口令

下面这段可以直接发给负责修改技能仓库的独立 AI：

> 请升级 `D:\code\ruan-cat\monorepo\ai-plugins\dev-skills\skills\init-release-base-relizy-and-bumpp` 技能。  
> 目标是把根包 `bumpp` 的 push 策略从配置文件固定值，升级为官方 CLI 参数控制。  
> 具体要求：
>
> 1. `templates/bump.config.ts` 中删除生效中的 `push: false`，改为注释说明：`bump.config.ts` 可能单独使用，也可能被串行命令复用，因此 push 必须通过 `--push / --no-push` 在命令行中控制。
> 2. `templates/package-scripts.md` 中将根包脚本改为：`release:root = bumpp --no-push --yes --release patch`，`release:bumpp = bumpp --push`。
> 3. `SKILL.md` 中所有关于根包 push 策略、scripts 模板、验证命令、核心决策的文字，全部同步到上述新口径。
> 4. `references/release-workflow-architecture.md` 和 `references/verification-matrix.md` 增加“远程 tag 缺失会导致工作流未触发”的排障说明。
> 5. 全目录内不得引入 `BUMPP_PUSH` 等自定义环境变量协议。
> 6. 将技能版本从 `2.0.0` 升到 `2.1.0`。
> 7. 完成后输出修改文件清单、关键 diff 摘要、以及一份最小验收清单。

## 结论

这次在 `11comm` 的实践，已经证明原技能的“`push: false` 固定模板”存在边界问题。  
下一步应该把这次经验回灌到全局技能中，形成统一、官方、可复用的 `bumpp` push 策略基线，避免后续仓库重复踩坑。
