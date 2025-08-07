import { useState } from 'react';
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

// Add sample data (will be used if Redux state is empty)
const sampleProperties = [
  {
    id: 1,
    tdNo: 'TD-001',
    owner: 'John Doe',
    address: '123 Main St',
    beneficialUser: 'Jane Doe',
    beneficialAddress: '456 Oak St',
    octTctCloaNo: 'OCT-123',
    cct: 'CCT-456',
    dated: '2024-03-20',
    propertyIdentificationNo: '12345',
    tin: '123-456-789',
    ownerTelephoneNo: '1234567890',
    beneficialTin: '987-654-321',
    beneficialTelephoneNo: '0987654321',
    surveyNo: 'S-001',
    lotNo: 'L-001',
    blockNo: 'B-001',
    boundaries: {
      taxable: true,
      north: 'Street A',
      south: 'Street B',
      east: 'Street C',
      west: 'Street D',
    },
    cancelledTdNo: 'TD-000',
    cancelledOwner: 'Previous Owner',
    effectivityOfAssessment: '2024-01-01',
    previousOwner: 'Previous Owner',
    previousAssessedValue: '1000000',
    propertyDetails: {
      kind: 'Land',
      numberOf: '1',
      description: 'Residential lot',
    },
    assessmentDetails: {
      kind: 'Land',
      actualUse: 'Residential',
      classification: 'Class 1',
      areaSize: 'Medium',
      assessmentLevel: '20%',
      marketValue: '1500000',
    },
    status: 'Active',
  },
  {
    id: 2,
    tdNo: 'TD-002',
    owner: 'Maria Santos',
    address: '456 Pine St',
    beneficialUser: 'Carlos Santos',
    beneficialAddress: '456 Pine St',
    octTctCloaNo: 'OCT-456',
    cct: 'CCT-789',
    dated: '2024-02-15',
    propertyIdentificationNo: '67890',
    tin: '456-789-012',
    ownerTelephoneNo: '9876543210',
    beneficialTin: '456-789-012',
    beneficialTelephoneNo: '9876543210',
    surveyNo: 'S-002',
    lotNo: 'L-002',
    blockNo: 'B-002',
    boundaries: {
      taxable: true,
      north: 'Street E',
      south: 'Street F',
      east: 'Street G',
      west: 'Street H',
    },
    cancelledTdNo: '',
    cancelledOwner: '',
    effectivityOfAssessment: '2024-01-01',
    previousOwner: '',
    previousAssessedValue: '0',
    propertyDetails: {
      kind: 'Land',
      numberOf: '1',
      description: 'Commercial lot',
    },
    assessmentDetails: {
      kind: 'Land',
      actualUse: 'Commercial',
      classification: 'Class 2',
      areaSize: 'Large',
      assessmentLevel: '30%',
      marketValue: '2500000',
    },
    status: 'Active',
  },
];

function RealPropertyTaxPage() {
  const dispatch = useDispatch();
  const { realPropertyTaxes: reduxProperties, isLoading } = useSelector(
    (state) => state.realPropertyTax
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (RealPropertyTaxPage - MODULE ID =  70 )
  const { Add, Edit } = useModulePermissions(70);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'details'
  const [currentProperty, setCurrentProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Use sample data if Redux state is empty
  const properties =
    reduxProperties && reduxProperties.length > 0
      ? reduxProperties
      : sampleProperties;

  const handleCreateProperty = () => {
    setCurrentProperty(null);
    setCurrentView('form');
  };

  const handleViewProperty = (property) => {
    setCurrentProperty(property);
    setCurrentView('details');
  };

  const handleEditProperty = (property) => {
    setCurrentProperty(property);
    setCurrentView('form');
  };

  const handlePrintProperty = (property) => {
    // Implement print functionality
    console.log('Print property:', property);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setCurrentProperty(null);
  };

  // Filter properties based on search term
  const filteredProperties = properties?.filter((prop) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      prop.tdNo.toLowerCase().includes(searchLower) ||
      prop.owner.toLowerCase().includes(searchLower) ||
      prop.address.toLowerCase().includes(searchLower) ||
      prop.propertyIdentificationNo.toLowerCase().includes(searchLower)
    );
  });

  // Table columns definition
  const columns = [
    {
      key: 'tdNo',
      header: 'TD No.',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'owner',
      header: 'Owner',
      sortable: true,
    },
    {
      key: 'address',
      header: 'Address',
      sortable: true,
    },
    {
      key: 'propertyIdentificationNo',
      header: 'Property ID',
      sortable: true,
    },
    {
      key: 'dated',
      header: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => renderStatusBadge(value),
    },
  ];

  // Helper function for status badges
  const renderStatusBadge = (value) => {
    let bgColor = 'bg-neutral-100 text-neutral-800';

    switch (value) {
      case 'Active':
        bgColor = 'bg-success-100 text-success-800';
        break;
      case 'Inactive':
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

  const actions = [
    {
      icon: EyeIcon,
      title: 'View',
      onClick: handleViewProperty,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditProperty,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
  ];

  return (
    <>
      {currentView === 'list' && (
        <>
          <div className="flex justify-between items-center max-sm:flex-wrap gap-4 mb-6 page-header">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Real Property Tax Records
              </h1>
              <p className="text-gray-600">
                Manage real property tax assessments
              </p>
            </div>
            {Add && (
              <button
                type="button"
                onClick={handleCreateProperty}
                className="btn btn-primary max-sm:w-full"
              >
                <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                New Property
              </button>
            )}
          </div>

          <DataTable
            columns={columns}
            data={filteredProperties}
            actions={actions}
            loading={isLoading}
            onRowClick={handleViewProperty}
          />
        </>
      )}

      {currentView === 'form' && (
        <div>
          <div className="flex justify-between items-center mb-6">
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
                    ? 'Edit Real Property Tax Record'
                    : 'Create New Real Property Tax Record'}
                </h1>
                <p className="text-gray-600">
                  {currentProperty
                    ? 'Update the property details'
                    : 'Fill out the form to create a new property record'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
            <RealPropertyTaxForm
              initialData={currentProperty}
              onCancel={handleBackToList}
              onSubmitSuccess={handleBackToList}
            />
          </div>
        </div>
      )}

      {currentView === 'details' && currentProperty && (
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
                  Property Details
                </h1>
                <p className="text-gray-600">
                  View and manage property tax details
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleEditProperty(currentProperty)}
                className="btn btn-primary flex items-center"
              >
                <PencilIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handlePrintProperty(currentProperty)}
                className="btn btn-outline flex items-center"
              >
                <PrinterIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Print
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
            <RealPropertyTaxForm
              initialData={currentProperty}
              readOnly={true}
              onBack={handleBackToList}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default RealPropertyTaxPage;
