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

  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await dispatch(deletePublicMarketTicket(id)).unwrap();
        toast.success('Ticket deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete ticket');
      }
    }
  };

  const columns = [
    {
      key: 'ticketNumber',
      header: 'Items',
      accessorKey: 'items',
    },
    { key: 'StartTime', header: 'Start Time', accessorKey: 'startTime' },
    { key: 'EndTime', header: 'End Time', accessorKey: 'endTime' },
    { key: 'issuedBy', header: 'Issued By', accessorKey: 'issuedBy' },
    {
      key: 'dateIssued',
      header: 'Date Issued',
      accessorKey: 'dateIssued',
      cell: ({ row }) => new Date(row.original.dateIssued).toLocaleDateString(),
    },
    {
      key: 'postingPeriod',
      header: 'Posting Period',
      accessorKey: 'postingPeriod',
      cell: ({ row }) =>
        new Date(row.original.postingPeriod).toLocaleDateString(),
    },
    {
      key: 'amountIssued',
      header: 'Amount Issued',
      accessorKey: 'amountIssued',
      cell: ({ row }) => `₱${row.original.amountIssued?.toLocaleString()}`,
    },
    { key: 'remarks', header: 'Remarks', accessorKey: 'remarks' },
    {
      key: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="text-blue-600 hover:text-blue-800"
            disabled={isLoading}
          >
            <FiEdit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600 hover:text-red-800"
            disabled={isLoading}
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      ),
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
        <DataTable columns={columns} data={tickets} isLoading={isLoading} />
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
