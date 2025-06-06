import { useState } from 'react';
import { PlusIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';

function FundsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFund, setCurrentFund] = useState(null);
  
  // Mock data for table
  const funds = [
    {
      id: 1,
      fundCode: 'GF',
      fundName: 'General Fund',
      description: 'Main operating fund of the LGU',
      balance: 10000000,
      status: 'Active',
    },
    {
      id: 2,
      fundCode: 'SEF',
      fundName: 'Special Education Fund',
      description: 'Fund for educational programs and projects',
      balance: 5000000,
      status: 'Active',
    },
    {
      id: 3,
      fundCode: 'TF',
      fundName: 'Trust Fund',
      description: 'Fund for specific purposes and programs',
      balance: 2000000,
      status: 'Active',
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
      key: 'fundCode',
      header: 'Fund Code',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'fundName',
      header: 'Fund Name',
      sortable: true,
    },
    {
      key: 'description',
      header: 'Description',
      sortable: true,
    },
    {
      key: 'balance',
      header: 'Current Balance',
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
          value === 'Active' ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-800'
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
      onClick: (fund) => handleViewFund(fund),
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: (fund) => handleEditFund(fund),
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
  ];
  
  const handleCreateFund = () => {
    setCurrentFund(null);
    setIsModalOpen(true);
  };
  
  const handleViewFund = (fund) => {
    setCurrentFund(fund);
    setIsModalOpen(true);
  };
  
  const handleEditFund = (fund) => {
    setCurrentFund(fund);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Funds</h1>
            <p>Manage LGU funds and their balances</p>
          </div>
          <button
            type="button"
            onClick={handleCreateFund}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Fund
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={funds}
          actions={actions}
          pagination={true}
        />
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentFund ? "Edit Fund" : "New Fund"}
        size="lg"
      >
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Fund Code"
              name="fundCode"
              type="text"
              required
              placeholder="Enter fund code"
            />
            
            <FormField
              label="Fund Name"
              name="fundName"
              type="text"
              required
              placeholder="Enter fund name"
            />
          </div>
          
          <FormField
            label="Description"
            name="description"
            type="textarea"
            placeholder="Enter fund description"
            rows={3}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Opening Balance"
              name="balance"
              type="number"
              required
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            
            <FormField
              label="Status"
              name="status"
              type="select"
              required
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
            />
          </div>
          
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
              {currentFund ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FundsPage;