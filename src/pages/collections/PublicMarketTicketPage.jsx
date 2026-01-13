// components/pages/PublicMarketTicketPage.js
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Button from '@/components/common/Button';
import DataTable from '@/components/common/DataTable';
import Modal from '@/components/common/Modal';
import PublicMarketTicketForm from '@/components/forms/PublicMarketTicketForm';
import {
  deletePublicMarketTicket,
  fetchPublicMarketTickets,
} from '@/features/collections/PublicMarketTicketingSlice';
import { useDispatch, useSelector } from 'react-redux';
import { PencilIcon, Trash } from 'lucide-react';
import { useModulePermissions } from '@/utils/useModulePremission';
import { formatCurrency } from '@/utils/currencyFormater';

const PublicMarketTicketPage = () => {
  const dispatch = useDispatch();
  // ---------------------USE MODULE PERMISSIONS------------------START (PublicMarketTicketPage - MODULE ID =  68 )
  const { Add, Edit, Delete } = useModulePermissions(68);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const { tickets, isLoading, error } = useSelector(
    (state) => state.publicMarketTicketing
  );

  useEffect(() => {
    dispatch(fetchPublicMarketTickets());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleAdd = () => {
    setSelectedTicket(null);
    setIsModalOpen(true);
  };

  const handleDeleteTicket = async (ticket) => {
    console.log('Deleting ticket:', ticket);
    try {
      await dispatch(deletePublicMarketTicket(ticket.ID)).unwrap();
      toast.success('Ticket deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete ticket');
    }
  };

  const columns = [
    {
      key: 'Items',
      header: 'Items',
      accessorKey: 'items',
    },
    {
      key: 'Status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded ${
            value === 'Requested'     ? 'bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500 text-error-700'
              : value === 'Approved'  ? 'bg-gradient-to-r from-success-300 via-success-500 to-success-600 text-neutral-800'
              : value === 'Posted'    ? 'bg-gradient-to-r from-success-800 via-success-900 to-success-999 text-success-100'
              : value === 'Rejected'  ? 'bg-gradient-to-r from-error-700 via-error-800 to-error-999 text-neutral-100'
              : value === 'Void'      ? 'bg-gradient-to-r from-primary-900 via-primary-999 to-tertiary-999 text-neutral-300'
              : value === 'Cancelled' ? 'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-400 text-neutral-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'StartTime',
      header: 'Start Time',
      accessorKey: 'startTime',
      render: (value) =>
        new Date(value).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      key: 'EndTime',
      header: 'End Time',
      accessorKey: 'endTime',
      render: (value) =>
        new Date(value).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    { key: 'IssuedBy', header: 'Issued By', accessorKey: 'issuedBy' },
    {
      key: 'DateIssued',
      header: 'Date Issued',
      accessorKey: 'dateIssued',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'PostingPeriod',
      header: 'Posting Period',
      accessorKey: 'postingPeriod',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'AmountIssued',
      header: 'Amount Issued',
      accessorKey: 'amountIssued',
      render: formatCurrency,
    },
    { key: 'Remarks', header: 'Remarks', accessorKey: 'remarks' },
  ];
  const handleEditTicket = (ticket) => {
    console.log('Edit ticket:', ticket);
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };
  // Actions for table rows
  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditTicket,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Delete && {
      icon: Trash,
      title: 'Delete',
      onClick: handleDeleteTicket,
      className:
        'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
    },
  ];
  return (
    <>
      <div className="flex justify-between sm:items-center mb-6 page-header gap-4 max-sm:flex-col">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Public Market Tickets
          </h1>
          <p className="text-gray-600">Manage tickets of the public market.</p>          
        </div>
        {Add && (
          <Button
            onClick={handleAdd}
            disabled={isLoading}
            className="max-sm:w-full"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Add Ticket
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={tickets}
          isLoading={isLoading}
          actions={actions}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTicket ? 'Edit Ticket' : 'Add Ticket'}
      >
        <PublicMarketTicketForm
          ticket={selectedTicket}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default PublicMarketTicketPage;
