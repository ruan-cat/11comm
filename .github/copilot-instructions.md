# Memorix - Automatic Memory Rules

You have access to Memorix memory tools. Follow these repository-level rules to maintain persistent context across sessions.

## RULE 1: Session Start - Load Context

At the beginning of every conversation, before implementation work:

1. If available, call `memorix_session_start` to load the previous session summary and key memories.
2. Call `memorix_search` with a query related to the user's first message, the current workspace, or the current task.
3. If the current toolset provides a detail/timeline reader, fetch the most relevant search results before making decisions.
4. Reference relevant memories naturally when they affect the current work.

If `memorix_session_start` is not exposed in the current session, do not block on it. Use the available Memorix search/read tools and treat missing tools as an environment limitation.

## RULE 2: Store Important Context

Proactively call `memorix_store` when any of the following happen:

- Architecture or design decision made: type `decision`
- Bug identified and fixed: type `problem-solution`
- Unexpected behavior or gotcha discovered: type `gotcha`
- Configuration changed, including environment variables, ports, dependencies, or repository tooling: type `what-changed`
- File created or significantly modified in a way future agents should know about: type `what-changed`
- Feature completed or milestone reached: type `what-changed`
- Trade-off discussed with a conclusion: type `trade-off`

Do not record simple file reads, greetings, or trivial commands that do not change state or reveal useful findings.

## RULE 3: Use Stable Topics And Progress

For decisions, architecture notes, task handoffs, or recurring repository topics, include `topicKey` so later stores update the same memory instead of creating duplicates.

Use the `progress` parameter for active work:

```json
{
	"progress": {
		"feature": "root .github documentation/template integration",
		"status": "in-progress",
		"completion": 60
	}
}
```

Status values are `in-progress`, `completed`, and `blocked`.

## RULE 4: Resolve Completed Or Outdated Memories

When a task is completed, a bug is fixed, or previously relevant information becomes outdated:

1. Call `memorix_resolve` with the observation IDs that are no longer active.
2. Prefer resolving completed task memories so future searches do not surface stale blockers.

If no concrete observation IDs are available, skip resolving rather than guessing.

## RULE 5: Session End - Store Decision Chain Summary

When the conversation is ending, store a concise decision chain summary with type `session-request` and `topicKey: "session/latest-summary"`.

Use this structure:

```plain
## Goal
[Specific goal of the session]

## Key Decisions & Reasoning
- Chose X because Y. Rejected Z because [reason].

## What Changed
- [File path] - [what changed and why]

## Current State
- [What works now, what remains pending]

## Next Steps
- [Concrete follow-up actions, if any]
```

The "Key Decisions & Reasoning" section is required when decisions were made. It prevents future agents from repeating settled analysis or proposing conflicting approaches.

## Guidelines

- Use concise titles and structured facts.
- Include file paths in `filesModified` when relevant.
- Include related concepts for better searchability.
- Prefer project-scoped memories for this 11comm monorepo.
- Search normally uses active memories; use all-status search only when investigating resolved history.
