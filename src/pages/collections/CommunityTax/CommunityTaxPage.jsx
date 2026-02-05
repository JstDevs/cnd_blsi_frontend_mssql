import { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/utils/axiosInstance';
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
import CommunityTaxCertificatePrint from './CommunityTaxCertificatePrint';
import { useReactToPrint } from 'react-to-print';
import { fetchGeneralLedgers } from '@/features/reports/generalLedgerSlice';
import { BookOpenIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
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
  const { generalLedgers, isLoading: isGLLoading } = useSelector((state) => state.generalLedger);
  // ---------------------USE MODULE PERMISSIONS------------------START (CommunityTaxPage - MODULE ID =  34 )
  const { Add, Edit, Delete, Print } = useModulePermissions(9);
  // console.log({ certificates, customers });
  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'details'
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showListModal, setShowListModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [isLoadingCTCActions, setIsLoadingCTCActions] = useState(false);
  const [isNewIndividual, setIsNewIndividual] = useState(false);
  const [newOwnerName, setNewOwnerName] = useState('');
  const [showGLModal, setShowGLModal] = useState(false);
  const printRef = useRef();
  useEffect(() => {
    dispatch(fetchCommunityTaxes());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleCreateCertificate = () => {
    setCurrentCertificate(null);
    setCurrentView('form');
    setIsNewIndividual(false);
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

  // HANDLE PRINT
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Community Tax Certificate',
  });

  const handlePrintCertificate = (certificate) => {
    // Implement print functionality
    console.log('Print certificate:', certificate);
    handlePrint();
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
      key: 'InvoiceNumber',
      header: 'Certificate No.',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'Status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded ${value === 'Requested' ? 'bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500 text-error-700'
            : value === 'Approved' ? 'bg-gradient-to-r from-success-300 via-success-500 to-success-600 text-neutral-800'
              : value === 'Posted' ? 'bg-gradient-to-r from-success-800 via-success-900 to-success-999 text-success-100'
                : value === 'Rejected' ? 'bg-gradient-to-r from-error-700 via-error-800 to-error-999 text-neutral-100'
                  : value === 'Void' ? 'bg-gradient-to-r from-primary-900 via-primary-999 to-tertiary-999 text-neutral-300'
                    : value === 'Cancelled' ? 'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-400 text-neutral-800'
                      : 'bg-gray-100 text-gray-800'
            }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'InvoiceDate',
      header: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
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
      className: 'text-right',
      render: (value) => (
        <span className="text-right font-semibold text-primary-700">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'AmountReceived',
      header: 'Received Amount',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right font-semibold text-primary-700">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'Year',
      header: 'Year',
      sortable: true,
    },
    // {
    //   key: 'Employee',
    //   header: 'Employee',
    //   sortable: true,
    // },
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
      case 'Requested': bgColor = 'bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500 text-error-700'; break;
      case 'Approved': bgColor = 'bg-gradient-to-r from-success-300 via-success-500 to-success-600 text-neutral-800'; break;
      case 'Posted': bgColor = 'bg-gradient-to-r from-success-800 via-success-900 to-success-999 text-success-100'; break;
      case 'Rejected': bgColor = 'bg-gradient-to-r from-error-700 via-error-800 to-error-999 text-neutral-100'; break;
      case 'Void': bgColor = 'bg-gradient-to-r from-primary-900 via-primary-999 to-tertiary-999 text-neutral-300'; break;
      case 'Cancelled': bgColor = 'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-400 text-neutral-800'; break;
      default: break;
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
    // Properly format action strings for messages
    const actionPast = action === 'approve' ? 'approved' : 'rejected';
    const actionPresent = action === 'approve' ? 'approving' : 'rejecting';
    try {
      const { data } = await axiosInstance.post(
        `/communityTaxIndividual/${action}`,
        { ID: dv.ID }
      );
      console.log(`${actionPast}:`, data);
      dispatch(fetchCommunityTaxes());
      toast.success(`Community Tax Individual ${actionPast} successfully`);
    } catch (error) {
      console.error(`Error ${actionPresent} Community Tax Individual:`, error);
      toast.error(`Error ${actionPresent} Community Tax Individual`);
    } finally {
      setIsLoadingCTCActions(false);
    }
  };

  const handleViewGL = (row) => {
    setShowGLModal(true);
    dispatch(fetchGeneralLedgers({
      LinkID: row.LinkID,
      FundID: row.FundsID || '',
      CutOffDate: row.InvoiceDate
    }));
  };

  const handleCloseGLModal = () => {
    setShowGLModal(false);
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
        icon: Trash,
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

    if (row.Status.toLowerCase().includes('posted')) {
      actionList.push({
        icon: BookOpenIcon,
        title: 'View GL',
        onClick: () => handleViewGL(row),
        className:
          'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
    }

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
      dispatch(fetchCustomers());
      toast.success('Certificate saved successfully.');
    } catch (error) {
      console.error('Error saving certificate:', error);
      toast.error('Failed to save certificate. Please try again.');
    } finally {
      handleBackToList();
    }
  };
  const handleCustomerChange = (val) => {
    // Check if the value is an ID (number) or a custom string (new name)
    const isCustom = typeof val === 'string' && !customers.find((c) => c.ID === val);

    if (isCustom) {
      // Logic for new individual
      // console.log('Creating new individual:', val);
      setSelectedCustomer(null);
      setIsNewIndividual(true);
      setNewOwnerName(val);
    } else {
      // Logic for existing customer
      const customer = customers.find((c) => c.ID === val);
      if (customer) {
        setSelectedCustomer(customer);
        setIsNewIndividual(false);
      }
    }
  };
  return (
    <>
      {/* // TABLE VIEW  */}
      {currentView === 'list' && (
        <>
          <div className="flex justify-between sm:items-center mb-6 page-header gap-4 max-sm:flex-col">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Community Tax Certificate - Individual
              </h1>
              <p className="text-gray-600">Manage community tax certificates for individuals.</p>
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
                    ? 'Edit Community Tax Certificate - Individual'
                    : 'Community Tax Certificate - Individual'}
                </h1>
                <p className="text-gray-600">
                  {currentCertificate ? 'Update the certificate details' : ''}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-end gap-2 w-full">
              <div className="w-full sm:w-auto">
                {/* SearchableDropdown moved to main content area */}
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
                {currentCertificate?.Status === 'Posted' && Print && (
                  <button className="btn btn-outline w-full sm:w-auto">
                    Print
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
            <div className="mb-4">
              <SearchableDropdown
                options={
                  customers?.map((customer) => ({
                    label:
                      customer.Name ||
                      `${customer.FirstName} ${customer.MiddleName} ${customer.LastName}`,
                    value: customer.ID,
                  })) || []
                }
                placeholder="Choose Individual or Type New Name"
                selectedValue={isNewIndividual ? newOwnerName : selectedCustomer?.ID}
                onSelect={handleCustomerChange}
                label="Choose Individual"
                required={!isNewIndividual}
              />
            </div>

            {selectedCustomer || isNewIndividual ? (
              <CommunityTaxForm
                key={selectedCustomer?.ID || (isNewIndividual ? newOwnerName : 'new-individual')}
                selectedCustomer={selectedCustomer}
                initialData={currentCertificate}
                onCancel={handleBackToList}
                onSubmitForm={handleFormSubmit}
                currentCertificateNumber={currentNumber}
                isNewIndividual={isNewIndividual}
                newOwnerName={newOwnerName}
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-800 text-center h-[50vh] flex items-center justify-center">
                Please select an Individual or click "New Individual" to start
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
              {currentCertificate?.Status === 'Posted' && Print && (
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
        isOpen={showGLModal}
        onClose={handleCloseGLModal}
        title="General Ledger Entries"
        size="4xl"
      >
        <div className="overflow-hidden border border-neutral-200 rounded-xl shadow-sm my-2">
          {isGLLoading ? (
            <div className="flex justify-center items-center py-12">
              <ArrowPathIcon className="h-8 w-8 animate-spin text-neutral-400" />
              <span className="ml-2 text-neutral-500">Loading ledger data...</span>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Fund</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Ledger Item</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Account Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Debit</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Credit</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {generalLedgers && generalLedgers.length > 0 ? (
                  generalLedgers.map((item, index) => (
                    <tr key={index} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-neutral-900">
                        {item.fund}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {item.ledger_item}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {item.account_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 font-mono">
                        {item.account_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-neutral-900 font-medium tabular-nums">
                        {Number(item.debit) > 0 ? (
                          <span className="text-primary-700">
                            ₱{Number(item.debit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-neutral-900 font-medium tabular-nums">
                        {Number(item.credit) > 0 ? (
                          <span className="text-secondary-700">
                            ₱{Number(item.credit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-neutral-500">
                      <div className="flex flex-col items-center justify-center">
                        <BookOpenIcon className="h-10 w-10 text-neutral-300 mb-2" />
                        <p>No ledger records found for this transaction.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              {generalLedgers && generalLedgers.length > 0 && (
                <tfoot className="bg-neutral-50 font-semibold text-neutral-900">
                  <tr>
                    <td colSpan="4" className="px-6 py-3 text-right text-xs uppercase tracking-wider text-neutral-500">Total</td>
                    <td className="px-6 py-3 text-right text-sm tabular-nums text-primary-700">
                      ₱{(generalLedgers.reduce((acc, curr) => acc + (Number(curr.debit) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-3 text-right text-sm tabular-nums text-secondary-700">
                      ₱{(generalLedgers.reduce((acc, curr) => acc + (Number(curr.credit) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
        </div>
        <div className="flex justify-end pt-4 border-t border-neutral-200 mt-4">
          <button
            type="button"
            onClick={handleCloseGLModal}
            className="btn btn-primary px-6"
          >
            Close
          </button>
        </div>
      </Modal>

      <div style={{ display: 'none' }}>
        <CommunityTaxCertificatePrint
          ref={printRef}
          certificate={currentCertificate}
        />
      </div>
    </>
  );
}

export default CommunityTaxPage;

