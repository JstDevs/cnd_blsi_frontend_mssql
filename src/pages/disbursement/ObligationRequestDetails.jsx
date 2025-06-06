import { PencilIcon, DocumentTextIcon, PrinterIcon, XCircleIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

function ObligationRequestDetails({ ors, onClose, onEdit }) {
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
      case 'Pending':
        bgColor = 'bg-warning-100 text-warning-800';
        break;
      case 'Certified Budget Available':
        bgColor = 'bg-primary-100 text-primary-800';
        break;
      case 'Approved':
      case 'Obligated':
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
        <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusBadge(ors.status)}`}>
          {ors.status}
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
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Create DV
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
          <h3 className="text-lg font-medium text-neutral-900 mb-4">ORS Details</h3>
          
          <dl className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">ORS Number</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{ors.orsNumber}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Date</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{formatDate(ors.orsDate)}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Fund</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{ors.fund}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Created By</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{ors.preparedBy}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Date Created</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{formatDate(ors.dateCreated)}</dd>
            </div>
          </dl>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Payee Information</h3>
          
          <dl className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Payee Type</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{ors.payeeType || 'Vendor'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Payee Name</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{ors.payeeName}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Payee Address</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{ors.payeeAddress || 'N/A'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Requesting Office</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{ors.requestingOffice}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Particulars */}
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Particulars</h3>
        <div className="p-4 rounded-lg bg-white border border-neutral-200">
          <p className="text-sm text-neutral-700 whitespace-pre-line">{ors.particulars}</p>
        </div>
      </div>
      
      {/* Line items */}
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Line Items</h3>
        <div className="overflow-x-auto bg-white border border-neutral-200 rounded-lg">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr className="bg-neutral-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Account Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {/* For demonstration, create some example line items */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">5-02-03-010</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">Traveling Expenses - Local</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 text-right">₱15,000.00</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">5-02-12-990</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">Other Maintenance and Operating Expenses</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 text-right">₱30,000.00</td>
              </tr>
              <tr className="bg-neutral-50 font-medium">
                <td className="px-6 py-3 whitespace-nowrap text-sm text-neutral-900" colSpan="2">TOTAL</td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-neutral-900 text-right">{formatCurrency(ors.totalAmount)}</td>
              </tr>
            </tbody>
          </table>
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
                    <p className="text-sm text-neutral-500">John Smith</p>
                  </div>
                  <time className="text-sm text-neutral-500">Jan 10, 2024</time>
                </div>
              </li>
              <li className="mb-6 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-warning-100 rounded-full -left-4 ring-4 ring-white">
                  <ArrowPathIcon className="w-5 h-5 text-warning-600" />
                </span>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">Budget Certification</h3>
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
                    <p className="text-sm text-neutral-500">Waiting for budget certification</p>
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

export default ObligationRequestDetails;