import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/common/Modal';
import BudgetTransferForm from '@/components/forms/BudgetTransferForm';
import { toast } from 'react-hot-toast';
import DataTable from '@/components/common/DataTable'; // Assuming you have this
import {
  createBudgetTransfer,
  fetchBudgetOptions,
  fetchBudgetTransfers,
} from '@/features/budget/budgetTransferSlice';
import { useModulePermissions } from '@/utils/useModulePremission';

const BudgetTransferPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const dispatch = useDispatch();
  // ---------------------USE MODULE PERMISSIONS------------------START (BudgetTransferPage - MODULE ID =  27 )
  const { Add, Edit } = useModulePermissions(27);
  const {
    transfers: data,
    budgetOptions,
    loading,
    error,
  } = useSelector((state) => state.budgetTransfer);

  console.log(data, budgetOptions, loading, error);
  useEffect(() => {
    dispatch(fetchBudgetOptions());
    dispatch(fetchBudgetTransfers());
  }, []);
  const handleEdit = (row) => {
    setActiveRow(row);
    setIsModalOpen(true);
  };

  const handleDelete = (row) => {
    toast.success(`Deleted ${row.InvoiceNumber}`);
    // dispatch(deleteTransfer(row.id)); // Uncomment when integrated
  };

  const handleSubmit = async (values) => {
    try {
      if (activeRow) {
        // console.log('Updated:', { values });
        await dispatch(createBudgetTransfer(values)).unwrap();
        await dispatch(fetchBudgetTransfers()).unwrap();
        toast.success('Transfer updated successfully');
      } else {
        // console.log('Created:', { values });
        await dispatch(createBudgetTransfer(values)).unwrap();
        await dispatch(fetchBudgetTransfers()).unwrap();
        toast.success('Transfer created successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    }
  };

  const columns = [
    { key: 'InvoiceNumber', header: 'Invoice #', sortable: true },
    {
      key: 'BudgetID',
      header: 'Budget',
      sortable: true,
      render: (value, row) => row?.Budget?.Name || value || '—',
    },
    {
      key: 'Status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value === 'Requested'
              ? 'bg-warning-100 text-warning-800'
              : value === 'Approved'
              ? 'bg-success-100 text-success-800'
              : 'bg-error-100 text-error-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: 'InvoiceDate', header: 'Invoice Date', sortable: true },
    { key: 'Total', header: 'Total', sortable: true, numeric: true },
    { key: 'Remarks', header: 'Remarks', sortable: false },
  ];

  const actions = (row) => {
    const baseActions = [];
    // Only add Edit action if status is "Rejected" , use Requested to Test it
    if (row.Status === 'Rejected' && Edit) {
      baseActions.push({
        icon: PencilIcon,
        title: 'Edit',
        onClick: () => handleEdit(row),
        className:
          'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
    }
    return baseActions;
  };
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header flex justify-between items-center gap-4 flex-wrap ">
        <div>
          <h1>Budget Transfer</h1>
          <p>Manage your budget transfers here</p>
        </div>
        {Add && (
          <button
            onClick={() => handleEdit(null)}
            className="btn btn-primary max-sm:w-full"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Transfer
          </button>
        )}
      </div>
      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        actions={actions}
        pagination={true}
      />

      {/* Modal */}
      <Modal
        size="xl"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeRow ? 'Edit Transfer' : 'Add New Transfer'}
      >
        <BudgetTransferForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => setIsModalOpen(false)}
          budgetOptions={budgetOptions}
        />
      </Modal>
    </div>
  );
};

export default BudgetTransferPage;
