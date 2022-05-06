import * as slip39 from "slip39/src/slip39"

export const getFormattedShares = (
  masterSecret: number[],
  passphrase: string,
  threshold: number,
  groups: number[][],
) => {
  const slipNode = slip39.fromArray(masterSecret, {
    passphrase,
    threshold,
    groups,
  })

  // for the case when we have multiple share groups
  // const shares = groups.map((_, index) => slipNode.fromPath("r/" + index).mnemonics)
  // return shares

  return slipNode.fromPath("r/" + 0).mnemonics
}
