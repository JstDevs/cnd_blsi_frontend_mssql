import { forwardRef, useEffect, useRef, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import MarriageServiceReceiptForm from '../../components/forms/MarriageServiceReceiptForm';
import {
  fetchMarriageRecords,
  deleteMarriageRecord,
  addMarriageRecord,
  approveMarriageRecord,
  rejectMarriageRecord,
} from '@/features/collections/MarriageSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchCustomers } from '@/features/settings/customersSlice';
import { useModulePermissions } from '@/utils/useModulePremission';
import { useReactToPrint } from 'react-to-print';
import { PrinterIcon } from 'lucide-react';

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
  const { Add, Edit, Delete, Print } = useModulePermissions(59);
  useEffect(() => {
    dispatch(fetchMarriageRecords());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Marriage Service Receipt',
  });
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
            dispatch(fetchCustomers());
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      handleCloseModal();
    }
  };

  const handleDeleteReceipt = async (record) => {
    if (window.confirm('Are you sure you want to void this marriage record? This action cannot be undone.')) {
      try {
        await dispatch(deleteMarriageRecord(record.ID)).unwrap();
        toast.success('Marriage record voided successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to void');
      }
    }
  };

  const handleEdit = (receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const handleApprove = async (record) => {
    if (!window.confirm('Are you sure you want to approve this record?')) return;
    try {
      await dispatch(approveMarriageRecord(record.ID)).unwrap();
      toast.success('Marriage Receipt Approved and Posted');
    } catch (error) {
      toast.error(error.message || 'Failed to approve');
    }
  };


  const handleReject = async (record) => {
    const reason = window.prompt('Enter rejection reason:');
    if (reason === null) return; // User cancelled
    try {
      await dispatch(rejectMarriageRecord({ id: record.ID, reason })).unwrap();
      toast.success('Marriage Receipt Rejected');
    } catch (error) {
      toast.error(error.message || 'Failed to reject');
    }
  };


  const handleCloseModal = () => {
    setSelectedReceipt(null);
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'InvoiceNumber',
      header: 'Receipt No.',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'Status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded ${value === 'Requested' ? 'bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500 text-error-700'
            : value === 'Approved' ? 'bg-gradient-to-r from-success-300 via-success-500 to-success-600 text-neutral-800'
              : value === 'Posted' ? 'bg-gradient-to-r from-success-800 via-success-900 to-success-999 text-success-100'
                : value === 'Rejected' ? 'bg-gradient-to-r from-error-700 via-error-800 to-error-999 text-neutral-100'
                  : value === 'Void' ? 'bg-gradient-to-r from-primary-900 via-primary-999 to-tertiary-999 text-neutral-300'
                    : value === 'Cancelled' ? 'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-400 text-neutral-800'
                      : 'bg-gray-100 text-gray-800'
            }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'InvoiceDate',
      header: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    // {
    //   key: 'APAR',
    //   header: 'AP/AR',
    //   sortable: true,
    //   render: (value) => value || '—',
    // },
    {
      key: 'CustomerName',
      header: 'Customer',
      sortable: true,
      render: (value) => value?.trim() || 'N/A',
    },
    {
      key: 'Total',
      header: 'Amount',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right font-semibold text-primary-700">
          {formatCurrency(value)}
        </span>
      ),
    },
    // {
    //   key: 'AmountReceived',
    //   header: 'Amount Received',
    //   sortable: true,
    //   render: (value) => formatCurrency(value || '0.00'),
    //   className: 'text-right',
    // },
    // {
    //   key: 'Credit',
    //   header: 'Credit',
    //   sortable: true,
    //   render: (value) => formatCurrency(value || '0.00'),
    //   className: 'text-right',
    // },
    // {
    //   key: 'Debit',
    //   header: 'Debit',
    //   sortable: true,
    //   render: (value) => formatCurrency(value || '0.00'),
    //   className: 'text-right',
    // },
    // {
    //   key: 'EWT',
    //   header: 'EWT',
    //   sortable: true,
    //   render: (value) => formatCurrency(value || '0.00'),
    //   className: 'text-right',
    // },
    // {
    //   key: 'WithheldAmount',
    //   header: 'Withheld Amount',
    //   sortable: true,
    //   render: (value) => formatCurrency(value || '0.00'),
    //   className: 'text-right',
    // },
    // {
    //   key: 'Vat_Total',
    //   header: 'Total',
    //   sortable: true,
    //   render: (value) => formatCurrency(value || '0.00'),
    //   className: 'text-right font-medium',
    // },
    // {
    //   key: 'Discounts',
    //   header: 'Discount (%)',
    //   sortable: true,
    //   render: (value) => (value ? `${value}%` : '0%'),
    //   className: 'text-right',
    // },
    // {
    //   key: 'AmountDue',
    //   header: 'Amount Due',
    //   sortable: true,
    //   render: (value) => formatCurrency(value || '0.00'),
    //   className: 'text-right font-medium',
    // },
  ];
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(value || 0);
  };
  // Actions for table rows
  const actions = (row) => {
    const list = [];
    const status = (row.Status || '').toString().trim();

    if (status === 'Void') {
      return [{
        icon: PencilIcon, // Using PencilIcon for view in this context if EyeIcon is not available, or just use as Read-only
        title: 'View',
        onClick: () => handleEdit(row),
        className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      }];
    }

    // Show Approve/Reject ONLY if status is "Requested"
    if (status === 'Requested') {
      list.push(
        {
          icon: CheckIcon,
          title: 'Approve',
          onClick: () => handleApprove(row),
          className: 'text-success-600 hover:text-success-900 p-1 rounded-full hover:bg-success-50',
        },
        {
          icon: XMarkIcon,
          title: 'Reject',
          onClick: () => handleReject(row),
          className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
        }
      );
    }
    // Always show Edit and Delete (or you can add logic here too)
    if (Edit) {
      list.push({
        icon: PencilIcon,
        title: 'Edit',
        onClick: () => handleEdit(row),
        className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
    }
    if (Delete) {
      list.push({
        icon: TrashIcon,
        title: 'Void',
        onClick: () => handleDeleteReceipt(row),
        className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
      });
    }
    return list;
    // [
    //   // {
    //   //   icon: EyeIcon,
    //   //   title: 'View',
    //   //   onClick: handleViewReceipt,
    //   //   className:
    //   //     'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    //   // },
    //   Edit && {
    //     icon: PencilIcon,
    //     title: 'Edit',
    //     onClick: handleEdit,
    //     className:
    //       'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    //   },
    //   Delete && {
    //     icon: TrashIcon,
    //     title: 'Delete',
    //     onClick: handleDeleteReceipt,
    //     className:
    //       'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    //   },
  };

  return (
    <>
      <div className="flex justify-between sm:items-center mb-6 page-header gap-4 max-sm:flex-col">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Marriage Service Receipts
          </h1>
          <p className="text-gray-600">Manage receipts for marriage services.</p>
        </div>

        <div className="flex gap-2">
          {Add && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary max-sm:w-full "
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Marriage Receipt
            </button>
          )}
          {/* {Print && (
            <button
              onClick={handlePrint}
              className="btn btn-primary disabled:opacity-50"
              // disabled={!selectedReceipt?.Status.includes('Posted')}
            >
              <PrinterIcon className="h-5 w-5 mr-2" />
              Print
            </button>
          )} */}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={marriageRecords}
        actions={actions}
        className="bg-white rounded-lg shadow"
        // onRowClick={(row) => setSelectedReceipt(row)}
        // selectedRow={selectedReceipt}
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

      {/* // PRINT THE BELOW SHIT  */}
      <div style={{ display: 'none' }}>
        <MarriageServiceReceiptPrint ref={printRef} receipt={selectedReceipt} />
      </div>
    </>
  );
}

