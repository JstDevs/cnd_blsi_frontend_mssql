import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ApprovalMatrixForm from './ApprovalMatrixForm';
import {
  fetchApprovalMatrix,
  addApprovalMatrix,
  updateApprovalMatrix,
  deleteApprovalMatrix,
} from '../../features/settings/approvalMatrixSlice';

function ApprovalMatrixPage() {
  const dispatch = useDispatch();
  const { approvalMatrix, isLoading, error } = useSelector(state => state.approvalMatrix);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMatrix, setCurrentMatrix] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [matrixToDelete, setMatrixToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchApprovalMatrix());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentMatrix(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setCurrentMatrix(row);
    setIsModalOpen(true);
  };

  const handleDelete = (row) => {
    setMatrixToDelete(row);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = async () => {
    if (matrixToDelete) {
      try {
        await dispatch(deleteApprovalMatrix(matrixToDelete.id)).unwrap();
        setIsDeleteModalOpen(false);
        setMatrixToDelete(null);
      } catch (error) {
        console.error('Failed to delete approval matrix:', error);
        // Optionally show an error message to the user
      }
    }
  };

  const handleSubmit = (values) => {
    if (currentMatrix) {
      dispatch(updateApprovalMatrix({ ...values, id: currentMatrix.id }));
    } else {
      dispatch(addApprovalMatrix(values));
    }
    setIsModalOpen(false);
  };

  const columns = [
    { key: 'documentType', header: 'Document Type', sortable: true },
    { key: 'sequenceLevel', header: 'Sequence Level', sortable: true },
    { key: 'approvalRule', header: 'Approval Rule', sortable: true },
    { key: 'approverType', header: 'Approver Type', sortable: true },
    { key: 'approver', header: 'Approver', sortable: true },
    { key: 'amountFrom', header: 'From', sortable: true },
    { key: 'amountTo', header: 'To', sortable: true },
  ];

  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDelete,
      className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Approval Matrix</h1>
            <p>Manage approval matrix for document types</p>
          </div>
          <button type="button" onClick={handleAdd} className="btn btn-primary flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Approval Matrix
          </button>
        </div>
      </div>
      <div className="mt-4">
        <DataTable columns={columns} data={approvalMatrix} actions={actions} loading={isLoading} />
        {error && <div className="text-error-600 mt-2">{error}</div>}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentMatrix ? 'Edit Approval Matrix' : 'Add Approval Matrix'}>
        <ApprovalMatrixForm initialData={currentMatrix} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="py-3">
          <p className="text-neutral-700">
            Are you sure you want to delete this approval matrix entry?
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

export default ApprovalMatrixPage; 