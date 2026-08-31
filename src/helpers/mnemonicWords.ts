// Split a mnemonic string into its words. Most wordlists join with a normal
// space; Japanese uses U+3000, the ideographic space, so split on either. This
// is string handling for display, not crypto, so it lives with the helpers.
export const mnemonicToWords = (mnemonic: string): string[] => mnemonic.split(/[ 　]/)
