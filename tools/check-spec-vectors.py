#!/usr/bin/env python3
"""Verify that SPECIFICATION.md and seedhodler-test-vectors.json agree,
and that the vectors themselves are cryptographically correct.

Fails loudly on any mismatch. Intended to run in CI on every push.

    pip install shamir-mnemonic mnemonic
    python3 tools/check-spec-vectors.py
"""
import hashlib
import hmac
import json
import re
import sys
from itertools import combinations
from pathlib import Path

from mnemonic import Mnemonic
from shamir_mnemonic import combine_mnemonics

ROOT = Path(__file__).resolve().parent.parent
SPEC = ROOT / "SPECIFICATION.md"
VECTORS = ROOT / "seedhodler-test-vectors.json"

errors: list[str] = []
checks = 0


def check(condition: bool, message: str) -> None:
    global checks
    checks += 1
    if not condition:
        errors.append(message)


def parse_markdown_blocks(text: str) -> dict[str, dict[str, str]]:
    """Read the fenced blocks under '### Set X' headings.

    Lines look like `label    value`, continuation lines are indented.
    """
    sets: dict[str, dict[str, str]] = {}
    for heading, body in re.findall(
        r"^### Set (\w+).*?\n```\n(.*?)\n```", text, re.S | re.M
    ):
        fields: dict[str, str] = {}
        label = None
        for line in body.split("\n"):
            if not line.strip():
                label = None
                continue
            m = re.match(r"^(\S+(?: \d+)?)\s{2,}(.*)$", line)
            if m:
                label, value = m.group(1), m.group(2).strip()
                fields[label] = value
            elif label and line.startswith("  "):
                fields[label] += " " + line.strip()
        sets[heading] = fields
    return sets


def bip32_root(mnemonic: str, language: str) -> str:
    seed = Mnemonic(language).to_seed(mnemonic, passphrase="")
    return hmac.new(b"Bitcoin seed", seed, hashlib.sha512).digest()[:32].hex()


def main() -> int:
    global checks
    for path in (SPEC, VECTORS):
        if not path.exists():
            print(f"missing file: {path}", file=sys.stderr)
            return 2

    data = json.loads(VECTORS.read_text())
    doc = parse_markdown_blocks(SPEC.read_text())

    for vec in data["vectors"]:
        sid, lang = vec["id"], vec["language"]
        threshold = int(vec["scheme"].split("-of-")[0])
        tag = f"set {sid}"

        # --- the vectors must be internally correct -----------------------
        mnemo = Mnemonic(lang)
        check(
            mnemo.check(vec["mnemonic"]),
            f"{tag}: mnemonic fails its own BIP-39 checksum",
        )
        check(
            mnemo.to_entropy(vec["mnemonic"]).hex() == vec["entropy"],
            f"{tag}: mnemonic does not encode the stated entropy",
        )
        check(
            bip32_root(vec["mnemonic"], lang) == vec["bip32RootKey"],
            f"{tag}: bip32RootKey does not match the mnemonic",
        )

        # every t-subset must recover the entropy (specification section 5)
        for combo in combinations(vec["shares"], threshold):
            try:
                recovered = combine_mnemonics(list(combo), b"").hex()
            except Exception as exc:  # noqa: BLE001 - report, do not raise
                errors.append(f"{tag}: shares rejected by reference impl: {exc}")
                continue
            check(
                recovered == vec["entropy"],
                f"{tag}: a {threshold}-share subset recovered the wrong secret",
            )

        # fewer than t shares must not work
        if threshold > 1:
            try:
                combine_mnemonics(vec["shares"][: threshold - 1], b"")
                errors.append(f"{tag}: {threshold - 1} shares were accepted")
            except Exception:
                checks += 1

        # --- the document must agree with them ----------------------------
        block = doc.get(sid)
        if block is None:
            print(f"note: {tag} is not reproduced in SPECIFICATION.md, skipping text check")
            continue

        for label, expected in (
            ("entropy", vec["entropy"]),
            ("mnemonic", vec["mnemonic"]),
            ("bip32root", vec["bip32RootKey"]),
        ):
            if label in block:
                check(
                    " ".join(block[label].split()) == " ".join(expected.split()),
                    f"{tag}: '{label}' in SPECIFICATION.md differs from the JSON vectors",
                )

        for i, share in enumerate(vec["shares"], start=1):
            label = f"share {i}"
            if label in block:
                check(
                    " ".join(block[label].split()) == " ".join(share.split()),
                    f"{tag}: '{label}' in SPECIFICATION.md differs from the JSON vectors",
                )

    if errors:
        print(f"FAILED: {len(errors)} problem(s):", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        return 1

    print(f"OK: {checks} checks passed across {len(data['vectors'])} vector set(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
