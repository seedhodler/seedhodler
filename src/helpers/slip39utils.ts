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

  return slipNode.fromPath("r/" + 0).mnemonics
}
