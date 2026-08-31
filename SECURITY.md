# Security Policy

## Why this matters

I build Seedhodler because self-custody needs a tool like it, and holding your
own keys shouldn't mean trusting someone else's goodwill. The source is open to
everyone, Seedhodler runs from GitHub under
[seedhodler.io](https://seedhodler.io/), it is free to use, and there is no
advertising and nothing to sell. I keep it going because I think it fills a
genuine gap, and I hope it makes self-custody easier for a lot of people.

That only works if the tool is actually safe. So if you spot a problem, I would rather
hear it from you early and in private than read about it later.

## How Seedhodler is meant to stay safe

The safety does not rest on trusting me, or GitHub, or any single dependency. It
rests on a small, checkable base:

1. **The cryptography is correct.** Generate, split, and restore round-trip, and
   the shares can be rebuilt with third-party BIP-39 / SLIP-0039 / SSKR code.
   This is what the [specification](./SPECIFICATION.md) and the test vectors pin
   down.
2. **You run it air-gapped.** Loaded once with the network off, there is no
   channel for anything to leave the machine.
3. **The build is genuine.** Seedhodler ships as a single self-contained HTML
   file whose hash can be recomputed from source, so a tampered copy is
   detectable before it runs.

Put those three together and most of what usually worries people falls away. A
vulnerable npm dependency, or the fact that the page is hosted on GitHub, cannot
by itself reach a seed: there is no network for it to leak through, and a build
that was tampered with, through a dependency or the host, no longer matches its hash. The single-file-plus-hash model exists precisely to answer
supply-chain and hosting worries.

What this structure **cannot** argue away is the randomness. If the entropy that
generates a seed, *or* the randomness that splits it, is predictable or known to
an attacker, the shares are valid and verifiable and still worthless. And with backdoored
split randomness, a single share below the threshold could be enough.
That is the part worth the hardest scrutiny: the default generator, and the
entropy you enter yourself in advanced mode.

Two honesties. The strong version of all this holds for the air-gapped,
hash-verified path; used online on an everyday machine, the guarantees weaken to
whatever that machine and network allow. And signed releases with published
hashes are still on the roadmap: the live build is reproducible and carries the
commit it was built from in its footer, but the one-click "verify the hash"
release flow is not there yet.

## Honest status: not reviewed yet

Seedhodler is being brought back into a shape that can be properly audited. It
has an internal review, the written specification with test vectors, and
continuous checks. But **no independent security review has happened yet.**
Until it has, please treat it as pre-release:

- Practise recovery with a throwaway seed before you rely on it.
- Don't run a seed that holds real funds through a build you haven't verified.

**If you review software like this, or you know a reputable auditor who does, I
would genuinely like to hear from you.** Finding the right reviewing partner for
a tool of this kind is part of what I'm working on, and a good recommendation
helps as much as a bug report. I'll say so plainly in the README and the release
notes once an outside review is done.

## If you find something

**Please tell me privately.** Don't open a public issue, pull request, or
discussion for a security problem, and please don't post a working exploit in
the open. That puts everyone still on an old build at risk.

The private channel is on GitHub:

1. Open the **Security** tab of this repository.
2. Click **Report a vulnerability**.
3. Describe what you found.

What helps me most:

- what the problem is and why it matters;
- which version: the commit shown in the page footer, or the release tag;
- steps, or a minimal case, that reproduce it;
- for a crypto issue, the inputs and the expected versus actual result, so I can
  turn it straight into a test vector.

If GitHub's private reporting doesn't work for you, open a bare issue that just
says *"security report, please open a private channel"* (with **no detail**),
and I'll reach out.

## What happens next

I read these myself. I'll get back to you quickly, realistically within a few
days, and tell you whether I can reproduce it. Then we agree on timing: the
normal path is that the fix ships first and the details go public afterwards,
with credit to you unless you'd rather stay anonymous. Anything that touches the
randomness, breaks a share's round-trip, or lets a tampered build pass as
genuine, I treat as urgent.

## What counts, and what doesn't

The [threat model](./THREAT-MODEL.md) is the full statement. Framed by the three
pillars above, the things most worth reporting are:

**The randomness**, the highest-value target

- a way to predict or influence the seed the default generator produces;
- predictable or attacker-known randomness in the splitting, especially anything
  that leaks the secret from fewer than the threshold number of shares.

**The cryptography**, checking it does what the spec says

- shares that don't round-trip, or that a conforming BIP-39 / SLIP-0039 / SSKR
  implementation can't recover;
- one scheme silently accepting or half-reading the other's shares instead of
  failing loudly.

**The build and its behaviour**, keeping genuine genuine

- a way to make an official build non-reproducible, or to serve a tampered build
  that still matches, or appears to match, its commit;
- anything that makes the page fetch, store, or send a seed, or touch the
  network at all once it has loaded.

**Known limits, not bugs.** The threat model explains why

- a compromised computer: malware, a keylogger, screen capture. This is why the
  air-gap matters, and the tool cannot defend a machine that is already owned;
- weak entropy you enter yourself in advanced mode, a known gap I'm tracking;
- physical theft or loss of enough printed shares;
- someone photographing, scanning, or backing up their own shares;
- how a third-party hardware wallet behaves, beyond the cross-use warning;
- an ordinary dependency advisory in the build tooling that never reaches the
  shipped file: report it if it changes what the built page *does*, not just
  because a scanner flagged a version;
- phishing or lookalike sites that aren't this repository or seedhodler.io.

Not sure which side something falls on? Send it anyway and let me judge.

## Checking the build you got

The whole point of a reproducible, single-file build is that you don't have to
take my word for what the server hands you:

- every build shows the **commit it was built from** in the page footer;
- the same commit produces a **byte-identical file**, so its SHA-256 can be
  recomputed from source;
- if a build you were served doesn't match the hash for the commit it claims,
  that itself is something I want to know.

A formal release flow that publishes those hashes is coming; until then,
verification means building the stated commit yourself and comparing.

## A note to researchers

If you look into this in good faith and give me a fair chance to fix things
before going public, thank you, genuinely. No lawyers, no drama. The only line
is the obvious one: test on your own seeds and your own funds, never anyone
else's.
