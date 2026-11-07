# 2026-07-09 Vercel monorepo 根目录配置污染子项目部署

## 1. 问题现象

`ruan-cat/11comm` 的 Vercel 云项目 `11comm-app-h5` 在 2026-07-09 出现集中部署失败。项目 ID 为 `prj_LCXbBKhjv5chZN2qFtFZ12nbZBLj`，team 为 `team_cUeGw4TtOCLp0bbuH8kA7BYH`。Vercel MCP 返回的 48 条生产部署记录中，35 条 `READY`、13 条 `ERROR`；commit `2707fcfd2acf0ff0948195b342470861ef395366` 删除仓库根目录 `vercel.json` 后，恢复部署 `dpl_3B36tA9xVFnCyenrcuke9wbCymN7` 为 `READY`。

## 2. 实际根因

这是 monorepo 子项目部署被仓库级 Vercel 静态配置污染的问题。

`11comm-app-h5` 的正确产物链路是：

```text
pnpm run build:vercel:app
-> pnpm -F=@01s-11comm/app build:vercel
-> move-vercel-output-to-root --source-dir dist/build/h5 --target-dir .vercel/output
-> Vercel 部署根目录 .vercel/output
```

但历史提交把项目专属配置写进了仓库根目录或子项目目录的 `vercel.json`。最终被删除的根目录 `vercel.json` 内容是：

```json
{
	"outputDirectory": "apps/admin/dist"
}
```

这个值属于 admin 项目，不属于 app H5 项目。按照 Vercel 官方文档，项目根目录的 `vercel.json` 可配置或覆盖 `buildCommand`、`installCommand`、`framework`、`outputDirectory` 等字段；Project Settings 也维护这些字段；Root Directory 决定 monorepo 项目的根/范围；Output Directory 决定 Vercel 到哪里取产物。由这些规则、Git diff 和部署日志可推断：monorepo 同一仓库连接多个 Vercel Projects 时，根目录配置会成为跨项目污染源。注意：MCP `get_project` 本次没有返回 `rootDirectory`、`buildCommand`、`outputDirectory` 原始云端字段，不能声称这些字段是从 `get_project` 直接读到的。

## 3. 关键误导点

- 错误假设：把 monorepo 子项目的 Vercel 配置当成仓库内配置文件问题来修，反复新增或修改 `vercel.json`。
- 错误假设：以为 `vercel.json` 放在根目录能表达“只配置某个子项目”。实际上根目录文件会被以仓库根为项目根的 Vercel Project 读取并覆盖项目设置。
- 强误导信号：失败日志包括 lockfile outdated、根 `vercel.json` schema 不允许 `projects`，以及 `STATIC_BUILD_NO_OUT_DIR` / `No Output Directory named "dist" found`。这些信号容易让人继续猜 `dist`、`.vercel/output/static`、`apps/admin/dist` 哪个目录对，而不是先检查“谁在覆盖 Output Directory”。
- 事故模式：先为 admin 写根目录配置，再让 app 项目共享同一个仓库根，导致 app 的构建产物链路和发布目录口径漂移。
- 反向误读风险：删除仓库 `vercel.json` 不是否定子包 `build:vercel` 和 `.vercel/output`。正确边界是“云端 Project Settings 管入口和输出目录，子包脚本管构建和产物搬运”。

## 4. 有效修复

有效修复不是继续调整 `vercel.json`，而是删除不应存在的仓库内 Vercel 配置文件，并让每个云项目使用自己的 Project Settings：

- commit `b98d64e7ebfd0d8c0da8dac8f034403e08f2bfc2` 删除 `apps/app/vercel.json`，停止用 app 子目录文件覆盖构建命令和输出目录。
- commit `2707fcfd2acf0ff0948195b342470861ef395366` 删除根目录 `vercel.json`，移除 `apps/admin/dist` 对同仓库其他 Vercel 项目的污染。
- `11comm-app-h5` 云端 Project Settings 期望值为：Build Command `pnpm run build:vercel:app`，Output Directory `.vercel/output`，Install Command `ls -A && pnpm install` 或项目确认后的等价命令。这些值只记录在 README / 事故记忆中，当前仓库不应存在任何 `vercel.json`。
- admin 后续修复 commit `d1c5b6f5c9d7458a14e73804adf7b0f9a6c85324` 体现了同一边界：根命令 `pnpm run build:vercel:admin` 调用子包 `build:vercel`，由 `turbo move-vercel-output-to-root` 先依赖 `build:prod` 生成 `apps/admin/dist`，再执行 `move-vercel-output-to-root --source-dir dist --target-dir .vercel/output`。这说明“禁用仓库 `vercel.json`”和“保留 `.vercel/output` 搬运链路”必须同时成立。

