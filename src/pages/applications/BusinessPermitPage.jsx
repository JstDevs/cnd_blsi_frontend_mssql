// BusinessPermitForm.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import BusinessPermitFormFields from './BusinessPermitFormFields';
import { useModulePermissions } from '@/utils/useModulePremission';
// import {
//   fetchBusinessPermits,
//   addBusinessPermit,
//   updateBusinessPermit,
//   deleteBusinessPermit,
// } from '../../features/applications/businessPermitSlice';
import { toast } from 'react-hot-toast';

function BusinessPermitPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPermit, setCurrentPermit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // ---------------------USE MODULE PERMISSIONS------------------START (BusinessPermitPage - MODULE ID = 29 )
  const { Add, Edit, Delete } = useModulePermissions(29);
  // const dispatch = useDispatch();
  // const { records: permits, isLoading } = useSelector(
  //   (state) => state.businessPermits
  // );

  // useEffect(() => {
  //   dispatch(fetchBusinessPermits());
  // }, [dispatch]);

  const permits = [
    {
      id: 1,
      applicantType: 'Renewal',
      modeOfPayment: 'Annually',
      applicationDate: '1/13/2025',
      dtiSecCdaRegistration: '21447756',
      dtiRegistrationDate: '1/13/2025',
      businessName: 'ABC Store',
      ownerName: 'John Smith',
      status: 'Posted',
    },
    {
      id: 2,
      applicantType: 'New',
      modeOfPayment: 'Semi-Annually',
      applicationDate: '1/14/2025',
      dtiSecCdaRegistration: '21447757',
      dtiRegistrationDate: '1/14/2025',
      businessName: 'XYZ Restaurant',
      ownerName: 'Jane Doe',
      status: 'Requested',
    },
  ];

  const [formData, setFormData] = useState({
    applicantType: 'new',
    modeOfPayment: 'annually',
    dateOfApplication: '',
    dtiSecCdaRegistrationNo: '',
    dtiSecCdaRegistrationDate: '',
    tinNo: '',
    typeOfBusiness: 'single',
    amendmentFrom: 'single',
    amendmentTo: 'single',
    taxIncentiveFromGovEntity: 'no',
    lastName: '',
    firstName: '',
    middleName: '',
    businessName: '',
    tradeNameFranchise: '',
    businessRegion: '',
    businessProvince: '',
    businessMunicipality: '',
    businessBarangay: '',
    businessStreetAddress: '',
    postalCode: '',
    emailAddress: '',
    telephoneNo: '',
    mobileNo: '',
    ownerStreetAddress: '',
    ownerBarangay: '',
    ownerMunicipality: '',
    ownerRegion: '',
    status: 'Pending',
    attachments: [],
  });

  const columns = [
    {
      key: 'applicantType',
      header: 'Applicant Type',
      sortable: true,
    },
    {
      key: 'modeOfPayment',
      header: 'Mode of Payment',
      sortable: true,
    },
    {
      key: 'applicationDate',
      header: 'Application Date',
      sortable: true,
    },
    {
      key: 'dtiSecCdaRegistration',
      header: 'DTI/SEC/CDA Registration',
      sortable: true,
    },
    {
      key: 'status',
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
  ];

  const actions = [
    {
      icon: EyeIcon,
      title: 'View',
      onClick: (permit) => handleViewPermit(permit),
    },
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: (permit) => handleEditPermit(permit),
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: (permit) => handleDeletePermit(permit),
    },
  ];

  const handleInputChange = (field, value) => {
    // Check if the value is an event object (has target.value)
    // If so, extract the value. Otherwise, use the value directly.
    const finalValue = value?.target ? value.target.value : value;
    setFormData((prev) => ({ ...prev, [field]: finalValue }));
  };

  const handleCreatePermit = () => {
    setCurrentPermit(null);
    setFormData({
      applicantType: 'new',
      modeOfPayment: 'annually',
      dateOfApplication: '',
      dtiSecCdaRegistrationNo: '',
      dtiSecCdaRegistrationDate: '',
      tinNo: '',
      typeOfBusiness: 'single',
      amendmentFrom: 'single',
      amendmentTo: 'single',
      taxIncentiveFromGovEntity: 'no',
      lastName: '',
      firstName: '',
      middleName: '',
      businessName: '',
      tradeNameFranchise: '',
      businessRegion: '',
      businessProvince: '',
      businessMunicipality: '',
      businessBarangay: '',
      businessStreetAddress: '',
      postalCode: '',
      emailAddress: '',
      telephoneNo: '',
      mobileNo: '',
      ownerStreetAddress: '',
      ownerBarangay: '',
      ownerMunicipality: '',
      ownerRegion: '',
      status: 'Pending',
      attachments: [],
    });
    setIsModalOpen(true);
  };

  const handleViewPermit = (permit) => {
    setCurrentPermit(permit);
    setIsModalOpen(true);
  };
  const handleEditPermit = (permit) => {
    setCurrentPermit(permit);
    setFormData({
      ...permit,
      // Ensure attachments is an array if it comes back as null/undefined
      attachments: permit.attachments || [],
    });
    setIsModalOpen(true);
  };

  const handleDeletePermit = (permit) => {
    if (window.confirm('Are you sure you want to delete this permit?')) {
      /*
      dispatch(deleteBusinessPermit(permit.id))
        .unwrap()
        .then(() => {
          toast.success('Business permit deleted successfully');
        })
        .catch((error) => {
          toast.error(`Failed to delete permit: ${error}`);
        });
        */
      console.log("Deleting permit", permit);
      toast.success("Permit deleted (Mock)");
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...files],
    }));
  };

  const handleRemoveAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    // Basic validation
    // if (!formData.businessName) {
    //   toast.error('Business Name is required');
    //   return;
    // }

    // Prepare payload
    // If we have attachments, we might need a FormData object.
    // If the slice handles FormData checking, we can just pass the object if no files, or FormData if files.
    // However, usually for mixed content (fields + files), we use FormData.
    // Let's assume we use FormData if there are new attachments or just JSON if simpler.
    // But slice implementation handles JSON vs FormData. For safety with files, let's build FormData.

    // For this example, let's assume the API handles JSON correctly if we don't need real file upload yet, 
    // OR we just dispatch the object and let the slice/thunk handle serialization if needed.
    // But since we added file upload logic, let's assume we want to send it proper.
    // Since the user just wants it to "save" and we saw Object Object, let's just make it work with the object first unless files are added.

    /*
      const action = currentPermit
        ? updateBusinessPermit({ id: currentPermit.id, data: formData })
        : addBusinessPermit(formData);
  
      dispatch(action)
        .unwrap()
        .then(() => {
          toast.success(
            currentPermit
              ? 'Business permit updated successfully'
              : 'Business permit created successfully'
          );
          setIsModalOpen(false);
        })
        .catch((error) => {
          toast.error(`Failed to save permit: ${error}`);
        });
        */
    console.log('Saving form data:', formData);
    toast.success('Form saved (Mock)');
    setIsModalOpen(false);
  };

  const filteredPermits = permits.filter(
    (permit) =>
      permit.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.dtiSecCdaRegistration.includes(searchTerm)
  );

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1>Business Permit Applications</h1>
            <p>Manage the applications for business permits.</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleCreatePermit}
              className="btn btn-primary max-sm:w-full "
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Business Permit
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Search applications..."
            />
          </div>
          <DataTable
            columns={columns}
            data={filteredPermits}
            actions={actions}
            pagination={true}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          currentPermit
            ? 'Edit Business Permit'
            : 'New Business Permit'
        }
        size="xl"
      >
        <BusinessPermitFormFields
          formData={formData}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
          isEdit={!!currentPermit}
          handleFileUpload={handleFileUpload}
          handleRemoveAttachment={handleRemoveAttachment}
        />
      </Modal>
    </div>
  );
}

export default BusinessPermitPage;
