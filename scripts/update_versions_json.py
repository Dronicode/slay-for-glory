"""Update one release track entry in versions.json."""

from __future__ import annotations

import argparse
import json
from datetime import date
from pathlib import Path

# Resolve paths from the repo root.
ROOT = Path(__file__).resolve().parents[1]
VERSIONS_PATH = ROOT / "versions.json"


def load_versions() -> dict:
    """Load and validate versions.json as a top-level object."""
    data = json.loads(VERSIONS_PATH.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise SystemExit("versions.json must be a JSON object")
    return data


def write_versions(data: dict) -> None:
    """Write the full versions structure back with stable formatting."""
    VERSIONS_PATH.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def update_track(data: dict, track: str, version: str) -> None:
    """Write an exact version string to one release track and stamp last_updated."""
    next_version = version.strip()
    if not next_version:
        raise SystemExit("--version cannot be empty")

    track_data = data.get(track)
    if track_data is None:
        track_data = {}
    elif not isinstance(track_data, dict):
        raise SystemExit(f"versions.json key '{track}' must be an object")

    track_data["version"] = next_version
    track_data["last_updated"] = date.today().isoformat()
    data[track] = track_data


def parse_args() -> argparse.Namespace:
    """Parse CLI args passed in by semantic-release prepareCmd."""
    parser = argparse.ArgumentParser(
        description="Update one release track entry in versions.json"
    )
    parser.add_argument("--track", required=True, help="Release track key in versions.json")
    parser.add_argument("--version", required=True, help="Exact version value to write")
    return parser.parse_args()


def main() -> None:
    """Entry point: load -> mutate one release track -> persist."""
    args = parse_args()
    data = load_versions()
    update_track(data, args.track, args.version)
    write_versions(data)


if __name__ == "__main__":
    main()
