# Threat Model

A tool that splits seeds is only as trustworthy as its honesty about what it
does not protect against. This document states both sides: what the protection
delivers, and where it ends. It is the text an external reviewer should read
first.

> **Draft.** For correction, not for sign-off. Markers below: *verified in code*,
> *gap*, or *your decision*.

## The short version

Seedhodler's safety rests on a small, checkable base rather than on trusting any
one party:

1. **The cryptography is correct.** Generate, split, and restore round-trip, and
   the shares can be rebuilt with third-party BIP-39, SLIP-0039, or SSKR code.
2. **It runs air-gapped.** Loaded once with the network off, there is no channel
   for anything to leave the machine.
3. **The build is genuine.** It ships as a single self-contained HTML file whose
   hash can be recomputed from source, so a tampered copy is detectable before
   it runs.

Given those three, a vulnerable dependency or the hosting location cannot by
itself reach a seed. What the structure cannot argue away is the **randomness**:
if the entropy that generates a seed, or the randomness that splits it, is
predictable or known to an attacker, the shares are valid and verifiable and
still worthless. Everything below is the detailed version of this.

## What the tool protects

Each of these is checked against the source.

- **A single lost or stolen envelope reveals nothing.** *(verified)* Below the
  threshold, any subset of the shares holds no information about the seed. With
  3-of-5, two found sheets are worthless. The test vectors check exactly that
  for every subset.
- **The seed never leaves memory.** *(verified)* No `localStorage`,
  `sessionStorage`, `fetch`, or network call anywhere in the source. Since the
  single-file build, the loaded page talks to no one.
- **Generated seeds are cryptographically random.** *(verified)* The default
  path uses `bip39.generateMnemonic`, which draws on `crypto.getRandomValues`.
  The `Math.random` in the code drives only the verification UI, never the seed.
- **The passphrase is not shared out.** *(verified)* The SLIP-39 passphrase is
  hardcoded to `""`. A real passphrase is a BIP-39 passphrase; it is not part of
  the entropy and is not split. Anyone who reaches the threshold recovers the
  word list, but not a passphrase-protected wallet.
- **The delivered build is verifiable.** *(verified)* The single-file build is
  reproducible: the same commit yields the same file with the same hash, and the
  footer names the commit. A user can check that the server serves nothing other
  than the publicly built artifact.
- **Recovery is not tied to Seedhodler.** *(verified)* The shares can be
  recovered with third-party reference implementations, and CI proves it on
  every push. If seedhodler.io ever disappears, the seed is recoverable from the
  referenced standards alone.

## What it explicitly does not protect against

The more important section. Every item is a limit that must be documented, so a
user does not mistake it for a protection that is not there.

- **A compromised machine.** Malware, a keylogger, or screen capture takes the
  seed the moment it appears. The tool cannot detect or prevent this. The whole
  protection assumes a clean, ideally air-gapped machine.
- **Enough shares brought together.** Whoever gets *t* shares reconstructs the
  seed; that is the definition of the scheme, not a weakness. The protection
  lies in the physical separation of the envelopes. Shareholders who collude and
  reach the threshold obtain the seed, unless a BIP-39 passphrase is set.
- **Weak user-supplied entropy.** *(gap)* In advanced mode,
  `isEntropyTooShort` checks only the number of bits and colours a background; it
  does not block. An all-zeros input produces a valid but worthless seed. Open
  gap from the fixes phase; until it is closed, the quality of self-rolled
  entropy is the user's responsibility.
- **Cross-use in a hardware wallet.** SLIP-39 shares from Seedhodler must never
  go into a Trezor. The device accepts them, the checksums pass, and it silently
  opens a different, empty wallet. This danger is structural and can only be
  mitigated by warning. **SSKR reverses it:** a Trezor rejects SSKR shares
  instead of silently opening the wrong wallet, which is the strongest argument
  for making SSKR the default.
- **Physical theft or loss of the paper.** Against fire, water, or a thief with
  access to enough storage locations, no software helps. The tool generates the
  shares; their secure distribution is beyond its reach.
- **The user who photographs the shares.** A photo, a scan, or a cloud note with
  enough shares defeats the whole scheme. The tool deliberately prints only
  blank forms, never the shares themselves. What the user does with the paper
  afterwards, it cannot control.

## What the protection rests on

The preconditions under which the promises above hold. If one is violated, the
model shifts.

- **A clean, network-isolated machine.** Download, verify the hash, disconnect,
  use, then wipe the medium. The single-file build and the reproducible hashes
  exist to make this flow possible.
- **Trustworthy hardware.** Processor, memory, and printer do what they should.
  Against hardware backdoors or a printer that caches jobs, the model offers no
  protection; it assumes them trustworthy.
- **Secure physical distribution.** The envelopes lie in physically separate
  places to which no single party has enough access to reach the threshold
  alone. Without that separation, Shamir is powerless.
- **The user verifies the recovery.** *(decided)* Both failure modes here are
  silent: a wrong cross-use and a mistaken entropy each lead to a plausible but
  wrong wallet. The tool therefore offers the check actively, on two paths and
  deliberately without coercion (a forced print-then-verify flow would be
  paternalistic):
  - **Path 1, the written codes.** A spot-check of the hand-written words
    against the screen. Separate from printing, where the user chooses which
    templates they need.
  - **Path 2, the first Bitcoin address.** The stronger anchor. The first
    address is derived from the recovered seed; the user picks their wallet
    (Ledger, Trezor, and so on) from a dropdown or enters the derivation path by
    hand, and compares against their device. If it matches, the recovery is
    proven, not merely plausible.

  What remains an assumption is that the user actually uses the offered check,
  since it is deliberately not enforced.

## This document lives with the code

When the fixes phase closes the entropy gap, or the UI phase enforces
verification, the corresponding item moves from "does not protect" to
"protects". The threat model is not a final document but a snapshot that changes
with the tool. It pairs with [`SECURITY.md`](./SECURITY.md), which describes how
to report a problem.
