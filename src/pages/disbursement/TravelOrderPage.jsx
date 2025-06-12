import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { fetchTravelOrders } from '../../features/disbursement/travelOrderSlice';
import TravelOrderForm from './TravelOrderForm';
import TravelOrderDetails from './TravelOrderDetails';

function TravelOrderPage() {
  const dispatch = useDispatch();
  const { travelOrders, isLoading } = useSelector(state => state.travelOrders);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentTravelOrder, setCurrentTravelOrder] = useState(null);
  
  useEffect(() => {
    dispatch(fetchTravelOrders());
  }, [dispatch]);
  
  const handleCreateTO = () => {
    setCurrentTravelOrder(null);
    setIsCreateModalOpen(true);
  };
  
  const handleViewTO = (to) => {
    setCurrentTravelOrder(to);
    setIsViewModalOpen(true);
  };
  
  const handleEditTO = (to) => {
    setCurrentTravelOrder(to);
    setIsCreateModalOpen(true);
  };
  
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCurrentTravelOrder(null);
  };
  
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentTravelOrder(null);
  };
  
  // Format amount as Philippine Peso
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Table columns definition
  const columns = [
    {
      key: 'toNumber',
      header: 'TO Number',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'toDate',
      header: 'Date',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'employeeName',
      header: 'Employee',
      sortable: true,
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
    },
    {
      key: 'destination',
      header: 'Destination',
      sortable: true,
    },
    {
      key: 'departureDate',
      header: 'Departure',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'estimatedExpenses',
      header: 'Est. Expenses',
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
      onClick: handleViewTO,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditTO,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Travel Orders</h1>
            <p>Manage travel orders and authorizations</p>
          </div>
          <button
            type="button"
            onClick={handleCreateTO}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Create Travel Order
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={travelOrders}
          actions={actions}
          loading={isLoading}
          onRowClick={handleViewTO}
        />
      </div>
      
      {/* Travel Order Creation/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title={currentTravelOrder ? "Edit Travel Order" : "Create Travel Order"}
        size="lg"
      >
        <TravelOrderForm 
          initialData={currentTravelOrder} 
          onClose={handleCloseCreateModal} 
        />
      </Modal>
      
      {/* Travel Order View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="Travel Order Details"
        size="lg"
      >
        {currentTravelOrder && (
          <TravelOrderDetails 
            to={currentTravelOrder} 
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

export default TravelOrderPage;