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
        html: `The answer is not to unplug now. It is to start clean: boot a <b>live USB operating system</b> with no network and run Seedhodler there. Nothing you do is written to the machine, and nothing can reach the network.`,
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
      { type: "h", html: `Compatibility, read this first` },
      {
        type: "ul",
        items: [
          `Seedhodler is for <b>BIP-39</b> wallets, such as Ledger. Use it only for those.`,
          `<b>Do not mix systems.</b> Trezor and other native SLIP-39 shares are not interchangeable with Seedhodler shares. Combining them reconstructs a <b>different</b> wallet, with no error and no warning.`,
          `Your shares are standard <b>SLIP-0039</b>. Any compatible implementation can recombine them, so your recovery never depends on this website staying online.`,
        ],
      },
    ],
  },
]
