// CollectionReportPrintView.jsx
import React, { forwardRef } from 'react';

const CollectionReportPrintView = forwardRef(({ type, data }, ref) => {
  return (
    <div ref={ref} className="p-6 text-black text-sm">
      {/* Daily Report */}
      {type === 'daily' && (
        <div>
          <h2 className="text-xl font-bold text-center">
            Republic of the Philippines
          </h2>
          <h3 className="text-lg text-center">DAILY COLLECTION REPORT</h3>
          <table className="w-full border mt-6">
            <thead>
              <tr>
                <th className="border p-2">OR Date</th>
                <th className="border p-2">OR No</th>
                <th className="border p-2">Payor</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Posted By</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{row.ORDate}</td>
                  <td className="border p-2">{row.ORNo}</td>
                  <td className="border p-2">{row.Payor}</td>
                  <td className="border p-2 text-right">
                    {row.Amount?.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'PHP',
                    })}
                  </td>
                  <td className="border p-2">{row.PostedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 flex justify-between">
            <p>Prepared By: __________</p>
            <p>Noted By: __________</p>
          </div>
        </div>
      )}

      {/* Monthly Report */}
      {type === 'monthly' && (
        <div>
          <h2 className="text-xl font-bold text-center">
            MONTHLY COLLECTION SUMMARY
          </h2>
          <table className="w-full border mt-6">
            <thead>
              <tr>
                <th className="border p-2">Month</th>
                <th className="border p-2">Year</th>
                <th className="border p-2">Charge Account</th>
                <th className="border p-2">Expense Name</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Date Range</th>
                <th className="border p-2">Processed By</th>
                <th className="border p-2">Position</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{row.Month}</td>
                  <td className="border p-2">{row.Year}</td>
                  <td className="border p-2">{row.ChargeAccountID}</td>
                  <td className="border p-2">{row.Name}</td>
                  <td className="border p-2 text-right">
                    {row.SubTotal?.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'PHP',
                    })}
                  </td>
                  <td className="border p-2">
                    {row.Date1} to {row.Date2}
                  </td>
                  <td className="border p-2">{row.FullName}</td>
                  <td className="border p-2">{row.Position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quarterly Report */}
      {type === 'quarterly' && (
        <div>
          <h2 className="text-xl font-bold text-center">
            QUARTERLY COLLECTION SUMMARY
          </h2>
          <table className="w-full border mt-6">
            <thead>
              <tr>
                <th className="border p-2">Quarter</th>
                <th className="border p-2">Year</th>
                <th className="border p-2">Charge Account</th>
                <th className="border p-2">Expense Name</th>
                <th className="border p-2">Fund Name</th>
                <th className="border p-2">Breakdown</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Processed By</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{row.Quarter}</td>
                  <td className="border p-2">{row.Year}</td>
                  <td className="border p-2">{row.ChargeAccountID}</td>
                  <td className="border p-2">{row.Name}</td>
                  <td className="border p-2">{row.FundName}</td>
                  <td className="border p-2">
                    Q1: {row.First} | Q2: {row.Second} | Q3: {row.Third}
                  </td>
                  <td className="border p-2 text-right">
                    {row.Total?.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'PHP',
                    })}
                  </td>
                  <td className="border p-2">{row.FullName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Flexible Report */}
      {type === 'flexible' && (
        <div>
          <h2 className="text-xl font-bold text-center">
            FLEXIBLE COLLECTION REPORT
          </h2>
          <table className="w-full border mt-6">
            <thead>
              <tr>
                <th className="border p-2">Date Range</th>
                <th className="border p-2">Invoice #</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Municipality</th>
                <th className="border p-2">Province</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Processed By</th>
                <th className="border p-2">Noted By</th>
                <th className="border p-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td className="border p-2">
                    {row.StartDate} to {row.EndDate}
                  </td>
                  <td className="border p-2">{row.InvoiceNumber}</td>
                  <td className="border p-2">{row.CustomerName}</td>
                  <td className="border p-2">{row.Municipality}</td>
                  <td className="border p-2">{row.Province}</td>
                  <td className="border p-2 text-right">
                    {row.Total?.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'PHP',
                    })}
                  </td>
                  <td className="border p-2">
                    {row.Prepare} ({row.PreparePosition})
                  </td>
                  <td className="border p-2">
                    {row.Poster} ({row.NotedPosition})
                  </td>
                  <td className="border p-2">{row.Note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

CollectionReportPrintView.displayName = 'CollectionReportPrintView';
export default CollectionReportPrintView;
