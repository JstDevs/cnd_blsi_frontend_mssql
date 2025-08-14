export const formatCurrency = (value) =>
  value !== null && value !== undefined && value !== ''
    ? Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '—';

export const formatCurrencyWithoutDecimal = (value) =>
  value !== null && value !== undefined && value !== ''
    ? Number(value).toLocaleString(undefined, { minimumFractionDigits: 0 })
    : '—';
