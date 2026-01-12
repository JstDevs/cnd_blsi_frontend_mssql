import {
  PencilIcon,
  PrinterIcon,
  XCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/currencyFormater';
import { BookOpenIcon } from '@heroicons/react/24/outline';

function ObligationRequestDetails({ or, onBack, onEdit }) {
  const navigate = useNavigate();
  if (!or) return null;

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

    if (!status) return bgColor;

    const lowerStatus = status.toLowerCase();

    if (lowerStatus.includes('requested') || lowerStatus.includes('pending')) {
      bgColor = 'bg-warning-100 text-warning-800';
    } else if (lowerStatus.includes('posted') || lowerStatus.includes('approved')) {
      bgColor = 'bg-success-100 text-success-800';
    } else if (lowerStatus.includes('rejected') || lowerStatus.includes('cancelled')) {
      bgColor = 'bg-error-100 text-error-800';
    }

    return bgColor;
  };

  return (
    <div className="space-y-6">
      {/* Status and actions header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span
          className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusBadge(
            or.Status
          )}`}
        >
          {or.Status}
        </span>

        <div className="flex space-x-2">
          <button
            type="button"
            className="btn btn-outline flex items-center"
            onClick={() => onEdit && onEdit(or)}
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button type="button" className="btn btn-outline flex items-center">
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print
          </button>

          <button
            type="button"
            className="btn btn-outline flex items-center"
            title="View General Ledger"
            onClick={() => {
              navigate('/reports/general-ledger', {
                state: {
                  from: 'ObligationRequest',
                  LinkID: or.ID,
                  FundID: or.FundID,
                  CutOffDate: or.InvoiceDate || new Date().toISOString().split('T')[0]
                }
              });
            }}
          >
            <BookOpenIcon className="h-4 w-4 mr-2" />
            General Ledger
          </button>
        </div>
      </div>


      {/* Main details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">
            OBR Details
          </h3>

          <dl className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                OBR Number
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {or.InvoiceNumber || 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Date</dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {or.InvoiceDate ? formatDate(or.InvoiceDate) : 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                Responsibility Center
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {or.ResponsibilityCenterName || 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                Fund
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {or.FundName || 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                Project
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {or.ProjectName || 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                Fiscal Year
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {or.FiscalYearName || 'N/A'}
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
                {or.Payee || 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                Payee Type
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {or.PayeeType || 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                Payee Address
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {or.Address || 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Items */}
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">
          Items
        </h3>
        <div className="overflow-x-auto border border-neutral-200 rounded-lg">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">RC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Particulars</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Account Code</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {or.TransactionItemsAll && or.TransactionItemsAll.length > 0 ? (
                or.TransactionItemsAll.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">{item.responsibilityCenterName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">{item.itemName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">{item.chargeAccountName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-neutral-900">{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-neutral-500">No items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white border border-neutral-200">
          <dt className="text-sm font-medium text-neutral-500">Total Amount</dt>
          <dd className="mt-1 text-2xl font-semibold text-neutral-900">
            {formatCurrency(or.Total)}
          </dd>
        </div>

        <div className="p-4 rounded-lg bg-white border border-neutral-200">
          <dt className="text-sm font-medium text-neutral-500">
            Vat Total
          </dt>
          <dd className="mt-1 text-2xl font-semibold text-neutral-900">
            {formatCurrency(or.Vat_Total)}
          </dd>
        </div>

        <div className="p-4 rounded-lg bg-success-50 border border-success-200">
          <dt className="text-sm font-medium text-success-700">Net Amount</dt>
          <dd className="mt-1 text-2xl font-semibold text-success-700">
            {formatCurrency(or.Total - (or.WithheldAmount || 0))}
          </dd>
        </div>
      </div>

      {/* Approval workflow */}
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">
          Approval Workflow
        </h3>
        <div className="overflow-hidden bg-white border border-neutral-200 rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ol className="relative border-l border-neutral-200 ml-3">
              <li className="mb-6 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-success-100 rounded-full -left-4 ring-4 ring-white">
                  <CheckCircleIcon className="w-5 h-5 text-success-600" />
                </span>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Prepared
                    </h3>
                    <p className="text-sm text-neutral-500">{or.PreparedBy || 'N/A'}</p>
                  </div>
                  <time className="text-sm text-neutral-500">
                    {or.DateCreated ? formatDate(or.DateCreated) : formatDate(or.InvoiceDate)}
                  </time>
                </div>
              </li>
              <li className="mb-6 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-warning-100 rounded-full -left-4 ring-4 ring-white">
                  <ArrowPathIcon className="w-5 h-5 text-warning-600" />
                </span>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Certification
                    </h3>
                    <p className="text-sm text-neutral-500">Pending...</p>
                  </div>
                </div>
              </li>
              <li className="mb-6 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-neutral-100 rounded-full -left-4 ring-4 ring-white">
                  <XCircleIcon className="w-5 h-5 text-neutral-400" />
                </span>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Approval
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Waiting for certification
                    </p>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <button type="button" onClick={onBack} className="btn btn-outline">
          Close
        </button>
      </div>
    </div >
  );
}

export default ObligationRequestDetails;
