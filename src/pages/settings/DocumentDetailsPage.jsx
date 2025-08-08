import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDocumentDetails,
  deleteDocumentDetail,
} from '../../features/settings/documentDetailsSlice';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import DocumentDetailsForm from '../../components/forms/DocumentDetailsForm';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { fetchDocumentTypeCategories } from '../../features/settings/documentTypeCategoriesSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

const DocumentDetailsPage = () => {
  const dispatch = useDispatch();
  const { documentDetails, isLoading } = useSelector(
    (state) => state.documentDetails
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (Document Details Page  - MODULE ID = 41 )
  const { Add, Edit, Delete } = useModulePermissions(41);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const { documentTypeCategories } = useSelector(
    (state) => state.documentTypeCategories
  );

  const documentTypeCategoryOptions = documentTypeCategories.map((cat) => ({
    value: cat.ID,
    label: cat.Name,
  }));

  useEffect(() => {
    dispatch(fetchDocumentDetails());
    dispatch(fetchDocumentTypeCategories());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedDocument(null);
    setIsModalOpen(true);
  };

  const handleEdit = (document) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const handleDelete = (document) => {
    setDocumentToDelete(document);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (documentToDelete) {
      try {
        await dispatch(deleteDocumentDetail(documentToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setDocumentToDelete(null);
        toast.success('Document detail deleted successfully');
      } catch (error) {
        console.error('Failed to delete document detail:', error);
        toast.error('Failed to delete document detail. Please try again.');
        // Optionally show an error message to the user
      }
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
      header: 'Name',
      sortable: true,
    },
    {
      key: 'Prefix',
      header: 'Prefix',
    },
    {
      key: 'Suffix',
      header: 'Suffix',
    },
    {
      key: 'StartNumber',
      header: 'Start Number',
    },
    {
      key: 'CurrentNumber',
      header: 'Current Number',
    },
    // {
    //   key: 'DocumentTypeCategoryID',
    //   header: 'Category',
    //   sortable: true
    // },
  ];

  // const actions = [
  //   {
  //     icon: PencilIcon,
  //     title: 'Edit',
  //     onClick: handleEdit,
  //     className:
  //       'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
  //   },
  //   {
  //     icon: TrashIcon,
  //     title: 'Delete',
  //     onClick: handleDelete,
  //     className:
  //       'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
  //   },
  // ];
  const getActions = (document) => {
    const baseActions = [
      Edit && {
        icon: PencilIcon,
        title: 'Edit',
        onClick: handleEdit,
        className:
          'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      },
    ];

    // Only add delete action if ID is greater than 32
    if (document.ID > 32 && Delete) {
      baseActions.push({
        icon: TrashIcon,
        title: 'Delete',
        onClick: handleDelete,
        className:
          'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
      });
    }

    return baseActions;
  };

  return (
    <div className="container mx-auto ">
      <div className="flex justify-between sm:items-center max-sm:flex-col gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Document Details
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage document details and their numbering
          </p>
        </div>
        {Add && (
          <button onClick={handleAdd} className="btn btn-primary max-sm:w-full">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Document Detail
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={documentDetails}
        actions={getActions}
        loading={isLoading}
        emptyMessage="No document details found. Click 'Add Document Detail' to create one."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedDocument ? 'Edit Document Detail' : 'Add Document Detail'
        }
        size="lg"
      >
        <DocumentDetailsForm
          document={selectedDocument}
          documentList={documentDetails}
          onClose={() => setIsModalOpen(false)}
          documentTypeCategoryOptions={documentTypeCategoryOptions}
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
            Are you sure you want to delete the document detail for{' '}
            <span className="font-medium">{documentToDelete?.Name}</span>?
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(false)}
            className="btn btn-outline cursor-pointer"
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

export default DocumentDetailsPage;
