import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import { regionSchema, provinceSchema, municipalitySchema, barangaySchema } from '../../utils/validationSchemas';

function LocationPage() {
  const [activeTab, setActiveTab] = useState('region');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  
  // Mock data for locations
  const mockData = {
    regions: [
      { id: 1, code: 'REG001', name: 'Region I', description: 'Ilocos Region', status: 'Active' },
      { id: 2, code: 'REG002', name: 'Region II', description: 'Cagayan Valley', status: 'Active' },
    ],
    provinces: [
      { id: 1, code: 'PRV001', name: 'Ilocos Norte', regionId: 1, regionName: 'Region I', status: 'Active' },
      { id: 2, code: 'PRV002', name: 'Ilocos Sur', regionId: 1, regionName: 'Region I', status: 'Active' },
    ],
    municipalities: [
      { id: 1, code: 'MUN001', name: 'Laoag City', provinceId: 1, provinceName: 'Ilocos Norte', status: 'Active' },
      { id: 2, code: 'MUN002', name: 'Batac City', provinceId: 1, provinceName: 'Ilocos Norte', status: 'Active' },
    ],
    barangays: [
      { id: 1, code: 'BRG001', name: 'Barangay 1', municipalityId: 1, municipalityName: 'Laoag City', status: 'Active' },
      { id: 2, code: 'BRG002', name: 'Barangay 2', municipalityId: 1, municipalityName: 'Laoag City', status: 'Active' },
    ],
  };

  // Get validation schema based on active tab
  const getValidationSchema = () => {
    switch (activeTab) {
      case 'region':
        return regionSchema;
      case 'province':
        return provinceSchema;
      case 'municipality':
        return municipalitySchema;
      case 'barangay':
        return barangaySchema;
      default:
        return regionSchema;
    }
  };

  // Get columns based on active tab
  const getColumns = () => {
    const baseColumns = [
      {
        key: 'code',
        header: 'Code',
        sortable: true,
        className: 'font-medium text-neutral-900',
      },
      {
        key: 'name',
        header: 'Name',
        sortable: true,
      },
    ];

    switch (activeTab) {
      case 'barangay':
        return [
          ...baseColumns,
          { key: 'municipalityName', header: 'Municipality', sortable: true },
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (value) => (
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                value === 'Active' ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-800'
              }`}>
                {value}
              </span>
            ),
          },
        ];
      case 'municipality':
        return [
          ...baseColumns,
          { key: 'provinceName', header: 'Province', sortable: true },
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (value) => (
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                value === 'Active' ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-800'
              }`}>
                {value}
              </span>
            ),
          },
        ];
      case 'province':
        return [
          ...baseColumns,
          { key: 'regionName', header: 'Region', sortable: true },
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (value) => (
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                value === 'Active' ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-800'
              }`}>
                {value}
              </span>
            ),
          },
        ];
      default:
        return [
          ...baseColumns,
          { key: 'description', header: 'Description', sortable: true },
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (value) => (
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                value === 'Active' ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-800'
              }`}>
                {value}
              </span>
            ),
          },
        ];
    }
  };

  // Get data based on active tab
  const getData = () => mockData[`${activeTab}s`] || [];

  // Actions for table rows
  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: (location) => handleEditLocation(location),
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: (location) => handleDeleteLocation(location),
      className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50'
    },
  ];

  const handleCreateLocation = () => {
    setCurrentLocation(null);
    setIsModalOpen(true);
  };

  const handleEditLocation = (location) => {
    setCurrentLocation(location);
    setIsModalOpen(true);
  };

  const handleDeleteLocation = (location) => {
    setLocationToDelete(location);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (locationToDelete) {
      // Handle delete logic here
      setIsDeleteModalOpen(false);
      setLocationToDelete(null);
    }
  };

  // Get form fields based on active tab
  const getFormFields = () => {
    const baseFields = (
      <>
        <FormField
          className='p-3 focus:outline-none'
          label="Code"
          name="code"
          type="text"
          required
          placeholder={`Enter ${activeTab} code`}
        />
        
        <FormField
          className='p-3 focus:outline-none'
          label="Name"
          name="name"
          type="text"
          required
          placeholder={`Enter ${activeTab} name`}
        />
      </>
    );

    switch (activeTab) {
      case 'region':
        return (
          <>
            {baseFields}
            <FormField
              className='p-3 focus:outline-none'
              label="Description"
              name="description"
              type="textarea"
              required
              placeholder="Enter region description"
              rows={3}
            />
          </>
        );
      case 'province':
        return (
          <>
            {baseFields}
            <FormField
              className='p-3 focus:outline-none'
              label="Region"
              name="regionId"
              type="select"
              required
              options={mockData.regions.map(region => ({
                value: region.id,
                label: region.name
              }))}
            />
          </>
        );
      case 'municipality':
        return (
          <>
            {baseFields}
            <FormField
              className='p-3 focus:outline-none'
              label="Province"
              name="provinceId"
              type="select"
              required
              options={mockData.provinces.map(province => ({
                value: province.id,
                label: province.name
              }))}
            />
          </>
        );
      case 'barangay':
        return (
          <>
            {baseFields}
            <FormField
              className='p-3 focus:outline-none'
              label="Municipality"
              name="municipalityId"
              type="select"
              required
              options={mockData.municipalities.map(municipality => ({
                value: municipality.id,
                label: municipality.name
              }))}
            />
          </>
        );
      default:
        return baseFields;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Locations</h1>
            <p>Manage regions, provinces, municipalities, and barangays</p>
          </div>
          <button
            type="button"
            onClick={handleCreateLocation}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </button>
        </div>
      </div>

      <div className="mb-6 border-b border-neutral-200">
        <nav className="-mb-px flex space-x-8">
          {['region', 'province', 'municipality', 'barangay'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}s
            </button>
          ))}
        </nav>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={getColumns()}
          data={getData()}
          actions={actions}
          pagination={true}
        />
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentLocation ? `Edit ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` : `New ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
      >
        <div className="p-4 space-y-4">
          {getFormFields()}
          
          <FormField
            className='p-3 focus:outline-none'
            label="Status"
            name="status"
            type="select"
            required
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
          />
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {currentLocation ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>
      
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="p-4">
          <p className="text-neutral-700">
            Are you sure you want to delete this {activeTab}?
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default LocationPage;