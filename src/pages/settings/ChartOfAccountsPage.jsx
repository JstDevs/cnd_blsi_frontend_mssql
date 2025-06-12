import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { fetchAccounts } from '../../features/settings/chartOfAccountsSlice';
import ChartOfAccountsForm from './ChartOfAccountsForm';

function ChartOfAccountsPage() {
  const dispatch = useDispatch();
  const { accounts, isLoading } = useSelector(state => state.chartOfAccounts);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  
  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);
  
  const handleAddAccount = () => {
    setCurrentAccount(null);
    setIsModalOpen(true);
  };
  
  const handleEditAccount = (account) => {
    setCurrentAccount(account);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAccount(null);
  };
  
  // Format amount as Philippine Peso
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };
  
  // Table columns definition
  const columns = [
    {
      key: 'accountCode',
      header: 'Account Code',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'accountTitle',
      header: 'Account Title',
      sortable: true,
    },
    {
      key: 'accountGroup',
      header: 'Group',
      sortable: true,
    },
    {
      key: 'normalBalance',
      header: 'Normal Balance',
      sortable: true,
    },
    {
      key: 'openingBalance',
      header: 'Opening Balance',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'isActive',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];
  
  // Actions for table rows
  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditAccount,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Chart of Accounts</h1>
            <p>Manage account codes and their settings</p>
          </div>
          <button
            type="button"
            onClick={handleAddAccount}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Account
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={accounts}
          actions={actions}
          loading={isLoading}
        />
      </div>
      
      {/* Account Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentAccount ? "Edit Account" : "Add Account"}
        size="lg"
      >
        <ChartOfAccountsForm 
          initialData={currentAccount} 
          onClose={handleCloseModal} 
        />
      </Modal>
    </div>
  );
}

export default ChartOfAccountsPage;