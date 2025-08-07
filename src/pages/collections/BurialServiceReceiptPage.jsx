import { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import BurialServiceReceiptForm from '../../components/forms/BurialServiceReceiptForm';
import Modal from '../../components/common/Modal';
import DataTable from '../../components/common/DataTable';
import { fetchNationalities } from '../../features/settings/nationalitiesSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBurialRecords,
  deleteBurialRecord,
  addBurialRecord,
} from '@/features/collections/burialServiceSlice';
import { PencilIcon, TrashIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchCustomers } from '@/features/settings/customersSlice';
import { useModulePermissions } from '@/utils/useModulePremission';
function BurialServiceReceiptPage() {
  const dispatch = useDispatch();
  // ---------------------USE MODULE PERMISSIONS------------------START (BurialServiceReceiptPage - MODULE ID =  28 )
  const { Add, Edit, Delete } = useModulePermissions(28);
  // -----------FETCH INDIVIDUALS--------------
  const { customers, isLoading: customerLoading } = useSelector(
    (state) => state.customers
  );

  const { nationalities, isLoading: nationalityLoading } = useSelector(
    (state) => state.nationalities
  );
  const { records: burialRecord, isLoading } = useSelector(
    (state) => state.burialRecords
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    dispatch(fetchNationalities());
    dispatch(fetchBurialRecords());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const columns = [
    {
      key: 'InvoiceNumber',
      header: 'Receipt No',
      sortable: true,
      className: 'font-medium text-neutral-900',
      render: (value) => (
        <div className="flex items-center gap-1">{value || '—'}</div>
      ),
    },
    {
      key: 'CustomerName',
      header: 'Name',
      sortable: true,
      render: (value) => value?.trim() || 'N/A',
    },
    {
      key: 'Municipality',
      header: 'Municipality',
      sortable: true,
      render: (value) => value || '—',
    },
    {
      key: 'InvoiceDate',
      header: 'Date',
      sortable: true,
      // render: (value) => (value ? formatDate(value) : '—'),
    },
    {
      key: 'DocumentType.Name',
      header: 'Service Type',
      sortable: true,
      render: (value, row) => row.DocumentType?.Name || '—',
      className: 'text-gray-500',
    },
    {
      key: 'Total',
      header: 'Amount',
      sortable: true,
      render: (value) => formatCurrency(value || '0.00'),
      className: 'text-right font-medium',
    },
    {
      key: 'Remarks',
      header: 'Remarks',
      sortable: false,
      render: (value) => value || '—',
      className: 'text-gray-500',
    },
    {
      key: 'FundsID',
      header: 'Fund',
      sortable: true,
      render: (value) => {
        const fundMap = {
          1: 'General Fund',
          2: 'Special Education Fund',
          // Add other mappings as needed
        };
        return fundMap[value] || '—';
      },
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

  const handleAdd = () => {
    setSelectedReceipt(null);
    setIsModalOpen(true);
  };

  const handleEdit = (receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const handleDeleteTicket = async (ticket) => {
    console.log('Deleting ticket:', ticket);
    try {
      await dispatch(deleteBurialRecord(ticket.ID)).unwrap();
      toast.success('Burial Receipt deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete Burial Receipt');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReceipt(null);
  };

  const handleFormSubmit = async (values) => {
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
      formData.append('IsNew', 'false');
      formData.append('LinkID', selectedReceipt.LinkID);
      formData.append('ID', selectedReceipt.ID);
    } else {
      formData.append('IsNew', 'true');
    }
    try {
      await dispatch(addBurialRecord(formData)).unwrap();

      selectedReceipt
        ? toast.success('Burial Receipt Updated Successfully')
        : toast.success('Burial Receipt Added Successfully');
      dispatch(fetchBurialRecords());
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      handleCloseModal();
    }
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
      onClick: handleDeleteTicket,
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];
  // console.log({ burialRecord });
  return (
    <>
      <div className="flex justify-between sm:items-center mb-6 page-header max-sm:flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Burial Service Receipts
          </h1>
          <p className="text-gray-600">Manage Burial Service Receipts</p>
        </div>
        {Add && (
          <button
            onClick={handleAdd}
            className="btn btn-primary max-sm:w-full "
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Receipt
          </button>
        )}
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={burialRecord}
          className="min-w-full divide-y divide-gray-200"
          actions={actions}
          isLoading={isLoading || nationalityLoading || customerLoading}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          selectedReceipt
            ? 'Edit Burial Service Receipt'
            : 'New Burial Service Receipt '
        }
      >
        <BurialServiceReceiptForm
          initialData={selectedReceipt}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          nationalities={nationalities}
          customers={customers}
        />
      </Modal>
    </>
  );
}

export default BurialServiceReceiptPage;