## 5. 验证方式

可信验证来自 Vercel MCP 和 Git：

```log
Vercel MCP list_deployments:
- 48 条 11comm-app-h5 生产部署记录
- 35 条 READY，13 条 ERROR
- 2026-07-09 的失败主要包括 lockfile outdated、根 vercel.json schema 不允许 projects、STATIC_BUILD_NO_OUT_DIR / No Output Directory named "dist" found
- commit 2707fcfd2acf0ff0948195b342470861ef395366 对应部署 dpl_3B36tA9xVFnCyenrcuke9wbCymN7，state=READY
```

```log
失败部署 dpl_HDnBPRDY7DxaESf9Tsi3TzVUyEAm:
$ pnpm -F=@01s-11comm/app build:vercel
$ turbo move-vercel-output-to-root
Error: No Output Directory named "dist" found after the Build completed.
```

```log
恢复部署 dpl_3B36tA9xVFnCyenrcuke9wbCymN7:
$ pnpm -F=@01s-11comm/app build:vercel
$ move-vercel-output-to-root --source-dir dist/build/h5 --target-dir .vercel/output
[success] 已将 /vercel/path0/apps/app/dist/build/h5 搬运到 /vercel/path0/.vercel/output
Build Completed in /vercel/output
Deployment completed
```

```log
git show 2707fcfd2acf0ff0948195b342470861ef395366:
D vercel.json
- {
-     "outputDirectory": "apps/admin/dist"
- }
```

## 6. 后续约束

- 处理 pnpm workspace monorepo 的 Vercel 部署时，先确认这是“一个仓库多个 Vercel Projects”，不要默认用仓库根 `vercel.json` 表达某个子项目的专属配置。
- Root Directory、Framework Preset、Build Command、Output Directory、Install Command、Ignored Build Step、环境变量等项目专属项，统一维护在 Vercel 云端 Project Settings；README 只记录期望值。
- 当前仓库不应存在任何 `vercel.json`。
- 看到 `No Output Directory named ... found` 时，不要先改目录字符串；先检查 Vercel Project Settings、仓库根 `vercel.json`、子目录 `vercel.json` 三者是否互相覆盖。
- 如果旧模板或旧技能表把 `11comm-app-h5` 写成直接 Output Directory `apps/app/dist/build/h5`，不要照搬；当前仓库以 Vercel 成功日志和 `package.json` 脚本链路为准，即 `pnpm run build:vercel:app` 搬运到 `.vercel/output`。
- 如果旧文档把 `11comm-admin` 写成直接 Output Directory `apps/admin/dist`，不要照搬；当前 admin 云端入口应走 `pnpm run build:vercel:admin`，并由子包脚本搬运到 `.vercel/output`。
- 事故复盘要同时看 Vercel 部署历史、失败构建日志、Git diff 和官方文档，不能只凭一次成功/失败猜根因。

## 7. 快速复核抓手

未来遇到同类 Vercel monorepo 部署问题，先跑下面几条命令，不要从 Output Directory 字符串开始猜：

```bash
# 仓库内不应存在任何 Vercel 静态配置文件
rg --files -g "vercel.json"

# 复核 app/admin/api 的云端入口脚本是否仍走 build:vercel 和 .vercel/output
rg -n "build:vercel:admin|build:vercel:app|build:vercel:api|move-vercel-output-to-root|\\.vercel/output" package.json apps/*/package.json apps/*/turbo.json

# 复核两个关键历史动作
git show --stat --name-status 2707fcfd2acf0ff0948195b342470861ef395366
git show --stat --name-status d1c5b6f5c9d7458a14e73804adf7b0f9a6c85324
```

如果第一条命令输出任何文件路径，优先审查配置污染风险；如果第二条命令缺少对应子项目的 `build:vercel` 或 `.vercel/output`，优先审查构建产物链路是否被误删。
