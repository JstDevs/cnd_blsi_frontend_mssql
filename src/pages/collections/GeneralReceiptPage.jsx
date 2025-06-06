import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, EyeIcon, PencilIcon, PrinterIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import { fetchGeneralReceipts } from '../../features/collections/generalReceiptSlice';

function GeneralReceiptPage() {
  const dispatch = useDispatch();
  const { generalReceipts, isLoading } = useSelector(state => state.generalReceipts);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState(null);
  
  useEffect(() => {
    dispatch(fetchGeneralReceipts());
  }, [dispatch]);
  
  const handleCreateReceipt = () => {
    setCurrentReceipt(null);
    setIsCreateModalOpen(true);
  };
  
  const handleViewReceipt = (receipt) => {
    setCurrentReceipt(receipt);
    setIsViewModalOpen(true);
  };
  
  const handleEditReceipt = (receipt) => {
    setCurrentReceipt(receipt);
    setIsCreateModalOpen(true);
  };
  
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCurrentReceipt(null);
  };
  
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentReceipt(null);
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
      key: 'receiptNumber',
      header: 'OR Number',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'receiptDate',
      header: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'payorName',
      header: 'Payor',
      sortable: true,
    },
    {
      key: 'fund',
      header: 'Fund',
      sortable: true,
    },
    {
      key: 'modeOfPayment',
      header: 'Mode of Payment',
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
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'Valid' ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
        }`}>
          {value}
        </span>
      ),
    },
  ];
  
  // Actions for table rows
  const actions = [
    {
      icon: EyeIcon,
      title: 'View',
      onClick: handleViewReceipt,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditReceipt,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: PrinterIcon,
      title: 'Print',
      onClick: (receipt) => console.log('Print receipt:', receipt),
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>General Receipts</h1>
            <p>Manage official receipts and collections</p>
          </div>
          <button
            type="button"
            onClick={handleCreateReceipt}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Create Receipt
          </button>
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
      
      {/* Receipt Creation/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title={currentReceipt ? "Edit General Receipt" : "Create General Receipt"}
        size="lg"
      >
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Receipt Date"
              name="receiptDate"
              type="date"
              required
            />
            
            <FormField
              label="Fund"
              name="fund"
              type="select"
              required
              options={[
                { value: 'General Fund', label: 'General Fund' },
                { value: 'Special Education Fund', label: 'Special Education Fund' },
                { value: 'Trust Fund', label: 'Trust Fund' },
              ]}
            />
          </div>
          
          <FormField
            label="Payor Name"
            name="payorName"
            type="text"
            required
            placeholder="Enter payor name"
          />
          
          <FormField
            label="Payor Address"
            name="payorAddress"
            type="textarea"
            placeholder="Enter payor address"
            rows={2}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Mode of Payment"
              name="modeOfPayment"
              type="select"
              required
              options={[
                { value: 'Cash', label: 'Cash' },
                { value: 'Cheque', label: 'Cheque' },
                { value: 'Bank Transfer', label: 'Bank Transfer' },
              ]}
            />
            
            <FormField
              label="Amount"
              name="amount"
              type="number"
              required
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={handleCloseCreateModal}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {currentReceipt ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
      
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
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Receipt Details</h3>
                <dl className="space-y-2">
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-neutral-500">OR Number</dt>
                    <dd className="text-sm text-neutral-900 col-span-2">{currentReceipt.receiptNumber}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-neutral-500">Date</dt>
                    <dd className="text-sm text-neutral-900 col-span-2">
                      {new Date(currentReceipt.receiptDate).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-neutral-500">Fund</dt>
                    <dd className="text-sm text-neutral-900 col-span-2">{currentReceipt.fund}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-neutral-500">Mode of Payment</dt>
                    <dd className="text-sm text-neutral-900 col-span-2">{currentReceipt.modeOfPayment}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Payor Information</h3>
                <dl className="space-y-2">
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-neutral-500">Name</dt>
                    <dd className="text-sm text-neutral-900 col-span-2">{currentReceipt.payorName}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-neutral-500">Address</dt>
                    <dd className="text-sm text-neutral-900 col-span-2">{currentReceipt.payorAddress || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="p-4 bg-success-50 rounded-lg border border-success-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-success-700">Total Amount</span>
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
              <button
                type="button"
                onClick={() => handleEditReceipt(currentReceipt)}
                className="btn btn-primary"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default GeneralReceiptPage;