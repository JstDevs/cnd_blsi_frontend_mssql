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
import { fetchDisbursementVouchers } from '@/features/disbursement/disbursementVoucherSlice';
import { fetchEmployees } from '../../features/settings/employeeSlice';
import { fetchCustomers } from '@/features/settings/customersSlice';
import { fetchVendorDetails } from '@/features/settings/vendorDetailsSlice';
import { fetchDepartments } from '@/features/settings/departmentSlice';
import { fetchProjectDetails } from '@/features/settings/projectDetailsSlice';
import { fetchFunds } from '@/features/budget/fundsSlice';
import { fetchFiscalYears } from '@/features/settings/fiscalYearSlice';
import { fetchItems } from '@/features/settings/itemSlice';
import { fetchItemUnits } from '@/features/settings/itemUnitsSlice';
import { fetchTaxCodes } from '@/features/settings/taxCodeSlice';
import { fetchBudgets } from '@/features/budget/budgetSlice';
import { fetchAccounts } from '../../features/settings/chartOfAccountsSlice';
import { statusLabel } from '../userProfile';
import { CheckLine, X } from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function DisbursementVoucherPage() {
  const dispatch = useDispatch();
  const { disbursementVouchers, isLoading } = useSelector(
    (state) => state.disbursementVouchers
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (DisbursementVoucherPage - MODULE ID = 40 )
  const { Add, Edit, Delete } = useModulePermissions(40);

  const { employees } = useSelector((state) => state.employees);
  const { customers } = useSelector((state) => state.customers);
  const { vendorDetails } = useSelector((state) => state.vendorDetails);
  const { departments } = useSelector((state) => state.departments);
  const { projectDetails } = useSelector((state) => state.projectDetails);
  const { funds } = useSelector((state) => state.funds);
  const { fiscalYears } = useSelector((state) => state.fiscalYears);
  const { items } = useSelector((state) => state.items);
  const { taxCodes } = useSelector((state) => state.taxCodes);
  const { itemUnits } = useSelector((state) => state.itemUnits);
  const { budgets } = useSelector((state) => state.budget);
  const chartOfAccounts = useSelector(
    (state) => state.chartOfAccounts?.accounts || []
  );

  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'details'
  const [currentDisbursementVoucher, setCurrentDisbursementVoucher] =
    useState(null);
  const [approvalLoading, setApprovalLoading] = useState(false);
  useEffect(() => {
    dispatch(fetchDisbursementVouchers());
    dispatch(fetchEmployees());
    dispatch(fetchCustomers());
    dispatch(fetchVendorDetails());
    dispatch(fetchDepartments());
    dispatch(fetchProjectDetails());
    dispatch(fetchFunds());
    dispatch(fetchFiscalYears());
    dispatch(fetchItems());
    dispatch(fetchTaxCodes());
    dispatch(fetchItemUnits());
    dispatch(fetchBudgets());
    dispatch(fetchAccounts());
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
      key: 'Status',
      header: 'Status',
      sortable: true,
      // render: (value) => {
      //   let bgColor = 'bg-neutral-100 text-neutral-800';

      //   switch (value) {
      //     case 'Requested':
      //       bgColor = 'bg-warning-100 text-warning-800';
      //       break;
      //     case 'Pending Approval':
      //       bgColor = 'bg-primary-100 text-primary-800';
      //       break;
      //     case 'Approved for Payment':
      //     case 'Paid':
      //       bgColor = 'bg-success-100 text-success-800';
      //       break;
      //     case 'Cancelled':
      //     case 'Rejected':
      //       bgColor = 'bg-error-100 text-error-800';
      //       break;
      //     default:
      //       break;
      //   }

      //   return (
      //     <span
      //       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
      //     >
      //       {value}
      //     </span>
      //   );
      // },
      render: (value) => statusLabel(value),
    },
    {
      key: 'InvoiceDate',
      header: 'Invoice Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'InvoiceNumber',
      header: 'Invoice Number',
      sortable: true,
    },
    {
      key: 'BillingDueDate',
      header: 'Billing Due Date ',
      sortable: true,
    },
    {
      key: 'ObligationRequestNumber',
      header: 'CAFOA Number',
      sortable: true,
    },
    // {
    //   key: 'Fund',
    //   header: 'Fund',
    //   sortable: true,
    // },

    // {
    //   key: 'CustomerID',
    //   header: 'Customer ID',
    //   sortable: true,
    // },
  ];

  // Actions for table rows
  // const actions = [
  //   {
  //     icon: EyeIcon,
  //     title: 'View',
  //     onClick: handleViewDV,
  //     className:
  //       'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
  //   },
  //   {
  //     icon: PencilIcon,
  //     title: 'Edit',
  //     onClick: handleEditOR,
  //     className:
  //       'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
  //   },
  // ];
  const handleEditOR = (dv) => {
    console.log('Edit OR', dv);
    setCurrentDisbursementVoucher(dv);
    setCurrentView('form');
  };

  const handleDVAction = async (dv, action) => {
    setApprovalLoading(true);
    try {
      const response = await axiosInstance.post(
        `/disbursementVoucher/${action}`,
        { ID: dv.ID }
      );
      console.log(`${action}d:`, response.data);
      dispatch(fetchDisbursementVouchers());
      toast.success(`Disbursement Voucher ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing disbursement voucher:`, error);
      toast.error(`Error ${action}ing disbursement voucher`);
    } finally {
      setApprovalLoading(false);
    }
  };
  return (
    <div>
      {currentView === 'list' && (
        <div>
          <div className="page-header">
            <div className="flex justify-between sm:items-center gap-4 max-sm:flex-col">
              <div>
                <h1>Disbursement Vouchers</h1>
                <p>Manage disbursement vouchers</p>
              </div>
              {Add && (
                <button
                  type="button"
                  onClick={handleCreateDV}
                  className="btn btn-primary max-sm:w-full"
                >
                  <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Create DV
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <DataTable
              columns={columns}
              data={disbursementVouchers}
              actions={(row) => {
                const actionList = [];

                if (row.Status.toLowerCase().includes('rejected') && Edit) {
                  actionList.push({
                    icon: PencilIcon,
                    title: 'Edit',
                    onClick: () => handleEditOR(row),
                    className:
                      'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
                  });
                } else if (row.Status === 'Requested') {
                  actionList.push(
                    {
                      icon: CheckLine,
                      title: 'Approve',
                      onClick: () => handleDVAction(row, 'approve'),
                      className:
                        'text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50',
                    },
                    {
                      icon: X,
                      title: 'Reject',
                      onClick: () => handleDVAction(row, 'reject'),
                      className:
                        'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
                    }
                  );
                }

                return actionList;
              }}
              loading={isLoading || approvalLoading}
              // onRowClick={handleViewOR}
            />
          </div>
        </div>
      )}

      {currentView === 'form' && (
        <div>
          <div className="page-header">
            <div className="flex justify-between items-center">
              <div className="flex sm:items-center gap-4 max-sm:flex-col">
                <button
                  onClick={handleBackToList}
                  className="mr-4 p-1 rounded-full hover:bg-neutral-100 w-fit"
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
              employeeOptions={employees.map((emp) => ({
                value: emp.ID,
                label:
                  emp.FirstName + ' ' + emp.MiddleName + ' ' + emp.LastName,
              }))}
              vendorOptions={vendorDetails.map((vendor) => ({
                value: vendor.ID,
                label: vendor.Name,
              }))}
              individualOptions={customers.map((customer) => ({
                value: customer.ID,
                label: customer.Name,
              }))}
              chartOfAccountsOptions={(chartOfAccounts || []).map(
                (account) => ({
                  value: account.ID,
                  label: account.AccountCode + ' - ' + account.Name,
                })
              )}
              employeeData={employees}
              vendorData={vendorDetails}
              individualData={customers}
              departmentOptions={departments.map((dept) => ({
                value: dept.ID,
                label: dept.Name,
              }))}
              fundOptions={funds.map((fund) => ({
                value: fund.ID,
                label: fund.Name,
              }))}
              projectOptions={projectDetails.map((project) => ({
                value: project.ID,
                label: project.Title,
              }))}
              fiscalYearOptions={fiscalYears.map((fiscalYear) => ({
                value: fiscalYear.ID,
                label: fiscalYear.Name,
              }))}
              particularsOptions={items.map((item) => ({
                value: item.ID,
                label: item.Name,
              }))}
              unitOptions={itemUnits.map((unit) => ({
                value: unit.ID,
                label: unit.Name,
              }))}
              taxCodeOptions={taxCodes.map((code) => ({
                value: code.ID,
                label: code.Name,
              }))}
              budgetOptions={budgets.map((code) => ({
                value: code.ID,
                label: code.Name,
              }))}
              taxCodeFull={taxCodes}
              onCancel={handleBackToList}
              onSubmitSuccess={handleBackToList}
              onClose={handleBackToList}
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
        </div>
      )}
    </div>
  );
}

export default DisbursementVoucherPage;
