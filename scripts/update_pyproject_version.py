"""Update [project].version in pyproject.toml."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

# Resolve paths from the repo root.
ROOT = Path(__file__).resolve().parents[1]
PYPROJECT_PATH = ROOT / "pyproject.toml"


def parse_args() -> argparse.Namespace:
    """Parse CLI args passed in by semantic-release prepareCmd."""
    parser = argparse.ArgumentParser(
        description="Update [project].version in pyproject.toml"
    )
    parser.add_argument("--version", required=True, help="Exact version value to write")
    return parser.parse_args()


def update_project_version(version: str) -> None:
    """Replace the version value inside the [project] table."""
    next_version = version.strip()
    if not next_version:
        raise SystemExit("--version cannot be empty")

    lines = PYPROJECT_PATH.read_text(encoding="utf-8").splitlines(keepends=True)

    in_project = False
    found_project = False
    replaced = False

    for i, line in enumerate(lines):
        section = re.match(r"^\s*\[([^\]]+)\]\s*$", line)
        if section:
            in_project = section.group(1).strip() == "project"
            found_project = found_project or in_project
            continue

        if not in_project:
            continue

        match = re.match(r'^(\s*version\s*=\s*)"[^"]*"(\s*(?:#.*)?\r?\n?)$', line)
        if match:
            lines[i] = f'{match.group(1)}"{next_version}"{match.group(2)}'
            replaced = True
            break

    if not found_project:
        raise SystemExit("pyproject.toml is missing a [project] table")
    if not replaced:
        raise SystemExit("pyproject.toml [project] table is missing version")

    PYPROJECT_PATH.write_text("".join(lines), encoding="utf-8")


def main() -> None:
    """Entry point: parse args and update pyproject version."""
    args = parse_args()
    update_project_version(args.version)


if __name__ == "__main__":
    main()