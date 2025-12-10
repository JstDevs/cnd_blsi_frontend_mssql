// BusinessPermitForm.js
import { useState } from 'react';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import BusinessPermitFormFields from './BusinessPermitFormFields';
import { useModulePermissions } from '@/utils/useModulePremission';

function BusinessPermitPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPermit, setCurrentPermit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // ---------------------USE MODULE PERMISSIONS------------------START (BusinessPermitPage - MODULE ID = 29 )
  const { Add, Edit, Delete } = useModulePermissions(29);
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
      status: 'Active',
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
      status: 'Pending',
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
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value === 'Active'
              ? 'bg-success-100 text-success-800'
              : 'bg-warning-100 text-warning-800'
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
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    });
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

  const handleDeletePermit = (permit) => {
    // if (window.confirm('Are you sure you want to delete this permit?')) {
    console.log('Deleting permit:', permit);
    // }
  };

  const handleSave = () => {
    console.log('Saving form data:', formData);
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
            <p>Manage business permit applications and registrations</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleCreatePermit}
              className="btn btn-primary max-sm:w-full "
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Application
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
            ? 'Edit Business Application'
            : 'New Business Application'
        }
        size="xl"
      >
        <BusinessPermitFormFields
          formData={formData}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
          isEdit={!!currentPermit}
        />
      </Modal>
    </div>
  );
}

export default BusinessPermitPage;
