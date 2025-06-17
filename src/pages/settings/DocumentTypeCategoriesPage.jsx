import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import DocumentTypeCategoriesForm from '../../components/forms/DocumentTypeCategoriesForm';
import {
  fetchDocumentTypeCategories,
  addDocumentTypeCategory,
  updateDocumentTypeCategory,
  deleteDocumentTypeCategory
} from '../../features/settings/documentTypeCategoriesSlice';

function DocumentTypeCategoriesPage() {
  const dispatch = useDispatch();
  const { documentTypeCategories, isLoading } = useSelector(state => state.documentTypeCategories);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDocumentTypeCategory, setCurrentDocumentTypeCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentTypeCategoryToDelete, setDocumentTypeCategoryToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchDocumentTypeCategories());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentDocumentTypeCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (documentTypeCategory) => {
    setCurrentDocumentTypeCategory(documentTypeCategory);
    setIsModalOpen(true);
  };

  const handleDelete = (documentTypeCategory) => {
    setDocumentTypeCategoryToDelete(documentTypeCategory);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (documentTypeCategoryToDelete) {
      try {
        await dispatch(deleteDocumentTypeCategory(documentTypeCategoryToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setDocumentTypeCategoryToDelete(null);
      } catch (error) {
        console.error('Failed to delete document type category:', error);
      }
    }
  };

  const handleSubmit = (values) => {
    if (currentDocumentTypeCategory) {
      dispatch(updateDocumentTypeCategory({ ...values, ID: currentDocumentTypeCategory.ID }));
    } else {
      dispatch(addDocumentTypeCategory(values));
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'Name',
      header: 'Name',
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

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Document Type Categories</h1>
            <p>Manage Document Type Categories</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Document Type Category
          </button>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={documentTypeCategories}
          actions={actions}
          loading={isLoading}
          emptyMessage="No document type categories found. Click 'Add Document Type Category' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentDocumentTypeCategory ? "Edit Document Type Category" : "Add Document Type Category"}
      >
        <DocumentTypeCategoriesForm
          initialData={currentDocumentTypeCategory}
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
            Are you sure you want to delete the document type category "{documentTypeCategoryToDelete?.name}"?
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

export default DocumentTypeCategoriesPage;