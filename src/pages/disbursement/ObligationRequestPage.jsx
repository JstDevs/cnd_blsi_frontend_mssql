import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import ObligationRequestForm from './ObligationRequestForm';
import ObligationRequestDetails from './ObligationRequestDetails';
import { fetchObligationRequests } from '@/features/disbursement/obligationRequestSlice';
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
import { CheckLine, TrashIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

function ObligationRequestPage() {
  const dispatch = useDispatch();
  const { obligationRequests, isLoading } = useSelector(
    (state) => state.obligationRequests
  );

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
  const [isLoadingORPAction, setIsLoadingORPAction] = useState(false);
  // ---------------------USE MODULE PERMISSIONS------------------START (DisbursementVoucherPage - MODULE ID = 40 )
  const { Add, Edit, Delete } = useModulePermissions(62);
  useEffect(() => {
    dispatch(fetchObligationRequests());
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
      key: 'ResponsibilityCenterName',
      header: 'Responsibility Center',
      sortable: true,
    },
    {
      key: 'Total',
      header: 'Total',
      sortable: true,
    },
    {
      key: 'FiscalYearName',
      header: 'Fiscal Year',
      sortable: true,
    },
    {
      key: 'ProjectName',
      header: 'Project',
      sortable: true,
    },
    {
      key: 'CustomerID',
      header: 'CustomerID',
      sortable: true,
    },
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
  const handleView = (values) => {
    console.log(values);
  };
  const handleEditRequest = (dv) => {
    // setCurrentObligationRequest(dv);
    // setCurrentView('form');
    console.log(values);
  };
  const handleDelete = (dv) => {
    // setCurrentObligationRequest(dv);
    // setCurrentView('form');
    console.log(values);
  };
  const handleORPAction = async (dv, action) => {
    setIsLoadingORPAction(true);
    try {
      // TODO : add action
      // const response = await axiosInstance.post(
      //   `/disbursementVoucher/${action}`,
      //   { ID: dv.ID }
      // );
      console.log(`${action}d:`, response.data);
      // dispatch(fetchGeneralServiceReceipts());
      toast.success(`Obligation Request ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing Obligation Request:`, error);
      toast.error(`Error ${action}ing Obligation Request`);
    } finally {
      setIsLoadingORPAction(false);
    }
  };

  const actions = (row) => {
    const actionList = [];

    if (row?.Status?.toLowerCase().includes('rejected') && Edit) {
      actionList.push({
        icon: PencilIcon,
        title: 'Edit',
        onClick: handleEditRequest,
        className:
          'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
      actionList.push({
        icon: TrashIcon,
        title: 'Delete',
        onClick: () => handleDelete(row),
        className:
          'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
      });
    } else if (row?.Status?.toLowerCase().includes('requested')) {
      actionList.push(
        {
          icon: CheckLine,
          title: 'Approve',
          onClick: () => handleORPAction(row, 'approve'),
          className:
            'text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50',
        },
        {
          icon: X,
          title: 'Reject',
          onClick: () => handleORPAction(row, 'reject'),
          className:
            'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
        }
      );
    }
    actionList.push({
      icon: EyeIcon,
      title: 'View',
      onClick: handleView,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    });
    return actionList;
  };
  return (
    <div>
      {currentView === 'list' && (
        <div>
          <div className="page-header">
            <div className="flex justify-between sm:items-center gap-4 max-sm:flex-col">
              <div>
                <h1>Obligation Requests</h1>
                <p>Manage obligation requests</p>
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
              data={obligationRequests}
              actions={actions}
              loading={isLoading || isLoadingORPAction}
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
                    {currentObligationRequest
                      ? 'Edit Obligation Request'
                      : 'Create Obligation Request'}
                  </h1>
                  <p>
                    Fill out the form to{' '}
                    {currentObligationRequest ? 'update' : 'create'} an
                    obligation request
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <ObligationRequestForm
              initialData={currentObligationRequest}
              employeeOptions={employees.map((emp) => ({
                value: emp.ID,
                label:
                  emp.FirstName + ' ' + emp.MiddleName + ' ' + emp.LastName,
              }))}
              vendorOptions={vendorDetails.map((vendor) => ({
                value: vendor.ID,
                label:
                  vendor.Name ||
                  `${vendor.FirstName} ${vendor.MiddleName} ${vendor.LastName}`,
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
                  <h1>Obligation Request Details</h1>
                  <p>View and manage obligation request details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleEditOR(currentObligationRequest)}
                className="btn btn-primary flex items-center"
              >
                <PencilIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Edit
              </button>
            </div>
          </div>

          <div className="mt-4">
            <ObligationRequestDetails
              or={currentObligationRequest}
              onBack={handleBackToList}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ObligationRequestPage;
