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
import CTCForm from './CTCForm';
import SearchableDropdown from '@/components/common/SearchableDropdown';
import Modal from '@/components/common/Modal';
import { fetchVendorDetails } from '@/features/settings/vendorDetailsSlice';
import { Trash } from 'lucide-react';
import {
  fetchCorporateCommunityTaxes,
  deleteCorporateCommunityTax,
  addCorporateCommunityTax,
} from '@/features/collections/CoorporateCommunityTax';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function CommunityTaxCorporationPage() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'details'
  const [currentCertificate, setCurrentCertificate] = useState(null);
  // const [searchTerm, setSearchTerm] = useState('');
  const [showListModal, setShowListModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  // ---------------------USE MODULE PERMISSIONS------------------START (CommunityTaxCorporationPage - MODULE ID =  35 )
  const { Add, Edit, Delete, Print } = useModulePermissions(35);
  const { records: certificates, isLoading: certificatesLoading } = useSelector(
    (state) => state.corporateCommunityTax
  );
  const { vendorDetails, isLoading } = useSelector(
    (state) => state.vendorDetails
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchVendorDetails());
    dispatch(fetchCorporateCommunityTaxes());
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
    console.log('Edit certificate:', certificate);
    handleVendorChange(certificate.CustomerID);
    setCurrentView('form');
  };

  const handlePrintCertificate = (certificate) => {
    console.log('Print certificate:', certificate);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setCurrentCertificate(null);
    setSelectedVendor(null);
  };
  // Updated columns definition to match the image
  const columns = [
    {
      key: 'CustomerID',
      header: 'Customer ID',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'CustomerName',
      header: 'Customer Name',
      sortable: true,
    },
    {
      key: 'Total',
      header: 'Total',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'AmountReceived',
      header: 'Amount Received',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'Earnings',
      header: 'Earnings',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'TaxDue',
      header: 'Tax Due',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'Year',
      header: 'Year',
      sortable: true,
    },
    {
      key: 'IssuedBy',
      header: 'Issued By',
      sortable: true,
    },
    {
      key: 'Status',
      header: 'Status',
      // sortable: true,
      render: (value) => renderStatusBadge(value),
    },
  ];

  // Updated currency formatting to handle large numbers
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Updated status badge rendering
  const renderStatusBadge = (value) => {
    let bgColor = 'bg-neutral-100 text-neutral-800';

    switch (value) {
      case 'Posted':
        bgColor = 'bg-green-100 text-green-800';
        break;
      case 'Requested':
        bgColor = 'bg-yellow-100 text-yellow-800';
        break;
      case 'Cancelled':
        bgColor = 'bg-red-100 text-red-800';
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
  // ----------DELETE CERTIFICATE FUNCTION------------
  const handleDeleteCertificate = async (certificate) => {
    try {
      await dispatch(deleteCorporateCommunityTax(certificate.ID)).unwrap();
      // If deletion was successful, refetch the data
      dispatch(fetchCorporateCommunityTaxes());
      console.log('Certificate deleted and data reFetched');
      toast.success('Certificate deleted successfully.');
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast.error('Failed to delete certificate. Please try again.');
    } finally {
      handleBackToList();
    }
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
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditCertificate,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Delete && {
      icon: Trash,
      title: 'Delete',
      onClick: handleDeleteCertificate,
      className:
        'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
    },
  ];

  const handleShowList = () => {
    setShowListModal(true);
  };

  const handleCloseListModal = () => {
    setShowListModal(false);
  };
  const handleCTCSubmitSuccess = async (formData) => {
    try {
      await dispatch(addCorporateCommunityTax(formData)).unwrap();

      dispatch(fetchCorporateCommunityTaxes());

      toast.success('Certificate saved successfully.');
    } catch (error) {
      console.error('Error saving certificate:', error);
      toast.error('Failed to save certificate. Please try again.');
    } finally {
      handleBackToList();
    }
  };
  const handleVendorChange = (value) => {
    const selectedVendor = vendorDetails.find((vendor) => vendor.ID === value);
    setSelectedVendor(selectedVendor);
    console.log('Selected vendor:', selectedVendor);
  };
  return (
    <>
      {currentView === 'list' && (
        <>
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4 page-header">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Corporation Tax Certificate
              </h1>
              <p className="text-gray-600">
                Manage corporation tax certificates
              </p>
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

          <div className="mt-6">
            <DataTable
              columns={columns}
              data={certificates}
              actions={actions}
              loading={isLoading || certificatesLoading}
              onRowClick={handleViewCertificate}
            />
          </div>
        </>
      )}

      {currentView === 'form' && (
        <div>
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
                    ? 'Edit Community Tax Certificate (CORPORATE)'
                    : 'Community Tax Certificate (CORPORATE)'}
                </h1>
                <p className="text-gray-600">
                  {currentCertificate
                    ? 'Update the certificate details'
                    : 'Fill out the form to create a new certificate'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-end gap-2 w-full">
              <div className="sm:w-auto w-full">
                <SearchableDropdown
                  options={
                    vendorDetails?.map((vendors) => ({
                      label: vendors.Name,
                      value: vendors.ID,
                    })) || []
                  }
                  selectedValue={selectedVendor?.ID}
                  label="Choose Vendor"
                  placeholder="Choose Vendor"
                  onSelect={handleVendorChange}
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
            {selectedVendor ? (
              <CTCForm
                key={selectedVendor?.ID}
                selectedVendor={selectedVendor}
                initialData={currentCertificate}
                onCancel={handleBackToList}
                onSubmitSuccess={handleCTCSubmitSuccess}
                readOnly={false}
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-800 text-center h-[50vh]">
                Please select a vendor first to start{' '}
              </h2>
            )}
          </div>
        </div>
      )}

      {currentView === 'details' && currentCertificate && (
        <div>
          <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
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
            <CTCForm
              initialData={currentCertificate}
              readOnly={true}
              onBack={handleBackToList}
            />
          </div>
        </div>
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

export default CommunityTaxCorporationPage;
