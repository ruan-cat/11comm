# 2026-07-09 11comm-app-h5 Vercel 根配置污染事故报告

## 1. 结论

`11comm-app-h5` 的集中部署失败不是长期环境不可用，而是 2026-07-09 对 Vercel 构建与输出目录配置连续试错引入的配置污染事故。

真正的问题不是“`dist`、`.vercel/output/static`、`apps/admin/dist` 哪个字符串更像正确目录”，而是把 monorepo 子项目专属的 Vercel 配置写进仓库根目录或子目录 `vercel.json`，导致 Vercel Project Settings、仓库根配置和应用目录配置互相覆盖。

最终恢复动作是 commit [`2707fcfd2acf0ff0948195b342470861ef395366`](https://github.com/ruan-cat/11comm/commit/2707fcfd2acf0ff0948195b342470861ef395366) 删除根目录 `vercel.json`：

```log
vercel.json | 3 ---

-{
-    "outputDirectory": "apps/admin/dist"
-}
```

这个文件把 admin 项目的输出目录写到了 monorepo 根目录。对同仓库绑定的 `11comm-app-h5` 来说，它是跨项目污染源。

## 2. 证据来源

- Vercel MCP：`list_projects`、`get_project`、`list_deployments`、`get_deployment`、`get_deployment_build_logs`
- Git：本地仓库 `D:\code\ruan-cat\01s-11comm`，分支 `dev`；用于对照恢复动作的提交为 `2707fcfd2acf0ff0948195b342470861ef395366`
- GitHub：[`ruan-cat/11comm` commit 2707fcfd](https://github.com/ruan-cat/11comm/commit/2707fcfd2acf0ff0948195b342470861ef395366)
- Vercel 官方文档：
  - [Static Configuration with vercel.json](https://vercel.com/docs/project-configuration/vercel-json)
  - [Configuring a Build](https://vercel.com/docs/builds/configure-a-build)
  - [Using Monorepos](https://vercel.com/docs/monorepos)
  - [Deploying Turborepo to Vercel](https://vercel.com/docs/monorepos/turborepo)

事实边界：

- MCP 证实了项目身份、部署列表、部署状态、部署日志和恢复部署：`11comm-app-h5` Project ID 为 `prj_LCXbBKhjv5chZN2qFtFZ12nbZBLj`，team 为 `team_cUeGw4TtOCLp0bbuH8kA7BYH`，恢复部署为 `dpl_3B36tA9xVFnCyenrcuke9wbCymN7`。
- MCP `get_project` 本次没有返回 `rootDirectory`、`buildCommand`、`outputDirectory` 原始云端字段；本文不把这些字段说成从 `get_project` 直接读取。
- “根 `vercel.json` 覆盖并污染 app H5 输出目录”是基于 Vercel 官方配置规则、失败/恢复日志和 commit diff 得出的推断，不是 `get_project` 直接返回的字段结论。

## 3. Vercel 部署历史检索结果

Vercel MCP 返回 `11comm-app-h5` 项目 48 条生产部署记录：

| 范围         | 结果                                                                                                     |
| :----------- | :------------------------------------------------------------------------------------------------------- |
| 最早返回记录 | 2026-05-14 03:50:20 +08:00，`READY`                                                                      |
| 集中失败窗口 | 2026-07-09 02:57:57 +08:00 到 2026-07-09 16:21:34 +08:00                                                 |
| 最新恢复记录 | 2026-07-09 16:36:17 +08:00，`READY`，deployment `dpl_3B36tA9xVFnCyenrcuke9wbCymN7`，commit `2707fcfd...` |
| 总数         | 48 条                                                                                                    |
| `READY`      | 35 条                                                                                                    |
| `ERROR`      | 13 条                                                                                                    |

关键结论：13 条 `ERROR` 全部集中在 2026-07-09 的配置试错窗口。失败主要包括 lockfile outdated、根 `vercel.json` schema 不允许 `projects`，以及 `STATIC_BUILD_NO_OUT_DIR` / `No Output Directory named "dist" found`。此前返回的历史部署均为 `READY`，因此这不是 Vercel 平台长期不可用、依赖长期不可安装或代码长期不可构建的问题。

## 4. 关键时间线

| 时间（+08:00）      | commit     | 部署状态 | 关键动作                                                                  |
| :------------------ | :--------- | :------- | :------------------------------------------------------------------------ |
| 2026-07-09 02:53:24 | `8f45d611` | `READY`  | 简化 admin Vercel 配置，移除 `rootDirectory`                              |
| 2026-07-09 02:57:57 | `43e91676` | `ERROR`  | 为 admin 添加 `turbo`，删除 `apps/admin/vercel.json`，但 app 项目部署失败 |
| 2026-07-09 03:40:21 | `9865e56f` | `ERROR`  | 添加根目录 `vercel.json`，试图用 `projects` 配置 admin 输出目录           |
| 2026-07-09 03:45:39 | `d9f6d243` | `ERROR`  | 根目录 `vercel.json` 改为 `outputDirectory: apps/admin/dist`              |
| 2026-07-09 13:13:53 | `2e499c23` | `ERROR`  | 添加 `apps/app/vercel.json`，输出目录写 `.vercel/output/static`           |
| 2026-07-09 13:28:28 | `2a4ee28e` | `ERROR`  | app 输出目录改为 `dist/build/h5`                                          |
| 2026-07-09 13:45:28 | `572a20dc` | `ERROR`  | app 输出目录改为 `dist`                                                   |
| 2026-07-09 13:48:06 | `b98d64e7` | `ERROR`  | 删除 `apps/app/vercel.json`，但根目录 `vercel.json` 仍存在                |
| 2026-07-09 16:21:34 | `6c507765` | `ERROR`  | 同步 lockfile，部署仍找错输出目录                                         |
| 2026-07-09 16:35:58 | `2707fcfd` | `READY`  | 删除根目录 `vercel.json`，部署恢复                                        |

这条时间线说明：配置试错的方向一直围绕 `vercel.json` 和 Output Directory 打转。最终有效动作不是继续改 `vercel.json`，而是删除不该存在的本地 Vercel 静态配置。

## 5. 失败日志与恢复日志

最后一次失败部署 `dpl_HDnBPRDY7DxaESf9Tsi3TzVUyEAm` 的核心日志：

```log
$ pnpm -F=@01s-11comm/app build:vercel
$ turbo move-vercel-output-to-root
WARNING  finished with warnings
Error: No Output Directory named "dist" found after the Build completed.
Configure the Output Directory in your Project Settings.
Alternatively, configure vercel.json#outputDirectory.
```

恢复部署 `dpl_3B36tA9xVFnCyenrcuke9wbCymN7` 的核心日志：

```log
$ pnpm -F=@01s-11comm/app build:vercel
$ turbo move-vercel-output-to-root
@01s-11comm/app:move-vercel-output-to-root:
$ move-vercel-output-to-root --source-dir dist/build/h5 --target-dir .vercel/output
[success] 已将 /vercel/path0/apps/app/dist/build/h5 搬运到 /vercel/path0/.vercel/output
Build Completed in /vercel/output [44s]
Deployment completed
```

对比可见，app H5 的实际产物链路是 `apps/app/dist/build/h5` 搬运到 monorepo 根 `.vercel/output`，而不是让 Vercel 去找 `dist` 或 `apps/admin/dist`。

## 6. 错误配置文件情况

历史错误配置体现了同一个错误思路：用仓库内 `vercel.json` 解决某个 Vercel Project 的专属配置。

### 根目录 `vercel.json`

commit `9865e56f8f310f468d1660d1760bf8ff25205e59` 曾添加：

```json
{
	"projects": [
		{
			"path": "apps/admin",
			"outputDirectory": "apps/admin/dist"
		}
	]
}
```

commit `d9f6d243f36f4c91654d993d2c68e5baf2bd7b74` 又改成：

```json
{
	"outputDirectory": "apps/admin/dist"
}
```

这个配置位于 monorepo 根目录，却写的是 admin 的输出目录。只要 `11comm-app-h5`、`11comm-admin`、`11comm-nitro-server` 任一 Vercel Project 以仓库根目录作为项目根，它就会成为项目级覆盖项。

### app 子目录 `vercel.json`

commit `2e499c23cd6d22f2b2c8903c1fdb276597a6d1bd` 曾添加：

```json
{
	"buildCommand": "pnpm -F=@01s-11comm/app run build:h5:prod",
	"outputDirectory": ".vercel/output/static"
}
```

commit `572a20dc715a3c0c065a599783d517609b23569b` 时该文件变成：

```json
{
	"buildCommand": "pnpm -F=@01s-11comm/app run build:h5:prod",
	"outputDirectory": "dist"
}
```

这里的 `build:h5:prod` 是子包内部生产构建步骤，不是当前 `11comm-app-h5` Vercel Project 的直接入口。当前云端 Build Command 应为根入口 `pnpm run build:vercel:app`，由它调用子包 `build:vercel` 并搬运 `.vercel/output`。

commit `b98d64e7ebfd0d8c0da8dac8f034403e08f2bfc2` 删除了这个文件，但根目录 `vercel.json` 仍存在，配置污染还没有完全解除。

## 7. 官方文档规则

Vercel 官方文档给出的规则可以直接解释这次事故：

- `vercel.json` 是项目根目录内的静态配置文件，用来覆盖 Vercel 默认行为。
- `vercel.json` 的 `buildCommand`、`installCommand`、`outputDirectory`、`framework` 等字段会覆盖对应 Project Settings。
- Project Settings 也维护 Build Command、Install Command、Framework Preset、Output Directory 等字段。
- Root Directory 是 monorepo 项目根/范围判断关键。
- Build & Development Settings 中的 Output Directory 决定 Vercel 从哪里读取构建产物作为静态资源。
- monorepo 官方模型是：同一仓库中每个可部署目录分别导入为一个 Vercel Project，并为各自项目选择 Root Directory。
- Turborepo 文档说可手动配置 Dashboard，或在“application directory”中配置 `vercel.json`；这不等于可以在 monorepo 根目录写某个子项目的输出目录。

由这些规则推出：`11comm-app-h5`、`11comm-admin`、`11comm-nitro-server` 这种同仓库多项目部署，项目专属配置应放在各自 Vercel 云端 Project Settings。仓库根目录 `vercel.json` 不是隔离配置，它是共享污染面。

## 8. 正确部署口径

`11comm-app-h5` 的正确口径：

| 项               | 值                                                                  |
| :--------------- | :------------------------------------------------------------------ |
| Vercel Project   | `11comm-app-h5`                                                     |
| Framework Preset | `Other`                                                             |
| Root Directory   | 云端 Project Settings 维护的项目范围，不通过仓库 `vercel.json` 反写 |
| Build Command    | `pnpm run build:vercel:app`                                         |
| Output Directory | `.vercel/output`                                                    |
| Install Command  | `ls -A && pnpm install` 或云端确认后的等价命令                      |

`build:vercel:app` 的链路来自根 `package.json` 与 `apps/app/package.json`：根 `build:vercel:app` -> `pnpm -F=@01s-11comm/app build:vercel` -> app `turbo move-vercel-output-to-root` -> `move-vercel-output-to-root --source-dir dist/build/h5 --target-dir .vercel/output`。成功日志显示产物搬运到 `/vercel/path0/.vercel/output`，并以 `Build Completed in /vercel/output` 完成。

## 9. 防误读：app 事故与 admin 修复不是同一层问题

这次 app H5 事故容易被读反：删除根目录 `vercel.json`，不是说 admin 项目可以直接让 Vercel 读取 `apps/admin/dist`，也不是说 admin 不再需要 `.vercel/output` 搬运。

两条约束必须同时成立：

| 约束                             | 正确理解                                                                                                                     |
| :------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| 仓库内禁止 `vercel.json`         | 不用根目录或子目录配置文件表达某个 Vercel Project 的专属设置，避免污染同仓库其他 Project                                     |
| 子包保留 `build:vercel` 搬运链路 | 子包仍然可以通过 `package.json` 脚本生成 Vercel 需要的 `.vercel/output`，但云端入口和 Output Directory 放在 Project Settings |

admin 后续修复 commit `d1c5b6f5c9d7458a14e73804adf7b0f9a6c85324` 体现的是第二条约束：

```plain
pnpm run build:vercel:admin
-> pnpm -F=@01s-11comm/admin build:vercel
-> turbo move-vercel-output-to-root
-> build:prod 生成 apps/admin/dist
-> move-vercel-output-to-root --source-dir dist --target-dir .vercel/output
```

所以后续排查 admin/app/api 的 Vercel 问题时，不要在两个错误极端之间摆动：

- 错误极端 A：继续新增或恢复仓库 `vercel.json`。
- 错误极端 B：误以为删掉 `vercel.json` 后，子包就不需要 `build:vercel` 和 `.vercel/output`。

正确做法是：Project Settings 管云端入口与输出目录，子包脚本管自己的构建与产物搬运，README 只记录云端期望值。

## 10. 经验教训

1. monorepo 子项目部署时，先确认 Vercel Project 的隔离边界，再决定配置落点。
2. 不要用仓库根 `vercel.json` 表达某个子项目的专属 Output Directory。
3. 同一 Git 仓库绑定多个 Vercel Projects 时，根目录配置会被多个项目共享读取，是高风险配置面。
4. `No Output Directory named ... found` 的第一反应不应是继续换目录名，而应是检查 Project Settings、根 `vercel.json`、子目录 `vercel.json` 三者的覆盖关系。
5. 对 11comm 这类 pnpm workspace，Root Directory、Build Command、Output Directory、Install Command、Ignored Build Step 和环境变量应优先维护在 Vercel 云端 Project Settings，并在 README 中记录云端应有值。
6. 每次 Vercel 事故复盘必须同时看部署历史、失败日志、Git diff 和官方文档。只看某一次失败日志会导致继续在错误抽象层调参。
7. 删除错误配置文件和保留正确构建脚本不是矛盾动作。前者解决配置污染，后者解决 Vercel Build Output 产物落点。

## 11. 复核命令清单

后续有人改 Vercel 部署配置时，至少用下面几组命令复核，不要只看截图或 commit message：

```bash
# 1. 确认仓库内没有任何 vercel.json
rg --files -g "vercel.json"

# 2. 复核恢复动作：2707fcfd 只删除根目录 vercel.json
git show --stat --name-status 2707fcfd2acf0ff0948195b342470861ef395366

# 3. 复核 admin 后续修复动作：Vercel 入口改为 build:vercel，保留 .vercel/output 搬运
git show --stat --name-status d1c5b6f5c9d7458a14e73804adf7b0f9a6c85324

# 4. 复核当前脚本链路
rg -n "build:vercel:admin|build:vercel:app|move-vercel-output-to-root|\\.vercel/output" package.json apps/admin/package.json apps/admin/turbo.json apps/app/package.json apps/app/turbo.json
```

如果第 1 条命令输出了任何文件路径，优先停下来审查配置污染风险；不要继续猜 Output Directory 字符串。

## 12. 后续约束

- 禁止在 `ruan-cat/11comm` monorepo 根目录新增 `vercel.json`。
- 当前仓库不应存在任何 `vercel.json`；子项目专属配置放 Vercel 云端 Project Settings。
- 各子项目 README 只记录云端 Project Settings 的期望值，不把这些值落成仓库内 `vercel.json`。
- 如果旧模板或旧技能表把 `11comm-app-h5` 写成直接 Output Directory `apps/app/dist/build/h5`，不要照搬；当前仓库以 Vercel 成功日志和 `package.json` 脚本链路为准，即 `pnpm run build:vercel:app` 搬运到 `.vercel/output`。
- 如果旧文档把 `11comm-admin` 写成直接 Output Directory `apps/admin/dist`，也不要照搬；当前 admin 云端入口应走 `pnpm run build:vercel:admin`，并由子包脚本搬运到 `.vercel/output`。
- 修改 Vercel 配置后，用 Vercel MCP 检查部署历史和构建日志，不用截图或 commit message 代替验证。
- 如果未来再次出现 Output Directory 错误，先回滚或删除仓库内 Vercel 静态配置，再核对云端 Project Settings。
