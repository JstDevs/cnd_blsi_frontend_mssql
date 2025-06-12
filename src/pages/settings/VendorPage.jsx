import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { fetchVendors } from '../../features/settings/vendorSlice';
import VendorForm from './VendorForm';

function VendorPage() {
  const dispatch = useDispatch();
  const { vendors, isLoading } = useSelector(state => state.vendors);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  
  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);
  
  const handleAddVendor = () => {
    setCurrentVendor(null);
    setIsModalOpen(true);
  };
  
  const handleEditVendor = (vendor) => {
    setCurrentVendor(vendor);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentVendor(null);
  };
  
  // Table columns definition
  const columns = [
    {
      key: 'vendorCode',
      header: 'Code',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'vendorName',
      header: 'Vendor Name',
      sortable: true,
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
    },
    {
      key: 'contactPerson',
      header: 'Contact Person',
      sortable: true,
    },
    {
      key: 'contactNumber',
      header: 'Contact Number',
      sortable: true,
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
    },
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
  
  // Actions for table rows
  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditVendor,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Vendors</h1>
            <p>Manage vendor information and accreditation</p>
          </div>
          <button
            type="button"
            onClick={handleAddVendor}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Vendor
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={vendors}
          actions={actions}
          loading={isLoading}
        />
      </div>
      
      {/* Vendor Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentVendor ? "Edit Vendor" : "Add Vendor"}
        size="lg"
      >
        <VendorForm 
          initialData={currentVendor} 
          onClose={handleCloseModal} 
        />
      </Modal>
    </div>
  );
}

export default VendorPage;