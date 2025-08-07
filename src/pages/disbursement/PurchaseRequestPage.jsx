import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import PurchaseRequestForm from './PurchaseRequestForm';
import { fetchDepartments } from '../../features/settings/departmentSlice';
import { fetchAccounts } from '../../features/settings/chartOfAccountsSlice';
import { fetchItems } from '../../features/settings/itemSlice';
import { fetchItemUnits } from '../../features/settings/itemUnitsSlice';
import {
  fetchPurchaseRequests,
  addPurchaseRequest,
  deletePurchaseRequest,
  updatePurchaseRequest,
} from '../../features/disbursement/purchaseRequestSlice';
import { useModulePermissions } from '@/utils/useModulePremission';

function PurchaseRequestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const { departments } = useSelector((state) => state.departments);
  const chartOfAccounts = useSelector(
    (state) => state.chartOfAccounts?.accounts || []
  );
  const { items } = useSelector((state) => state.items);
  const { itemUnits } = useSelector((state) => state.itemUnits);
  const { purchaseRequests, isLoading } = useSelector(
    (state) => state.purchaseRequests
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  // ---------------------USE MODULE PERMISSIONS------------------START (FundUtilizationPage - MODULE ID =  69 )
  const { Add, Edit, Delete } = useModulePermissions(69);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchAccounts());
    dispatch(fetchItems());
    dispatch(fetchItemUnits());
    dispatch(fetchPurchaseRequests());
  }, []);

  const handleAddRequest = () => {
    setCurrentRequest(null);
    setIsModalOpen(true);
  };

  const handleEditRequest = (request) => {
    // setCurrentRequest(request);
    // setIsModalOpen(true);
  };

  const handleDelete = (request) => {
    // setRequestToDelete(request);
    // setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRequest(null);
  };

  const confirmDelete = async () => {
    if (requestToDelete) {
      try {
        await dispatch(deletePurchaseRequest(requestToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setRequestToDelete(null);
        toast.success('Deleted');
      } catch (error) {
        toast.error(error || 'Failed');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      const estimatedCost = values.Items.reduce(
        (sum, e) => sum + (parseFloat(e.Cost) || 0),
        0
      );

      const totalCost = values.Items.reduce(
        (sum, e) =>
          sum + (parseFloat(e.Cost) || 0) * (parseFloat(e.Quantity) || 0),
        0
      );
      const payload = {
        ...values,
        Total: estimatedCost.toFixed(2),
        AmountReceived: totalCost.toFixed(2),
      };

      if (currentRequest) {
        await dispatch(updatePurchaseRequest(payload)).unwrap();
      } else {
        await dispatch(addPurchaseRequest(payload)).unwrap();
      }

      toast.success('Success');
    } catch (error) {
      toast.error(error || 'Failed');
    } finally {
      setIsModalOpen(false);
    }
  };

  // DataTable columns
  // Table columns definition
  const columns = [
    {
      key: 'ChartOfAccountsName',
      header: 'Charge Account',
      sortable: true,
    },
    {
      key: 'Status',
      header: 'Status',
      sortable: true,
    },
    {
      key: 'RequestedByName',
      header: 'Requested By',
      sortable: true,
    },
    {
      key: 'DepartmentName',
      header: 'Department',
      sortable: true,
    },
    {
      key: 'Remarks',
      header: 'Purpose',
      sortable: true,
    },
    {
      key: 'OfficeUnitProject',
      header: 'Section',
      sortable: true,
    },
    {
      key: 'InvoiceNumber',
      header: 'PR No.',
      sortable: true,
    },
    {
      key: 'InvoiceDate',
      header: 'PR Date',
      sortable: true,
    },
    {
      key: 'SAI_No',
      header: 'SAI No.',
      sortable: true,
    },
    {
      key: 'SAIDate',
      header: 'SAI Date',
      sortable: true,
    },
    {
      key: 'ObligationRequestNumber',
      header: 'ALOBS No.',
      sortable: true,
    },
    {
      key: 'ALOBSDate',
      header: 'ALOBS Date',
      sortable: true,
    },
    {
      key: 'Total',
      header: 'Total',
      sortable: true,
    },
    {
      key: 'AmountReceived',
      header: 'Estimated Total',
      sortable: true,
    },
  ];

  // Actions for table rows
  const actions = [
    // {
    //   icon: PencilIcon,
    //   title: 'Edit',
    //   onClick: handleEditRequest,
    //   className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    // },
    // {
    //   icon: TrashIcon,
    //   title: 'Delete',
    //   onClick: handleDelete,
    //   className: 'text-danger-600 hover:text-danger-900 p-1 rounded-full hover:bg-danger-50'
    // },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <div>
            <h1>Purchase Requests</h1>
            <p>Manage purchase requests and authorizations</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAddRequest}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Purchase Request
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          actions={actions}
          data={purchaseRequests}
          loading={isLoading}
        />
      </div>

      {/* Purchase Request Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          currentRequest ? 'Edit Purchase Request' : 'Add Purchase Request'
        }
        size="xxxl"
      >
        <PurchaseRequestForm
          initialData={currentRequest}
          departmentsOptions={departments.map((dept) => ({
            value: dept.ID,
            label: dept.Name,
          }))}
          chartOfAccountsOptions={chartOfAccounts.map((item) => ({
            value: item.ID,
            label: item.Name,
          }))}
          itemsOptions={items.map((item) => ({
            value: item.ID,
            label: item.Name,
          }))}
          itemsUnitsOptions={itemUnits.map((unit) => ({
            value: unit.ID,
            label: unit.Name,
          }))}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="py-3">
          <p className="text-neutral-700">
            Are you sure you want to delete the purchase request "
            {requestToDelete?.Name}"?
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

export default PurchaseRequestPage;
