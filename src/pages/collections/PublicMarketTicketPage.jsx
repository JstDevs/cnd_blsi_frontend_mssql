import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import PublicMarketTicketForm from '../../components/forms/PublicMarketTicketForm';
import { deleteTicket } from '../../features/collections/publicMarketTicketSlice';

const PublicMarketTicketPage = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const mockTickets = [
    {
      id: 1,
      items: 'Vegetables',
      startTime: '06:00',
      endTime: '12:00',
      issuedBy: 'John Doe',
      dateIssued: '2024-03-20',
      postingPeriod: '2024-03-20',
      amountIssued: 500,
      remarks: 'Morning market ticket',
    },
    {
      id: 2,
      items: 'Fruits',
      startTime: '13:00',
      endTime: '18:00',
      issuedBy: 'Jane Smith',
      dateIssued: '2024-03-20',
      postingPeriod: '2024-03-20',
      amountIssued: 750,
      remarks: 'Afternoon market ticket',
    },
  ];

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
        setIsLoading(true);
        await dispatch(deleteTicket(id)).unwrap();
        toast.success('Ticket deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete ticket');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const columns = [
    {
      header: 'Items',
      accessorKey: 'items',
    },
    {
      header: 'Start Time',
      accessorKey: 'startTime',
    },
    {
      header: 'End Time',
      accessorKey: 'endTime',
    },
    {
      header: 'Issued By',
      accessorKey: 'issuedBy',
    },
    {
      header: 'Date Issued',
      accessorKey: 'dateIssued',
      cell: ({ row }) => new Date(row.original.dateIssued).toLocaleDateString(),
    },
    {
      header: 'Posting Period',
      accessorKey: 'postingPeriod',
      cell: ({ row }) => new Date(row.original.postingPeriod).toLocaleDateString(),
    },
    {
      header: 'Amount Issued',
      accessorKey: 'amountIssued',
      cell: ({ row }) => `₱${row.original.amountIssued.toLocaleString()}`,
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FiEdit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600 hover:text-red-800"
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
        <h1 className="text-2xl font-semibold text-gray-900">Public Market Tickets</h1>
        <Button onClick={handleAdd}>
          <FiPlus className="w-5 h-5 mr-2" />
          Add Ticket
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={mockTickets}
          isLoading={isLoading}
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