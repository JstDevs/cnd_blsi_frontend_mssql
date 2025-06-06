import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import MarriageServiceReceiptForm from '../../components/forms/MarriageServiceReceiptForm';

function MarriageServiceReceiptPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [receipts, setReceipts] = useState([]);

  const handleAddReceipt = (values) => {
    const newReceipt = {
      id: Date.now(),
      ...values,
    };
    setReceipts([...receipts, newReceipt]);
  };

  const handleEditReceipt = (values) => {
    setReceipts(
      receipts.map((receipt) =>
        receipt.id === selectedReceipt.id ? { ...receipt, ...values } : receipt
      )
    );
  };

  const handleDeleteReceipt = (id) => {
    setReceipts(receipts.filter((receipt) => receipt.id !== id));
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
    { header: 'Status', accessor: 'status' },
    { header: 'AP/AR', accessor: 'apAr' },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Total Amount', accessor: 'totalAmount' },
    { header: 'Amount Received', accessor: 'amountReceived' },
    { header: 'Credit', accessor: 'credit' },
    { header: 'Debit', accessor: 'debit' },
    { header: 'EWT', accessor: 'ewt' },
    { header: 'Withheld Amount', accessor: 'withheldAmount' },
    { header: 'Total', accessor: 'total' },
    { header: 'Discount (%)', accessor: 'discountPercent' },
    { header: 'Amount Due', accessor: 'amountDue' },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="text-blue-600 hover:text-blue-800"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDeleteReceipt(row.original.id)}
            className="text-red-600 hover:text-red-800"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Marriage Service Receipts
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Receipt
        </button>
      </div>

      <DataTable
        columns={columns}
        data={receipts}
        className="bg-white rounded-lg shadow"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedReceipt ? 'Edit Receipt' : 'Add Receipt'}
      >
        <MarriageServiceReceiptForm
          initialData={selectedReceipt}
          onClose={handleCloseModal}
          onSubmit={selectedReceipt ? handleEditReceipt : handleAddReceipt}
        />
      </Modal>
    </div>
  );
}

export default MarriageServiceReceiptPage; 