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
import { CheckLine, EyeIcon, X } from 'lucide-react';
import { use } from 'react';
import { set } from 'date-fns';
import axiosInstance from '../../utils/axiosInstance';

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
  const [isLoadingPRPAction, setIsLoadingPRPAction] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

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
    setIsViewOnly(false);
    setIsModalOpen(true);
  };

  const handleEditRequest = (request) => {
    setCurrentRequest(request);
    setIsViewOnly(false);
    setIsModalOpen(true);
  };

  const handleView = (request) => {
    setCurrentRequest(request);
    setIsViewOnly(true);
    setIsModalOpen(true);
  };

  const handleDelete = (request) => {
    setRequestToDelete(request);
    setIsDeleteModalOpen(true);
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
        toast.success('Purchase Request voided successfully');
        dispatch(fetchPurchaseRequests());
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
      key: 'InvoiceNumber',
      header: 'PR No.',
      sortable: true,
    },
    {
      key: 'Status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded ${
            value === 'Requested'     ? 'bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500 text-error-700'
              : value === 'Approved'  ? 'bg-gradient-to-r from-success-300 via-success-500 to-success-600 text-neutral-800'
              : value === 'Posted'    ? 'bg-gradient-to-r from-success-800 via-success-900 to-success-999 text-success-100'
              : value === 'Rejected'  ? 'bg-gradient-to-r from-error-700 via-error-800 to-error-999 text-neutral-100'
              : value === 'Void'      ? 'bg-gradient-to-r from-primary-900 via-primary-999 to-tertiary-999 text-neutral-300'
              : value === 'Cancelled' ? 'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-400 text-neutral-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'InvoiceDate',
      header: 'PR Date',
      sortable: true,
    },
    {
      key: 'ChartOfAccountsName',
      header: 'Charge Account',
      sortable: true,
    },
    {
      key: 'Total',
      header: 'Total',
      sortable: true,
      className: "text-right font-semibold text-primary-700",
      render: (value) => (
        <span className="text-right font-semibold text-primary-700">
          {' '}
          {value
            ? Number(value).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
            : '—'}
        </span>
      ),
    },
    // {
    //   key: 'RequestedByName',
    //   header: 'Requested By',
    //   sortable: true,
    // },
    // {
    //   key: 'DepartmentName',
    //   header: 'Department',
    //   sortable: true,
    // },
    {
      key: 'Remarks',
      header: 'Purpose',
      sortable: true,
    },
    // {
    //   key: 'OfficeUnitProject',
    //   header: 'Section',
    //   sortable: true,
    // },
    // {
    //   key: 'SAI_No',
    //   header: 'SAI No.',
    //   sortable: true,
    // },
    // {
    //   key: 'SAIDate',
    //   header: 'SAI Date',
    //   sortable: true,
    // },
    // {
    //   key: 'ObligationRequestNumber',
    //   header: 'ALOBS No.',
    //   sortable: true,
    // },
    // {
    //   key: 'ALOBSDate',
    //   header: 'ALOBS Date',
    //   sortable: true,
    // },
    // {
    //   key: 'Total',
    //   header: 'Total',
    //   sortable: true,
    //   render: (value) =>
    //     value
    //       ? Number(value).toLocaleString(undefined, {
    //         minimumFractionDigits: 2,
    //         maximumFractionDigits: 2,
    //       })
    //       : '—',
    // },
    // {
    //   key: 'AmountReceived',
    //   header: 'Estimated Total',
    //   sortable: true,
    //   render: (value) =>
    //     value
    //       ? Number(value).toLocaleString(undefined, {
    //         minimumFractionDigits: 2,
    //         maximumFractionDigits: 2,
    //       })
    //       : '—',
    // },
  ];

  // Actions for table rows
  // const actions = [
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
  // ];
  const handleTOPAction = async (row, action) => {
    setIsLoadingPRPAction(true);
    const actionPast = action === 'approve' ? 'approved' : 'rejected';
    const actionPresent = action === 'approve' ? 'approving' : 'rejecting';
    try {
      const response = await axiosInstance.post(
        `/purchaseRequest/${action}`,
        { ID: row.ID }
      );
      console.log(`${actionPast}:`, response.data);
      dispatch(fetchPurchaseRequests());
      toast.success(`Purchase Request ${actionPast} successfully`);
    } catch (error) {
      console.error(`Error ${actionPresent} Purchase Request:`, error);
      toast.error(`Error ${actionPresent} Purchase Request`);
    } finally {
      setIsLoadingPRPAction(false);
    }
  };

  const actions = (row) => {
    const actionList = [];
    const isVoided = row?.Status?.toLowerCase().includes('void');

    if (isVoided) {
      actionList.push({
        icon: EyeIcon,
        title: 'View',
        onClick: handleView,
        className:
          'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
      return actionList;
    }

    if (row?.Status?.toLowerCase().includes('rejected') && Edit) {
      actionList.push({
        icon: PencilIcon,
        title: 'Edit',
        onClick: handleEditRequest,
        className:
          'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
      actionList.push({
        icon: TrashIcon,
        title: 'Void',
        onClick: () => handleDelete(row),
        className:
          'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
      });
    } else if (row?.Status?.toLowerCase().includes('requested')) {
      actionList.push(
        {
          icon: CheckLine,
          title: 'Approve',
          onClick: () => handleTOPAction(row, 'approve'),
          className:
            'text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50',
        },
        {
          icon: X,
          title: 'Reject',
          onClick: () => handleTOPAction(row, 'reject'),
          className:
            'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
        }
      );
    }
    actionList.push({
      icon: EyeIcon,
      title: 'View',
      onClick: handleView,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    });
    return actionList;
  };
  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <div>
            <h1>Purchase Requests</h1>
            <p>Handle purchase requests created within the system.</p>
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
          loading={isLoading || isLoadingPRPAction}
        />
      </div>

      {/* Purchase Request Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          isViewOnly
            ? 'View Purchase Request'
            : currentRequest
              ? 'Edit Purchase Request'
              : 'Add Purchase Request'
        }
        size="xxxl"
      >
        <PurchaseRequestForm
          isReadOnly={isViewOnly}
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
        title="Confirm Void"
      >
        <div className="py-3">
          <p className="text-neutral-700">
            Are you sure you want to void the purchase request "{requestToDelete?.InvoiceNumber}"?
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            This action will mark the request as void but keep it visible in the list.
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
            Void Request
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default PurchaseRequestPage;
