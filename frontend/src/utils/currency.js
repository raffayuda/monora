const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatRupiah(amount) {
  const value = Number(amount) || 0
  return rupiahFormatter.format(Math.round(value))
}