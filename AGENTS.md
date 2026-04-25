# AI Collaboration Guide

## Purpose

This file tells any AI agent how to understand and continue work on this project with minimal context loss.

If you are a new agent entering this repository, read this file first, then read the linked project documents before making meaningful changes.

## Project Snapshot

- Project: WeChat mini game `穿书模拟器`
- Current playable slice: one palace-intrigue storybook
- Runtime: Canvas 2D, CommonJS, WeChat mini game environment
- Current state: playable vertical slice exists, but story depth, interaction polish, scoring feel, and sharing experience still need iteration

## Read Order

Before planning, editing, or proposing major changes, read in this order:

1. [README.md](/Users/xwx/MyProjects/ghost-book-game/README.md)
2. [docs/README.md](/Users/xwx/MyProjects/ghost-book-game/docs/README.md)
3. [docs/plans/2026-04-22-project-roadmap.md](/Users/xwx/MyProjects/ghost-book-game/docs/plans/2026-04-22-project-roadmap.md)
4. [docs/skills/iteration-log.md](/Users/xwx/MyProjects/ghost-book-game/docs/skills/iteration-log.md)
5. Relevant spec and skill docs for the task you are handling

## Source Of Truth

Use these documents as the current project truth:

- high-level project status and collaboration rules:
  [README.md](/Users/xwx/MyProjects/ghost-book-game/README.md)
- progress, phases, backlog:
  [docs/plans/2026-04-22-project-roadmap.md](/Users/xwx/MyProjects/ghost-book-game/docs/plans/2026-04-22-project-roadmap.md)
- what has already been decided or changed:
  [docs/skills/iteration-log.md](/Users/xwx/MyProjects/ghost-book-game/docs/skills/iteration-log.md)
- story system and writing rules:
  [docs/specs/2026-04-22-story-system-v1.md](/Users/xwx/MyProjects/ghost-book-game/docs/specs/2026-04-22-story-system-v1.md)
  [docs/specs/2026-04-22-story-writing-template-v1.md](/Users/xwx/MyProjects/ghost-book-game/docs/specs/2026-04-22-story-writing-template-v1.md)
  [docs/specs/2026-04-22-story-writing-checklist.md](/Users/xwx/MyProjects/ghost-book-game/docs/specs/2026-04-22-story-writing-checklist.md)

## Mandatory Documentation Rule

Any meaningful project communication or project change should also update the project documentation.

This includes:

- direction changes
- new priorities
- gameplay goals
- story production rules
- architectural changes
- new runtime capabilities
- major UX findings from playtesting
- new backlog items

If you change the project in a way another AI would need to know, update the relevant docs in the same turn whenever feasible.

## Minimum Required Doc Sync

When work changes project state, update at least one of:

- `README.md` for major project-level status or direction changes
- `docs/plans/2026-04-22-project-roadmap.md` for phase/progress/backlog updates
- `docs/skills/iteration-log.md` for implementation progress and new operating rules

Also update domain-specific docs when relevant:

- writing/system changes:
  `docs/specs/*.md`
- workflow/template changes:
  `docs/skills/*.md`

## Current Product Priorities

The next iterations should strongly emphasize:

- better script detail and narrative continuity
- better interaction detail and response feel
- stronger positive feedback during play
- stronger “爽点” and payoff moments
- stronger sharing desire after a run
- better share-card/share-image design
- support for character or event illustration during the story flow

These are not optional polish items. Treat them as core product priorities.

## Current Technical Priorities

- keep the palace story fully playable in WeChat DevTools
- maintain no dead nodes and no broken flow
- continue validating structure with `node scripts/verify-book.js`
- improve branch variety without making the graph unmaintainable
- keep story changes aligned with the writing templates and checklists

## Working Norms

- Do not treat the repo as code-only; this is a product plus narrative system project
- Prefer updating the template and rule docs when recurring patterns emerge
- When tuning story content, consider both content quality and template quality
- When tuning scores, check distribution, not just single-case feel
- When adding branches, verify they are actually reachable in simulation
