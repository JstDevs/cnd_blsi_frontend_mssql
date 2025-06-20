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

function LocationPage() {
  const [activeTab, setActiveTab] = useState('region');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  const dispatch = useDispatch();

  const { regions } = useSelector(state => state.regions);
  const { provinces } = useSelector(state => state.provinces);
  const { municipalities } = useSelector(state => state.municipalities);
  const { barangays } = useSelector(state => state.barangays);

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
        return provinces;
      case 'municipality':
        return municipalities;
      case 'barangay':
        return barangays;
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
      dispatch(getDeleteAction()(locationToDelete.ID));
      setIsDeleteModalOpen(false);
      setLocationToDelete(null);
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
        }
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
      const payload = currentLocation ? { ...currentLocation, ...values } : values;
      await dispatch(action(payload));
      setIsModalOpen(false);
      setSubmitting(false);
    },
  });

  const getFormFields = () => {
    const commonProps = {
      formik,
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      required: true,
    };

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
              options={regions.map(r => ({ value: r.ID, label: r.Name }))}
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
              options={provinces.map(p => ({ value: p.ID, label: p.Name }))}
              value={formik.values.ProvinceCode}
              error={formik.errors.ProvinceCode}
              touched={formik.touched.ProvinceCode}
              {...commonProps}
            />
            <FormField
              label="Region"
              name="RegionCode"
              type="select"
              options={regions.map(r => ({ value: r.ID, label: r.Name }))}
              value={formik.values.RegionCode}
              error={formik.errors.RegionCode}
              touched={formik.touched.RegionCode}
              {...commonProps}
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
              options={municipalities.map(m => ({ value: m.ID, label: m.Name }))}
              value={formik.values.MunicipalityCode}
              error={formik.errors.MunicipalityCode}
              touched={formik.touched.MunicipalityCode}
              {...commonProps}
            />
            <FormField
              label="Province"
              name="ProvinceCode"
              type="select"
              options={provinces.map(p => ({ value: p.ID, label: p.Name }))}
              value={formik.values.ProvinceCode}
              error={formik.errors.ProvinceCode}
              touched={formik.touched.ProvinceCode}
              {...commonProps}
            />
            <FormField
              label="Region"
              name="RegionCode"
              type="select"
              options={regions.map(r => ({ value: r.ID, label: r.Name }))}
              value={formik.values.RegionCode}
              error={formik.errors.RegionCode}
              touched={formik.touched.RegionCode}
              {...commonProps}
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
        title={currentLocation ? `Edit ${activeTab}` : `New ${activeTab}`}
      >
        <form onSubmit={formik.handleSubmit} className="p-4 space-y-4">
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
              {formik.isSubmitting ? 'Saving...' : currentLocation ? 'Update' : 'Save'}
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
