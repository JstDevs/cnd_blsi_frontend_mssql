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
import { EyeIcon, PencilIcon, Trash } from 'lucide-react';

const PublicMarketTicketPage = () => {
  const dispatch = useDispatch();
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
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await dispatch(deletePublicMarketTicket(ticket)).unwrap();
        toast.success('Ticket deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete ticket');
      }
    }
  };

  const columns = [
    {
      key: 'Items',
      header: 'Items',
      accessorKey: 'items',
    },
    {
      key: 'StartTime',
      header: 'Start Time',
      accessorKey: 'startTime',
      cell: ({ row }) =>
        new Date(row.original.startTime).toLocaleString('en-US', {
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
      cell: ({ row }) =>
        new Date(row.original.endTime).toLocaleString('en-US', {
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
      cell: ({ row }) => new Date(row.original.dateIssued).toLocaleDateString(),
    },
    {
      key: 'PostingPeriod',
      header: 'Posting Period',
      accessorKey: 'postingPeriod',
      cell: ({ row }) =>
        new Date(row.original.postingPeriod).toLocaleDateString(),
    },
    {
      key: 'AmountIssued',
      header: 'Amount Issued',
      accessorKey: 'amountIssued',
      cell: ({ row }) => `₱${row.original.amountIssued?.toLocaleString()}`,
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
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditTicket,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    {
      icon: Trash,
      title: 'Delete',
      onClick: handleDeleteTicket,
      className:
        'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
    },
  ];
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Public Market Tickets
        </h1>
        <Button onClick={handleAdd} disabled={isLoading}>
          <FiPlus className="w-5 h-5 mr-2" />
          Add Ticket
        </Button>
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
    </div>
  );
};

export default PublicMarketTicketPage;
