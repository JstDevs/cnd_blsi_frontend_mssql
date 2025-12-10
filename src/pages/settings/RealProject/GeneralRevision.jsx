import React, { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchGeneralRevisions,
  addGeneralRevision,
  updateGeneralRevision,
  deleteGeneralRevision,
} from '@/features/settings/generalRevisionSlice';
import Modal from '@/components/common/Modal';
import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import GeneralRevisionForm from '@/components/forms/GeneralRevisionForm';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

const GeneralRevision = () => {
  const dispatch = useDispatch();
  const { generalRevisions, isLoading } = useSelector(
    (state) => state.generalRevisions
  );
  // ---------------------USE MODULE PERMISSIONS------------------START ( General Revision Page  - MODULE ID = 51 )
  const { Add, Edit, Delete } = useModulePermissions(51);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRevision, setCurrentRevision] = useState(null);
  const [revisionToDelete, setRevisionToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchGeneralRevisions());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentRevision(null);
    setIsModalOpen(true);
  };

  const handleEdit = (revision) => {
    setCurrentRevision(revision);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (currentRevision) {
        await dispatch(
          updateGeneralRevision({ ...values, ID: currentRevision.ID })
        ).unwrap();
        toast.success('Revision updated successfully');
      } else {
        await dispatch(addGeneralRevision(values)).unwrap();
        toast.success('Revision added successfully');
      }
      dispatch(fetchGeneralRevisions());
    } catch (error) {
      console.error('Failed to save general revision:', error);
      toast.error('Failed to save general revision. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDelete = (revision) => {
    setRevisionToDelete(revision);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (revisionToDelete) {
        await dispatch(deleteGeneralRevision(revisionToDelete.ID)).unwrap();
        toast.success('Revision deleted successfully');
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to delete revision:', error);
      toast.error('Failed to delete revision. Please try again.');
    }
  };

  const columns = [
    {
      key: 'General_Revision_Date_Year',
      header: 'General Revision Date (Year)',
      sortable: true,
    },
    {
      key: 'GeneralRevisionCode',
      header: 'General Revision Code',
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
  // const columns = [
  //   { Header: "Revision Year", accessor: "revisionYear" },
  //   { Header: "Tax Declaration Code", accessor: "taxDeclarationCode" },
  //   {
  //     Header: "Actions",
  //     accessor: "actions",
  //     Cell: ({ row }) => (
  //       <div className="flex space-x-2">
  //         <Button size="sm" variant="outline" onClick={() => handleEdit(row.original)}>
  //           <Pencil className="w-4 h-4" />
  //         </Button>
  //         <Button
  //           size="sm"
  //           variant="destructive"
  //           onClick={() => handleDelete(row.original)}
  //         >
  //           <Trash2 className="w-4 h-4" />
  //         </Button>
  //       </div>
  //     ),
  //   },
  // ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <div>
            <h1>General Revisions</h1>
            <p>Manage General Revision Records</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Revision
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          actions={actions}
          data={generalRevisions}
          loading={isLoading}
          emptyMessage="No general revisions found. Click 'Add Revision' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          currentRevision ? 'Edit General Revision' : 'Add General Revision'
        }
        size="lg"
      >
        <GeneralRevisionForm
          initialData={currentRevision}
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
            Are you sure you want to delete the revision{' '}
            <strong>{revisionToDelete?.revisionYear}</strong>?
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
};

export default GeneralRevision;
