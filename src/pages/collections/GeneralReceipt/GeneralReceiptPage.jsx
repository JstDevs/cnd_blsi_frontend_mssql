import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import DataTable from '@/components/common/DataTable';
import Modal from '@/components/common/Modal';
import {
  createGeneralServiceReceipt,
  deleteGeneralServiceReceipt,
  fetchGeneralServiceReceipts,
} from '@/features/collections/generalReceiptSlice';
import GeneralServiceReceiptModal from './GeneralServiceReceiptModal';

import toast from 'react-hot-toast';
import { TrashIcon } from 'lucide-react';
import { useModulePermissions } from '@/utils/useModulePremission';

function GeneralReceiptPage() {
  const dispatch = useDispatch();
  const { receipts: generalReceipts, isLoading } = useSelector(
    (state) => state.generalReceipts
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (GeneralReceiptPage - MODULE ID =  52 )
  const { Add, Edit, Delete, Print } = useModulePermissions(52);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isServiceReceiptModalOpen, setIsServiceReceiptModalOpen] =
    useState(false);
  const [currentReceipt, setCurrentReceipt] = useState(null);

  useEffect(() => {
    dispatch(fetchGeneralServiceReceipts());
  }, [dispatch]);
  console.log('generalReceipts', generalReceipts);
  const handleCreateReceipt = () => {
    setCurrentReceipt(null);
    setIsCreateModalOpen(true);
  };

  const handleCreateServiceReceipt = () => {
    setCurrentReceipt(null);
    setIsServiceReceiptModalOpen(true);
  };

  const handleViewReceipt = (receipt) => {
    setCurrentReceipt(receipt);
    setIsViewModalOpen(true);
  };

  const handleEditReceipt = (receipt) => {
    setCurrentReceipt(receipt);
    setIsServiceReceiptModalOpen(true);
    // setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCurrentReceipt(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentReceipt(null);
  };

  const handleCloseServiceReceiptModal = () => {
    setIsServiceReceiptModalOpen(false);
    setCurrentReceipt(null);
  };

  // Format amount as Philippine Peso
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };
  const handleDeleteReceipt = async (selectedReceipt) => {
    try {
      await dispatch(deleteGeneralServiceReceipt(selectedReceipt.ID)).unwrap();
      dispatch(fetchGeneralServiceReceipts());
      toast.success('Receipt deleted successfully.');
    } catch (error) {
      console.error('Error deleting receipt:', error);
      toast.error('Failed to delete receipt.');
    }
  };
  // Table columns definition
  const columns = [
    {
      key: 'ID',
      header: 'Invoice',
      sortable: true,
      className: 'font-medium text-neutral-900',
      render: (value) => <div className="flex items-center gap-1">{value}</div>,
    },
    {
      key: 'Status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded ${
            value === 'Posted'
              ? 'bg-green-100 text-green-800'
              : value === 'Rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'InvoiceDate',
      header: 'Date',
      sortable: true,
      // render: (value) => formatDate(value),
    },
    {
      key: 'CustomerName',
      header: 'Customer Name',
      sortable: true,
      render: (value) => value?.trim() || 'N/A',
    },
    {
      key: 'InvoiceNumber',
      header: 'Order No.',
      sortable: true,
    },
    {
      key: 'Total',
      header: 'Amount',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right font-medium',
    },
    {
      key: 'Remarks',
      header: 'Remarks',
      sortable: false,
      render: (value) => value || '—',
      className: 'text-gray-500',
    },
    {
      key: 'FundsID',
      header: 'Fund',
      sortable: true,
      render: (value) => {
        const fundMap = {
          1: 'General Fund',
          2: 'Special Education Fund',
          // Add other mappings as needed
        };
        return fundMap[value] || '—';
      },
    },
    {
      key: 'CheckNumber',
      header: 'Check',
      sortable: true,
      render: (value) => value || '—',
    },
    {
      key: 'MoneyOrder',
      header: 'Money Order',
      sortable: true,
      render: (value) => value || '—',
    },
    {
      key: 'MoneyOrderDate',
      header: 'Money Order Date',
      sortable: true,
      render: (value) => value || '—',
    },
  ];

  // Actions for table rows
  const actions = [
    // {
    //   icon: EyeIcon,
    //   title: 'View',
    //   onClick: handleViewReceipt,
    //   className:
    //     'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    // },
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditReceipt,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDeleteReceipt,
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];

  const handleGeneralServiceReceiptSubmit = async (values) => {
    if (!values) return; // Early return if no values

    try {
      const result = await dispatch(
        createGeneralServiceReceipt(values)
      ).unwrap();

      console.log('Operation successful:', result, values);

      dispatch(fetchGeneralServiceReceipts());

      toast.success('Receipt saved successfully.');
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error(error.message || 'Failed to save receipt');
    } finally {
      handleCloseServiceReceiptModal();
    }
  };
  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <div>
            <h1>General Service Receipt</h1>
            <p>Manage official receipts and collections</p>
          </div>
          <div className="flex space-x-2 max-sm:w-full">
            {Add && (
              <button
                type="button"
                onClick={handleCreateServiceReceipt}
                className="btn btn-primary max-sm:w-full"
              >
                <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Service Receipt
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={generalReceipts}
          actions={actions}
          loading={isLoading}
          onRowClick={handleViewReceipt}
        />
      </div>

      {/* General Service Receipt Modal */}
      <GeneralServiceReceiptModal
        isOpen={isServiceReceiptModalOpen}
        onClose={handleCloseServiceReceiptModal}
        selectedReceipt={currentReceipt}
        onSubmit={handleGeneralServiceReceiptSubmit}
        Print={Print}
      />

      {/* Receipt View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="General Receipt Details"
        size="lg"
      >
        {currentReceipt && (
          <div className="p-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4">
                  Receipt Details
                </h3>
                <dl className="space-y-2">
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-neutral-500">
                      OR Number
                    </dt>
                    <dd className="text-sm text-neutral-900 col-span-2">
                      {currentReceipt.receiptNumber}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-neutral-500">
                      Date
                    </dt>
                    <dd className="text-sm text-neutral-900 col-span-2">
                      {new Date(
                        currentReceipt.receiptDate
                      ).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-neutral-500">
                      Fund
                    </dt>
                    <dd className="text-sm text-neutral-900 col-span-2">
                      {currentReceipt.fund}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-neutral-500">
                      Mode of Payment
                    </dt>
                    <dd className="text-sm text-neutral-900 col-span-2">
                      {currentReceipt.modeOfPayment}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4">
                  Payor Information
                </h3>
                <dl className="space-y-2">
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-neutral-500">
                      Name
                    </dt>
                    <dd className="text-sm text-neutral-900 col-span-2">
                      {currentReceipt.payorName}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-neutral-500">
                      Address
                    </dt>
                    <dd className="text-sm text-neutral-900 col-span-2">
                      {currentReceipt.payorAddress || 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="p-4 bg-success-50 rounded-lg border border-success-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-success-700">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-success-700">
                  {formatCurrency(currentReceipt.totalAmount)}
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={handleCloseViewModal}
                className="btn btn-outline"
              >
                Close
              </button>
              {Edit && (
                <button
                  type="button"
                  onClick={() => handleEditReceipt(currentReceipt)}
                  className="btn btn-primary"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default GeneralReceiptPage;
