import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../../components/common/Modal';
import DataTable from '../../components/common/DataTable';
import BudgetForm from '../../components/forms/BudgetForm';

function BudgetPage() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { budgets, isLoading } = useSelector((state) => state.budget);

  // Mock data for demonstration
  const mockData = [
    {
      id: 1,
      budgetName: '2024 Operating Budget',
      fiscalYear: '2024',
      department: 'Department 1',
      subDepartment: 'Sub-Department 1',
      chartOfAccounts: 'Chart of Accounts 1',
      fund: 'General Fund',
      project: 'Project 1',
      appropriation: 1000000,
      charges: 500000,
      totalAmount: 1500000,
      balance: 1000000,
      status: 'active',
    },
    {
      id: 2,
      budgetName: '2024 Capital Budget',
      fiscalYear: '2024',
      department: 'Department 2',
      subDepartment: 'Sub-Department 2',
      chartOfAccounts: 'Chart of Accounts 2',
      fund: 'General Fund',
      project: 'Project 2',
      appropriation: 2000000,
      charges: 1000000,
      totalAmount: 3000000,
      balance: 2000000,
      status: 'active',
    },
  ];

  const columns = [
    {
      header: 'Budget Name',
      accessorKey: 'budgetName',
      enableSorting: true,
    },
    {
      header: 'Fiscal Year',
      accessorKey: 'fiscalYear',
      enableSorting: true,
    },
    {
      header: 'Department',
      accessorKey: 'department',
      enableSorting: true,
    },
    {
      header: 'Sub-Department',
      accessorKey: 'subDepartment',
    },
    {
      header: 'Project',
      accessorKey: 'project',
    },
    {
      header: 'Total Amount',
      accessorKey: 'totalAmount',
      cell: ({ row }) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP'
      }).format(row.original.totalAmount),
    },
    {
      header: 'Balance',
      accessorKey: 'balance',
      cell: ({ row }) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP'
      }).format(row.original.balance),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.original.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
  ];

  const handleAddNew = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    // Implement delete functionality
    console.log('Delete record:', record);
  };

  const handleSubmit = async (values) => {
    try {
      if (selectedRecord) {
        // Update existing record
        console.log('Update record:', values);
      } else {
        // Create new record
        console.log('Create record:', values);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Budget Management</h1>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add New Budget
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <DataTable
          columns={columns}
          data={mockData}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRecord ? 'Edit Budget' : 'Add New Budget'}
      >
        <BudgetForm
          initialData={selectedRecord}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default BudgetPage; 