import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocumentDetails, deleteDocumentDetail } from '../../features/settings/documentDetailsSlice';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import DocumentDetailsForm from '../../components/forms/DocumentDetailsForm';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const DocumentDetailsPage = () => {
  const dispatch = useDispatch();
  const { documentDetails, isLoading } = useSelector((state) => state.documentDetails);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchDocumentDetails());
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
        await dispatch(deleteDocumentDetail(documentToDelete.id)).unwrap();
        setIsDeleteModalOpen(false);
        setDocumentToDelete(null);
      } catch (error) {
        console.error('Failed to delete document detail:', error);
        // Optionally show an error message to the user
      }
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      sortable: true
    },
    {
      key: 'code',
      header: 'Code',
      sortable: true
    },
    {
      key: 'prefix',
      header: 'Prefix'
    },
    {
      key: 'suffix',
      header: 'Suffix'
    },
    {
      key: 'startNumber',
      header: 'Start Number'
    },
    {
      key: 'currentNumber',
      header: 'Current Number'
    },
    {
      key: 'documentTypeCategory',
      header: 'Category',
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            value === 'Active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value}
        </span>
      )
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Document Details</h1>
          <p className="mt-1 text-sm text-gray-500">Manage document details and their numbering</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Document Detail
        </button>
      </div>

      <DataTable
        columns={columns}
        data={documentDetails}
        actions={actions}
        loading={isLoading}
        emptyMessage="No document details found. Click 'Add Document Detail' to create one."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDocument ? 'Edit Document Detail' : 'Add Document Detail'}
        size="lg"
      >
        <DocumentDetailsForm
          document={selectedDocument}
          onClose={() => setIsModalOpen(false)}
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
            Are you sure you want to delete the document detail for <span className="font-medium">{documentToDelete?.name}</span>?
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

export default DocumentDetailsPage; 