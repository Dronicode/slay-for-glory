# Slay For Glory

Tabletop deckbuilding dungeon crawler rules and site content.

Live site: http://slayforglory.com/

## Project Layout

- `docs/`: published rules and site content
- `notes/`: design notes and working drafts
- `zensical.toml`: site build config

## Build and Run Locally

```bash
uv run zensical build --clean
uv run zensical serve
```

Build output is written to `site/` during CI and deployment.

## CI and Release Summary

- PR checks run on pull requests: Commit Lint, Validate Paths, Validate Build.
- Changes flow through `develop` -> `main` via auto PR and auto-merge.
- Semantic release runs on `main` with two independent release tracks:
  - content track (`content`, `rules`, `cards`): tags `vX.Y.Z`, GitHub Releases, content changelog updates
  - infra track (`ci`, `site`): tags `infra-vX.Y.Z`, infra changelog updates, no GitHub Release objects
- Site deploy runs only when a content release is published.

See [Release Policy](notes/Release%20Policy.md) for the exact rules.

## Notes for Reuse as a Template

When cloning this workflow to another project, review these first:

- scopes in [path-scope-validate.yml](.github/workflows/path-scope-validate.yml)
- release rules in [.releaserc.content.cjs](.releaserc.content.cjs) and [.releaserc.infra.cjs](.releaserc.infra.cjs)
- site build command in [semantic-release.yml](.github/workflows/semantic-release.yml)
- branch names and protection requirements in [auto-pr.yml](.github/workflows/auto-pr.yml)
