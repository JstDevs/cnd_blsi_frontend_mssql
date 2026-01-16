// BusinessPermitForm.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import BusinessPermitFormFields from './BusinessPermitFormFields';
import { useModulePermissions } from '@/utils/useModulePremission';
import {
  fetchBusinessPermits,
  addBusinessPermit,
  updateBusinessPermit,
  deleteBusinessPermit,
  approveBusinessPermit,
  rejectBusinessPermit,
} from '../../features/applications/businessPermitSlice';
import { toast } from 'react-hot-toast';

function BusinessPermitPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPermit, setCurrentPermit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // ---------------------USE MODULE PERMISSIONS------------------START (BusinessPermitPage - MODULE ID = 29 )
  const { Add, Edit, Delete } = useModulePermissions(29);
  const dispatch = useDispatch();
  const { records: permits, isLoading } = useSelector(
    (state) => state.businessPermits // Note: Slice name is 'businessPermit' singular in store usually? Let me verify slice name.
  );

  useEffect(() => {
    dispatch(fetchBusinessPermits());
  }, [dispatch]);

  const INITIAL_FORM_DATA = {
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
    status: 'Requested',
    attachments: [],
    // Default values for fields to prevent uncontrolled input errors
    businessArea: '',
    totalEmployees: '',
    employeesResidingWithLgli: '',
    lessorFullName: '',
    lessorAddress: '',
    lessorContactNumber: '',
    lessorEmail: '',
    monthlyRental: '',
    lineOfBusiness: '',
    numberOfUnits: '',
    capitalization: '',
    grossSales: '',
    emergencyContactPerson: '',
    emergencyContactNumber: '',
    emergencyContactEmail: '',
    ownerPostalCode: '',
    ownerEmailAddress: '',
    ownerTelephoneNo: '',
    ownerMobileNo: '',
  };

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const columns = [
    {
      key: 'applicantType',
      header: 'Applicant Type',
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
    {
      key: 'modeOfPayment',
      header: 'Mode of Payment',
      sortable: true,
    },
    {
      key: 'dateOfApplication', // Fixed key
      header: 'Application Date',
      sortable: true,
    },
    {
      key: 'dtiSecCdaRegistrationNo', // Fixed key
      header: 'DTI/SEC/CDA Registration',
      sortable: true,
    },
  ];

  const actions = (row) => {
    const list = [
      {
        icon: EyeIcon,
        title: 'View',
        onClick: (permit) => handleViewPermit(permit),
      }
    ];

    const normalizedStatus = (row.status || row.Status || '').toString().trim();
    if (normalizedStatus === 'Requested') {
      list.push(
        {
          icon: CheckIcon,
          title: 'Approve',
          onClick: (permit) => handleApprove(permit),
          className: 'text-success-600 hover:text-success-900',
        },
        {
          icon: XMarkIcon,
          title: 'Reject',
          onClick: (permit) => handleReject(permit),
          className: 'text-error-600 hover:text-error-900',
        }
      );
    }

    if (Edit) {
      list.push({
        icon: PencilIcon,
        title: 'Edit',
        onClick: (permit) => handleEditPermit(permit),
      });
    }

    if (Delete) {
      list.push({
        icon: TrashIcon,
        title: 'Delete',
        onClick: (permit) => handleDeletePermit(permit),
      });
    }

    return list;
  };

  const handleInputChange = (field, value) => {
    // Check if the value is an event object (has target.value)
    // If so, extract the value. Otherwise, use the value directly.
    const finalValue = value?.target ? value.target.value : value;
    setFormData((prev) => ({ ...prev, [field]: finalValue }));
  };

  const handleCreatePermit = () => {
    setCurrentPermit(null);
    setFormData(INITIAL_FORM_DATA);
    setIsModalOpen(true);
  };

  const handleViewPermit = (permit) => {
    setCurrentPermit(permit);
    setFormData({
      ...INITIAL_FORM_DATA,
      ...permit,
      attachments: permit.attachments || [],
    });
    setIsModalOpen(true);
  };

  const handleEditPermit = (permit) => {
    setCurrentPermit(permit);
    setFormData({
      ...INITIAL_FORM_DATA,
      ...permit,
      attachments: permit.attachments || [],
    });
    setIsModalOpen(true);
  };

  const handleDeletePermit = (permit) => {
    if (window.confirm('Are you sure you want to delete this permit?')) {
      dispatch(deleteBusinessPermit(permit.id))
        .unwrap()
        .then(() => {
          toast.success("Business permit deleted");
        })
        .catch((err) => {
          toast.error(`Failed to delete: ${err}`);
        })
    }
  };

  const handleApprove = async (permit) => {
    if (window.confirm('Are you sure you want to approve this business permit?')) {
      try {
        await dispatch(approveBusinessPermit(permit.id)).unwrap();
        toast.success('Business permit approved and posted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to approve');
      }
    }
  };

  const handleReject = async (permit) => {
    const reason = window.prompt('Please enter the reason for rejection:');
    if (reason !== null) {
      try {
        await dispatch(rejectBusinessPermit({ id: permit.id, reason })).unwrap();
        toast.success('Business permit rejected successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to reject');
      }
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
    console.log('Saving form data:', formData);

    if (currentPermit) {
      // Update existing
      dispatch(updateBusinessPermit({ id: currentPermit.id, data: formData }))
        .unwrap()
        .then(() => {
          toast.success('Business permit updated');
          setIsModalOpen(false);
        })
        .catch(err => {
          toast.error(`Failed to update: ${err}`);
        });
    } else {
      // Create new
      const dataToSave = {
        ...formData,
        status: 'Requested' // Explicitly set initial status
      };

      dispatch(addBusinessPermit(dataToSave))
        .unwrap()
        .then(() => {
          toast.success('Business permit created');
          setIsModalOpen(false);
        })
        .catch(err => {
          toast.error(`Failed to create: ${err}`);
        });
    }
  };

  const filteredPermits = Array.isArray(permits) ? permits.filter(
    (permit) =>
      (permit.businessName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (permit.ownerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (permit.dtiSecCdaRegistrationNo || '').includes(searchTerm)
  ) : [];

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
