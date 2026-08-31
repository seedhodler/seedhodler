// Dice entropy is base 6: six faces, accumulated big-endian. BigInt because a
// full 256-bit seed is around 100 dice rolls, well past Number's safe integer
// range. The caller maps face 6 -> 0 first, so every digit here is 0-5; a digit
// outside that range yields NaN and BigInt throws, which is the right fail-loud
// (the 1-6 input regex already gates this upstream).
export const diceToBigInt = (digits: string): bigint => {
  const base = BigInt(6)
  let num = BigInt(0)
  for (const digit of digits) {
    num = num * base + BigInt(parseInt(digit, 6))
  }
  return num
}
