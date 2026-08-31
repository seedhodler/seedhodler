#!/usr/bin/env python3
"""Recover Seedhodler's freshly generated shares without Seedhodler.

Section 10 of SPECIFICATION.md promises that a holder of the shares can get
back to the mnemonic using only BIP-39 and SLIP-0039 reference code. This
script is that promise, executed. It reads the shares that
check-app-conformance.mjs just generated and recovers them with third-party
libraries that have never seen a line of Seedhodler.

    npx vite-node tools/check-app-conformance.mjs --emit > shares.json
    python3 tools/check-external-recovery.py shares.json
"""
import json
import sys
from itertools import combinations

from mnemonic import Mnemonic
from shamir_mnemonic import combine_mnemonics

failures: list[str] = []
checks = 0


def check(condition: bool, message: str) -> None:
    global checks
    checks += 1
    if not condition:
        failures.append(message)


def main(path: str) -> int:
    global checks
    payload = json.loads(open(path, encoding="utf-8").read())

    for vector in payload["vectors"]:
        threshold, count = (int(part) for part in vector["scheme"].split("-of-"))
        label = f"set {vector['id']} ({vector['scheme']})"

        check(
            len(vector["shares"]) == count,
            f"{label}: expected {count} shares, got {len(vector['shares'])}",
        )

        for subset in combinations(vector["shares"], threshold):
            # combine_mnemonics enforces the SLIP-0039 digest itself and raises
            # if the shares do not belong together.
            secret = combine_mnemonics(list(subset))

            # The one step that is not in either standard: the master secret is
            # read as BIP-39 entropy, not as a seed.
            check(
                secret.hex() == vector["entropy"],
                f"{label}: recovered master secret is not the recorded entropy",
            )
            # Compare under NFKD so the Japanese U+3000 separator matches a
            # normal space on either side, whichever this library emits.
            mnemo = Mnemonic(vector["language"])
            check(
                mnemo.normalize_string(mnemo.to_mnemonic(secret))
                == mnemo.normalize_string(vector["mnemonic"]),
                f"{label}: recovered entropy does not encode the recorded mnemonic",
            )

        # Fewer than t shares must not reconstruct anything.
        if threshold > 1:
            try:
                combine_mnemonics(vector["shares"][: threshold - 1])
            except Exception:
                checks += 1
            else:
                checks += 1
                failures.append(
                    f"{label}: {threshold - 1} shares reconstructed a secret"
                )

    if failures:
        print(f"FAILED: {len(failures)} of {checks} checks:", file=sys.stderr)
        for failure in failures:
            print(f"  - {failure}", file=sys.stderr)
        return 1

    print(f"OK: {checks} checks passed, the shares recover without Seedhodler")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__, file=sys.stderr)
        raise SystemExit(2)
    raise SystemExit(main(sys.argv[1]))
