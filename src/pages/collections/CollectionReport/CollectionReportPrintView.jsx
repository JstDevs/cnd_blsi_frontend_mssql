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
      {type === 'monthly' && (() => {
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

        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        const monthIndex = data.length > 0 ? parseInt(data[0].Month) - 1 : -1;
        const monthName = monthIndex >= 0 ? monthNames[monthIndex] : '';
        const year = data.length > 0 ? data[0].Year : '';

        const preparerName = data.length > 0 ? data[0].FullName : '';
        const preparerPosition = data.length > 0 ? data[0].Position : '';

        return (
          <div className="p-4 leading-tight" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Centered Header */}
            <div className="text-center mb-8 uppercase">
              <p className="text-base tracking-widest">CITY OF PASSI</p>
              <p className="font-bold text-lg mt-1">OFFICE OF THE CITY TREASURER</p>
              <p className="font-bold text-base mt-4 underline">MONTHLY SUMMARY OF COLLECTION {year}</p>
            </div>

            {/* Custom Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-2 border-black border-collapse text-xs">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="w-12 border-r-2 border-black"></th>
                    <th className="p-1 border-r-2 border-black text-left font-normal italic"></th>
                    <th className="w-24 border-r-2 border-black text-[10px] leading-none uppercase font-bold text-center">
                      ACCOUNT<br />CODE
                    </th>
                    <th className="w-32 font-bold text-sm text-center">{monthName}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedByFund).map(([fundName, fundData]) => (
                    <React.Fragment key={fundName}>
                      {/* Fund Header */}
                      <tr style={{ backgroundColor: '#2dd44a' }} className="border-b-2 border-black">
                        <td className="border-r-2 border-black"></td>
                        <td colSpan="2" className="p-1 border-r-2 border-black font-bold uppercase">{fundName}</td>
                        <td className="border-black"></td>
                      </tr>
                      {/* Accounts */}
                      {fundData.accounts.map((row, idx) => (
                        <tr key={idx} className="border-b border-black">
                          <td className="border-r-2 border-black text-center"></td>
                          <td className="p-1 pl-6 border-r-2 border-black font-normal">{row.ChartOfAccounts}</td>
                          <td className="border-r-2 border-black text-center font-bold">{row.ChargeAccountID}</td>
                          <td className="p-1 text-right font-bold">
                            {Number(row.SubTotal || 0).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))}
                      {/* Fund Sub-Total */}
                      <tr style={{ backgroundColor: '#ffff00' }} className="border-b-2 border-black font-bold">
                        <td className="border-r-2 border-black"></td>
                        <td colSpan="2" className="p-1 border-r-2 border-black text-center uppercase">Sub-Total</td>
                        <td className="p-1 text-right">
                          {fundData.total.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                  {/* Grand Total */}
                  <tr style={{ backgroundColor: '#77ced9' }} className="font-bold border-black">
                    <td className="border-r-2 border-black"></td>
                    <td colSpan="2" className="p-1 border-r-2 border-black uppercase">TOTAL COLLECTIONS</td>
                    <td className="p-1 text-right">
                      {grandTotal.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signature Section */}
            <div className="mt-8">
              <p className="text-[10px] italic">Prepared by:</p>
              <div className="mt-4">
                <p className="font-bold text-sm mb-0">{preparerName || 'Clark E. Entac'}</p>
                <p className="text-[10px]">{preparerPosition || 'Budget Head'}</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Quarterly Report */}
      {/* Quarterly Report */}
      {type === 'quarterly' && (() => {
        // 1. Get info from first row
        const year = data.length > 0 ? data[0].Year : '';
        const quarter = data.length > 0 ? data[0].Quarter : '';
        const preparerName = data.length > 0 ? data[0].FullName : '';
        const preparerPosition = data.length > 0 ? data[0].Position : '';

        // 2. Determine month column labels based on quarter
        const monthLabels = {
          '1': ['January', 'February', 'March'],
          '2': ['April', 'May', 'June'],
          '3': ['July', 'August', 'September'],
          '4': ['October', 'November', 'December'],
        };
        const quarterNum = String(quarter).replace(/\D/g, '').trim() || '1';
        const [m1, m2, m3] = monthLabels[quarterNum] || monthLabels['1'];

        const quarterLabel =
          quarterNum === '1' ? '1st Qtr.' :
            quarterNum === '2' ? '2nd Qtr.' :
              quarterNum === '3' ? '3rd Qtr.' : '4th Qtr.';

        // 3. Group rows by FundName
        const groupedByFund = data.reduce((acc, row) => {
          const fund = row.FundName || 'Unknown Fund';
          if (!acc[fund]) acc[fund] = { accounts: [], m1: 0, m2: 0, m3: 0, total: 0 };
          acc[fund].accounts.push(row);
          acc[fund].m1 += Number(row.First || 0);
          acc[fund].m2 += Number(row.Second || 0);
          acc[fund].m3 += Number(row.Third || 0);
          acc[fund].total += Number(row.Total || 0);
          return acc;
        }, {});

        // 4. Compute grand totals
        const grandM1 = Object.values(groupedByFund).reduce((s, f) => s + f.m1, 0);
        const grandM2 = Object.values(groupedByFund).reduce((s, f) => s + f.m2, 0);
        const grandM3 = Object.values(groupedByFund).reduce((s, f) => s + f.m3, 0);
        const grandTotal = Object.values(groupedByFund).reduce((s, f) => s + f.total, 0);

        const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        return (
          <div className="p-4 leading-tight" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <div className="text-center mb-4">
              <p className="font-bold text-base uppercase tracking-widest">OFFICE OF THE CITY TREASURER</p>
              <p className="font-bold text-sm mt-1">SUMMARY OF COLLECTION ({quarterLabel} CY - {year})</p>
            </div>

            {/* Table */}
            <table className="w-full border-2 border-black border-collapse text-xs">
              <thead>
                <tr className="border-2 border-black">
                  <th className="border-2 border-black p-1 text-center font-bold">LOCAL SOURCES</th>
                  <th className="border-2 border-black p-1 text-center font-bold">{m1} {year}</th>
                  <th className="border-2 border-black p-1 text-center font-bold">{m2} {year}</th>
                  <th className="border-2 border-black p-1 text-center font-bold">{m3} {year}</th>
                  <th className="border-2 border-black p-1 text-center font-bold">TOTAL ({quarterLabel})</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedByFund).map(([fundName, fundData]) => (
                  <React.Fragment key={fundName}>
                    {/* Fund header row */}
                    <tr className="border border-black">
                      <td colSpan={5} className="p-1 font-bold border border-black uppercase">{fundName}:</td>
                    </tr>
                    {/* Account rows */}
                    {fundData.accounts.map((row, idx) => (
                      <tr key={idx} className="border border-black">
                        <td className="p-1 pl-4 border border-black">{row.Name}</td>
                        <td className="p-1 text-right border border-black">{Number(row.First) ? fmt(row.First) : ''}</td>
                        <td className="p-1 text-right border border-black">{Number(row.Second) ? fmt(row.Second) : ''}</td>
                        <td className="p-1 text-right border border-black">{Number(row.Third) ? fmt(row.Third) : ''}</td>
                        <td className="p-1 text-right border border-black">{fmt(row.Total)}</td>
                      </tr>
                    ))}
                    {/* Sub-total row */}
                    <tr className="border-2 border-black font-bold">
                      <td className="p-1 text-center border border-black italic">sub - total</td>
                      <td className="p-1 text-right border border-black">{fmt(fundData.m1)}</td>
                      <td className="p-1 text-right border border-black">{fmt(fundData.m2)}</td>
                      <td className="p-1 text-right border border-black">{fmt(fundData.m3)}</td>
                      <td className="p-1 text-right border border-black">{fmt(fundData.total)}</td>
                    </tr>
                  </React.Fragment>
                ))}
                {/* Grand Total */}
                <tr className="border-2 border-black font-bold">
                  <td className="p-1 border border-black uppercase">GRAND TOTAL</td>
                  <td className="p-1 text-right border border-black">{fmt(grandM1)}</td>
                  <td className="p-1 text-right border border-black">{fmt(grandM2)}</td>
                  <td className="p-1 text-right border border-black">{fmt(grandM3)}</td>
                  <td className="p-1 text-right border border-black">{fmt(grandTotal)}</td>
                </tr>
              </tbody>
            </table>

            {/* Signature */}
            <div className="mt-6">
              <p className="text-xs italic">Prepared By:</p>
              <div className="mt-4 text-center" style={{ width: '200px' }}>
                <p className="font-bold text-sm">{preparerName || 'Clark E. Entac'}</p>
                <p className="text-xs">{preparerPosition || 'Budget Head'}</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Flexible Report */}
      {type === 'flexible' && (() => {
        const totalAmount = data.reduce((sum, row) => sum + Number(row.Total || 0), 0);
        const totalRecords = data.length;

        // Format date helper
        const fmtDate = (d) => {
          if (!d) return '';
          const dt = new Date(d);
          if (isNaN(dt)) return d;
          const mm = String(dt.getMonth() + 1).padStart(2, '0');
          const dd = String(dt.getDate()).padStart(2, '0');
          const yyyy = dt.getFullYear();
          return `${mm}/${dd}/${yyyy}`;
        };

        // Get date range from first/last rows (or from StartDate/EndDate of data)
        const startDate = data.length > 0 ? fmtDate(data[0].StartDate || data[0].InvoiceDate) : '';
        const endDate = data.length > 0 ? fmtDate(data[data.length - 1].EndDate || data[data.length - 1].InvoiceDate) : '';

        // Signatory info from first row
        const preparedByName = data.length > 0 ? (data[0].Prepare || '') : '';
        const preparedByPos = data.length > 0 ? (data[0].PreparePosition || '') : '';
        const notedByName = data.length > 0 ? (data[0].Poster || '') : '';
        const notedByPos = data.length > 0 ? (data[0].NotedPosition || '') : '';

        const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        return (
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', padding: '20px', color: '#000' }}>
            {/* Government Header */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '11px', margin: '0' }}>Republic of the Philippines</p>
              <p style={{ fontWeight: 'bold', fontSize: '11px', margin: '0' }}>PROVINCE OF SAN DIONISIO</p>
              <p style={{ fontWeight: 'bold', fontSize: '11px', margin: '0' }}>Municipality of ILOILO</p>
              <p style={{ fontWeight: 'bold', fontSize: '11px', margin: '0' }}>OFFICE OF THE MUNICIPAL TREASURER</p>
            </div>

            <hr style={{ borderTop: '2px solid #000', marginBottom: '16px' }} />

            {/* Report Title */}
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '16px', margin: '0' }}>Collection Report</p>
              <p style={{ fontWeight: 'bold', fontSize: '11px', margin: '2px 0 0 0' }}>
                OR DATE {startDate} TO {endDate}
              </p>
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000' }}>
                  <th style={{ padding: '4px 8px', textAlign: 'left', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>OR DATE</th>
                  <th style={{ padding: '4px 8px', textAlign: 'left', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>OR No</th>
                  <th style={{ padding: '4px 8px', textAlign: 'left', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>PAYOR</th>
                  <th style={{ padding: '4px 8px', textAlign: 'right', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>Amount</th>
                  <th style={{ padding: '4px 8px', textAlign: 'left', fontWeight: 'bold' }}>Posted By</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '3px 8px', borderRight: '1px solid #ccc' }}>
                      {fmtDate(row.InvoiceDate || row.StartDate)}
                    </td>
                    <td style={{ padding: '3px 8px', borderRight: '1px solid #ccc' }}>
                      {row.InvoiceNumber}
                    </td>
                    <td style={{ padding: '3px 8px', borderRight: '1px solid #ccc' }}>
                      {row.CustomerName}
                    </td>
                    <td style={{ padding: '3px 8px', textAlign: 'right', borderRight: '1px solid #ccc' }}>
                      {fmt(row.Total)}
                    </td>
                    <td style={{ padding: '3px 8px', color: '#1a56db' }}>
                      {row.Prepare}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid #000' }}>
                  <td colSpan={2} style={{ padding: '4px 8px', fontWeight: 'bold' }}>
                    Total Records: {totalRecords}
                  </td>
                  <td style={{ padding: '4px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                    Total Amount:
                  </td>
                  <td style={{ padding: '4px 8px', textAlign: 'right', fontWeight: 'bold', fontSize: '13px' }}>
                    {fmt(totalAmount)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>

            {/* Signatories */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '11px', margin: '0 0 16px 0' }}>Prepared By:</p>
                <p style={{ fontWeight: 'bold', fontSize: '12px', margin: '0', textAlign: 'center' }}>
                  {preparedByName || 'Accounting S. Head'}
                </p>
                <p style={{ fontSize: '11px', margin: '0', textAlign: 'center', color: '#1a56db' }}>
                  {preparedByPos || 'Accounting Head'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '11px', margin: '0 0 16px 0' }}>Noted By:</p>
                <p style={{ fontWeight: 'bold', fontSize: '12px', margin: '0', textAlign: 'center' }}>
                  {notedByName || 'Mayor S. Office'}
                </p>
                <p style={{ fontSize: '11px', margin: '0', textAlign: 'center', color: '#1a56db' }}>
                  {notedByPos || 'Mayor'}
                </p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
});

CollectionReportPrintView.displayName = 'CollectionReportPrintView';
export default CollectionReportPrintView;
