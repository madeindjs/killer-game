---
name: conventional-commits
description: Enforces Conventional Commits and automatic workspace patch version bumping for the killer-game monorepo. Activate whenever staging, writing commit messages, or committing changes.
---

# Conventional Commits + Workspace Versioning

## Scopes

Use the workspace name as the commit scope:

- `api` — Node.js / Express / Knex backend
- `frontend` — Next.js / React frontend
- `client` — shared client utilities (the "lib")
- `types` — shared TypeScript types
- `root` — repository-level files (root `package.json`, Docker files, CI, docs, etc.)

## Allowed commit types

`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

## Version bump rule

Every commit that changes files inside a workspace must bump that workspace's `version` field in its `package.json`:

- **patch** — `fix`, `perf`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `chore`, `revert` (default)
- **minor** — `feat`
- **major** — breaking changes, indicated by `type(scope)!:` or a `BREAKING CHANGE:` footer

If a commit touches multiple workspaces, bump each touched workspace. If a commit touches no workspace, bump the root `package.json` version.

## Commit message format

```text
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

## Workflow before every commit

1. Stage the changes you intend to commit.
2. Run the version bump helper from the project root, passing the commit type:
   ```bash
   node .pi/skills/conventional-commits/scripts/bump-versions.js --type=fix
   ```
3. The helper bumps the touched workspace(s) and automatically stages the updated `package.json` files.
4. Compose and run the conventional commit, e.g.:
   ```bash
   git commit -m "fix(api): correct player elimination logic"
   ```

## Examples

```text
feat(frontend): add player avatar upload
fix(api): prevent duplicate target assignment
chore(client): extract shared fetch helper
docs(types): document game event payloads
ci(root): add GitHub Actions test workflow
```

## Breaking changes

Use `feat(api)!: rewrite auth flow` or add a `BREAKING CHANGE:` footer. The helper bumps the relevant workspace(s) with `--type=major` when a breaking change is detected.
