// accountingMath.js
export function obligationRequestItemsCalculator({
  price = '',
  quantity = '',
  taxRate = '',
  discountPercent = '',
  vatable = false,
  ewtRate = 0, // percent (e.g. 1 for 1 %)
  vatRate = 12, // percent
}) {
  // Parse → numbers or 0
  const p = parseFloat(price) || 0;
  const q = parseFloat(quantity) || 0;
  const tax = parseFloat(taxRate) || 0;
  const discPct = (parseFloat(discountPercent) || 0) / 100;
  const ewtrate = parseFloat(ewtRate) || 0;

  let subtotalBeforeDiscount = 0;
  let discount = 0;
  let vat = 0;
  let subtotalTaxIncluded = 0;
  let subtotalTaxExcluded = 0;
  let withheld = 0;
  let ewt = 0;
  let totalDeduction = 0;
  let subtotal = 0;

  if (vatable) {
    subtotalBeforeDiscount = p * q; // price already VAT‑inclusive
    discount = +(subtotalBeforeDiscount * discPct).toFixed(2);
    subtotalTaxIncluded = +(subtotalBeforeDiscount - discount).toFixed(2);
    vat = +((subtotalTaxIncluded * vatRate) / (100 + vatRate)).toFixed(2);
    subtotalTaxExcluded = +(subtotalTaxIncluded - vat).toFixed(2);
  } else {
    subtotalBeforeDiscount = p * q;
    discount = +(subtotalBeforeDiscount * discPct).toFixed(2);
    vat = +((subtotalBeforeDiscount * vatRate) / 100).toFixed(2);
    subtotalTaxExcluded = +(subtotalBeforeDiscount - discount).toFixed(2);
    subtotalTaxIncluded = +(subtotalTaxExcluded + vat).toFixed(2);
  }

  // taxes
  withheld = +(((subtotalTaxExcluded * tax) / 100) * -1).toFixed(2);
  ewt = +(((subtotalTaxExcluded * ewtrate) / 100) * -1).toFixed(2);
  totalDeduction = +(withheld + ewt).toFixed(2);

  // final subtotal depends on vatable branch (mirrors VB code)
  subtotal = vatable
    ? +(subtotalTaxIncluded + totalDeduction).toFixed(2)
    : +(subtotalTaxExcluded + totalDeduction).toFixed(2);

  return {
    subtotalBeforeDiscount,
    discount,
    vat,
    subtotalTaxIncluded,
    subtotalTaxExcluded,
    withheld,
    ewt,
    ewtrate,
    totalDeduction,
    subtotal,
  };
}
