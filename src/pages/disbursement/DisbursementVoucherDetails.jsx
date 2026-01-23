import {
  PencilIcon,
  PrinterIcon,
  XCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/currencyFormater';

function DisbursementVoucherDetails({ dv, linkedOBR, onClose, onEdit }) {

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    let bgColor = 'bg-neutral-100 text-neutral-800';

    switch (status) {
      case 'Pending Certification':
        bgColor = 'bg-warning-100 text-warning-800';
        break;
      case 'Pending Approval':
        bgColor = 'bg-primary-100 text-primary-800';
        break;
      case 'Approved for Payment':
      case 'Paid':
        bgColor = 'bg-success-100 text-success-800';
        break;
      case 'Cancelled':
      case 'Rejected':
        bgColor = 'bg-error-100 text-error-800';
        break;
      default:
        break;
    }

    return bgColor;
  };

  return (
    <div className="space-y-6">
      {/* Status and actions header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span
          className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusBadge(
            dv.status
          )}`}
        >
          {dv.status}
        </span>

        <div className="flex space-x-2">
          <button
            type="button"
            className="btn btn-outline flex items-center"
            onClick={onEdit}
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button type="button" className="btn btn-outline flex items-center">
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Main details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">
            DV Details
          </h3>

          <dl className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                DV Number
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {dv.InvoiceNumber}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Date</dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {dv.InvoiceDate ? formatDate(dv.InvoiceDate) : 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                CAFOA Number
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {dv.ObligationRequestNumber || linkedOBR?.InvoiceNumber || 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                Responsibility Center
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {dv.ResponsibilityCenterName || linkedOBR?.ResponsibilityCenterName || 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                Billing Due Date
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {dv.BillingDueDate ? formatDate(dv.BillingDueDate) : 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                Mode of Payment
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2 flex items-center gap-2">
                {dv.modeOfPayment}
                {(dv.modeOfPayment === 'Check' || dv.ModeOfPayment === 'Check') && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500 text-error-700 border border-warning-200">
                    Cheque Pending
                  </span>
                )}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Fund</dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {dv.FundName || dv.FundsID || 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Project</dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {dv.ProjectTitle || dv.ProjectID || 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Fiscal Year</dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {dv.FiscalYearName || dv.FiscalYearID || 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                Created By
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {dv.PreparedBy || 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                Date Created
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {dv.DatePrepared ? formatDate(dv.DatePrepared) : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">
            Payee Information
          </h3>

          <dl className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                Payee Name
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {dv.Payee}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                Payee Address
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {dv.Address || 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Items / Accounting Entries */}
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">
          Transactions / Accounting Entries
        </h3>
        <div className="overflow-hidden border border-neutral-200 rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">RC</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Particulars</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Account</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {(() => {
                const items =
                  dv.Items ||
                  dv.TransactionItemsAll ||
                  linkedOBR?.TransactionItemsAll ||
                  linkedOBR?.Items ||
                  [];
                if (items.length > 0) {
                  return items.map((item, index) => (
                    <tr key={index} className="hover:bg-neutral-50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm text-neutral-900">
                        {item.responsibilityCenterName || item.RC || linkedOBR?.ResponsibilityCenterName}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900">
                        {item.itemName || item.Remarks || item.Particulars}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 font-mono tracking-tight">
                        {item.chargeAccountName || item.Account}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-neutral-900 font-medium tabular-nums">
                        {formatCurrency(item.subtotal || item.Amount || 0)}
                      </td>
                    </tr>
                  ));
                }
                return (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-sm text-neutral-500 italic"
                    >
                      No transactions found
                    </td>
                  </tr>
                );
              })()}
            </tbody>
            {/* Table Footer Summary */}
            {(() => {
              const items = dv.Items || dv.TransactionItemsAll || linkedOBR?.TransactionItemsAll || linkedOBR?.Items || [];
              return items.length > 0 && (
                <tfoot className="bg-neutral-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Total</td>
                    <td className="px-6 py-3 text-right text-sm font-bold text-neutral-900 tabular-nums">{formatCurrency(dv.Total || 0)}</td>
                  </tr>
                </tfoot>
              );
            })()}
          </table>
        </div>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gross Amount Card */}
        <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-neutral-900"></div>
          </div>
          <dt className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Gross Amount</dt>
          <dd className="mt-2 text-3xl font-bold text-neutral-900 tracking-tight">
            {formatCurrency(dv.Total || 0)}
          </dd>
        </div>

        {/* Total Deductions Card */}
        <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-error-600"></div>
          </div>
          <dt className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
            Total Deductions
          </dt>
          <dd className="mt-2 text-3xl font-bold text-error-600 tracking-tight">
            {formatCurrency(dv.WithheldAmount || 0)}
          </dd>
        </div>

        {/* Net Amount Card */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-success-50 to-white border border-success-200 shadow-sm relative overflow-hidden">
          <dt className="text-sm font-medium text-success-800 uppercase tracking-wide">Net Amount</dt>
          <dd className="mt-2 text-3xl font-bold text-success-700 tracking-tight">
            {formatCurrency((dv.Total || 0) - (dv.WithheldAmount || 0))}
          </dd>
        </div>
      </div>

      {/* Approval workflow */}
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">
          Approval Workflow
        </h3>
        <div className="overflow-hidden bg-white border border-neutral-200 rounded-xl shadow-sm">
          <div className="px-6 py-8">
            <ol className="relative border-l border-neutral-200 ml-3 space-y-8">
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-success-100 rounded-full -left-4 ring-4 ring-white shadow-sm">
                  <CheckCircleIcon className="w-5 h-5 text-success-600" />
                </span>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start group">
                  <div className="bg-neutral-50 p-3 rounded-lg w-full mr-4 border border-neutral-100 group-hover:border-neutral-200 transition-colors">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Prepared
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">Prepared by <span className="font-medium text-neutral-900">{dv.preparedBy}</span></p>
                  </div>
                  <time className="text-sm text-neutral-400 font-mono whitespace-nowrap mt-2 sm:mt-0">
                    {formatDate(dv.dateCreated)}
                  </time>
                </div>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-warning-100 rounded-full -left-4 ring-4 ring-white shadow-sm">
                  <ArrowPathIcon className="w-5 h-5 text-warning-600" />
                </span>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div className="bg-neutral-50 p-3 rounded-lg w-full mr-4 border border-neutral-100">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Certification
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1 italic">Pending verification...</p>
                  </div>
                </div>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-neutral-100 rounded-full -left-4 ring-4 ring-white shadow-sm">
                  <XCircleIcon className="w-5 h-5 text-neutral-400" />
                </span>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div className="bg-neutral-50 p-3 rounded-lg w-full mr-4 border border-neutral-100">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Approval
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">
                      Waiting for certification to proceed
                    </p>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
        <button type="button" onClick={onClose} className="btn btn-outline px-6">
          Close
        </button>
      </div>
    </div>
  );
}

export default DisbursementVoucherDetails;
