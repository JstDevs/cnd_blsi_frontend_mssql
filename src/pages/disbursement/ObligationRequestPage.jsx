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
import { formatCurrency } from '../../utils/currencyFormater';
import axiosInstance from '@/utils/axiosInstance';

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
  const { Add, Edit, Delete } = useModulePermissions(1);
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
      render: (value, row) => {
        // 0. Try grabbing from the first Item (prioritize Item's Department)
        const items = row.TransactionItemsAll || row.Items || [];
        if (items.length > 0) {
          const firstItem = items[0];
          const itemDeptName = firstItem.ChargeAccount?.Department?.Name || firstItem.responsibilityCenterName;
          if (itemDeptName) return itemDeptName;
        }

        // 1. Try OBR join FIRST (Strictly by LinkID or OBR Number)
        const linkedOBR = obligationRequests.find(
          (obr) =>
            (row.OBR_LinkID && obr.LinkID === row.OBR_LinkID) ||
            (row.SourceLinkID && obr.LinkID === row.SourceLinkID) ||
            (row.ObligationRequestNumber &&
              obr.InvoiceNumber === row.ObligationRequestNumber) ||
            (row.OBR_NO && obr.InvoiceNumber === row.OBR_NO) ||
            (row.OBR_Number && obr.InvoiceNumber === row.OBR_Number)
        );

        if (linkedOBR && linkedOBR.ResponsibilityCenterName) {
          return linkedOBR.ResponsibilityCenterName;
        }

        // 2. Fallback to direct value if it's a name
        const rcName =
          value ||
          row.ResponsibilityCenter ||
          row.ResponsibilityCenterName ||
          row.DepartmentName;

        if (rcName && typeof rcName === 'string' && isNaN(rcName)) return rcName;

        // 3. Try Department lookup by ID
        const deptID =
          row.DepartmentID ||
          row.ResponsibilityCenterID ||
          (!isNaN(rcName) ? Number(rcName) : null);
        const dept = departments.find(
          (d) => String(d.ID) === String(deptID)
        );
        if (dept) return dept.Name;

        return 'N/A';
      },
    },
    /* {
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
    }, */
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
  useEffect(() => {
    console.log('Budgets Data:', budgets);
  }, [budgets]);
  const handleView = (or) => {
    handleViewOR(or);
  };
  const handleEditRequest = (or) => {
    handleEditOR(or);
  };
  const handleDelete = async (or) => {
    if (window.confirm('Are you sure you want to void this obligation request? This will mark it as void but keep it visible in the list.')) {
      try {
        await axiosInstance.delete(`/obligationRequest/delete/${or.ID}`);
        toast.success('Obligation Request voided successfully');
        dispatch(fetchObligationRequests());
      } catch (error) {
        console.error('Error voiding obligation request:', error);
        toast.error(error.response?.data?.message || 'Error voiding obligation request');
      }
    }
  };
  const handleORPAction = async (dv, action) => {
    // Config for each action
    const actionConfig = {
      approve: {
        endpoint: 'postTransaction',
        payload: {
          ID: dv.ID,
          FundsID: dv.FundsID,
        },
        successMsg: 'Obligation Request approved successfully',
        errorMsg: 'Error approving Obligation Request',
      },
      reject: {
        endpoint: 'rejectTransaction',
        payload: {
          ID: dv.ID,
          Reason: 'Rejected by user',
        },
        successMsg: 'Obligation Request rejected successfully',
        errorMsg: 'Error rejecting Obligation Request',
      },
    };

    const config = actionConfig[action];
    if (!config) {
      console.error('Invalid action:', action);
      return;
    }

    setIsLoadingORPAction(true);
    const actionPast = action === 'approve' ? 'approved' : 'rejected';
    const actionPresent = action === 'approve' ? 'approving' : 'rejecting';
    try {
      const { data } = await axiosInstance.post(
        `/obligationRequest/${config.endpoint}`,
        config.payload,
        { timeout: 30000 }
      );

      console.log(`${action} response:`, data);
      dispatch(fetchObligationRequests()); // update list if needed
      toast.success(config.successMsg);
    } catch (error) {
      const errMsg = error.response?.data?.error || error.response?.data?.message || config.errorMsg;
      console.error(errMsg, error);
      toast.error(errMsg);
    } finally {
      setIsLoadingORPAction(false);
    }
  };

  const actions = (row) => {
    const actionList = [];
    const isVoided = row?.Status?.toLowerCase().includes('void');

    // Don't show any action buttons for voided records except View
    if (!isVoided) {
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
          title: 'Void',
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
    }

    // Always show View button
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
                <p>Make obligation request transactions.</p>
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
              fundOptions={funds
                .filter((fund) => Number(fund.Active) === 1)
                .map((fund) => ({
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
              budgetOptions={budgets
                .map((code) => ({
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
              onEdit={handleEditOR}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ObligationRequestPage;
