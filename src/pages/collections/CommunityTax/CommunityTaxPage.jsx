import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ArrowLeftIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import DataTable from '@/components/common/DataTable';
import CommunityTaxForm from './CommunityTaxForm';
import SearchableDropdown from '@/components/common/SearchableDropdown';
import Modal from '@/components/common/Modal';
import {
  fetchCommunityTaxes,
  deleteCommunityTax,
  addCommunityTax,
  communityTaxGetCurrentNumber,
} from '@/features/collections/CommunityTaxSlice';
import { CheckLine, Trash, X } from 'lucide-react';
import { fetchCustomers } from '@/features/settings/customersSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';
function CommunityTaxPage() {
  const dispatch = useDispatch();
  const {
    records: certificates,
    currentNumber,
    isLoading,
  } = useSelector((state) => state.communityTax);
  const { customers, isLoading: customersLoading } = useSelector(
    (state) => state.customers
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (CommunityTaxPage - MODULE ID =  34 )
  const { Add, Edit, Delete, Print } = useModulePermissions(34);
  // console.log({ certificates, customers });
  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'details'
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showListModal, setShowListModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});

  useEffect(() => {
    dispatch(fetchCommunityTaxes());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleCreateCertificate = () => {
    setCurrentCertificate(null);
    setCurrentView('form');
    dispatch(communityTaxGetCurrentNumber());
  };

  const handleViewCertificate = (certificate) => {
    setCurrentCertificate(certificate);
    setCurrentView('details');
  };

  const handleEditCertificate = (certificate) => {
    setCurrentCertificate(certificate);
    setCurrentView('form');
    console.log('Edit certificate:', certificate);
    handleCustomerChange(certificate.CustomerID);
  };

  const handlePrintCertificate = (certificate) => {
    // Implement print functionality
    console.log('Print certificate:', certificate);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setCurrentCertificate(null);
    setSelectedCustomer(null);
  };
  // ----------DELETE CERTIFICATE FUNCTION------------
  const handleDeleteCertificate = async (certificate) => {
    try {
      await dispatch(deleteCommunityTax(certificate.ID)).unwrap();
      // If deletion was successful, refetch the data
      dispatch(fetchCommunityTaxes());
      // console.log('Certificate deleted and data reFetched');
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  // Filter certificates based on search term
  const filteredCertificates = certificates?.filter((cert) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cert?.LinkID?.toLowerCase().includes(searchLower) ||
      cert?.CustomerName?.toLowerCase().includes(searchLower) ||
      cert?.Customer?.StreetAddress?.toLowerCase().includes(searchLower)
    );
  });

  // Table columns definition
  const columns = [
    {
      key: 'LinkID',
      header: 'Certificate No.',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'CustomerName',
      header: 'Taxpayer Name',
      sortable: true,
      className: 'text-right',
    },
    {
      key: 'Total',
      header: 'Total Amount',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'AmountReceived',
      header: 'Received Amount',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'InvoiceDate',
      header: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'Employee',
      header: 'Employee',
      sortable: true,
    },
    {
      key: 'Status',
      header: 'Status',
      sortable: true,
      render: (value) => renderStatusBadge(value),
    },
  ];
  // Helper function for currency formatting
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount || 0);
  };
  // Helper function for status badges
  const renderStatusBadge = (value) => {
    let bgColor = 'bg-neutral-100 text-neutral-800';

    switch (value) {
      case 'Requested':
        bgColor = 'bg-success-100 text-success-800';
        break;
      case 'Posted':
        bgColor = 'bg-warning-100 text-warning-800';
        break;
      case 'Cancelled':
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
  };
  // Actions for table rows
  // const actions = [
  //   {
  //     icon: EyeIcon,
  //     title: 'View',
  //     onClick: handleViewCertificate,
  //     className:
  //       'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
  //   },
  //   Edit && {
  //     icon: PencilIcon,
  //     title: 'Edit',
  //     onClick: handleEditCertificate,
  //     className:
  //       'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
  //   },
  //   Delete && {
  //     icon: Trash,
  //     title: 'Delete',
  //     onClick: handleDeleteCertificate,
  //     className:
  //       'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
  //   },
  // ];
  const handleCTIAction = async (dv, action) => {
    setIsLoadingCTCActions(true);
    try {
      // TODO : add action
      // const response = await axiosInstance.post(
      //   `/disbursementVoucher/${action}`,
      //   { ID: dv.ID }
      // );
      console.log(`${action}d:`, response.data);
      // dispatch(fetchGeneralServiceReceipts());
      toast.success(`Community Tax Individual ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing Community Tax Individual:`, error);
      toast.error(`Error ${action}ing Community Tax Individual`);
    } finally {
      setIsLoadingCTCActions(false);
    }
  };
  const actions = (row) => {
    const actionList = [];

    if (row.Status.toLowerCase().includes('rejected') && Edit) {
      actionList.push({
        icon: PencilIcon,
        title: 'Edit',
        onClick: handleEditCertificate,
        className:
          'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
      actionList.push({
        icon: TrashIcon,
        title: 'Delete',
        onClick: handleDeleteCertificate,
        className:
          'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
      });
    } else if (row.Status.toLowerCase().includes('requested')) {
      actionList.push(
        {
          icon: CheckLine,
          title: 'Approve',
          onClick: () => handleCTIAction(row, 'approve'),
          className:
            'text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50',
        },
        {
          icon: X,
          title: 'Reject',
          onClick: () => handleCTIAction(row, 'reject'),
          className:
            'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
        }
      );
    }
    actionList.push({
      icon: EyeIcon,
      title: 'View',
      onClick: handleViewCertificate,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    });
    return actionList;
  };
  const handleShowList = () => {
    setShowListModal(true);
  };

  const handleCloseListModal = () => {
    setShowListModal(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      // console.log('Form data to save:', formData);
      await dispatch(addCommunityTax(formData)).unwrap();
      dispatch(fetchCommunityTaxes());
      toast.success('Certificate saved successfully.');
    } catch (error) {
      console.error('Error saving certificate:', error);
      toast.error('Failed to save certificate. Please try again.');
    } finally {
      handleBackToList();
    }
  };
  const handleCustomerChange = (customerID) => {
    const selectedCustomer = customers.find((c) => c.ID === customerID);
    // console.log('Selected customer:', selectedCustomer, customer);
    setSelectedCustomer(selectedCustomer);
  };
  return (
    <>
      {/* // TABLE VIEW  */}
      {currentView === 'list' && (
        <>
          <div className="flex justify-between sm:items-center mb-6 page-header gap-4 max-sm:flex-col">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Community Tax Certificate
              </h1>
              <p className="text-gray-600">Manage community tax certificates</p>
            </div>
            {Add && (
              <button
                type="button"
                onClick={handleCreateCertificate}
                className="btn btn-primary max-sm:w-full"
              >
                <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                New Certificate
              </button>
            )}
          </div>

          <div className="mt-4">
            <DataTable
              columns={columns}
              data={filteredCertificates}
              actions={actions}
              loading={isLoading || customersLoading}
              onRowClick={handleViewCertificate}
            />
          </div>
        </>
      )}
      {/* // NORMAL CREATE/EDIT FORM VIEW  */}
      {currentView === 'form' && (
        <>
          <div className="flex justify-between items-start mb-6 flex-col  gap-8">
            <div className="flex sm:items-center gap-4 max-sm:flex-col">
              <button
                onClick={handleBackToList}
                className="mr-4 p-1 rounded-full hover:bg-neutral-100 w-fit"
              >
                <ArrowLeftIcon className="h-5 w-5 text-neutral-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {currentCertificate
                    ? 'Edit Community Tax Certificate (INDIVIDUAL)'
                    : 'Community Tax Certificate (INDIVIDUAL)'}
                </h1>
                <p className="text-gray-600">
                  {currentCertificate ? 'Update the certificate details' : ''}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-end gap-2 w-full">
              <div className="w-full sm:w-auto">
                <SearchableDropdown
                  options={
                    customers?.map((customer) => ({
                      label:
                        customer.Name ||
                        `${customer.FirstName} ${customer.MiddleName} ${customer.LastName}`,
                      value: customer.ID,
                    })) || []
                  }
                  placeholder="Choose Citizen"
                  selectedValue={selectedCustomer?.ID}
                  onSelect={handleCustomerChange}
                  label="Choose Citizen"
                  required
                />
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleShowList}
                  className="btn btn-secondary w-full sm:w-auto"
                >
                  Show List
                </button>
                <button className="btn btn-primary w-full sm:w-auto">
                  Add Attachments
                </button>
                {Print && (
                  <button className="btn btn-outline w-full sm:w-auto">
                    Print
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
            {selectedCustomer ? (
              <CommunityTaxForm
                key={selectedCustomer?.ID}
                selectedCustomer={selectedCustomer}
                initialData={currentCertificate}
                onCancel={handleBackToList}
                onSubmitForm={handleFormSubmit}
                currentCertificateNumber={currentNumber}
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-800 text-center h-[50vh]">
                Please select a Citizen first to start{' '}
              </h2>
            )}
          </div>
        </>
      )}
      {/* // READ ONLY VIEW  */}
      {currentView === 'details' && currentCertificate && (
        <>
          <div className="flex justify-between items-center mb-6  gap-4 flex-wrap">
            <div className="flex items-center">
              <button
                onClick={handleBackToList}
                className="mr-4 p-1 rounded-full hover:bg-neutral-100"
              >
                <ArrowLeftIcon className="h-5 w-5 text-neutral-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Certificate Details
                </h1>
                <p className="text-gray-600">
                  View and manage certificate details
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {Edit && (
                <button
                  type="button"
                  onClick={() => handleEditCertificate(currentCertificate)}
                  className="btn btn-primary flex items-center"
                >
                  <PencilIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Edit
                </button>
              )}
              {Print && (
                <button
                  type="button"
                  onClick={() => handlePrintCertificate(currentCertificate)}
                  className="btn btn-outline flex items-center"
                >
                  <PrinterIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Print
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
            <CommunityTaxForm
              initialData={currentCertificate}
              onCancel={handleBackToList}
              isReadOnly={true}
            />
          </div>
        </>
      )}
      {/* Modal for General Ledger View */}
      <Modal
        isOpen={showListModal}
        onClose={handleCloseListModal}
        title="General Ledger View"
        size="lg"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fund Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ledger Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Debit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Type Name
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  General Fund
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Community Tax
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Community Tax
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  4-01-01-050
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  0
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  96.00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Community Tax
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  General Fund
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Cash - Local Tr...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Cash - Local Tr...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  1-01-01-010
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  96.00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  0
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Community Tax
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}

export default CommunityTaxPage;
