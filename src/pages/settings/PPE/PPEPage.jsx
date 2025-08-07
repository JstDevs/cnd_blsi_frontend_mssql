import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../../components/common/DataTable';
import Modal from '../../../components/common/Modal';
import PPEForm from './PPEForm';
import { fetchPPEs, deletePPE } from '../../../features/settings/ppeSlice';
import { Printer } from 'lucide-react';
import FormField from '@/components/common/FormField';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';
// import { render } from '@headlessui/react/dist/utils/render';

const FIELDS = [
  { key: 'CategoryID', header: 'PPE Category' },
  { key: 'Description', header: 'Description' },
  { key: 'DepreciationRate', header: 'Depreciation Rate (%)' },
  { key: 'DepreciationValue', header: 'Depreciation Value' },
  { key: 'NetBookValue', header: 'Net Book Value' },
  {
    key: 'SupplierID',
    header: 'Supplier',
  },
  { key: 'PPENumber', header: 'PPE Number' },
  { key: 'Unit', header: 'Unit' },
  { key: 'Barcode', header: 'Barcode' },
  { key: 'Quantity', header: 'Quantity' },
  { key: 'Cost', header: 'Cost' },
  { key: 'DateAcquired', header: 'Date Acquired' },
  { key: 'EstimatedUsefulLife', header: 'Estimated Useful Life (years)' },
  { key: 'PONumber', header: 'PO Number' },
  { key: 'PRNumber', header: 'PR Number' },
  { key: 'InvoiceNumber', header: 'Invoice Number' },
  { key: 'AIRNumber', header: 'AIR Number' },
  { key: 'RISNumber', header: 'RIS Number' },
  { key: 'Remarks', header: 'Remarks' },
];

function PPEPage() {
  const dispatch = useDispatch();
  const { ppes, isLoading } = useSelector((state) => state.ppes);
  // ---------------------USE MODULE PERMISSIONS------------------START (PPEPage - MODULE ID = 64 )
  const { Add, Edit, Delete, Print } = useModulePermissions(64);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAcknowledgementModalOpen, setIsAcknowledgementModalOpen] =
    useState(false);
  const [currentPPE, setCurrentPPE] = useState(null);

  useEffect(() => {
    dispatch(fetchPPEs());
  }, [dispatch]);

  const handleAddPPE = () => {
    setCurrentPPE(null);
    setIsModalOpen(true);
  };

  const handlePrintAcknowledgement = () => {
    setIsAcknowledgementModalOpen(true);
  };

  const handlePrintAcknowledgementForm = () => {
    // window.print();
  };

  const handleCloseAcknowledgementModal = () => {
    setIsAcknowledgementModalOpen(false);
  };
  const handleEditPPE = (ppe) => {
    setCurrentPPE(ppe);
    setIsModalOpen(true);
  };

  const handleDeletePPE = async (ppe) => {
    // if (window.confirm('Are you sure you want to delete this PPE entry?')) {
    // }
    try {
      await dispatch(deletePPE(ppe.ID)).unwrap();
      toast.success('PPE entry deleted successfully');
      dispatch(fetchPPEs());
    } catch (error) {
      console.error('Failed to delete PPE entry:', error);
      toast.error('Failed to delete PPE entry. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPPE(null);
  };

  // DataTable columns
  const columns = FIELDS.map((field) => {
    if (field.key === 'CategoryID') {
      return {
        key: field.key,
        header: field.header,
        sortable: true,
        className: 'text-neutral-900',
        render: (_, ppe) => ppe?.Category?.Name || 'N/A',
      };
    }
    if (field.key === 'SupplierID') {
      return {
        key: field.key,
        header: field.header,
        sortable: true,
        className: 'text-neutral-900',
        render: (_, ppe) => ppe?.Supplier?.Name || 'N/A',
      };
    }

    return {
      key: field.key,
      header: field.header,
      sortable: true,
      className: 'text-neutral-900',
    };
  });

  // Actions for table rows
  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditPPE,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDeletePPE,
      className:
        'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-danger-50',
    },
  ];
  const acknowledgingNo2Options = [
    { label: 'Name 1 ', value: '1' },
    { label: 'Name 2', value: '2' },
  ];
  const acknowledgingNo1Options = [
    { label: 'Name 1 ', value: '1' },
    { label: 'Name 2', value: '2' },
  ];
  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between gap-4 flex-col">
          <div>
            <h1>PPE</h1>
            <p>Manage Property, Plant, and Equipment records</p>
          </div>
          <div className="flex gap-2 ml-auto max-sm:flex-col max-sm:w-full">
            {Add && (
              <button
                type="button"
                onClick={handleAddPPE}
                className="btn btn-primary flex items-center justify-center max-sm:w-full"
              >
                <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Add PPE
              </button>
            )}
            {Print && (
              <button
                type="button"
                onClick={handlePrintAcknowledgement}
                className="btn btn-primary flex items-center justify-center max-sm:w-full"
              >
                <Printer className="h-5 w-5 mr-2" aria-hidden="true" />
                Print Acknowledgement
              </button>
            )}
            {Print && (
              <button
                type="button"
                // TODO CHANGE THIS
                // onClick={() => window.print()}
                className="btn btn-primary flex items-center justify-center max-sm:w-full"
              >
                <Printer className="h-5 w-5 mr-2" aria-hidden="true" />
                Print
              </button>
            )}
          </div>
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
        title={currentPPE ? 'Edit PPE' : 'Add PPE'}
        size="lg"
      >
        <PPEForm initialData={currentPPE} onClose={handleCloseModal} />
      </Modal>
      {/*   TODO MAKE THIS WORK...!!! */}
      {/* PPE Acknowledgement Modal */}
      <Modal
        isOpen={isAcknowledgementModalOpen}
        onClose={handleCloseAcknowledgementModal}
        title="PPE Acknowledgement"
        size="md"
        hideCloseButton
      >
        <div className="p-4">
          <div className="mb-4">
            {/* <p className="font-semibold">Acknowledging No. 1</p>
            <p>Juan S. Dela Cruz</p> */}
            <FormField
              label="Acknowledging No. 1"
              type="select"
              name="acknowledgingNo1"
              options={acknowledgingNo1Options}
              value="Juan S. Dela Cruz"
              // readOnly
            />
          </div>
          <div className="mb-6">
            {/* <p className="font-semibold">Acknowledging No. 2</p>
            <p>Juan S. Dela Cruz</p> */}
            <FormField
              label="Acknowledging No. 2"
              type="select"
              name="acknowledgingNo1"
              options={acknowledgingNo2Options}
              value="Juan S. Dela Cruz"
              // readOnly
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCloseAcknowledgementModal}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handlePrintAcknowledgementForm}
              className="btn btn-primary"
            >
              Print
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PPEPage;
