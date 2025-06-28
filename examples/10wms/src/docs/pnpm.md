# 包管理器 pnpm

我们项目使用的包管理器，默认使用 npm，而不是 pnpm。

在我们项目的 [`0.3.0`](../CHANGELOG.md#030) 版本之前，我们是默认推荐用 pnpm 来启动前端项目的。但是随着开发的进行，我们发现 pnpm 在大家的电脑上有很多 bug。为了稳定有效，我们前端组不再推荐你默认用 pnpm 来运行本项目。

## 准备 pnpm 包管理器

本项目原本有内置的脚本帮助你安装 pnpm，按理说你并不需要手动去安装 pnpm。但是我们关闭了该功能。

如果你想在本项目使用 pnpm，请依次运行以下两条命令。

```bash
corepack enable
corepack prepare pnpm@9.5.0 --activate
```

运行效果如下：

::: details 用 corepack 安装 pnpm

![2025-02-26-16-33-57](https://gh-img-store.ruan-cat.com/01s-docs/10wms/2025-02-26-16-33-57.png)

:::

## 包管理器配置与强约束

你也许注意到我们的包管理器配置仍旧是固定的 pnpm。

```json
{
	"packageManager": "pnpm@9.5.0"
}
```

你仍旧可以正常使用 npm，我们项目没有配置严格引擎校验。如果你使用的不是 pnpm，你可以忽略该字段。

## corepack 存在严重的 bug

我们目前的 node 版本使用的是低版本的 corepack，会导致你安装 pnpm 失败。[点此阅读详情](https://notes.ruan-cat.com/corepack/#安装与升级-pnpm)。

## win 专业版需要额外设置解除文件名限制

具体做法请[点此文章](https://notes.ruan-cat.com/bug/016-pnpm-filename-limit.html)。

## win11 家庭版不推荐继续使用 pnpm

win11 家庭版无法有效地在策略组里面设置`启用NTFS长路径`策略，你安装的依赖很有可能会出现文件名长度超限的情况。

你可以缩减项目根目录的文件名长度，尽可能减少长度，不超过 255 的限制。

这毕竟是缓兵之计，如果你是 win11 家庭版，我们建议你用 npm。

或者将 win11 家庭版升级到 win11 专业版，然后再去设置策略组。
