# 2026-05-26 Windows CRLF 行尾与幽灵 modified 事故

## 1. 问题现象

某文件（例如 `apps/admin/src/views/login/utils/motion.ts`）在 `git status` 中反复显示为已修改，但 `git diff` 看起来每一行都变了、语义却完全相同；或出现 diff 为空但仍显示 modified 的循环。其他 monorepo 也可能出现同类现象。

## 2. 实际根因

索引中的 blob 为 LF（`i/lf`），工作区磁盘文件为 CRLF（`w/crlf`）。项目若长期缺少 `.gitattributes` 统一 `eol`，而全局 `core.autocrlf=false`，则 IDE、杀毒、历史 checkout 等可能把文件写成 CRLF。CRLF 与 LF 的物理字节数不同，stat 缓存难以稳定命中，Git 反复重检，表现为幽灵修改。

二次复发根因：即使 `.gitattributes` 和 `.editorconfig` 都已正确配置 `eol=lf`，如果 Prettier 的 `endOfLine` 设为 `"auto"`，Prettier 在 Windows 上仍会保留或引入 CRLF。同时若 `.vscode/settings.json` 缺少 `"files.eol": "\n"`，VSCode/Cursor 在 Windows 上默认使用 CRLF 打开文件，再由 `endOfLine: "auto"` 的 Prettier 保留 CRLF 行尾写回磁盘。

## 3. 关键误导点

`.gitattributes` 已存在且配置正确，容易误以为行尾配置已完善。实际上 `.gitattributes` 只管 Git clean/smudge 层，不管编辑器和格式化工具行为。`git diff` 输出为空也容易误导到权限、encoding、stat 缓存等方向，因为 `git diff` 默认做 text 归一化对比。

关键线索：`git ls-files --eol <路径>` 显示 `i/lf w/crlf` 即可确诊。不要用"三个 hash 一致"排除 CRLF，因为 `git hash-object` 默认按 `.gitattributes` 做 clean filter 归一化后计算 hash。

## 4. 有效修复

在仓库根新增 `.gitattributes`，对文本统一 `* text=auto eol=lf`；将 `prettier.config.mjs` 的 `endOfLine` 从 `"auto"` 改为 `"lf"`；在 `.vscode/settings.json` 添加 `"files.eol": "\n"`；对仍显示 `w/crlf` 的已跟踪文件将内容写回 LF；执行 `git add --renormalize .` 刷新索引与 stat 缓存；一次性提交所有归一化结果。

## 5. 验证方式

文件字节数与 `git cat-file -p <blob-hash>` 的字节数一致；`git status` 干净；`git update-index --refresh` 无 `needs update` 输出。

## 6. 后续约束

在 Windows 上遇到莫名多出的修改时，按优先级排查：`git ls-files --eol` 看工作区行尾；Prettier 的 `endOfLine` 是否为 `"lf"`；`.vscode/settings.json` 是否有 `"files.eol": "\n"`；`.gitattributes` 是否存在 `eol=lf`。四层配置必须协同一致，缺一层就可能复发。不要把此类问题先记成某 AI 误改，优先从行尾配置栈排查。
