import { SEEDHODLER_OS_RELEASES_URL } from "./config"

export const cardDictionary = {
  ac: 0,
  "2c": 1,
  "3c": 2,
  "4c": 3,
  "5c": 4,
  "6c": 5,
  "7c": 6,
  "8c": 7,
  "9c": 8,
  tc: 9,
  jc: 10,
  qc: 11,
  kc: 12,
  ad: 13,
  "2d": 14,
  "3d": 15,
  "4d": 16,
  "5d": 17,
  "6d": 18,
  "7d": 19,
  "8d": 20,
  "9d": 21,
  td: 22,
  jd: 23,
  qd: 24,
  kd: 25,
  ah: 26,
  "2h": 27,
  "3h": 28,
  "4h": 29,
  "5h": 30,
  "6h": 31,
  "7h": 32,
  "8h": 33,
  "9h": 34,
  th: 35,
  jh: 36,
  qh: 37,
  kh: 38,
  as: 39,
  "2s": 40,
  "3s": 41,
  "4s": 42,
  "5s": 43,
  "6s": 44,
  "7s": 45,
  "8s": 46,
  "9s": 47,
  ts: 48,
  js: 49,
  qs: 50,
  ks: 51,
}

// The Help & getting started modal. One chapter per section, rendered by a
// left-hand nav. Block html is intentionally small (inline <b> and links only)
// and rendered with html-react-parser. Keep it English and free of em dashes.
export type HelpBlock =
  | { type: "p" | "h"; html: string }
  | { type: "ul" | "ol"; items: string[] }

export type HelpChapter = {
  id: string
  nav: string
  title: string
  blocks: HelpBlock[]
}

