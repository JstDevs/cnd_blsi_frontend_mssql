import { PencilIcon, PrinterIcon, XCircleIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

function TravelOrderDetails({ to, onClose, onEdit }) {
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
  
  // Format datetime
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Get status badge color
  const getStatusBadge = (status) => {
    let bgColor = 'bg-neutral-100 text-neutral-800';
    
    switch (status) {
      case 'Pending Recommendation':
        bgColor = 'bg-warning-100 text-warning-800';
        break;
      case 'Pending Approval':
        bgColor = 'bg-primary-100 text-primary-800';
        break;
      case 'Approved':
      case 'Liquidated':
        bgColor = 'bg-success-100 text-success-800';
        break;
      case 'Cancelled':
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
        <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusBadge(to.status)}`}>
          {to.status}
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
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Travel Order Details</h3>
          
          <dl className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">TO Number</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{to.toNumber}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Date</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{formatDate(to.toDate)}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Created By</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{to.preparedBy}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Date Created</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{formatDate(to.dateCreated)}</dd>
            </div>
          </dl>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Employee Information</h3>
          
          <dl className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Employee Name</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{to.employeeName}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Position</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{to.position}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-neutral-500">Department</dt>
              <dd className="text-sm text-neutral-900 col-span-2">{to.department}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Travel details */}
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Travel Details</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-white border border-neutral-200">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-neutral-500">Destination</dt>
                <dd className="mt-1 text-sm text-neutral-900">{to.destination}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-neutral-500">Means of Travel</dt>
                <dd className="mt-1 text-sm text-neutral-900">{to.meansOfTravel || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-neutral-500">Departure</dt>
                <dd className="mt-1 text-sm text-neutral-900">{formatDateTime(to.departureDate)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-neutral-500">Return</dt>
                <dd className="mt-1 text-sm text-neutral-900">{formatDateTime(to.returnDate)}</dd>
              </div>
            </dl>
          </div>
          
          <div className="p-4 rounded-lg bg-white border border-neutral-200">
            <dt className="text-sm font-medium text-neutral-500">Purpose</dt>
            <dd className="mt-1 text-sm text-neutral-900 whitespace-pre-line">{to.purpose}</dd>
          </div>
          
          <div className="p-4 rounded-lg bg-success-50 border border-success-200">
            <dt className="text-sm font-medium text-success-700">Estimated Expenses</dt>
            <dd className="mt-1 text-2xl font-semibold text-success-700">{formatCurrency(to.estimatedExpenses)}</dd>
          </div>
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
                    <p className="text-sm text-neutral-500">{to.preparedBy}</p>
                  </div>
                  <time className="text-sm text-neutral-500">{formatDate(to.dateCreated)}</time>
                </div>
              </li>
              <li className="mb-6 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-warning-100 rounded-full -left-4 ring-4 ring-white">
                  <ArrowPathIcon className="w-5 h-5 text-warning-600" />
                </span>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">Recommendation</h3>
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
                    <p className="text-sm text-neutral-500">Waiting for recommendation</p>
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

export default TravelOrderDetails;