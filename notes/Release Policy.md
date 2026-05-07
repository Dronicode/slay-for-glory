# Release Policy

## Branch Model

- `develop`: integration branch
- `main`: protected production branch
- Current auto-PR merge mode is merge-commit via `gh pr merge --auto --merge`

## Required PR Checks

- `.github/workflows/commit-lint.yml`
- `.github/workflows/path-scope-validate.yml`
- `.github/workflows/validate-site.yml`

Release jobs run after merge on `main`, so they should not be branch protection requirements.

## Conventional Commits

Format:

`<type>(<scope>): <subject>`

Allowed types are enforced by `.commitlintrc.js`:

- `feat`
- `fix`
- `docs`
- `chore`
- `refactor`
- `test`

Automation scopes:

- content scopes: `content`, `rules`, `cards`
- infra scopes: `ci`, `site`

Release-triggering combinations:

- content release: `feat` or `fix` with scope `content`, `rules`, or `cards`
- infra release: `feat` or `fix` with scope `ci` or `site`

## Workflow Summary

`.github/workflows/auto-pr.yml`

- runs on pushes to `develop`
- creates or updates the release PR into `main`

`.github/workflows/commit-lint.yml`

- runs on pull request activity
- enforces Conventional Commit format

`.github/workflows/path-scope-validate.yml`

- runs on pull request activity
- enforces path-to-scope mapping: `docs/` changes require `content`, `rules`, or `cards` scope; `docs/cards/` require `cards` scope; `docs/rules/` require `rules` scope

`.github/workflows/validate-site.yml`

- runs on pull request activity
- validates the markdown site build when docs or site config change

`.github/workflows/semantic-release.yml`

- runs on `main` and manual dispatch
- detects content and infra changes, releases matching version tracks, deploys pages after content releases, and fast-forwards `develop`

`.github/workflows/deploy-site.yml`

- runs on manual dispatch
- provides a manual build and deploy fallback

## Dual Release Tracks

Semantic release runs from `semantic-release.yml`.

### Content Track

- Config: `.releaserc.content.cjs`
- Triggers: `feat`/`fix` with scope `content`, `rules`, or `cards` eg. `feat(content): ...`
- Outputs:
  - tags `vX.Y.Z`
  - GitHub Releases
  - updates `docs/Changelog.md`
  - updates `docs/index.md`
  - updates `versions.json`

### Infra Track

- Config: `.releaserc.infra.cjs`
- Triggers: `feat`/`fix` with scope `ci` or `site` eg. `feat(ci): ...`
- Outputs:
  - tags `infra-vX.Y.Z`
  - no GitHub Release object
  - updates `CHANGELOG_INFRA.md`
  - updates `versions.json`
  - updates `pyproject.toml`

## Deployment Rule

- GitHub Pages deploy runs only when a content release is published
