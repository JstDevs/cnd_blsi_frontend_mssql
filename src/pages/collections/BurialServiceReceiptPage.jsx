import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import BurialServiceReceiptForm from '../../components/forms/BurialServiceReceiptForm';
import Modal from '../../components/common/Modal';
import DataTable from '../../components/common/DataTable';

function BurialServiceReceiptPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [receipts, setReceipts] = useState([
    {
      id: 1,
      receiptNo: 'BSR-001',
      name: 'John Doe',
      cityMunicipality: 'Sample City',
      province: 'Sample Province',
      deceasedName: 'Jane Doe',
      nationality: 'Filipino',
      age: 75,
      sex: 'Female',
      dateOfDeath: '2024-03-15',
      causeOfDeath: 'Natural Causes',
      cemeteryName: 'Sample Cemetery',
      serviceType: 'inter',
    },
  ]);

  const columns = [
    { header: 'Receipt No', accessor: 'receiptNo' },
    { header: 'Name', accessor: 'name' },
    { header: 'Deceased Name', accessor: 'deceasedName' },
    { header: 'Date of Death', accessor: 'dateOfDeath' },
    { header: 'Service Type', accessor: 'serviceType' },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedReceipt(null);
    setIsModalOpen(true);
  };

  const handleEdit = (receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setReceipts(receipts.filter(receipt => receipt.id !== id));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReceipt(null);
  };

  const handleFormSubmit = (values) => {
    if (selectedReceipt) {
      // Update existing receipt
      setReceipts(receipts.map(receipt => 
        receipt.id === selectedReceipt.id ? { ...values, id: receipt.id } : receipt
      ));
    } else {
      // Add new receipt
      const newReceipt = {
        ...values,
        id: Date.now(), // Using timestamp as temporary ID
      };
      setReceipts([...receipts, newReceipt]);
    }
    handleCloseModal();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Burial Service Receipts</h1>
        <button
          onClick={handleAdd}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Receipt
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={receipts}
          className="min-w-full divide-y divide-gray-200"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedReceipt ? 'Edit Burial Service Receipt' : 'New Burial Service Receipt'}
      >
        <BurialServiceReceiptForm
          initialData={selectedReceipt}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
        />
      </Modal>
    </div>
  );
}

export default BurialServiceReceiptPage; 