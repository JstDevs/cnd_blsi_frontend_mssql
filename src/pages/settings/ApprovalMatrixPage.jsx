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
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function ApprovalMatrixPage() {
  const dispatch = useDispatch();
  const { approvalMatrix, isLoading, error } = useSelector(
    (state) => state.approvalMatrix
  );
  // ---------------------USE MODULE PERMISSIONS------------------START ( Approval Matrix  - MODULE ID = 17 )
  const { Add, Edit, Delete } = useModulePermissions(17);
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
    const mappedApprovers =
      row.Approvers?.map((a) => ({
        type: a.PositionorEmployee,
        value: a.PositionorEmployeeID,
        amountFrom: Number(a.AmountFrom),
        amountTo: Number(a.AmountTo),
      })) || [];

    const { Approvers, ...rest } = row;

    setCurrentMatrix({
      ...rest,
      approvers: mappedApprovers,
    });
    // setCurrentMatrix(row);
    setIsModalOpen(true);
  };

  const handleDelete = (row) => {
    setMatrixToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (matrixToDelete) {
      try {
        await dispatch(deleteApprovalMatrix(matrixToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setMatrixToDelete(null);
        toast.success('Approval matrix deleted successfully');
      } catch (error) {
        console.error('Failed to delete approval matrix:', error);
        toast.error('Failed to delete approval matrix. Please try again.');
        // Optionally show an error message to the user
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentMatrix) {
        await dispatch(
          updateApprovalMatrix({ ...values, ID: currentMatrix.ID })
        ).unwrap();
        toast.success('Approval matrix updated successfully');
      } else {
        await dispatch(addApprovalMatrix(values)).unwrap(); // <- Important: unwrap to catch errors
        toast.success('Approval matrix saved successfully');
      }
      dispatch(fetchApprovalMatrix());
      setIsModalOpen(false); // Only close modal on success
    } catch (err) {
      console.error('Failed to submit approval matrix:', err);
      toast.error('Failed to submit approval matrix. Please try again.');
      // Optionally display error inside the form or at modal level
    }
  };

  const columns = [
    { key: 'DocumentTypeName', header: 'Document Type', sortable: true },
    { key: 'SequenceLevel', header: 'Sequence Level', sortable: true },
    { key: 'AllorMajority', header: 'All or Majority', sortable: true },
    { key: 'NumberofApprover', header: 'No of Approvers', sortable: true },
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
            <h1>Approval Matrix</h1>
            <p>Manage approval matrix for document types</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Approval Matrix
            </button>
          )}
        </div>
      </div>
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={approvalMatrix}
          actions={actions}
          loading={isLoading}
        />
      </div>
      {error && <div className="text-error-600 mt-2">{error}</div>}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentMatrix ? 'Edit Approval Matrix' : 'Add Approval Matrix'}
      >
        <ApprovalMatrixForm
          initialData={currentMatrix}
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
