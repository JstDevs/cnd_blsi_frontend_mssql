import { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import MarriageServiceReceiptForm from '../../components/forms/MarriageServiceReceiptForm';
import {
  fetchMarriageRecords,
  deleteMarriageRecord,
  addMarriageRecord,
} from '@/features/collections/MarriageSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchCustomers } from '@/features/settings/customersSlice';
import { useModulePermissions } from '@/utils/useModulePremission';

function MarriageServiceReceiptPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const dispatch = useDispatch();
  const { records: marriageRecords, isLoading } = useSelector(
    (state) => state.marriageRecords
  );
  const { customers, isLoading: customerLoading } = useSelector(
    (state) => state.customers
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (MarriageServiceReceiptPage - MODULE ID =  59 )
  const { Add, Edit, Delete } = useModulePermissions(59);
  useEffect(() => {
    dispatch(fetchMarriageRecords());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleAddReceipt = async (values) => {
    console.log('Form data to save:', values);
    const formData = new FormData();
    // Append all non-attachment fields
    for (const key in values) {
      if (key !== 'Attachments') {
        // For non-file fields, convert to string if not already
        const value =
          typeof values[key] === 'object'
            ? JSON.stringify(values[key])
            : values[key];
        // Rename TransactionItemsAll to Items
        if (key === 'TransactionItemsAll') {
          formData.append('Items', value);
        } else {
          formData.append(key, value);
        }
      }
    }

    // Handle attachments - simplified format
    values?.Attachments.forEach((att, idx) => {
      if (att.ID) {
        formData.append(`Attachments[${idx}].ID`, att.ID);
      } else {
        formData.append(`Attachments[${idx}].File`, att);
      }
    });
    // Add ID if editing existing receipt
    if (selectedReceipt) {
      formData.append('IsNew', false);
      formData.append('LinkID', selectedReceipt.LinkID);
      formData.append('ID', selectedReceipt.ID);
    } else {
      formData.append('IsNew', true);
    }
    try {
      await dispatch(addMarriageRecord(formData)).unwrap();

      selectedReceipt
        ? toast.success('Marriage Receipt Updated Successfully')
        : toast.success('Marriage Receipt Added Successfully');
      dispatch(fetchMarriageRecords());
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      handleCloseModal();
    }
  };

  const handleDeleteReceipt = async (ticket) => {
    console.log('Deleting ticket:', ticket);
    try {
      await dispatch(deleteMarriageRecord(ticket.ID)).unwrap();
      toast.success('Marriage Receipt deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete Marriage Receipt');
    }
  };

  const handleEdit = (receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReceipt(null);
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'Status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded ${
            value === 'Posted'
              ? 'bg-green-100 text-green-800'
              : value === 'Rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'APAR',
      header: 'AP/AR',
      sortable: true,
      render: (value) => value || '—',
    },
    {
      key: 'CustomerName',
      header: 'Customer',
      sortable: true,
      render: (value) => value?.trim() || 'N/A',
    },
    {
      key: 'Total',
      header: 'Total Amount',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right font-medium',
    },
    {
      key: 'AmountReceived',
      header: 'Amount Received',
      sortable: true,
      render: (value) => formatCurrency(value || '0.00'),
      className: 'text-right',
    },
    {
      key: 'Credit',
      header: 'Credit',
      sortable: true,
      render: (value) => formatCurrency(value || '0.00'),
      className: 'text-right',
    },
    {
      key: 'Debit',
      header: 'Debit',
      sortable: true,
      render: (value) => formatCurrency(value || '0.00'),
      className: 'text-right',
    },
    {
      key: 'EWT',
      header: 'EWT',
      sortable: true,
      render: (value) => formatCurrency(value || '0.00'),
      className: 'text-right',
    },
    {
      key: 'WithheldAmount',
      header: 'Withheld Amount',
      sortable: true,
      render: (value) => formatCurrency(value || '0.00'),
      className: 'text-right',
    },
    {
      key: 'Vat_Total',
      header: 'Total',
      sortable: true,
      render: (value) => formatCurrency(value || '0.00'),
      className: 'text-right font-medium',
    },
    {
      key: 'Discounts',
      header: 'Discount (%)',
      sortable: true,
      render: (value) => (value ? `${value}%` : '0%'),
      className: 'text-right',
    },
    {
      key: 'AmountDue',
      header: 'Amount Due',
      sortable: true,
      render: (value) => formatCurrency(value || '0.00'),
      className: 'text-right font-medium',
    },
  ];
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(value || 0);
  };
  // Actions for table rows
  const actions = [
    // {
    //   icon: EyeIcon,
    //   title: 'View',
    //   onClick: handleViewReceipt,
    //   className:
    //     'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    // },
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
      onClick: handleDeleteReceipt,
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];

  return (
    <>
      <div className="flex justify-between sm:items-center mb-6 page-header gap-4 max-sm:flex-col">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Marriage Service Receipts
          </h1>
          <p className="text-gray-600">Manage Marriage Service Receipts</p>
        </div>

        {Add && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary max-sm:w-full"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Receipt
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={marriageRecords}
        actions={actions}
        className="bg-white rounded-lg shadow"
        isLoading={isLoading || customerLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedReceipt ? 'Edit Receipt' : 'Add Receipt'}
      >
        <MarriageServiceReceiptForm
          initialData={selectedReceipt}
          customers={customers}
          onClose={handleCloseModal}
          onSubmit={handleAddReceipt}
        />
      </Modal>
    </>
  );
}

export default MarriageServiceReceiptPage;
