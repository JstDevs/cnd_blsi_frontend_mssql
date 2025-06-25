import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import DisbursementVoucherForm from './DisbursementVoucherForm';
import DisbursementVoucherDetails from './DisbursementVoucherDetails';
import { fetchDisbursementVouchers } from '@/features/disbursement/disbursementVoucherSlice';

function DisbursementVoucherPage() {
  const dispatch = useDispatch();
  const { disbursementVouchers, isLoading } = useSelector(
    (state) => state.disbursementVouchers
  );

  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'details'
  const [currentDisbursementVoucher, setCurrentDisbursementVoucher] =
    useState(null);

  useEffect(() => {
    dispatch(fetchDisbursementVouchers());
  }, [dispatch]);

  const handleCreateDV = () => {
    setCurrentDisbursementVoucher(null);
    setCurrentView('form');
  };

  const handleViewDV = (dv) => {
    setCurrentDisbursementVoucher(dv);
    setCurrentView('details');
  };

  const handleEditDV = (dv) => {
    setCurrentDisbursementVoucher(dv);
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setCurrentView('list');
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
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
          >
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
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditDV,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
  ];

  return (
    <div>
      {currentView === 'list' && (
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
        </div>
      )}

      {currentView === 'form' && (
        <div>
          <div className="page-header">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button
                  onClick={handleBackToList}
                  className="mr-4 p-1 rounded-full hover:bg-neutral-100"
                >
                  <ArrowLeftIcon className="h-5 w-5 text-neutral-600" />
                </button>
                <div>
                  <h1>
                    {currentDisbursementVoucher
                      ? 'Edit Disbursement Voucher'
                      : 'Create Disbursement Voucher'}
                  </h1>
                  <p>
                    Fill out the form to{' '}
                    {currentDisbursementVoucher ? 'update' : 'create'} a
                    disbursement voucher
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <DisbursementVoucherForm
              initialData={currentDisbursementVoucher}
              onCancel={handleBackToList}
              onSubmitSuccess={handleBackToList}
            />
          </div>
        </div>
      )}

      {currentView === 'details' && currentDisbursementVoucher && (
        <div>
          <div className="page-header">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button
                  onClick={handleBackToList}
                  className="mr-4 p-1 rounded-full hover:bg-neutral-100"
                >
                  <ArrowLeftIcon className="h-5 w-5 text-neutral-600" />
                </button>
                <div>
                  <h1>Disbursement Voucher Details</h1>
                  <p>View and manage disbursement voucher details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleEditDV(currentDisbursementVoucher)}
                className="btn btn-primary flex items-center"
              >
                <PencilIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Edit DV
              </button>
            </div>
          </div>

          <div className="mt-4">
            <DisbursementVoucherDetails
              dv={currentDisbursementVoucher}
              onBack={handleBackToList}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DisbursementVoucherPage;
