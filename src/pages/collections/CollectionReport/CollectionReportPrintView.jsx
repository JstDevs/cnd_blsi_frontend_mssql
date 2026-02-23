// CollectionReportPrintView.jsx
import React, { forwardRef } from 'react';

const CollectionReportPrintView = forwardRef(({ type, data }, ref) => {
  return (
    <div ref={ref} className="p-6 text-black text-sm">
      {/* Daily Report */}
      {type === 'daily' && (() => {
        // Grouping logic
        const groupedByFund = data.reduce((acc, row) => {
          const fund = row.Name || 'Unknown Fund';
          if (!acc[fund]) {
            acc[fund] = {
              accounts: [],
              total: 0
            };
          }
          acc[fund].accounts.push(row);
          acc[fund].total += Number(row.SubTotal || 0);
          return acc;
        }, {});

        const grandTotal = Object.values(groupedByFund).reduce((sum, fund) => sum + fund.total, 0);

        const reportDate = data.length > 0 && data[0].Date
          ? new Date(data[0].Date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : '';

        const preparerName = data.length > 0 ? data[0].FullName : '';
        const preparerPosition = data.length > 0 ? data[0].Position : '';

        return (
          <div className="p-4 leading-tight" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Header Date */}
            <div className="mb-6">
              <p className="font-bold text-base">{reportDate}</p>
            </div>

            {/* Funds and Accounts */}
            <div className="space-y-6 mb-8">
              {Object.entries(groupedByFund).map(([fundName, fundData]) => (
                <div key={fundName}>
                  <p className="font-bold mb-1 uppercase">{fundName}</p>
                  <div className="pl-0">
                    {fundData.accounts.map((row, idx) => (
                      <div key={idx} className="flex max-w-xl text-sm">
                        <span className="w-72">{row.Account}</span>
                        <span className="w-32 text-right">
                          {Number(row.SubTotal || 0).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    ))}
                    <div className="flex max-w-2xl mt-2 font-bold text-lg">
                      <span className="w-[26rem]"></span>
                      <span className="w-32 text-right">
                        {fundData.total.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Grand Total Section */}
            <div className="mb-8">
              <p className="font-bold mb-2 uppercase">GRAND TOTAL</p>
              <div className="space-y-1">
                {Object.entries(groupedByFund).map(([fundName, fundData]) => (
                  <div key={fundName} className="flex max-w-xl font-bold text-sm">
                    <span className="w-72">{fundName}</span>
                    <span className="w-32 text-right">
                      {fundData.total.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signatories */}
            <div className="mt-4 flex justify-center w-[30rem]">
              <div className="text-center">
                <p className="mb-1 text-sm italic">Prepared:</p>
                <p className="font-bold text-base mb-0">{preparerName || 'Clark E. Entac'}</p>
                <p className="text-sm">{preparerPosition || 'Budget Head'}</p>
              </div>
            </div>
          </div>
        );
      })()}

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
