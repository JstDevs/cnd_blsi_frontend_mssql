import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../../components/common/DataTable';
import Modal from '../../../components/common/Modal';
import BeginningBalanceForm from './BeginningBalanceForm';

// Mock data for initial development
const mockBeginningBalances = [
  {
    id: 1,
    fund: 'General Fund',
    beginningBalance: 1000000.0,
  },
  {
    id: 2,
    fund: 'Special Education Fund',
    beginningBalance: 500000.0,
  },
  {
    id: 3,
    fund: 'Trust Fund',
    beginningBalance: 250000.0,
  },
];

const FIELDS = [
  { key: 'fund', header: 'Fund' },
  { key: 'beginningBalance', header: 'Beginning Balance' },
];

function BeginningBalancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [beginningBalances, setBeginningBalances] = useState(
    mockBeginningBalances
  );

  useEffect(() => {
    // TODO: Implement actual data fetching
    setBeginningBalances(mockBeginningBalances);
  }, []);

  const handleAddBalance = () => {
    setCurrentBalance(null);
    setIsModalOpen(true);
  };

  const handleEditBalance = (balance) => {
    setCurrentBalance(balance);
    setIsModalOpen(true);
  };

  const handleDeleteBalance = (balance) => {
    // if (window.confirm('Are you sure you want to delete this beginning balance entry?')) {
    // TODO: Implement actual deletion
    setBeginningBalances((prev) => prev.filter((b) => b.id !== balance.id));
    // }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBalance(null);
  };

  // Filter data based on search query
  const filteredData = beginningBalances.filter(
    (balance) =>
      balance.fund.toLowerCase().includes(searchQuery.toLowerCase()) ||
      balance.beginningBalance.toString().includes(searchQuery)
  );

  // DataTable columns
  const columns = FIELDS.map((field) => ({
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
      onClick: handleEditBalance,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDeleteBalance,
      className:
        'text-danger-600 hover:text-danger-900 p-1 rounded-full hover:bg-danger-50',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Beginning Balance</h1>
            <p>Manage beginning balances for different funds</p>
          </div>
          <button
            type="button"
            onClick={handleAddBalance}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Beginning Balance
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by fund or amount..."
            className="form-input w-full md:w-1/3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DataTable columns={columns} data={filteredData} actions={actions} />
      </div>

      {/* Beginning Balance Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          currentBalance ? 'Edit Beginning Balance' : 'Add Beginning Balance'
        }
        size="md"
      >
        <BeginningBalanceForm
          initialData={currentBalance}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

export default BeginningBalancePage;
