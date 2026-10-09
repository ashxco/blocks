export function formatMoney(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatAmount(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2 }).format(amount)
}

/** Plain below 100,000 ("7,240"), compact from there ("610K", "3.2M"), so a meter never mixes the two styles. */
export function formatQuantity(value: number) {
  if (value >= 100_000) {
    return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value)
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value)
}
