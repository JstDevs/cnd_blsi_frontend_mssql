import { PencilIcon, PrinterIcon, XCircleIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

function DisbursementVoucherDetails({ dv, onClose, onEdit }) {
  // Format amount as Philippine Peso
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };
  
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
        <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusBadge(dv.status)}`}>
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
          <button 
            type="button" 
            className="btn btn-outline flex items-center"
          >
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print
          </button>
        </div>
      </div>
      
      {/* Main details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">DV Details</h3>
          
          <dl className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">DV Number</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{dv.dvNumber}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Date</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{formatDate(dv.dvDate)}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">ORS Number</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{dv.orsNumber || 'N/A'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Mode of Payment</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{dv.modeOfPayment}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Created By</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{dv.preparedBy}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Date Created</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{formatDate(dv.dateCreated)}</dd>
            </div>
          </dl>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Payee Information</h3>
          
          <dl className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Payee Name</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{dv.payeeName}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Payee Address</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{dv.payeeAddress || 'N/A'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Department</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{dv.department}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Particulars */}
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Particulars</h3>
        <div className="p-4 rounded-lg bg-white border border-neutral-200">
          <p className="text-sm text-neutral-700 whitespace-pre-line">{dv.particulars}</p>
        </div>
      </div>
      
      {/* Amounts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white border border-neutral-200">
          <dt className="text-sm font-medium text-neutral-500">Gross Amount</dt>
          <dd className="mt-1 text-2xl font-semibold text-neutral-900">{formatCurrency(dv.grossAmount)}</dd>
        </div>
        
        <div className="p-4 rounded-lg bg-white border border-neutral-200">
          <dt className="text-sm font-medium text-neutral-500">Total Deductions</dt>
          <dd className="mt-1 text-2xl font-semibold text-error-600">{formatCurrency(dv.totalDeductions)}</dd>
        </div>
        
        <div className="p-4 rounded-lg bg-success-50 border border-success-200">
          <dt className="text-sm font-medium text-success-700">Net Amount</dt>
          <dd className="mt-1 text-2xl font-semibold text-success-700">{formatCurrency(dv.netAmount)}</dd>
        </div>
      </div>
      
      {/* Approval workflow */}
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Approval Workflow</h3>
        <div className="overflow-hidden bg-white border border-neutral-200 rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ol className="relative border-l border-neutral-200 ml-3">
              <li className="mb-6 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-success-100 rounded-full -left-4 ring-4 ring-white">
                  <CheckCircleIcon className="w-5 h-5 text-success-600" />
                </span>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">Prepared</h3>
                    <p className="text-sm text-neutral-500">{dv.preparedBy}</p>
                  </div>
                  <time className="text-sm text-neutral-500">{formatDate(dv.dateCreated)}</time>
                </div>
              </li>
              <li className="mb-6 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-warning-100 rounded-full -left-4 ring-4 ring-white">
                  <ArrowPathIcon className="w-5 h-5 text-warning-600" />
                </span>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">Certification</h3>
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
                    <h3 className="text-lg font-semibold text-neutral-900">Approval</h3>
                    <p className="text-sm text-neutral-500">Waiting for certification</p>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-outline"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default DisbursementVoucherDetails;