import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import VendorDetailsForm from '../../components/forms/VendorDetailsForm';
import {
  fetchVendorDetails,
  addVendorDetails,
  updateVendorDetails,
  deleteVendorDetails,
} from '../../features/settings/vendorDetailsSlice';
import { fetchRegions } from '../../features/settings/regionsSlice';
import { fetchProvinces } from '../../features/settings/provincesSlice';
import { fetchMunicipalities } from '../../features/settings/municipalitiesSlice';
import { fetchBarangays } from '../../features/settings/barangaysSlice';
import { fetchVendorTypes } from '../../features/settings/vendorTypeSlice';
import { fetchIndustries } from '../../features/settings/industrySlice';
import { fetchTaxCodes } from '../../features/settings/taxCodeSlice';
import { fetchPaymentTerms } from '../../features/settings/paymentTermsSlice';
import { fetchModeOfPayments } from '../../features/settings/modeOfPaymentSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function VendorDetailsPage() {
  const dispatch = useDispatch();
  const { vendorDetails, isLoading } = useSelector(
    (state) => state.vendorDetails
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (Vendor Customer Type Page - MODULE ID = 91 )
  const { Add, Edit, Delete } = useModulePermissions(91);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVendorDetails, setCurrentVendorDetails] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vendorDetailsToDelete, setVendorDetailsToDelete] = useState(null);

  const { regions } = useSelector((state) => state.regions);
  const { provinces } = useSelector((state) => state.provinces);
  const { municipalities } = useSelector((state) => state.municipalities);
  const { barangays } = useSelector((state) => state.barangays);
  const { vendorTypes } = useSelector((state) => state.vendorTypes);
  const { industries } = useSelector((state) => state.industries);
  const { taxCodes } = useSelector((state) => state.taxCodes);
  const { paymentTerms } = useSelector((state) => state.paymentTerms);
  const { modeOfPayments } = useSelector((state) => state.modeOfPayments);

  useEffect(() => {
    dispatch(fetchVendorDetails());
    dispatch(fetchRegions());
    dispatch(fetchProvinces());
    dispatch(fetchMunicipalities());
    dispatch(fetchBarangays());
    dispatch(fetchVendorTypes());
    dispatch(fetchIndustries());
    dispatch(fetchTaxCodes());
    dispatch(fetchPaymentTerms());
    dispatch(fetchModeOfPayments());
  }, [dispatch]);

  const regionOptions = regions.map((r) => ({ value: r.ID, label: r.Name }));
  const provinceOptions = provinces.map((p) => ({
    value: p.ID,
    label: p.Name,
  }));
  const municipalityOptions = municipalities.map((m) => ({
    value: m.ID,
    label: m.Name,
  }));
  const barangayOptions = barangays.map((b) => ({
    value: b.ID,
    label: b.Name,
  }));
  const vendorTypeOptions = vendorTypes.map((v) => ({
    value: v.ID,
    label: v.Name,
  }));
  const industryOptions = industries.map((i) => ({
    value: i.ID,
    label: i.Name,
  }));
  const taxCodeOptions = taxCodes.map((t) => ({ value: t.ID, label: t.Code }));
  const paymentTermsOptions = paymentTerms.map((pt) => ({
    value: pt.ID,
    label: pt.Name,
  }));
  const modeOfPaymentOptions = modeOfPayments.map((mop) => ({
    value: mop.ID,
    label: mop.Name,
  }));

  const handleAdd = () => {
    setCurrentVendorDetails(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vendorDetails) => {
    setCurrentVendorDetails(vendorDetails);
    setIsModalOpen(true);
  };

  const handleDelete = (vendorDetails) => {
    setVendorDetailsToDelete(vendorDetails);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (vendorDetailsToDelete) {
      try {
        await dispatch(deleteVendorDetails(vendorDetailsToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setVendorDetailsToDelete(null);
        toast.success('Vendor details deleted successfully');
      } catch (error) {
        console.error('Failed to delete vendor details:', error);
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentVendorDetails) {
        await dispatch(
          updateVendorDetails({ ...values, ID: currentVendorDetails.ID })
        ).unwrap();
        toast.success('Vendor details updated successfully');
      } else {
        await dispatch(addVendorDetails(values)).unwrap();
        toast.success('Vendor details added successfully');
      }
      dispatch(fetchVendorDetails());
    } catch (error) {
      console.error('Failed to save vendor details:', error);
      toast.error('Failed to save vendor details. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const columns = [
    {
      key: 'Code',
      header: 'Code',
      sortable: true,
    },
    {
      key: 'Name',
      header: 'Vendor',
      sortable: true,
    },
    {
      key: 'PaymentTermsID',
      header: 'Payment Terms',
      sortable: true,
      render: (value) => {
        const terms = paymentTerms.find((t) => t.ID == value);
        return terms?.Name || 'N/A';
      },
    },
    // {
    //   key: 'PaymentMethodID',
    //   header: 'Payment Method ID',
    // },
    {
      key: 'PaymentMethodID',
      header: 'Payment Method',
      sortable: true,
      render: (value) => {
        const method = modeOfPayments.find((m) => m.ID == value);
        return method?.Name || 'N/A';
      },
    },
    {
      key: 'DeliveryLeadTime',
      header: 'Time (no. of Days)',
      sortable: true,
      render: (value) => value || '0',
    },
    {
      key: 'TIN',
      header: 'TIN',
      sortable: true,
    },
    {
      key: 'Vatable',
      header: 'Vatable',
      sortable: true,
      render: (value) => (value ? 'Yes' : 'No'),
    },
    {
      key: 'TaxCodeID',
      header: 'Tax Code',
      sortable: true,
      render: (value) => {
        const tax = taxCodes.find((t) => t.ID == value);
        return tax?.Code || 'N/A';
      },
    },
    {
      key: 'TypeID',
      header: 'Vendor Type',
      sortable: true,
      render: (value) => {
        const type = vendorTypes.find((t) => t.ID == value);
        return type?.Name || 'N/A';
      },
    },
    {
      key: 'IndustryTypeID',
      header: 'Industry Type',
      sortable: true,
      render: (value) => {
        const industry = industries.find((i) => i.ID == value);
        return industry?.Name || 'N/A';
      },
    },
    {
      key: 'ContactPerson',
      header: 'Contact Person',
      sortable: true,
    },
    {
      key: 'PhoneNumber',
      header: 'Phone Number',
      sortable: true,
    },
    {
      key: 'MobileNumber',
      header: 'Mobile Number',
      sortable: true,
    },
    {
      key: 'EmailAddress',
      header: 'Email Address',
      sortable: true,
    },
    {
      key: 'Website',
      header: 'Website',
      sortable: true,
      render: (value) => value || 'No website',
    },
    {
      key: 'StreetAddress',
      header: 'StreetAddress',
      sortable: true,
    },
    {
      key: 'BarangayID',
      header: 'Barangay',
      sortable: true,
      render: (value) => {
        const barangay = barangays.find((b) => b.ID == value);
        return barangay?.Name || 'N/A';
      },
    },
    {
      key: 'MunicipalityID',
      header: 'Municipality',
      sortable: true,
      render: (value) => {
        const municipality = municipalities.find((m) => m.ID == value);
        return municipality?.Name || 'N/A';
      },
    },
    {
      key: 'ProvinceID',
      header: 'Province',
      sortable: true,
      render: (value) => {
        const province = provinces.find((p) => p.ID == value);
        return province?.Name || 'N/A';
      },
    },
    {
      key: 'RegionID',
      header: 'Region',
      sortable: true,
      render: (value) => {
        const region = regions.find((r) => r.ID == value);
        return region?.Name || 'N/A';
      },
    },
    {
      key: 'ZIPCode',
      header: 'ZIPCode',
      sortable: true,
    },
  ];

  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDelete,
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <div>
            <h1>Vendor Details</h1>
            <p>Manage Vendor Details</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Vendor Details
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={vendorDetails}
          actions={actions}
          loading={isLoading}
          emptyMessage="No vendor details found. Click 'Add Vendor Details' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          currentVendorDetails ? 'Edit Vendor Details' : 'Add Vendor Details'
        }
      >
        <VendorDetailsForm
          initialData={currentVendorDetails}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          provinces={provinces}
          municipalities={municipalities}
          barangays={barangays}
          regionOptions={regionOptions}
          provinceOptions={provinceOptions}
          municipalityOptions={municipalityOptions}
          barangayOptions={barangayOptions}
          vendorTypeOptions={vendorTypeOptions}
          industryOptions={industryOptions}
          taxCodeOptions={taxCodeOptions}
          paymentTermsOptions={paymentTermsOptions}
          modeOfPaymentOptions={modeOfPaymentOptions}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="py-3">
          <p className="text-neutral-700">
            Are you sure you want to delete the vendor details "
            {vendorDetailsToDelete?.Name}"?
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
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
      </Modal>
    </div>
  );
}

export default VendorDetailsPage;
