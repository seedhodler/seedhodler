# Seedhodler

> Split the seed. Spread the risk.

Seedhodler turns the BIP-39 seed of a cryptocurrency wallet into a set of shares,
of which any chosen number brings the seed back. Split a seed into 5 shares that
need 3 to recover, and any two found sheets are worthless while losing one still
leaves you whole. It runs entirely in your browser, offline, and ships as a
single self-contained HTML file.

Live at [seedhodler.io](https://seedhodler.io/).

The splitting is [Shamir's Secret Sharing](https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing)
via [SLIP-0039](https://github.com/satoshilabs/slips/blob/master/slip-0039.md)
and [SSKR](https://github.com/BlockchainCommons/bc-sskr). Seedhodler defines no
new cryptography of its own: the shares can be recovered with any conforming
third-party implementation, so the seed does not depend on this tool continuing
to exist.

## Documentation

| Document | What it covers |
|---|---|
| [SECURITY.md](./SECURITY.md) | How to verify a release before trusting it with a seed, how to run it, and how to report a vulnerability. |
| [THREAT-MODEL.md](./THREAT-MODEL.md) | What the tool protects against and, just as important, what it does not. The first thing a reviewer should read. |
| [SPECIFICATION.md](./SPECIFICATION.md) | How a BIP-39 mnemonic becomes a set of Shamir shares and back, so a shareholder can recover it without Seedhodler, from the standards alone. |
| [tools/forms/](./tools/forms/README.md) | The generator for the printable blank backup and custody forms, so the bundled PDFs are reproducible rather than opaque. |
| [seedhodler/seedhodler-os](https://github.com/seedhodler/seedhodler-os) | An offline, amnesiac live USB system that boots straight into this app, for running it on an air-gapped machine. |

## Run it offline

This matters more than any feature. A seed that has ever been typed or shown on
a machine with a network is already exposed, and disconnecting afterwards is too
late. Generate or restore a seed on a machine with no network:

- Download a release, [verify it](./SECURITY.md#verifying-a-release), copy the
  single file to an offline machine, and open it there; or
- Boot [Seedhodler OS](https://github.com/seedhodler/seedhodler-os), a live USB
  system that comes up air-gapped and opens the app for you.

[THREAT-MODEL.md](./THREAT-MODEL.md) states exactly which assumptions this rests
on, and where the protection ends.

## What it does

- **Generate** a fresh BIP-39 seed from the machine's cryptographic randomness,
  or enter an existing one. An advanced mode lets you supply your own entropy
  from dice or cards.
- **Split** it into *n* shares of which any *t* recover it, as either SLIP-39 or
  SSKR shares. SSKR is the recommended choice: a Trezor rejects an SSKR share
  outright, whereas it silently accepts a SLIP-39 share into a different, empty
  wallet. See the threat model for why this matters.
- **Print blank forms** and write the shares onto them by hand. The shares are
  never sent to the printer, so nothing about the seed is left in printer memory.
- **Restore** a seed by entering enough valid shares, and verify the recovery
  against your hardware wallet's first address before you rely on it.

The seed exists only in the page's memory: no `localStorage`, no `fetch`, no
network call anywhere. The in-app **Help and getting started** walks through the
whole flow.

## Development and releases

| Branch | Meaning |
|---|---|
| `dev` | Where work happens. Every push and pull request is built by CI; nothing is published. |
| `main` | The release branch. A push here builds and publishes to [seedhodler.io](https://seedhodler.io/). |

To release, fast-forward `main` to the reviewed state of `dev`:

```sh
git push origin origin/dev:main
```

There is deliberately no public preview of `dev`. An unreviewed build of a tool
that handles seed phrases should not be reachable by anyone who might mistake it
for the real one. To look at `dev`, run it locally:

```sh
npm ci
npm start
```

### One file

`npm run build` produces a single `build/index.html` with everything inlined:
the JavaScript, the stylesheet, the fonts, and every image. Nothing is fetched
after the page has loaded, so it works on a machine with no route to the
internet, and it can be opened by double-clicking it.

`npm run check:selfcontained` proves that, by reading the attributes a browser
loads from rather than grepping for URLs. CI runs it on every build. Routing
goes through the location hash for the same reason: a path-based router would
navigate to `/` on start, which from a file is the root of the filesystem, and
the page would be gone before anyone saw it.

### Container

Or run the container, which is what CI builds from `dev`:

```sh
docker build -t seedhodler .
docker run --rm -p 8080:80 seedhodler
```

CI publishes the same image to `ghcr.io/seedhodler/seedhodler:dev`. The package
is private on purpose, so pulling it needs a token with `read:packages`:

```sh
echo "$GITHUB_TOKEN" | docker login ghcr.io -u <your-user> --password-stdin
docker pull ghcr.io/seedhodler/seedhodler:dev
```

### Signed releases

Tagging `vX.Y.Z` builds the single-file `seedhodler-<version>.html` and publishes
it with `SHA256SUMS.txt`, a minisign signature, and a GitHub build-provenance
attestation. The build is reproducible: the same commit yields the same file with
the same hash, so a published release can be reproduced from source and checked
byte for byte. [SECURITY.md](./SECURITY.md#verifying-a-release) has the
verification steps.

## The share format

[SPECIFICATION.md](./SPECIFICATION.md) describes how a BIP-39 mnemonic becomes a
set of Shamir shares and how it comes back. It exists so that a holder of the
shares can recover the mnemonic without Seedhodler, from the referenced standards
alone.

`npm test` checks this app against that document and against the frozen vectors
in [`seedhodler-test-vectors.json`](./seedhodler-test-vectors.json). CI
additionally recovers freshly generated shares using third-party BIP-39,
SLIP-0039, and SSKR implementations, so the promise above is tested rather than
claimed.

## License

See [LICENCE](./LICENCE).
