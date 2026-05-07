const scopeOrder = ["content", "rules", "cards"];
const { makeCommitGroupsSort, makeCommitsSort, makeTrackTransform } = require("./.releaserc.utils.cjs");

module.exports = {
  // Release only from the production branch.
  branches: ["main"],

  // Use the primary tag namespace for content releases.
  tagFormat: "v${version}",

  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          // Deny all by default; allow only the scope/type pairs listed below.
          { scope: "*", release: false },

          // Content scope commits.
          { type: "feat", scope: "content", release: "minor" },
          { type: "fix", scope: "content", release: "patch" },

          // Rules scope commits.
          { type: "feat", scope: "rules", release: "minor" },
          { type: "fix", scope: "rules", release: "patch" },

          // Cards scope commits.
          { type: "feat", scope: "cards", release: "minor" },
          { type: "fix", scope: "cards", release: "patch" },
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
        // Write change notes into the content changelog.
        changelogFile: "docs/Changelog.md",
      },
    ],
    [
      "@semantic-release/exec",
      {
        // Write the computed version and refresh generated metadata files.
        prepareCmd:
          "python scripts/update_versions_json.py --track content --version ${nextRelease.version}" +
          " && python scripts/update_index_md_release_status.py" +
          " && python scripts/normalize_changelog_headers.py",
      },
    ],
    [
      "@semantic-release/git",
      {
        // Commit generated artifacts.
        assets: ["docs/Changelog.md", "docs/index.md", "versions.json"],
        // Embed the generated release notes in the commit body.
        message: "chore(release): v${nextRelease.version}  \n\n${nextRelease.notes}",
      },
    ],
    // Publish GitHub releases for the content release track.
    "@semantic-release/github",
  ],
};