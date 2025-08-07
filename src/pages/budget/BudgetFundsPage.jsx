import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@/components/common/Modal';
import BudgetFundForm from '@/components/forms/BudgetFundForm';
import DataTable from '@/components/common/DataTable';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PencilIcon, TrashIcon } from 'lucide-react';
import {
  createBudgetFund,
  deleteBudgetFund,
  fetchFunds,
  updateBudgetFund,
} from '@/features/budget/fundsSlice';
import { useModulePermissions } from '@/utils/useModulePremission';

const BudgetFundsPage = () => {
  const dispatch = useDispatch();
  const { funds, loading } = useSelector((state) => state.funds);
  const [isOpen, setIsOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  // ---------------------USE MODULE PERMISSIONS------------------START (BudgetSubFundsPage - MODULE ID =  48 )
  const { Add, Edit, Delete } = useModulePermissions(48);
  const columns = [
    {
      key: 'Code',
      header: 'Code',
      sortable: true,
      className: 'font-medium text-neutral-900',
      render: (value) => value || '—',
    },
    {
      key: 'Name',
      header: 'Name',
      sortable: true,
      render: (value) => <span className="font-medium">{value || '—'}</span>,
    },
    {
      key: 'Description',
      header: 'Description',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600">{value || 'No description'}</span>
      ),
    },
    {
      key: 'OriginalAmount',
      header: 'Original Amount',
      sortable: true,
      // className: 'text-right',
      render: (value) => (
        <span className="font-medium">
          {value ? formatCurrency(value) : '—'}
        </span>
      ),
    },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(value);
  };

  const handleEdit = (data) => {
    setActiveRow(data);
    setIsOpen(true);
  };

  const handleDelete = async (row) => {
    await dispatch(deleteBudgetFund(row.ID)).unwrap();
    dispatch(fetchFunds());
  };

  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDelete,
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];

  const handleSubmit = async (values) => {
    if (activeRow) {
      await dispatch(updateBudgetFund(values)).unwrap();
    } else {
      await dispatch(createBudgetFund(values)).unwrap();
    }
    dispatch(fetchFunds());
    setIsOpen(false);
    setActiveRow(null);
  };

  const handleViewReceipt = (row) => {
    console.log('View row:', row);
  };

  useEffect(() => {
    dispatch(fetchFunds());
  }, [dispatch]);

  return (
    <>
      <div className="page-header">
        <div className="flex justify-between items-center max-sm:flex-wrap gap-4">
          <div>
            <h1>Budget Funds</h1>
            <p>Manage budget funds and allocations</p>
          </div>
          <div className="flex space-x-2  max-sm:w-full ">
            {Add && (
              <button
                type="button"
                onClick={() => {
                  setActiveRow(null);
                  setIsOpen(true);
                }}
                className="btn btn-primary max-sm:w-full "
              >
                <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Add Fund
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={funds}
          actions={actions}
          loading={loading}
          onRowClick={handleViewReceipt}
        />
      </div>

      <Modal
        size="sm"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setActiveRow(null);
        }}
        title={activeRow ? 'Edit Budget Fund' : 'Add New Budget Fund'}
      >
        <BudgetFundForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => {
            setIsOpen(false);
            setActiveRow(null);
          }}
        />
      </Modal>
    </>
  );
};

export default BudgetFundsPage;
