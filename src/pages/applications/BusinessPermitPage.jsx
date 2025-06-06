import { useState } from 'react';
import { PlusIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';

function BusinessPermitPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPermit, setCurrentPermit] = useState(null);
  
  // Mock data for table
  const permits = [
    {
      id: 1,
      permitNumber: 'BP-2024-01-0001',
      businessName: 'ABC Store',
      ownerName: 'John Smith',
      businessType: 'Retail',
      address: '123 Main St.',
      status: 'Active',
      issueDate: '2024-01-15',
      expiryDate: '2024-12-31',
    },
    {
      id: 2,
      permitNumber: 'BP-2024-01-0002',
      businessName: 'XYZ Restaurant',
      ownerName: 'Jane Doe',
      businessType: 'Food Service',
      address: '456 Market St.',
      status: 'Pending',
      issueDate: null,
      expiryDate: null,
    },
  ];
  
  // Table columns
  const columns = [
    {
      key: 'permitNumber',
      header: 'Permit No.',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'businessName',
      header: 'Business Name',
      sortable: true,
    },
    {
      key: 'ownerName',
      header: 'Owner',
      sortable: true,
    },
    {
      key: 'businessType',
      header: 'Type',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'Active' ? 'bg-success-100 text-success-800' : 
          value === 'Pending' ? 'bg-warning-100 text-warning-800' : 
          'bg-neutral-100 text-neutral-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'issueDate',
      header: 'Issue Date',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
    {
      key: 'expiryDate',
      header: 'Expiry Date',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
  ];
  
  // Actions for table rows
  const actions = [
    {
      icon: EyeIcon,
      title: 'View',
      onClick: (permit) => handleViewPermit(permit),
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: (permit) => handleEditPermit(permit),
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
  ];
  
  const handleCreatePermit = () => {
    setCurrentPermit(null);
    setIsModalOpen(true);
  };
  
  const handleViewPermit = (permit) => {
    setCurrentPermit(permit);
    setIsModalOpen(true);
  };
  
  const handleEditPermit = (permit) => {
    setCurrentPermit(permit);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Business Permits</h1>
            <p>Manage business permits and licenses</p>
          </div>
          <button
            type="button"
            onClick={handleCreatePermit}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Permit
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={permits}
          actions={actions}
          pagination={true}
        />
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPermit ? "Edit Business Permit" : "New Business Permit"}
        size="lg"
      >
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Business Name"
              name="businessName"
              type="text"
              required
              placeholder="Enter business name"
            />
            
            <FormField
              label="Owner Name"
              name="ownerName"
              type="text"
              required
              placeholder="Enter owner name"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Business Type"
              name="businessType"
              type="select"
              required
              options={[
                { value: 'Retail', label: 'Retail' },
                { value: 'Food Service', label: 'Food Service' },
                { value: 'Professional Service', label: 'Professional Service' },
                { value: 'Manufacturing', label: 'Manufacturing' },
              ]}
            />
            
            <FormField
              label="Status"
              name="status"
              type="select"
              required
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Expired', label: 'Expired' },
              ]}
            />
          </div>
          
          <FormField
            label="Business Address"
            name="address"
            type="textarea"
            required
            placeholder="Enter complete business address"
            rows={2}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Issue Date"
              name="issueDate"
              type="date"
            />
            
            <FormField
              label="Expiry Date"
              name="expiryDate"
              type="date"
            />
          </div>
          
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
              {currentPermit ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BusinessPermitPage;