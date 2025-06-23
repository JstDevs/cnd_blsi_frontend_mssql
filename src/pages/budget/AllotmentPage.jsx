import { useState } from 'react';
import { PlusIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';

function AllotmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAllotment, setCurrentAllotment] = useState(null);
  
  // Mock data for table
  const allotments = [
    {
      id: 1,
      aroNumber: 'ARO-2024-01-0001',
      date: '2024-01-15',
      department: 'IT Department',
      fund: 'General Fund',
      amount: 500000,
      status: 'Released',
      period: 'Q1 2024',
    },
    {
      id: 2,
      aroNumber: 'ARO-2024-01-0002',
      date: '2024-01-20',
      department: 'Engineering Department',
      fund: 'General Fund',
      amount: 750000,
      status: 'Pending',
      period: 'Q1 2024',
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
      key: 'aroNumber',
      header: 'ARO Number',
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
      key: 'fund',
      header: 'Fund',
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
      key: 'period',
      header: 'Period',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'Released' ? 'bg-success-100 text-success-800' : 
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
      onClick: (allotment) => handleViewAllotment(allotment),
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: (allotment) => handleEditAllotment(allotment),
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
  ];
  
  const handleCreateAllotment = () => {
    setCurrentAllotment(null);
    setIsModalOpen(true);
  };
  
  const handleViewAllotment = (allotment) => {
    setCurrentAllotment(allotment);
    setIsModalOpen(true);
  };
  
  const handleEditAllotment = (allotment) => {
    setCurrentAllotment(allotment);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Budget Allotments</h1>
            <p>Manage allotment release orders (ARO)</p>
          </div>
          <button
            type="button"
            onClick={handleCreateAllotment}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Allotment
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={allotments}
          actions={actions}
          pagination={true}
        />
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentAllotment ? "Edit Allotment" : "New Allotment"}
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
              label="Period"
              name="period"
              type="select"
              required
              options={[
                { value: 'Q1 2024', label: 'Q1 2024' },
                { value: 'Q2 2024', label: 'Q2 2024' },
                { value: 'Q3 2024', label: 'Q3 2024' },
                { value: 'Q4 2024', label: 'Q4 2024' },
              ]}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            label="Amount"
            name="amount"
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
              { value: 'Draft', label: 'Draft' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Released', label: 'Released' },
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
              {currentAllotment ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AllotmentPage;