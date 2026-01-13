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
import Modal from '../../components/common/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGeneralLedgers } from '../../features/reports/generalLedgerSlice';
import { useState } from 'react';

function ObligationRequestDetails({ or, onBack, onEdit }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showGLModal, setShowGLModal] = useState(false);
  const { generalLedgers, isLoading: isGLLoading } = useSelector((state) => state.generalLedger);

  const handleViewGeneralLedger = () => {
    setShowGLModal(true);
    dispatch(fetchGeneralLedgers({
      LinkID: or.ID,
      FundID: or.FundID,
      CutOffDate: or.InvoiceDate || new Date().toISOString().split('T')[0]
    }));
  };

  const handleCloseGLModal = () => {
    setShowGLModal(false);
  };

  if (!or) return null;

  // Format date
  console.log('OBR Detail Data:', or);
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

    switch (lowerStatus) {
      case 'requested': bgColor = 'bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500 text-error-700'; break;
      case 'approved': bgColor = 'bg-gradient-to-r from-success-300 via-success-500 to-success-600 text-neutral-800'; break;
      case 'posted': bgColor = 'bg-gradient-to-r from-success-800 via-success-900 to-success-999 text-success-100'; break;
      case 'rejected': bgColor = 'bg-gradient-to-r from-error-700 via-error-800 to-error-999 text-neutral-100'; break;
      case 'void': bgColor = 'bg-gradient-to-r from-primary-900 via-primary-999 to-tertiary-999 text-neutral-300'; break;
      case 'cancelled': bgColor = 'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-400 text-neutral-800'; break;
      case 'disbursement pending': bgColor = 'bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500 text-error-700'; break;
      case 'disbursement posted': bgColor = 'bg-gradient-to-r from-success-800 via-success-900 to-success-999 text-success-100'; break;
      case 'cheque pending': bgColor = 'bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500 text-error-700'; break;
      case 'cheque posted': bgColor = 'bg-gradient-to-r from-success-800 via-success-900 to-success-999 text-success-100'; break;
      default: bgColor = 'bg-neutral-100 text-neutral-800'; break;
    }

    // if (lowerStatus.includes('requested') || lowerStatus.includes('pending')) {
    //   bgColor = 'bg-warning-100 text-warning-800';
    // } else if (lowerStatus.includes('posted') || lowerStatus.includes('approved')) {
    //   bgColor = 'bg-success-100 text-success-800';
    // } else if (lowerStatus.includes('rejected') || lowerStatus.includes('cancelled')) {
    //   bgColor = 'bg-error-100 text-error-800';
    // }

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
            onClick={handleViewGeneralLedger}
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
                {or.FundName || or.fund || or.FundsName || or.FundsID || 'N/A'}
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
                {or.Payee || or.payeeName || or.PayeeName || or.payee_name || or.Name || or.RecipientName || 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                Payee Type
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {or.PayeeType || or.payeeType || or.payee_type || 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">
                Payee Address
              </dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {or.Address || or.payeeAddress || or.payee_address || or.StreetAddress || 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Items */}
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">
          Items
        </h3>
        <div className="overflow-hidden border border-neutral-200 rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">RC</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Particulars</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Account Code</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {(() => {
                const items = or.TransactionItemsAll || or.Items || or.items || [];
                console.log('OBR Item Data:', items);
                if (items.length > 0) {
                  return items.map((item, index) => (
                    <tr key={index} className="hover:bg-neutral-50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm text-neutral-900">
                        {item.responsibilityCenterName || item.RC || item.ResponsibilityCenterName || item.DepartmentName || item.departmentName || or.ResponsibilityCenterName}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900">
                        {item.itemName || item.Remarks || item.Particulars || item.item_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 font-mono tracking-tight">
                        {item.chargeAccountName || item.Account || item.AccountCode || item.AccountName || item.AccountTitle || item.Account_Name}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-neutral-900 font-medium tabular-nums">
                        {formatCurrency(item.subtotal || item.Subtotal || item.SubTotal || item.sub_total || item.amount || item.Amount || item.Debit || item.Credit || 0)}
                      </td>
                    </tr>
                  ));
                }
                return (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-sm text-neutral-500 italic">No items found</td>
                  </tr>
                );
              })()}
            </tbody>
            {/* Table Footer Summary (Optional but looks professional) */}
            {(() => {
              const items = or.TransactionItemsAll || or.Items || or.items || [];
              return items.length > 0 && (
                <tfoot className="bg-neutral-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Total</td>
                    <td className="px-6 py-3 text-right text-sm font-bold text-neutral-900 tabular-nums">{formatCurrency(or.Total || 0)}</td>
                  </tr>
                </tfoot>
              );
            })()}
          </table>
        </div>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Amount Card */}
        <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-neutral-900"></div>
          </div>
          <dt className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Total Amount</dt>
          <dd className="mt-2 text-3xl font-bold text-neutral-900 tracking-tight">
            {formatCurrency(or.Total)}
          </dd>
        </div>

        {/* Vat Total Card */}
        <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-neutral-900"></div>
          </div>
          <dt className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
            Vat Total
          </dt>
          <dd className="mt-2 text-3xl font-bold text-neutral-900 tracking-tight">
            {formatCurrency(or.Vat_Total)}
          </dd>
        </div>

        {/* Net Amount Card */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-success-50 to-white border border-success-200 shadow-sm relative overflow-hidden">
          <dt className="text-sm font-medium text-success-800 uppercase tracking-wide">Net Amount</dt>
          <dd className="mt-2 text-3xl font-bold text-success-700 tracking-tight">
            {formatCurrency(or.Total - (or.WithheldAmount || 0))}
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
                    <p className="text-sm text-neutral-500 mt-1">Prepared by <span className="font-medium text-neutral-900">{or.PreparedBy || 'N/A'}</span></p>
                  </div>
                  <time className="text-sm text-neutral-400 font-mono whitespace-nowrap mt-2 sm:mt-0">
                    {or.DateCreated ? formatDate(or.DateCreated) : formatDate(or.InvoiceDate)}
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
        <button type="button" onClick={onBack} className="btn btn-outline px-6">
          Close
        </button>
      </div>

      {/* Modal for General Ledger View */}
      <Modal
        isOpen={showGLModal}
        onClose={handleCloseGLModal}
        title="General Ledger Entries"
        size="4xl" // Increased size for better table view
      >
        <div className="overflow-hidden border border-neutral-200 rounded-xl shadow-sm my-2">
          {isGLLoading ? (
            <div className="flex justify-center items-center py-12">
              <ArrowPathIcon className="h-8 w-8 animate-spin text-neutral-400" />
              <span className="ml-2 text-neutral-500">Loading ledger data...</span>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Fund
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Ledger Item
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Account Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Debit
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Credit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {generalLedgers && generalLedgers.length > 0 ? (
                  generalLedgers.map((item, index) => (
                    <tr key={index} className="hover:bg-neutral-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 font-medium">
                        {item.fund}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {item.ledger_item}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {item.account_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 font-mono">
                        {item.account_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-neutral-900 font-medium tabular-nums">
                        {item.debit > 0 ? formatCurrency(item.debit) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-neutral-900 font-medium tabular-nums">
                        {item.credit > 0 ? formatCurrency(item.credit) : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-neutral-500">
                      <div className="flex flex-col items-center justify-center">
                        <BookOpenIcon className="h-10 w-10 text-neutral-300 mb-2" />
                        <p>No ledger records found for this transaction.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              {generalLedgers && generalLedgers.length > 0 && (
                <tfoot className="bg-neutral-50 font-semibold text-neutral-900">
                  <tr>
                    <td colSpan="4" className="px-6 py-3 text-right text-xs uppercase tracking-wider text-neutral-500">Total</td>
                    <td className="px-6 py-3 text-right text-sm tabular-nums">
                      {formatCurrency(generalLedgers.reduce((acc, curr) => acc + (curr.debit || 0), 0))}
                    </td>
                    <td className="px-6 py-3 text-right text-sm tabular-nums">
                      {formatCurrency(generalLedgers.reduce((acc, curr) => acc + (curr.credit || 0), 0))}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
        </div>
      </Modal>
    </div >
  );
}

export default ObligationRequestDetails;
