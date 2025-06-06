import { useState } from 'react';
import { PlusIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';

function BudgetTransferPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransfer, setCurrentTransfer] = useState(null);
  
  // Mock data for table
  const transfers = [
    {
      id: 1,
      transferNumber: 'BT-2024-01-0001',
      date: '2024-01-15',
      department: 'IT Department',
      fromAccount: '5-02-01-010',
      toAccount: '5-02-01-020',
      amount: 50000,
      status: 'Approved',
      reason: 'Realignment of MOOE',
    },
    {
      id: 2,
      transferNumber: 'BT-2024-01-0002',
      date: '2024-01-20',
      department: 'Engineering Department',
      fromAccount: '5-02-03-010',
      toAccount: '5-02-03-020',
      amount: 75000,
      status: 'Pending',
      reason: 'Additional funding for infrastructure projects',
    },
  ];
  
  // Format amount as Philippine Peso
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };
  
  // Table columns
  const columns = [
    {
      key: 'transferNumber',
      header: 'Transfer No.',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'reason',
      header: 'Reason',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'Approved' ? 'bg-success-100 text-success-800' : 
          value === 'Pending' ? 'bg-warning-100 text-warning-800' : 
          'bg-neutral-100 text-neutral-800'
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
      onClick: (transfer) => handleViewTransfer(transfer),
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: (transfer) => handleEditTransfer(transfer),
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
  ];
  
  const handleCreateTransfer = () => {
    setCurrentTransfer(null);
    setIsModalOpen(true);
  };
  
  const handleViewTransfer = (transfer) => {
    setCurrentTransfer(transfer);
    setIsModalOpen(true);
  };
  
  const handleEditTransfer = (transfer) => {
    setCurrentTransfer(transfer);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Budget Transfers</h1>
            <p>Manage budget realignments and transfers</p>
          </div>
          <button
            type="button"
            onClick={handleCreateTransfer}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Transfer
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={transfers}
          actions={actions}
          pagination={true}
        />
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentTransfer ? "Edit Budget Transfer" : "New Budget Transfer"}
        size="lg"
      >
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Date"
              name="date"
              type="date"
              required
            />
            
            <FormField
              label="Department"
              name="department"
              type="select"
              required
              options={[
                { value: 'IT Department', label: 'IT Department' },
                { value: 'Engineering Department', label: 'Engineering Department' },
                { value: 'Accounting Department', label: 'Accounting Department' },
              ]}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="From Account"
              name="fromAccount"
              type="select"
              required
              options={[
                { value: '5-02-01-010', label: '5-02-01-010 - Office Supplies' },
                { value: '5-02-03-010', label: '5-02-03-010 - Repairs and Maintenance' },
              ]}
            />
            
            <FormField
              label="To Account"
              name="toAccount"
              type="select"
              required
              options={[
                { value: '5-02-01-020', label: '5-02-01-020 - ICT Supplies' },
                { value: '5-02-03-020', label: '5-02-03-020 - Transportation Expenses' },
              ]}
            />
          </div>
          
          <FormField
            label="Amount"
            name="amount"
            type="number"
            required
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          
          <FormField
            label="Reason"
            name="reason"
            type="textarea"
            required
            placeholder="Enter reason for transfer"
            rows={3}
          />
          
          <FormField
            label="Status"
            name="status"
            type="select"
            required
            options={[
              { value: 'Draft', label: 'Draft' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Approved', label: 'Approved' },
            ]}
          />
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {currentTransfer ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BudgetTransferPage;