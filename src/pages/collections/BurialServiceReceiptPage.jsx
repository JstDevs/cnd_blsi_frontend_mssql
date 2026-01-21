import { forwardRef, useEffect, useRef, useState } from 'react';
import React from 'react';
import { useReactToPrint } from 'react-to-print';
import { PlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import BurialServiceReceiptForm from '../../components/forms/BurialServiceReceiptForm';
import Modal from '../../components/common/Modal';
import DataTable from '../../components/common/DataTable';
import { fetchNationalities } from '../../features/settings/nationalitiesSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBurialRecords,
  deleteBurialRecord,
  addBurialRecord,
  approveBurialRecord,
  rejectBurialRecord,
} from '@/features/collections/burialServiceSlice';
import { PencilIcon, PrinterIcon, TrashIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchCustomers } from '@/features/settings/customersSlice';
import { useModulePermissions } from '@/utils/useModulePremission';
function BurialServiceReceiptPage() {
  const dispatch = useDispatch();
  // ---------------------USE MODULE PERMISSIONS------------------START (BurialServiceReceiptPage - MODULE ID =  28 )
  const { Add, Edit, Delete, Print } = useModulePermissions(28);
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
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Burial Service Receipt',
  });
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
    {
      key: 'CustomerName',
      header: 'Name',
      sortable: true,
      render: (value) => value?.trim() || 'N/A',
    },
    // {
    //   key: 'Municipality',
    //   header: 'Municipality',
    //   sortable: true,
    //   render: (value) => value || '—',
    // },
    // {
    //   key: 'DocumentType.Name',
    //   header: 'Service Type',
    //   sortable: true,
    //   render: (value, row) => row.DocumentType?.Name || '—',
    //   className: 'text-gray-500',
    // },
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
  const handleBRPAction = async (dv, action) => {
    setIsLoadingReceipt(true);
    // Properly format action strings for messages
    const actionPast = action === 'approve' ? 'approved' : 'rejected';
    const actionPresent = action === 'approve' ? 'approving' : 'rejecting';
    try {
      const response = await axiosInstance.post(
        `/disbursementVoucher/${action}`,
        { ID: dv.ID }
      );
      console.log(`${actionPast}:`, response.data);
      dispatch(fetchGeneralServiceReceipts());
      toast.success(`General Receipt ${actionPast} successfully`);
    } catch (error) {
      console.error(`Error ${actionPresent} General Receipt:`, error);
      toast.error(`Error ${actionPresent} General Receipt`);
    } finally {
      setIsLoadingReceipt(false);
    }
  };
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

  const handleApprove = async (receipt) => {
    if (window.confirm('Are you sure you want to approve this burial receipt?')) {
      try {
        await dispatch(approveBurialRecord(receipt.ID)).unwrap();
        toast.success('Burial Receipt approved and posted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to approve');
      }
    }
  };
  const handleReject = async (receipt) => {
    const reason = window.prompt('Please enter the reason for rejection:');
    if (reason !== null) {
      try {
        await dispatch(rejectBurialRecord({ id: receipt.ID, reason })).unwrap();
        toast.success('Burial Receipt rejected successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to reject');
      }
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
      dispatch(fetchCustomers());
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      handleCloseModal();
    }
  };
  const actions = (row) => {
    const actionList = [];

    if (Edit) {
      actionList.push({
        icon: PencilIcon,
        title: 'Edit',
        onClick: handleEdit,
        className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
    }

    if (row.Status === 'Requested') {
      actionList.push(
        {
          icon: CheckIcon,
          title: 'Approve',
          onClick: () => handleApprove(row),
          className: 'text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50',
        },
        {
          icon: XMarkIcon,
          title: 'Reject',
          onClick: () => handleReject(row),
          className: 'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
        }
      );
    }

    if (Delete) {
      actionList.push({
        icon: TrashIcon,
        title: 'Delete',
        onClick: handleDeleteTicket,
        className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
      });
    }

    return actionList;
  };
  // const actionsSub = (row) => {
  //   const actionList = [];

  //   if (row?.Status?.toLowerCase().includes('rejected') && Edit) {
  //     actionList.push({
  //       icon: PencilIcon,
  //       title: 'Edit',
  //       onClick: () => handleEditReceipt(row),
  //       className:
  //         'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
  //     });
  //     actionList.push({
  //       icon: TrashIcon,
  //       title: 'Delete',
  //       onClick: () => handleDeleteReceipt(row),
  //       className:
  //         'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
  //     });
  //   } else if (row?.Status?.toLowerCase().includes('requested')) {
  //     actionList.push(
  //       {
  //         icon: CheckLine,
  //         title: 'Approve',
  //         onClick: () => handleGRPAction(row, 'approve'),
  //         className:
  //           'text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50',
  //       },
  //       {
  //         icon: X,
  //         title: 'Reject',
  //         onClick: () => handleGRPAction(row, 'reject'),
  //         className:
  //           'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
  //       }
  //     );
  //   }
  //   actionList.push({
  //     icon: EyeIcon,
  //     title: 'View',
  //     onClick: () => handleViewReceipt(row),
  //     className:
  //       'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
  //   });
  //   return actionList;
  // };


  // console.log({ burialRecord });
  return (
    <>
      <div className="flex justify-between sm:items-center mb-6 page-header max-sm:flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Burial Service Receipts
          </h1>
          <p className="text-gray-600">Manage receipts for burial services.</p>
        </div>
        <div className="flex gap-2">
          {Add && (
            <button
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full "
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Burial Receipt
            </button>
          )}
          {Print && (
            <button
              onClick={handlePrint}
              className="btn btn-primary disabled:opacity-50"
              disabled={!selectedReceipt?.Status.includes('Posted')}
            >
              <PrinterIcon className="h-5 w-5 mr-2" />
              Print
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={burialRecord}
          className="min-w-full divide-y divide-gray-200"
          actions={actions}
          onRowClick={(row) => setSelectedReceipt(row)}
          selectedRow={selectedReceipt}
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
      <div style={{ display: 'none' }}>
        <BurialServiceReceiptPrint ref={printRef} receipt={selectedReceipt} />
      </div>
    </>
  );
}

export default BurialServiceReceiptPage;

const BurialServiceReceiptPrint = forwardRef(({ receipt }, ref) => {
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