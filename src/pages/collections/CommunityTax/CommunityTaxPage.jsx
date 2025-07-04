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
} from '@/features/collections/CommunityTaxSlice';
import { Delete, Trash } from 'lucide-react';
// import CommunityTaxDetails from './CommunityTaxDetails';
// import { fetchCommunityTaxes } from '@/features/tax/communityTaxSlice';
// Add sample data (will be used if Redux state is empty)
// const sampleCertificates = [
//   {
//     id: 1,
//     certificateNo: 'CTC-2024-001',
//     date: '2024-01-15',
//     name: 'Leivan Jake Baguio',
//     address: '123 Main St, Baguio City',
//     amount: 96.0,
//     totalAmount: 96.0,
//     receivedAmount: 100.0,
//     change: 4.0,
//     status: 'Active',
//     purpose: 'Business Permit',
//     issuedBy: 'Treasury S Head',
//     employee: 'Juan Dela Cruz',
//     employeeId: 'EMP-001',
//     postedDate: '2024-01-16',
//   },
//   {
//     id: 2,
//     certificateNo: 'CTC-2024-002',
//     date: '2024-02-20',
//     name: 'Maria Santos',
//     address: '456 Pine St, Baguio City',
//     amount: 120.5,
//     totalAmount: 120.5,
//     receivedAmount: 150.0,
//     change: 29.5,
//     status: 'Active',
//     purpose: 'Employment Requirement',
//     issuedBy: 'Treasury S Head',
//     employee: 'Ana Reyes',
//     employeeId: 'EMP-002',
//     postedDate: '2024-02-21',
//   },
//   // ... other sample certificates
// ];
function CommunityTaxPage() {
  const dispatch = useDispatch();
  const { records: certificates, isLoading } = useSelector(
    (state) => state.communityTax
  );
  console.log({ certificates });
  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'details'
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showListModal, setShowListModal] = useState(false);

  useEffect(() => {
    dispatch(fetchCommunityTaxes());
  }, [dispatch]);

  const handleCreateCertificate = () => {
    setCurrentCertificate(null);
    setCurrentView('form');
  };

  const handleViewCertificate = (certificate) => {
    setCurrentCertificate(certificate);
    setCurrentView('details');
  };

  const handleEditCertificate = (certificate) => {
    setCurrentCertificate(certificate);
    setCurrentView('form');
  };

  const handlePrintCertificate = (certificate) => {
    // Implement print functionality
    console.log('Print certificate:', certificate);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setCurrentCertificate(null);
  };
  // ----------DELETE CERTIFICATE FUNCTION------------
  const handleDeleteCertificate = async (certificate) => {
    try {
      await dispatch(deleteCommunityTax(certificate.ID)).unwrap();
      // If deletion was successful, refetch the data
      dispatch(fetchCommunityTaxes());
      console.log('Certificate deleted and data reFetched');
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
    // {
    //   key: 'change',
    //   header: 'Change',
    //   sortable: true,
    //   render: (value) => formatCurrency(value),
    //   className: 'text-right',
    // },
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
  const actions = [
    {
      icon: EyeIcon,
      title: 'View',
      onClick: handleViewCertificate,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditCertificate,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    {
      icon: Trash,
      title: 'Delete',
      onClick: handleDeleteCertificate,
      className:
        'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
    },
  ];
  const fruits = [
    'Apple',
    'Banana',
    'Cherry',
    'Date',
    'Elderberry',
    'Fig',
    'Grape',
    'Honeydew',
    'Kiwi',
    'Lemon',
  ];
  const handleShowList = () => {
    setShowListModal(true);
  };

  const handleCloseListModal = () => {
    setShowListModal(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      console.log('Form data to save:', formData);
      await dispatch(addCommunityTax(formData)).unwrap();
      dispatch(fetchCommunityTaxes());
      // For now, we'll just show a success message and go back to list

      handleBackToList();
    } catch (error) {
      console.error('Error saving certificate:', error);
      alert('Failed to save certificate. Please try again.');
    }
  };
  return (
    <div className="container mx-auto p-2 sm:px-4 sm:py-8">
      {/* // TABLE VIEW  */}
      {currentView === 'list' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Community Tax Certificate
              </h1>
              <p className="text-gray-600">Manage community tax certificates</p>
            </div>
            <button
              type="button"
              onClick={handleCreateCertificate}
              className="btn btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              New Certificate
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-wrap items-start gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by certificate no., name, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <DataTable
              columns={columns}
              data={filteredCertificates}
              actions={actions}
              loading={isLoading}
              onRowClick={handleViewCertificate}
            />
          </div>
        </div>
      )}
      {/* // NORMAL CREATE/EDIT FORM VIEW  */}
      {currentView === 'form' && (
        <>
          <div className="flex justify-between items-start mb-6 flex-col  gap-8">
            <div className="flex items-center">
              <button
                onClick={handleBackToList}
                className="mr-4 p-1 rounded-full hover:bg-neutral-100"
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
                  {currentCertificate
                    ? 'Update the certificate details'
                    : 'Fill out the form to create a new certificate'}
                </p>
              </div>
            </div>
            <div className="flex items-end gap-2 justify-end w-full">
              <SearchableDropdown
                options={fruits}
                placeholder="Choose Citizen"
              />

              <button
                type="button"
                onClick={handleShowList}
                className="btn btn-secondary flex-initial"
              >
                Show List
              </button>
              <button className="btn btn-primary flex-initial">
                Add Attachments
              </button>
              <button className="btn btn-outline flex-initial">Print</button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
            <CommunityTaxForm
              initialData={currentCertificate}
              onCancel={handleBackToList}
              onSubmitForm={handleFormSubmit}
            />
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
              <button
                type="button"
                onClick={() => handleEditCertificate(currentCertificate)}
                className="btn btn-primary flex items-center"
              >
                <PencilIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handlePrintCertificate(currentCertificate)}
                className="btn btn-outline flex items-center"
              >
                <PrinterIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Print
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
            <CommunityTaxForm
              initialData={currentCertificate}
              onCancel={handleBackToList}
              isReadOnly={true} // Add this prop to make the form read-only
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
    </div>
  );
}

export default CommunityTaxPage;
