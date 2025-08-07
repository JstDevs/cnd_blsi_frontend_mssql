import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import { toast } from 'react-hot-toast';
import Modal from '../../components/common/Modal';
import TravelOrderForm from '../../components/forms/TravelOrderForm';
import TravelOrderDetails from './TravelOrderDetails';
import {
  fetchTravelOrders,
  addTravelOrder,
  updateTravelOrder,
  deleteTravelOrder,
} from '../../features/disbursement/travelOrderSlice';
import { useModulePermissions } from '@/utils/useModulePremission';

function TravelOrderPage() {
  const dispatch = useDispatch();
  const { travelOrders, isLoading } = useSelector(
    (state) => state.travelOrders
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentTravelOrder, setCurrentTravelOrder] = useState(null);
  // ---------------------USE MODULE PERMISSIONS------------------START (TravelOrderPage - MODULE ID = 80 )
  const { Add, Edit, Delete } = useModulePermissions(80);
  useEffect(() => {
    dispatch(fetchTravelOrders());
  }, [dispatch]);

  const handleSubmit = async (values) => {
    try {
      if (currentTravelOrder) {
        await dispatch(
          updateTravelOrder({ ...values, ID: currentTravelOrder.ID })
        ).unwrap();
      } else {
        await dispatch(addTravelOrder(values)).unwrap();
      }

      setIsCreateModalOpen(false);
      setCurrentTravelOrder(null);
      toast.success('Success');
    } catch (error) {
      toast.error(error || 'Failed');
      throw error;
    }
  };
  // const handleSubmit = (formData) => {
  //   if (currentTravelOrder) {
  //     formData.append('ID', currentTravelOrder.ID); // add ID to FormData if editing
  //     dispatch(updateTravelOrder(formData));
  //   } else {
  //     dispatch(addTravelOrder(formData));
  //   }

  //   setIsCreateModalOpen(false);
  //   setCurrentTravelOrder(null);
  // };

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

  const handleDelete = (travelOrder) => {
    setCurrentTravelOrder(travelOrder);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (currentTravelOrder) {
      try {
        await dispatch(deleteTravelOrder(currentTravelOrder.ID)).unwrap();
        toast.success('Deleted');
      } catch (error) {
        console.error('Failed to delete travel order:', error);
        toast.error('Failed to delete travel order');
      } finally {
        setIsDeleteModalOpen(false);
        setCurrentTravelOrder(null);
      }
    }
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
      key: 'TransactionStatus',
      header: 'Status',
      sortable: true,
      render: (value) => {
        let bgColor = 'bg-neutral-100 text-neutral-800';

        switch (value) {
          case 'Requested':
            bgColor = 'bg-warning-100 text-warning-800';
            break;
          case 'Approval Progress':
            bgColor = 'bg-primary-100 text-primary-800';
            break;
          case 'Rejected':
            bgColor = 'bg-error-100 text-error-800';
            break;
          default:
            break;
        }

        return (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
          >
            {value}
          </span>
        );
      },
    },
    {
      key: 'BudgetDepartmentName',
      header: 'Office',
      sortable: true,
    },
    {
      key: 'DateCreated',
      header: 'Date of Filing',
      sortable: true,
    },
    {
      key: 'InvoiceNumber',
      header: 'Travel Order No.',
      sortable: true,
    },
    {
      key: 'FullName',
      header: 'Full Name',
      sortable: true,
    },
    {
      key: 'Position/Designation',
      header: 'Position/Designation',
      sortable: true,
    },
    {
      key: 'No_of_Days',
      header: 'No. of Days',
      sortable: true,
    },
  ];

  // Actions for table rows
  // const actions = [
  //   {
  //     icon: PencilIcon,
  //     title: 'Edit',
  //     onClick: handleEditTO,
  //     className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
  //   },
  //   {
  //     icon: TrashIcon,
  //     title: 'Delete',
  //     onClick: handleDelete,
  //     className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50'
  //   }
  // ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center gap-4 max-sm:flex-col">
          <div>
            <h1>Travel Orders</h1>
            <p>Manage travel orders and authorizations</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleCreateTO}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Create Travel Order
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={travelOrders}
          actions={(row) => {
            const actionList = [];

            if (row.Transaction?.Status === 'Rejected') {
              actionList.push({
                icon: PencilIcon,
                title: 'Edit',
                onClick: () => handleEditTO(row),
                className:
                  'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
              });

              actionList.push({
                icon: TrashIcon,
                title: 'Delete',
                onClick: () => handleDelete(row),
                className:
                  'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
              });
            }

            return actionList;
          }}
          loading={isLoading}
        />
      </div>

      {/* Travel Order Creation/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title={currentTravelOrder ? 'Edit Travel Order' : 'Create Travel Order'}
        size="xl"
      >
        <TravelOrderForm
          initialData={currentTravelOrder}
          onSubmit={handleSubmit}
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
            officeOptions={[]} // Replace with actual office options if needed
            employeeOptions={[]} // Replace with actual employee options if needed
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="py-3">
          <p className="text-neutral-700">
            Are you sure you want to delete the travel order "
            {currentTravelOrder?.TravelOrderNumber}"?
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(false)}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default TravelOrderPage;
