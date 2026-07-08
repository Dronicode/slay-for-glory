"""Normalize changelog H1 headers."""

from __future__ import annotations

from pathlib import Path

# Resolve paths from the repo root.
ROOT = Path(__file__).resolve().parents[1]
FILES = [
    (ROOT / "docs" / "Changelog.md", "# Changelog"),
    (ROOT / "CHANGELOG_INFRA.md", "# Infra Changelog"),
]


def normalize_header(path: Path, header: str) -> None:
    """Ensure a file has exactly one leading H1 header."""
    if not path.exists():
        return

    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()

    filtered = []
    header_written = False

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("# ") and not header_written:
            filtered.append(header)
            header_written = True
            continue

        if stripped == header:
            continue

        filtered.append(line)

    if not header_written:
        filtered.insert(0, header)

    body = "\n".join(filtered).strip()

    if body:
        normalized = f"{header}\n\n{body}\n"
    else:
        normalized = f"{header}\n"

    path.write_text(normalized, encoding="utf-8")


def main() -> None:
    """Normalize every managed changelog header."""
    for path, header in FILES:
        normalize_header(path, header)


if __name__ == "__main__":
    main()
