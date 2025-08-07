import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import {
  regionSchema,
  provinceSchema,
  municipalitySchema,
  barangaySchema,
} from '../../utils/validationSchemas';
import {
  fetchRegions,
  addRegion,
  updateRegion,
  deleteRegion,
} from '../../features/settings/regionsSlice';
import {
  fetchProvinces,
  addProvince,
  updateProvince,
  deleteProvince,
} from '../../features/settings/provincesSlice';
import {
  fetchMunicipalities,
  addMunicipality,
  updateMunicipality,
  deleteMunicipality,
} from '../../features/settings/municipalitiesSlice';
import {
  fetchBarangays,
  addBarangay,
  updateBarangay,
  deleteBarangay,
} from '../../features/settings/barangaysSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';
// Define module IDs for each location type
const locationModuleIds = {
  region: 71,
  province: 67,
  municipality: 61,
  barangay: 19,
};
function LocationPage() {
  const [activeTab, setActiveTab] = useState('region');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  const pluralLabels = {
    region: 'Regions',
    province: 'Provinces',
    municipality: 'Municipalities',
    barangay: 'Barangays',
  };

  const dispatch = useDispatch();

  const { regions } = useSelector((state) => state.regions);
  const { provinces } = useSelector((state) => state.provinces);
  const { municipalities } = useSelector((state) => state.municipalities);
  const { barangays } = useSelector((state) => state.barangays);

  useEffect(() => {
    dispatch(fetchRegions());
    dispatch(fetchProvinces());
    dispatch(fetchMunicipalities());
    dispatch(fetchBarangays());
  }, [dispatch]);

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
  // Get permissions for each location type
  const regionPermissions = useModulePermissions(locationModuleIds.region);
  const provincePermissions = useModulePermissions(locationModuleIds.province);
  const municipalityPermissions = useModulePermissions(
    locationModuleIds.municipality
  );
  const barangayPermissions = useModulePermissions(locationModuleIds.barangay);

  // Helper to get current permissions
  const getPermissions = () => {
    switch (activeTab) {
      case 'region':
        return regionPermissions;
      case 'province':
        return provincePermissions;
      case 'municipality':
        return municipalityPermissions;
      case 'barangay':
        return barangayPermissions;
      default:
        return { Add: false, Edit: false, Delete: false };
    }
  };

  const getColumns = () => {
    switch (activeTab) {
      case 'region':
        return [{ key: 'Name', header: 'Region', sortable: true }];
      case 'province':
        return [
          { key: 'RegionName', header: 'Region', sortable: true },
          { key: 'Name', header: 'Province', sortable: true },
        ];
      case 'municipality':
        return [
          { key: 'RegionName', header: 'Region', sortable: true },
          { key: 'ProvinceName', header: 'Province', sortable: true },
          { key: 'Name', header: 'Municipality', sortable: true },
        ];
      case 'barangay':
        return [
          { key: 'RegionName', header: 'Region', sortable: true },
          { key: 'ProvinceName', header: 'Province', sortable: true },
          { key: 'MunicipalityName', header: 'Municipality', sortable: true },
          { key: 'Name', header: 'Barangay', sortable: true },
        ];
      default:
        return [];
    }
  };

  const getData = () => {
    switch (activeTab) {
      case 'region':
        return regions;
      case 'province':
        return provinces.map((province) => ({
          ...province,
          RegionName: getNameFromCode(province.RegionCode, regions),
        }));
      case 'municipality':
        return municipalities.map((municipality) => ({
          ...municipality,
          RegionName: getNameFromCode(municipality.RegionCode, regions),
          ProvinceName: getNameFromCode(municipality.ProvinceCode, provinces),
        }));
      case 'barangay':
        return barangays.map((barangay) => ({
          ...barangay,
          RegionName: getNameFromCode(barangay.RegionCode, regions),
          ProvinceName: getNameFromCode(barangay.ProvinceCode, provinces),
          MunicipalityName: getNameFromCode(
            barangay.MunicipalityCode,
            municipalities
          ),
        }));
      default:
        return [];
    }
  };

  const getAddAction = () => {
    switch (activeTab) {
      case 'region':
        return addRegion;
      case 'province':
        return addProvince;
      case 'municipality':
        return addMunicipality;
      case 'barangay':
        return addBarangay;
      default:
        return null;
    }
  };

  const getUpdateAction = () => {
    switch (activeTab) {
      case 'region':
        return updateRegion;
      case 'province':
        return updateProvince;
      case 'municipality':
        return updateMunicipality;
      case 'barangay':
        return updateBarangay;
      default:
        return null;
    }
  };

  const getDeleteAction = () => {
    switch (activeTab) {
      case 'region':
        return deleteRegion;
      case 'province':
        return deleteProvince;
      case 'municipality':
        return deleteMunicipality;
      case 'barangay':
        return deleteBarangay;
      default:
        return null;
    }
  };

  const actions = [
    getPermissions().Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: (location) => handleEditLocation(location),
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    getPermissions().Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: (location) => handleDeleteLocation(location),
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
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

  const confirmDelete = async () => {
    try {
      if (locationToDelete) {
        await dispatch(getDeleteAction()(locationToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setLocationToDelete(null);
        toast.success('Location deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete location:', error);
      toast.error('Failed to delete location. Please try again.');
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      formik.resetForm({
        values: currentLocation || {
          Name: '',
          RegionCode: '',
          ProvinceCode: '',
          MunicipalityCode: '',
        },
      });
    }
  }, [isModalOpen, currentLocation]);

  const formik = useFormik({
    initialValues: currentLocation || {
      Name: '',
      RegionCode: '',
      ProvinceCode: '',
      MunicipalityCode: '',
    },
    enableReinitialize: true,
    validationSchema: getValidationSchema(),
    onSubmit: async (values, { setSubmitting }) => {
      const action = currentLocation ? getUpdateAction() : getAddAction();
      const payload = currentLocation
        ? { ...currentLocation, ...values }
        : values;
      try {
        await dispatch(action(payload)).unwrap();
        toast.success('Location saved successfully');
      } catch (error) {
        console.error('Failed to save location:', error);
        toast.error('Failed to save location. Please try again.');
      } finally {
        setIsModalOpen(false);
        setSubmitting(false);
      }
    },
  });

  // Helper function to get region/province name from code
  const getNameFromCode = (code, list) => {
    const item = list.find((item) => item.ID.toString() === code.toString());
    return item ? item.Name : '';
  };
  const getFormFields = () => {
    const commonProps = {
      formik,
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      required: true,
    };
    console.log('Active Tab:', activeTab);
    switch (activeTab) {
      case 'region':
        return (
          <FormField
            label="Region"
            name="Name"
            type="text"
            placeholder="Enter region name"
            value={formik.values.Name}
            error={formik.errors.Name}
            touched={formik.touched.Name}
            {...commonProps}
          />
        );
      case 'province':
        return (
          <>
            <FormField
              label="Province"
              name="Name"
              type="text"
              placeholder="Enter province name"
              value={formik.values.Name}
              error={formik.errors.Name}
              touched={formik.touched.Name}
              {...commonProps}
            />
            <FormField
              label="Region"
              name="RegionCode"
              type="select"
              options={regions.map((r) => ({ value: r.ID, label: r.Name }))}
              value={formik.values.RegionCode}
              error={formik.errors.RegionCode}
              touched={formik.touched.RegionCode}
              {...commonProps}
            />
          </>
        );
      case 'municipality':
        return (
          <>
            <FormField
              label="Municipality"
              name="Name"
              type="text"
              value={formik.values.Name}
              error={formik.errors.Name}
              touched={formik.touched.Name}
              placeholder="Enter municipality name"
              {...commonProps}
            />
            <FormField
              label="Province"
              name="ProvinceCode"
              type="select"
              options={provinces.map((p) => ({ value: p.ID, label: p.Name }))}
              value={formik.values.ProvinceCode}
              error={formik.errors.ProvinceCode}
              touched={formik.touched.ProvinceCode}
              onChange={(e) => {
                const provinceCode = e.target.value;
                const selectedProvince = provinces.find(
                  (p) => p.ID.toString() === provinceCode.toString()
                );

                formik.setFieldValue('ProvinceCode', provinceCode);
                if (selectedProvince) {
                  formik.setFieldValue(
                    'RegionCode',
                    selectedProvince.RegionCode
                  );
                }
              }}
              onBlur={formik.handleBlur} // Explicitly set here
              required={true} // Explicitly set here
            />
            <FormField
              label="Region"
              name="RegionCode"
              type="text"
              value={getNameFromCode(formik.values.RegionCode, regions)}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </>
        );
      case 'barangay':
        return (
          <>
            <FormField
              label="Barangay"
              name="Name"
              type="text"
              value={formik.values.Name}
              error={formik.errors.Name}
              touched={formik.touched.Name}
              placeholder="Enter barangay name"
              {...commonProps}
            />
            <FormField
              label="Municipality"
              name="MunicipalityCode"
              type="select"
              options={municipalities.map((m) => ({
                value: m.ID,
                label: m.Name,
              }))}
              value={formik.values.MunicipalityCode}
              error={formik.errors.MunicipalityCode}
              touched={formik.touched.MunicipalityCode}
              onChange={(e) => {
                const municipalityCode = e.target.value;
                const selectedMunicipality = municipalities.find(
                  (m) => m.ID.toString() === municipalityCode.toString()
                );

                formik.setFieldValue('MunicipalityCode', municipalityCode);
                if (selectedMunicipality) {
                  formik.setFieldValue(
                    'ProvinceCode',
                    selectedMunicipality.ProvinceCode
                  );
                  formik.setFieldValue(
                    'RegionCode',
                    selectedMunicipality.RegionCode
                  );
                }
              }}
              onBlur={formik.handleBlur}
              required={true}
            />
            <FormField
              label="Province"
              name="ProvinceCode"
              type="text"
              value={getNameFromCode(formik.values.ProvinceCode, provinces)}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
            <FormField
              label="Region"
              name="RegionCode"
              type="text"
              value={getNameFromCode(formik.values.RegionCode, regions)}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <div>
            <h1>Locations</h1>
            <p>Manage regions, provinces, municipalities, and barangays</p>
          </div>
          {getPermissions().Add && (
            <button
              type="button"
              onClick={handleCreateLocation}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          )}
        </div>
      </div>

      <div className="flex mb-6 border-b border-neutral-200">
        <nav className="-mb-px flex flex-wrap gap-x-10 gap-y-0">
          {['region', 'province', 'municipality', 'barangay'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              {pluralLabels[tab]}
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
        title={currentLocation ? `Edit ${activeTab}` : `New ${activeTab}`}
      >
        <form onSubmit={formik.handleSubmit} className="sm:p-4 space-y-4">
          {getFormFields()}
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
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting
                ? 'Saving...'
                : currentLocation
                ? 'Update'
                : 'Save'}
            </button>
          </div>
        </form>
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
