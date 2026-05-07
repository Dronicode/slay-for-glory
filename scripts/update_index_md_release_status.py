"""Update the content release status block in docs/index.md."""

from __future__ import annotations

import json
from pathlib import Path

# Resolve paths from the repo root.
ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT / "docs" / "index.md"
VERSIONS_PATH = ROOT / "versions.json"

# These markers wrap the auto-managed lines.
START = "<!-- VERSION_UPDATE_START -->"
END = "<!-- VERSION_UPDATE_END -->"


def latest_content_values() -> tuple[str, str]:
    """Read the current content version and last_updated date from versions.json."""
    versions = json.loads(VERSIONS_PATH.read_text(encoding="utf-8"))
    content = versions.get("content", {})
    version = str(content.get("version", "0.0.0"))
    updated = str(content.get("last_updated", "unknown"))
    return version, updated


def update_index() -> None:
    """Replace the version block with the current content version and date."""
    version, updated = latest_content_values()
    content = INDEX_PATH.read_text(encoding="utf-8")

    if START not in content or END not in content:
        raise SystemExit(f"Markers not found in {INDEX_PATH}. Add {START} ... {END} around the version lines.")

    # Replace the managed block in place.
    replacement = f"{START}\n\nLatest Version: v{version}  \nLast Updated: {updated}\n\n{END}"

    prefix, rest = content.split(START, 1)
    _, suffix = rest.split(END, 1)
    INDEX_PATH.write_text(prefix + replacement + suffix, encoding="utf-8")


if __name__ == "__main__":
    update_index()
