#!/bin/bash

input=$(cat)

# ---- 颜色 ----
use_color=1
[ -n "$NO_COLOR" ] && use_color=0

C() { [ "$use_color" -eq 1 ] && printf '\033[%sm' "$1"; }
RST() { [ "$use_color" -eq 1 ] && printf '\033[0m'; }

# ---- 提取基本信息 ----
HAS_JQ=0
command -v jq >/dev/null 2>&1 && HAS_JQ=1

if [ "$HAS_JQ" -eq 1 ]; then
  current_dir=$(echo "$input" | jq -r '.workspace.current_dir // .cwd // "unknown"' 2>/dev/null | sed "s|^$HOME|~|g")
  model_name=$(echo "$input" | jq -r '.model.display_name // "Claude"' 2>/dev/null)
  cc_version=$(echo "$input" | jq -r '.version // ""' 2>/dev/null)
else
  current_dir=$(echo "$input" | grep -o '"cwd"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"cwd"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/' | sed 's|\\\\|/|g' | head -1)
  [ -z "$current_dir" ] && current_dir="unknown"
  current_dir=$(echo "$current_dir" | sed "s|^$HOME|~|g")

  model_name=$(echo "$input" | grep -o '"display_name"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"display_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/' | head -1)
  [ -z "$model_name" ] && model_name="Claude"

  cc_version=$(echo "$input" | grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
fi

# ---- Git 分支 ----
git_branch=""
if git rev-parse --git-dir >/dev/null 2>&1; then
  git_branch=$(git branch --show-current 2>/dev/null || git rev-parse --short HEAD 2>/dev/null)
fi

# ---- 上下文窗口比例 ----
get_max_context() {
  case "$1" in
    *"Opus"*) echo "200000" ;;
    *"Sonnet"*) echo "200000" ;;
    *"Haiku 3.5"*|*"haiku 3.5"*) echo "200000" ;;
    *"Haiku"*|*"haiku"*) echo "100000" ;;
    *) echo "200000" ;;
  esac
}

context_pct=""
context_color() { [ "$use_color" -eq 1 ] && printf '\033[38;5;158m'; }

# 查找最新的 session 文件并提取 input_tokens
latest_session=$(find "$HOME/.claude" -name "*.jsonl" -type f 2>/dev/null | sort -r | head -1)
if [ -n "$latest_session" ] && [ -f "$latest_session" ]; then
  MAX_CONTEXT=$(get_max_context "$model_name")

  if [ "$HAS_JQ" -eq 1 ]; then
    input_tokens=$(tail -30 "$latest_session" 2>/dev/null | jq -r 'select(.message.usage?.input_tokens) | .message.usage.input_tokens' 2>/dev/null | head -1)
  else
    input_tokens=$(tail -30 "$latest_session" 2>/dev/null | grep -o '"input_tokens":[0-9]*' | head -1 | grep -o '[0-9]*')
  fi

  if [ -n "$input_tokens" ] && [ "$input_tokens" -gt 0 ] 2>/dev/null; then
    remaining=$((MAX_CONTEXT - input_tokens))
    pct=$(( remaining * 100 / MAX_CONTEXT ))
    [ "$pct" -lt 0 ] && pct=0
    [ "$pct" -gt 100 ] && pct=100

    if [ "$pct" -le 20 ]; then
      context_color() { [ "$use_color" -eq 1 ] && printf '\033[38;5;203m'; }
    elif [ "$pct" -le 40 ]; then
      context_color() { [ "$use_color" -eq 1 ] && printf '\033[38;5;215m'; }
    else
      context_color() { [ "$use_color" -eq 1 ] && printf '\033[38;5;158m'; }
    fi

    context_pct="${pct}%"
  fi
fi

[ -z "$context_pct" ] && context_pct="N/A"

# ---- 输出状态行 ----
C='\033[38;5;117m'   # 目录 - 天蓝色
G='\033[38;5;150m'   # Git - 柔和绿
M='\033[38;5;147m'   # 模型 - 浅紫色
V='\033[38;5;249m'   # 版本 - 浅灰色

if [ "$use_color" -eq 1 ]; then
  printf "${C}%s${RST}" "$current_dir"
  [ -n "$git_branch" ] && printf "  ${G}%s${RST}" "🌿 $git_branch"
  printf "  ${M}%s${RST}" "🤖 $model_name"
  [ -n "$cc_version" ] && printf "  ${V}%s${RST}" "v $cc_version"
  printf "  $(context_color)%s${RST}" "🧠 $context_pct"
else
  printf "%s" "$current_dir"
  [ -n "$git_branch" ] && printf "  %s" "$git_branch"
  printf "  %s" "$model_name"
  [ -n "$cc_version" ] && printf "  %s" "$cc_version"
  printf "  %s" "$context_pct"
fi

printf '\n'
