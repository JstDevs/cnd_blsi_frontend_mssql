import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../../components/common/DataTable';
import Modal from '../../../components/common/Modal';
import PPEForm from './PPEForm';
import { fetchPPEs, deletePPE } from '../../../features/settings/ppeSlice';

const FIELDS = [
  { key: 'category', header: 'PPE Category' },
  { key: 'description', header: 'Description' },
  { key: 'depreciationRate', header: 'Depreciation Rate (%)' },
  { key: 'depreciationValue', header: 'Depreciation Value' },
  { key: 'netBookValue', header: 'Net Book Value' },
  { key: 'supplier', header: 'Supplier' },
  { key: 'ppeNumber', header: 'PPE Number' },
  { key: 'unit', header: 'Unit' },
  { key: 'barcode', header: 'Barcode' },
  { key: 'quantity', header: 'Quantity' },
  { key: 'cost', header: 'Cost' },
  { key: 'dateAcquired', header: 'Date Acquired' },
  { key: 'usefulLife', header: 'Estimated Useful Life (years)' },
  { key: 'poNumber', header: 'PO Number' },
  { key: 'prNumber', header: 'PR Number' },
  { key: 'invoiceNumber', header: 'Invoice Number' },
  { key: 'airNumber', header: 'AIR Number' },
  { key: 'risNumber', header: 'RIS Number' },
  { key: 'remarks', header: 'Remarks' },
];

function PPEPage() {
  const dispatch = useDispatch();
  const { ppes, isLoading } = useSelector(state => state.ppes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPPE, setCurrentPPE] = useState(null);

  useEffect(() => {
    dispatch(fetchPPEs());
  }, [dispatch]);

  const handleAddPPE = () => {
    setCurrentPPE(null);
    setIsModalOpen(true);
  };

  const handleEditPPE = (ppe) => {
    setCurrentPPE(ppe);
    setIsModalOpen(true);
  };

  const handleDeletePPE = (ppe) => {
    if (window.confirm('Are you sure you want to delete this PPE entry?')) {
      dispatch(deletePPE(ppe.id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPPE(null);
  };

  // DataTable columns
  const columns = FIELDS.map(field => ({
    key: field.key,
    header: field.header,
    sortable: true,
    className: 'text-neutral-900',
  }));

  // Actions for table rows
  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditPPE,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDeletePPE,
      className: 'text-danger-600 hover:text-danger-900 p-1 rounded-full hover:bg-danger-50'
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>PPE</h1>
            <p>Manage Property, Plant, and Equipment records</p>
          </div>
          <button
            type="button"
            onClick={handleAddPPE}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add PPE
          </button>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={ppes}
          actions={actions}
          loading={isLoading}
        />
      </div>

      {/* PPE Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentPPE ? "Edit PPE" : "Add PPE"}
        size="lg"
      >
        <PPEForm 
          initialData={currentPPE} 
          onClose={handleCloseModal} 
        />
      </Modal>
    </div>
  );
}

export default PPEPage; 