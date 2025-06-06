import { useState } from 'react';
import { PlusIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';

function AnnualBudgetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  
  // Mock data for table
  const budgets = [
    {
      id: 1,
      year: 2024,
      ordinanceNumber: 'ORD-2024-001',
      fund: 'General Fund',
      totalAmount: 50000000,
      status: 'Approved',
      approvalDate: '2023-12-15',
    },
    {
      id: 2,
      year: 2024,
      ordinanceNumber: 'ORD-2024-002',
      fund: 'Special Education Fund',
      totalAmount: 20000000,
      status: 'Pending',
      approvalDate: null,
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
      key: 'year',
      header: 'Year',
      sortable: true,
    },
    {
      key: 'ordinanceNumber',
      header: 'Ordinance No.',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'fund',
      header: 'Fund',
      sortable: true,
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
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
          value === 'Approved' ? 'bg-success-100 text-success-800' : 
          value === 'Pending' ? 'bg-warning-100 text-warning-800' : 
          'bg-neutral-100 text-neutral-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'approvalDate',
      header: 'Approval Date',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
  ];
  
  // Actions for table rows
  const actions = [
    {
      icon: EyeIcon,
      title: 'View',
      onClick: (budget) => handleViewBudget(budget),
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: (budget) => handleEditBudget(budget),
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
  ];
  
  const handleCreateBudget = () => {
    setCurrentBudget(null);
    setIsModalOpen(true);
  };
  
  const handleViewBudget = (budget) => {
    setCurrentBudget(budget);
    setIsModalOpen(true);
  };
  
  const handleEditBudget = (budget) => {
    setCurrentBudget(budget);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Annual Budget</h1>
            <p>Manage annual budget appropriations</p>
          </div>
          <button
            type="button"
            onClick={handleCreateBudget}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Budget
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={budgets}
          actions={actions}
          pagination={true}
        />
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentBudget ? "Edit Annual Budget" : "New Annual Budget"}
        size="lg"
      >
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Year"
              name="year"
              type="number"
              required
              min="2000"
              max="2100"
            />
            
            <FormField
              label="Ordinance Number"
              name="ordinanceNumber"
              type="text"
              required
              placeholder="Enter ordinance number"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          
          <FormField
            label="Total Amount"
            name="totalAmount"
            type="number"
            required
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          
          <FormField
            label="Approval Date"
            name="approvalDate"
            type="date"
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
              {currentBudget ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AnnualBudgetPage;