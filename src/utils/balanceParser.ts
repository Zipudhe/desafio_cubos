export const parseBalanceToFloat = (balance: string) => {
  const balanceWithouSybom = balance.slice(1, balance.length)
  return Number.parseFloat(balanceWithouSybom)
}
