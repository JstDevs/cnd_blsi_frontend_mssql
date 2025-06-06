import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { fetchObligationRequests } from '../../features/disbursement/obligationRequestSlice';
import ObligationRequestForm from './ObligationRequestForm';
import ObligationRequestDetails from './ObligationRequestDetails';

function ObligationRequestPage() {
  const dispatch = useDispatch();
  const { obligationRequests, isLoading } = useSelector(state => state.obligationRequests);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentObligationRequest, setCurrentObligationRequest] = useState(null);
  
  useEffect(() => {
    dispatch(fetchObligationRequests());
  }, [dispatch]);
  
  const handleCreateORS = () => {
    setCurrentObligationRequest(null);
    setIsCreateModalOpen(true);
  };
  
  const handleViewORS = (ors) => {
    setCurrentObligationRequest(ors);
    setIsViewModalOpen(true);
  };
  
  const handleEditORS = (ors) => {
    setCurrentObligationRequest(ors);
    setIsCreateModalOpen(true);
  };
  
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCurrentObligationRequest(null);
  };
  
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentObligationRequest(null);
  };
  
  // Format amount as Philippine Peso
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };
  
  // Table columns definition
  const columns = [
    {
      key: 'orsNumber',
      header: 'ORS Number',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'orsDate',
      header: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'payeeName',
      header: 'Payee',
      sortable: true,
    },
    {
      key: 'requestingOffice',
      header: 'Requesting Office',
      sortable: true,
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => {
        let bgColor = 'bg-neutral-100 text-neutral-800';
        
        switch (value) {
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
        
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}>
            {value}
          </span>
        );
      },
    },
  ];
  
  // Actions for table rows
  const actions = [
    {
      icon: EyeIcon,
      title: 'View',
      onClick: handleViewORS,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditORS,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Obligation Requests</h1>
            <p>Manage obligation request and status (ORS/OBR)</p>
          </div>
          <button
            type="button"
            onClick={handleCreateORS}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Create ORS
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={obligationRequests}
          actions={actions}
          loading={isLoading}
          onRowClick={handleViewORS}
        />
      </div>
      
      {/* ORS Creation/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title={currentObligationRequest ? "Edit Obligation Request" : "Create Obligation Request"}
        size="lg"
      >
        <ObligationRequestForm 
          initialData={currentObligationRequest} 
          onClose={handleCloseCreateModal} 
        />
      </Modal>
      
      {/* ORS View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="Obligation Request Details"
        size="lg"
      >
        {currentObligationRequest && (
          <ObligationRequestDetails 
            ors={currentObligationRequest} 
            onClose={handleCloseViewModal} 
            onEdit={() => {
              setIsViewModalOpen(false);
              setIsCreateModalOpen(true);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

export default ObligationRequestPage;