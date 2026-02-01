<!-- 有用 不删除 -->

# 2026-02-01 .claude/skills/commit-work 符号链接调查报告

## 1. 背景

在开发过程中，观察到 `.claude/skills/commit-work` 目录在 IDE 或文件管理器中显示为符号链接，但在 Claude Code CLI 环境中被检测为普通目录。本报告旨在记录调查过程、证据及分析结果，以便后续研读和处理。

## 2. 调查过程与证据

为了确认 `.claude/skills/commit-work` 的文件属性，我们在 Windows 环境下的 Claude Code CLI 中执行了多种检测命令。

### 2.1. Bash `ls -ld` 检测

执行命令：

```bash
ls -ld .claude/skills/commit-work
```

结果：

```text
drwxr-xr-x 1 pc 197121 0  2月  1 18:47 .claude/skills/commit-work/
```

**分析**：属性位为 `d`（directory），而非 `l`（link）。这通常表示普通目录。

### 2.2. Python 脚本检测

为了排除 Shell 别名或显示问题，使用 Python 的 `os` 模块进行底层检测。

执行命令：

```bash
python -c "import os; p='.claude/skills/commit-work'; print(f'Exists: {os.path.exists(p)}'); print(f'Is Link: {os.path.islink(p)}'); print(f'Real Path: {os.path.realpath(p)}')"
```

结果：

```text
Exists: True
Is Link: False
Real Path: D:\code\github-desktop-store\01s-11comm\.claude\skills\commit-work
```

**分析**：Python 明确返回 `Is Link: False`，且真实路径指向其自身，未指向其他位置。

### 2.3. PowerShell `Get-Item` 检测

使用 Windows 原生 PowerShell 命令检测。

执行命令：

```powershell
powershell -Command "Get-Item -Path .claude\skills\commit-work | Select-Object Name, LinkType, Target"
```

结果：

```text
Name        LinkType Target
----        -------- ------
commit-work          {}
```

**分析**：`LinkType` 为空，`Target` 为空。如果为符号链接或 Junction，这里通常会有显示（如 `SymbolicLink` 或 `Junction`）。

### 2.4. Git Status 状态

执行命令：

```bash
git status
```

结果片段：

```text
Untracked files:
	.agents/skills/commit-work/
	.claude/skills/commit-work/
```

**分析**：Git 将其识别为两个独立的 Untracked 目录。如果是软链接，Git 通常会将其显示为单个文件（link），或者如果是目录链接，行为可能会有所不同，但目前它们被视为两个实体。

## 3. 原因分析

尽管 CLI 环境检测为普通目录，但用户在 IDE 中观察到符号链接图标，可能存在以下原因：

1.  **环境隔离**：Claude Code 运行的 CLI 环境（可能是模拟的 Bash 或特定的虚拟环境）可能无法正确穿透或识别 Windows 的某些高级文件系统特性（如某些类型的 Reparse Points）。
2.  **曾经是链接**：可能在某个时刻它被创建为链接，但在之前的操作（如 `git checkout` 或手动复制）中被替换为了实体目录。
3.  **IDE 缓存或误判**：IDE 可能缓存了旧的文件系统状态，或者根据某些配置文件（如 `.gitattributes` 或项目配置）推断其应为链接，从而显示了链接图标。
4.  **实际为普通目录**：综合多种工具（Bash, Python, PowerShell）的检测结果，当前时刻在文件系统底层，该路径大概率确实是一个普通目录。

## 4. 结论

**当前状态**：在当前操作环境中，`.claude/skills/commit-work` **是一个普通目录**，而非符号链接。它包含实际的文件内容���且独立于 `.agents/skills/commit-work` 存在。

## 5. 后续建议

如果项目规范要求 `.claude/skills/` 下的内容应当是指向 `.agents/skills/` 的软链接（以保持单点维护），建议执行以下标准化操作：

1.  **备份**：确认 `.claude/skills/commit-work` 内无独有修改。
2.  **删除**：删除当前的 `.claude/skills/commit-work` 目录。
3.  **重建链接**：使用 `mklink /D` (Windows CMD) 或 `ln -s` (Bash) 重新创建指向 `.agents/skills/commit-work` 的符号链接。

```bash
# 示例修复命令（Windows CMD管理员权限）
rmdir /s /q .claude\skills\commit-work
mklink /D .claude\skills\commit-work ..\..\.agents\skills\commit-work
```
