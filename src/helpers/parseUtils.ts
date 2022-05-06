// TODO: !!! recheck function and remove TS ignore
// There's no built-in parsing for base 6, so:
// @ts-ignore
export const parseBigInt = (str: string, base = 10) => {
  if (typeof base !== "number" || isNaN(base) || base < 2 || base > 36) {
    throw new Error(`parseBigInt doesn't support base ${base}`)
  }
  let num = BigInt(0)
  // @ts-ignore
  base = BigInt(base)
  for (const digit of str) {
    // @ts-ignore
    num *= base
    num += BigInt(parseInt(digit, 6))
  }
  return num
}
