# Seedhodler Share Format

**Specification 1, Draft**

How Seedhodler converts a BIP-39 mnemonic into a set of Shamir shares and back.
This document is written so that a holder of the shares can recover the original
mnemonic **without Seedhodler**, using only the referenced open standards and any
conforming implementation of them.

| | |
|---|---|
| Status | Draft, not yet reviewed |
| Applies to | Seedhodler v2 share sets |
| Requires | BIP-39, SLIP-0039 |
| Test vectors | [`seedhodler-test-vectors.json`](./seedhodler-test-vectors.json) |

## Contents

1. [Scope and purpose](#1-scope-and-purpose)
2. [Normative references](#2-normative-references)
3. [Terms](#3-terms)
4. [Splitting](#4-splitting)
5. [Recovery](#5-recovery)
6. [Relationship to SLIP-39 hardware wallets](#6-relationship-to-slip-39-hardware-wallets)
7. [Parameters and limits](#7-parameters-and-limits)
8. [Generating an additional share](#8-generating-an-additional-share)
9. [Test vectors](#9-test-vectors)
10. [Recovery without Seedhodler](#10-recovery-without-seedhodler)
11. [Security considerations](#11-security-considerations)

## 1. Scope and purpose

Seedhodler splits an existing BIP-39 mnemonic into *n* shares, of which any *t*
reconstruct it. It does not define new cryptography: the sharing is SLIP-0039, and the
mnemonic handling is BIP-39. What this document specifies is the **one place where the
two meet**: how a BIP-39 mnemonic becomes the SLIP-0039 master secret, and how it is
recovered from it.

That single step is the entire reason this document exists. It is not written down in
either referenced standard, it cannot be inferred from a share, and without it a set of
otherwise valid shares cannot be turned back into a wallet.

The key words MUST, MUST NOT, SHOULD and MAY are to be interpreted as described in
RFC 2119.

## 2. Normative references

| Reference | Used for |
|---|---|
| **BIP-39** (`bitcoin/bips`) | Mnemonic ↔ entropy conversion, wordlists, checksum |
| **SLIP-0039** (`satoshilabs/slips`) | Shamir sharing over GF(256), share encoding, digest verification |

## 3. Terms

| Term | Meaning |
|---|---|
| **Mnemonic** | The user's BIP-39 phrase, 12 or 24 words. |
| **Entropy** | The 16 or 32 bytes encoded by the mnemonic, excluding its checksum. |
| **Master secret** | The value SLIP-0039 splits. In Seedhodler this is *the entropy*, byte for byte. |
| **Share** | One SLIP-0039 mnemonic, 20 or 33 words from the SLIP-0039 wordlist. |
| **t / n** | Threshold and share count, written `t-of-n`. |

## 4. Splitting

Given a BIP-39 mnemonic and parameters *t* and *n*:

1. Convert the mnemonic to its entropy per BIP-39. The result MUST be 16 bytes for a
   12-word mnemonic or 32 bytes for a 24-word mnemonic. The BIP-39 checksum MUST be
   verified before proceeding.
2. Use those bytes **unchanged** as the SLIP-0039 master secret. No hashing, padding or
   re-encoding is applied.
3. Split per SLIP-0039 with a single group: group threshold `1`, one group `[t, n]`,
   passphrase `""` (the empty string).
4. The result is *n* SLIP-0039 mnemonics of 20 words (16-byte secret) or 33 words
   (32-byte secret).

```
mnemonic ──BIP-39──▶ entropy ──▶ master secret ──SLIP-0039──▶ share 1 … share n
                    16 / 32 bytes    (identical)
```

> **Note.** The SLIP-0039 passphrase is fixed to the empty string. Any passphrase
> protecting the wallet is a **BIP-39 passphrase** and is therefore not part of the
> entropy and not carried by the shares. This is deliberate: holders who collude to reach
> the threshold recover the mnemonic, but not a passphrase-protected wallet.

## 5. Recovery

1. Collect any *t* shares of the same set. Shares of one set share their first two words.
2. Combine them per SLIP-0039. The digest check defined there MUST pass; if it fails, the
   result MUST NOT be used.
3. **Interpret the recovered master secret as BIP-39 entropy** and encode it back into a
   mnemonic per BIP-39, using the wordlist of the original language.
4. The resulting 12 or 24 words are the original mnemonic and can be entered into any
   BIP-39 wallet.

> **Step 3 is the whole point.** A conforming SLIP-0039 implementation returns raw bytes
> and stops. Those bytes are *not* a seed and *not* a private key: they are BIP-39
> entropy. Software that treats them as a seed directly will derive a different,
> unrelated wallet, without any error. See section 6.

## 6. Relationship to SLIP-39 hardware wallets

> **Warning.** Seedhodler shares MUST NOT be entered into a Trezor or any other wallet
> offering SLIP-39 recovery. The device will **accept them** (the checksums are valid)
> and will silently open a different, empty wallet.

Both this specification and those devices use identical share encoding. They differ in
what the recovered master secret means:

| | Master secret is … | Derivation |
|---|---|---|
| **Seedhodler** | BIP-39 entropy | entropy → mnemonic → PBKDF2 → BIP-32 seed |
| **SLIP-39 wallet** | the seed itself | master secret → BIP-32 seed |

The two paths produce unrelated BIP-32 root keys from identical shares. Section 9 gives
the values for the test vectors so implementers can confirm the divergence rather than
take it on faith.

## 7. Parameters and limits

| Parameter | Range | Notes |
|---|---|---|
| Mnemonic length | 12 or 24 words | 16 or 32 bytes of entropy |
| Share length | 20 or 33 words | Follows from the secret size |
| Threshold *t* | 1 … *n* | *t* = 1 requires *n* = 1 |
| Share count *n* | 1 … 16 | Member index is 4 bits |
| Group threshold | fixed `1` | Single group only |
| SLIP-0039 passphrase | fixed `""` | See section 4 |
| Languages | BIP-39 wordlists | Shares are always English SLIP-0039 words |

> **Language.** The share wordlist is independent of the mnemonic language: a Japanese
> mnemonic yields English SLIP-0039 shares. The original language MUST be recorded
> separately: it cannot be derived from the shares, and step 3 of recovery needs it.
> Note that Japanese BIP-39 mnemonics are separated by U+3000, not U+0020.

## 8. Generating an additional share

Shares are points on a polynomial of degree *t*−1. Holding *t* of them determines the
polynomial, so further points (that is, further valid shares) can be computed for any
unused index.

1. Collect *t* shares and read their member indices.
2. Choose an index that is not in use anywhere. Implementations MUST ask the holder which
   indices exist rather than infer this from the shares presented.
3. Interpolate the share values at that index over GF(256).
4. Emit a share carrying the same identifier, group fields and member threshold, with the
   new member index.
5. Verify by recovering the secret from a set that includes the new share and checking
   the digest.

> **Replaces lost, never compromised.** A Shamir share cannot be revoked. Old shares stay
> valid forever. If a share has been seen by anyone, generating a replacement achieves
> nothing: a new set with a new identifier is required, and for funds a new seed.

## 9. Test vectors

The authoritative, machine-readable vectors live in
[`seedhodler-test-vectors.json`](./seedhodler-test-vectors.json). It carries both sets in
full, every share, and is the file test suites should read. Set A is reproduced here for
illustration; where the two disagree, the JSON file wins.

Both sets are `3-of-5`, English wordlist, no passphrase. Any three shares recover the
secret.

### Set A: 12 words, 128 bit

```
entropy    00112233445566778899aabbccddeeff
mnemonic   abandon math mimic master filter design carbon crystal rookie group
           knife young
bip32root  1d2037d1adbd40ccf99d44e7073a9d8e32e5675ee053a2fd1c078ef9e05a807d

share 1    sidewalk crunch academic acne drift piece false grief market purple
           advocate military testify cylinder typical payment sister order
           diploma unusual
share 2    sidewalk crunch academic agree aluminum ivory standard echo laser club
           wrap blanket march mandate permit fancy index dance crystal floral
share 3    sidewalk crunch academic amazing aluminum dictate expect capacity fact
           smell formal golden vanish sugar umbrella answer triumph walnut
           voting failure
share 4    sidewalk crunch academic arcade drift trend short discuss patrol
           founder pencil teacher olympic laser pecan window filter evening
           ugly tracks
share 5    sidewalk crunch academic axle dough exhaust fitness nuclear single
           hearing unhappy sidewalk plot laser script describe reward crunch
           hearing steady
```

### Set B: 24 words, 256 bit

```
entropy    000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f
mnemonic   abandon amount liar amount expire adjust cage candy arch gather drum
           bullet absurd math era live bid rhythm alien crouch range attend
           journey unaware
bip32root  5d58ac2af7f098cc241dacd929d464ed2faa37b754a1216d0afc39340fb1d0bf
```

Shares for set B are in the JSON file.

`bip32root` is `HMAC-SHA512("Bitcoin seed", seed)` truncated to its left 32 bytes, where
`seed` is derived per BIP-39 with an empty passphrase. An implementation that treats the
master secret as the seed directly will produce entirely different values, and that
difference is the failure mode section 6 warns about.

## 10. Recovery without Seedhodler

This procedure uses only third-party software. It has been executed against the vectors
in section 9.

```bash
python3 -m venv venv
./venv/bin/pip install shamir-mnemonic mnemonic
```

```python
from shamir_mnemonic import combine_mnemonics   # SatoshiLabs reference
from mnemonic import Mnemonic

shares = [ "...", "...", "..." ]                # any t shares of one set

secret = combine_mnemonics(shares, b"")         # passphrase stays empty
print("entropy :", secret.hex())

# The step no wallet performs for you:
print("mnemonic:", Mnemonic("english").to_mnemonic(secret))
```

Should these packages cease to exist, any implementation of SLIP-0039 and BIP-39 will
serve; implementations exist in C, Rust, Go and JavaScript. Only the final line is
specific to this format, and section 5 states it in full.

## 11. Security considerations

- **Reconstruction is a moment of exposure.** Recovery brings the complete mnemonic
  together on one machine. It SHOULD happen on an offline system, and funds SHOULD
  afterwards be moved to a freshly generated seed.
- **Fewer than *t* shares leak nothing.** This is a property of Shamir's scheme and holds
  regardless of how the shares are stored.
- **The digest is not optional.** An incorrect reconstruction yields a syntactically valid
  mnemonic with a valid BIP-39 checksum. The SLIP-0039 digest is the only in-band signal
  that distinguishes correct from merely plausible. Holders SHOULD additionally record a
  control address.
- **Changing *t* or *n* produces a new set.** A new identifier and a new polynomial are
  drawn; previously printed shares become worthless. To add a holder, use section 8
  instead.
- **The share count is not recorded.** A share states the threshold and its own index,
  never how many siblings exist. That number MUST be documented externally.

---

Draft, pending external review. Corrections and test-vector mismatches should be reported
as issues against the Seedhodler repository.
