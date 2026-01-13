import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ArrowLeftIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import DataTable from '@/components/common/DataTable';
import RealPropertyTaxForm from './RealPropertyTaxForm';
import { useModulePermissions } from '@/utils/useModulePremission';
import {
  fetchRealPropertyTaxes,
  saveRealPropertyTax,
} from '@/features/collections/realPropertyTaxSlice';
import { fetchGeneralRevisions } from '@/features/settings/generalRevisionSlice';
import { fetchCustomers } from '@/features/settings/customersSlice';
import toast from 'react-hot-toast';
import { CheckLine, TrashIcon, X } from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';
import RealPropertyTaxViewModal from './RealPropertyTaxViewModal';
import { useReactToPrint } from 'react-to-print';
import PrintPageRealPropertyTax from './PrintPageRealPropertyTax';

function RealPropertyTaxPage() {
  const dispatch = useDispatch();
  const { realPropertyTaxes, isLoading } = useSelector(
    (state) => state.realPropertyTax
  );
  const { generalRevisions, isLoading: isLoadingGeneralRevisions } =
    useSelector((state) => state.generalRevisions);
  const { customers, isLoading: isLoadingCustomers } = useSelector(
    (state) => state.customers
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (RealPropertyTaxPage - MODULE ID =  70 )
  const { Add, Edit, Print } = useModulePermissions(70);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'details'
  const [currentProperty, setCurrentProperty] = useState(null);
  const [isLoadingReceipt, setIsLoadingReceipt] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const printRef = useRef();
  useEffect(() => {
    dispatch(fetchRealPropertyTaxes());
    dispatch(fetchGeneralRevisions());
    dispatch(fetchCustomers());
  }, []);

  const handleCreateProperty = () => {
    setCurrentProperty(null);
    setCurrentView('form');
  };

  const handleViewProperty = (property) => {
    setCurrentProperty(property);
    setIsViewModalOpen(true);
  };

  const handleEditProperty = (property) => {
    setCurrentProperty(property);
    setCurrentView('form');
  };
  // --------PRINT FUNCTIONALITY-------------
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `RealPropertyTax-${currentProperty?.T_D_No || 'Record'}`,
  });

  const handleBackToList = () => {
    setCurrentView('list');
    setCurrentProperty(null);
  };
  // Table columns definition
  const columns = [
    {
      key: 'Status',
      header: 'Status',
      sortable: true,
      render: (value) => renderStatusBadge(value),
    },
    {
      key: 'CustomerName',
      header: 'Customer Name',
      sortable: true,
    },
    {
      key: 'T_D_No',
      header: 'TD No.',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },

    {
      key: 'LinkID',
      header: 'Link ID',
      sortable: true,
    },
  ];

  // Helper function for status badges
  const renderStatusBadge = (value) => {
    let bgColor = 'bg-neutral-100 text-neutral-800';

    switch (value) {
      case 'Requested':   bgColor = 'bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500 text-error-700';      break;
      case 'Approved':    bgColor = 'bg-gradient-to-r from-success-300 via-success-500 to-success-600 text-neutral-800';    break;
      case 'Posted':      bgColor = 'bg-gradient-to-r from-success-800 via-success-900 to-success-999 text-success-100';    break;
      case 'Rejected':    bgColor = 'bg-gradient-to-r from-error-700 via-error-800 to-error-999 text-neutral-100';          break;
      case 'Void':        bgColor = 'bg-gradient-to-r from-primary-900 via-primary-999 to-tertiary-999 text-neutral-300';   break;
      case 'Cancelled':   bgColor = 'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-400 text-neutral-800';    break;
      default:            break;
    }

    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
      >
        {value}
      </span>
    );
  };

  const handleRPTAction = async (dv, action) => {
    // console.log('handleRPTAction', dv, action);
    // TODO : CHANGE THE PAYLOAD
    const actionConfig = {
      approve: {
        endpoint: 'postTransaction',
        payload: {
          id: dv.ID,
          linkID: dv.LinkID,
          approvalLinkID: dv.LinkID,
          approvalProgress: dv.approvalProgress || 1,
          amountReceived: dv.PreviousPayment || 0,
          ApprovalOrder: dv.ApprovalOrder || 1,
          transactionApprovalVersion: dv.transactionApprovalVersion || 1,
        },
        successMsg: 'Real Property approved successfully',
        errorMsg: 'Error approving Real Property',
      },
      reject: {
        endpoint: 'rejectTransaction',
        payload: {
          id: dv.ID,
          approvalLinkID: dv.LinkID,
          reasonForRejection: dv.reasonForRejection || 'ANY REASON',
        },
        successMsg: 'Real Property rejected successfully',
        errorMsg: 'Error rejecting Real Property',
      },
    };

    const config = actionConfig[action];
    if (!config) {
      console.error('Invalid action:', action);
      return;
    }

    setIsLoadingReceipt(true);
    try {
      const { data } = await axiosInstance.post(
        `/real-property-tax/${config.endpoint}`,
        config.payload
      );

      console.log(`${action} response:`, data);
      dispatch(fetchRealPropertyTaxes());
      toast.success(config.successMsg);
    } catch (error) {
      const errMsg = error.response?.data?.message || config.errorMsg;
      console.error(errMsg, error);
      toast.error(errMsg);
    } finally {
      setIsLoadingReceipt(false);
    }
  };

  const actions = (row) => {
    const actionList = [];

    if (row.Status.toLowerCase().includes('rejected') && Edit) {
      actionList.push({
        icon: PencilIcon,
        title: 'Edit',
        onClick: () => handleEditProperty(row),
        className:
          'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
    } else if (row.Status === 'Requested') {
      actionList.push(
        {
          icon: CheckLine,
          title: 'Post',
          onClick: () => handleRPTAction(row, 'approve'),
          className:
            'text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50',
        },
        {
          icon: X,
          title: 'Reject',
          onClick: () => handleRPTAction(row, 'reject'),
          className:
            'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
        }
      );
    }
    actionList.push({
      icon: EyeIcon,
      title: 'View',
      onClick: () => handleViewProperty(row),
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    });
    return actionList;
  };
  const handleSubmitSuccess = async (payload) => {
    // console.log('payload', payload);
    try {
      await dispatch(saveRealPropertyTax(payload)).unwrap();

      dispatch(fetchRealPropertyTaxes());
      handleBackToList();
      toast.success('Property saved successfully');
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save property. Please try again.');
    }
  };
  const individualOptions = customers?.map((customer) => ({
    value: customer.ID,
    label:
      customer.Name ||
      `${customer.FirstName} ${customer.MiddleName} ${customer.LastName}`,
  }));
  const generalRevisionsOptions = generalRevisions?.map((revision) => ({
    value: revision.ID,
    label: revision.General_Revision_Date_Year,
  }));
  // console.log('individualOptions', isViewModalOpen);

  console.log('currentProperty', currentProperty);
  return (
    <>
      {currentView === 'list' && (
        <>
          <div className="flex justify-between items-center max-sm:flex-wrap gap-4 mb-6 page-header">
            <div ref={printRef}>
              <h1 className="text-2xl font-bold text-gray-800">
                Real Property Tax Invoice
              </h1>
              <p className="text-gray-600">
                Manage real property tax invoices.
              </p>
            </div>
            <div className="flex gap-2">
              {' '}
              {Add && (
                <button
                  type="button"
                  onClick={handleCreateProperty}
                  className="btn btn-primary max-sm:w-full"
                >
                  <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  New RPT Invoice
                </button>
              )}
              {Print && (
                <button
                  onClick={handlePrint}
                  className="btn btn-primary disabled:opacity-50  "
                  disabled={currentProperty?.Status !== 'Posted'}
                >
                  <PrinterIcon className="h-5 w-5 mr-2" aria-hidden="true" />{' '}
                  Print
                </button>
              )}
            </div>
          </div>

          <DataTable
            columns={columns}
            data={realPropertyTaxes}
            actions={actions}
            loading={
              isLoading ||
              isLoadingGeneralRevisions ||
              isLoadingCustomers ||
              isLoadingReceipt
            }
            onRowClick={(row) => setCurrentProperty(row)}
            selectedRow={currentProperty}
          />
        </>
      )}

      {currentView === 'form' && (
        <div>
          <div className="flex justify-between max-sm:flex-col gap-4 sm:items-center mb-6">
            <div className="flex sm:items-center gap-4 max-sm:flex-col">
              <button
                onClick={handleBackToList}
                className="mr-4 p-1 rounded-full hover:bg-neutral-100 w-fit"
              >
                <ArrowLeftIcon className="h-5 w-5 text-neutral-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {currentProperty
                    ? 'Edit Real Property Tax Invoice'
                    : 'Create New Real Property Tax Invoice'}
                </h1>
                <p className="text-gray-600">
                  {currentProperty
                    ? 'Update the property details.'
                    : 'Fill out the form to create a new real property tax invoice.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
            <RealPropertyTaxForm
              initialData={currentProperty}
              onBack={handleBackToList}
              onCreateOrEdit={handleSubmitSuccess}
              individualOptions={individualOptions}
              generalRevisionsOptions={generalRevisionsOptions}
            />
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && (
        <RealPropertyTaxViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          property={currentProperty}
          onEdit={handleEditProperty}
          Edit={Edit}
        />
      )}
      {/* // PRINT THIS  //   */}
      {/* Hidden printable receipt */}
      <div style={{ display: 'none' }}>
        <PrintPageRealPropertyTax ref={printRef} property={currentProperty} />
      </div>
    </>
  );
}

export default RealPropertyTaxPage;
