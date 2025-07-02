// import React, { useState, useEffect } from 'react';

// export default function SubtotalCalculator() {
//   const [quantity, setQuantity] = useState(0);
//   const [itemPrice, setItemPrice] = useState(0);
//   const [taxRate, setTaxRate] = useState(0);
//   const [discountRate, setDiscountRate] = useState(0);
//   const [ewtRate, setEwtRate] = useState(0);
//   const [isVatable, setIsVatable] = useState(false);

//   const [subtotalBeforeDiscount, setSubtotalBeforeDiscount] = useState(0);
//   const [subtotalExclVAT, setSubtotalExclVAT] = useState(0);
//   const [vat, setVat] = useState(0);
//   const [withheld, setWithheld] = useState(0);
//   const [ewt, setEwt] = useState(0);
//   const [totalDeduction, setTotalDeduction] = useState(0);
//   const [subtotal, setSubtotal] = useState(0);

//   useEffect(() => {
//     const qty = parseFloat(quantity) || 0;
//     const price = parseFloat(itemPrice) || 0;
//     const rate = parseFloat(taxRate) || 0;
//     const discount = parseFloat(discountRate) / 100 || 0;
//     const ewtVal = parseFloat(ewtRate) || 0;
//     const vatRate = 12;

//     const subBeforeDisc = price * qty;
//     const discountAmt = +(subBeforeDisc * discount).toFixed(2);
//     let subIncl = 0, subExcl = 0, vatAmount = 0;

//     if (isVatable) {
//       subIncl = +(subBeforeDisc - discountAmt).toFixed(2);
//       vatAmount = +(subIncl * vatRate / (100 + vatRate)).toFixed(2);
//       subExcl = +(subIncl - vatAmount).toFixed(2);
//     } else {
//       vatAmount = +(subBeforeDisc * 0.12).toFixed(2);
//       subIncl = +(subBeforeDisc + vatAmount).toFixed(2);
//       subExcl = price;
//     }

//     const withheldAmt = +((subExcl * rate / 100) * -1).toFixed(2);
//     const ewtAmt = +((subExcl * ewtVal / 100) * -1).toFixed(2);
//     const totalDeduct = +(withheldAmt + ewtAmt).toFixed(2);
//     const subTotalFinal = +(subIncl + totalDeduct).toFixed(2);

//     setSubtotalBeforeDiscount(+subBeforeDisc.toFixed(2));
//     setSubtotalExclVAT(+subExcl.toFixed(2));
//     setVat(vatAmount);
//     setWithheld(withheldAmt);
//     setEwt(ewtAmt);
//     setTotalDeduction(totalDeduct);
//     setSubtotal(subTotalFinal);
//   }, [quantity, itemPrice, taxRate, discountRate, ewtRate, isVatable]);

//   return (
//     <div className="grid gap-2 p-4 max-w-md mx-auto">
//       <h2 className="text-lg font-bold">Subtotal Calculator</h2>
//       <label>Quantity <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} /></label>
//       <label>Item Price <input type="number" value={itemPrice} onChange={e => setItemPrice(e.target.value)} /></label>
//       <label>Tax Rate (%) <input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} /></label>
//       <label>Discount Rate (%) <input type="number" value={discountRate} onChange={e => setDiscountRate(e.target.value)} /></label>
//       <label>EWT Rate (%) <input type="number" value={ewtRate} onChange={e => setEwtRate(e.target.value)} /></label>
//       <label className="flex gap-2 items-center">
//         <input type="checkbox" checked={isVatable} onChange={e => setIsVatable(e.target.checked)} /> Vatable
//       </label>

//       <div className="p-2 border rounded bg-gray-50">
//         <div>Price Subtotal Excluding VAT: <strong>{subtotalExclVAT.toLocaleString()}</strong></div>
//         <div>Sub-Total: {subtotalBeforeDiscount.toLocaleString()}</div>
//         <div>VAT: {vat}</div>
//         <div>Withheld: {withheld}</div>
//         <div>EWT: {ewt}</div>
//         <div>Total Deduction: {totalDeduction}</div>
//         <div className="font-bold">Final Subtotal: ₱{subtotal.toLocaleString()}</div>
//       </div>
//     </div>
//   );
// }
