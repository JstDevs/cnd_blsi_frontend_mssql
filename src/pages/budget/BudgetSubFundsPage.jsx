import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/common/Modal';
import BudgetSubFundsForm from '../../components/forms/BudgetSubFundsForm';
import DataTable from '../../components/common/DataTable';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  fetchSubFunds,
  addSubFund,
  updateSubFund,
  deleteSubFund,
} from '@/features/budget/subFundsSlice'; // Update the import path as needed
import { fetchFunds } from '@/features/budget/fundsSlice';
import { useModulePermissions } from '@/utils/useModulePremission';

const BudgetSubFundsPage = () => {
  const dispatch = useDispatch();
  const { subFunds, isLoading } = useSelector((state) => state.subFunds);
  const { funds, loading } = useSelector((state) => state.funds);
  const [isOpen, setIsOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  // ---------------------USE MODULE PERMISSIONS------------------START (BudgetSubFundsPage - MODULE ID =  97 )
  const { Add, Edit, Delete } = useModulePermissions(97);
  const columns = [
    {
      key: 'FundsID',
      header: 'Funds ID',
      sortable: true,
      className: 'font-medium text-neutral-900',
      render: (value) => value || '—',
    },
    {
      key: 'Code',
      header: 'Code',
      sortable: true,
      render: (value) => <span className="font-medium">{value || '—'}</span>,
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
      key: 'Amount',
      header: 'Amount',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="font-medium">
          {value ? formatCurrency(value) : '—'}
        </span>
      ),
    },
  ];

  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: (row) => handleEdit(row),
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: (row) => handleDelete(row),
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];

  // Currency formatter
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(value);
  };

  const handleDelete = async (row) => {
    try {
      await dispatch(deleteSubFund(row.ID)).unwrap();
      toast.success('Sub fund deleted successfully');
    } catch (error) {
      toast.error(error.payload || 'Failed to delete sub fund');
      console.error(error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (activeRow) {
        const updateData = {
          IsNew: false,
          ID: activeRow.ID,
          FundsID: values.fund,
          Code: values.code,
          Name: values.name,
          Description: values.desc,
          Amount: values.amount,
        };
        await dispatch(updateSubFund(updateData)).unwrap();
        toast.success('Sub fund updated successfully');
      } else {
        const createData = {
          IsNew: true,
          FundsID: values.fund,
          Code: values.code,
          Name: values.name,
          Description: values.desc,
          Amount: values.amount,
        };
        await dispatch(addSubFund(createData)).unwrap();
        toast.success('Sub fund added successfully');
      }
      dispatch(fetchSubFunds());
      setIsOpen(false);
      setActiveRow(null);
    } catch (error) {
      toast.error(error.payload || 'Failed to save sub fund');
      console.error(error);
    }
  };

  const handleEdit = (data) => {
    setActiveRow(data);
    setIsOpen(true);
  };

  const handleViewSubFund = (row) => {
    console.log('View row:', row);
  };

  useEffect(() => {
    dispatch(fetchSubFunds());
    dispatch(fetchFunds());
  }, [dispatch]);
  const fundsOptions = funds?.map((item) => ({
    value: item.ID,
    label: item.Name,
  }));
  return (
    <>
      <div className="page-header">
        <div className="flex justify-between items-center max-sm:flex-wrap gap-4">
          <div>
            <h1>Sub Funds</h1>
            <p>Manage budget sub funds and allocations</p>
          </div>
          <div className="flex space-x-2 max-sm:w-full">
            {Add && (
              <button
                type="button"
                onClick={() => handleEdit(null)}
                className="btn btn-primary max-sm:w-full "
              >
                <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Add Sub Fund
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={subFunds}
          actions={actions}
          loading={isLoading || loading}
          onRowClick={handleViewSubFund}
        />
      </div>

      <Modal
        size="sm"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={activeRow ? 'Edit Sub Fund' : 'Add New Sub Fund'}
      >
        <BudgetSubFundsForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          funds={fundsOptions}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
};

export default BudgetSubFundsPage;