export const helpChapters: HelpChapter[] = [
  {
    id: "overview",
    nav: "Overview",
    title: "Overview",
    blocks: [
      {
        type: "p",
        html: `Seedhodler splits a wallet's master seed into several shares using <b>Shamir's Secret Sharing</b>, and recombines them when you need it back. You set the threshold, say any 3 of 5: fewer than that reveal nothing, while the number you chose restores the whole seed.`,
      },
      {
        type: "p",
        html: `It runs entirely in your browser as a single self-contained file. It sends nothing anywhere, works with any BIP-39 wallet, and produces standard SLIP-0039 shares that any compatible tool can restore, so your recovery is never locked to this website. Seedhodler is free and open source.`,
      },
      { type: "h", html: `What you can do here` },
      {
        type: "ul",
        items: [
          `<b>Generate</b> a fresh master seed, or enter one you already have.`,
          `<b>Split</b> it into shares with a threshold you choose.`,
          `<b>Restore</b> a seed by combining enough of its shares.`,
        ],
      },
    ],
  },
  {
    id: "safe",
    nav: "Stay safe",
    title: "Stay safe",
    blocks: [
      {
        type: "p",
        html: `Seedhodler never transmits your seed. Your computer is the part that can. Treat any seed that has ever been on an online machine as already exposed.`,
      },
      {
        type: "p",
        html: `The answer is not to unplug now. It is to start clean: boot <a href="${SEEDHODLER_OS_RELEASES_URL}" target="_blank" rel="noopener noreferrer"><b>Seedhodler OS</b></a>, a live USB operating system with no network, and run Seedhodler there. Nothing you do is written to the machine, and nothing can reach the network.`,
      },
      { type: "h", html: `While you work` },
      {
        type: "ul",
        items: [
          `Print the <b>blank</b> forms and write every word by hand. The words are never sent to the printer.`,
          `Never type a full seed or share into anything that could store or send it: notes apps, photos, cloud, email.`,
          `Keep the screen private. Anyone who sees a full seed, or enough shares, can take the funds.`,
        ],
      },
      {
        type: "p",
        html: `When you are done, close the tab. Seedhodler keeps nothing: reloading the page clears everything from memory.`,
      },
    ],
  },
  {
    id: "generate",
    nav: "Generate & split",
    title: "Generate & split",
    blocks: [
      {
        type: "p",
        html: `This follows the checklist in the sidebar. Take your time; there is nothing to rush and nothing to undo later.`,
      },
      {
        type: "ol",
        items: [
          `<b>Generate your Master Seed.</b> Let Seedhodler create a fresh one, or enter a seed you already have. For extra assurance, open the advanced toolset and supply your own entropy from dice or cards.`,
          `<b>Choose the split.</b> Pick how many shares to make and how many are needed to restore, for example 5 shares with a threshold of 3.`,
          `<b>Split.</b> Seedhodler produces the shares. Step through them with the arrows.`,
          `<b>Print and write.</b> Print one blank form per share and copy each share onto it by hand.`,
          `<b>Verify.</b> Check every share back against the tool, so a slip of the pen surfaces now, not years later.`,
        ],
      },
    ],
  },
  {
    id: "methods",
    nav: "SLIP-39 & SSKR",
    title: "Methods: SLIP-39 and SSKR",
    blocks: [
      {
        type: "p",
        html: `Seedhodler can split your seed two ways, both real Shamir secret sharing. <b>Use SSKR.</b> SLIP-39 is kept mainly for compatibility, and it carries a real mix-up risk that SSKR does not.`,
      },
      { type: "h", html: `SLIP-39` },
      {
        type: "p",
        html: `SLIP-39 shares are word lists, 20 or 33 words, the same format a Trezor uses for its built-in Shamir backup. A Trezor works fine with Seedhodler as an ordinary BIP-39 wallet; the trap is only its <b>built-in</b> Shamir feature. Because both speak SLIP-39, moving shares between Seedhodler and a Trezor's own Shamir is dangerous in <b>both</b> directions, and easy to do by accident:`,
      },
      {
        type: "ul",
        items: [
          `<b>Seedhodler shares in a Trezor's Shamir recovery:</b> the device accepts them and rebuilds a secret, but it reads that secret as a native SLIP-39 seed and derives a <b>different</b> wallet than your BIP-39 one. No error, no warning, an empty wallet. If you had already destroyed your original seed, the funds are gone.`,
          `<b>Trezor's own Shamir shares in Seedhodler:</b> the reverse goes wrong just as quietly. Seedhodler rebuilds the secret and re-encodes it as a BIP-39 mnemonic, which derives yet another wallet, not your Trezor one.`,
        ],
      },
      {
        type: "p",
        html: `The reason is the same each way: the shares carry an identical secret, but the two systems interpret that secret differently, so each derives its own wallet and nothing flags the mismatch. If you do use SLIP-39, <b>restore its shares only in the tool that made them,</b> and never mix Seedhodler with a Trezor's built-in Shamir. Its one advantage over SSKR is shorter word lists: 20 or 33 words instead of 25 or 41.`,
      },
      { type: "h", html: `SSKR` },
      {
        type: "p",
        html: `SSKR, from <a href="https://developer.blockchaincommons.com/sskr/" target="_blank" rel="noopener noreferrer"><b>Blockchain Commons</b></a>, avoids all of this. Its shares are encoded as bytewords, not as SLIP-39 word lists, so a hardware wallet cannot mistake them for a device seed; it rejects them outright. The silent wrong-wallet trap simply cannot happen.`,
      },
      {
        type: "p",
        html: `It is an open standard with reference tools, so you can restore SSKR shares here or with any Blockchain Commons implementation. For real funds, this is the one to pick. Reach for SLIP-39 only when you specifically need a tool that speaks it.`,
      },
    ],
  },
  {
    id: "store",
    nav: "Store & pass on",
    title: "Store & pass on",
    blocks: [
      {
        type: "p",
        html: `Shares only protect you if they are kept apart, and if they can still be understood later, including by someone who is not you.`,
      },
      { type: "h", html: `Storing the shares` },
      {
        type: "ul",
        items: [
          `Keep each share in a <b>separate</b> safe place: a home safe, a bank box, a trusted person.`,
          `Make sure holders cannot easily <b>collude</b>. Enough shares in one pair of hands is the same as the whole seed.`,
          `Run a full restore test first. Only then decide what to do with the original seed.`,
        ],
      },
      { type: "h", html: `The custody inserts` },
      {
        type: "p",
        html: `Seedhodler can print optional sheets that make the system survivable:`,
      },
      {
        type: "ul",
        items: [
          `<b>Envelope note</b>: tells whoever finds one share what it is, and that it is worthless alone.`,
          `<b>Custody overview</b>: your private map of which share sits where.`,
          `<b>Emergency and inheritance guide</b>: walks an heir through recovery, step by step.`,
        ],
      },
    ],
  },
  {
    id: "restore",
    nav: "Restore",
    title: "Restore",
    blocks: [
      {
        type: "p",
        html: `To rebuild a seed, open Restore and enter the shares one by one. Once you reach the threshold, the master seed reappears. Before you use it, confirm the first receiving address matches the wallet you expect.`,
      },
      {
        type: "p",
        html: `Seedhodler works with <b>any BIP-39 wallet</b>, Ledger, Trezor, Coldcard and the rest, and brings Shamir backup to all of them. Your shares are standard, so any compatible tool can recombine them; your recovery never depends on this website. Before combining shares with a different tool, read <b>Methods: SLIP-39 and SSKR</b>. The wrong mix can silently open a different wallet.`,
      },
    ],
  },
]
