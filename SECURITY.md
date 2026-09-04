# Security

## Verifying a release

Every release ships one self-contained file, `seedhodler-<version>.html`, along
with `SHA256SUMS.txt` and minisign signatures (`.minisig`). Verify it before you
trust it with a seed.

1. Checksum

   ```
   sha256sum -c SHA256SUMS.txt
   ```

2. minisign signature (public key: `minisign.pub` in this repository)

   ```
   minisign -Vm seedhodler-<version>.html -p minisign.pub
   ```

3. Build provenance (GitHub attestation)

   ```
   gh attestation verify seedhodler-<version>.html --repo seedhodler/seedhodler
   ```

4. Reproduce from source (optional, strongest)

   Check out the release tag and run `npm ci && npm run build`. The resulting
   `build/index.html` has the same SHA-256 as the published file: the build is
   deterministic for a given commit.

## Running it

Run Seedhodler offline. A seed that has ever been on an online computer is
already exposed, and unplugging afterwards is too late. Boot a live USB
operating system with no network and open the file there.

## Reporting a vulnerability

Please report security issues privately rather than in a public issue.
