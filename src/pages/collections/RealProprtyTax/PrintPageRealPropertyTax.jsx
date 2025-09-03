// RealPropertyTaxReceipt.jsx
import React, { forwardRef } from 'react';

const PrintPageRealPropertyTax = forwardRef(({ property }, ref) => {
  if (!property) return null;

  return (
    <div
      ref={ref}
      className="w-full text-black p-8"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* Header */}
      <div className="flex justify-between text-sm mb-6">
        <div>
          <p className="font-bold">{property.Address}</p>
        </div>
        <div>
          <p>{new Date().toLocaleDateString()}</p>
          <p>{new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Owner Info */}
      <div className="mb-4">
        <p className="font-medium">{property.CustomerName}</p>
      </div>

      {/* Amount in Words */}
      <div className="mb-4 text-center font-medium">
        <p>{property.AmountInWords}</p>
      </div>

      {/* Table */}
      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr className="border-b">
            <th className="text-left py-1">Owner</th>
            <th className="text-left py-1">TD No.</th>
            <th className="text-right py-1">Assessed Value</th>
            <th className="text-right py-1">Market Value</th>
            <th className="text-center py-1">Year</th>
            <th className="text-right py-1">Basic Tax</th>
            <th className="text-right py-1">Penalty</th>
            <th className="text-right py-1">Discount</th>
            <th className="text-right py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {property.properties?.map((item, idx) => (
            <tr key={idx} className="border-b">
              <td className="py-1">{item.Owner}</td>
              <td className="py-1">{item.T_D_No}</td>
              <td className="py-1 text-right">
                {item.AssessedValue?.toLocaleString()}
              </td>
              <td className="py-1 text-right">
                {item.MarketValue?.toLocaleString()}
              </td>
              <td className="py-1 text-center">{item.Year}</td>
              <td className="py-1 text-right">{item.BasicTax}</td>
              <td className="py-1 text-right">{item.Penalty}</td>
              <td className="py-1 text-right">{item.Discount}</td>
              <td className="py-1 text-right">
                {item.Total?.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total */}
      <div className="flex justify-end font-bold text-lg">
        {property.TotalAmount?.toLocaleString()}
      </div>
    </div>
  );
});

PrintPageRealPropertyTax.displayName = 'PrintPageRealPropertyTax';
export default PrintPageRealPropertyTax;
