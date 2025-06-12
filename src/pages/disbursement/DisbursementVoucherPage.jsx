import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { fetchDisbursementVouchers } from '../../features/disbursement/disbursementVoucherSlice';
import DisbursementVoucherForm from './DisbursementVoucherForm';
import DisbursementVoucherDetails from './DisbursementVoucherDetails';

function DisbursementVoucherPage() {
  const dispatch = useDispatch();
  const { disbursementVouchers, isLoading } = useSelector(state => state.disbursementVouchers);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentDisbursementVoucher, setCurrentDisbursementVoucher] = useState(null);
  
  useEffect(() => {
    dispatch(fetchDisbursementVouchers());
  }, [dispatch]);
  
  const handleCreateDV = () => {
    setCurrentDisbursementVoucher(null);
    setIsCreateModalOpen(true);
  };
  
  const handleViewDV = (dv) => {
    setCurrentDisbursementVoucher(dv);
    setIsViewModalOpen(true);
  };
  
  const handleEditDV = (dv) => {
    setCurrentDisbursementVoucher(dv);
    setIsCreateModalOpen(true);
  };
  
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCurrentDisbursementVoucher(null);
  };
  
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentDisbursementVoucher(null);
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
      key: 'dvNumber',
      header: 'DV Number',
      
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'dvDate',
      header: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'payeeName',
      header: 'Payee',
      sortable: true,
    },
    {
      key: 'orsNumber',
      header: 'ORS Number',
      sortable: true,
    },
    {
      key: 'modeOfPayment',
      header: 'Mode of Payment',
      sortable: true,
    },
    {
      key: 'grossAmount',
      header: 'Gross Amount',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'netAmount',
      header: 'Net Amount',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => {
        let bgColor = 'bg-neutral-100 text-neutral-800';
        
        switch (value) {
          case 'Pending Certification':
            bgColor = 'bg-warning-100 text-warning-800';
            break;
          case 'Pending Approval':
            bgColor = 'bg-primary-100 text-primary-800';
            break;
          case 'Approved for Payment':
          case 'Paid':
            bgColor = 'bg-success-100 text-success-800';
            break;
          case 'Cancelled':
          case 'Rejected':
            bgColor = 'bg-error-100 text-error-800';
            break;
          default:
            break;
        }
        
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}>
            {value}
          </span>
        );
      },
    },
  ];
  
  // Actions for table rows
  const actions = [
    {
      icon: EyeIcon,
      title: 'View',
      onClick: handleViewDV,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditDV,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Disbursement Vouchers</h1>
            <p>Manage disbursement vouchers and payments</p>
          </div>
          <button
            type="button"
            onClick={handleCreateDV}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Create DV
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={disbursementVouchers}
          actions={actions}
          loading={isLoading}
          onRowClick={handleViewDV}
        />
      </div>
      
      {/* DV Creation/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title={currentDisbursementVoucher ? "Edit Disbursement Voucher" : "Create Disbursement Voucher"}
        size="lg"
      >
        <DisbursementVoucherForm 
          initialData={currentDisbursementVoucher} 
          onClose={handleCloseCreateModal} 
        />
      </Modal>
      
      {/* DV View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="Disbursement Voucher Details"
        size="lg"
      >
        {currentDisbursementVoucher && (
          <DisbursementVoucherDetails 
            dv={currentDisbursementVoucher} 
            onClose={handleCloseViewModal} 
            onEdit={() => {
              setIsViewModalOpen(false);
              setIsCreateModalOpen(true);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

export default DisbursementVoucherPage;