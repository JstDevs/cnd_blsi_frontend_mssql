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
// import CommunityTaxCorporationForm from './CommunityTaxCorporationForm';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CTCForm from './CTCForm';

// Sample data for demonstration
// Updated sample data to match the image structure
const sampleCertificates = [
  {
    id: 1,
    customerId: 'CAC',
    customerName: 'aera sc',
    total: 540.0,
    amountReceived: 50.0,
    earnings: 500000.0,
    taxDue: 200.0,
    year: '2024',
    issuedBy: 'Treasury SH.',
    status: 'Posted',
  },
  {
    id: 2,
    customerId: '10015',
    customerName: 'LBM Enterprises',
    total: 0.0,
    amountReceived: 0.0,
    earnings: 50000.0,
    taxDue: 0.0,
    year: '2024',
    issuedBy: 'Treasury SH.',
    status: 'Requested',
  },
  {
    id: 3,
    customerId: '10',
    customerName: 'sherwin pua ola',
    total: 1300.0,
    amountReceived: 100.0,
    earnings: 1000000.0,
    taxDue: 400.0,
    year: '2024',
    issuedBy: 'Treasury SH.',
    status: 'Posted',
  },
  {
    id: 4,
    customerId: '10015',
    customerName: 'LBM Enterprises',
    total: 15750.0,
    amountReceived: 1000.0,
    earnings: 100000000.0,
    taxDue: 40000.0,
    year: '2024',
    issuedBy: 'Treasury S H.',
    status: 'Posted',
  },
  {
    id: 5,
    customerId: '13',
    customerName: 'JST Technology',
    total: 583.2,
    amountReceived: 500.0,
    earnings: 0.0,
    taxDue: 0.0,
    year: '2024',
    issuedBy: 'Treasury SH.',
    status: 'Cancelled',
  },
];

function CommunityTaxCorporationPage() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'details'
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Use sample data (replace with Redux when implemented)
  const certificates = sampleCertificates;

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
    console.log('Print certificate:', certificate);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setCurrentCertificate(null);
  };

  // Filter certificates based on search term
  const filteredCertificates = certificates?.filter((cert) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cert.customerId.toLowerCase().includes(searchLower) ||
      cert.customerName.toLowerCase().includes(searchLower) ||
      cert.issuedBy.toLowerCase().includes(searchLower)
    );
  });

  // Updated columns definition to match the image
  const columns = [
    {
      key: 'customerId',
      header: 'Customer ID',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'customerName',
      header: 'Customer Name',
      sortable: true,
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'amountReceived',
      header: 'Amount Received',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'earnings',
      header: 'Earnings',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'taxDue',
      header: 'Tax Due',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'year',
      header: 'Year',
      sortable: true,
    },
    {
      key: 'issuedBy',
      header: 'Issued By',
      sortable: true,
    },
    {
      key: 'status',
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
  ];

  return (
    <div className="container mx-auto  sm:px-4 sm:py-8">
      {currentView === 'list' && (
        <div>
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Corporation Tax Certificates
              </h1>
              <p className="text-gray-600">
                Manage corporation tax certificates
              </p>
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
                    placeholder="Search by certificate no., corporation name, or TIN..."
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
              loading={false}
              onRowClick={handleViewCertificate}
            />
          </div>
        </div>
      )}

      {currentView === 'form' && (
        <div>
          <div className="flex justify-between items-center mb-6">
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
                    ? 'Edit Corporation Certificate'
                    : 'Create Corporation Certificate'}
                </h1>
                <p className="text-gray-600">
                  {currentCertificate
                    ? 'Update the certificate details'
                    : 'Fill out the form to create a new certificate'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
            <CTCForm
              initialData={currentCertificate}
              onCancel={handleBackToList}
              onSubmitSuccess={handleBackToList}
            />
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
            <CTCForm
              initialData={currentCertificate}
              readOnly={true}
              onBack={handleBackToList}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunityTaxCorporationPage;
{
  /* <Formik
  initialValues={selectedRecord || {
    certificateNo: '',
    date: new Date().toISOString().split('T')[0],
    corporationName: '',
    tin: '',
    address: '',
    businessType: '',
    grossReceipts: '',
    purpose: '',
    amount: '',
    interest: ''
  }}
  validationSchema={corporationTaxSchema}
  onSubmit={handleSubmit}
  enableReinitialize
>
  {({ isSubmitting }) => (
    <Form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Certificate No."
          name="certificateNo"
          type="text"
          required
        />
        <FormField
          label="Date"
          name="date"
          type="date"
          required
        />
      </div>

      <FormField
        label="Corporation Name"
        name="corporationName"
        type="text"
        required
      />

      <FormField
        label="TIN"
        name="tin"
        type="text"
        required
      />

      <FormField
        label="Address"
        name="address"
        type="text"
        required
      />

      <FormField
        label="Business Type"
        name="businessType"
        type="select"
        options={[
          { value: 'Manufacturing', label: 'Manufacturing' },
          { value: 'Trading', label: 'Trading' },
          { value: 'Services', label: 'Services' },
          { value: 'Construction', label: 'Construction' },
          { value: 'Real Estate', label: 'Real Estate' },
          { value: 'Others', label: 'Others' }
        ]}
        required
      />

      <FormField
        label="Gross Receipts"
        name="grossReceipts"
        type="number"
        required
      />

      <FormField
        label="Purpose"
        name="purpose"
        type="textarea"
        required
      />

      <FormField
        label="Amount"
        name="amount"
        type="number"
        required
      />

      <FormField
        label="Interest (%)"
        name="interest"
        type="number"
      />

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(false);
            setSelectedRecord(null);
          }}
          className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </Form>
  )}
</Formik> */
}
