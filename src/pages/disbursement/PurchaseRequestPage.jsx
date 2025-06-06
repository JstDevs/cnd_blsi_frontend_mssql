import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import PurchaseRequestForm from './PurchaseRequestForm';

// Mock data for initial development
const mockPurchaseRequests = [
  {
    id: 1,
    department: 'IT Department',
    section: 'Section A',
    chargeAccount: 'Account 1',
    prNumber: 'PR-2024-001',
    saiNumber: 'SAI-2024-001',
    alobsNumber: 'ALOBS-2024-001',
    date: '2024-03-15',
    fromDate: '2024-03-15',
    toDate: '2024-03-20',
    purpose: 'Purchase of office supplies',
  },
  {
    id: 2,
    department: 'Engineering Department',
    section: 'Section B',
    chargeAccount: 'Account 2',
    prNumber: 'PR-2024-002',
    saiNumber: 'SAI-2024-002',
    alobsNumber: 'ALOBS-2024-002',
    date: '2024-03-16',
    fromDate: '2024-03-16',
    toDate: '2024-03-21',
    purpose: 'Purchase of construction materials',
  },
];

const FIELDS = [
  { key: 'department', header: 'Department' },
  { key: 'section', header: 'Section' },
  { key: 'chargeAccount', header: 'Charge Account' },
  { key: 'prNumber', header: 'PR Number' },
  { key: 'saiNumber', header: 'SAI Number' },
  { key: 'alobsNumber', header: 'ALOBS Number' },
  { key: 'date', header: 'Date' },
  { key: 'fromDate', header: 'From Date' },
  { key: 'toDate', header: 'To Date' },
  { key: 'purpose', header: 'Purpose' },
];

function PurchaseRequestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [purchaseRequests, setPurchaseRequests] = useState(mockPurchaseRequests);

  useEffect(() => {
    // TODO: Implement actual data fetching
    setPurchaseRequests(mockPurchaseRequests);
  }, []);

  const handleAddRequest = () => {
    setCurrentRequest(null);
    setIsModalOpen(true);
  };

  const handleEditRequest = (request) => {
    setCurrentRequest(request);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (request) => {
    if (window.confirm('Are you sure you want to delete this purchase request?')) {
      // TODO: Implement actual deletion
      setPurchaseRequests(prev => prev.filter(pr => pr.id !== request.id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRequest(null);
  };

  // Filter data based on search query
  const filteredData = purchaseRequests.filter(request =>
    Object.values(request).some(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
      onClick: handleEditRequest,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDeleteRequest,
      className: 'text-danger-600 hover:text-danger-900 p-1 rounded-full hover:bg-danger-50'
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Purchase Requests</h1>
            <p>Manage purchase requests and authorizations</p>
          </div>
          <button
            type="button"
            onClick={handleAddRequest}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Purchase Request
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by any field..."
            className="form-input w-full md:w-1/3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredData}
          actions={actions}
        />
      </div>

      {/* Purchase Request Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentRequest ? "Edit Purchase Request" : "Add Purchase Request"}
        size="lg"
      >
        <PurchaseRequestForm 
          initialData={currentRequest} 
          onClose={handleCloseModal} 
        />
      </Modal>
    </div>
  );
}

export default PurchaseRequestPage; 