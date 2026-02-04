import {
  PencilIcon,
  PrinterIcon,
  XCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/currencyFormater';
import Modal from '../../components/common/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGeneralLedgers } from '../../features/reports/generalLedgerSlice';
import { useState } from 'react';

function FundUtilizationDetails({ or, onBack, onEdit }) {
  const dispatch = useDispatch();
  const [showGLModal, setShowGLModal] = useState(false);
  const { generalLedgers, isLoading: isGLLoading } = useSelector((state) => state.generalLedger);

  // Lookups
  const { employees } = useSelector((state) => state.employees);
  const { customers } = useSelector((state) => state.customers);
  const { vendorDetails } = useSelector((state) => state.vendorDetails);
  const { funds } = useSelector((state) => state.funds);
  const { accounts: chartOfAccounts } = useSelector((state) => state.chartOfAccounts);
  const { departments } = useSelector((state) => state.departments);

  const handleViewGeneralLedger = () => {
    setShowGLModal(true);
    dispatch(fetchGeneralLedgers({
      LinkID: or.LinkID || or.ID, // Use LinkID if available
      FundID: or.FundsID || or.FundID,
      CutOffDate: or.InvoiceDate || new Date().toISOString().split('T')[0]
    }));
  };

  const handleCloseGLModal = () => {
    setShowGLModal(false);
  };

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

    if (lowerStatus.includes('requested')) bgColor = 'bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500 text-error-700';
    else if (lowerStatus.includes('approved') || lowerStatus.includes('posted')) bgColor = 'bg-gradient-to-r from-success-300 via-success-500 to-success-600 text-neutral-800';
    else if (lowerStatus.includes('rejected')) bgColor = 'bg-gradient-to-r from-error-700 via-error-800 to-error-999 text-neutral-100';
    else if (lowerStatus.includes('void')) bgColor = 'bg-gradient-to-r from-primary-900 via-primary-999 to-tertiary-999 text-neutral-300';

    return bgColor;
  };

  return (
    <div className="space-y-6">
      {/* Status and actions header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span
          className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusBadge(or.Status || or.Transaction?.Status)}`}
        >
          {or.Status || or.Transaction?.Status}
        </span>

        <div className="flex space-x-2">
          {onEdit && (
            <button
              type="button"
              className="btn btn-outline flex items-center"
              onClick={() => onEdit(or)}
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </button>
          )}
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
            Request Details
          </h3>

          <dl className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Invoice Number</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{or.InvoiceNumber || 'N/A'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Date</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{or.InvoiceDate ? formatDate(or.InvoiceDate) : 'N/A'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Responsibility Center</dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {or.ResponsibilityCenterName ||
                  departments.find(d => String(d.ID) === String(or.ResponsibilityCenter))?.Name ||
                  or.ResponsibilityCenter ||
                  'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Fund</dt>
              <dd className="text-sm text-neutral-900 col-span-2">
                {(() => {
                  const fund = funds.find(f => String(f.ID) === String(or.FundsID || or.FundID));
                  return fund?.Name || or.FundsID || 'N/A';
                })()}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">
            Payee Information
          </h3>
          <dl className="space-y-2">
            {(() => {
              let payeeName = or.Payee || or.payeeName;
              let payeeType = or.PayeeType || or.payeeType;
              let payeeAddress = or.Address || or.payeeAddress;

              // If Payee is missing or N/A, try to resolve via IDs
              if (!payeeName || payeeName === 'N/A' || payeeName === '') {
                if (or.EmployeeID) {
                  const emp = employees.find(e => String(e.ID) === String(or.EmployeeID));
                  if (emp) {
                    payeeName = `${emp.FirstName} ${emp.MiddleName ? emp.MiddleName + ' ' : ''}${emp.LastName}`;
                    payeeType = 'Employee';
                    payeeAddress = emp.StreetAddress || emp.Address;
                  }
                } else if (or.VendorID) {
                  const vendor = vendorDetails.find(v => String(v.ID) === String(or.VendorID));
                  if (vendor) {
                    payeeName = vendor.Name;
                    payeeType = 'Vendor';
                    payeeAddress = vendor.StreetAddress || vendor.Address || vendor.OfficeAddress;
                  }
                } else if (or.CustomerID) {
                  const customer = customers.find(c => String(c.ID) === String(or.CustomerID));
                  if (customer) {
                    payeeName = customer.Name || `${customer.FirstName} ${customer.LastName}`;
                    payeeType = 'Customer/Individual';
                    payeeAddress = customer.StreetAddress || customer.Address;
                  }
                }
              }

              return (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-neutral-500">Payee</dt>
                    <dd className="text-sm text-neutral-900 col-span-2">{payeeName || 'N/A'}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-neutral-500">Payee Type</dt>
                    <dd className="text-sm text-neutral-900 col-span-2">{payeeType || 'N/A'}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-neutral-500">Address</dt>
                    <dd className="text-sm text-neutral-900 col-span-2">{payeeAddress || 'N/A'}</dd>
                  </div>
                </>
              );
            })()}
          </dl>
        </div>
      </div>

      {/* Items */}
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">Items</h3>
        <div className="overflow-hidden border border-neutral-200 rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">RC</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Particulars</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Account Code</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {(() => {
                const items = or.TransactionItemsAll || or.Items || [];
                if (items.length > 0) {
                  return items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-neutral-900">
                        {item.responsibilityCenterName || item.RC ||
                          departments.find(d => String(d.ID) === String(item.ResponsibilityCenter))?.Name ||
                          'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900">{item.itemName || item.Remarks}</td>
                      <td className="px-6 py-4 text-sm text-neutral-600 font-mono">
                        {item.ChargeAccount?.ChartofAccounts?.AccountCode || item.AccountCode || ''}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-neutral-900 font-medium whitespace-nowrap">
                        {formatCurrency(item.subtotal || item.amount || 0)}
                      </td>
                    </tr>
                  ));
                }
                return <tr><td colSpan="4" className="px-6 py-8 text-center text-sm text-neutral-500">No items found</td></tr>;
              })()}
            </tbody>
            <tfoot className="bg-neutral-50">
              <tr>
                <td colSpan="3" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Total</td>
                <td className="px-6 py-3 text-right text-sm font-bold text-neutral-900">
                  {formatCurrency(or.Total || 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Amounts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-sm">
          <dt className="text-sm font-medium text-neutral-500 uppercase">Total Amount</dt>
          <dd className="mt-2 text-3xl font-bold text-neutral-900">{formatCurrency(or.Total)}</dd>
        </div>
        <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-sm">
          <dt className="text-sm font-medium text-neutral-500 uppercase">VAT Total</dt>
          <dd className="mt-2 text-3xl font-bold text-neutral-900">{formatCurrency(or.Vat_Total)}</dd>
        </div>
        <div className="p-5 rounded-xl bg-success-50 border border-success-200 shadow-sm">
          <dt className="text-sm font-medium text-success-800 uppercase">Net Amount</dt>
          <dd className="mt-2 text-3xl font-bold text-success-700">{formatCurrency(or.Total - (or.WithheldAmount || 0))}</dd>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
        <button type="button" onClick={onBack} className="btn btn-outline px-6">
          Close
        </button>
      </div>
      {/* GL Modal */}
      <Modal isOpen={showGLModal} onClose={handleCloseGLModal} title="General Ledger Entries" size="4xl">
        {/* ... (Reuse the GL table code from ObligationRequestDetails or I can provide it if you copy-pasted the file) ... */}
        {/* Since I gave you the full file in previous steps, make sure to include the GL Table rendering here from the snippet above */}
        <div className="overflow-hidden border border-neutral-200 rounded-xl shadow-sm my-2">
          {isGLLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Account</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Debit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Credit</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {generalLedgers?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 text-sm text-neutral-900">{item.account_name} <span className="text-neutral-500">({item.account_code})</span></td>
                    <td className="px-6 py-4 text-sm text-right">{item.debit > 0 ? formatCurrency(item.debit) : '-'}</td>
                    <td className="px-6 py-4 text-sm text-right">{item.credit > 0 ? formatCurrency(item.credit) : '-'}</td>
                  </tr>
                ))}
                {(!generalLedgers || generalLedgers.length === 0) && (
                  <tr><td colSpan="3" className="px-6 py-4 text-center text-sm text-neutral-500">No entries found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Modal>
    </div>
  );
}
export default FundUtilizationDetails;