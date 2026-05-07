const scopeOrder = ["site", "ci"];
const { makeCommitGroupsSort, makeCommitsSort, makeTrackTransform } = require("./.releaserc.utils.cjs");

module.exports = {
  // Release only from the production branch.
  branches: ["main"],

  // Use a separate tag namespace for infra releases.
  tagFormat: "infra-v${version}",

  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          // Deny all by default; allow only the scope/type pairs listed below.
          { scope: "*", release: false },

          // CI scope commits.
          { type: "feat", scope: "ci", release: "minor" },
          { type: "fix", scope: "ci", release: "patch" },

          // Site scope commits.
          { type: "feat", scope: "site", release: "minor" },
          { type: "fix", scope: "site", release: "patch" },
        ],
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        writerOpts: {
          // Show Features before Bug Fixes.
          commitGroupsSort: makeCommitGroupsSort(),

          // Show scopes in order inside each section.
          commitsSort: makeCommitsSort(scopeOrder),

          // Keep only commits that belong to this release track.
          transform: makeTrackTransform(scopeOrder),
        },
      },
    ],
    [
      "@semantic-release/changelog",
      {
        // Write change notes to the infra changelog.
        changelogFile: "CHANGELOG_INFRA.md",
      },
    ],
    [
      "@semantic-release/exec",
      {
        // Write the computed version and refresh generated metadata files.
        prepareCmd:
          "python scripts/update_versions_json.py --track infra --version ${nextRelease.version}" +
          " && python scripts/update_pyproject_version.py --version ${nextRelease.version}" +
          " && python scripts/normalize_changelog_headers.py",
      },
    ],
    [
      "@semantic-release/git",
      {
        // Commit generated artifacts.
        assets: ["CHANGELOG_INFRA.md", "versions.json", "pyproject.toml"],
        // Embed the generated release notes in the commit body.
        message: "chore(tag): infra-v${nextRelease.version}  \n\n${nextRelease.notes}",
      },
    ],
    // Keep this track tag-only, by omitting GitHub releases.
  ],
};
