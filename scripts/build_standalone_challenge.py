#!/usr/bin/env python3
"""Build the self-contained USB challenge HTML from the modular source."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "challenge" / "verb-challenge-boids-predatory.html"
BANK = ROOT / "shared-assets" / "verb-bank.js"
OUTPUT = ROOT / "challenge" / "usb" / "verb-challenge-boids-predatory.html"
REFERENCE = '<script src="../shared-assets/verb-bank.js"></script>'

source = SOURCE.read_text(encoding="utf-8")
bank = BANK.read_text(encoding="utf-8")
if source.count(REFERENCE) != 1:
    raise SystemExit(f"Expected exactly one shared-bank reference in {SOURCE}")

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_text(
    source.replace(REFERENCE, f"<script>\n{bank}\n</script>"),
    encoding="utf-8",
)
print(f"Built {OUTPUT.relative_to(ROOT)}")
