import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import TaxDeclarationForm from '../../components/forms/TaxDeclarationForm';
import {
  fetchTaxDeclarations,
  addTaxDeclaration,
  updateTaxDeclaration,
  deleteTaxDeclaration,
} from '../../features/settings/taxDeclarationSlice';
import FormField from '@/components/common/FormField';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';
import { fetchGeneralRevisions } from '@/features/settings/generalRevisionSlice';

function TaxDeclarationPage() {
  const dispatch = useDispatch();
  const { taxDeclarations, isLoading } = useSelector(
    (state) => state.taxDeclarations
  );
  const { generalRevisions, isLoading: isLoadingGeneralRevisions } =
    useSelector((state) => state.generalRevisions);
  // ---------------------USE MODULE PERMISSIONS------------------START ( Tax Declaration Page  - MODULE ID = 79 )
  const { Add, Edit, Delete } = useModulePermissions(79);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTaxDeclaration, setCurrentTaxDeclaration] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taxDeclarationToDelete, setTaxDeclarationToDelete] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  useEffect(() => {
    dispatch(fetchTaxDeclarations());
    dispatch(fetchGeneralRevisions());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentTaxDeclaration(null);
    setIsModalOpen(true);
  };

  const handleEdit = (taxDeclaration) => {
    if (!selectedYear)
      return toast.error('Please select a general revision year first.');
    setCurrentTaxDeclaration(taxDeclaration);
    setIsModalOpen(true);
  };

  const handleDelete = (taxDeclaration) => {
    setTaxDeclarationToDelete(taxDeclaration);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (taxDeclarationToDelete) {
      try {
        await dispatch(
          deleteTaxDeclaration(taxDeclarationToDelete.ID)
        ).unwrap();
        setIsDeleteModalOpen(false);
        setTaxDeclarationToDelete(null);
      } catch (error) {
        console.error('Failed to delete tax declaration:', error);
      }
    }
  };

  const handleSubmit = async (values) => {
    const GeneralRevisions = generalRevisions?.find(
      (rev) => rev.ID === Number(selectedYear)
    );
    try {
      if (currentTaxDeclaration) {
        await dispatch(
          updateTaxDeclaration({
            ...values,
            ID: currentTaxDeclaration.ID,
            GeneralRevision: GeneralRevisions?.General_Revision_Date_Year,
          })
        ).unwrap();
        toast.success('Tax declaration updated successfully');
      } else {
        await dispatch(
          addTaxDeclaration({
            ...values,
            GeneralRevision: GeneralRevisions?.General_Revision_Date_Year,
          })
        ).unwrap();
        toast.success('Tax declaration saved successfully');
      }
      dispatch(fetchTaxDeclarations());
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save tax declaration:', error);
      toast.error('Failed to save tax declaration. Please try again.');
    }
  };

  const columns = [
    {
      key: 'T_D_No',
      header: 'Tax Declaration No.',
      sortable: true,
    },
    {
      key: 'PropertyID',
      header: 'Property ID',
      sortable: true,
    },
    {
      key: 'OwnerID',
      header: 'Owner ID',
      sortable: true,
    },
    {
      key: 'OwnerTIN',
      header: 'Owner TIN',
      sortable: true,
    },
    {
      key: 'OwnerAddress',
      header: 'Owner Address',
      sortable: true,
    },
    {
      key: 'OwnerTelephoneNumber',
      header: 'Owner Telephone No.',
      sortable: true,
    },
    {
      key: 'BeneficialorAdminUserID',
      header: 'Beneficial/Administrator User',
      sortable: true,
    },
    {
      key: 'BeneficialorAdminTIN',
      header: 'Beneficial/Administrator TIN',
      sortable: true,
    },
    {
      key: 'BeneficialorAdminAddress',
      header: 'Beneficial/Administrator Address',
      sortable: true,
    },
    {
      key: 'BeneficialorAdminTelephoneNumber',
      header: 'Beneficial/Administrator Telephone No.',
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
  const generalRevisionsOptions = generalRevisions?.map((revision) => ({
    value: revision.ID,
    label: revision.General_Revision_Date_Year,
  }));
  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1>Tax Declarations</h1>
            <p>Manage Tax Declarations</p>
          </div>
          <div className="flex gap-4 items-center max-sm:flex-col max-sm:w-full">
            {Add && (
              <button
                type="button"
                onClick={handleAdd}
                className="btn btn-primary max-sm:w-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedYear === ''}
              >
                <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Add Tax Declaration
              </button>
            )}
            <div className="max-sm:w-full">
              <FormField
                type="select"
                name="year"
                label="General Revision Year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                placeholder="Select a year"
                options={generalRevisionsOptions}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={taxDeclarations}
          actions={actions}
          loading={isLoading || isLoadingGeneralRevisions}
          emptyMessage="No tax declarations found. Click 'Add Tax Declaration' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        size="xl"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          currentTaxDeclaration ? 'Edit Tax Declaration' : 'Add Tax Declaration'
        }
      >
        <TaxDeclarationForm
          initialData={currentTaxDeclaration}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
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
            Are you sure you want to delete the tax declaration "
            {taxDeclarationToDelete?.T_D_No}"?
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

export default TaxDeclarationPage;
