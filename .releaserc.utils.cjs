const sectionOrder = ["Features", "Bug Fixes"];
const sectionByType = {
  feat: "Features",
  fix: "Bug Fixes",
};

function rankByOrder(order, value) {
  const rank = order.indexOf(value);
  return rank === -1 ? Number.MAX_SAFE_INTEGER : rank;
}

function makeCommitGroupsSort(order = sectionOrder) {
  return (a, b) => rankByOrder(order, a.title) - rankByOrder(order, b.title);
}

function makeCommitsSort(scopeOrder) {
  return (a, b) => {
    const byScope = rankByOrder(scopeOrder, a.scope) - rankByOrder(scopeOrder, b.scope);
    if (byScope !== 0) {
      return byScope;
    }
    return String(a.subject || "").localeCompare(String(b.subject || ""));
  };
}

function makeTrackTransform(scopeOrder, typeToSection = sectionByType) {
  return (commit) => {
    if (!scopeOrder.includes(commit.scope)) {
      return undefined;
    }

    const section = typeToSection[commit.type];
    if (!section) {
      return undefined;
    }

    const result = {
      type: section,
      shortHash: typeof commit.hash === "string" ? commit.hash.substring(0, 7) : commit.shortHash,
    };

    // Hide scope prefix if there is only one scope in this track.
    if (scopeOrder.length === 1) {
      result.scope = null;
    }

    return result;
  };
}

module.exports = {
  sectionOrder,
  sectionByType,
  makeCommitGroupsSort,
  makeCommitsSort,
  makeTrackTransform,
};