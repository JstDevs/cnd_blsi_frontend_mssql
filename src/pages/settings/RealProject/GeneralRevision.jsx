import React, { useEffect, useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGeneralRevisions,
  addGeneralRevision,
  updateGeneralRevision,
  deleteGeneralRevision,
} from "@/features/settings/generalRevisionSlice";
import Modal from "@/components/common/Modal";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/common/Button";
import GeneralRevisionForm from "@/components/forms/GeneralRevisionForm";

const GeneralRevision = () => {
  const dispatch = useDispatch();
  const { generalRevisions, isLoading } = useSelector((state) => state.generalRevisions);

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

  const handleSubmit = (values) => {
    if (currentRevision) {
      dispatch(updateGeneralRevision({ ...values, ID: currentRevision.ID }));
    } else {
      dispatch(addGeneralRevision(values));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (revision) => {
    setRevisionToDelete(revision);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (revisionToDelete) {
      dispatch(deleteGeneralRevision(revisionToDelete.ID));
      setIsDeleteModalOpen(false);
    }
  };

  const columns = [
    {
      key: 'General_Revision_Date_Year',
      header: 'General Revision Date (Year)',
      sortable: true
    },
    {
      key: 'GeneralRevisionCode',
      header: 'General Revision Code',
      sortable: true
    }
  ];
  

  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDelete,
      className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50'
    }
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
        <div className="flex justify-between items-center">
          <div>
            <h1>General Revisions</h1>
            <p>Manage General Revision Records</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Revision
          </button>
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
        title={currentRevision ? "Edit General Revision" : "Add General Revision"}
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
            Are you sure you want to delete the revision{" "}
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
          <button type="button" onClick={confirmDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default GeneralRevision;