export default MarriageServiceReceiptPage;

const MarriageServiceReceiptPrint = forwardRef(({ receipt }, ref) => {
  if (!receipt) return null;

  // Map fields to display - fallback/defaults to match image
  return (
    <div
      ref={ref}
      style={{
        width: 400,
        margin: '0 auto',
        background: '#fff',
        color: '#111',
        fontFamily: 'monospace',
        padding: '32px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <div>
          {receipt.InvoiceDate
            ? new Date(receipt.InvoiceDate).toLocaleDateString('en-US')
            : '08/22/2025'}
        </div>
        <div>{receipt.InvoiceNumber || '528'}</div>
      </div>
      <div style={{ textAlign: 'right', marginBottom: 12 }}>
        {receipt.FundsID ? 'Fund' : 'Fund'}
      </div>
      <div style={{ marginBottom: 24 }}>
        {receipt.CustomerName || 'Leivan Jake Baguio'}
      </div>
      <div style={{ marginBottom: 12 }}>
        <span>
          {receipt.Items ? receipt.Items[0]?.Description : 'Big Item'}
        </span>
        <span style={{ marginLeft: '5em' }}>
          {receipt.Items
            ? Number(receipt.Items[0]?.UnitPrice || 0).toFixed(2)
            : '175.00'}
        </span>
        <span style={{ marginLeft: '3em' }}>
          {receipt.Total ? Number(receipt.Total).toFixed(2) : '1,350.00'}
        </span>
      </div>
      <div
        style={{
          textAlign: 'right',
          marginTop: '4em',
          fontWeight: 'bold',
          fontSize: '1.1em',
        }}
      >
        {receipt.Total ? Number(receipt.Total).toFixed(2) : '1,350.00'}
      </div>
      <div style={{ marginTop: '1.5em', fontWeight: 'bold' }}>
        {receipt.AmountInWords || 'TWO THOUSAND SEVEN'}
      </div>
    </div>
  );
});
