import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axiosInstance from '@/utils/axiosInstance';
import DataTable from '../../components/common/DataTable';
import FundUtilizationForm from './FundUtilizationForm';
import { fetchFundUtilizations } from '@/features/disbursement/fundUtilizationSlice';
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
import { statusLabel } from '../userProfile';
import { useModulePermissions } from '@/utils/useModulePremission';
import FundUtilizationDetails from './FundUtilizationDetails';

function FundUtilizationPage() {
  const dispatch = useDispatch();
  const { fundUtilizations, isLoading } = useSelector(
    (state) => state.fundUtilizations
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (FundUtilizationPage - MODULE ID =  47 )
  const { Add, Edit, Delete, Approve, Reject } = useModulePermissions(47);
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

  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'details'
  const [currentObligationRequest, setCurrentObligationRequest] =
    useState(null);

  useEffect(() => {
    dispatch(fetchFundUtilizations());
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
  }, [dispatch]);

  const handleCreateOR = () => {
    setCurrentObligationRequest(null);
    setCurrentView('form');
  };

  const handleViewOR = (or) => {
    setCurrentObligationRequest(or);
    setCurrentView('details');
  };

  const handleEditOR = (or) => {
    setCurrentObligationRequest(or);
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setCurrentObligationRequest(null);
  };

  const handleFURSAction = async (row, action) => {
    const actionPast = action === 'approve' ? 'approved' : 'rejected';
    const actionPresent = action === 'approve' ? 'approving' : 'rejecting';

    try {
      // For approval, we might need more details if the backend expects them
      // Based on typical pattern, passing the whole row or specific IDs
      const payload = {
        ID: row.ID,
        LinkID: row.LinkID,
        ApprovalLinkID: row.Transaction?.ApprovalLinkID || '', // Adjust based on your backend logic
        ApprovalProgress: (row.Transaction?.ApprovalProgress || 0) + 1,
        ApprovalOrder: row.Transaction?.ApprovalOrder || 1,
        NumberOfApproverPerSequence: row.Transaction?.NumberOfApproverPerSequence || 1,
        FundsID: row.FundsID,
        ApprovalVersion: row.Transaction?.ApprovalVersion,
      };

      if (action === 'reject') {
        const reason = window.prompt('Please enter reason for rejection:');
        if (reason === null) return;
        payload.Reason = reason;
      }

      const response = await axiosInstance.post(`/fundUtilizationRequest/${action}`, payload);
      toast.success(`Fund Utilization Request ${actionPast} successfully`);
      dispatch(fetchFundUtilizations());
    } catch (error) {
      console.error(`Error ${actionPresent} FURS:`, error);
      toast.error(error.response?.data?.error || `Error ${actionPresent} FURS`);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm('Are you sure you want to void this Request?')) return;
    try {
      await axiosInstance.post('/fundUtilizationRequest/void', {
        ID: row.ID,
        ApprovalLinkID: row.Transaction?.ApprovalLinkID || '',
      });
      toast.success('Fund Utilization Request voided successfully');
      dispatch(fetchFundUtilizations());
    } catch (error) {
      console.error('Error voiding FURS:', error);
      toast.error(error.response?.data?.error || 'Error voiding FURS');
    }
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
      key: 'InvoiceNumber',
      header: 'Invoice Number',
      sortable: true,
    },
    {
      key: 'Status',
      header: 'Status',
      sortable: true,

      render: (value) => statusLabel(value),
    },
    {
      key: 'InvoiceDate',
      header: 'Invoice Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'Remarks',
      header: 'Particular',
      sortable: true,
      render: (_, row) => {
        const items = row.TransactionItemsAll || row.Items || [];
        const combinedText = items.map((i) => i.Remarks || i.itemName).join(', ');
        return <div className="whitespace-pre-wrap">{combinedText}</div>;
      },
    },
    {
      key: 'Total',
      header: 'Total',
      sortable: true,
      className: 'text-right font-semibold',
      render: (value) => (
        <span className="text-right font-semibold text-primary-700">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'ResponsibilityCenterName',
      header: 'Responsibility Center',
      sortable: true,
    },
    // {
    //   key: 'FiscalYearName',
    //   header: 'Fiscal Year',
    //   sortable: true,
    // },
    // {
    //   key: 'ProjectName',
    //   header: 'Project',
    //   sortable: true,
    // },
    // {
    //   key: 'CustomerID',
    //   header: 'CustomerID',
    //   sortable: true,
    // },
  ];

  // Actions for table rows
  // const actions = [
  //   {
  //     icon: EyeIcon,
  //     title: 'View',
  //     onClick: handleViewOR,
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

  return (
    <div>
      {currentView === 'list' && (
        <div>
          <div className="page-header">
            <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
              <div>
                <h1>Fund Utilization Request and Status</h1>
                <p>Manage and track your fund utilization requests.</p>
              </div>
              {Add && (
                <button
                  type="button"
                  onClick={handleCreateOR}
                  className="btn btn-primary max-sm:w-full"
                >
                  <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Create
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <DataTable
              columns={columns}
              data={fundUtilizations}
              actions={(row) => {
                const actionList = [];
                const status = (row.Status || row.Transaction?.Status || '').toLowerCase();

                // Always allow View
                actionList.push({
                  icon: EyeIcon,
                  title: 'View',
                  onClick: () => handleViewOR(row),
                  className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
                });

                if (status === 'void') return actionList;

                if (status.includes('rejected') && Edit) {
                  actionList.push({
                    icon: PencilIcon,
                    title: 'Edit',
                    onClick: () => handleEditOR(row),
                    className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
                  });
                }

                if (status.includes('requested')) {
                  actionList.push(
                    {
                      icon: CheckIcon,
                      title: 'Approve',
                      onClick: () => handleFURSAction(row, 'approve'),
                      className: 'text-success-600 hover:text-success-900 p-1 rounded-full hover:bg-success-50',
                    },
                    {
                      icon: XMarkIcon,
                      title: 'Reject',
                      onClick: () => handleFURSAction(row, 'reject'),
                      className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
                    }
                  );
                }

                if (status !== 'posted' && Delete) {
                  actionList.push({
                    icon: TrashIcon,
                    title: 'Void',
                    onClick: () => handleDelete(row),
                    className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
                  });
                }

                return actionList;
              }}
              loading={isLoading}
            // onRowClick={handleViewOR}
            />
          </div>
        </div>
      )}

      {currentView === 'form' && (
        <div>
          <div className="page-header">
            <div className="flex justify-between items-center">
              <div className="flex sm:items-center max-sm:flex-col gap-4">
                <button
                  onClick={handleBackToList}
                  className="mr-4 p-1 rounded-full hover:bg-neutral-100 w-fit"
                >
                  <ArrowLeftIcon className="h-5 w-5 text-neutral-600" />
                </button>
                <div>
                  <h1>
                    {currentObligationRequest
                      ? 'Edit Fund Utilization Request'
                      : 'Create Fund Utilization Request'}
                  </h1>
                  <p>
                    Fill out the form to{' '}
                    {currentObligationRequest ? 'update' : 'create'} a fund
                    utilization request.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <FundUtilizationForm
              initialData={currentObligationRequest}
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
                label:
                  customer.Name ||
                  `${customer.FirstName} ${customer.MiddleName} ${customer.LastName}`,
              }))}
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
              formBudgets={budgets}
              taxCodeFull={taxCodes}
              onCancel={handleBackToList}
              onSubmitSuccess={handleBackToList}
              onClose={handleBackToList}
            />
          </div>
        </div>
      )}

      {currentView === 'details' && currentObligationRequest && (
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
                  <h1>Request Details</h1>
                  <p>View fund utilization request details</p>
                </div>
              </div>
              
               {/* Optional: Add Edit button here too if you want, but likely handled inside Details component */}
            </div>
          </div>
          <div className="mt-4">
            <FundUtilizationDetails
              or={currentObligationRequest}
              onBack={handleBackToList}
              onEdit={handleEditOR}
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default FundUtilizationPage;
