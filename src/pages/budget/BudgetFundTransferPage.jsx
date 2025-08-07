import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PencilIcon, TrashIcon } from 'lucide-react';
import Modal from '../../components/common/Modal';
import BudgetFundTransferForm from '../../components/forms/BudgetFundTransferForm';
import DataTable from '../../components/common/DataTable';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFundOptions,
  fetchFundTransfers,
  createFundTransfer,
} from '@/features/budget/fundTransferSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

const BudgetFundTransferPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const dispatch = useDispatch();
  // ---------------------USE MODULE PERMISSIONS------------------START (BudgetFundTransferPage - MODULE ID =  46 )
  const { Add, Edit } = useModulePermissions(46);
  const {
    transfers: data,
    fundOptions,
    loading,
    error,
  } = useSelector((state) => state.fundTransfer);

  // console.log(data, fundOptions, loading, error);
  useEffect(() => {
    dispatch(fetchFundOptions());
    dispatch(fetchFundTransfers());
  }, []);
  const columns = [
    {
      key: 'InvoiceNumber',
      header: 'Invoice Number',
      sortable: true,
      className: 'font-medium text-neutral-900',
      render: (value) => value || '—',
    },
    {
      key: 'FundsID',
      header: 'Fund Source',
      sortable: true,
      render: (value, record) => (
        <span className="text-gray-600">
          {record?.Funds?.Name || value || '—'}
        </span>
      ),
    },
    {
      key: 'TargetID',
      header: 'Fund Target',
      sortable: true,
      render: (value, record) => (
        <span className="text-gray-600">
          {record?.targetFunds?.Name || value || '—'}
        </span>
      ),
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
    {
      key: 'InvoiceDate',
      header: 'Invoice Date',
      sortable: true,
      render: (value) => <span className="font-medium">{value || '—'}</span>,
    },
    {
      key: 'Total',
      header: 'Total',
      sortable: true,
      render: (value) => <span className="font-medium">{value || '—'}</span>,
    },
    {
      key: 'Remarks',
      header: 'Remarks',
      sortable: true,
      render: (value) => <span className="font-medium">{value || '—'}</span>,
    },
  ];

  // const actions = [
  // {
  //   icon: PencilIcon,
  //   title: 'Edit',
  //   onClick: (row) => handleEdit(row),
  //   className:
  //     'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
  // },
  // {
  //   icon: TrashIcon,
  //   title: 'Delete',
  //   onClick: (row) => handleDelete(row.id),
  //   className:
  //     'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
  // },
  // ];
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

    // Uncomment if you want to add Delete action for all statuses
    /*
  baseActions.push({
    icon: TrashIcon,
    title: 'Delete',
    onClick: () => handleDelete(row.id),
    className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
  });
  */

    return baseActions;
  };
  const handleSubmit = async (values) => {
    try {
      if (activeRow) {
        // console.log('Updated:', { values });
        await dispatch(createFundTransfer(values)).unwrap();
        await dispatch(fetchFundTransfers()).unwrap();
        toast.success('Transfer updated successfully');
      } else {
        // console.log('Created:', { values });
        await dispatch(createFundTransfer(values)).unwrap();
        await dispatch(fetchFundTransfers()).unwrap();
        toast.success('Transfer created successfully');
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    }
  };

  const handleEdit = (data) => {
    setActiveRow(data);
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    console.log('Deleted transfer with id:', id);
    toast.success('Transfer deleted successfully');
  };

  const handleViewTransfer = (row) => {
    console.log('View transfer:', row);
  };

  return (
    <>
      <div className="page-header">
        <div className="flex justify-between items-center max-sm:flex-wrap gap-4">
          <div>
            <h1>Fund Transfer</h1>
            <p>Manage fund transfers between accounts</p>
          </div>
          <div className="flex space-x-2 max-sm:w-full">
            {Add && (
              <button
                type="button"
                onClick={() => handleEdit(null)}
                className="btn btn-primary max-sm:w-full"
              >
                <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Add Transfer
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={data}
          actions={actions}
          loading={loading}
          onRowClick={handleViewTransfer}
        />
      </div>

      <Modal
        size="xl"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={activeRow ? 'Edit Fund Transfer' : 'Add Fund Transfer'}
      >
        <BudgetFundTransferForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => setIsOpen(false)}
          fundOptions={fundOptions}
        />
      </Modal>
    </>
  );
};

export default BudgetFundTransferPage;
